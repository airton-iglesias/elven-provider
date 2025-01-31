import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import { AppColors } from "@/constants/colors";
import { Skeleton } from "moti/skeleton";

export default function NotificationSkeleton() {
    return (
        <View>
            <View style={styles.notificationItem}>
                <View style={styles.notificationWrapper}>
                    <Skeleton width={60} height={60} radius={999} colorMode="light" />
                    <View style={styles.textContainer}>
                        <Skeleton width={150} height={25} radius={4} colorMode="light" />
                        <Skeleton width={200} height={25} radius={4} colorMode="light" />
                    </View>

                </View>
            </View>

            <View style={styles.notificationItem}>
                <View style={styles.notificationWrapper}>
                    <Skeleton width={60} height={60} radius={999} colorMode="light" />
                    <View style={styles.textContainer}>
                        <Skeleton width={150} height={25} radius={4} colorMode="light" />
                        <Skeleton width={200} height={25} radius={4} colorMode="light" />
                    </View>

                </View>
            </View>

            <View style={styles.notificationItem}>
                <View style={styles.notificationWrapper}>
                    <Skeleton width={60} height={60} radius={999} colorMode="light" />
                    <View style={styles.textContainer}>
                        <Skeleton width={150} height={25} radius={4} colorMode="light" />
                        <Skeleton width={200} height={25} radius={4} colorMode="light" />
                    </View>

                </View>
            </View>
            
            <View style={styles.notificationItem}>
                <View style={styles.notificationWrapper}>
                    <Skeleton width={60} height={60} radius={999} colorMode="light" />
                    <View style={styles.textContainer}>
                        <Skeleton width={150} height={25} radius={4} colorMode="light" />
                        <Skeleton width={200} height={25} radius={4} colorMode="light" />
                    </View>

                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    notificationItem: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
    },
    textContainer: {
        flex: 1,
        gap: 5,
        marginLeft: 10
    },
    notificationWrapper: {
        flexDirection: "row",
        alignItems: "center",
    }
});
