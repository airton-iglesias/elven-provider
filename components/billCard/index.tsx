import DollarIcon from "@/assets/icons/dollarIcon";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import { AppColors } from "@/constants/colors";

const statusColors = {
    1: "#1A73E8",
    2: "#DC2626",
    3: "#15803D",
};

const statusTexts = {
    1: "Aberto",
    2: "Atrasado",
    3: "Pago",
};

interface BillCardProps {
    item: {
        id?: string;
        title: string;
        due_day: string;
        value: string;
    };
    plan?: any;
    status: 1 | 2 | 3;
    showStatus: boolean;
    onPress?: () => void;
    iconStatus?: boolean;
    chevron?: boolean;
    type: "history" | "details" | "default";
    overdueCount?: number;
    openCount?: number;
    isFirstMonth?: boolean;
    firstMonthInformative?: () => void;
}

export default function BillCard({
    item,
    status,
    onPress,
    plan,
    isFirstMonth,
    firstMonthInformative,
    showStatus,
    iconStatus,
    chevron,
    type,
    overdueCount,
}: BillCardProps) {

    const subtitle = (() => {
        if (type === "details") {
            if (status === 1) return "Sua fatura do mês está pronta!";
            if (status === 2) return "Sua fatura do mês está em atraso!";
            return "Sua fatura do mês está paga!";
        }

        if (type === "default") {
            if (overdueCount && overdueCount > 0) return `Você possui ${overdueCount} fatura${overdueCount > 1 ? "s" : ""} em atraso.`;
            if (status === 3) return "Sua última fatura foi paga.";
            if (status === 1) return "Sua fatura do mês está pronta.";
        }

        return "";
    })();

    const handlePress = () => {
        if (isFirstMonth && firstMonthInformative) {
            firstMonthInformative();
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity style={styles.historyCard} activeOpacity={0.7} onPress={handlePress} disabled={!onPress}>
            <View style={styles.historyCardWrapper}>
                <View style={[styles.cardIcon, { backgroundColor: iconStatus ? (overdueCount && overdueCount > 0 ? statusColors[2] : statusColors[status]) : "#D96A0B" }]}>
                    <DollarIcon />
                </View>
                <View>
                    <Text style={styles.historyTitle}>{`Fatura - Fibra ${plan}`}</Text>
                    {type === "history" ? (
                        <Text style={styles.historyDate}>
                            {item.due_day ? `${item.due_day.substring(5, 7)}/${item.due_day.substring(0, 4)} - R$ ${item.value}` : "Data não disponível" + ` - R$ ${item.value}`}
                        </Text>
                    ) : (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}
                    {showStatus && (
                        <View style={[styles.statusWrapper, { backgroundColor: statusColors[status] },]}>
                            <Text style={styles.paidLabel}>{statusTexts[status]}</Text>
                        </View>
                    )}
                </View>
            </View>
            {chevron && <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardIcon: {
        width: 60,
        height: 60,
        backgroundColor: "#15803D",
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    historyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        flexDirection: "row",
        flex: 1,
        borderColor: AppColors.internal.border,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
        height: 100,
    },
    historyCardWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    historyTitle: {
        fontSize: fontSize.labels.large,
        fontWeight: "bold",
        color: "#333333",
    },
    historyDate: {
        fontSize: fontSize.labels.medium,
        color: "#888888",
        marginTop: 4,
    },
    subtitle: {
        fontSize: fontSize.labels.medium,
        color: "#888888",
        marginTop: 4,
    },
    statusWrapper: {
        marginTop: 8,
        borderRadius: 12,
        width: 70,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    paidLabel: {
        color: "#FFFFFF",
        fontSize: fontSize.labels.medium,
        textAlign: "center",
    },
});
