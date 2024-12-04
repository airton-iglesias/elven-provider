import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import * as Device from 'expo-device';

import { useLocale } from '@/contexts/TranslationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import DeviceIcon from '@/assets/icons/deviceIcon';
import { AppColors } from '@/constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import DeviceCard from '@/components/deviceCard';
import DeviceSkeleton from '@/components/deviceSkeleton';

// Remover a declaração global de devicesList
// const devicesList = [ ... ]; // Removido para evitar conflito

export default function Devices() {
    const [deviceName, setDeviceName] = useState<string>('Carregando...');
    const [deviceIsActive, setDeviceIsActive] = useState<boolean>(false);
    const [devicesList, setDevicesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getDeviceName = async () => {
        if (Device.isDevice) {
            const name = Device.deviceName || 'Dispositivo Desconhecido';
            setDeviceName(name);
            return name;
        } else {
            setDeviceName('Simulador');
            return 'Simulador';
        }
    };

    const fetchDevicesList = async () => {
        if (!isLoading) { setIsLoading(true); }


        // Simular atraso de rede
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const requestDevicesList = [
            { id: '1', name: 'M2012K11AG', isActive: true },
            { id: '2', name: 'Nome do dispositivo', isActive: false },
            { id: '3', name: 'Nome do dispositivo', isActive: false },
            { id: '4', name: 'Nome do dispositivo', isActive: false },
            { id: '5', name: 'Nome do dispositivo', isActive: false },
        ];

        const currentDeviceName = await getDeviceName();

        // Filtrar a lista de dispositivos para remover o dispositivo atual
        const filteredDevicesList = requestDevicesList.filter(
            (device) => device.name !== currentDeviceName
        );

        setDevicesList(filteredDevicesList);

        const matchedDevice = requestDevicesList.find(
            (device) => device.name === currentDeviceName && device.isActive
        );

        setDeviceIsActive(!!matchedDevice);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDevicesList();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
            <FlatList
                data={devicesList}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        {/* Cabeçalho */}
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
                                    isActive={deviceIsActive}
                                    name={deviceName || 'Dispositivo Desconhecido'}
                                />
                            )}
                        </View>

                        {/* Título da lista */}
                        <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={styles.sectionTitle}>Outros dispositivos</Text>
                            <TouchableOpacity activeOpacity={0.7} disabled={isLoading} onPress={fetchDevicesList}>
                                <Text style={styles.refreshButton}>Atualizar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    isLoading ? (
                        <DeviceSkeleton />
                    ) : (
                        <DeviceCard
                            isActive={item.isActive}
                            name={item.name || 'Dispositivo Desconhecido'}
                        />
                    )
                )}
                contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 25,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    section: {
        marginVertical: 10,

    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
        height: 100
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: AppColors.internal.button,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 15,
    },
    deviceName: {
        fontSize: fontSize.labels.medium,
        color: '#000',
    },
    statusBadgeActive: {
        marginTop: 8,
        backgroundColor: '#15803D',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusTextActive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
    statusBadgeInactive: {
        marginTop: 8,
        backgroundColor: '#DC2626',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusTextInactive: {
        fontSize: fontSize.labels.medium,
        color: '#FFF',
    },
    refreshButton: {
        fontSize: fontSize.labels.medium,
        color: '#1A73E8',
    },
});
