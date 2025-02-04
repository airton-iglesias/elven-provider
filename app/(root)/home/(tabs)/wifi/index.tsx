import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
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

    const handleNetworkError = () => {
        setInformativeModalText('Você perdeu a conexão com a rede. Por favor, reconecte-se.');
        setIsInformativeModalVisible(true);
    };

    const getDeviceId = async (serial: string): Promise<string> => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": serial });
        const projection = "_id";

        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=${projection}`;

        const response: any = await fetchWithTimeout(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error('Erro ao buscar o dispositivo.');

        const data = await response.json();
        if (data.length === 0) throw new Error('Dispositivo não encontrado.');

        const routerID = data[0]._id;

        const encodeRouterID = /[\/?&%#=]/.test(routerID) ? encodeURIComponent(routerID) : routerID;

        return encodeRouterID;
    };

    const updateWiFiSettings = async (parameter: string, value: string, onErrorMessage: string) => {
        if (!isConnected) return handleNetworkError();

        try {
            const storedData = await AsyncStorage.getItem('customerData');
            const userDatas = storedData ? JSON.parse(storedData) : null;
            const serial = userDatas?.observation;

            const id = await getDeviceId(serial);
            const url = `http://${ACS_IP_ADRESS}/devices/${id}/tasks?connection_request`;

            const response: any = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'setParameterValues',
                    parameterValues: [[parameter, value, 'xsd:string']],
                }),
            });

            if (!response.ok) throw new Error(onErrorMessage);
            -
                setInformativeModalText(`${onErrorMessage}`);

        } catch (e) {
            if (!isConnected) return handleNetworkError();
        } finally {
            setIsInformativeModalVisible(true);
        }
    };

    const changePassword = (password: string) => {
        setIsPasswordChanging(true);
        updateWiFiSettings(
            'InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase',
            password,
            'Aconteceu um erro ao alterar a senha do Wi-Fi, tente novamente.'
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
            'Aconteceu um erro ao alterar o nome do Wi-Fi, tente novamente.'
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

                <TouchableOpacity style={styles.option} onPress={() => setIsModalPasswordVisible(true)} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <KeyIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar senha do Wi-Fi</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => setIsModalNameVisible(true)} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <EditIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar nome do Wi-Fi</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => router.navigate('/devices')} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <DeviceIcon strokeColor="white" strokeOpacity={1} />
                    </View>
                    <Text style={styles.optionText}>Ver dispositivos conectados</Text>
                    <Entypo name="chevron-thin-right" size={24} color="#D96A0B" />
                </TouchableOpacity>
            </View>

            <InformativeModal
                isModalVisible={isInformativeModalVisible}
                setIsModalVisible={(visible: any) => {
                    setIsInformativeModalVisible(visible);
                    if (!visible) setInformativeModalText('');
                }}
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
        height: 100,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 15,
        elevation: 2,
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
    optionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: fontSize.labels.medium,
        color: '#555'
    },
});
