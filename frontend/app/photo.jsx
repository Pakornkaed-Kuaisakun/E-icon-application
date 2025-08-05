import { View, Text, ScrollView, Dimensions, Animated, PanResponder } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
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

    const translateX = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;

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

    // ✅ Slide Gesture Handler
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx < 0) {
                    translateX.setValue(gesture.dx);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -50) {
                    // Swipe Left → Go to /rank
                    Animated.timing(translateX, {
                        toValue: -screenWidth,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        translateX.setValue(0); // reset for next time
                        router.push('/rank');
                    });
                } else if (gesture.dx > 50) {
                    // Swipe Right → Go to /index
                    Animated.timing(translateX, {
                        toValue: screenWidth,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        translateX.setValue(0);
                        router.push('/index');
                    });
                } else {
                    // Cancelled swipe → spring back
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


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
            <Animated.View {...panResponder.panHandlers}
                style={[{ flex: 1, backgroundColor: '#ffffff', transform: [{ translateX }] }]}>
                <TopNavBarGlobal pageName="Photo" />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {loading ? (
                        <LoadingScreen />
                    ) : (
                        <PhotoScreen imageURLs={image} />
                    )}
                </View>
                <BottomNavBar />
            </Animated.View>
        </View>
    );
}