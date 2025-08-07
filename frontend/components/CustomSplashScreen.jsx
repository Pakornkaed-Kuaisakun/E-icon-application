import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const screenWidth = Dimensions.get('window').width;

export default function CustomSplashScreen({ onFinish, duration }) {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animated progress bar
        Animated.timing(progress, {
            toValue: 1,
            duration: duration, // 2 seconds
            useNativeDriver: false,
        }).start();

        // Hide splash after 2 seconds
        const timer = setTimeout(async () => {
            await SplashScreen.hideAsync();
            onFinish(); // Notify parent
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenWidth * 0.8],
    });

    return (
        <View style={styles.container}>
            <View style={styles.discribe}>
                <Text style={{ fontSize: 50, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Tremo</Text>
            </View>
            <Image
                source={require('../assets/images/loadingImage.jpg')}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 60,
        width: '80%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        zIndex: 2
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#5a6daa',
        borderRadius: 4,
    },
    discribe: {
        zIndex: 2,
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        alignItems: 'center',
    }

});
