import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_API_URL from '../../constants/path'; // Adjust the import path as necessary
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.style.js';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [togglePasswordVisibility, setTogglePasswordVisibility] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            setError('');
            const response = await fetch(`${BASE_API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
                router.replace('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again. \n' + error.message);
        }
        setLoading(false);
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            {/* 상단 Welcome 텍스트 */}
            <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Text style={styles.title}>Welcome</Text>
            </View>

            {/* 로그인 폼 영역 */}
            <View style={{ flex: 1, justifyContent: 'flet-start', alignItems: 'center', paddingTop: 150 }}>
                <View style={{ width: '80%' }}>
                    {error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={() => setError('')}>
                                <Ionicons name="close" size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <TextInput
                        style={[styles.input, error && styles.errorInput, {marginBottom:20}]}
                        autoCapitalize="none"
                        value={email}
                        placeholder="Enter email"
                        placeholderTextColor="#929292ff"
                        onChangeText={setEmail}
                    />
                    <View>
                        <TextInput
                            style={[styles.input, error && styles.errorInput, { marginBottom: 50 }]}
                            value={password}
                            placeholder="Enter password"
                            placeholderTextColor="#929292ff"
                            secureTextEntry={togglePasswordVisibility}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setTogglePasswordVisibility(!togglePasswordVisibility)}
                            style={{ position: 'absolute', right: 15, top: 17 }}
                        >
                            <Ionicons
                                name={togglePasswordVisibility ? 'eye-off' : 'eye'}
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} disabled={loading} onPress={handleLogin}>
                        <Text style={styles.buttonText}>
                            {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>No account yet?</Text>
                        <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}