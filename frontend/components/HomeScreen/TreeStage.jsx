import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function TreeStage({ treeLevel }) {
    let treeImage;

    if (treeLevel < 15) {
        treeImage = require('@/assets/images/seed.png');
    } else if (treeLevel < 25) {
        treeImage = require('@/assets/images/sapling.png');
    } else {
        treeImage = require('@/assets/images/tree.png');
    }

    return (
        <View style={styles.container}>
            <Image
                source={treeImage}
                style={styles.treeImage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 50,
    },
    treeImage: {
        width: '60%',
        height: '40%',
        resizeMode: 'contain', // same as objectFit: 'contain'
    },
});
