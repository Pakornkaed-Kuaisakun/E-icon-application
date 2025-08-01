import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const TopNavBarGlobal = ({ pageName }) => {

    const router = useRouter();

    return (
        <View style={{ height: 70, backgroundColor: COLORS.background, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', borderBottomColor: '#5A6DAA', borderBottomWidth: 1, paddingHorizontal: 17, paddingTop: 7, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 15, top: 25 }}>
                <Ionicons name="chevron-back-outline" size={26} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>{pageName}</Text>
        </View>
    );
}