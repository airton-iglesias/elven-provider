import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import TopBar from '@/components/topbar';
import BillCard from '@/components/billCard';
import BillSkeleton from '@/components/billSkeketon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MIKWEB_TOKEN } from '@/constants/tokens';
import Animated, { SlideInRight } from 'react-native-reanimated';

export default function Payment() {
    const [userPlan, setUserPlan] = useState(null);
    const [billings, setBillings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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

                if (!response.ok) {
                    throw new Error("Erro na requisição");
                }

                const result = await response.json();

                if (result.billings.length > 0) {
                    const paidBills = result.billings.filter((bill: any) => bill.situation_id === 3);

                    let openBills = result.billings.filter((bill: any) => bill.situation_id !== 3);

                    openBills.sort((a: any, b: any) => new Date(a.due_day).getTime() - new Date(b.due_day).getTime());
                    setBillings({
                        open: openBills,
                        paid: paidBills,
                    });
                } else {
                    setBillings(null);
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

            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={{ gap: 20, flex: 1 }}>

                    {isLoading ? (
                        <View style={{ gap: 15, paddingHorizontal: 20, paddingTop: 24 }}>
                            <BillSkeleton />
                            <BillSkeleton />
                            <BillSkeleton />
                            <BillSkeleton />
                        </View>
                    ) : (
                        billings.open.length > 0 ? (
                            <SectionList
                                sections={[
                                    { title: 'Faturas em aberto', data: billings.open },
                                    { title: 'Histórico de pagamento', data: billings.paid }
                                ]}
                                keyExtractor={(item) => item.id}
                                renderSectionHeader={({ section: { title } }) => (
                                    <Text style={styles.sectionTitle}>{title}</Text>
                                )}
                                renderItem={({ item, index }) => (
                                    <Animated.View entering={SlideInRight.duration((index * 100) + 300)}>
                                        <BillCard
                                            item={item}
                                            onCardPress={() => {
                                                router.push({
                                                    pathname: '/paymentDetails',
                                                    params: { id: item.id }
                                                });
                                            }}
                                            status={item.situation_id}
                                        />
                                    </Animated.View>
                                )}
                                contentContainerStyle={{ paddingBottom: 20, gap: 15, paddingHorizontal: 20, paddingTop: 24 }}
                                showsVerticalScrollIndicator={false}
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
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
    },
    billsText: {
        color: '#000',
        fontSize: fontSize.labels.medium
    }
});
