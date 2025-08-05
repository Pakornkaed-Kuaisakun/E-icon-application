import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from '@/assets/lib/chat';
import { COLORS } from '@/constants/colors';
import BASE_API_URL from '@/constants/path';
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import LoadingScreen from '@/components/LoadingScreen';

export default function ChatRoom() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const flatListRef = useRef(null);
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [receiverUser, setReceiverUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const receiverId = params.receiverId;
    const receiverName = params.receiverName;

    useEffect(() => {
        initializeChat();
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, []);

    const initializeChat = async () => {
        try {
            // Get current user info
            const userInfo = await AsyncStorage.getItem('userInfo');
            const user = JSON.parse(userInfo);
            setCurrentUser(user);

            // Set receiver user info
            setReceiverUser({
                userid: receiverId,
                username: receiverName
            });

            // Connect to chat service
            chatService.connect(user.userid);

            // Load conversation history
            await loadConversation();

            // Set up message listeners
            chatService.on('receive_message', handleReceiveMessage);
            chatService.on('message_sent', handleMessageSent);
            chatService.on('message_error', handleMessageError);
            chatService.on('user_typing', handleUserTyping);

            setLoading(false);
        } catch (error) {
            console.error('Error initializing chat:', error);
            Alert.alert('Error', 'Failed to initialize chat');
            setLoading(false);
        }
    };

    const loadConversation = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${BASE_API_URL}/api/chat/conversation/${receiverId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const handleReceiveMessage = (message) => {
        if (message.senderId === receiverId || message.receiverId === receiverId) {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        }
    };

    const handleMessageSent = (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        setSending(false);
    };

    const handleMessageError = (error) => {
        Alert.alert('Error', 'Failed to send message');
        setSending(false);
    };

    const handleUserTyping = (data) => {
        if (data.userId === receiverId) {
            setIsTyping(data.isTyping);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            chatService.sendMessage(receiverId, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
            setSending(false);
        }
    };

    const handleTyping = (text) => {
        setNewMessage(text);
        
        // Send typing indicator
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        chatService.sendTypingIndicator(receiverId, true);

        const timeout = setTimeout(() => {
            chatService.sendTypingIndicator(receiverId, false);
        }, 1000);

        setTypingTimeout(timeout);
    };

    const scrollToBottom = () => {
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.senderid === currentUser?.userid;
        
        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                        {item.message}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
                    ]}>
                        {new Date(item.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <TopNavBarGlobal pageName={receiverName} />
            
            <KeyboardAvoidingView 
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                />

                {isTyping && (
                    <View style={styles.typingIndicator}>
                        <Text style={styles.typingText}>{receiverName} is typing...</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={handleTyping}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!newMessage.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    chatContainer: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        marginVertical: 4,
    },
    ownMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    ownBubble: {
        backgroundColor: COLORS.income,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    ownMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    messageTime: {
        fontSize: 12,
        marginTop: 4,
    },
    ownMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    otherMessageTime: {
        color: '#999',
        textAlign: 'left',
    },
    typingIndicator: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    typingText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.income,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
}); 