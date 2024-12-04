import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TopBar from '@/components/topbar';
import HomeIcon from '@/assets/icons/homeIcon';
import MoneyIcon from '@/assets/icons/moneyIcon';
import WifiIcon from '@/assets/icons/wifiIcon';
import { AppColors } from '@/constants/colors';
import Feather from '@expo/vector-icons/Feather';

interface TabIconWithDotProps {
    IconComponent: React.ComponentType<any> | (() => JSX.Element);
    focused: boolean;
}

const TabIconWithDot: React.FC<TabIconWithDotProps> = ({ IconComponent, focused }) => (
    <View style={styles.iconContainer}>
        <IconComponent strokeColor={focused ? '#D96A0B': 'gray'}/>
        {focused && <View style={styles.dot} />}
    </View>
);

export default function TabLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBarStyle,
                    tabBarIconStyle: styles.tabBarIconStyle,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIconWithDot IconComponent={HomeIcon} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="payment"
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIconWithDot IconComponent={MoneyIcon} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="wifi"
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIconWithDot IconComponent={WifiIcon} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIconWithDot
                                IconComponent={() => (
                                    <Feather
                                        name="settings"
                                        size={24}
                                        color={focused ? AppColors.internal.button : 'gray'}
                                    />
                                )}
                                focused={focused}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: AppColors.internal.button,
        marginTop: 4,
    },
    tabBarStyle: {
        height: 60,
        backgroundColor: 'white',
    },
    tabBarIconStyle: {
        flex: 1,
    },
});
