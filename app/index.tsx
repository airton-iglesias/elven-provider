import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/colors';
import { fontSize } from '@/constants/fonts';

interface ScreenIndicatorsProps {
    count: number;
    activeIndex: number;
}

export default function App() {
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const storedData = await AsyncStorage.getItem('customerData');
                if (storedData) {
                    router.replace({ pathname: '/home' });
                }
            } catch (error) {
                console.error('Erro ao verificar o usuário logado:', error);
            }
        };

        checkUserLoggedIn();
    }, []);

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

            <View style={styles.contentContainer}>
                <Animated.Text
                    entering={FadeInDown.duration(1000).springify()}
                    style={styles.title}
                >
                    Sua jornada digital começa aqui!
                </Animated.Text>
                <Animated.Text
                    entering={FadeInDown.delay(100).duration(1000).springify()}
                    style={styles.subtitle}
                >
                    Muito obrigado por nos escolher, o nosso objetivo é conectar você ao mundo digital com:
                    {"\n\n"}🚀 velocidade de alta performance;
                    {"\n\n"}🛡️ segurança de nível bancário;
                    {"\n\n"}🏃‍♂️‍➡️ sem pausas;
                    {"\n\n"}e muito mais!
                </Animated.Text>


                <Animated.View
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    style={styles.buttonContainer}
                >


                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.buttonWrapper}
                        onPress={() => router.replace('/signin')}

                    >
                        <View style={styles.submitButton}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                <Text style={styles.submitButtonText}>Continuar</Text>
                                <Feather name="arrow-right" size={20} color="#fff" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    topContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    contentContainer: {
        padding: 24,
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',

    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    buttonWrapper: {
        borderRadius: 12,
        marginTop: 4,
        width: '100%'
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
});
