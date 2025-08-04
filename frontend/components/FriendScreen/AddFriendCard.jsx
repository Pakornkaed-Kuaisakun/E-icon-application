import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './AvatarLoad';
import BASE_API_URL from '../../constants/path';
import axios from 'axios';

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
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
        marginRight: 12,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#777',
    },
    button: {
        backgroundColor: '#5a6daa',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
    },
});

export const AddFriendCard = ({ senderID, receiver, onAddFriend, loading }) => {
    const [friendState, setFriendState] = useState('add'); // default: add | pending | friends
    
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${BASE_API_URL}/api/friends/getFriendRequestStatus?senderID=${senderID}&receiverID=${receiver.userid}`);
                setFriendState(res.data.status); // <- set state here
            } catch (error) {
                console.error('Error fetching friend status:', error);
            }
        };

        if (senderID && receiver?.userid) {
            fetchStatus();
        }
    }, [senderID, receiver]);

    if (!receiver) return null;

    return (
        <View style={styles.card}>
            <Avatar uri={`https://avatar.iran.liara.run/username?username=${receiver.username}`} />
            <View style={styles.info}>
                <Text style={styles.name}>{receiver.username || 'Unnamed User'}</Text>
                <Text style={styles.email}>{receiver.email}</Text>
            </View>

            {friendState === 'add' && (
                <TouchableOpacity style={styles.button} onPress={onAddFriend} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Friend'}</Text>
                </TouchableOpacity>
            )}

            {friendState === 'pending' && (
                <View style={[styles.button, { backgroundColor: 'gray' }]}>
                    <Text style={styles.buttonText}>Requested</Text>
                </View>
            )}

            {friendState === 'accept' && (
                <View style={[styles.button, { backgroundColor: '#5a6daa' }]}>
                    <Text style={styles.buttonText}>Friend</Text>
                </View>
            )}
        </View>
    );
};
