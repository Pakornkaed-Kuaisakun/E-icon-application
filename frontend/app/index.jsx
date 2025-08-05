import { View, Text, PanResponder, Animated, Dimensions, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
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
    const [getReward, setGetReward] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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
            const res = await axios.post(`${BASE_API_URL}/api/dashboard/growTree`, {
                userid: userInfo.userid,
                currentTreeLevel: userInfo.treeLevel,
                currentTreePoint: userInfo.treePoint,
                currentGrowingPoint: userInfo.growingPoint,
            });
            // console.log(res.data.reward);
            setGetReward(res.data.reward);
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
                    {getReward ? (
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{
                            marginTop: 20,
                            padding: 15,
                            paddingHorizontal: 23,
                            backgroundColor: '#0088FF',
                            borderRadius: 30,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text style={{ color: 'white' }}>Reward</Text>
                        </TouchableOpacity>
                    ) : (
                        <WaterButton disabled={userInfo.growingPoint === 0 || loading} onPress={growTree} />
                    )}
                    <Text style={{ marginTop: 15 }}>
                        Point you held: {userInfo.growingPoint} point
                    </Text>
                </View>
                <BottomNavBar />
            </Animated.View>
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Congratulation!</Text>
                        <Text style={styles.text}>You have successfully grown a tree!</Text>
                        <Image
                                source={require('../assets/images/plantTreeImg.png')}
                                style={styles.image}
                                resizeMode="cover"
                        />
                        <Text style={styles.text}>The larch tree you have grown</Text>
                        <Text style={styles.text}>will be plant in Turkey.</Text>
                        <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(false); setGetReward(false); }}>
                            <Text style={styles.buttonText}>Checked</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: Dimensions.get('screen').width * 0.8,
        backgroundColor: "#DFEAFF",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        position: 'absolute'
    },
    image: {
        width: 270,
        height: 200,
        marginBottom: 20,
        borderRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#5A6DAA",
    },
    message: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        color: "#5A6DAA",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
        color: "#5A6DAA",
        marginTop: 3
    },
    button: {
        backgroundColor: "#5A6DAA",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 50,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});