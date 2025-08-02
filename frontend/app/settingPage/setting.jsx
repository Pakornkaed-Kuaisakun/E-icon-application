import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '@/assets/lib/auth';
import LoadingScreen from '@/components/LoadingScreen';
import axios from 'axios';
import BASE_API_URL from '@/constants/path';
import SettingHeader from '../../components/SettingScreen/SettingHeader';

export default function SettingsScreen() {
    const authentication = useAuth();
    const router = useRouter();
    const navigate = useNavigation();

    const [appInfo, setAppInfo] = useState(null);

    const getAppInfo = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/api/app/appInfo`);
            // console.log(res.data.appInfo.version);
            if(res) {
                setAppInfo(res.data.appInfo);
            }
        } catch (error) {
            setAppInfo(null);
        }
    }

    useEffect(() => {
        if(!appInfo) {
            getAppInfo();
        }
    }, [appInfo]);



    useEffect(() => {
            if (authentication === false) {
                router.replace('/auth/sign-in');
            }
        }, [authentication, router]);
    
        if (authentication === null) {
            return <LoadingScreen />;
        }

    return (
        <View style={styles.container}>
            {/* Header */}
            <SettingHeader name='Setting' route='index' />

            {/* Options */}
            <TouchableOpacity style={styles.optionRow} onPress={() => navigate.navigate('settingPage/profile')}>
                <Text style={styles.optionText}>Account</Text>
                <Ionicons name="chevron-forward" size={20} color="#808080" />
            </TouchableOpacity>

            {/* <View style={styles.divider} /> */}

            <TouchableOpacity style={styles.optionRow} onPress={() => navigate.navigate('settingPage/termOfService')}>
                <Text style={styles.optionText}>Terms of Use and Policies</Text>
                <Ionicons name="chevron-forward" size={20} color="#808080" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={() => navigate.navigate('settingPage/privacyPolicy')}>
                <Text style={styles.optionText}>Privacy policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#808080" />
            </TouchableOpacity>

            <View style={styles.optionRow}>
                <Text style={styles.optionText}>Version information</Text>
                <Text style={styles.versionText}>{appInfo?.version}</Text>
            </View>
        </View>
    );
}

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
    headerTitle: {
        color: COLORS.text,
        fontSize: 27,
        fontWeight: '600',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 23,
        borderBottomColor: '#eee',
        borderBottomWidth: 1.5,
    },
    optionText: {
        color: COLORS.text,
        fontSize: 18,
    },
    versionText: {
        fontWeight: 'bold',
        color: '#808080',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
});
