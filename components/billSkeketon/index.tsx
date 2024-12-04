import { AppColors } from "@/constants/colors";
import { Skeleton } from "moti/skeleton";
import { View, StyleSheet } from "react-native";

export default function BillSkeleton() {
    return (
        <View
            style={styles.cardPayment}
        >
            <View style={styles.rowPayment}>
                <View style={styles.cardPartWrapper}>
                    <View style={styles.cardIcon}>
                        <Skeleton height={60} width={60} radius={999} colorMode="light" />
                    </View>
                    <View style={{ gap: 4 }}>
                        <Skeleton height={30} width={200} colorMode="light" />
                        <Skeleton height={24} width={100} colorMode="light" />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
    },
    cardPayment: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        borderColor: AppColors.internal.border,
        borderWidth: 1,
    },
    cardPartWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#15803D',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowPayment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})