import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, ScrollView, ToastAndroid } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import TopBar from '@/components/topbar';
import PlanSkeleton from '@/components/planSkeleton';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { ACS_IP_ADRESS } from '@/constants/ipAdress';

type DeviceData = {
    id: string;
    name: string;
    isActive: boolean;
    ip: string;
    mac: string;
};

export default function Home() {
    const [userData, setUserData] = useState<any>(null);
    const [devicesList, setDevicesList] = useState<DeviceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWifiPassword, setShowWifiPassword] = useState(false);
    const [wifiPassword, setWifiPassword] = useState('');
    const [ssid, setSsid] = useState('');



    const fetchDevicesList = async (userSerial: string) => {
        const query = JSON.stringify({ "_deviceId._SerialNumber": userSerial });
        const url = `http://${ACS_IP_ADRESS}/devices/?query=${query}&projection=_id,InternetGatewayDevice.LANDevice`;

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
        setSsid(dataDevice[0].InternetGatewayDevice.LANDevice?.[1].WLANConfiguration?.[1]?.SSID?._value);
        setWifiPassword(dataDevice[0].InternetGatewayDevice.LANDevice?.[1].WLANConfiguration?.[1]?.PreSharedKey?.[1]?.KeyPassphrase?._value);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const storedData = await AsyncStorage.getItem('customerData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setUserData(parsedData);
                    fetchDevicesList(parsedData.observation);
                }
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const monthlyCost = userData
        ? (parseFloat(userData?.plan?.value) - parseFloat(userData?.monthly_discount || 0)).toFixed(2)
        : null;

    const isActive = userData?.msg_payment_mk === 'L';
    const statusText = isActive ? 'Ativo' : 'Bloqueado';
    const statusColor = isActive ? '#15803D' : '#DC2626';

    const handleContactSupport = () => {
        Linking.openURL(
            'https://api.whatsapp.com/send?phone=5592985500742&text=Olá, preciso de suporte.'
        );
    };

    const handleContactTurbine = () => {
        Linking.openURL(
            'https://api.whatsapp.com/send?phone=5592985500742&text=Olá, estou interessado em turbinar o meu plano. Quais são os planos disponíveis?'
        );
    };

    const toggleShowWifiPassword = () => {
        setShowWifiPassword(!showWifiPassword);
    };

    const handleCopyWifiCredentials = async () => {
        const credentials = `Credenciais do Wi-Fi\n\nSSID: ${ssid || 'Sem informação'}\nSenha: ${wifiPassword || 'Sem informação'}`;
        await Clipboard.setStringAsync(credentials);

        ToastAndroid.show('As credenciais copiadas para a área de transferência.', ToastAndroid.SHORT);
    };

    const filteredDevices = devicesList.filter((device) => device.isActive);

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopBar />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <PlanSkeleton />
                ) : (
                    <>

                        {/* Card de Wifi aprimorado */}
                        <Animated.View entering={SlideInLeft.duration(500)}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Acesso ao Wi-Fi</Text>

                                <View style={styles.wifiInfo}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={styles.wifiLabel}>
                                                <Text style={styles.boldText}>SSID:</Text> {ssid || 'Sem informação'}
                                            </Text>
                                            <View style={styles.passwordContainer}>
                                                <Text style={styles.wifiLabel}>
                                                    <Text style={styles.boldText}>Senha: </Text>
                                                    {showWifiPassword ? wifiPassword || 'Sem informação' : '••••••••'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 2 }}>
                                            <TouchableOpacity onPress={toggleShowWifiPassword} activeOpacity={0.7}>
                                                <Ionicons
                                                    name={showWifiPassword ? 'eye-off' : 'eye'}
                                                    size={30}
                                                    color={AppColors.internal.button}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Informações adicionais */}
                                    <View style={styles.wifiExtraInfo}>
                                        <Text style={styles.wifiExtraLabel}>
                                            <Text style={styles.boldText}>Dispositivos conectados:</Text> {filteredDevices?.length || '0'}
                                        </Text>
                                    </View>

                                    {/* Botão para copiar as credenciais */}
                                    <TouchableOpacity style={styles.copyButton} activeOpacity={0.7} onPress={handleCopyWifiCredentials}>
                                        <Text style={styles.copyButtonText}>Copiar credenciais</Text>
                                        <Ionicons name="copy-outline" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>

                        {/* Card de Detalhes do Plano */}
                        <Animated.View entering={SlideInRight.duration(500)}>
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardPlanTitle}>Seu plano</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                        <Text style={styles.statusBadgeText}>{statusText}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardHeader}>
                                    <View style={styles.iconWrapper}>
                                        <Ionicons name="rocket-outline" size={28} color="#fff" />
                                    </View>
                                    <View style={styles.planInfo}>
                                        <Text style={styles.planName}>
                                            Fibra - {userData?.plan?.name.replace('_', ' ')}
                                        </Text>
                                        <Text style={styles.planPrice}>R$ {monthlyCost?.replace('.', ',')} / mês</Text>
                                    </View>
                                </View>

                                {/* Botão Turbinar */}
                                <TouchableOpacity style={styles.turbineButton} activeOpacity={0.7} onPress={handleContactTurbine}>
                                    <Text style={styles.turbineButtonText}>Turbinar o plano</Text>
                                    <MaterialIcons name="trending-up" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Seção de Suporte */}
                        <Animated.View entering={SlideInLeft.duration(500)}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Suporte</Text>
                                <Text style={styles.supportText}>
                                    Se precisar de ajuda ou tiver dúvidas sobre o seu plano, nossa equipe está pronta para atendê-lo.
                                </Text>
                                <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport} activeOpacity={0.7}>
                                    <Text style={styles.supportButtonText}>Fale com o Suporte</Text>
                                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.external.primary,
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingHorizontal: 20,
    },
    contentContainer: {
        paddingVertical: 28,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 8,
    },
    cardTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 8,
    },
    cardPlanTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: AppColors.internal.button,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        fontSize: fontSize.labels.extralarge,
        fontWeight: 'bold',
        color: '#000',
    },
    planPrice: {
        fontSize: fontSize.labels.medium,
        color: '#555',
        marginVertical: 4,
    },
    statusBadge: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 4,
        alignSelf: 'flex-start'
    },
    statusBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    turbineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,
    },
    turbineButtonText: {
        color: '#FFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        marginRight: 8,
    },
    supportText: {
        fontSize: fontSize.labels.medium,
        color: '#555',
        marginBottom: 16,
        lineHeight: 20,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,
    },
    supportButtonText: {
        color: '#FFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        marginRight: 8,
    },
    wifiInfo: {},
    wifiLabel: {
        fontSize: fontSize.labels.medium,
        color: '#555',
        marginTop: 4,
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    wifiExtraInfo: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 12,
    },
    wifiExtraLabel: {
        fontSize: fontSize.labels.medium,
        color: '#555',
        marginBottom: 16,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,

    },
    copyButtonText: {
        color: '#FFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
        marginRight: 8,
    },
});

