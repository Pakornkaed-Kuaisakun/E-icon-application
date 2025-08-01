import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const navItems = [
    { name: 'Friend', route: 'friends/friend' },
    { name: 'Request', route: 'friends/requestFriend' },
    { name: 'Add friend', route: 'friends/addFriend' },
];

export const FriendNavBar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <View
            style={{
                height: 60,
                backgroundColor: '#f5f5f5',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingBottom: 10,
                paddingHorizontal: 6,
                marginTop: 7
            }}
        >
            {navItems.map((item) => {
                const isFocused = route.name === item.route;

                return (
                    <TouchableOpacity key={item.name} onPress={() => navigation.navigate(item.route)} disabled={isFocused}>
                        <Text
                            style={{
                                fontWeight: '600',
                                borderBottomColor: COLORS.primary,
                                borderBottomWidth: isFocused ? 3 : 0,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                color: COLORS.text
                            }}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
};
