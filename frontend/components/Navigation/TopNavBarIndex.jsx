import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const TopNavBarIndex = ({ username }) => {
    return (
        <View style={{ height: 70, backgroundColor: COLORS.background, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' ,borderBottomColor: '#5A6DAA', borderBottomWidth: 1, paddingHorizontal: 20, paddingTop: 7, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
            <View>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginLeft: 8 }}>Tremo</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.replace('settingPage/setting')} style={{ marginLeft: 20, marginRight: 10 }}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => router.replace('settingPage/profile')} style={{ marginLeft: 20, marginRight: 12 }}>
                    <Ionicons name="person-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}