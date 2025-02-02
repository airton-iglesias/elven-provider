import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const billStatusColors: Record<number, string> = {
    1: "#1A73E8",
    2: "#DC2626",
    3: "#15803D",
};

const billStatusLabels: Record<number, string> = {
    1: "Aberto",
    2: "Atrasado",
    3: "Pago",
};

interface BillItem {
    id?: string;
    title: string;
    due_day: string;
    value: number;
    value_paid: number;
}

interface BillCardProps {
    item: BillItem;
    status: 1 | 2 | 3;
    onCardPress?: () => void;
    isFirstBillMonth?: boolean;
    onFirstMonthInfoPress?: () => void;
}

export default function BillCard({
    item,
    status,
    onCardPress,
    isFirstBillMonth,
    onFirstMonthInfoPress,
}: BillCardProps) {

    const handleCardPress = () => {
        if (isFirstBillMonth && onFirstMonthInfoPress) {
            onFirstMonthInfoPress();
        } else if (onCardPress) {
            onCardPress();
        }
    };

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            onPress={handleCardPress}
            disabled={!onCardPress}
        >
            <View style={styles.cardContentWrapper}>
                <View
                    style={styles.iconContainer}>
                    {/* <DollarIcon /> */}
                    <FontAwesome6 name="file-invoice-dollar" size={28} color="white" />
                </View>
                <View style={styles.billInfo}>
                    <Text style={styles.billTitle}>{`Fatura - ${item?.due_day.substring(5, 7)}/${item?.due_day.substring(2, 4)}`}</Text>
                    <Text style={styles.billAmount}>
                        {`#${item?.id} - R$ ${(item?.value_paid || item.value).toFixed(2).replace('.', ',')}`}
                    </Text>


                    <View style={[styles.statusBadge, { backgroundColor: billStatusColors[status] }]}>
                        <Text style={styles.statusLabel}>
                            {billStatusLabels[status]}
                        </Text>
                    </View>

                </View>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: "#D96A0B"
    },
    cardContainer: {
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
    cardContentWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    billInfo: {
        gap: 5
    },
    billTitle: {
        fontSize: fontSize.labels.extralarge,
        fontWeight: "bold",
        color: "#000",
    },
    billAmount: {
        fontSize: fontSize.labels.medium,
        color: "#555",
        marginBottom: 2
    },
    statusBadge: {
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    statusLabel: {
        color: "#FFFFFF",
        fontSize: fontSize.labels.medium,
        textAlign: "center",
    },
});
