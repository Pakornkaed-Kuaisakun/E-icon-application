import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ButtonTask({ status, onTakePhoto, userid, taskid }) {
  return (
    <View style={{ marginTop: 10, alignItems: 'center' }}>
      {status === 'completed' ? (
        <View
          style={{
            backgroundColor: '#878fabff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#5a668fff', fontWeight: 'bold' }}>Completed</Text>
        </View>
      ) : status === 'pending' ? (
        <View
          style={{
            backgroundColor: '#c5c5c5ff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
            <Text style={{ color: '#707070ff', fontWeight: 'bold' }}>Pending</Text>
        </View>
      ) : (
        // unfinished (or any other fallback)
        <TouchableOpacity
          onPress={onTakePhoto}
          style={{
            backgroundColor: '#5a6daa',
            paddingVertical: 10,
            paddingHorizontal: 13,
            borderRadius: 10,
          }}
        >
          <Ionicons
            name='camera-outline'
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
