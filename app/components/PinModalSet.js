import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../config/LayoutConstants';
import { Colors } from '../config/GlobalConfig';
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import PinComponent from './PinComponent';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    backgroundColor: 'rgba(256,256,256,0.9)',
    alignItems: 'center',
  },

  warnContainer: {
    width: Layout.WINDOW_WIDTH,
    height: Layout.WINDOW_HEIGHT,
    position: 'absolute',
    backgroundColor: 'rgba(179,179,179,0.8)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  warnBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 40,
    marginLeft: 40,
    marginRight: 40,
  },
  warnIcon: {
    width: 80,
    height: 80,
  },
  warnTitleTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.fontBlackColor_31,
    marginTop: 15,
    marginBottom: 20,
  },
  warnContentTxt: {
    fontSize: 16,
    alignSelf: 'stretch',
    color: Colors.fontBlackColor_31,
    marginTop: 4,
  },
  warnBtnOpacity: {
    height: 40,
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: '#ff3635',
    marginTop: 30,
  },
  linearGradient: {
    height: 40,
    alignSelf: 'stretch',
    borderRadius: 5,
  },
  warnTxt: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toastBox: {
    width: Layout.WINDOW_WIDTH,
    height: Layout.WINDOW_HEIGHT,
    position: 'absolute',
    // justifyContent:'center',
    alignItems: 'center',
    marginTop: 50,
  },
  toastText: {
    backgroundColor: 'black',
    height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 18,
    lineHeight: 36,
    color: 'white',
  },
});

export default class PinModalSet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pointsCkeckedCount: 0,
      delDisabled: true,
      isShowWarn: true,
      title: I18n.t('launch.set_login_password'),
      isShowToast: false,
    };
    this.inputPassword = '';
    this.isAnimation = false;
    this.isSet = true; // 是否是设置
    this.setPassword = ''; // 设置的密码
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    visible: false,
  };

  onCirclePressed = text => {
    this.inputPassword = this.inputPassword + text;
    const inputlength = this.inputPassword.length;
    if (inputlength === 6) {
      const password = this.inputPassword;
      this.inputPassword = '';
      if (this.isSet) {
        this.isSet = false;
        this.setPassword = password;
        this.isAnimation = false;
        // Vibration.vibrate()
        this.setState({
          pointsCkeckedCount: 0,
          delDisabled: true,
          isShowWarn: false,
          title: I18n.t('launch.repeat_new_password'),
        });
      } else {
        this.isAnimation = password !== this.setPassword;
        this.setState({
          pointsCkeckedCount: 0,
          delDisabled: true,
          isShowWarn: false,
          title: I18n.t('launch.set_login_password'),
        });
        if (password === this.setPassword) {
          this.reSetModal();
          const object = {
            pinType: 'PinModalSet',
            visible: false,
            pinPassword: password,
          };
          DeviceEventEmitter.emit('pinIsShow', { pinObject: object });
        } else {
          // Vibration.vibrate()
          this.setState({
            pointsCkeckedCount: 0,
            delDisabled: true,
            isShowWarn: false,
            isShowToast: true,
          });

          setTimeout(() => {
            this.reSetModal();
          }, 150);

          setTimeout(() => {
            this.setState({
              isShowToast: false,
            });
          }, 1200);
        }
      }
    } else {
      this.isAnimation = false;
      this.setState({
        pointsCkeckedCount: inputlength,
        delDisabled: inputlength === 0,
      });
    }
  };

  reSetModal() {
    this.setState({
      pointsCkeckedCount: 0,
      delDisabled: true,
      isShowWarn: false,
      title: I18n.t('launch.set_login_password'),
      // isShowToast:false,
    });
    this.inputPassword = '';
    this.setPassword = '';
    this.isSet = true;
    this.isAnimation = false;
  }

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

  onCloseWarn() {
    this.setState({
      isShowWarn: false,
    });
  }

  iknow() {
    this.setState({
      isShowWarn: false,
    });
  }

  render() {
    const { visible } = this.props;
    const { delDisabled, isShowWarn, isShowToast, pointsCkeckedCount, title } = this.state;
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
            title={title}
            pointsCkeckedCount={pointsCkeckedCount}
            circlePressed={this.onCirclePressed}
            deletePressed={this.deletePressed}
            isAnimation={this.isAnimation}
            isShowDeleteBtn
            delDisabled={delDisabled}
          />
          {isShowWarn ? (
            <View style={styles.warnContainer}>
              <View style={styles.warnBox}>
                <Image
                  style={styles.warnIcon}
                  source={require('../assets/common/warningIcon.png')}
                />
                <Text style={styles.warnTitleTxt}>{}</Text>
                <Text style={styles.warnContentTxt}>{I18n.t('modal.ping_id_warn1')}</Text>
                <Text style={styles.warnContentTxt}>{I18n.t('modal.ping_id_warn2')}</Text>
                <TouchableOpacity
                  style={styles.warnBtnOpacity}
                  activeOpacity={0.6}
                  onPress={() => this.iknow()}
                >
                  <LinearGradient
                    colors={['#ff3455', '#e90329']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.linearGradient]}
                  >
                    <Text style={styles.warnTxt}>{I18n.t('modal.i_know')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {isShowToast ? (
            <View style={styles.toastBox}>
              <Text style={styles.toastText}>{I18n.t('toast.pwd_inconsistent_reset')}</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    );
  }
}
