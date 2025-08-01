import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';

export const SignOutButton = () => {
    const router = useRouter();
    const handleSignOut = async () => {
        try {
            // Clear user token and any other stored data
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');

            // Optionally, navigate to the sign-in screen or home screen
            router.replace('/auth/sign-in');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut} style={{ padding: 7, backgroundColor: '#5a6daa', borderRadius: 5 }}>
            <Text style={{ color: '#ffffffff', fontSize: 13, fontWeight: 'bold' }}>Sign Out</Text>
        </TouchableOpacity>
    );
}
