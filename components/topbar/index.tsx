import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform, SafeAreaView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { fontSize } from "@/constants/fonts";
import { router } from "expo-router";

export default function TopBar() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Elven Net</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { router.navigate('/notifications') }}
                        style={styles.iconButton}
                    >
                        <Ionicons name="notifications" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#1A73E8',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#1A73E8',
    },
    title: {
        fontSize: fontSize.titles.medium,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 6, // adiciona área de toque maior para uma melhor usabilidade
    },
});
