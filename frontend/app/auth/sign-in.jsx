import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_API_URL from '../../constants/path'; // Adjust the import path as necessary
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.style.js';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'

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
            // if (!email || !password) {
            //     setError('Please enter both email and password');
            // }
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if (!emailRegex.test(email)) {
            //     setError("Please enter a valid email.");
            // }
            setError(''); // Clear previous errors
            const response = await fetch(`${BASE_API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                //console.log('Login successful:', data);
                // navigation.navigate("Home") or store token

                await AsyncStorage.setItem('userToken', data.token); // Store the token
                // Optionally, you can store user info
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));

                router.replace('/'); // Redirect to the home page
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again. \n' + error.message);
        }
        setLoading(false);
    };

    return (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} enableOnAndroid={true} enableAutomaticScroll={true}>
            <View style={{ width: '80%' }}>
                <Text style={styles.title}>Welcome</Text>
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
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={email}
                    placeholder="Enter email"
                    placeholderTextColor="#9A8478"
                    onChangeText={setEmail}
                />
                <View>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={password}
                        placeholder="Enter password"
                        placeholderTextColor="#9A8478"
                        secureTextEntry={togglePasswordVisibility}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setTogglePasswordVisibility(!togglePasswordVisibility)} style={{ position: 'absolute', right: 15, top: 17 }}>
                        <Ionicons name={togglePasswordVisibility ? "eye-off" : "eye"} size={20} color="gray" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} disabled={loading} onPress={handleLogin}>
                    <Text style={styles.buttonText}>
                        {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Sign In'}
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don&apos;t have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
                        <Text style={styles.linkText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
