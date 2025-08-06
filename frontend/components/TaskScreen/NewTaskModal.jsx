import React from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const NewTaskModal = ({ visible, onClose, tasks }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Task List</Text>

                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.taskId}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <Text style={styles.taskName}>{item.taskName}</Text>
                                <Text style={styles.taskDetail}>ID: {item.taskId}</Text>
                                <Text style={styles.taskDetail}>Point: {item.taskPoint}</Text>
                                <Text style={styles.taskDetail}>Type: {item.taskType}</Text>
                            </View>
                        )}
                    />

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    taskCard: {
        backgroundColor: '#eef2f7',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    taskName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    taskDetail: {
        fontSize: 14,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#5a6daa',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default NewTaskModal;