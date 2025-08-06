import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NewTaskModel from './frontend/NewTaskModel'; // ตรวจสอบ path ให้ถูกต้องตามโปรเจกต์ของคุณ

const MainScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);

    // ตัวอย่าง task list
    const taskList = [
        {
            id: 1,
            taskId: 'T001',
            taskName: 'Clean the beach',
            taskPoint: 10,
            taskType: 'Environment',
        },
        {
            id: 2,
            taskId: 'T002',
            taskName: 'Plant a tree',
            taskPoint: 15,
            taskType: 'Environment',
        },
        {
            id: 3,
            taskId: 'T003',
            taskName: 'Recycle plastic',
            taskPoint: 5,
            taskType: 'Recycling',
        },
        {
            id: 4,
            taskId: 'T004',
            taskName: 'Join eco workshop',
            taskPoint: 8,
            taskType: 'Education',
        },
        {
            id: 5,
            taskId: 'T005',
            taskName: 'Bike to work',
            taskPoint: 12,
            taskType: 'Transportation',
        },
    ];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    console.log('Add new task button pressed');
                    setModalVisible(true);
                }}
            >
                <Text style={styles.buttonText}>Make a New Task</Text>
            </TouchableOpacity>

            <NewTaskModel
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tasks={taskList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    button: {
        backgroundColor: '#5a6daa',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MainScreen;
