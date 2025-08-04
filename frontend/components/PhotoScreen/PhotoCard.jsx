import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PhotoScreen({ taskData, userTaskData, userData, onConfirm, onReject }) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://vkuzwenqldmtvbksolgo.supabase.co/storage/v1/object/public/e-icon-storage//img_user_1722060248753_c1f3d4a2_task_0bc4a562%20_1753940795574.jpg' }}
                style={styles.image}
                resizeMode='cover'
            />
            <Text style={styles.header}>Task: {taskData.taskname}</Text>
            <Text style={styles.subheader}>Owner: {userData.username}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.rejectButton} onPress={() => onReject(userTaskData.userid, userTaskData.taskid, userTaskData.id)}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(userTaskData.userid, userTaskData.taskid, taskData.taskpoint, userTaskData.id, userData.growingPoint)}>
                    <Text style={styles.buttonText}>Confirm +{taskData.taskpoint} </Text>
                    <Ionicons name='water-outline' size={18} color='#ffffffff' style={{}} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
        padding: 14,
        justifyContent: 'center',
        borderBlockColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 25
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    confirmButton: {
        backgroundColor: '#5a6daa',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row'
    },
    rejectButton: {
        backgroundColor: '#9f0000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        alignItems: 'center'
    },
});
