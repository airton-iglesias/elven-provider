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
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: 'white'
    },
    headerContainer: {
        marginTop: 25,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    notificationItem: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
    },
    iconContainer: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        height: 60,
        width: 60
    },
    textContainer: {
        flex: 1,
        gap: 5,
        marginLeft: 10
    },
    title: {
        fontSize: fontSize.labels.large,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: fontSize.labels.medium,
        color: "#666",
    },
    arrowContainer: {
        paddingLeft: 8,
    },
    notificationWrapper: {
        flexDirection: "row",
        alignItems: "center",
    }
});
