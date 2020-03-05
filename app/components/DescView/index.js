/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ descArr }) => {
  return (
    <View style={styles.container}>
      {descArr.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DescItem key={index} text={item} />
      ))}
    </View>
  );
};

function DescItem({ text }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.dot} />
      <Text>{text}</Text>
    </View>
  );
}

const styles = {
  container: {
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#F9FBFF',
    paddingHorizontal: 10,
    paddingVertical: 15,
    // paddingTop: 20,
  },
  itemContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#04b2fb',
    marginRight: 10,
    marginTop: 5,
  },
};
