import { View, Text, PanResponder, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/assets/lib/auth';
import { useNavigation, useRouter } from 'expo-router';
import { TopNavBarIndex } from '@/components/Navigation/TopNavBarIndex';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import { UserTreeInfo } from '@/components/HomeScreen/UserTreeInfo';
import { WaterButton } from '@/components/HomeScreen/WaterButton';
import axios from 'axios';
import BASE_API_URL from '@/constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const authentication = useAuth();
    const router = useRouter();
    const navigation = useNavigation();

    const translateX = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUserInfo = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem('userInfo');
            const storedParsed = stored ? JSON.parse(stored) : null;
            if (!storedParsed?.userid) return;

            const res = await axios.get(`${BASE_API_URL}/api/dashboard/${storedParsed.userid}`);
            if (res.status === 200) {
                setUserInfo(res.data[0]);
            }
        } catch (e) {
            console.error('Error fetching user info:', e);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUserInfo();
        }, [fetchUserInfo])
    );

    const growTree = async () => {
        if (!userInfo?.userid) return;
        setLoading(true);
        try {
            await axios.post(`${BASE_API_URL}/api/dashboard/growTree`, {
                userid: userInfo.userid,
                currentTreeLevel: userInfo.treeLevel,
                currentTreePoint: userInfo.treePoint,
                currentGrowingPoint: userInfo.growingPoint,
            });
            fetchUserInfo();
        } catch (error) {
            console.error('Grow Tree Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authentication === false) {
            router.replace('/auth/sign-in');
        }
    }, [authentication, router]);

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
                    // Animate slide left
                    Animated.timing(translateX, {
                        toValue: -screenWidth,
                        duration: 270,
                        useNativeDriver: true,
                    }).start(() => {
                        navigation.navigate('task/dailyTask');
                    });
                } else {
                    // Animate back to original position
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            }
        })
    ).current;

    if (authentication === null || !userInfo) {
        return <LoadingScreen />;
    }

    return (
        <View
            style={{ flex: 1, backgroundColor: '#ffffffff' }}
        >
            <Animated.View {...panResponder.panHandlers}
                style={[{ flex: 1, backgroundColor: '#ffffff', transform: [{ translateX }] }]}>
                <TopNavBarIndex username={userInfo.username} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <UserTreeInfo
                        level={userInfo.treeLevel}
                        type={userInfo.treeType}
                        points={userInfo.treePoint}
                    />
                    <WaterButton
                        disabled={userInfo.growingPoint === 0 || loading}
                        onPress={growTree}
                    />
                    <Text style={{ marginTop: 15 }}>
                        Point you held: {userInfo.growingPoint} point
                    </Text>
                </View>
                <BottomNavBar />
            </Animated.View>
        </View>
    );
}
