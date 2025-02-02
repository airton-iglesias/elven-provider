import DeviceIcon from "@/assets/icons/deviceIcon";
import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { View, StyleSheet, Text } from "react-native";

export default function DeviceCard({ isActive, name, ip, mac }: any) {
    return (
        <View style={styles.deviceCard}>
            <View style={styles.iconContainer}>
                <DeviceIcon strokeColor="white" strokeOpacity={1} />
            </View>
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{name}</Text>
                <Text style={{ color: '#888888' }}>IP: {ip}</Text>
                <Text style={{ color: '#888888' }}>Mac: {mac}</Text>
            </View>
            <View style={isActive ? styles.statusBadgeActive : styles.statusBadgeInactive}>
                <Text style={isActive ? styles.statusTextActive : styles.statusTextInactive}>
                    {isActive ? 'Ativo' : 'Inativo'}
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    deviceCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        height: 100,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: AppColors.internal.button,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 15,
    },
    deviceName: {
        fontSize: fontSize.labels.medium,
        color: '#000',
        fontWeight: 'bold'
    },
    statusBadgeActive: {
        backgroundColor: '#15803D',
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 4,
        alignSelf: 'center',
    },
    statusTextActive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
    statusBadgeInactive: {
        backgroundColor: '#DC2626',
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 4,
        alignSelf: 'center',

    },
    statusTextInactive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
});

