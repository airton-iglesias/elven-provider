import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

export default function Switch({onChange, value}: any) {
    const [isOn, setIsOn] = useState<boolean>(value ? value:false);

    const toggleSwitch = () => {
        setIsOn(isOn => !isOn);
        onChange(isOn);
    };

    return (
        <View>
            <TouchableOpacity
                style={[styles.outter,
                isOn
                    ? { justifyContent: 'flex-end', backgroundColor: '#000' }
                    : { justifyContent: 'flex-start', backgroundColor: 'gray' }
                ]}
                activeOpacity={1}
                onPress={toggleSwitch}
            >
                <View style={styles.inner} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inner: {
        width: 18,
        height: 18,
        backgroundColor: 'white',
        borderRadius: 999,
        marginHorizontal: 1
    },
    outter: {
        width: 40,
        height: 20,
        backgroundColor: 'gray',
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row'
    }

})