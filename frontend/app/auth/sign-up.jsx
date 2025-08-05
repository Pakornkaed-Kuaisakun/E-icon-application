import { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.style.js';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BASE_API_URL from '../../constants/path';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [togglePasswordVisibility, setTogglePasswordVisibility] = useState(true);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleRegistry = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const signupRes = await fetch(`${BASE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    emailAddress,
                    password,
                    confirmPassword
                })
            });

            const signupData = await signupRes.json();

            if (!signupRes.ok) {
                setError(signupData.message || 'Signup failed');
                setLoading(false);
                return;
            }

            setSuccess('Registration successful! Logging you in...');
            // Automatically login
            const loginRes = await fetch(`${BASE_API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, password })
            });

            const loginData = await loginRes.json();

            if (!loginRes.ok) {
                setError(loginData.message || 'Login failed');
                setLoading(false);
                return;
            }

            // Save token and user
            await AsyncStorage.setItem('userToken', loginData.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(loginData.user));

            router.replace('/');
        } catch (error) {
            setError('An error occurred. Please try again.\n' + error.message);
        }

        setLoading(false);
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={{ width: '80%', marginTop: -40 }}>
                <Text style={[styles.title, { marginBottom: 100 }]}>
                    Create Account
                </Text>

                {error ? (
                    <View style={[styles.errorBox, { marginBottom: 20 }]}>
                        <Ionicons
                            name="alert-circle"
                            size={20}
                            color={COLORS.expense}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons
                                name="close"
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}

                {success ? (
                    <View style={[styles.successBox, { marginBottom: 20 }]}>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Text style={styles.successText}>{success}</Text>
                        <TouchableOpacity onPress={() => setSuccess('')}>
                            <Ionicons
                                name="close"
                                size={20}
                                color={COLORS.text}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[
                        styles.input,
                        error && styles.errorInput,
                        { marginBottom: 20 }
                    ]}
                    autoCapitalize="none"
                    value={username}
                    placeholder="Enter Username"
                    placeholderTextColor="#929292ff"
                    onChangeText={setUsername}
                />

                <TextInput
                    style={[
                        styles.input,
                        error && styles.errorInput,
                        { marginBottom: 20 }
                    ]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#929292ff"
                    onChangeText={setEmailAddress}
                />

                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={password}
                        placeholder="Enter password"
                        placeholderTextColor="#929292ff"
                        secureTextEntry={togglePasswordVisibility}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            setTogglePasswordVisibility(!togglePasswordVisibility)
                        }
                        style={{ position: 'absolute', right: 15, top: 17 }}
                    >
                        <Ionicons
                            name={togglePasswordVisibility ? 'eye-off' : 'eye'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={confirmPassword}
                        placeholder="Enter confirm password"
                        placeholderTextColor="#929292ff"
                        secureTextEntry={confirmPasswordVisibility}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            setConfirmPasswordVisibility(!confirmPasswordVisibility)
                        }
                        style={{ position: 'absolute', right: 15, top: 17 }}
                    >
                        <Ionicons
                            name={confirmPasswordVisibility ? 'eye-off' : 'eye'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, { marginBottom: 40 }]}
                    disabled={loading}
                    onPress={handleRegistry}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
