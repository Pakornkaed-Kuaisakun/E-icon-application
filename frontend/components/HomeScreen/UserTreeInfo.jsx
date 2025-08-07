import React from 'react';
import { Text, Image, Dimensions } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { COLORS } from '@/constants/colors';
// import TreeStage from '@/components/HomeScreen/TreeStage';

export function UserTreeInfo({ level, type, points }) {
    const progress = points / 100;

    let treeImage;
    let treeStage;

    if (level < 15) {
        treeImage = require('@/assets/images/seed.png');
        treeStage = "Seed";
    } else if (level < 25) {
        treeImage = require('@/assets/images/sapling.png');
        treeStage = "Sapling";
    } else {
        treeImage = require('@/assets/images/tree.png');
        treeStage = "Tree";
    }

    return (
        <>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 }}>
                Level: {level ?? 'Loading...'}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>
                {treeStage} - {type}
            </Text>
            {/* <TreeStage treeLevel={level} /> */}
            <Image source={treeImage} style={{ width: '60%', height: '40%', objectFit: 'contain', marginTop: 50 }} />
            <ProgressBar
                progress={progress}
                width={Dimensions.get('window').width - 80}
                height={10}
                color={COLORS.primary}
                borderRadius={20}
                unfilledColor="#ffffffff"
            />
            <Text style={{ textAlign: 'center', marginTop: 10, color: COLORS.text }}>
                {points} / 100 Points
            </Text>
        </>
    );
}
