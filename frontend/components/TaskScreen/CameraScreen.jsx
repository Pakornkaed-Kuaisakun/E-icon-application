import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

export default function CameraScreen({ onPictureTaken, onClose }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState('back');
    const [photoURI, setPhotoURI] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = {
                base64: true,
                skipProcessing: true,
            };
            const photo = await cameraRef.current.takePictureAsync(options);
            setPhotoURI(photo.uri);
        }
    };

    const handleRetake = () => {
        setPhotoURI(null);
    };

    const handleSend = () => {
        if (photoURI) {
            onPictureTaken(photoURI); // ส่ง uri รูปกลับไปให้พาเรนต์
        }
    };

    if (hasPermission === null) {
        return <View><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View><Text>No access to camera</Text></View>;
    }

    return (
        <View style={{ flex: 1 }}>
            {!photoURI ? (
                <View style={{ flex: 1 }}>
                    <CameraView ref={cameraRef} style={{ flex: 1, width: Dimensions.get('window').width }} facing={cameraType} pictureSize='Medium' />
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={takePicture} style={styles.button}>
                            <Text style={styles.buttonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#C6131B' }]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: photoURI }} style={styles.previewImage} />
                        <View style={styles.previewButtons}>
                            <TouchableOpacity onPress={handleRetake} style={[styles.button, { backgroundColor: '#777' }]}>
                                <Text style={styles.buttonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSend} style={[styles.button, { backgroundColor: '#5a6daa' }]}>
                                <Text style={styles.buttonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    controls: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        bottom: Dimensions.get('window').height / 20,
        right: Dimensions.get('window').width / 3.25
    },
    button: {
        backgroundColor: '#5a6daa',
        padding: 12,
        marginVertical: 5,
        borderRadius: 8,
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').width - 40,
        borderRadius: 10,
    },
    previewButtons: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 20,
    },
});