import WarningIcon from "@/assets/icons/warningIcon";
import { useState } from "react";
import { Modal, TouchableOpacity, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import PaymentDateSelect from "../paymentDateSelect";
import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";

interface BillSelectDateModalProps {
    currentDay: string,
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
    onDateSelect: (date: string) => void;
    isChangingPaymentDay: boolean;
}

export default function BillDateSelectModal({ currentDay, isModalVisible, setIsModalVisible, onDateSelect, isChangingPaymentDay }: BillSelectDateModalProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(currentDay);

    return (
        <View>
            {/* Modal para seleção de data de pagamento */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => isChangingPaymentDay ? null : setIsModalVisible(!isModalVisible)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalView}>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: '15%',
                                        height: 5,
                                        backgroundColor: '#D9D9D9',
                                        borderRadius: 10
                                    }}
                                />
                            </View>

                            <View style={styles.modalWarningContainer}>
                                <View style={styles.modalWarningContent}>
                                    <WarningIcon />
                                    <Text style={styles.modalWarningText}>
                                        A fatura deste mês ainda virá no dia de vencimento anterior, a partir disso, as faturas virão no dia de vencimento selecionado.
                                    </Text>
                                </View>
                            </View>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <PaymentDateSelect
                                    onDateSelect={(date: string) => {
                                        setSelectedDate(date);
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    onDateSelect(selectedDate ? selectedDate : '');
                                }}
                                style={styles.modalSaveButton}
                                disabled={isChangingPaymentDay}
                            >
                                <View style={styles.modalButtonSaveContent}>
                                    {isChangingPaymentDay ? (
                                        <ActivityIndicator size={24} color="#fff" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Confirmar</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        zIndex: 10
    },
    modalText: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 15,
        color: '#fff',
        textAlign: 'center'
    },
    iconContainer: {
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: AppColors.external.button,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
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
    modalWarningContainer: {
        backgroundColor: '#FFE69C',
        borderRadius: 10,
        width: '100%',
        padding: 10
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
    submitButtonText: {
        fontSize: fontSize.labels.medium,
        color: AppColors.external.text,
        fontWeight: 'bold',
    },
});