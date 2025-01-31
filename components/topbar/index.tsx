import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { fontSize } from "@/constants/fonts";
import { router } from "expo-router";

export default function TopBar() {
    return (
        <View style={{ backgroundColor: '#1A73E8' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Elven Net</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { router.navigate('/notifications') }}>
                        <Ionicons name="notifications" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 20,
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
        gap: 10
    }
});
