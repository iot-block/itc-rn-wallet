import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Image, Modal, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modeContent: {
    width: 200,
    height: (200 / 132) * 114,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 76,
    height: 76,
  },
  content: {
    width: 160,
    marginTop: 6,
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    textAlign: 'center',
  },
});
export default class StaticLoading extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    icon: PropTypes.number,
    content: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    icon: require('../assets/common/sLoadingIcon.png'),
    content: '',
  };

  render() {
    const { visible, icon, content } = this.props;
    const bg = require('../assets/common/sLoadingBg.png');
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <ImageBackground style={styles.modeContent} source={bg} resizeMode="contain">
            <Image style={styles.icon} source={icon} resizeMode="contain" />
            <Text style={styles.content}>{content}</Text>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}
