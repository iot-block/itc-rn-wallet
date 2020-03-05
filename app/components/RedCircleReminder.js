import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  circle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 11,
  },
  text: {
    color: 'white',
    lineHeight: 20,
    textAlign: 'center',
  },

  textSize14: {
    fontSize: 14,
  },
  textSize12: {
    fontSize: 12,
  },
  textSize10: {
    fontSize: 10,
  },
});

export default class RedCircleReminder extends PureComponent {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    number: PropTypes.number,
    circleStyle: PropTypes.object,
    textStyle: PropTypes.object,
  };

  static defaultProps = {
    number: 0,
  };

  render() {
    const { number, isShow, circleStyle, textStyle } = this.props;
    const numberStr = number > 99 ? '99+' : `${number}`;
    const textSizeBig = number < 10 ? styles.textSize14 : styles.textSize12;
    const textSize = number > 99 ? styles.textSize10 : textSizeBig;
    return isShow ? (
      <View style={[styles.circle, circleStyle]}>
        {number === 0 ? null : <Text style={[styles.text, textSize, textStyle]}>{numberStr}</Text>}
      </View>
    ) : null;
  }
}
