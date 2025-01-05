import React, { useEffect, useState } from 'react';
import { ActivityIndicator,Text, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSignInSchema, SignInData } from '@/schemas/authSchemas';
import Input from '@/components/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestError from '@/components/requestError';
import styles from './styles';
import { KeyboardListener, handleInputChange, onSubmit} from './functions';
import { router } from 'expo-router';

export default function SigninScreen() {
    
    // State variables for UI 
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState<boolean>(true);

    // React Hook Form setup
    const signInSchema = React.useMemo(() => getSignInSchema(), []);
    const {control, handleSubmit, formState: {errors}} = useForm<SignInData>({
        resolver: zodResolver(signInSchema), mode: 'onChange',
    });

    // Effect to handle keyboard visibility changes
    useEffect(() => {
        KeyboardListener(setKeyboardIsVisible);
    }, []);

    const handleFormSubmit = (data: SignInData) => {
        onSubmit(data, router, requestError, setRequestError, setLoading);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                    <Text>Logo</Text>
                </View>
            </View>

            {requestError && ( <RequestError messageParts={[{ text: 'Mensagem de erro' }]}/>)}

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

