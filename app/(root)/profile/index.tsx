import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { fontSize } from "@/constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "moti/skeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface userData {
    name: string;
    birthDate: string;
    cpf: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export default function Profile() {
    const [user, setUser] = useState<userData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Carrega os dados salvos no AsyncStorage
                const storedData = await AsyncStorage.getItem('customerData');
                if (storedData) {
                    const result = JSON.parse(storedData);

                    // Preenche os campos com os dados carregados
                    const userData: userData = {
                        name: result.full_name || "Sem informação",
                        birthDate: result.birth_date || "Sem informação",
                        cpf: result.cpf_cnpj || "Sem informação",
                        email: result.email || "Sem informação",
                        phone: result.cell_phone_number_1 || result.phone_number || "Sem informação",
                        street: result.street || "Sem informação",
                        number: result.number || "Sem informação",
                        neighborhood: result.neighborhood || "Sem informação",
                        city: result.city || "Sem informação",
                        state: result.state || "Sem informação",
                        zipCode: result.zip_code || "Sem informação"
                    };

                    setUser(userData);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Dados pessoais</Text>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <AntDesign name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Dados Pessoais */}
                <View style={styles.section}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Nome</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={180} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.name}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Data de nascimento</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={100} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.birthDate}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>CPF</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={100} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.cpf}</Text>
                        )}
                    </View>
                </View>

                {/* Dados de Contato */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados de contato</Text>
                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={130} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.email}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Telefone</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={100} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.phone}</Text>
                        )}
                    </View>
                </View>

                {/* Endereço */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados de endereço</Text>
                    <View style={styles.field}>
                        <Text style={styles.label}>Rua</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={180} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.street}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Número</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={80} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.number}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Bairro</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={120} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.neighborhood}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Cidade</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={130} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.city}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Estado</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={130} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.state}</Text>
                        )}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>CEP</Text>
                        {isLoading ? (
                            <Skeleton colorMode="light" width={100} height={20} />
                        ) : (
                            <Text style={styles.value}>{user?.zipCode}</Text>
                        )}
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    headerContainer: {
        marginTop: 25,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
        marginBottom: 8,
    },
    field: {
        borderBottomWidth: 1,
        paddingVertical: 16,
        borderColor: '#D9D9D9'
    },
    label: {
        fontSize: fontSize.labels.large,
        color: "#000",
        fontWeight: 'bold',
        marginBottom: 4,
    },
    value: {
        fontSize: fontSize.labels.medium,
        color: "#555",
    },
});
