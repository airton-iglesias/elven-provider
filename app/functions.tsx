import { SignInData } from "@/schemas/authSchemas";
import { Router } from "expo-router";
import { Keyboard } from "react-native";

const KeyboardListener = (setKeyboardIsVisible: Function) =>{
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardIsVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardIsVisible(false));

        return () => {
            showListener.remove();
            hideListener.remove();
        };
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



const onSubmit = async (data: SignInData, router: Router,requestError: boolean, setRequestError: Function,
    setLoading: Function
) => {
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

export default KeyboardListener;
export { KeyboardListener,  handleInputChange, onSubmit };