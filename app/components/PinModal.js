import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import PinComponent from './PinComponent';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});

export default class PinModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pointsCkeckedCount: 0,
      delDisabled: true,
    };
    this.inputPassword = '';
    this.isAnimation = false;
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
  };

  onCirclePressed = text => {
    const { password ,success } = this.props;
    this.inputPassword = this.inputPassword + text;
    const inputlength = this.inputPassword.length;
    if (inputlength === 6) {
      const correct = this.inputPassword === password;
      this.isAnimation = !correct;
      this.inputPassword = '';
      this.setState(
        {
          pointsCkeckedCount: 0,
          delDisabled: true,
        },
        () => {
          if (correct) {
            const object = {
              pinType: 'PinModal',
              visible: false,
            };
            DeviceEventEmitter.emit('pinIsShow', { pinObject: object });

            if(success){
              success()
            }
          }
        }
      );
    } else {
      this.isAnimation = false;
      this.setState({
        pointsCkeckedCount: inputlength,
        delDisabled: inputlength === 0,
      });
    }
  };

  deletePressed = () => {
    this.inputPassword = this.inputPassword.substring(0, this.inputPassword.length - 1);
    const inputlength = this.inputPassword.length;
    if (inputlength === 0) {
      this.inputPassword = '';
      this.setState({
        pointsCkeckedCount: 0,
        delDisabled: true,
      });
    } else {
      this.setState({
        pointsCkeckedCount: inputlength,
        delDisabled: false,
      });
    }
  };

  render() {
    const { visible } = this.props;
    const { pointsCkeckedCount, delDisabled } = this.state;
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <StatusBarComponent barStyle="dark-content" />
          <PinComponent
            title={I18n.t('launch.enter_password')}
            pointsCkeckedCount={pointsCkeckedCount}
            circlePressed={this.onCirclePressed}
            deletePressed={this.deletePressed}
            isAnimation={this.isAnimation}
            isShowDeleteBtn
            delDisabled={delDisabled}
          />
        </View>
      </Modal>
    );
  }
}
