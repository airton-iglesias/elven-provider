import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ToastAndroid, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import PdfIcon from '@/assets/icons/pdfIcon';
import ShareIcon from '@/assets/icons/shareIcon';
import BarCodeIcon from '@/assets/icons/barCodeIcon';
import PixIcon from '@/assets/icons/pixIcon';
import { router } from 'expo-router';
import TopBar from '@/components/topbar';
import ActionButton from '@/components/actionButton';
import BillCard from '@/components/billCard';
import BillSkeleton from '@/components/billSkeketon';
import InformativeModal from '@/components/informativeModal';
import { Skeleton } from 'moti/skeleton';
import PixCodeModal from '@/components/pixCodeModal';
import BarCodeModal from '@/components/barCodeModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MIKWEB_TOKEN } from '@/constants/tokens';


export default function Payment() {
    const [userPlan, setUserPlan] = useState<any>(null);
    const [paymentDay, setPaymentDay] = useState<string>('');
    const [billings, setBillings] = useState<any>([]);
    const [currentInvoice, setCurrentInvoice] = useState<any>(null);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPixCodeModalVisible, setIsPixCodeModalVisible] = useState<boolean>(false);
    const [isBarCodeModalVisible, setIsBarCodeModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChangingPaymentDay, setIsChangingPaymentDay] = useState<boolean>(false);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');
    const [isFirstMonth, setIsFirstMonth] = useState<boolean>(false);

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

                if (userStoredDatas && userStoredDatas.due_day) {
                    setPaymentDay(userStoredDatas.due_day);
                    setUserPlan(userStoredDatas.plan.name);
                }

                const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings?customer_id=${userStoredDatas.id}&sort_field=due_day&sort_direction=desc`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${MIKWEB_TOKEN}`
                    }
                });

                if (!response.ok) { throw new Error("Erro na requisição"); }

                const result = await response.json();
                const filtered = filterInvoices(result.billings);

                if (filtered.length > 0) {
                    setCurrentInvoice(filtered[0]);
                    setBillings(filtered.slice(1));
                } else {
                    setCurrentInvoice([]);
                    setBillings([]);
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

    const billingsList = billings.filter((item: any) => item.id !== currentInvoice?.id);

    const changePaymentDay = async (day: string) => {
        setIsChangingPaymentDay(true);

        // Simulação de requisição para atualizar o dia de pagamento
        setTimeout(() => {
            setPaymentDay(day);
            setIsModalVisible(false);
            setIsChangingPaymentDay(false);
            setInformativeModalText(`O dia de pagamento foi alterado com sucesso para ${day}.`);
            setIsInformativeModalVisible(true);
        }, 2000);
    };

    // Função para baixar a fatura
    const downloadInvoice = async (): Promise<void> => {
        if (!currentInvoice?.integration_link) {
            ToastAndroid.show('O link para download não está disponível.', ToastAndroid.SHORT);
            return;
        }

        try {
            Linking.openURL(currentInvoice.integration_link);
            setInformativeModalText(`A 2ª via da última fatura está sendo baixada. Verifique seus arquivos.`);
            setIsInformativeModalVisible(true);
        } catch (error) {
            console.error('Erro ao abrir o link da fatura:', error);
            ToastAndroid.show('Não foi possível baixar a fatura.', ToastAndroid.SHORT);
        }
    };

    const shareInvoice = async (): Promise<void> => {
        if (!currentInvoice?.integration_link) {
            ToastAndroid.show('O link da fatura não está disponível.', ToastAndroid.SHORT);
            return;
        }

        try {
            const fileUri: string = FileSystem.cacheDirectory + `${currentInvoice.id}.pdf`;

            const downloadResult = await FileSystem.downloadAsync(
                currentInvoice.integration_link,
                fileUri
            );

            if (!(await Sharing.isAvailableAsync())) {
                ToastAndroid.show('O compartilhamento não está disponível no seu dispositivo.', ToastAndroid.SHORT);
                return;
            }

            await Sharing.shareAsync(downloadResult.uri);

            ToastAndroid.show('Fatura compartilhada com sucesso!', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Erro ao compartilhar a fatura:', error);
            ToastAndroid.show('Não foi possível compartilhar a fatura.', ToastAndroid.SHORT);
        }
    };


    const firstMonthInformative = () => {
        setInformativeModalText(`Esse é o seu primeiro mês de contrato. Portanto, você ainda não tem histórico de pagamentos ou detalhes de faturas.`);
        setIsInformativeModalVisible(true);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.external.primary }}>
            <TopBar />

            <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: 24 }}>
                <View style={{ paddingHorizontal: 20, gap: 20, flex: 1 }}>
                    {/* Card Fatura */}

                    {!isLoading && currentInvoice ? (
                        <View style={{ height: 100 }}>
                            <BillCard
                                item={currentInvoice}
                                plan={userPlan || ''}
                                status={currentInvoice.situation_id || 3}
                                showStatus={false}
                                iconStatus
                                chevron
                                type={'details'}
                                isFirstMonth={isFirstMonth}
                                firstMonthInformative={firstMonthInformative}
                                onPress={() => router.push({ pathname: '/paymentDetails', params: { id: currentInvoice.id } })}
                            />
                        </View>
                    ) : (<BillSkeleton />)}

                    {isLoading ? (
                        <View style={styles.buttonsContainer}>
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                        </View>
                    ) : (
                        currentInvoice?.situation_id !== 3 && !isFirstMonth && (
                            <View style={styles.buttonsContainer}>
                                <ActionButton text="Pagar com pix" icon={<PixIcon />} onPress={() => { isFirstMonth ? firstMonthInformative() : setIsPixCodeModalVisible(true); }} disabled={isLoading} />
                                <ActionButton text="Código de barras" icon={<BarCodeIcon />} onPress={() => { isFirstMonth ? firstMonthInformative() : setIsBarCodeModalVisible(true) }} disabled={isLoading} />
                                <ActionButton text="2ª via da última fatura" icon={<PdfIcon />} onPress={() => isFirstMonth ? firstMonthInformative() : downloadInvoice()} disabled={isLoading} />
                                <ActionButton text="Compartilhar fatura" icon={<ShareIcon />} onPress={() => { isFirstMonth ? firstMonthInformative() : shareInvoice() }} disabled={isLoading} />
                            </View>)
                    )}

                    {/* Dia do vencimento */}
                    <View style={styles.expirationContainer}>
                        <TouchableOpacity
                            style={styles.expirationButton}
                            activeOpacity={0.7}
                            onPress={() => setIsModalVisible(true)}
                            disabled={true}
                        >
                            <View style={{ gap: 5 }}>
                                <Text style={styles.expirationTitle}>Dia do vencimento:</Text>
                                {isLoading ? (
                                    <Skeleton width={100} height={20} radius={8} colorMode="light" />
                                ) : (
                                    <Text style={styles.expirationSubtitle}>Todo dia {paymentDay}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Histórico de pagamentos */}
                    <Text style={styles.sectionTitle}>Histórico de pagamentos</Text>

                    {isLoading ? (
                        <View style={{ gap: 15 }}>
                            <BillSkeleton />
                            <BillSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={billingsList}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
                            renderItem={({ item }) => {
                                return (
                                    <BillCard
                                        item={item}
                                        plan={userPlan || ''}
                                        onPress={() => { router.push({ pathname: '/paymentDetails', params: { id: item.id } }) }}
                                        status={item.situation_id}
                                        iconStatus={false}
                                        showStatus
                                        chevron
                                        type={'history'}
                                    />
                                );
                            }}
                        />
                    )}
                </View>
            </View>

            {!isLoading && !isFirstMonth && (
                <PixCodeModal
                    isModalVisible={isPixCodeModalVisible}
                    setIsModalVisible={setIsPixCodeModalVisible}
                    id={currentInvoice?.id}
                />
            )}

            {!isLoading && !isFirstMonth && (
                <BarCodeModal
                    isModalVisible={isBarCodeModalVisible}
                    setIsModalVisible={setIsBarCodeModalVisible}
                    id={currentInvoice?.id}
                />
            )}

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: 16,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    headerText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIcon: {
        width: 30,
        height: 30,
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardPartWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#333333',
    },
    expirationContainer: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    expirationTitle: {
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        color: '#333333',
    },
    expirationSubtitle: {
        fontSize: fontSize.labels.medium,
        color: '#888888',
    },
    expirationButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});