import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import * as Clipboard from 'expo-clipboard';
import Feather from '@expo/vector-icons/Feather';

type PixCodeModalProps = {
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
    value: number;
    pix_copy_paste: string;
    due_day: string;
};


export default function PixCodeModal({ isModalVisible, setIsModalVisible, value, pix_copy_paste, due_day }: PixCodeModalProps) {


    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(pix_copy_paste);
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

                            <View style={styles.modalRow}>
                                <Text style={styles.modalLabels}>Valor a ser pago:</Text>
                                <Text style={styles.modalLabelTitle}>R$ {value.toFixed(2).toString().replace('.', ',')}</Text>
                                <Text style={styles.modalLabels}>Venc. {due_day ? `${due_day.substring(8, 10)}/${due_day.substring(5, 7)}` : 'undefined'} | Pix</Text>
                            </View>

                            <View style={[styles.modalRow, { gap: 10 }]}>
                                <View style={styles.labelWrapper}>
                                    <Text style={[styles.modalLabels]}>Utilize o código Pix Copia e Cola abaixo para realizar o pagamento.</Text>
                                </View>

                                <View style={styles.pixCodeWrapper}>
                                    <Text style={styles.pixCodeText} selectable>
                                        {pix_copy_paste}
                                    </Text>

                                    <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard} activeOpacity={0.7}>
                                        <Feather name="copy" size={14} color="#fff" />
                                        <Text style={{ color: '#fff' }}>
                                            Copiar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
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
        fontSize: fontSize.labels.medium,
        flexShrink: 1
    },
    modalLabelTitle: {
        color: 'white',
        fontSize: fontSize.titles.large
    },
    modalRow: {
        width: '100%',
        alignItems: 'center'
    },
    pixCodeWrapper: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        width: '100%',
        minHeight: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pixCodeText: {
        textAlignVertical: 'center',
        width: '100%',
    },
    copyButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#D96A0B',
        padding: 6,
        borderRadius: 5,
        borderTopEndRadius: 10,
        top: 1,
        right: 1
    },
    labelWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 10
    }
});