import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface PaymentDateSelectProps {
    onDateSelect: (date: string) => void;
}

const PaymentDateSelect = ({ onDateSelect }: PaymentDateSelectProps) => {
    const dates = ['05', '08', '15', '22', '28'];
    const [selectedDate, setSelectedDate] = useState<string>(dates[0]);

    const handlePress = (item: string) => {
        setSelectedDate(item);
        onDateSelect(item);
    };

    const renderItem = ({ item }: { item: string }) => {
        const isSelected = item === selectedDate;
        return (
            <TouchableOpacity
                onPress={() => handlePress(item)}
                style={[styles.item, isSelected && styles.selectedItem]}
            >
                <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={dates}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 60,
        height: 60,
        marginHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedItem: {
        borderColor: 'orange',
        borderWidth: 2,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default PaymentDateSelect;
