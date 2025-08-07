import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(true); // Show on load

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <Text style={{ fontSize: 24 }}>🏠 Home Screen</Text>

            {/* Tremo Info Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ fontSize: 18 }}>✖</Text>
                        </TouchableOpacity>

                        {/* Title */}
                        <Text style={styles.title}>Tremo?</Text>

                        {/* Steps */}
                        <View style={styles.step}>
                            <Text style={styles.stepText}>1. Complete daily tasks</Text>
                            <Image source={require('./assets/task.png')} style={styles.icon} />
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepText}>2. Receive water drops</Text>
                            <Image source={require('./assets/water.png')} style={styles.icon} />
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepText}>3. Water your sprout</Text>
                            <Image source={require('./assets/growth.png')} style={styles.growthIcon} />
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepText}>4. Real tree will be planted in desert</Text>
                            <Image source={require('./assets/desert.png')} style={styles.icon} />
                        </View>

                        {/* Okay Button */}
                        <Pressable
                            style={styles.okayButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Okay</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#e9f0ff',
        borderRadius: 20,
        padding: 24,
        width: '80%',
        position: 'relative',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 10,
    },
    growthIcon: {
        width: 60,
        height: 24,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    okayButton: {
        backgroundColor: '#5561ff',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 20,
    },
});
