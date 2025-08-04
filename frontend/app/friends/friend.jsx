import { View, Text, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/assets/lib/auth';
import { useRouter } from 'expo-router';
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import { FriendNavBar } from '../../components/FriendScreen/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_API_URL from '../../constants/path';
import MainMainFriendCard from '@/components/FriendScreen/MainFriendCard';

export default function Friend() {
    const authentication = useAuth();
    const router = useRouter();

    const [senderID, setSenderID] = useState(null);
    const [userResult, setUserResult] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const user = JSON.parse(stored);
                    setSenderID(user.userid);
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

    const fetchFriendData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/friends/getFriendData/${senderID}`);
            if (res.data.user.length > 0) {
                setUserResult(res.data.user);
            } else {
                setUserResult([]);
                setMessage('You have no friends');
            }
        } catch (error) {
            // console.error(error);
            setUserResult([]);
            setMessage('You have no friends');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (senderID) {
            fetchFriendData();
        }
    }, [senderID]);

    useEffect(() => {
        if (authentication === false) {
            router.replace('/auth/sign-in');
        }
    }, [authentication, router]);

    if (authentication === null) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffffff' }}>
            <TopNavBarGlobal pageName="Friends" />
            <View style={{ flex: 1 }}>
                <FriendNavBar />
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {userResult && userResult.length > 0 ? (
                        userResult.map((receiver) => (
                            <MainMainFriendCard
                                key={receiver.userid}
                                userid={receiver}
                            />
                            // <Text key={receiver.username}>{receiver.username}</Text>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 18 }}>
                            {message || 'Loading...'}
                        </Text>
                    )}
                </ScrollView>
            </View>
            <BottomNavBar />
        </View>
    );
}
