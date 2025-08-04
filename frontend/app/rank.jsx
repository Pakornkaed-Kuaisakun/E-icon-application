import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/assets/lib/auth';
import { useRouter } from 'expo-router'
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import BASE_API_URL from '../constants/path';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RankUserCard from '@/components/RankScreen/RankUserCard';

export default function Rank() {
    const authentication = useAuth();
    const router = useRouter();

    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [userResult, setUserResult] = useState([]);

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

    const fetchRankData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/rank/globalRank`);
            if (res.data.global_rank.length > 0) {
                setUserResult(res.data.global_rank);
            } else {
                setUserResult([]);
                setMessage('No User in Top 10 Ranked');
            }
        } catch (error) {
            // console.error(error);
            setUserResult([]);
            setMessage('No User in Top 10 Ranked');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userID) {
            fetchRankData();
        }
    }, [userID]);

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
            <TopNavBarGlobal pageName="Rank" />
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 10 }}>
                    {userResult && userResult.length > 0 ? (
                        userResult.map((userid, index) => (
                            <RankUserCard key={userid.userid || index} userid={userid} index={index} />
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