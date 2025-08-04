import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function WaterButton({ disabled, onPress }) {
    return (
        <TouchableOpacity
            style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: disabled ? '#90A4AE' : '#5a6daa',
                borderRadius: 30,
                flexDirection: 'row',
                alignItems: 'center'
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <Ionicons name='water-outline' size={24} color='#ffffffff' style={{ marginRight: 6 }} />
            <Text style={{ color: '#ffffffff', fontWeight: 'bold' }}>Water</Text>
        </TouchableOpacity>
    );
}
