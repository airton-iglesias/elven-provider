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

type DeviceData = {
    id: string;
    name: string;
    isActive: boolean;
    ip: string;
    mac: string;
};

export default function Devices() {
    const [deviceName, setDeviceName] = useState<string>('Carregando...');
    const [deviceIsActive, setDeviceIsActive] = useState<boolean>(false);
    const [devicesList, setDevicesList] = useState<DeviceData[]>([]);
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getDeviceName = async () => {
        if (Device.isDevice) {
            const name = Device.deviceName || 'Dispositivo Desconhecido';
            setDeviceName(name);
        } else {
            setDeviceName('Simulador');
        }
    };

    const fetchRouterID = async (userSerial: string) => {
        const url = `http://192.168.0.7:7557/devices/?device=${userSerial}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Nenhum dado válido retornado para este serial.');
        }

        return data[0]._id;
    };

    const refreshHostInfo = async (encodedRouterID: string) => {
        const url = `http://192.168.0.7:7557/devices/${encodedRouterID}/tasks?connection_request`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{"name":"refreshObject","objectName":"InternetGatewayDevice.LANDevice.*.Hosts.Host"}',
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição de refresh.');
        }
    };

    const fetchDevicesList = async (userSerial: string) => {
        const url = `http://192.168.0.7:7557/devices/?device=${userSerial}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar lista de dispositivos.');
        }

        const dataDevice = await response.json();
        const hostsObj =
            dataDevice?.[0]?.InternetGatewayDevice?.LANDevice?.[1]?.Hosts?.Host || {};

        const deviceList = Object.keys(hostsObj)
            .filter((key) => !key.startsWith('_'))
            .map((key) => {
                const hostData = hostsObj[key];
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
                throw new Error('Não foi possível encontrar o serial no AsyncStorage.');
            }

            setSerialNumber(userSerialNumber);
            const routerID = await fetchRouterID(userSerialNumber);
            const encodedRouterID = encodeURIComponent(routerID);
            await refreshHostInfo(encodedRouterID);
            await fetchDevicesList(userSerialNumber);
        } catch (error) {
            console.error(error);
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
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingBottom: 20,
        gap: 15,
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
        fontWeight: 'bold',
    },
    section: {
        marginVertical: 10,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    refreshButton: {
        fontSize: fontSize.labels.medium,
        color: '#1A73E8',
    },
});
