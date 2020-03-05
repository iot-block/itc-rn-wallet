/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image } from 'react-native';

export default ({ icon, name, address, showArrow = true }) => {
  return (
    <View style={styles.nodeInfo}>
      <View style={styles.infoBody}>
        {icon}
        <View style={styles.infoDetail}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address} ellipsizeMode="middle" numberOfLines={1} >{address}</Text>
        </View>
      </View>
      {showArrow && <Image source={require('./images/arrow-right-white.png')} />}
    </View>
  );
};

const styles = {
  nodeInfo: {
    // flex: 1,
    // width: '90%',
    flexDirection: 'row',
    // alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3c93e8',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },
  infoBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoDetail: {
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 13,
    color: 'white',
    maxWidth: 240,
  },
};
