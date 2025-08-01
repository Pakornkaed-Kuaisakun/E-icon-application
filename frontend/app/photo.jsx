import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/assets/lib/auth';
import { useRouter } from 'expo-router'
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import BASE_API_URL from '../constants/path';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhotoScreen from '../components/PhotoScreen.jsx/PhotoCard';

export default function Photo() {
    const authentication = useAuth();
    const router = useRouter();

    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [userResult, setUserResult] = useState([]);
    const [taskResult, setTaskResult] = useState([]);
    const [userTask, setUserTask] = useState([]);
    const [userData, setUserData] = useState([]);

    const fetchTaskData = async () => {
        setLoading(true);
        try {
            const res_get = await axios.get(`${BASE_API_URL}/api/photo/getProofTask/${userID}`);
            // console.log(res_get.data.dailyTask[0].completed);
            if (res_get.data.taskData.length > 0) {
                setTaskResult(res_get.data.taskData);
                setUserTask(res_get.data.proofTask);
                setUserData(res_get.data.userData);
            } else {
                setTaskResult([]);
                setUserTask([]);
                setUserData([]);
                setMessage('No Task Today');
            }
        } catch (error) {
            setTaskResult([]);
            setUserTask([]);
            setUserData([]);
            setMessage('No Task to Confirm');
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmImage = async (userid, taskid, point, id, currentPoint) => {
        const res = await axios.post(`${BASE_API_URL}/api/photo/ConfirmImage`, { userid: userid, taskid: taskid, point: point, id: id, currentPoint: currentPoint });

        if(res) {
            setTaskResult([]);
            setUserTask([]);
            setUserData([]);
            // console.log('Confirm Complete');
            router.replace('photo');
        } else {
            console.error('Confirm Error');
            setMessage('Confirm Error');
        }
    }

    const handleRejectImage = async (userid, taskid, id) => {
        const res = await axios.post(`${BASE_API_URL}/api/photo/RejectImage`, { userid: userid, taskid: taskid, id: id });
        if(res) {
            setTaskResult([]);
            setUserTask([]);
            setUserData([]);
            console.log("Reject Image");
            router.replace('photo');
        } else {
            console.error('Reject Error');
            setMessage('Reject Error');
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const user = JSON.parse(stored);
                    setUserID(user.userid);
                }
            } catch (error) {
                console.error('Error getting userInfo:', error);
                setMessage('Failed to load user info');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (userID) {
            fetchTaskData();
        }
    }, [userID]);


    useEffect(() => {
        if (authentication === false) {
            router.replace('/auth/sign-in');
        }
    }, [authentication, router]);

    if (authentication === null) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <TopNavBarGlobal pageName="Photo" />
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 15, marginTop: 13 }}>
                    {userTask && userTask.length > 0 ? (
                        userTask.map((task) => {
                            const matchingUserTask = taskResult.find(taskid => taskid.taskid === task.taskid);
                            const matchingUserData = userData.find(userid => userid.userid === task.userid);

                            return (
                                <PhotoScreen key={task.taskid} taskData={matchingUserTask} userTaskData={task} userData={matchingUserData} onConfirm={handleConfirmImage} onReject={handleRejectImage} />
                            )
                        })
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 18 }}>
                            {message || 'Loading...'}
                        </Text>
                    )}
                </ScrollView>
            </View>
            <BottomNavBar />
        </View>
    );
}