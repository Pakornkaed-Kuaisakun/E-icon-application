import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';

export const SignOutButton = ({ style }) => {
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
        <TouchableOpacity onPress={handleSignOut} style={style}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Sign Out</Text>
        </TouchableOpacity>
    );
}
