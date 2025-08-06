// screens/ChatScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";
import { io } from "socket.io-client";
// import { useRoute } from "@react-navigation/native";
import { useAuth } from '@/assets/lib/auth';
import BASE_API_URL from '@/constants/path';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from '@/components/LoadingScreen';
import formatDate from "../../assets/lib/formatDate";
import axios from 'axios';

export default function ChatScreen() {
    const authentication = useAuth();
    const router = useRouter();
    const navigation = useNavigation();
    const socket = io(BASE_API_URL);


    const { friendId } = useLocalSearchParams();

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [inputFocus, setInputFocus] = useState(false);

    const flatListRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const user = JSON.parse(stored);
                    setUserID(user.userid);
                }
            } catch (error) {
                console.error('Error getting userInfo:', error);
                setMessage('Failed to load user info');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        socket.on('receive_message', (msg) => {
            console.log("Received message:", msg);
            if (
                msg &&
                ((msg.senderid === userID && msg.receiverid === friendId) ||
                    (msg.senderid === friendId && msg.receiverid === userID))
            ) {
                setChat((prev) => [...prev, msg]);
            }
        });

        return () => socket.off('receive_message');
    }, [userID, friendId]);


    const sendMessage = () => {
        // console.log(message);
        if (message.length > 0) {
            const msg = {
                senderID: userID,
                receiverID: friendId,
                message: message,
            };
            // console.log(JSON.stringify(msg));
            socket.emit("send_message", JSON.stringify(msg));
            setMessage("");
        }
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://e-icon-application-1.onrender.com/api/chat/history?senderID=${userID}&receiverID=${friendId}`);
                setHistory(response.data.result);
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userID && friendId) {
            fetchChatHistory();
        }
    }, [userID, friendId]);

    // console.log(history);

    useEffect(() => {
        if (authentication === false) {
            router.replace('/auth/sign-in');
        }
    }, [authentication, router]);

    if (authentication === null) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('friends/friend')}>
                <Text>Back</Text>
            </TouchableOpacity>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 1 }}>
                        {/* Your main chat content here if any */}
                        <FlatList
                            ref={flatListRef}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            data={[...chat, ...history]}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.messageBubble,
                                        item.senderid === userID ? styles.right : styles.left,
                                    ]}
                                >
                                    {/* <Text>{item.id}</Text> */}
                                    <Text style={styles.message}>{item.message}</Text>
                                    <Text style={styles.time}>{formatDate(item.created_at)}</Text>
                                </View>
                            )}
                        />
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Message..."
                                multiline
                                onFocus={() => setInputFocus(true)}
                                onBlur={() => setInputFocus(false)}
                            />
                            <TouchableOpacity onPress={sendMessage}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'blue' }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    messageBubble: {
        maxWidth: "70%",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    left: {
        backgroundColor: "#eee",
        alignSelf: "flex-start",
    },
    right: {
        backgroundColor: "#a3d8f4",
        alignSelf: "flex-end",
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100
    },
    message: {
        fontSize: 17
    },
    time: {
        fontSize: 10,
        marginTop: 5,
        color: '#999'
    },
});
