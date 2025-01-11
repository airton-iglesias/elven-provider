import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { fontSize } from "@/constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";
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
                        name: result.full_name,
                        birthDate: result.birth_date,
                        cpf: result.cpf_cnpj,
                        email: result.email,
                        phone: result.cell_phone_number_1 || result.phone_number,
                        street: result.street,
                        number: result.number,
                        neighborhood: result.neighborhood,
                        city: result.city,
                        state: result.state,
                        zipCode: result.zip_code
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
        paddingHorizontal: 16,
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
    profileHeader: {
        alignItems: "center",
        marginBottom: 35,
    },
    image: {
        height: 128,
        width: 128,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#E5E7EB',
        padding: 52,
        borderRadius: 64,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: -16,
        right: -8,
        width: 48,
        height: 48,
        backgroundColor: '#E5E7EB',
        borderWidth: 4,
        borderColor: '#F8F9FA',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: "absolute",
        bottom: -5,
        right: -5,
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 4,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    cameraText: {
        fontSize: 12,
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
        color: "#000",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    changeLink: {
        fontSize: fontSize.labels.medium,
        color: AppColors.internal.button,
        fontWeight: "bold",
    },
});
