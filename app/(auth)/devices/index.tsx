import React, { useEffect, useState, useCallback } from 'react';
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

    const getDeviceName = useCallback(async () => {
        const name = Device.isDevice ? Device.deviceName || 'Dispositivo Desconhecido' : 'Simulador';
        setDeviceName(name);
    }, []);

    const fetchRouterID = useCallback(async (userSerial: string) => {
        const query = encodeURIComponent(JSON.stringify({ "_deviceId._SerialNumber": userSerial }));
        const projection = encodeURIComponent("_id,InternetGatewayDevice.LANDevice,_deviceId");
        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=${projection}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar ID do roteador: ${response.statusText}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Nenhum dado encontrado para este serial.');
        }

        const routerID = data[0]._id;

        const needsURICoding = /[/?&]/.test(routerID);

        return needsURICoding ? encodeURIComponent(routerID) : routerID;
    }, []);

    const refreshHostInfo = useCallback(async (encodedRouterID: string) => {
        const url = `http://${ACS_IP_ADRESS}/devices/${encodedRouterID}/tasks?connection_request`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'refreshObject', objectName: 'InternetGatewayDevice.LANDevice.*.Hosts.Host' }),
        });

        if (!response.ok) throw new Error('Erro ao atualizar informações do host.');
    }, []);

    const fetchDevicesList = useCallback(async (userSerial: string) => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": userSerial });
        const projection = "_id,InternetGatewayDevice.LANDevice,_deviceId";
        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=${projection}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar lista de dispositivos.');

        const dataDevice = await response.json();
        const hosts = dataDevice?.[0]?.InternetGatewayDevice?.LANDevice?.[1]?.Hosts?.Host || {};

        const deviceList = Object.entries(hosts)
            .filter(([key]) => !key.startsWith('_'))
            .map(([id, host]: any) => ({
                id,
                name: host?.HostName?._value || 'Desconhecido',
                isActive: host?.Active?._value || false,
                ip: host?.IPAddress?._value || '---',
                mac: host?.MACAddress?._value || '---',
            }));

        setDevicesList(deviceList);
    }, []);

    const initializeData = useCallback(async () => {
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
            const encodedRouterID = encodeURIComponent(routerID);

            await refreshHostInfo(encodedRouterID);
            await fetchDevicesList(userSerialNumber);
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getDeviceName, fetchRouterID, refreshHostInfo, fetchDevicesList]);

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    const handleRefresh = async () => {
        try {
            setIsLoading(true);
            if (serialNumber) {
                const routerID = await fetchRouterID(serialNumber);
                const encodedRouterID = encodeURIComponent(routerID);
                await refreshHostInfo(encodedRouterID);
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
                            ) : (
                                <DeviceCard
                                    isActive={userDevice?.isActive || false}
                                    name={userDevice?.name || deviceName}
                                    ip={userDevice?.ip || '---'}
                                    mac={userDevice?.mac || '---'}
                                />
                            )}
                        </View>
                        <View style={[styles.section, styles.listHeader]}>
                            <Text style={styles.sectionTitle}>Outros dispositivos</Text>
                            <TouchableOpacity
                                onPress={handleRefresh}
                                activeOpacity={0.7}
                                disabled={isLoading}
                            >
                                <Text style={styles.refreshButton}>Atualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                renderItem={({ item }) =>
                    isLoading ? <DeviceSkeleton /> : (
                        <DeviceCard {...item} />
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
