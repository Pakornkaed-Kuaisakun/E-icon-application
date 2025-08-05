// screens/FriendsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { io } from "socket.io-client";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import BASE_API_URL from '@/constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/assets/lib/auth';

const socket = io("http://YOUR_IP:3000");

export default function FriendsScreen() {

    const authentication = useAuth();
    const navigation = useNavigation();
    const router = useRoute();

    const [friends, setFriends] = useState({});
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(false);

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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            if (msg.receiverid === userID) {
                setFriends((prev) => ({
                    ...prev,
                    [msg.senderid]: {
                        lastText: msg.text,
                        unread: true,
                    },
                }));
            }
        });

        return () => socket.off("receive_message");
    }, []);

    useEffect(() => {
            if (authentication === false) {
                router.replace('/auth/sign-in');
            }
        }, [authentication, router]);
    
        if (authentication === null) {
            return <LoadingScreen />;
        }

    return (
        <FlatList
            data={Object.entries(friends)}
            keyExtractor={([id]) => id}
            renderItem={({ item }) => {
                const [id, info] = item;
                return (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Chat", { friendId: parseInt(id) });
                        setFriends((prev) => ({
                            ...prev,
                            [id]: { ...info, unread: false }
                        }));
                    }}>
                        <View style={{ padding: 10 }}>
                            <Text>Friend #{id}</Text>
                            <Text>{info.lastText}</Text>
                            {info.unread && <Text style={{ color: "red" }}>New</Text>}
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}
