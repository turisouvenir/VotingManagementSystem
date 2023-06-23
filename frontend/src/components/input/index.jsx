import React from 'react';
import { View, TextInput } from 'react-native';
import tw from 'twrnc';

const Input = ({ Icon, placeholder, value, onChangeText, isNumeric, onBlur, security = false, props, borderColor = 'gray' }) => {
  return (
    <View style={tw`w-full mt-2 flex-row border p-4 rounded-[2] border-${borderColor}-200`}>
      {Icon}
      <TextInput placeholder={placeholder} style={tw`ml-2`}
        secureTextEntry={security}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        keyboardType={isNumeric ? 'numeric' : 'default'}
      />
    </View>
  )
}
export default Input;