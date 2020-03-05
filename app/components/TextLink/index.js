/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default ({ color, text, style, onPress  }) => {
  return (
    <TouchableOpacity style={[styles.container, { borderBottomColor: color }, style]} onPress={onPress}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    borderBottomWidth: 1,
    // width: 70,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    alignSelf: 'center',
  },
};
