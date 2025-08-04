import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function SettingHeader({ name, route}) {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate(route)}>
                <Ionicons name="chevron-back" size={27} color="#a3a3a3ff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
        borderColor: '#5a6daa',
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 27,
        fontWeight: '600',
        marginRight: 7
    },
});
