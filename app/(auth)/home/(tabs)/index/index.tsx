import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import PlanSkeleton from '@/components/planSkeleton';
import TopBar from '@/components/topbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const [userDatas, setUserDatas] = useState<any>(null);

    // Variáveis de UI
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const getData = await AsyncStorage.getItem('customerData');
                const userStoredDatas = getData ? JSON.parse(getData) : null;
                setUserDatas(userStoredDatas);

            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);



    return (
        <SafeAreaView style={[{ flex: 1,  backgroundColor: AppColors.external.primary  }]}>
            <TopBar />
            {/* Seção de Pagamento */}
            <View style={styles.homeWrapper}>
                {/* Seção do Plano */}
                <View >
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{'Seu plano'}</Text>
                    </View>


                    {isLoading ? (<PlanSkeleton />) :
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View style={[styles.iconCircle, { backgroundColor: AppColors.internal.button }]}>
                                    <Ionicons name="rocket-outline" size={24} color="white" />
                                </View>
                                <View style={styles.labelsWrapper}>
                                    <Text style={styles.title}>Fibra - {userDatas?.plan?.name}</Text>
                                    <Text style={styles.subtitle}>
                                        R$ {(parseFloat(userDatas?.plan?.value) - parseFloat(userDatas?.monthly_discount || 0)).toFixed(2)} / mês
                                    </Text>
                                    <View style={[styles.statusButton, userDatas?.msg_payment_mk === 'L' ? { backgroundColor: '#15803D' } : { backgroundColor: '#DC2626' }]}>
                                        <Text style={styles.statusText}>{userDatas?.msg_payment_mk === 'L' ? 'Ativo' : 'Bloqueado'}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5592985500742&text=Ol%C3%A1%2C%20acessei%20o%20app%20e%20fiquei%20interessado%20em%20turbinar%20o%20meu%20plano.%20Quais%20s%C3%A3o%20os%20planos%20dispon%C3%ADveis%3F')}>
                                <Text style={styles.actionText}>{'Turbine seu plano'}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    homeWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 24,
    },
    header: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    labelsWrapper: {
        gap: 5,
    },
    title: {
        fontSize: fontSize.titles.mini,
        fontWeight: 'bold',
        color: '#333333',
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
    },
    statusButton: {  
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 3,
        width: 70,
        height: 25,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: fontSize.labels.mini,
    },
    actionButton: {
        backgroundColor: AppColors.internal.button,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: fontSize.labels.large,
        fontWeight: 'bold',
    },
});
