import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import DeviceCard from '@/components/deviceCard';
import DeviceSkeleton from '@/components/deviceSkeleton';
import { fontSize } from '@/constants/fonts';
import { ACS_IP_ADRESS } from '@/constants/ipAdress';

type DeviceData = {
    id: string;
    name: string;
    isActive: boolean;
    ip: string;
    mac: string;
};

export default function Devices() {
    const [deviceName, setDeviceName] = useState('Carregando...');
    const [devicesList, setDevicesList] = useState<DeviceData[]>([]);
    const [serialNumber, setSerialNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deviceIsActive, setDeviceIsActive] = useState<boolean>(false);

    const getDeviceName = async () => {
        if (Device.isDevice) {
            const name = Device.deviceName || 'Dispositivo Desconhecido';
            setDeviceName(name);
        } else {
            setDeviceName('Simulador');
        }
    };

    const fetchRouterID = async (userSerial: string) => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": userSerial });

        const response = await fetch(`http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=_id,InternetGatewayDevice.LANDevice,_deviceId`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });


        if (!response.ok) throw new Error(`Erro ao buscar ID do roteador: ${response.statusText}`);

        const data = await response.json();

        const routerID = /[\/?&%#=]/.test(data[0]._id) ? encodeURIComponent(data[0]._id) : data[0]._id;

        return routerID;
    };



    const refreshHostInfo = async (routerID: string) => {
        const url = `http://${ACS_IP_ADRESS}/devices/${routerID}/tasks?connection_request`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{"name":"refreshObject","objectName":"InternetGatewayDevice.LANDevice.*.Hosts.Host"}',
        });

        if (!response.ok) throw new Error('Erro ao atualizar informações do host.');
    };


    const fetchDevicesList = async (userSerial: string) => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": userSerial });
        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=_id,InternetGatewayDevice.LANDevice,_deviceId`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            throw new Error('Erro ao buscar lista de dispositivos.');
        }

        const dataDevice = await response.json();

        const hosts = dataDevice?.[0]?.InternetGatewayDevice?.LANDevice?.[1]?.Hosts?.Host || {};

        const deviceList = Object.keys(hosts)
            .filter((key) => !key.startsWith('_'))
            .map((key) => {
                const hostData = hosts[key];
                return {
                    id: key,
                    name: hostData?.HostName?._value || 'Desconhecido',
                    isActive: hostData?.Active?._value || false,
                    ip: hostData?.IPAddress?._value || '---',
                    mac: hostData?.MACAddress?._value || '---',
                };
            });

        setDevicesList(deviceList);
    };


    const initializeData = async () => {
        try {
            setIsLoading(true);

            await getDeviceName();

            const storedData = await AsyncStorage.getItem('customerData');
            const userDatas = storedData ? JSON.parse(storedData) : null;
            const userSerialNumber = userDatas?.observation;

            if (!userSerialNumber) {
                throw new Error('Serial não encontrado no AsyncStorage.');
            }

            setSerialNumber(userSerialNumber);
            const routerID = await fetchRouterID(userSerialNumber);

            await refreshHostInfo(routerID);
            await fetchDevicesList(userSerialNumber);
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializeData();
    }, []);

    const handleRefresh = async () => {
        try {
            setIsLoading(true);
            if (serialNumber) {
                const routerID = await fetchRouterID(serialNumber);
                await refreshHostInfo(routerID);
                await fetchDevicesList(serialNumber);
            }
        } catch (error) {
            console.error('Erro ao atualizar lista:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sameNameActive = devicesList.filter(
        (item) => item.name === deviceName && item.isActive === true
    );

    sameNameActive.sort((a, b) => Number(a.id) - Number(b.id));

    const userDevice = sameNameActive.length > 0
        ? sameNameActive[sameNameActive.length - 1]
        : null;

    const otherDevices = userDevice
        ? devicesList.filter((item) => item.name !== userDevice.name)
        : devicesList.filter((item) => item.name !== deviceName);

    otherDevices.sort((a, b) => Number(b.isActive) - Number(a.isActive));

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={otherDevices}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.section}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>Seu dispositivo</Text>
                                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                                    <AntDesign name="close" size={28} color="black" />
                                </TouchableOpacity>
                            </View>

                            {isLoading ? (
                                <DeviceSkeleton />
                            ) : userDevice ? (
                                <DeviceCard
                                    isActive={userDevice.isActive}
                                    name={userDevice.name}
                                    ip={userDevice.ip}
                                    mac={userDevice.mac}
                                />
                            ) : (
                                <DeviceCard
                                    isActive={deviceIsActive}
                                    name={deviceName || 'Desconhecido'}
                                />
                            )}
                        </View>

                        <View style={[styles.section, styles.listHeader]}>
                            <Text style={styles.sectionTitle}>Outros dispositivos</Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                disabled={isLoading}
                                onPress={handleRefresh}
                            >
                                <Text style={styles.refreshButton}>Atualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                renderItem={({ item }) =>
                    isLoading ? (
                        <DeviceSkeleton />
                    ) : (
                        <DeviceCard
                            isActive={item.isActive}
                            name={item.name}
                            ip={item.ip}
                            mac={item.mac}
                        />
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    contentContainer: {
        paddingBottom: 20,
        gap: 15
    },
    headerContainer: {
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold'
    },
    section: {
        marginVertical: 10
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000'
    },
    refreshButton: {
        fontSize: fontSize.labels.medium,
        color: '#1A73E8'
    },
});
