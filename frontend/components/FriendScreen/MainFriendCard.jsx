import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MainFriendCard({ userid }) {
    // const router = useRoute();
    const navigation = useNavigation();
    const router = useRouter();

    // console.log(userid);
    return (
        <View style={styles.card}>
            <Image source={{
                uri: `https://avatar.iran.liara.run/username?username=${userid.username}` }} style={styles.avatar} />
            <View style={{ flex: 1, justifyContent: 'space-between',flexDirection: 'row' }}>
                <View style={styles.info}>
                    <Text style={styles.name}>{userid.username}</Text>
                    <Text style={styles.username}>{userid.email}</Text>
                </View>
                {/* <View style={{ marginRight: 6, marginTop: 7 }}>
                    <Text style={styles.badges}>Tree Level {userid.treeLevel}</Text>
                </View> */}
                <TouchableOpacity onPress={() => router.replace({ pathname: "/chat/chatScreen", params: { friendId: userid.userid } })}>
                    <Ionicons name="send-outline" size={24} style={{ color: '#5A6DAA', marginTop: 6, marginRight: 7 }}></Ionicons>
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
        backgroundColor: '#5a6daa',
    },
    reject: {
        backgroundColor: '#9f0000',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
    badges: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: COLORS.income,
        borderRadius: 25,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffffff'
    }
});
