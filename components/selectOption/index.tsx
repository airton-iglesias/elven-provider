import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fontSize } from '@/constants/fonts';

const SelectOption = ({ item, isSelected, onSelect }: any) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        borderBottomWidth: 1,
        backgroundColor: isSelected ? '#EDEDED' : '#fff',
        borderColor: '#d1d5db'
      }}
    >
      <View  style={styles.optionWrapper}>
        <View style={styles.optionContent}>
          <Text style={{fontSize: fontSize.labels.medium}}>{item.text}</Text>
        </View>
        {isSelected && <Feather name="check" size={24} color="black" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionWrapper: {
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: 20,
    fontSize: fontSize.labels.medium,
    flexDirection: 'row',
    color: '#6b7280'
  },
  optionContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  }
})

export default SelectOption;
