import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                setAuthenticated(!!token);
            } catch (e) {
                setAuthenticated(false);
                console.error('Error checking authentication:', e);
            }
        };
        checkAuth();
    }, []);

    return authenticated;
}
