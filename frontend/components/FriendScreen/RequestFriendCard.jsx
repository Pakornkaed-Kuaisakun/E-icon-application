import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function RequestFriendCard({ receiver, onAccept, onReject, loading }) {
    // console.log(receiver);
    return (
        <View style={styles.card}>
            <Image source={{ uri: `https://avatar.iran.liara.run/username?username=${receiver.username}` }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>{receiver.username}</Text>
                <Text style={styles.username}>{receiver.email}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.accept]}
                    onPress={onAccept}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.reject]}
                    onPress={onReject}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 13,
        marginVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ccc',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    username: {
        fontSize: 13,
        color: '#777',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    accept: {
        backgroundColor: '#4CAF50',
    },
    reject: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
});
