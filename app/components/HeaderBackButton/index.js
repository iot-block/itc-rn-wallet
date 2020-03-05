import React from 'react';
import { Image } from 'react-native';

export default ({ primary = false }) => {
  const icon = primary
    ? require('./images/common_back.png')
    : require('./images/common_back_white.png');
  return <Image source={icon} style={{ width: 15, height: 15, marginHorizontal: 10 }} />;
};
