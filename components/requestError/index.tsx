import { View, StyleSheet, Text, Linking } from "react-native";
import { Feather } from '@expo/vector-icons';

export default function RequestError({ messageParts }: any) {

    const handlePress = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.errorMessageContainer}>
            <View style={styles.errorMessageWrapper}>
                <View style={styles.iconWrapper}>
                    <Feather name="alert-circle" size={30} color="#B02A37" />
                </View>
                <Text style={styles.errorMessage}>
                    {messageParts.map((part: any, index: number) => (
                        part.link ? (
                            <Text key={index} onPress={() => handlePress(part.link)} style={styles.link}>
                                {part.text}
                            </Text>
                        ) : (
                            <Text key={index}>
                                {part.text}
                            </Text>
                        )
                    ))}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    errorMessageContainer: {
        width: '100%',
    },
    errorMessageWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F8D7DA',
        marginBottom: 10,
        width: '100%',
    },
    errorMessage: {
        color: '#B02A37',
        flexShrink: 1,
    },
    link: {
        textDecorationLine: 'underline',
    },
    iconWrapper: {
        paddingRight: 10,
    }
});
