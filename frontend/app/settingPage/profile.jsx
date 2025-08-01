import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/assets/lib/auth';
import LoadingScreen from '@/components/LoadingScreen';
import axios from 'axios';
import BASE_API_URL from '@/constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const authentication = useAuth();
    const router = useRouter();
    const navigation = useNavigation();

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword'); // ต้องมีหน้า ChangePassword ด้วย
    };


    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null);

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

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/api/dashboard/${userID}`);
            if(res) {
                setUserInfo(res.data[0]);
            }
        } catch (error) {
            setUserInfo(null);
        }
    }

    useEffect(() => {
        if(userID) {
            fetchUserData();
        }
    }, [userID]);

    // console.log(userInfo);

    useEffect(() => {
        if (authentication === false) {
            router.replace('/auth/sign-in');
        }
    }, [authentication, router]);

    if (authentication === null || !userInfo) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('settingPage/setting')}>
                    <Ionicons name="chevron-back" size={24} color="#6b6b94" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                    source={{ uri: `https://avatar.iran.liara.run/username?username=${userInfo.username}` }}
                    style={styles.avatar}
                />

                <View style={styles.optionRow}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Ionicons name="person-outline" size={22} style={{ marginRight: 10 }}></Ionicons>
                        <Text style={styles.label}>Username</Text>
                    </View>
                    <Text style={styles.value}>{userInfo.username}</Text>
                </View>

                <View style={styles.optionRow}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Ionicons name="mail-outline" size={22} style={{ marginRight: 10 }}></Ionicons>
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <Text style={styles.value}>{userInfo.email}</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('settingPage/changePassword')} style={styles.button}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#aaa',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555',
    },
    value: {
        fontSize: 18,
        color: 'gray',
    },
    button: {
        marginTop: 40,
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 27,
        fontWeight: '600',
    },
    optionRow: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 23,
        borderBottomColor: '#eee',
        borderBottomWidth: 1.5,
    },
});
