import DeviceIcon from "@/assets/icons/deviceIcon";
import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { View, StyleSheet, Text } from "react-native";

export default function DeviceCard({isActive, name}: any) {
    return (
        <View style={styles.deviceCard}>
            <View style={styles.iconContainer}>
                <DeviceIcon strokeColor="white" strokeOpacity={1} />
            </View>
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{name}</Text>
            </View>
            <View
                style={
                    isActive ? styles.statusBadgeActive : styles.statusBadgeInactive
                }
            >
                <Text
                    style={
                        isActive
                            ? styles.statusTextActive
                            : styles.statusTextInactive
                    }
                >
                    {isActive ? 'Ativo' : 'Inativo'}
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
        height: 100
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
    },
    statusBadgeActive: {
        marginTop: 8,
        backgroundColor: '#15803D',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusTextActive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
    statusBadgeInactive: {
        marginTop: 8,
        backgroundColor: '#DC2626',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusTextInactive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
});

