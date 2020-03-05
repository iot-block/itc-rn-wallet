/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Layout from '../../config/LayoutConstants';

export default ({ text, color, rightText, navigation ,rightAction, leftAction,rightColor,textColor}) => {
  const backIcon =
    color === 'white'
      ? require('../../assets/common/common_back.png')
      : require('../../assets/common/common_back_white2.png');

  const rightTextColor = rightColor === 'white'?'white':'#05b3eb'

  const titleColor = textColor === 'white'?'white':'black'

  return (
    <View
      style={[
        {
          // eslint-disable-next-line no-nested-ternary
          paddingTop: Layout.DEVICE_IS_ANDROID() ? 35 : Layout.DEVICE_IS_IPHONE_X() ? 55 : 35,
          backgroundColor: color,
          paddingHorizontal: 15,
          paddingBottom: 20,
          zIndex: 999,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        },
        color === 'transparent' ? { position: 'absolute', backgroundColor: 'transparent' } : {},
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={() => {
        leftAction?leftAction():navigation.goBack()
      }}
      >
        <Image source={backIcon} style={{ width: 18, height: 18 }} />
      </TouchableOpacity>
      <Text style={{ color: titleColor, fontSize: 16 }}>{text}</Text>
      <TouchableOpacity style={styles.button} onPress={rightAction}>
        <Text style={{ color: rightTextColor,textAlign:'right' }}>{rightText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    // zIndex: 999,
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'black',
    // marginTop: Layout.DEVICE_IS_IPHONE_X() ? 40 : 15,
  },
  transparent: {
    position: 'absolute',
    top: Layout.DEVICE_IS_IPHONE_X() ? 45 : 15,
    // backgroundColor: 'transparent',
  },
  button: {
    width: 80,
    textAlign:"right"
  },
};
