import React, { useState } from "react";
import {
    Text,
    Modal,
    TouchableOpacity,
    View,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import { congratsMessages } from "../../constants/congrateWord";

const screenWidth = Dimensions.get("window").width;

export default function CongrateCard({ imgPath, onClose, visible, point }) {
    const randomMessage =
        congratsMessages[Math.floor(Math.random() * congratsMessages.length)];

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Mission Completed!</Text>
                    {imgPath && (
                        <Image
                            source={{ uri: imgPath}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    <Text style={styles.message}>{randomMessage}</Text>
                    <Text style={styles.text}>You received {point || 1} water drop</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: screenWidth * 0.8,
        backgroundColor: "#DFEAFF",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        position: 'absolute'
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#5A6DAA",
    },
    message: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        color: "#5A6DAA",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#5A6DAA",
    },
    button: {
        backgroundColor: "#5A6DAA",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
