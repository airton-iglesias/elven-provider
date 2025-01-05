import React, { useState } from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyIcon from '@/assets/icons/keyIcon';
import EditIcon from '@/assets/icons/editIcon';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import DeviceIcon from '@/assets/icons/deviceIcon';
import TopBar from '@/components/topbar';
import InformativeModal from '@/components/informativeModal';
import WifiPasswordModal from '@/components/wifiPasswordModal';
import WifiNameModal from '@/components/wifiNameModal';

export default function Wifi() {

    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');

    const [isModalPasswordVisible, setIsModalPasswordVisible] = useState<boolean>(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState<boolean>(false);

    const [isModalNameVisible, setIsModalNameVisible] = useState<boolean>(false);
    const [isNameChanging, setIsNameChanging] = useState<boolean>(false);

    const changePassword = (password: string) => {
        setIsPasswordChanging(true);

        //fazer a requisição aqui
        //{...}

        setTimeout(() => {
            setIsPasswordChanging(false)
            setIsModalPasswordVisible(false)
            setInformativeModalText('A senha do seu wi-fi foi alterada com sucesso.')
            setIsInformativeModalVisible(true)
        }, 3000)
    }

    const changeName = (name: string) => {
        setIsNameChanging(true)

        //fazer a requisição aqui
        //{...}

        setTimeout(() => {
            setIsNameChanging(false)
            setIsModalNameVisible(false)
            setInformativeModalText('O nome do seu wi-fi foi alterado com sucesso.')
            setIsInformativeModalVisible(true)
        }, 3000)
    }


    return (
        <SafeAreaView
            style={[
                { flex: 1 },
                isInformativeModalVisible || isModalNameVisible || isModalPasswordVisible
                    ? { backgroundColor: '#0D3A75' }
                    : { backgroundColor: AppColors.external.primary },
            ]}>
            <TopBar />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Configurações do Wi-fi</Text>
                </View>

                {/* Opção 1: Alterar senha do Wi-fi */}
                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => setIsModalPasswordVisible(true)}>
                    <View style={styles.iconContainer}>
                        <KeyIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar senha do wi-fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

                {/* Opção 2: Alterar nome do Wi-fi */}
                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => setIsModalNameVisible(true)}>
                    <View style={styles.iconContainer}>
                        <EditIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar nome do wi-fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

                {/* Opção 3: Ver dispositivos conectados */}
                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => router.navigate("/devices")}>
                    <View style={styles.iconContainer}>
                        <DeviceIcon strokeColor='white' strokeOpacity={1} />
                    </View>
                    <Text style={styles.optionText}>Ver dispositivos conectados</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>
            </View>

            <InformativeModal
                isModalVisible={isInformativeModalVisible}
                setIsModalVisible={setIsInformativeModalVisible}
                text={informativeModalText}
            />

            <WifiPasswordModal
                isModalVisible={isModalPasswordVisible}
                setIsModalVisible={setIsModalPasswordVisible}
                isPasswordChanging={isPasswordChanging}
                changePassword={changePassword}
            />

            <WifiNameModal
                isModalVisible={isModalNameVisible}
                setIsModalVisible={setIsModalNameVisible}
                isNameChanging={isNameChanging}
                changeName={changeName}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 24,
    },
    header: {
        marginBottom: 20,

    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
        marginBottom: 15,
        height: 100,
        backgroundColor: '#fff'
    },
    iconContainer: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: fontSize.labels.medium,
        color: '#000',
    },
});
