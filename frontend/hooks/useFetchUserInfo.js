import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_API_URL from '@/constants/path';

export const UseFetchUserInfo = (isAuthenticated) => {
    const [userInfo, setUserInfo] = useState(null);
    const userIdRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    userIdRef.current = parsed.userid;
                }
            } catch (e) {
                console.error('Error reading AsyncStorage:', e);
            }
        };

        if (isAuthenticated) init();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userIdRef.current) return;
            try {
                const res = await axios.get(`${BASE_API_URL}/api/dashboard/${userIdRef.current}`);
                if (res.status === 200) {
                    setUserInfo(res.data[0]);
                }
            } catch (e) {
                console.error('Error fetching user info:', e);
                setUserInfo(null);
            }
        };

        if (isAuthenticated) {
            fetchUserInfo();
            const interval = setInterval(fetchUserInfo, 3000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    return userInfo;
};
