import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_API_URL from '@/constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SettingHeader from '../../components/SettingScreen/SettingHeader';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setSuccess('');
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setSuccess('');
            setError('New password not match.');
            return;
        }

        try {
            const stored = await AsyncStorage.getItem('userInfo');
            const user = stored ? JSON.parse(stored) : null;

            if (!user) {
                setSuccess('');
                setError('Not Authentication.');
                return;
            }

            const res = await axios.post(`${BASE_API_URL}/api/dashboard/changePassword`, {
                userid: user.userid,
                currentPassword,
                newPassword,
            });

            if (res.data.success) {
                setError('');
                setSuccess('Password change successfully');
                setTimeout(() => {
                    navigation.navigate('settingPage/profile');
                }, 1000);
            } else {
                setSuccess('');
                setError(res.data.message);
            }
        } catch (err) {
            console.error(err);
            setSuccess('');
            setError('Something went wrong, please try again later: ', err);
        }
    };

    return (
        <View style={styles.container}>
            <SettingHeader name='Change Password' route='settingPage/profile' />

            <KeyboardAwareScrollView contentContainerStyle={{ marginTop: 30 }} enableOnAndroid={true} enableAutomaticScroll={true}>
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                {success ? (
                    <View style={styles.successBox}>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.successText}>{success}</Text>
                        <TouchableOpacity onPress={() => setSuccess('')}>
                            <Ionicons name="close" size={20} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Current Password"
                    placeholderTextColor='#B9BBB6'
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />

                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="New Password"
                    placeholderTextColor='#B9BBB6'
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Confirm New Password"
                    placeholderTextColor='#B9BBB6'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
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
    // Error styles
    errorBox: {
        backgroundColor: "#FFE5E5",
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.expense,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    errorText: {
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },

    // Success styles
    successBox: {
        backgroundColor: "#b5f5c2ff",
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.textLight,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    successText: {
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },
});
