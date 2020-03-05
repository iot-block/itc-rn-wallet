import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';

const styles = StyleSheet.create({
  choseItem: {
    // width:Layout.WINDOW_WIDTH,
    height: 41,
  },
  choseItemContent: {
    height: 40,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  choseItemText: {
    flex: 1,
    color: Colors.fontBlackColor,
    fontSize: 16,
  },
  choseItemIcon: {
    width: 13,
    height: 9,
  },
  choseItemLine: {
    height: 1,
    backgroundColor: Colors.bgGrayColor,
  },
});

export default class ChoseItem extends PureComponent {
  static propTypes = {
    itemPress: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    isCheck: PropTypes.bool.isRequired,
    choseItemStyle: PropTypes.object,
    choseItemContentStyle: PropTypes.object,
    isShowLine: PropTypes.bool,
  };

  static defaultProps = {
    isShowLine: true,
  };

  render() {
    const {
      choseItemStyle,
      choseItemContentStyle,
      content,
      isCheck,
      itemPress,
      isShowLine,
    } = this.props;
    const checkIcon = isCheck ? require('../assets/set/ok.png') : null;
    return (
      <View style={[styles.choseItem, choseItemStyle]}>
        <TouchableOpacity
          style={[styles.choseItemContent, choseItemContentStyle]}
          onPress={itemPress}
        >
          <Text style={styles.choseItemText}>{content}</Text>
          <Image style={styles.choseItemIcon} source={checkIcon} resizeMode="contain" />
        </TouchableOpacity>
        {isShowLine ? <View style={styles.choseItemLine} /> : null}
      </View>
    );
  }
}
