import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import PdfIcon from '@/assets/icons/pdfIcon';
import ShareIcon from '@/assets/icons/shareIcon';
import BarCodeIcon from '@/assets/icons/barCodeIcon';
import PixIcon from '@/assets/icons/pixIcon';
import { router, useLocalSearchParams } from 'expo-router';
import ActionButton from '@/components/actionButton';
import PixCodeModal from '@/components/pixCodeModal';
import BarCodeModal from '@/components/barCodeModal';
import InformativeModal from '@/components/informativeModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Skeleton } from 'moti/skeleton';
import { MIKWEB_TOKEN } from '@/constants/tokens';
import WarningIcon from '@/assets/icons/warningIcon';
import { AppColors } from '@/constants/colors';

interface Customer {
    id: number;
    full_name: string;
    email: string;
}

interface Invoice {
    id: number;
    value: number;
    value_paid: number;
    date_payment: string;
    situation_id: number;
    reference: string;
    due_day: string;
    pix_copy_paste: string;
    digitable_line: string;
    integration_link: string;
    customer: Customer;
}

interface InvoiceDetails {
    totalAmount: number;
    penalty: number;
    interest: number;
}

export default function PaymentDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const statusTexts: Record<number, string> = {
        1: 'Aberto',
        2: 'Atrasado',
        3: 'Pago',
    };

    const statusColors: Record<number, string> = {
        1: '#1A73E8',
        2: '#DC2626',
        3: '#15803D',
    };

    const [isPixModalVisible, setIsPixModalVisible] = useState<boolean>(false);
    const [isBarCodeModalVisible, setIsBarCodeModalVisible] = useState<boolean>(false);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
    const [infoModalText, setInfoModalText] = useState<string>('');

    const calculateInvoiceDetails = (inv: Invoice | null): InvoiceDetails => {
        const penaltyRate = 0.02;
        if (inv && inv.value_paid && inv.value_paid > inv.value) {
            const penalty = penaltyRate * inv.value;
            const interest = inv.value_paid - inv.value - penalty;
            return {
                totalAmount: inv.value_paid,
                penalty,
                interest,
            };
        }
        return {
            totalAmount: inv?.value_paid || 0,
            penalty: 0,
            interest: 0,
        };
    };

    const { totalAmount, penalty, interest } = calculateInvoiceDetails(invoice);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `https://api.mikweb.com.br/v1/admin/billings/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${MIKWEB_TOKEN}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }

                const result = await response.json();
                setInvoice(result.billing);
            } catch (error) {
                console.error('Erro ao carregar os dados da fatura:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    const handleDownloadInvoice = async (): Promise<void> => {
        if (!invoice?.integration_link) {
            ToastAndroid.show(
                'O link para download não está disponível.',
                ToastAndroid.SHORT
            );
            return;
        }

        try {
            Linking.openURL(invoice.integration_link);
            setInfoModalText(
                'A 2ª via da última fatura está sendo baixada. Verifique seus arquivos.'
            );
            setIsInfoModalVisible(true);
        } catch (error) {
            console.error('Erro ao abrir o link da fatura:', error);
            ToastAndroid.show('Não foi possível baixar a fatura.', ToastAndroid.SHORT);
        }
    };

    const handleShareInvoice = async (): Promise<void> => {
        if (!invoice?.integration_link) {
            ToastAndroid.show(
                'O link da fatura não está disponível.',
                ToastAndroid.SHORT
            );
            return;
        }

        try {
            const fileUri: string = FileSystem.cacheDirectory + `${invoice.id}.pdf`;

            const downloadResult = await FileSystem.downloadAsync(
                invoice.integration_link,
                fileUri
            );

            if (!(await Sharing.isAvailableAsync())) {
                ToastAndroid.show(
                    'O compartilhamento não está disponível no seu dispositivo.',
                    ToastAndroid.SHORT
                );
                return;
            }

            await Sharing.shareAsync(downloadResult.uri);
            ToastAndroid.show('Fatura compartilhada com sucesso!', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Erro ao compartilhar a fatura:', error);
            ToastAndroid.show('Não foi possível compartilhar a fatura.', ToastAndroid.SHORT);
        }
    };

    const handleContactSupport = () => {
        Linking.openURL(
            `https://api.whatsapp.com/send?phone=5592985500742&text=Olá, preciso de suporte com a minha fatura ${invoice?.id}.`
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.screenContainer}>
                    {/* Cabeçalho */}
                    <View style={styles.headerContainer}>
                        {isLoading ? (
                            <Skeleton width={250} height={30} colorMode="light" />
                        ) : (
                            <Text style={styles.headerText}>
                                {`Fatura - ${invoice?.reference.replace('Acesso a internet de ', '')}`}
                            </Text>
                        )}
                        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                            <AntDesign name="close" size={28} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardContainer}>
                        {isLoading ? (
                            <View style={styles.skeletonCard}>
                                <Skeleton width={120} height={20} colorMode="light" />
                                <Skeleton width={160} height={30} colorMode="light" />
                                <Skeleton width={140} height={20} colorMode="light" />
                            </View>
                        ) : (
                            <View style={styles.cardContent}>
                                <View style={styles.invoiceInfo}>
                                    <Text style={styles.invoiceId}>{`Fatura #${invoice?.id}`}</Text>
                                    <Text style={styles.invoiceValue}>
                                        {`R$ ${invoice?.value.toFixed(2).replace('.', ',')}`}
                                    </Text>
                                    <Text style={styles.invoiceDueDate}>
                                        {`Vence em ${invoice?.due_day.split('-').reverse().join('/')}`}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: statusColors[invoice!.situation_id] },
                                    ]}
                                >
                                    <Text style={styles.statusText}>
                                        {statusTexts[invoice!.situation_id]}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {isLoading ? (
                        <View style={styles.actionsSkeleton}>
                            <Skeleton width={60} height={60} radius={10} colorMode="light" />
                            <Skeleton width={60} height={60} radius={10} colorMode="light" />
                            <Skeleton width={60} height={60} radius={10} colorMode="light" />
                            <Skeleton width={60} height={60} radius={10} colorMode="light" />
                        </View>
                    ) : (
                        invoice?.situation_id !== 3 && (
                            <View style={styles.actionsContainer}>
                                <ActionButton
                                    text="Pagar com Pix"
                                    icon={<PixIcon />}
                                    onPress={() => setIsPixModalVisible(true)}
                                    disabled={isLoading}
                                />
                                <ActionButton
                                    text="Código de Barras"
                                    icon={<BarCodeIcon />}
                                    onPress={() => setIsBarCodeModalVisible(true)}
                                    disabled={isLoading}
                                />
                                <ActionButton
                                    text="2ª via da Fatura"
                                    icon={<PdfIcon />}
                                    onPress={handleDownloadInvoice}
                                    disabled={isLoading}
                                />
                                <ActionButton
                                    text="Compartilhar"
                                    icon={<ShareIcon />}
                                    onPress={handleShareInvoice}
                                    disabled={isLoading}
                                />
                            </View>
                        )
                    )}

                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Detalhes da Fatura</Text>
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Cliente</Text>
                                {isLoading ? (
                                    <Skeleton width={80} height={24} colorMode="light" />
                                ) : (
                                    <Text style={styles.detailValue}>{invoice?.customer.full_name}</Text>
                                )}
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Beneficiário</Text>
                                {isLoading ? (
                                    <Skeleton width={80} height={24} colorMode="light" />
                                ) : (
                                    <Text style={styles.detailValue}>Elven Net</Text>
                                )}
                            </View>

                            {!isLoading && invoice?.value_paid && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Data de Pagamento</Text>
                                        <Text style={styles.detailValue}>
                                            {invoice?.date_payment?.split('-').reverse().join('/')}
                                        </Text>
                                    </View>
                                </>
                            )}


                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Valor da Mensalidade</Text>
                                {isLoading ? (
                                    <Skeleton width={80} height={24} colorMode="light" />
                                ) : (
                                    <Text style={styles.detailValue}>
                                        {`R$ ${invoice?.value.toFixed(2).replace('.', ',')}`}
                                    </Text>
                                )}
                            </View>

                            {invoice?.situation_id === 3 && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Multa</Text>
                                        {isLoading ? (
                                            <Skeleton width={80} height={24} colorMode="light" />
                                        ) : (
                                            <Text style={styles.detailValue}>
                                                {`R$ ${penalty?.toFixed(2).replace('.', ',')}`}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Juros</Text>
                                        {isLoading ? (
                                            <Skeleton width={80} height={24} colorMode="light" />
                                        ) : (
                                            <Text style={styles.detailValue}>
                                                {`R$ ${interest?.toFixed(2).replace('.', ',')}`}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[styles.detailRow, styles.noBorderRow]}>
                                        <Text style={styles.detailLabel}>Valor Total</Text>
                                        {isLoading ? (
                                            <Skeleton width={80} height={24} colorMode="light" />
                                        ) : (
                                            <Text style={styles.detailValue}>
                                                {`R$ ${totalAmount?.toFixed(2).replace('.', ',')}`}
                                            </Text>
                                        )}
                                    </View>
                                </>
                            )}

                        </View>
                    </View>

                    {invoice?.situation_id === 2 && (
                        <View style={styles.warningContainer}>
                            <WarningIcon />
                            <Text style={styles.warningText}>
                                {`Faturas em atraso possuem acréscimo de R$ ${(invoice.value * 0.02)
                                    .toFixed(2)
                                    .replace('.', ',')} de multa e juros de 0,25% ao mês.`
                                }
                            </Text>
                        </View>
                    )}

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Suporte</Text>
                        <Text style={styles.supportText}>
                            Se precisar de ajuda ou tiver dúvidas sobre a sua fatura, nossa equipe está pronta para atendê-lo.
                        </Text>
                        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport} activeOpacity={0.7}>
                            <Text style={styles.supportButtonText}>Fale com o Suporte</Text>
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modais */}
                {!isLoading && (
                    <PixCodeModal
                        value={invoice?.value || 0}
                        due_day={invoice?.due_day || ''}
                        pix_copy_paste={invoice?.pix_copy_paste || ''}
                        isModalVisible={isPixModalVisible}
                        setIsModalVisible={setIsPixModalVisible}
                    />
                )}

                {!isLoading && (
                    <BarCodeModal
                        value={invoice?.value || 0}
                        due_day={invoice?.due_day || ''}
                        digitable_line={invoice?.digitable_line || ''}
                        isModalVisible={isBarCodeModalVisible}
                        setIsModalVisible={setIsBarCodeModalVisible}
                    />
                )}

                <InformativeModal
                    isModalVisible={isInfoModalVisible}
                    setIsModalVisible={setIsInfoModalVisible}
                    text={infoModalText}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    screenContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContainer: {
        marginTop: 25,
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 20,
    },
    skeletonCard: {
        gap: 8,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceInfo: {
        flex: 1,
    },
    invoiceId: {
        fontSize: fontSize.labels.medium,
        color: '#555',
    },
    invoiceValue: {
        fontSize: fontSize.titles.extralarge,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 5,
    },
    invoiceDueDate: {
        fontSize: fontSize.labels.medium,
        color: '#555',
    },
    statusBadge: {
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
        paddingVertical: 5,
    },
    statusText: {
        color: '#FFF',
        fontSize: fontSize.labels.medium,
        textAlign: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionsSkeleton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    detailsSection: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    detailsContainer: {},
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        alignItems: 'center'
    },
    noBorderRow: {
        borderBottomWidth: 0,
    },
    detailLabel: {
        fontSize: fontSize.labels.medium,
        color: '#555',
    },
    detailValue: {
        fontSize: fontSize.labels.medium,
        color: '#555',
    },
    warningContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFE69C',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2
    },
    warningText: {
        flex: 1,
        marginLeft: 10,
        fontSize: fontSize.labels.medium,
        color: '#997404',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 8,
    },
    supportText: {
        fontSize: fontSize.labels.medium,
        color: '#555',
        marginBottom: 16,
        lineHeight: 20,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,
    },
    supportButtonText: {
        color: '#FFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        marginRight: 8,
    },
});

