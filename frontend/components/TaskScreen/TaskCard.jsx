import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ButtonTask from './ButtonTask';


export default function TaskCard({ taskid, status, onTakePhoto }) {
    const [currentTask, setCurrentTask] = React.useState({ userid: null, taskid: null });

    return (
        <View style={styles.card}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.info}>
                    <Text style={styles.name}>{taskid.taskname}</Text>
                    <Text style={styles.username}>Point: {taskid.taskpoint}</Text>
                    <Text>{status.taskid}</Text>
                    <Text>{status.userid}</Text>
                    <Text>{status.date}</Text>
                </View>
                <View style={{}}>
                    <ButtonTask status={status.status} onTakePhoto={onTakePhoto} userid={status.userid} taskid={status.taskid}  />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 13,
        marginVertical: 6,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ccc',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
    },
    username: {
        fontSize: 15,
        color: '#777',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    accept: {
        backgroundColor: '#5a6daa',
    },
    reject: {
        backgroundColor: '#9f0000',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
    badges: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#5a6daa',
        borderRadius: 25,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f1f1f'
    },
    rank: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 12,
        marginTop: 4,
        textAlign: 'center',
        padding: 5,
        borderRadius: 100,
    }

});
