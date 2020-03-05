import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';
import { BlueButtonSmall, WhiteButtonSmall } from './Button';
import Layout from '../config/LayoutConstants';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.blackOpacityColor,
  },
  contentBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 30,
    paddingBottom: 30,
    marginTop: Layout.WINDOW_HEIGHT * 0.23,
    marginLeft: 20,
    marginRight: 20,
  },
  inputText: {
    height: 40,
    alignSelf: 'stretch',
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: Colors.borderColor_e,
    borderWidth: 1,
    color: Colors.fontGrayColor_a0,
  },
  buttonBox: {
    flexDirection: 'row',
    marginTop: 20,
  },
  leftBtnOpacity: {
    flex: 1,
    height: 40,
    alignSelf: 'stretch',
  },
  leftBtnTxt: {
    color: 'rgb(85,146,246)',
    fontSize: 16,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
  },
  rightBtnBox: {
    flex: 1,
    marginLeft: 20,
  },
  warnTxt: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-end',
    // paddingBottom: 10,
    paddingLeft: 10,
    marginTop: 2,
    height: 12,
  },
  warnTxtHidden: {
    height: 0,
  },
});
export default class InputTextDialog extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    leftPress: PropTypes.func.isRequired,
    rightPress: PropTypes.func.isRequired,
    rightTxt: PropTypes.string.isRequired,
    leftTxt: PropTypes.string.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func,
    defaultValue: PropTypes.string,
    isShowWarn: PropTypes.bool,
    warnText: PropTypes.string,
    rightBtnDisabled: PropTypes.bool,
  };

  static defaultProps = {
    defaultValue: '',
    isShowWarn: false,
    warnText: '',
    rightBtnDisabled: false,
  };

  leftPressed = () => {
    const { leftPress } = this.props;
    leftPress();
  };

  rightPressed = () => {
    const { rightPress } = this.props;
    rightPress();
  };

  onChangeText = text => {
    const { onChangeText } = this.props;
    onChangeText(text);
  };

  render() {
    const {
      modalVisible,
      placeholder,
      defaultValue,
      isShowWarn,
      warnText,
      leftTxt,
      rightTxt,
      rightBtnDisabled,
    } = this.props;
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.contentBox}>
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.fontGrayColor_a0}
              placeholder={placeholder}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              ref={input => {
                this.inputText = input;
              }}
              onChangeText={this.onChangeText}
              defaultValue={defaultValue}
            />
            <Text style={isShowWarn ? styles.warnTxt : styles.warnTxtHidden}>{warnText}</Text>
            <View style={styles.buttonBox}>
              <View style={[styles.leftBtnOpacity]}>
                <WhiteButtonSmall onPress={this.leftPressed} text={leftTxt} />
              </View>
              <View style={styles.rightBtnBox}>
                <BlueButtonSmall
                  onPress={this.rightPressed}
                  text={rightTxt}
                  isDisabled={rightBtnDisabled}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
