import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Feather } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import UserIcon from "@/assets/icons/userIcon";
import LogoutIcon from "@/assets/icons/logoutIcon";
import { AppColors } from "@/constants/colors";
import TopBar from "@/components/topbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {

    const handleExit = async () => {
        await AsyncStorage.removeItem('customerData');
        router.replace("/signin");
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: AppColors.external.primary }]}>
            <TopBar />
            <View style={styles.settingsContainer}>
                <Text style={styles.headerTitle}>Configurações</Text>



                <TouchableOpacity style={styles.option}
                    onPress={() => router.navigate("/profile")}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconWrapper}>
                        <UserIcon />
                    </View>
                    <Text style={styles.optionText}>Dados pessoais</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => Linking.openURL('https://elvenprovider.blogspot.com/p/termos-de-uso-e-privacidade.html')}>
                    <View style={styles.iconWrapper}>
                        <Feather name="lock" size={24} color="white" />
                    </View>
                    <Text style={styles.optionText}>Termos de uso e privacidade</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>


                <TouchableOpacity style={styles.option} onPress={handleExit} activeOpacity={0.7}>
                    <View style={styles.iconWrapper}>
                        <LogoutIcon />
                    </View>
                    <Text style={[styles.optionText, { color: 'red' }]}>Sair</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
        paddingTop: 24,
    },
    headerTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 15,
        elevation: 2,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    iconWrapper: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: fontSize.labels.medium,
        color: '#555'
    },
});
