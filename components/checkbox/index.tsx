import React from 'react';
import PropTypes from "prop-types"
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function CheckBox(props: any) {

  function handleChange() {
    const { onChange } = props;
    if (onChange) {
      return onChange();
    }
  }

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleChange}>
        <View style={[styles.checkBoxWrapper, {backgroundColor: props.value ? '#D96A0B' : 'white'}]} >
          {
            props.value ? <FontAwesome6 name="check" size={12} color={props.iconColor ? props.iconColor : '#fff'}/>: null
          }
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  iconColor: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  checkColor: PropTypes.string
}


const styles = StyleSheet.create({
  checkBoxWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
})