import CheckIcon from "@/assets/icons/checkIcon";
import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InformativeModal({ isModalVisible, setIsModalVisible, text }: any) {
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

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <View style={styles.iconContainer}>
                                    <CheckIcon />
                                </View>
                            </View>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Text style={styles.modalText}>{text}</Text>
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
    submitButtonText: {
        fontSize: fontSize.labels.medium,
        color: AppColors.external.text,
        fontWeight: 'bold',
    },
});