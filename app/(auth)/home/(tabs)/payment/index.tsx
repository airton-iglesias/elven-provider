import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import TopBar from '@/components/topbar';
import BillCard from '@/components/billCard';
import BillSkeleton from '@/components/billSkeketon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MIKWEB_TOKEN } from '@/constants/tokens';


export default function Payment() {
    const [userPlan, setUserPlan] = useState<any>(null);
    const [billings, setBillings] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const getData = await AsyncStorage.getItem('customerData');
                const userStoredDatas = getData ? JSON.parse(getData) : null;

                if (userStoredDatas && userStoredDatas.due_day) {
                    setUserPlan(userStoredDatas.plan.name);
                }

                const response = await fetch(`https://api.mikweb.com.br/v1/admin/billings?customer_id=${userStoredDatas.id}&sort_field=due_day&sort_direction=desc`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${MIKWEB_TOKEN}`
                    }
                });

                if (!response.ok) { throw new Error("Erro na requisição"); }

                const result = await response.json();

                if (result.billings.length > 0) {
                    setBillings(result.billings);
                } else {
                    setBillings([]);
                }
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.external.primary }}>
            <TopBar />

            <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: 24 }}>
                <View style={{ paddingHorizontal: 20, gap: 20, flex: 1 }}>

                    {/* Histórico de pagamentos */}
                    <Text style={styles.sectionTitle}>Suas Faturas</Text>

                    {isLoading ? (
                        <View style={{ gap: 15 }}>
                            <BillSkeleton />
                            <BillSkeleton />
                            <BillSkeleton />
                            <BillSkeleton />
                        </View>
                    ) : (
                        billings.length > 0 ? (
                            <FlatList
                                keyExtractor={(item) => item.id}
                                data={billings}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
                                renderItem={({ item }) => {
                                    return (
                                        <BillCard
                                            item={item}
                                            plan={userPlan || ''}
                                            onPress={() => { router.push({ pathname: '/paymentDetails', params: { id: item.id } }) }}
                                            status={item.situation_id}
                                            iconStatus={false}
                                            showStatus
                                            chevron
                                            type={'history'}
                                        />
                                    );
                                }}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 80 }}>
                                <Text style={styles.billsText}>Parece que você ainda não possui faturas disponíveis.</Text>
                            </View>
                        )
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#333333',
    },
    billsText: {
        color: '#000',
        fontSize: fontSize.labels.medium
    }
});