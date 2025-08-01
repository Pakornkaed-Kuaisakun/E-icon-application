import React from 'react';
import { Text, Image, Dimensions } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { COLORS } from '@/constants/colors';

export function UserTreeInfo({ level, type, points }) {
    const progress = points / 100;

    return (
        <>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 }}>
                Level: {level ?? 'Loading...'}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>
                Sapling - {type}
            </Text>
            <Image source={require('@/assets/images/demo-tree-seed.png')} style={{ width: '50%', height: '50%', marginBottom: 7 }} />
            <ProgressBar
                progress={progress}
                width={Dimensions.get('window').width - 80}
                height={10}
                color={COLORS.primary}
                borderRadius={20}
                unfilledColor="#e0e0e0"
            />
            <Text style={{ textAlign: 'center', marginTop: 10, color: COLORS.text }}>
                {points} / 100 Points
            </Text>
        </>
    );
}
