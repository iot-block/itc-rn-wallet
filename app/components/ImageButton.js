import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  btnDefaultStyle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    width: 20,
    height: 20,
  },
});

export default class ImageButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    backgroundImageSource: PropTypes.number.isRequired,
  };

  render() {
    const { btnStyle, onClick, imageStyle, backgroundImageSource } = this.props;
    return (
      <TouchableOpacity style={[styles.btnDefaultStyle, btnStyle]} onPress={onClick}>
        <Image style={[styles.backgroundImageStyle, imageStyle]} source={backgroundImageSource} />
      </TouchableOpacity>
    );
  }
}
