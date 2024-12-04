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
import { AppColors } from '@/constants/colors';
import BillSkeleton from '@/components/billSkeketon';
import { Skeleton } from 'moti/skeleton';

interface InitialData {
    status: 'pago' | 'aberto' | 'atrasado';
    title: string;
    date: string;
    amount: string;
    mensalidade: string;
    juros: string;
    multa: string;
    valorTotal: string;
}

export default function PaymentDetails() {
    const { id } = useLocalSearchParams();
    const [currentInvoice, setCurrentInvoice] = useState<InitialData | null>(null);

    // Variáveis de UI
    const [isPixCodeModalVisible, setIsPixCodeModalVisible] = useState<boolean>(false);
    const [isBarCodeModalVisible, setIsBarCodeModalVisible] = useState<boolean>(false);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Conteúdo base64 de um PDF, só pro botão de compartilhar funcionar
    const base64PdfContent = 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAyMDAgMjAwXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNzAgNTAgVGQKL0YxIDI0IFRmCihIZWxsbywgV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDEwIDEwIG4KMDAwMDAwMDA2NCAwMDAwIG4KMDAwMDAwMDEyMiAwMDAwIG4KMDAwMDAwMDIwNyAwMDAwIG4KMDAwMDAwMDI5OSAwMDAwIG4KdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgowCjUlRU9GCg==';

    useEffect(() => {
        const requestData: InitialData = {
            status: 'aberto',
            title: 'Fatura - Fibra 999 Mbps',
            date: '10/2024',
            amount: 'R$ 299,90',
            mensalidade: 'R$ 200,00',
            juros: 'R$ 5,00',
            multa: 'R$ 10,00',
            valorTotal: 'R$ 215,00',
        };
        setTimeout(() => {
            setCurrentInvoice(requestData);
            setIsLoading(false);
        }, 3000);
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
            // Criar um arquivo PDF fake no sistema de arquivos
            const fileUri: string = FileSystem.cacheDirectory + `${id}.pdf`;

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

    return (
        <SafeAreaView
            style={[
                { flex: 1 },
                isInformativeModalVisible || isPixCodeModalVisible || isBarCodeModalVisible
                    ? { backgroundColor: '#7A7A7A' }
                    : { backgroundColor: '#F5F5F5' },
            ]}
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
                                item={{
                                    title: currentInvoice?.title || 'undefined',
                                    date: currentInvoice?.date || 'undefined',
                                    amount: currentInvoice?.amount || 'undefined',
                                }}
                                status={currentInvoice?.status || 'pago'}
                                showStatus={false}
                                iconStatus
                                type={'details'}
                                chevron={false}
                            />
                        }

                    </View>

                    {/* Botões de ação */}
                    <View style={[styles.buttonsContainer, currentInvoice?.status !== 'pago' ? { justifyContent: 'space-between' } : { gap: 25 }]}>
                        {currentInvoice?.status !== 'pago' && (
                            <ActionButton text="Pagar com pix" icon={<PixIcon />} onPress={() => setIsPixCodeModalVisible(true)} disabled={isLoading} />
                        )}
                        {currentInvoice?.status !== 'pago' && (
                            <ActionButton
                                text="Código de barras"
                                icon={<BarCodeIcon />}
                                onPress={() => setIsBarCodeModalVisible(true)}
                                disabled={isLoading}
                            />
                        )}
                        <ActionButton text="2ª via da última fatura" icon={<PdfIcon />} onPress={downloadInvoice} disabled={isLoading} />
                        <ActionButton text="Compartilhar fatura" icon={<ShareIcon />} onPress={shareInvoice} disabled={isLoading} />
                    </View>

                    {/* Detalhes da fatura */}
                    <Text style={styles.sectionTitle}>Detalhes da fatura</Text>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Valor da mensalidade</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>{currentInvoice?.mensalidade}</Text>
                            }
                        </View>

                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Juros</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>{currentInvoice?.juros}</Text>
                            }

                        </View>

                        <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>Multa</Text>

                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                : <Text style={styles.detailsText}>{currentInvoice?.multa}</Text>
                            }
                        </View>

                        <View style={[styles.detailsRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.detailsText}>Valor total</Text>
                            {isLoading ?
                                <Skeleton width={80} height={24} colorMode='light' />
                                :
                                <Text style={styles.detailsText}>{currentInvoice?.valorTotal}</Text>
                            }
                        </View>
                    </View>
                </View>

            </View>
            <PixCodeModal
                isModalVisible={isPixCodeModalVisible}
                setIsModalVisible={setIsPixCodeModalVisible}
                id={id || ''}
            />

            <BarCodeModal
                isModalVisible={isBarCodeModalVisible}
                setIsModalVisible={setIsBarCodeModalVisible}
                id={id || ''}
            />

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
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold' as const,
    },
    buttonsContainer: {
        flexDirection: 'row' as const,
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold' as const,
        color: '#333333',
    },
    detailsContainer: {},
    detailsRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 15,
        borderBottomColor: '#D9D9D9',
    },
    detailsText: {
        fontSize: fontSize.labels.medium,
    },
});
