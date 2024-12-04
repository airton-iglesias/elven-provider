import { AppColors } from "@/constants/colors";
import { Skeleton } from "moti/skeleton";
import { View, StyleSheet } from "react-native";

export default function DevicesListSkeleton() {
    return (
        <View>
            <View style={styles.deviceCard}>
                <View style={styles.iconContainer}>
                    <Skeleton colorMode="light" width={60} height={60} radius={999} />
                </View>
                <View style={styles.deviceInfo}>
                    <Skeleton colorMode="light" width={100} height={20} />
                </View>
                <Skeleton colorMode="light" width={100} height={20} />
            </View>

            <View style={styles.deviceCard}>
                <View style={styles.iconContainer}>
                    <Skeleton colorMode="light" width={60} height={60} radius={999} />
                </View>
                <View style={styles.deviceInfo}>
                    <Skeleton colorMode="light" width={100} height={20} />
                </View>
                <Skeleton colorMode="light" width={100} height={20} />
            </View>

            <View style={styles.deviceCard}>
                <View style={styles.iconContainer}>
                    <Skeleton colorMode="light" width={60} height={60} radius={999} />
                </View>
                <View style={styles.deviceInfo}>
                    <Skeleton colorMode="light" width={100} height={20} />
                </View>
                <Skeleton colorMode="light" width={100} height={20} />
            </View>

            <View style={styles.deviceCard}>
                <View style={styles.iconContainer}>
                    <Skeleton colorMode="light" width={60} height={60} radius={999} />
                </View>
                <View style={styles.deviceInfo}>
                    <Skeleton colorMode="light" width={100} height={20} />
                </View>
                <Skeleton colorMode="light" width={100} height={20} />
            </View>

            <View style={styles.deviceCard}>
                <View style={styles.iconContainer}>
                    <Skeleton colorMode="light" width={60} height={60} radius={999} />
                </View>
                <View style={styles.deviceInfo}>
                    <Skeleton colorMode="light" width={100} height={20} />
                </View>
                <Skeleton colorMode="light" width={100} height={20} />
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
});

