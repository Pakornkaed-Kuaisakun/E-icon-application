import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/assets/lib/auth';
import { useRouter } from 'expo-router'
import { TopNavBarGlobal } from '@/components/Navigation/TopNavbarGlobal';
import { BottomNavBar } from '@/components/Navigation/BottomNavBar';
import LoadingScreen from '@/components/LoadingScreen';
import BASE_API_URL from '../../constants/path';
import BASE_SUPABASE_IMAGE_PATH from '../../constants/supabasePath';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '../../components/TaskScreen/TaskCard';
import CameraScreen from '../../components/TaskScreen/CameraScreen';
import { supabase } from '@/assets/lib/supabase';
import * as FileSystem from 'expo-file-system';

export default function Task() {
    const authentication = useAuth();
    const router = useRouter();

    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [taskResult, setTaskResult] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [currentTask, setCurrentTask] = useState({ userid: null, taskid: null })
    const [imgPath, setImgPath] = useState(null);

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

    const fetchTaskData = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_API_URL}/api/task/getTask`, { userid: userID });
            const res_get = await axios.get(`${BASE_API_URL}/api/task/getDailyTask/${userID}`);
            // console.log(res_get.data.dailyTask[0].completed);
            if (res_get.data.taskData.length > 0) {
                setTaskResult(res_get.data.taskData);
                setTaskStatus(res_get.data.dailyTask);
            } else {
                setTaskResult([]);
                setMessage('No Task Today');
            }
        } catch (error) {
            setTaskResult([]);
            setMessage('Loading Task Error');
        } finally {
            setLoading(false);
        }
    }

    const handlePictureTaken = async (photoURI) => {
        setLoading(true);
        // console.log('Photo URI: ', photoURI);
        await uploadPhotoToSupabase(photoURI);
        // console.log(photoURI);
        await updateDailyTaskStatus();
        setShowCamera(false);
        setLoading(false);
    }

    const uploadPhotoToSupabase = async (uri) => {
        try {
            const fileUri = uri;
            const file = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const fileBuffer = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));

            // console.log(fileBuffer);

            const fileName = `img_${currentTask.userid}_${currentTask.taskid}_${Date.now()}.jpg`;

            const { data, error } = await supabase.storage.from('e-icon-storage').upload(fileName, fileBuffer, { contentType: 'image/jpeg', upsert: true, cacheControl: "3600" });

            if(error) {
                console.error('Upload error: ', error);
                return;
            } 
            const imagePath = String(BASE_SUPABASE_IMAGE_PATH) + String(data.fullPath);
            // console.log(String(imagePath));
            setImgPath(String(imagePath));
        } catch (error) {
            console.error('Upload Failed: ', error);
        }
    }
    // console.log(imgPath);

    const updateDailyTaskStatus = async () => {
        try {
            if(currentTask.userid.length === 0 || currentTask.taskid.length === 0 || imgPath.length === 0) {
                // console.log(currentTask.userid, currentTask.taskid, imgPath);
                setCurrentTask({ userid: null, taskid: null })
                setImgPath('');
                setMessage('some element is null');
            }
            // console.log(imgPath);

            const res = await axios.post(`${BASE_API_URL}/api/task/updateTaskStatus`, { userid: currentTask.userid, taskid: currentTask.taskid, imgPath: imgPath });

            console.log(res.data);

            if(res) {
                setCurrentTask({ userid: null, taskid: null });
                setImgPath('');
                router.replace('task/dailyTask');
            } else {
                console.log('Something Error');
                setCurrentTask({ userid: null, taskid: null });
                setImgPath('');
                setMessage('Something Error');
            }
        } catch (error) {
            setMessage('Error: ', error);
        }
    }

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
        <View style={{ flex: 1, backgroundColor: '#ffffffff' }}>
            <TopNavBarGlobal pageName="Task" />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                {showCamera ? (
                    <CameraScreen onPictureTaken={handlePictureTaken} onClose={() => setShowCamera(false)} />
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 15, marginTop: 13 }}>
                            {taskResult && taskResult.length > 0 ? (
                                taskResult.map((task) => {
                                    const matchingStatus = taskStatus.find(status => status.taskid === task.taskid);
                                    return (
                                        <TaskCard
                                            key={task.taskid}
                                            taskid={task}
                                            status={matchingStatus}
                                            onTakePhoto={() => {
                                                setCurrentTask({ userid: matchingStatus.userid, taskid: matchingStatus.taskid })
                                                setShowCamera(true)
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <Text style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 18 }}>
                                    {message || 'Loading...'}
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                )}
            </View>
            <BottomNavBar />
        </View >
    );
}