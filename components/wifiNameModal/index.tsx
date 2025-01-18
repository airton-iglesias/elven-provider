import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Input from "../input";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getWifiNameSchema, WifiNameData } from "@/schemas/wifiSchemas";
import WarningIcon from "@/assets/icons/warningIcon";


export default function WifiNameModal({ isModalVisible, setIsModalVisible, isNameChanging, changeName }: any) {

    // React Hook Form setup
    const wifiNameSchema = React.useMemo(() => getWifiNameSchema(), []);
    const { control, handleSubmit, formState: { errors } } = useForm<WifiNameData>({
        resolver: zodResolver(wifiNameSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: WifiNameData) => {
        changeName(data.name)

    }

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

                            <View style={styles.modalWarningContainer}>
                                <View style={styles.modalWarningContent}>
                                    <WarningIcon />
                                    <Text style={styles.modalWarningText}>
                                        Ao alterar o nome da sua rede Wi-Fi, a conexão será automaticamente interrompida. Será necessário reconectar manualmente utilizando o novo nome da rede.
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.modalRow, { gap: 10 }]}>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label={"Digite o novo nome do Wi-fi"}
                                            onChange={(text) => onChange(text)}
                                            onBlur={onBlur}
                                            
                                            error={errors.name?.message}
                                            maxLength={18}
                                            customLabelColor='#fff'
                                            customFontSize={fontSize.labels.medium}
                                        />
                                    )}
                                />
                            </View>

                            <View style={[styles.modalRow, { gap: 10 }]}>
                                <Controller
                                    control={control}
                                    name="confirmName"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            onChange={(text) => onChange(text)}
                                            label={"Repita o novo nome do Wi-fi"}
                                            onBlur={onBlur}
                                            
                                            error={errors.confirmName?.message}
                                            maxLength={18}
                                            customLabelColor='#fff'
                                            customFontSize={fontSize.labels.medium}
                                        />
                                    )}
                                />
                            </View>


                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleSubmit(onSubmit)}
                                style={styles.modalSaveButton}
                            >
                                <View style={styles.modalButtonSaveContent}>
                                    {isNameChanging ? (
                                        <ActivityIndicator size={24} color="#fff" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>{"Alterar"}</Text>
                                    )}

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
        fontSize: fontSize.labels.medium,
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
        borderColor: '#D96A0B',
        minHeight: 80,
        textAlignVertical: 'center'
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
});