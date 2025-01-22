import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import KeyIcon from '@/assets/icons/keyIcon';
import EditIcon from '@/assets/icons/editIcon';
import DeviceIcon from '@/assets/icons/deviceIcon';
import TopBar from '@/components/topbar';
import InformativeModal from '@/components/informativeModal';
import WifiPasswordModal from '@/components/wifiPasswordModal';
import WifiNameModal from '@/components/wifiNameModal';

import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { ACS_IP_ADRESS } from '@/constants/ipAdress';

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo limite da requisição atingido.')), timeout)
        ),
    ]);
};

export default function Wifi() {
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState(false);
    const [informativeModalText, setInformativeModalText] = useState('');
    const [isModalPasswordVisible, setIsModalPasswordVisible] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isModalNameVisible, setIsModalNameVisible] = useState(false);
    const [isNameChanging, setIsNameChanging] = useState(false);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected || false);
        });
        return () => unsubscribe();
    }, []);

    const handleNetworkError = useCallback(() => {
        setInformativeModalText('Você perdeu a conexão com a rede. Por favor, reconecte-se.');
        setIsInformativeModalVisible(true);
    }, []);

    const getDeviceId = useCallback(async (serial: string): Promise<string> => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": serial });
        const projection = "_id";

        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=${projection}`;

        const response: any = await fetchWithTimeout(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error('Erro ao buscar o dispositivo.');

        const data = await response.json();
        if (data.length === 0) throw new Error('Dispositivo não encontrado.');

        const id = data[0]._id;

        return /[\/?&%#=]/.test(id) ? encodeURIComponent(id) : id;
    }, []);

    const updateWiFiSettings = useCallback(
        async (parameter: string, value: string, onSuccessMessage: string, onErrorMessage: string) => {
            if (!isConnected) return handleNetworkError();

            try {
                const storedData = await AsyncStorage.getItem('customerData');
                const userDatas = storedData ? JSON.parse(storedData) : null;
                const serial = userDatas?.observation;

                const id = await getDeviceId(serial);
                const url = `http://${ACS_IP_ADRESS}/devices/${id}/tasks?connection_request`;

                const response: any = await fetchWithTimeout(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'setParameterValues',
                        parameterValues: [[parameter, value, 'xsd:string']],
                    }),
                });

                if (!response.ok) throw new Error(onErrorMessage);

                setInformativeModalText(`${onSuccessMessage}`);

            } catch (e){
                if (!isConnected) return handleNetworkError();
            } finally {
                setIsInformativeModalVisible(true);
            }
        },
        [getDeviceId, handleNetworkError, isConnected]
    );

    const changePassword = (password: string) => {
        setIsPasswordChanging(true);
        updateWiFiSettings(
            'InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase',
            password,
            'A senha do Wi-Fi foi alterada com sucesso.',
            'Erro ao alterar a senha do Wi-Fi.'
        ).finally(() => {
            setIsPasswordChanging(false);
            setIsModalPasswordVisible(false);
        });
    };

    const changeName = (name: string) => {
        setIsNameChanging(true);
        updateWiFiSettings(
            'InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.SSID',
            name,
            'O nome do Wi-Fi foi alterado com sucesso.',
            'Erro ao alterar o nome do Wi-Fi.'
        ).finally(() => {
            setIsNameChanging(false);
            setIsModalNameVisible(false);
        });
    };


    return (
        <SafeAreaView style={styles.container}>
            <TopBar />

            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Configurações do Wi-Fi</Text>
                </View>

                <TouchableOpacity style={styles.option} onPress={() => setIsModalPasswordVisible(true)}>
                    <View style={styles.iconContainer}>
                        <KeyIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar senha do Wi-Fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => setIsModalNameVisible(true)}>
                    <View style={styles.iconContainer}>
                        <EditIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar nome do Wi-Fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => router.navigate('/devices')}>
                    <View style={styles.iconContainer}>
                        <DeviceIcon strokeColor="white" strokeOpacity={1} />
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
        backgroundColor: AppColors.external.primary
    },
    modalBackground: {
        backgroundColor: '#0D3A75'
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        backgroundColor: '#f5f5f5'
    },
    header: {
        marginBottom: 20
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000'
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
        backgroundColor: '#fff',
    },
    iconContainer: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: { flex: 1, marginLeft: 10, fontSize: fontSize.labels.medium, color: '#000' },
});
