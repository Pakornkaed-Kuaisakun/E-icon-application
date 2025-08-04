import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '@/constants/colors';

const navItems = [
    { name: 'Home', icon: 'home-outline', route: 'index' },
    { name: 'Task', icon: 'checkbox-outline', route: 'task/dailyTask' },
    { name: 'Ranked', icon: 'globe-outline', route: 'rank' },
    {
        name: 'Friends',
        icon: 'people-outline',
        route: ['friends/friend', 'friends/requestFriend', 'friends/addFriend'],
    },
    { name: 'Photo', icon: 'image-outline', route: 'photo' },
];

const isCurrentRoute = (currentRoute, itemRoute) => {
    if (Array.isArray(itemRoute)) return itemRoute.includes(currentRoute);
    return currentRoute === itemRoute;
};

export const BottomNavBar = () => {
    const navigation = useNavigation();
    const { name: currentRoute } = useRoute();

    return (
        <View
            style={{
                height: 110,
                backgroundColor: COLORS.background,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderTopColor: '#5A6DAA',
                borderTopWidth: 1,
                paddingBottom: 20,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                // marginBottom: 10
            }}
        >
            {navItems.map((item) => {
                const isFocused = isCurrentRoute(currentRoute, item.route);

                return (
                    <TouchableOpacity
                        key={item.name}
                        disabled={isFocused}
                        onPress={() => {
                            if (!isFocused) {
                                const targetRoute = Array.isArray(item.route) ? item.route[0] : item.route;
                                navigation.navigate(targetRoute);
                            }
                        }}
                        style={{
                            alignItems: 'center',
                            backgroundColor: isFocused ? COLORS.income : 'transparent',
                            padding: 10,
                            borderRadius: 18,
                        }}
                    >
                        <Ionicons
                            name={item.icon}
                            size={24}
                            color={isFocused ? '#ffffffff' : COLORS.text}
                        />
                        <Text style={{ fontWeight: '600', color: isFocused ? '#ffffffff' : COLORS.text }}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
