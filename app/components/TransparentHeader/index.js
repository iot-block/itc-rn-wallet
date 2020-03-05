/* eslint-disable no-use-before-define */
import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import Layout from '../../config/LayoutConstants';

export default ({ navigation, title, rightIcon }) => {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 30, height: 30, justifyContent: 'center' }}
        >
          <Image
            source={require('../../assets/common/common_back_white.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18 }}>{title}</Text>
        {rightIcon || <View style={{ width: 30, height: 30 }} />}
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    position: 'absolute',
    top: Layout.DEVICE_IS_IPHONE_X() ? 40 : 20,
    height: 30,
    zIndex: 999,
  },
};
