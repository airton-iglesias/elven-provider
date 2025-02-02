import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { fontSize } from '@/constants/fonts';
import { AppColors } from '@/constants/colors';

interface InputProps {
    label?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'date' | 'time' | 'url' | 'numeric';
    onChange: (text: string) => void;
    onBlur?: () => void;
    value?: string;
    error?: string;
    keyboardType?: any;
    maxLength?: number;
    customPaddingLeft?: number;
    customColor?: string;
    customBackground?: string;
    customLabelColor?: string;
    customFontSize?: number;
    errorColor?: string;
    customHeight?: number;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    type,
    onChange,
    onBlur,
    value,
    error,
    errorColor,
    keyboardType,
    maxLength,
    customPaddingLeft,
    customColor,
    customBackground,
    customLabelColor,
    customFontSize,
    customHeight,
    ...rest
}) => {
    const [isInputFocus, setIsInputFocus] = React.useState(false);
    const [secureEntry, setSecureEntry] = React.useState(type === 'password');

    const handleInputChange = (text: string) => {
        if (type === 'numeric') {
            const numericText = text.replace(/[^0-9]/g, '');
            onChange(numericText);
        } else {
            onChange(text);
        }
    };

    return (
        <View style={styles.inputSection}>
            {label ? (
                <Text style={[styles.inputLabel, customLabelColor ? { color: customLabelColor } : null]}>
                    {label}
                </Text>
            ) : null}
            <View style={styles.inputWrapper}>
                <TextInput
                    autoCapitalize={'none'}
                    cursorColor={'#212529'}
                    onFocus={() => setIsInputFocus(true)}
                    onBlur={() => {
                        setIsInputFocus(false);
                        onBlur ? onBlur() : null;
                    }}
                    onChangeText={handleInputChange}
                    value={value}
                    {...rest}
                    placeholder={placeholder}
                    secureTextEntry={secureEntry}
                    keyboardType={keyboardType ? keyboardType : 'default'}
                    maxLength={maxLength ? maxLength : 500}
                    style={[
                        styles.textInput,
                        isInputFocus && styles.inputFocused,
                        customPaddingLeft ? { paddingLeft: customPaddingLeft } : null,
                        customColor ? { color: customColor } : { color: '#212529' },
                        customBackground ? { backgroundColor: customBackground } : null,
                        customFontSize ? { fontSize: customFontSize } : { fontSize: fontSize.labels.extralarge },
                        customHeight ? { height: customHeight } : null,
                    ]}
                />
                {type === 'password' && (
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => setSecureEntry(!secureEntry)}
                    >
                        <Feather
                            name={secureEntry ? 'eye' : 'eye-off'}
                            size={24}
                            color="#6C757D"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={[styles.errorText, errorColor ? { color: errorColor } : { color: '#B02A37' }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputSection: {
        width: '100%',
    },
    inputLabel: {
        fontSize: fontSize.labels.medium,
        fontWeight: 'normal',
        marginBottom: 4,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    iconWrapper: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
    },
    inputFocused: {
        borderColor: AppColors.external.inputBorderFocus,
        borderWidth: 2
    },
    textInput: {
        borderWidth: 2,
        borderRadius: 6,
        width: '100%',
        height: 48,
        borderColor: AppColors.external.inputBorder,
        paddingHorizontal: 10,
        backgroundColor: AppColors.external.input,
    },
    errorText: {
        fontSize: fontSize.labels.medium,
        marginTop: 5,
        backgroundColor: '#F8D7DA',
        borderRadius: 5,
        padding: 5
    },
});

export default Input;
