import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo limite da requisição atingido.')), timeout)
        )
    ]);
};

export default function Wifi() {
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState<boolean>(false);
    const [informativeModalText, setInformativeModalText] = useState<string>('');

    const [isModalPasswordVisible, setIsModalPasswordVisible] = useState<boolean>(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState<boolean>(false);

    const [isModalNameVisible, setIsModalNameVisible] = useState<boolean>(false);
    const [isNameChanging, setIsNameChanging] = useState<boolean>(false);

    const [isConnected, setIsConnected] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsConnected(state.isConnected || false);
        });
        return () => unsubscribe();
    }, []);

    const handleNetworkError = () => {
        setInformativeModalText('Você perdeu a conexão com a rede. Por favor, reconecte-se.');
        setIsInformativeModalVisible(true);
    };

    const getDeviceId = async (serial: string): Promise<string> => {
        const url = `http://192.168.0.7:7557/devices/?device=${serial}`;
        try {
            const response: any = await fetchWithTimeout(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            if (!response.ok) throw new Error('Erro ao buscar o dispositivo.');

            const data = await response.json();
            if (data.length > 0) return data[0]._id;

            throw new Error('Dispositivo não encontrado.');
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao buscar o dispositivo.');
        }
    };

    const changePassword = async (password: string) => {
        if (!isConnected) return handleNetworkError();

        setIsPasswordChanging(true);
        try {
            const storedData = await AsyncStorage.getItem('customerData');
            const userDatas = storedData ? JSON.parse(storedData) : null;
            const serial = userDatas?.observation;

            const id = await getDeviceId(serial);
            const encodedRouterID = encodeURIComponent(id);

            const url = `http://192.168.0.7:7557/devices/${encodedRouterID}/tasks?connection_request`;
            const response: any = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'setParameterValues',
                    parameterValues: [["InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase", password, "xsd:string"]]
                })
            });

            if (!response.ok) throw new Error('Erro ao alterar a senha do Wi-Fi.');

        } catch (error) {
            setInformativeModalText('A senha do seu wi-fi foi alterada com sucesso.');
        } finally {
            setIsPasswordChanging(false);
            setIsModalPasswordVisible(false);
            setIsInformativeModalVisible(true);
        }
    };

    const changeName = async (name: string) => {
        if (!isConnected) return handleNetworkError();

        setIsNameChanging(true);
        try {
            const storedData = await AsyncStorage.getItem('customerData');
            const userDatas = storedData ? JSON.parse(storedData) : null;
            const serial = userDatas?.observation;

            const id = await getDeviceId(serial);
            const encodedRouterID = encodeURIComponent(id);

            const url = `http://192.168.0.7:7557/devices/${encodedRouterID}/tasks?connection_request`;
            const response: any = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'setParameterValues',
                    parameterValues: [["InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.SSID", name, "xsd:string"]]
                })
            });

            if (!response.ok) throw new Error('Erro ao alterar o nome do Wi-Fi.');

        } catch (error) {
            setInformativeModalText('O nome do seu wi-fi foi alterado com sucesso.');
        } finally {
            setIsNameChanging(false);
            setIsModalNameVisible(false);
            setIsInformativeModalVisible(true);
        }
    };

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

                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => setIsModalPasswordVisible(true)}>
                    <View style={styles.iconContainer}>
                        <KeyIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar senha do wi-fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => setIsModalNameVisible(true)}>
                    <View style={styles.iconContainer}>
                        <EditIcon />
                    </View>
                    <Text style={styles.optionText}>Alterar nome do wi-fi</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                </TouchableOpacity>

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
        color: '#000',
    },
});
