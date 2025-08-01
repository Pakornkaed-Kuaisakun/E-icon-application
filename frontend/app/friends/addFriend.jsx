import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/assets/lib/auth';
import { useRouter } from 'expo-router';
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import { FriendNavBar } from '../../components/FriendScreen/NavBar';
import axios from 'axios';
import BASE_API_URL from '../../constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AddFriendCard } from '@/components/FriendScreen/AddFriendCard';

export default function Friend() {
    const authentication = useAuth();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [userResult, setUserResult] = useState(null);
    const [message, setMessage] = useState('');
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [senderID, setSenderID] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const user = JSON.parse(stored);
                    setSenderID(user.userid);
                }
            } catch (error) {
                console.error('Error getting userInfo:', error);
            }
        };

        getUserInfo();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if ((searchTerm ?? '').trim().length > 0) {
                searchUser(searchTerm);
            } else {
                setUserResult(null);
                setMessage('');
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const searchUser = async (email) => {
        setSearching(true);
        setMessage('');
        try {
            const res = await axios.get(`${BASE_API_URL}/api/friends/search/${encodeURIComponent(email)}`);
            if (res.data?.user) {
                setUserResult(res.data.user);
                setMessage('');
            } else {
                setUserResult(null);
                setMessage('User not found');
            }
        } catch (error) {
            setUserResult(null);
            setMessage('User not found');
            // console.error(error);
        } finally {
            setSearching(false);
        }
    };

    const handleAddFriend = async () => {
        if (!userResult) return;

        setLoadingAdd(true);
        setMessage('');

        try {
            await axios.post(`${BASE_API_URL}/api/friends/add`, {
                senderID,
                receiverEmail: userResult.email,
            });

            setMessage('Friend request sent!');
            router.push('friends/addFriend')
        } catch (error) {
            setMessage('Failed to send friend request.');
            console.error(error);
        } finally {
            setLoadingAdd(false);
        }
    };

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
            <TopNavBarGlobal style={{ top: 0, left: 0 }} pageName={'Friends'} />
            <View style={{ flex: 1 }}>
                <FriendNavBar />

                <View style={{ padding: 20 }}>
                    <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={false}>
                        <View style={{ position: 'relative', marginBottom: 20 }}>
                            <TextInput
                                style={{
                                    borderColor: '#9A8478',
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    width: '100%',
                                    paddingHorizontal: 20,
                                    paddingVertical: 15,
                                    paddingRight: 40,
                                }}
                                autoCapitalize="none"
                                placeholder="Search Email"
                                placeholderTextColor="#9A8478"
                                value={searchTerm}
                                onChangeText={(text) => setSearchTerm(text ?? '')}
                            />
                            {searchTerm.length === 0 ? (
                                <Ionicons
                                    name="search-outline"
                                    size={20}
                                    style={{ position: 'absolute', right: 15, top: 15, color: '#9A8478' }}
                                />
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setSearchTerm('')}
                                    style={{ position: 'absolute', right: 15, top: 15 }}
                                >
                                    <Ionicons name="close-circle" size={20} color="#9A8478" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {searching && <ActivityIndicator size="small" color="#333" />}

                        {userResult && userResult.userid !== senderID && (
                            <AddFriendCard senderID={senderID} receiver={userResult} onAddFriend={handleAddFriend} loading={loadingAdd} />
                        )}

                        {!userResult && message ? (
                            <Text style={{ color: 'gray', textAlign: 'center', fontSize: 16 }}>{message}</Text>
                        ) : null}
                    </KeyboardAwareScrollView>
                </View>
            </View>
            <BottomNavBar style={{ bottom: 0, left: 0 }} />
        </View>
    );
}
