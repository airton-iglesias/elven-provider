import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { Skeleton } from "moti/skeleton";


export default function PixCodeModal({ isModalVisible, setIsModalVisible, id, value }: any) {
    const [pixData, setPixData] = useState<any>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ALPBKXMNQC:Q0I9WSDEBHWQBDA4PTRDNVSD5QKT3TCZ`
                    }
                });

                if (!response.ok) { throw new Error("Erro na requisição"); }

                const result = await response.json();
                setPixData(result.billing);

            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(pixData?.pix_copy_paste);
        ToastAndroid.show("Código pix copiado!", ToastAndroid.SHORT);
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(!isModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalView}>

                            <View style={styles.modalRow}>
                                <View
                                    style={{
                                        width: '15%',
                                        height: 5,
                                        backgroundColor: '#D9D9D9',
                                        borderRadius: 10
                                    }}
                                />
                            </View>

                            <View style={[styles.modalRow, isLoading ? { gap: 5 } : null]}>
                                <Text style={styles.modalLabels}>Valor a ser pago:</Text>

                                {isLoading ? <Skeleton colorMode="light" width={100} radius={4} />
                                    : <Text style={styles.modalLabelTitle}>R$ {value ? value : parseFloat(pixData?.value).toFixed(2)}</Text>
                                }

                                {isLoading ? <Skeleton colorMode="light" width={80} height={15} radius={4} />
                                    : <Text style={styles.modalLabels}>Venc. {pixData?.due_day ? `${pixData?.due_day.substring(8, 10)}/${pixData?.due_day.substring(5, 7)}` : 'undefined'} | Pix</Text>
                                }

                            </View>

                            <View style={[styles.modalRow, { gap: 10 }]}>
                                <Text style={styles.modalLabels}>Utilize o código Pix Copia e Cola abaixo para realizar o pagamento.</Text>
                                <TouchableOpacity style={{ width: '100%' }} onPress={copyToClipboard} activeOpacity={0.7} disabled={isLoading}>
                                    {isLoading ? <Skeleton colorMode="light" width={'100%'} height={110} radius={10} />
                                        :
                                        <Text style={styles.pixCodeText} selectable>
                                            {pixData?.pix_copy_paste}
                                        </Text>
                                    }
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setIsModalVisible(!isModalVisible)}
                                style={styles.modalSaveButton}
                            >
                                <View style={styles.modalButtonSaveContent}>
                                    <Text style={styles.submitButtonText}>{"Fechar"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        zIndex: 10
    },
    modalView: {
        backgroundColor: '#1A73E8',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
        alignItems: 'center',
        shadowRadius: 4,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        gap: 20,
        width: '100%'
    },
    modalSaveButton: {
        width: '100%',
        borderRadius: 8,
    },
    modalButtonSaveContent: {
        flexDirection: 'row',
        backgroundColor: AppColors.external.button,
        width: '100%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 10,
    },
    submitButtonText: {
        fontSize: fontSize.labels.medium,
        color: AppColors.external.text,
        fontWeight: 'bold',
    },
    modalLabels: {
        color: 'white',
        fontSize: fontSize.labels.medium
    },
    modalLabelTitle: {
        color: 'white',
        fontSize: fontSize.titles.large
    },
    modalRow: {
        width: '100%',
        alignItems: 'center'
    },
    pixCodeText: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D96A0B'
    }
});