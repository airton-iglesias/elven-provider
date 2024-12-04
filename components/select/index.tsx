import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { fontSize } from '@/constants/fonts';

const Select = ({ options, onChangeSelect, text, SelectOption, error }: any) => {
  const [selected, setSelected] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: any) => {
    setSelected(item);
    onChangeSelect(item);
    setModalVisible(false);
  };

  const renderOption = ({ item }: any) => {
    return (
      <SelectOption
        item={item}
        isSelected={selected?.id === item.id}
        onSelect={() => handleSelect(item)}
      />
    );
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonOption}>
            <Text style={{ fontSize: fontSize.labels.medium }}>{selected ? selected.text : text}</Text>
          </View>
          <Entypo name="chevron-thin-down" size={20} color="#9ca3af" />
        </View>
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <Feather name="arrow-left" size={30} style={{ color: 'black' }} />
            <Text style={{ fontSize: fontSize.titles.mini, fontWeight: 'bold' }}>
              {text}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={item => String(item.id)}
          renderItem={renderOption}
        />
      </Modal>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default Select;

const styles = StyleSheet.create({
  buttonWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderColor: '#ADB5BD',
    paddingHorizontal: 10,
    color: '#6B7280',
    flexDirection: 'row',
  },
  buttonOption: {
    flexDirection: 'row',
    gap: 10
  },
  modalWrapper: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    height: 48,
    marginTop: 20
  },
  backButton: {
    left: 15,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC3545',
    fontSize: fontSize.labels.medium,
    marginTop: 5,
  }
})