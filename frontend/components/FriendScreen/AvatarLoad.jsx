import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const Avatar = ({ uri, size = 56 }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const imageUri = !error && uri?.trim()
        ? uri
        : 'https://avatar.iran.liara.run/public';

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {loading && <View style={[styles.skeleton, { width: size, height: size }]} />}
            <Image
                source={{ uri: imageUri }}
                style={[
                    styles.image,
                    { width: size, height: size },
                    loading && { display: 'none' }, // ซ่อนรูปตอน loading
                ]}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError(true);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: '#ddd',
    },
    image: {
        resizeMode: 'cover',
        borderRadius: 999,
    },
    skeleton: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
    },
});
