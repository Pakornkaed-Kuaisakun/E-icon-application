import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function WaterButton({ disabled, onPress }) {
    return (
        <TouchableOpacity
            style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: disabled ? '#90A4AE' : '#0277BD',
                borderRadius: 30,
                flexDirection: 'row',
                alignItems: 'center'
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <Ionicons name='water-outline' size={24} color='#f5f5f5' style={{ marginRight: 6 }} />
            <Text style={{ color: '#f5f5f5', fontWeight: 'bold' }}>Water</Text>
        </TouchableOpacity>
    );
}
