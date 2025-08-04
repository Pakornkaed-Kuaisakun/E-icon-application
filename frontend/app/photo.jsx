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
import PhotoScreen from '../components/PhotoScreen/PhotoScreen';
import { loadavg } from 'os';

export default function Photo() {
    const authentication = useAuth();
    const router = useRouter();

    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    // const [userResult, setUserResult] = useState([]);
    const [image, setImage] = useState([]);

    const fetchImage = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_API_URL}/api/photo/getImage/${userID}`);
            // console.log("Response from server:", response.data.images);
            setImage(response.data.images);
        } catch (error) {
            console.error("Error fetching image:", error);
            setMessage("Failed to fetch image");
        } finally {
            setLoading(false);
        }
    };



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
        if (userID) {
            fetchImage();
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
            <TopNavBarGlobal pageName="Photo" />
            <View style={{ flex: 1, alignItems: 'center' }}>
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <PhotoScreen imageURLs={image} />
                )}
            </View>
            <BottomNavBar />
        </View>
    );
}