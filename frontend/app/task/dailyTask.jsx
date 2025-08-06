import { View, Text, ScrollView, Dimensions, Animated, PanResponder, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/assets/lib/auth';
import { useNavigation, useRouter } from 'expo-router'
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
import CongrateCard from '../../components/TaskScreen/CongraturationCard';
import * as FileSystem from 'expo-file-system';

export default function Task() {
    const authentication = useAuth();
    const router = useRouter();
    const navigation = useNavigation();

    const translateX = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;

    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [eventMessage, setEventMessage] = useState('');
    const [taskResult, setTaskResult] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [eventTask, setEventTask] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [currentTask, setCurrentTask] = useState({ userid: null, taskid: null, date: null, point: null, status: 'completed' })
    const [imgPath, setImgPath] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [eventModalVisible, setEventModalVisible] = useState(false);

    const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const today = getFormattedDate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                if (stored) {
                    const user = JSON.parse(stored);
                    setUserID(user.userid);
                    setUserData(user);
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
            const res = await axios.post(`${BASE_API_URL}/api/task/getTask`, { userid: userID, date: String(today) });
            const res_get = await axios.get(`${BASE_API_URL}/api/task/getDailyTask?userid=${userID}&date=${String(today)}`);
            // console.log(res_get.data.dailyTask[0]);
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

    const fetchEventTask = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/task/fetchEventTask`);
            if(res.data.event.length > 0) {
                setEventTask(res.data.event);
            } else {
                setEventTask([]);
                setEventMessage('No Event Task');
            }
        } catch (error) {
            setEventMessage([]);
            setEventMessage('Loading Event Task Error');
        } finally {
            setLoading(false);
        }
    }

    const handlePictureTaken = async (photoURI) => {
        setLoading(true);
        await uploadPhotoToSupabase(photoURI);
        setShowCamera(false);
        setModalVisible(true);
        // router.replace('task/dailyTask');
    }

    const uploadPhotoToSupabase = async (uri) => {
        try {
            const fileUri = uri;
            const file = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const fileBuffer = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));

            const fileName = `img_${currentTask.userid}_${currentTask.taskid}_${Date.now()}.jpg`;

            const { data, error } = await supabase.storage.from('e-icon-storage').upload(fileName, fileBuffer, { contentType: 'image/jpeg', upsert: true, cacheControl: "3600" });

            if (error) {
                console.error('Upload error: ', error);
                return;
            }
            const imagePath = String(BASE_SUPABASE_IMAGE_PATH) + String(data.fullPath);

            const res = await axios.post(`${BASE_API_URL}/api/task/updateTaskStatus`, { userid: currentTask.userid, taskid: currentTask.taskid, imgPath: imagePath, date: String(today) });

            // console.log(res.data);

            if (res.status === 200) {
                // console.log('Success');
                setImgPath(imagePath);
            } else {
                console.log('Something Error');
                setCurrentTask({ userid: null, taskid: null, date: null, point: null, status: 'completed' });
                setImgPath('');
                setMessage('Something Error');
            }

        } catch (error) {
            console.error('Upload Failed: ', error);
        }
    }

    useEffect(() => {
        if (userID) {
            fetchTaskData();
            fetchEventTask();
        }
    }, [userID]);

    // console.log(eventTask);

    // ✅ Slide Gesture Handler
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx < 0) {
                    translateX.setValue(gesture.dx);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -50) {
                    // Swipe Left → Go to /rank
                    Animated.timing(translateX, {
                        toValue: -screenWidth,
                        duration: 270,
                        useNativeDriver: true,
                    }).start(() => {
                        translateX.setValue(0); // reset for next time
                        navigation.navigate('rank');
                    });
                } else if (gesture.dx > 50) {
                    // Swipe Right → Go to /index
                    Animated.timing(translateX, {
                        toValue: screenWidth,
                        duration: 270,
                        useNativeDriver: true,
                    }).start(() => {
                        translateX.setValue(0);
                        navigation.navigate('index');
                    });
                } else {
                    // Cancelled swipe → spring back
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

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
            <Animated.View {...panResponder.panHandlers}
                style={[{ flex: 1, backgroundColor: '#ffffff', transform: [{ translateX }] }]}>
                <TopNavBarGlobal pageName="Task" />
                <Text style={{ fontSize: 27, fontWeight: 'bold', textAlign: 'center', marginTop: 15 }}>Daily Task</Text>
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
                                                    setCurrentTask({ userid: matchingStatus.userid, taskid: matchingStatus.taskid, date: today, point: task.taskpoint, status: "completed" })
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
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    marginRight: 7,
                                    marginTop: 20,
                                    borderWidth: 2,
                                    borderColor: '#5a6daa', // blue frame
                                    borderRadius: 10,
                                }}
                                    onPress={() => console.log('Add new task button pressed')}>
                                    <Text style={{ color: '#5a6daa', fontSize: 18, marginRight: 5 }}>make a event task</Text>
                                    <Text
                                        style={{
                                            backgroundColor: '#5a6daa',
                                            color: 'white',
                                            fontSize: 18,
                                            borderRadius: 15,
                                            width: 30,
                                            height: 30,
                                            textAlign: 'center',
                                            marginLeft: 5,
                                            fontWeight: 'bold',
                                            textAlignVertical: 'center',
                                            lineHeight: 27,
                                        }}>
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}
                </View>
                {modalVisible ? (
                    <CongrateCard imgPath={imgPath} visible={modalVisible} onClose={() => { setModalVisible(false); setImgPath(''); router.replace('task/dailyTask'); setCurrentTask({ userid: null, taskid: null, date: null, point: null, status: 'completed' }); }} />
                ) : null}
                <BottomNavBar />
            </Animated.View>
        </View >
    );
}