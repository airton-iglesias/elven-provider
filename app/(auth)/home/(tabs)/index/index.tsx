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
import AsyncStorage from '@react-native-async-storage/async-storage';
import InformativeModal from '@/components/informativeModal';


export default function Home() {
    const [currentInvoice, setCurrentInvoice] = useState<any>(null);
    const [userDatas, setUserDatas] = useState<any>(null);

    // Variáveis de UI
    const [isLoading, setIsLoading] = useState(true);
    const [informativeModalText, setInformativeModalText] = useState<string>('');
    const [isFirstMonth, setIsFirstMonth] = useState<boolean>(false);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [overdueCount, setOverdueCount] = useState<number>(0);

    const filterInvoices = (billings: any[]) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const filteredBillings = billings.filter((item) => {
            const [year, month] = item.due_day.split('-').map(Number);
            return (year < currentYear) || (year === currentYear && month <= currentMonth);
        });

        return filteredBillings;
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const getData = await AsyncStorage.getItem('customerData');
                const userStoredDatas = getData ? JSON.parse(getData) : null;
                setUserDatas(userStoredDatas);

                const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings?customer_id=${userStoredDatas.id}&sort_field=due_day&sort_direction=desc`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ALPBKXMNQC:Q0I9WSDEBHWQBDA4PTRDNVSD5QKT3TCZ`
                    }
                });

                if (!response.ok) { throw new Error("Erro na requisição"); }

                const result = await response.json();
                const filtered = filterInvoices(result.billings);
                const overdueInvoicesCount = filtered.filter(invoice => invoice.situation_id === 2).length;
                setOverdueCount(overdueInvoicesCount);

                if (filtered.length > 0) {
                    setCurrentInvoice(filtered[0]);
                } else {
                    setCurrentInvoice([]);
                    setIsFirstMonth(true)
                }
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const firstMonthInformative = () => {
        setInformativeModalText(`Esse é o seu primeiro mês de contrato. Portanto, você ainda não tem histórico de pagamentos ou detalhes de faturas.`);
        setIsInformativeModalVisible(true);
    }


    return (
        <SafeAreaView style={[{ flex: 1 }, isInformativeModalVisible ? { backgroundColor: '#0D3A75' } : { backgroundColor: AppColors.external.primary }]}>
            <TopBar />
            {/* Seção de Pagamento */}
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24, backgroundColor: '#F5F5F5' }}>
                <View style={{ top: -20 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{'Pagamento'}</Text>
                    </View>

                    {isLoading ? (<BillSkeleton />) : (
                        <View style={{ height: 100 }}>
                            <BillCard
                                item={currentInvoice}
                                plan={userDatas?.plan?.name || ''}
                                status={currentInvoice.situation_id || 3}
                                showStatus={false}
                                iconStatus
                                chevron
                                type={'default'}
                                overdueCount={overdueCount}
                                isFirstMonth={isFirstMonth}
                                firstMonthInformative={firstMonthInformative}
                                onPress={() => router.push({ pathname: '/paymentDetails', params: { id: currentInvoice.id } })}
                            />
                        </View>
                    )}
                </View>

                {/* Seção do Plano */}
                <View style={{ top: -20 }}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{'Seu plano'}</Text>
                    </View>


                    {isLoading ? (<PlanSkeleton />) :
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={[styles.iconCircle, { backgroundColor: AppColors.internal.button }]}>
                                    <Ionicons name="rocket-outline" size={24} color="white" />
                                </View>
                                <View style={styles.labelsWrapper}>
                                    <Text style={styles.title}>Fibra - {userDatas?.plan?.name}</Text>
                                    <Text style={styles.subtitle}>
                                        R$ {parseFloat(userDatas?.plan?.value).toFixed(2)} / mês
                                    </Text>
                                    <View style={[styles.statusButton, userDatas?.msg_payment_mk === 'L' ? { backgroundColor: '#15803D' } : { backgroundColor: '#DC2626' }]}>
                                        <Text style={styles.statusText}>{userDatas?.msg_payment_mk === 'L' ? 'Ativo' : 'Bloqueado'}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5592985500742&text=Ol%C3%A1%2C%20acessei%20o%20app%20e%20fiquei%20interessado%20em%20turbinar%20o%20meu%20plano.%20Quais%20s%C3%A3o%20os%20planos%20dispon%C3%ADveis%3F')}>
                                <Text style={styles.actionText}>{'Turbine seu plano'}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>

            <InformativeModal
                isModalVisible={isInformativeModalVisible}
                setIsModalVisible={setIsInformativeModalVisible}
                text={informativeModalText}
            />
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
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 3,
        width: 70,
        height: 25,
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
