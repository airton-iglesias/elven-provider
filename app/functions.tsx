import { SignInData } from "@/schemas/authSchemas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Router } from "expo-router";
import { Keyboard } from "react-native";

const KeyboardListener = (setKeyboardIsVisible: Function) => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardIsVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardIsVisible(false));

    return () => {
        showListener.remove();
        hideListener.remove();
    };
}

function sanitizeCpfCnpj(input: string): string {
    return input.replace(/[\.\-\/]/g, '');
}

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


const onSubmit = async (
    data: SignInData,
    router: Router,
    requestError: boolean,
    setRequestError: Function,
    setLoading: Function
) => {
    if (requestError) {
        setRequestError(false);
    }
    setLoading(true);
    try {
        // Fazendo a requisição para a API
        const response = await fetch(`https://api.mikweb.com.br/v1/admin/customers/?search=${sanitizeCpfCnpj(data.cpf_cnpj)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ALPBKXMNQC:Q0I9WSDEBHWQBDA4PTRDNVSD5QKT3TCZ`
            }
        });
        if (!response.ok) {
            throw new Error("Erro na requisição");
        }
        const result = await response.json();
        if (result.customers && result.customers.length > 0) {

            await AsyncStorage.setItem('customerData', JSON.stringify(result.customers[0]));

            router.navigate({
                pathname: "/home",
            });
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

export default KeyboardListener;
export { KeyboardListener, handleInputChange, onSubmit };