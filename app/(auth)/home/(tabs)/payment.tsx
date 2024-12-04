import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ToastAndroid } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import PdfIcon from '@/assets/icons/pdfIcon';
import ShareIcon from '@/assets/icons/shareIcon';
import BarCodeIcon from '@/assets/icons/barCodeIcon';
import PixIcon from '@/assets/icons/pixIcon';
import { router } from 'expo-router';
import TopBar from '@/components/topbar';
import BillDateSelectModal from '@/components/billDateSelectModal';
import ActionButton from '@/components/actionButton';
import BillCard from '@/components/billCard';
import BillSkeleton from '@/components/billSkeketon';
import InformativeModal from '@/components/informativeModal';
import { Skeleton } from 'moti/skeleton';
import PixCodeModal from '@/components/pixCodeModal';
import BarCodeModal from '@/components/barCodeModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface PaymentHistoryItem {
    id: string;
    status: 'pago' | 'aberto' | 'atrasado';
    title: string;
    date: string;
    amount: string;
}

interface PaymentData {
    paymentDay: string;
    title: string;
    historyList: PaymentHistoryItem[];
}

export default function Payment() {
    const [paymentDay, setPaymentDay] = useState<string>('');
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
    const [currentInvoice, setCurrentInvoice] = useState<PaymentHistoryItem | null>(null);
    const [overdueInvoices, setOverdueInvoices] = useState<PaymentHistoryItem[]>([]);
    const [openInvoices, setOpenInvoices] = useState<PaymentHistoryItem[]>([]);

    // Variáveis de UI
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPixCodeModalVisible, setIsPixCodeModalVisible] = useState<boolean>(false);
    const [isBarCodeModalVisible, setIsBarCodeModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChangingPaymentDay, setIsChangingPaymentDay] = useState<boolean>(false);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');
    const [isFirstMonth, setIsFirstMonth] = useState<boolean>(false);

    // Conteúdo base64 de um PDF, só pro botão de compartilhar funcionar
    const base64PdfContent = 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAyMDAgMjAwXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNzAgNTAgVGQKL0YxIDI0IFRmCihIZWxsbywgV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDEwIDEwIG4KMDAwMDAwMDA2NCAwMDAwIG4KMDAwMDAwMDEyMiAwMDAwIG4KMDAwMDAwMDIwNyAwMDAwIG4KMDAwMDAwMDI5OSAwMDAwIG4KdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgowCjUlRU9GCg==';

    useEffect(() => {
        // Simulação de requisição de dados
        const data: PaymentData = {
            paymentDay: '05',
            title: "Fatura - Fibra 999 Mbps",
            historyList: [
                {
                    id: '1',
                    status: 'aberto',
                    title: 'Fatura - Fibra 999 Mbps',
                    date: '10/2024',
                    amount: 'R$ 299,90',
                },
                {
                    id: '2',
                    status: 'atrasado',
                    title: 'Fatura - Fibra 999 Mbps',
                    date: '09/2024',
                    amount: 'R$ 399,90',
                },
                {
                    id: '3',
                    status: 'pago',
                    title: 'Fatura - Fibra 999 Mbps',
                    date: '08/2024',
                    amount: 'R$ 499,90',
                },
            ],
        };

        // Simulação de atraso na requisição
        setTimeout(() => {
            setPaymentDay(data.paymentDay);
            setPaymentHistory(data.historyList);

            // Separar faturas abertas e em atraso
            const openInvoicesList = data.historyList.filter((item) => item.status === 'aberto');
            const overdueInvoicesList = data.historyList.filter((item) => item.status === 'atrasado');

            setOpenInvoices(openInvoicesList);
            setOverdueInvoices(overdueInvoicesList);

            let current: PaymentHistoryItem | null = null;

            if (openInvoicesList.length > 0) {
                current = openInvoicesList[0];
            } else if (overdueInvoicesList.length > 0) {
                current = overdueInvoicesList[0];
            } else if (data.historyList.length > 0) {
                current = data.historyList[0];
            } else {
                current = {
                    id: '0',
                    status: 'pago',
                    title: data.title,
                    date: 'undefined',
                    amount: 'undefined',
                };
                setIsFirstMonth(true);
            }
            setCurrentInvoice(current);
            setIsLoading(false);
        }, 2000);
    }, []);

    // Filtrar histórico sem a fatura atual
    const historyList = paymentHistory.filter((item) => item.id !== currentInvoice?.id);

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
        setInformativeModalText(`A 2º via da última fatura está sendo baixada, verifique os seus arquivos.`);
        setIsInformativeModalVisible(true);
    };

    // Função para compartilhar a fatura
    const shareInvoice = async (): Promise<void> => {
        if (!currentInvoice) {
            return;
        }

        try {
            // Criar um arquivo PDF fake no sistema de arquivos
            const fileUri: string = FileSystem.cacheDirectory + `${currentInvoice.id}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, base64PdfContent, { encoding: FileSystem.EncodingType.Base64 });

            if (!(await Sharing.isAvailableAsync())) {
                ToastAndroid.show('O compartilhamento não está disponível no seu dispositivo.', ToastAndroid.SHORT);
                return;
            }

            await Sharing.shareAsync(fileUri);

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
        <SafeAreaView
            style={[
                { flex: 1 },
                isModalVisible || isInformativeModalVisible || isPixCodeModalVisible || isBarCodeModalVisible
                    ? { backgroundColor: '#0D3A75' }
                    : { backgroundColor: AppColors.external.primary },
            ]}
        >
            <TopBar />

            <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: 24 }}>
                <View style={{ paddingHorizontal: 20, gap: 20, flex: 1 }}>
                    {/* Card Fatura */}

                    {!isLoading && currentInvoice ? (
                        <View style={{ height: 100 }}>
                            <BillCard
                                item={currentInvoice}
                                status={currentInvoice.status}
                                showStatus={false}
                                iconStatus
                                chevron
                                type={overdueInvoices.length > 1 ? 'default' : 'details'}
                                overdueCount={overdueInvoices.length}
                                openCount={openInvoices.length}
                                isFirstMonth={isFirstMonth}
                                firstMonthInformative={firstMonthInformative}
                                onPress={() => router.push({ pathname: '/paymentDetails', params: { id: currentInvoice.id } })}
                            />
                        </View>
                    ) : (
                        <BillSkeleton />
                    )}

                    {/* Botões de ação - pix, código de barras, etc */}

                    <View
                        style={[
                            styles.buttonsContainer,
                            currentInvoice?.status !== 'pago' ? { justifyContent: 'space-between' } : { gap: 25 },
                        ]}
                    >
                        {currentInvoice?.status !== 'pago' && (
                            <ActionButton text="Pagar com pix" icon={<PixIcon />} onPress={() => { isFirstMonth ? firstMonthInformative() : setIsPixCodeModalVisible(true); }} disabled={isLoading} />
                        )}
                        {currentInvoice?.status !== 'pago' && (
                            <ActionButton
                                text="Código de barras"
                                icon={<BarCodeIcon />}
                                onPress={() => { isFirstMonth ? firstMonthInformative() : setIsBarCodeModalVisible(true) }}
                                disabled={isLoading}
                            />
                        )}
                        <ActionButton text="2ª via da última fatura" icon={<PdfIcon />} onPress={() => isFirstMonth ? firstMonthInformative() : downloadInvoice()} disabled={isLoading} />
                        <ActionButton text="Compartilhar fatura" icon={<ShareIcon />} onPress={() => { isFirstMonth ? firstMonthInformative() : shareInvoice() }} disabled={isLoading} />
                    </View>

                    {/* Dia do vencimento */}
                    <View style={styles.expirationContainer}>
                        <TouchableOpacity
                            style={styles.expirationButton}
                            activeOpacity={0.7}
                            onPress={() => setIsModalVisible(true)}
                            disabled={isLoading}
                        >
                            <View style={{ gap: 5 }}>
                                <Text style={styles.expirationTitle}>Dia do vencimento:</Text>
                                {isLoading ? (
                                    <Skeleton width={100} height={20} radius={8} colorMode="light" />
                                ) : (
                                    <Text style={styles.expirationSubtitle}>Todo dia {paymentDay}</Text>
                                )}
                            </View>

                            <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
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
                            data={historyList}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
                            renderItem={({ item }) => {
                                return (
                                    <BillCard
                                        item={item}
                                        onPress={() => { router.push({ pathname: '/paymentDetails', params: { id: item.id } }) }}
                                        status={item.status}
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

            <BillDateSelectModal
                currentDay={paymentDay}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onDateSelect={(day: string) => {
                    changePaymentDay(day);
                }}
                isChangingPaymentDay={isChangingPaymentDay}
            />

            <PixCodeModal
                isModalVisible={isPixCodeModalVisible}
                setIsModalVisible={setIsPixCodeModalVisible}
                id={currentInvoice?.id || ''}
            />

            <BarCodeModal
                isModalVisible={isBarCodeModalVisible}
                setIsModalVisible={setIsBarCodeModalVisible}
                id={currentInvoice?.id || ''}
            />

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
