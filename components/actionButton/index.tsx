import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface ActionButtonProps {
    text: string;
    icon: React.ReactNode;
    disabled?: boolean;
    onPress?: () => void;
}

export default function ActionButton({ text, icon, disabled, onPress }: ActionButtonProps) {
    return (
        <View style={{ margin: 5 }}>
            <View style={styles.button}>
                <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7} disabled={disabled} onPress={onPress}>
                    {icon}
                </TouchableOpacity>
            </View>
            <Text style={styles.buttonText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: fontSize.labels.mini,
        textAlign: 'center',
        marginTop: 8,
        color: '#555',
        width: 60,
    },
    button: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.internal.button,
        borderRadius: 15,
    },
    iconCircle: {
        width: 60,
        height: 60,
        backgroundColor: AppColors.internal.button,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
})