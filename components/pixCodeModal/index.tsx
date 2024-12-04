import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { Skeleton } from "moti/skeleton";


export default function PixCodeModal({ isModalVisible, setIsModalVisible, id }: any) {
    const [pixData, setPixData] = useState<any>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        //requisição inicial aqui, usa o ID como parâmetro de identificação da fatura.

        const requestData: any = {
            amount: '99999,99',
            date: '05/12',
            paymentType: 'Pix',
            code: `00020101021226940014BR.COV.BCB PIX257Zqrcodespix.example.com.br/cpra/v2/cobv/c247cffe57384dd682b542682235dcf252 04000053039865802BR5905EFISA600 8SAOPAULO62070503-*'63047CA9`
        };

        setTimeout(() => {
            setPixData(requestData);
            setIsLoading(false);
        }, 2000);
    }, []);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(pixData.code);
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
                                    : <Text style={styles.modalLabelTitle}>R$ {pixData?.amount}</Text>
                                }

                                {isLoading ? <Skeleton colorMode="light" width={80} height={15} radius={4} />
                                    : <Text style={styles.modalLabels}>Venc. {pixData?.date} | {pixData?.paymentType}</Text>
                                }

                            </View>

                            <View style={[styles.modalRow, { gap: 10 }]}>
                                <Text style={styles.modalLabels}>Utilize o código Pix Copia e Cola abaixo para realizar o pagamento.</Text>
                                <TouchableOpacity style={{width: '100%'}} onPress={copyToClipboard} activeOpacity={0.7} disabled={isLoading}>
                                    {isLoading ? <Skeleton colorMode="light" width={'100%'} height={110} radius={10} />
                                        :
                                        <Text style={styles.pixCodeText} selectable>
                                            {pixData?.code}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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