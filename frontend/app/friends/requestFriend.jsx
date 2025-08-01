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
import RequestFriendCard from '@/components/FriendScreen/RequestFriendCard';

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

    const refreshRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/friends/getFriendRequest/${senderID}`);
            if (res.data.user.length > 0) {
                setUserResult(res.data.user);
            } else {
                setUserResult([]);
                setMessage('No friend requests');
            }
        } catch (error) {
            // console.error(error);
            setUserResult([]);
            setMessage('No friend requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requesterID) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.post(`${BASE_API_URL}/api/friends/requestAccept`, {
                receiverID: senderID,
                requesterID
            });
            refreshRequests();
        } catch (error) {
            setMessage('Failed to accept friend request');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (requesterID) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.post(`${BASE_API_URL}/api/friends/requestReject`, {
                receiverID: senderID,
                requesterID
            });
            refreshRequests();
        } catch (error) {
            setMessage('Failed to reject friend request');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (senderID) {
            refreshRequests();
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
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <TopNavBarGlobal pageName="Friends" />
            <View style={{ flex: 1 }}>
                <FriendNavBar />
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {userResult.length > 0 ? (
                        userResult.map((receiver) => (
                            <RequestFriendCard
                                key={receiver.userid}
                                receiver={receiver}
                                onAccept={() => handleAccept(receiver.userid)}
                                onReject={() => handleReject(receiver.userid)}
                            />
                            // <Text key={receiver}>{receiver.userid}</Text>
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
