import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import BASE_API_URL from '../../constants/path';
import ButtonTask from './ButtonTask';
import { useRouter } from 'expo-router';


const NewTaskModal = ({ visible, onClose, tasks, userID }) => {
    const [eventTaskUser, setEventTaskUser] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const today = getFormattedDate();

    const fetchEventTaskUser = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('userID', userID);
        tasks.forEach(task => params.append('taskIDs', task.taskid));
        console.log(params);
        try {
            

            const eventTaskUser = await axios.get(`${BASE_API_URL}/api/task/fetchEventTaskUser?${params.toString()}`);


            if (eventTaskUser.data.eventTaskUser.length > 0) {
                setEventTaskUser(eventTaskUser.data.eventTaskUser);
            } else {
                setEventTaskUser([]);
                setMessage('Event Task in usertask does not found');
            }
        } catch (error) {
            setEventTaskUser([]);
            console.log(error);
            setMessage('fetch event task user failed');
        } finally {
            setLoading(false);
        }
    }

    const handleCreateNewEventTask = async (userID, taskID) => {
        try {
            const create = await axios.post(`${BASE_API_URL}/api/task/createEventTask`, {
                userid: userID,
                taskid: taskID,
                date: String(today)
            });

            if(create) {
                // fetchEventTaskUser();
                // router.replace('task/dailyTask');
                setEventTaskUser(prev => [...prev, { taskid: taskID }]);
            } else {
                setEventTaskUser([]);
                setMessage('Create New Event Task Failed');
            }
        } catch (error) {
            setEventTaskUser([]);
            setMessage('handleCreateNewEventTask Error');
            console.error(error);
        }
    }


    useEffect(() => {
        if(userID) {
            fetchEventTaskUser();
        }
    }, [userID, tasks]);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Event Task List</Text>

                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.taskName}>{item.taskname}</Text>
                                    {/* <Text>{item.taskid}</Text> */}
                                    <Text style={styles.taskDetail}>Point: {item.taskpoint}</Text>
                                </View>
                                <View>
                                    {eventTaskUser.some((e) => e.taskid === item.taskid) ? (
                                        <ButtonTask />
                                    ) : (
                                        <TouchableOpacity style={styles.createButton} onPress={() => handleCreateNewEventTask(userID, item.taskid)}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>Create</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    taskCard: {
        backgroundColor: '#eef2f7',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    taskDetail: {
        fontSize: 16,
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
    createButton: {
        marginRight: 10,
        paddingHorizontal: 13,
        paddingVertical: 9,
        backgroundColor: '#5a9add',
        borderRadius: 50
    },
});

export default NewTaskModal;