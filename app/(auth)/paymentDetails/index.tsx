import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
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
import { MIKWEB_TOKEN } from '@/constants/tokens';
import WarningIcon from '@/assets/icons/warningIcon';

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
                        'Authorization': `${MIKWEB_TOKEN}`
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


    // Função para compartilhar a fatura

    const shareInvoice = async (): Promise<void> => {
        if (!currentInvoice?.integration_link) {
            ToastAndroid.show('O link da fatura não está disponível.', ToastAndroid.SHORT);
            return;
        }

        try {
            const fileUri: string = FileSystem.cacheDirectory + `${currentInvoice.id}.pdf`;

            // Baixar o arquivo remoto e salvar localmente
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

    const penaltyRate = 0.02;

    const InvoiceDetails = (invoice: any) => {
        if (invoice?.value_paid && invoice?.value_paid > invoice?.value) {
            const penalty = penaltyRate * invoice.value;
            const interest = invoice.value_paid - invoice.value - penalty;

            return {
                totalAmount: invoice?.value_paid,
                penalty,
                interest,
            }
        }

        return {
            totalAmount: invoice?.value_paid || 0,
            penalty: 0,
            interest: 0,
        }
    }


    const { totalAmount, penalty, interest }: any = InvoiceDetails(currentInvoice);



    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#F5F5F5' }]}>

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

                    {/* Dia do vencimento */}
                    <View style={styles.expirationContainer}>
                        <TouchableOpacity
                            style={styles.expirationButton}
                            activeOpacity={0.7}
                            disabled={true}
                        >
                            <View style={{ gap: 5 }}>
                                <Text style={styles.expirationTitle}>Dia do vencimento:</Text>
                                {isLoading ? (
                                    <Skeleton width={100} height={20} radius={8} colorMode="light" />
                                ) : (
                                    <Text style={styles.expirationSubtitle}>{currentInvoice?.due_day.split("-").reverse().join("/")}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Detalhes da fatura */}
                    <Text style={styles.sectionTitle}>Detalhes da fatura</Text>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Valor da mensalidade</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>  R$ {currentInvoice?.value.toFixed(2).toString().replace('.', ',')}</Text>
                            }
                        </View>

                        {currentInvoice?.situation_id === 3 && (
                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsText}>Multa</Text>
                                {isLoading ?
                                    <Skeleton width={80} height={24} colorMode='light' />
                                    : <Text style={styles.detailsText}>R$ {penalty.toFixed(2).toString().replace('.', ',')}</Text>
                                }
                            </View>
                        )}

                        {currentInvoice?.situation_id === 3 && (
                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsText}>Juros</Text>
                                {isLoading ?
                                    <Skeleton width={80} height={24} colorMode='light' />
                                    : <Text style={styles.detailsText}>R$ {interest.toFixed(2).toString().replace('.', ',')}</Text>
                                }
                            </View>
                        )}

                        {currentInvoice?.situation_id == 3 && (
                            <View style={[styles.detailsRow, { borderBottomWidth: 0 }]}>
                                <Text style={styles.detailsText}>Valor Total</Text>
                                {isLoading ?
                                    <Skeleton width={80} height={24} colorMode='light' />
                                    :
                                    <Text style={styles.detailsText}>R$ {currentInvoice?.situation_id == 3 && totalAmount.toFixed(2).toString().replace('.', ',')}</Text>
                                }
                            </View>
                        )}
                    </View>

                    {currentInvoice?.situation_id === 2 && (
                        <View style={styles.modalWarningContainer}>
                            <View style={styles.modalWarningContent}>
                                <WarningIcon />
                                <Text style={styles.modalWarningText}>
                                    {`Faturas pagas com atraso possuem acréscimo de R$ ${(currentInvoice?.value * penaltyRate).toFixed(2).toString().replace('.', ',')} de multa e juros de 0,25% ao mês.`}
                                </Text>
                            </View>
                        </View>
                    )}
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
    modalWarningContainer: {
        backgroundColor: '#FFE69C',
        borderRadius: 10,
        width: '100%',
        padding: 20
    },
    modalWarningContent: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    modalWarningText: {
        flex: 1,
        color: '#997404'
    },
    expirationContainer: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: 10
    },
    expirationTitle: {
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
    },
    expirationSubtitle: {
        fontSize: fontSize.labels.medium,
    },
    expirationButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

});
