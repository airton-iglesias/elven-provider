import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    },
    profileCircle: {
        width: 35,
        height: 35,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FFA500',
        backgroundColor: '#FFFFFF',
        marginLeft: 16,
    },
    profileImage:{
        width: '100%',
        height: '100%',
        borderRadius: 999,
    }
});
