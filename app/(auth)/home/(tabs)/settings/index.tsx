import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import UserIcon from "@/assets/icons/userIcon";
import InformationsIcon from "@/assets/icons/informationsIcon";
import LockIcon from "@/assets/icons/lockIcon";
import LogoutIcon from "@/assets/icons/logoutIcon";
import { AppColors } from "@/constants/colors";
import TopBar from "@/components/topbar";

export default function Settings() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.external.primary }}>
            <TopBar />
            <View style={styles.settingsContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Configurações</Text>
                </View>


                <View style={styles.optionWrapper}>
                    <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => router.navigate("/profile")}>
                        <View style={styles.iconWrapper}>
                            <UserIcon />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Dados pessoais</Text>
                        </View>
                        <View style={styles.actionIconWrapper}>
                            <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.optionWrapper}>
                    <TouchableOpacity style={styles.option} activeOpacity={0.7}>
                        <View style={styles.iconWrapper}>
                            <InformationsIcon />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Sobre nós</Text>
                        </View>
                        <View style={styles.actionIconWrapper}>
                            <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                        </View>
                    </TouchableOpacity>
                </View> */}

                {/* <View style={styles.optionWrapper}>
                    <TouchableOpacity style={styles.option} activeOpacity={0.7}>
                        <View style={styles.iconWrapper}>
                            <LockIcon />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Privacidade</Text>
                        </View>
                        <View style={styles.actionIconWrapper}>
                            <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                        </View>
                    </TouchableOpacity>
                </View> */}

                <View style={styles.optionWrapper}>
                    <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => router.replace("/")}>
                        <View style={styles.iconWrapper}>
                            <LogoutIcon />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionTitle, { color: 'red' }]}>Sair</Text>
                        </View>
                        <View style={styles.actionIconWrapper}>
                            <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 24,
    },
    header: {

        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    optionWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#9ca3af",
    },
    iconWrapper: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        height: 60,
        width: 60,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: fontSize.labels.large,
        marginBottom: 4,
    },
    actionIconWrapper: {
        paddingLeft: 8,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
    },
});
