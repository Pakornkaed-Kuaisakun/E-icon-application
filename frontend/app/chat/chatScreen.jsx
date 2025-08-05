// screens/ChatScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { io } from "socket.io-client";
// import { useRoute } from "@react-navigation/native";
import { useAuth } from '@/assets/lib/auth';
import BASE_API_URL from '@/constants/path';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from '@/components/LoadingScreen';
import formatDate from "../../assets/lib/formatDate";
import axios from 'axios';

const socket = io(BASE_API_URL);

export default function ChatScreen() {
    const authentication = useAuth();
    const router = useRouter();
    const navigation = useNavigation();


    const { friendId } = useLocalSearchParams();

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

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

    useEffect(() => {
        if (!socket || !userID || !friendId) return;

        const handleReceiveMessage = (msg) => {
            if (
                (msg.senderid === userID && msg.receiverid === friendId) ||
                (msg.senderid === friendId && msg.receiverid === userID)
            ) {
                setChat((prev) => [...prev, msg]);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => socket.off("receive_message", handleReceiveMessage);
    }, [socket, userID, friendId]);



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
            <FlatList
                data={chat}
                keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageBubble,
                            item.senderid === userID ? styles.right : styles.left,
                        ]}
                    >
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
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    message: {
        fontSize: 17
    },
    time: {
        fontSize: 10,
        marginTop: 5,
        color: '#999'
    }
});
