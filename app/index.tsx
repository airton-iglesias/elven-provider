import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Image, StyleSheet, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSignInSchema, SignInData } from '@/schemas/authSchemas';
import Input from '@/components/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestError from '@/components/requestError';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { AppColors } from '@/constants/colors';
import { fontSize } from '@/constants/fonts';
import { MIKWEB_TOKEN } from '@/constants/tokens';

export default function SigninScreen() {

    // State variables for UI 
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState<boolean>(false);

    // React Hook Form setup
    const signInSchema = React.useMemo(() => getSignInSchema(), []);
    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: zodResolver(signInSchema), mode: 'onChange',
    });

    const checkIfUserIsLogged = async () => {
        try {
            const getData = await AsyncStorage.getItem('customerData');

            if (getData) {
                router.replace({
                    pathname: "/home",
                });
                return;
            };
            return;
        }
        catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        checkIfUserIsLogged();
        const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardIsVisible(true));
        const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardIsVisible(false));

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

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
            <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                    <Image
                        style={styles.logoImage}
                        resizeMode="cover"
                        source={require('@/assets/images/splash-icon.png')}
                    />
                </View>
            </View>

            {requestError && (<RequestError messageParts={[{ text: 'CPF ou CNPJ não encontrado.' }]} />)}

            <View style={styles.formContainer}>
                <Text style={styles.headerText}>CPF/CNPJ</Text>
                <Controller
                    control={control}
                    name="cpf_cnpj"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            onChange={(text) => onChange(handleInputChange(text))}
                            label={'Informe o seu CPF/CNPJ para começar'}
                            onBlur={onBlur}
                            value={value}
                            placeholder={'___.___.___-__'}
                            type="numeric"
                            error={errors.cpf_cnpj?.message}
                            keyboardType="numeric"
                            maxLength={18}
                            customLabelColor='#000'
                        />
                    )}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.buttonWrapper}
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: AppColors.external.primary
    },
    logoContainer: {
        paddingHorizontal: 15,
    },
    logoPlaceholder: {
        backgroundColor: '#D9D9D9',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 60,
    },
    logoImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#1A73E8'
    },
    formContainer: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: 270,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    headerText: {
        fontSize: fontSize.titles.large,
        fontWeight: 'bold',
    },
    submitButtonText: {
        fontSize: fontSize.labels.medium,
        color: AppColors.external.text,
        fontWeight: 'bold',
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: AppColors.external.button,
        width: '100%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 10,
    },
    buttonWrapper: {
        borderRadius: 8,
        marginTop: 20
    },

});