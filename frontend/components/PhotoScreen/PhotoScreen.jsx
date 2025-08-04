import React from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 42) / 2; // padding 14*2 + margin 7*2

export default function PhotoScreen({ imageURLs }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.grid}>
                {imageURLs.map((item, index) => (
                    <View key={item.taskid || index} style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.proofImageURL }}
                            style={styles.image}
                            resizeMode='contain'
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        backgroundColor: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        columnGap: 10,
    },
    imageContainer: {
        marginBottom: 14,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        borderWidth: 1
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: 12,
    },
});
