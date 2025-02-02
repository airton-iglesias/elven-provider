import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Image, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSignInSchema, SignInData } from '@/schemas/authSchemas';
import Input from '@/components/input';
import RequestError from '@/components/requestError';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { AppColors } from '@/constants/colors';
import { fontSize } from '@/constants/fonts';
import { MIKWEB_TOKEN } from '@/constants/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function SigninScreen() {

    // State variables for UI 
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState<boolean>(false);

    // React Hook Form setup
    const signInSchema = React.useMemo(() => getSignInSchema(), []);
    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: zodResolver(signInSchema), mode: 'onChange',
    });

    const sanitizeCpfCnpj = (input: string): string => {
        return input.replace(/[\.\-\/]/g, '');
    };

    const handleInputChange = (text: string) => {
        let textFormated = text.replace(/\D/g, '');
        if (textFormated.length <= 11) {
            // Formatação para CPF: 000.000.000-00
            textFormated = textFormated
                .replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        } else if (textFormated.length <= 14) {
            // Formatação para CNPJ: 00.000.000/0000-00
            textFormated = textFormated
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
                .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
        }
        return textFormated;
    };

    const handleFormSubmit = async (data: SignInData) => {
        //onSubmit(data, router, requestError, setRequestError, setLoading);

        if (requestError) { setRequestError(false); }
        setLoading(true);
        try {
            // Fazendo a requisição para a API
            const response = await fetch(`https://api.mikweb.com.br/v1/admin/customers/?search=${sanitizeCpfCnpj(data.cpf_cnpj)}`, {
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
            if (result.customers && result.customers.length > 0) {

                await AsyncStorage.setItem('customerData', JSON.stringify(result.customers[0]));

                router.navigate({ pathname: "/home" });
            } else {
                setRequestError(true);
            }
        } catch (error) {
            console.error("Erro:", error);
            setRequestError(true);
        } finally {
            setLoading(false);
        }


    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                style={styles.topContainer}
                colors={['#1E90FF', '#0A1F44',]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}

            />
            <Animated.View
                entering={FadeInUp.duration(1000).springify()}
                style={styles.logoContainer}
            >
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View entering={SlideInDown.duration(1000).easing(Easing.inOut(Easing.quad))}>
                <View style={styles.formContainer}>


                    {requestError && (
                        <View style={styles.errorContainer}>
                            <RequestError messageParts={[{ text: 'CPF ou CNPJ não encontrado.' }]} />
                        </View>
                    )}

                    <Text style={styles.title}>Acesse sua conta</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Informe o seu CPF/CNPJ</Text>
                        <Controller
                            control={control}
                            name="cpf_cnpj"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    onChange={(text) => onChange(handleInputChange(text))}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder={'___.___.___-__'}
                                    type="numeric"
                                    error={errors.cpf_cnpj?.message}
                                    keyboardType="numeric"
                                    maxLength={18}
                                    customLabelColor={'#555'}
                                    customHeight={56}
                                    customFontSize={30}
                                />
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.buttonWrapper, loading && styles.buttonDisabled]}
                        onPress={handleSubmit(handleFormSubmit)}
                        disabled={loading}
                    >
                        <View style={styles.submitButton}>
                            {loading ? (
                                <ActivityIndicator size={24} color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>{'Entrar'}</Text>
                            )}
                        </View>
                    </TouchableOpacity>


                    <Text style={styles.footerText}>
                        Não tem um plano?{' '}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5592985500742&text=Olá, acessei o app mas ainda não tenho um plano. Quais são os planos disponíveis?')}>
                            <Text style={styles.footerLink}>Contrate-nos!</Text>
                        </TouchableOpacity>
                    </Text>


                </View>
            </Animated.View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.external.primary,
    },
    topContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    formContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingVertical: 25,
        elevation: 2

    },
    title: {
        fontSize: fontSize.titles.extralarge,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: fontSize.labels.large,
        color: '#555',
        marginBottom: 12,
        fontWeight: '500',
    },
    buttonWrapper: {
        borderRadius: 12,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: AppColors.external.button,
        width: '100%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    submitButtonText: {
        fontSize: fontSize.labels.large,
        color: AppColors.external.text,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    errorContainer: {},
    footerText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#555',
        fontSize: fontSize.labels.large,
    },
    footerLink: {
        color: AppColors.external.primary,
        fontSize: fontSize.labels.large,
    },
});
