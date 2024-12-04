import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import PlanSkeleton from '@/components/planSkeleton';
import BillSkeleton from '@/components/billSkeketon';
import TopBar from '@/components/topbar';
import BillCard from '@/components/billCard';

interface PlanDetails {
    title: string;
    price: string;
    status: 'Ativo' | 'Bloqueado';
}

interface PaymentHistoryItem {
    id: string;
    status: 'pago' | 'aberto' | 'atrasado';
    title: string;
    date: string;
    amount: string;
}

interface InitialData {
    planDetails: PlanDetails;
    paymentHistory: PaymentHistoryItem[];
}

export default function Home() {
    const [data, setData] = useState<InitialData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentInvoice, setCurrentInvoice] = useState<PaymentHistoryItem | null>(null);
    const [overdueInvoices, setOverdueInvoices] = useState<PaymentHistoryItem[]>([]);
    const [openInvoices, setOpenInvoices] = useState<PaymentHistoryItem[]>([]);


    useEffect(() => {
        // Simulação de requisição
        const requestData: InitialData = {
            planDetails: {
                title: "Fibra - 9999 Mbps",
                price: "999,99",
                status: "Bloqueado"
            },
            paymentHistory: [
                {
                    id: '1',
                    status: 'aberto',
                    title: 'Fatura - 10/2024',
                    date: '10/2024',
                    amount: 'R$ 999,99',
                },
                {
                    id: '2',
                    status: 'pago',
                    title: 'Fatura - 09/2024',
                    date: '09/2024',
                    amount: 'R$ 999,99',
                },
            ]
        };

        setTimeout(() => {
            setData(requestData);
            setIsLoading(false);

            const paymentHistory = requestData.paymentHistory;

            // Separar faturas abertas e em atraso
            const openInvoicesList = paymentHistory.filter(item => item.status === 'aberto');
            const overdueInvoicesList = paymentHistory.filter(item => item.status === 'atrasado');

            setOpenInvoices(openInvoicesList);
            setOverdueInvoices(overdueInvoicesList);

            let current: PaymentHistoryItem | null = null;

            if (openInvoicesList.length > 0) {
                current = openInvoicesList[0];
            } else if (overdueInvoicesList.length > 0) {
                current = overdueInvoicesList[0];
            } else if (paymentHistory.length > 0) {
                current = paymentHistory[0]; // Fatura paga mais recente
            }
            else {
                current = {
                    id: '0',
                    status: 'pago',
                    title: requestData.planDetails.title,
                    date: 'undefined',
                    amount: 'undefined',
                };
            }

            setCurrentInvoice(current);
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.external.primary }}>
            <TopBar />
            {/* Seção de Pagamento */}
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24, backgroundColor: '#F5F5F5' }}>
                <View style={{ top: -20 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{'Pagamento'}</Text>
                    </View>

                    {isLoading ? (
                        <BillSkeleton />
                    ) : data && currentInvoice ? (
                        <View style={{ height: 100 }}>
                            <BillCard
                                item={currentInvoice}
                                status={currentInvoice.status}
                                showStatus={false}
                                iconStatus
                                chevron
                                type={'default'}
                                overdueCount={overdueInvoices.length}
                                openCount={openInvoices.length}
                                onPress={() => router.push({ pathname: '/paymentDetails', params: { id: currentInvoice.id } })}
                            />
                        </View>
                    ) : null}
                </View>

                {/* Seção do Plano */}
                <View style={{ top: -20 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{'Seu plano'}</Text>
                    </View>
                    {isLoading ? (
                        <PlanSkeleton />
                    ) : data ? (
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={[styles.iconCircle, { backgroundColor: AppColors.internal.button }]}>
                                    <Ionicons name="rocket-outline" size={24} color="white" />
                                </View>
                                <View style={styles.labelsWrapper}>
                                    <Text style={styles.title}>{data.planDetails.title}</Text>
                                    <Text style={styles.subtitle}>
                                        R$ {data.planDetails.price}/mês
                                    </Text>
                                    <View style={[styles.statusButton, data.planDetails.status === 'Ativo' ? { backgroundColor: '#15803D' } : { backgroundColor: '#DC2626' }]}>
                                        <Text style={styles.statusText}>{data.planDetails.status}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5592985500742&text=Ol%C3%A1%2C%20acessei%20o%20app%20e%20fiquei%20interessado%20em%20turbinar%20o%20meu%20plano.%20Quais%20s%C3%A3o%20os%20planos%20dispon%C3%ADveis%3F')}>
                                <Text style={styles.actionText}>{'Turbine seu plano'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    labelsWrapper: {
        gap: 5,
    },
    title: {
        fontSize: fontSize.titles.mini,
        fontWeight: 'bold',
        color: '#333333',
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
    },
    statusButton: {
        paddingVertical: 6,
        borderRadius: 999,
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 3,
        width: 70,
        height: 25,
        justifyContent: 'center',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: fontSize.labels.mini,
    },
    actionButton: {
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
    },
});
