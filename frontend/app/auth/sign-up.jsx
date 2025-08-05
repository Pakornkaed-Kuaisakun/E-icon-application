import { useState, useEffect } from 'react'
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.style.js'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BASE_API_URL from '../../constants/path'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
        try {

            setError(''); // Clear previous errors
            setSuccess(''); // Clear previous success messages
            const response = await fetch(`${BASE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, emailAddress, password, confirmPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Registration successful! Please log in.');

                setError(''); // Clear previous errors
                const response = await fetch(`${BASE_API_URL}/api/auth/signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailAddress, password: password }),
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
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again. \n' + error.message);
        }
        setLoading(false);
    };


    return (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} enableOnAndroid={true} enableAutomaticScroll={true}>
            <View style={{ width: '80%' }}>
                <Text style={styles.title}>Create Account</Text>
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
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={username}
                    placeholder="Enter Username"
                    placeholderTextColor="#9A8478"
                    onChangeText={(username) => setUsername(username)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9A8478"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <View>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={password}
                        placeholder="Enter password"
                        placeholderTextColor="#9A8478"
                        secureTextEntry={togglePasswordVisibility}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <TouchableOpacity onPress={() => setTogglePasswordVisibility(!togglePasswordVisibility)} style={{ position: 'absolute', right: 15, top: 17 }}>
                        <Ionicons name={togglePasswordVisibility ? "eye-off" : "eye"} size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                <View>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={confirmPassword}
                        placeholder="Enter confirm password"
                        placeholderTextColor="#9A8478"
                        secureTextEntry={confirmPasswordVisibility}
                        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    />
                    <TouchableOpacity onPress={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)} style={{ position: 'absolute', right: 15, top: 17 }}>
                        <Ionicons name={confirmPasswordVisibility ? "eye-off" : "eye"} size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} disabled={loading} onPress={handleRegistry}>
                    <Text style={styles.buttonText}> {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Sign up'} </Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}