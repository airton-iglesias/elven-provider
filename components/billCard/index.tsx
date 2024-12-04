import DollarIcon from "@/assets/icons/dollarIcon";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { fontSize } from "@/constants/fonts";
import { AppColors } from "@/constants/colors";

interface statusText {
    pago: string;
    aberto: string;
    atrasado: string;
}

interface statusColors {
    pago: string;
    aberto: string;
    atrasado: string;
}

interface BillCardProps {
    item: {
        id?: string;
        title: string;
        date: string;
        amount: string;
    };
    status: 'pago' | 'aberto' | 'atrasado';
    showStatus: boolean;
    onPress?: () => void;
    iconStatus?: boolean;
    chevron?: boolean;
    type: 'history' | 'details' | 'default';
    overdueCount?: number;
    openCount?: number;
    isFirstMonth?: boolean;
    firstMonthInformative?: () => void;
}

export default function BillCard({
    item,
    status,
    onPress,
    isFirstMonth,
    firstMonthInformative,
    showStatus,
    iconStatus,
    chevron,
    type,
    overdueCount = 0,
    openCount = 0,
}: BillCardProps) {
    const statusColors: statusColors = {
        pago: '#15803D',
        aberto: '#1A73E8',
        atrasado: '#DC2626',
    };

    const statusTexts: statusText = {
        pago: 'Pago',
        aberto: 'Aberto',
        atrasado: 'Atrasado',
    };

    // Cálculo do subtítulo
    let subtitle = '';

    if (type === 'details') {
        if (status === 'aberto') {
            subtitle = 'Sua fatura do mês está pronta!';
        } else if (status === 'atrasado') {
            subtitle = 'Sua fatura do mês está em atraso!';
        } else if (status === 'pago') {
            subtitle = 'Sua fatura do mês está paga!';
        }
    } else if (type === 'default') {
        if (status === 'pago') {
            subtitle = 'Sua última fatura foi paga.';
        } else if (status === 'aberto') {
            subtitle = 'Sua fatura do mês está pronta.';
        } else if (status === 'atrasado') {
            subtitle = `Você possui ${overdueCount} fatura${overdueCount > 1 ? 's' : ''} em atraso.`;
        }
    }

    const handlePress = () => {
        if (isFirstMonth && firstMonthInformative) {
            firstMonthInformative();
            return;
        }

        if (onPress) {
            onPress();
        }

    };

    return (
        <TouchableOpacity style={styles.historyCard} activeOpacity={0.7} onPress={handlePress} disabled={onPress ? false : true}>
            <View style={styles.historyCardWrapper}>
                <View style={[styles.cardIcon, iconStatus ? { backgroundColor: statusColors[status] } : { backgroundColor: '#D96A0B' }]}>
                    <DollarIcon />
                </View>

                <View>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    {type === 'history' ? (
                        <Text style={styles.historyDate}>{`${item.date} - ${item.amount}`}</Text>
                    ) : (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}

                    {showStatus && (
                        <View style={[styles.statusWrapper, { backgroundColor: statusColors[status] }]}>
                            <Text style={styles.paidLabel}>{statusTexts[status]}</Text>
                        </View>
                    )}
                </View>
            </View>
            {chevron && (
                <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#15803D',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    historyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        flexDirection: 'row',
        flex: 1,
        borderColor: AppColors.internal.border,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
    },
    historyCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyTitle: {
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        color: '#333333',
    },
    historyDate: {
        fontSize: fontSize.labels.medium,
        color: '#888888',
        marginTop: 4,
    },
    subtitle: {
        fontSize: fontSize.labels.medium,
        color: '#888888',
        marginTop: 4,
    },
    statusWrapper: {
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 75,
        height: 24,
        fontSize: 12,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paidLabel: {
        color: '#FFFFFF',
        fontSize: fontSize.labels.medium,
        textAlign: 'center',
    },
});
