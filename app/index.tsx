import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Keyboard, KeyboardAvoidingView, Text,
    TouchableOpacity, View, StyleSheet,
    Platform, ScrollView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getSignInSchema, SignInData } from '@/schemas/authSchemas';
import CheckBox from '@/components/checkbox';
import Input from '@/components/input';
import { useLocale } from '@/contexts/TranslationContext';
import { fontSize } from '@/constants/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import RequestError from '@/components/requestError';

export default function SigninScreen() {
    // State variables for UI 
    const [isChecked, setChecked] = useState(false);
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState<boolean>(true);

    // React Hook Form setup
    const signInSchema = React.useMemo(() => getSignInSchema(), []);
    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        mode: 'onChange',
    });

    // Effect to handle keyboard visibility changes
    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardIsVisible(true));
        const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardIsVisible(false));

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    const onSubmit = async (data: SignInData) => {
        if (requestError) { setRequestError(!requestError); }
        setLoading(true);

        try {
            // Make the request to API here. The params is data.email, data.password and isChecked to keep Logged


            // The Timeout is to simulate an API call delay, you can remove it when making the API call
            setTimeout(() => {
                setLoading(false);
                router.navigate("/home");
                return;
            }, 2000);
        }
        catch (error) {
            setLoading(false);
            setRequestError(true);
        }
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


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                    <Text>Logo</Text>
                </View>
            </View>

            {requestError && (
                <RequestError
                    messageParts={[
                        { text: 'Mensagem de erro' },
                    ]}
                />

            )}

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
                    onPress={handleSubmit(onSubmit)}
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

