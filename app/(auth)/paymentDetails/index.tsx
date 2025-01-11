import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import PdfIcon from '@/assets/icons/pdfIcon';
import ShareIcon from '@/assets/icons/shareIcon';
import BarCodeIcon from '@/assets/icons/barCodeIcon';
import PixIcon from '@/assets/icons/pixIcon';
import { router, useLocalSearchParams } from 'expo-router';
import BillCard from '@/components/billCard';
import ActionButton from '@/components/actionButton';
import PixCodeModal from '@/components/pixCodeModal';
import BarCodeModal from '@/components/barCodeModal';
import InformativeModal from '@/components/informativeModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import BillSkeleton from '@/components/billSkeketon';
import { Skeleton } from 'moti/skeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentDetails() {
    const { id } = useLocalSearchParams();
    const [currentInvoice, setCurrentInvoice] = useState<any>(null);
    const [userDatas, setUserDatas] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Variáveis de UI
    const [isPixCodeModalVisible, setIsPixCodeModalVisible] = useState<boolean>(false);
    const [isBarCodeModalVisible, setIsBarCodeModalVisible] = useState<boolean>(false);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const getData = await AsyncStorage.getItem('customerData');
                const userStoredDatas = getData ? JSON.parse(getData) : null;
                setUserDatas(userStoredDatas);

                const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ALPBKXMNQC:Q0I9WSDEBHWQBDA4PTRDNVSD5QKT3TCZ`
                    }
                });

                if (!response.ok) { throw new Error("Erro na requisição"); }

                const result = await response.json();
                setCurrentInvoice(result.billing);

            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

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
            const fileUri: string = FileSystem.cacheDirectory + `${id}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, 'fakePdfContent', { encoding: FileSystem.EncodingType.Base64 });

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

    const penaltyRate = 0.02;
    const monthlyInterestRate = 0.0025;

    const calculateInterest = (dueDate: any = new Date(), paymentDate: any = new Date(), value: number): number => {
        if (paymentDate <= dueDate) { return 0; }
        const daysLate = ((paymentDate - dueDate) / 86400000) / 30;
        const interest = (Math.trunc((value * monthlyInterestRate * daysLate) * 100) / 100);
        return interest;
    };

    const calculateInvoiceDetails = (currentInvoice: any | null) => {
        if (!currentInvoice) { return { totalAmount: 0, interest: 0, penalty: 0 }; }

        const { value, due_day, date_payment } = currentInvoice;

        if (!due_day || isNaN(new Date(due_day).getTime())) { return { totalAmount: 0, interest: 0, penalty: 0 }; }

        const dueDate = new Date(due_day);
        const paymentDate = date_payment ? new Date(date_payment) : new Date();

        if (isNaN(dueDate.getTime())) { return { totalAmount: 0, interest: 0, penalty: 0 }; }

        let penalty = 0.00;
        let interest = 0.00;

        if (paymentDate > dueDate) {
            penalty = value * penaltyRate;
            interest = calculateInterest(dueDate, paymentDate, value);
        }

        const totalWithInterestAndPenalty = value + interest + penalty;

        return {
            totalAmount: Math.trunc(totalWithInterestAndPenalty * 100) / 100,
            interest: interest,
            penalty: Math.trunc(penalty * 100) / 100,
        };
    };

    const { totalAmount, interest, penalty } = calculateInvoiceDetails(currentInvoice);



    return (
        <SafeAreaView
            style={[{ flex: 1 }, isInformativeModalVisible || isPixCodeModalVisible || isBarCodeModalVisible
                ? { backgroundColor: '#7A7A7A' }
                : { backgroundColor: '#F5F5F5' }]}
        >
            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Fatura</Text>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <AntDesign name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 20, gap: 20, flex: 1 }}>
                    {/* Card Fatura */}
                    <View style={{ height: 100 }}>
                        {isLoading ?
                            <BillSkeleton />
                            :
                            <BillCard
                                item={currentInvoice}
                                plan={userDatas?.plan?.name || ''}
                                status={currentInvoice?.situation_id || 3}
                                showStatus={false}
                                iconStatus
                                type={'history'}
                                chevron={false}
                            />
                        }
                    </View>

                    {/* Botões de ação */}
                    {isLoading ? (
                        <View style={styles.buttonsContainer}>
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                            <Skeleton width={60} height={60} radius={10} colorMode='light' />
                        </View>
                    ) : (
                        currentInvoice?.situation_id !== 3 && (
                            <View style={styles.buttonsContainer}>
                                <ActionButton text="Pagar com pix" icon={<PixIcon />} onPress={() => setIsPixCodeModalVisible(true)} disabled={isLoading} />
                                <ActionButton text="Código de barras" icon={<BarCodeIcon />} onPress={() => setIsBarCodeModalVisible(true)} disabled={isLoading} />
                                <ActionButton text="2ª via da última fatura" icon={<PdfIcon />} onPress={downloadInvoice} disabled={isLoading} />
                                <ActionButton text="Compartilhar fatura" icon={<ShareIcon />} onPress={shareInvoice} disabled={isLoading} />
                            </View>
                        )
                    )}

                    {/* Detalhes da fatura */}
                    <Text style={styles.sectionTitle}>Detalhes da fatura</Text>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Valor da mensalidade</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>  R$ {parseFloat(userDatas?.plan.value).toFixed(2)}</Text>
                            }
                        </View>

                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Multa</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>R$ {penalty.toFixed(2)}</Text>
                            }
                        </View>

                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Juros</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>R$ {interest.toFixed(2)}</Text>
                            }
                        </View>
                        {userDatas?.monthly_discount && (
                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsText}>Descontos</Text>
                                {isLoading ?
                                    <Skeleton width={80} height={24} colorMode='light' />
                                    : <Text style={styles.detailsText}>R$ -{userDatas?.monthly_discount.toFixed(2)}</Text>
                                }
                            </View>
                        )}

                        <View style={[styles.detailsRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.detailsText}>Valor total</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                :
                                <Text style={styles.detailsText}>R$ {totalAmount.toFixed(2)}</Text>
                            }
                        </View>
                    </View>
                </View>
            </View>
            {/* Modais */}

            {!isLoading && (
                <PixCodeModal
                    value={totalAmount}
                    isModalVisible={isPixCodeModalVisible}
                    setIsModalVisible={setIsPixCodeModalVisible}
                    id={id}
                />
            )}

            {!isLoading && (
                <BarCodeModal
                    value={totalAmount}
                    isModalVisible={isBarCodeModalVisible}
                    setIsModalVisible={setIsBarCodeModalVisible}
                    id={id}
                />
            )}

            <InformativeModal
                isModalVisible={isInformativeModalVisible}
                setIsModalVisible={setIsInformativeModalVisible}
                text={informativeModalText}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#333333',
    },
    detailsContainer: {},
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 15,
        borderBottomColor: '#D9D9D9',
    },
    detailsText: {
        fontSize: fontSize.labels.medium,
    },
});
