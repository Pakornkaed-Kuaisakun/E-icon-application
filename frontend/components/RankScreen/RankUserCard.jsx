import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // ทอง, เงิน, ทองแดง


export default function RankUserCard({ userid, index }) {
    const isTop3 = index < 3;
    const backgroundColor = isTop3 ? medalColors[index] : '#fff';
    return (
        <View style={styles.card}>
            <Text style={[styles.rank, { backgroundColor }]}>{index + 1}</Text>
            <Image source={{ uri: `https://avatar.iran.liara.run/username?username=${userid.username}` }} style={styles.avatar} />
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.info}>
                    <Text style={styles.name}>{userid.username}</Text>
                    <Text style={styles.username}>{userid.email}</Text>
                </View>
                <View style={{ marginRight: 6, marginTop: 7 }}>
                    <Text style={styles.badges}>Tree Level {userid.treeLevel}</Text>
                    <Text style={{ marginLeft: 8, marginTop: 5, fontSize: 14, fontWeight: 400, color: 'gray' }}>Point {userid.treePoint} / 100</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 13,
        marginVertical: 6,
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
    },
    rank: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 12,
        marginTop: 4,
        textAlign: 'center',
        padding: 5,
        borderRadius: 100,
    }

});
