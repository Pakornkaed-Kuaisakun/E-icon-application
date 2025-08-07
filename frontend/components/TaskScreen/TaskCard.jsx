import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ButtonTask from './ButtonTask';


export default function TaskCard({ taskid, status, onTakePhoto }) {
    const [currentTask, setCurrentTask] = React.useState({ userid: null, taskid: null });

    const isDaily = taskid.tasktype === 'daily';
    const isEvent = taskid.tasktype === 'event';

    const badgeStyle = [
        styles.badge,
        isDaily && styles.dailyBadge,
        isEvent && styles.eventBadge,
    ];

    const textStyle = [
        styles.badgeText,
        isDaily && styles.dailyText,
        isEvent && styles.eventText,
    ];

    let difficulty = '';
    let difficultyStyle = [styles.difficultyBadge];
    let difficultyTextStyle = [styles.difficultyText];

    if (taskid.taskpoint < 10) {
        difficulty = 'Easy';
        difficultyStyle.push(styles.easy);
    } else if (taskid.taskpoint < 25) {
        difficulty = 'Normal';
        difficultyStyle.push(styles.normal);
    } else {
        difficulty = 'Hard';
        difficultyStyle.push(styles.hard);
    }

    return (
        <View style={styles.card}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.info}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.name}>{taskid.taskname}</Text>
                        <View style={badgeStyle}>
                            <Text style={textStyle}>{taskid.tasktype}</Text>
                        </View>
                        <View style={difficultyStyle}>
                            <Text style={difficultyTextStyle}>{difficulty}</Text>
                        </View>
                    </View>
                    <Text style={styles.username}>Point: {taskid.taskpoint}</Text>
                </View>
                <View style={{}}>
                    <ButtonTask status={status.status} onTakePhoto={onTakePhoto} userid={status.userid} taskid={status.taskid} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        paddingHorizontal: 5,
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
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: 6
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
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    dailyBadge: {
        backgroundColor: '#5a6daa',
    },
    dailyText: {
        color: '#ffffff',
    },
    eventBadge: {
        backgroundColor: '#f4d35e', // pick a different color from daily
    },
    eventText: {
        color: '#2b2d42', // dark text for contrast
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: 5
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    easy: {
        backgroundColor: '#2196F3', // Blue
    },
    normal: {
        backgroundColor: '#FFC107', // Yellow
    },
    hard: {
        backgroundColor: '#F44336', // Red
    },


});
