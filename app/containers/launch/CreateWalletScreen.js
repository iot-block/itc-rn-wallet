import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  findNodeHandle,
  UIManager,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { showToast } from '../../utils/Toast';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader';
import { vertifyPassword } from './Common';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBackgroundColor,
  },

  keyboardAwareScrollView: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  contentContainer: {
    // justifyContent:'center',
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  titleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop:40,
    // paddingBottom:20,
  },
  icon: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.fontBlueColor,
  },
  warnBox: {
    alignSelf: 'stretch',
    backgroundColor: Colors.bgBlue_9a,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  itemBox: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  itemCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 6,
  },
  itemText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 40,
    color: 'white',
    fontSize: 13,
  },
  inputText: {
    alignSelf: 'stretch',
    height: 40,
    paddingLeft: 15,
    borderRadius: 5,
    borderColor: Colors.borderColor_e,
    borderWidth: 1,
    color: Colors.fontGrayColor_a0,
    // marginBottom: 10,
  },
  button: {
    marginTop: 30,
  },
  inputBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    borderColor: Colors.borderColor_e,
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.fontBlackColor_43,
  },
  pwdBtnOpacity: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pwdIcon: {
    width: 20,
    height: (20 / 14) * 9,
  },
  warnTxt: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-end',
    paddingTop: 5,
    paddingLeft: 10,
  },
  warnTxtHidden: {
    height: 0,
  },
  importBtn: {
    width: Layout.WINDOW_WIDTH * 0.6,
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importText: {
    fontSize: 16,
    color: Colors.fontBlueColor,
  },
});

class CreateWalletScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowNameWarn: false,
      isShowPassword: false,
      isShowRePassword: false,
      isDisabled: true, // 创建按钮是否可以点击
      isShowPwdWarn: false,
      isShowRePwdWarn: false,
      nameWarn: I18n.t('launch.enter_normative_wallet_name'),
      pwdWarn: I18n.t('launch.password_warn'),
      rePwdWarn: I18n.t('launch.enter_same_password'),
      walletType: 'eth', // 是创建itc还是eth钱包,
      from: 0,
    };
    this.nametxt = '';
    this.pwdtxt = '';
    this.rePwdtxt = '';
    this.keyBoardIsShow = false;
    this.isRePwdFocus = false;
    this.keyboardHeight = 0;
    // this.titleHeight = new Animated.Value(140);

    this.titleHeight = new Animated.Value(140);
    this.imageHeight = new Animated.Value(72);
    this.textFontSize = new Animated.Value(18);
    this.containerMarginTop = new Animated.Value(0);
    this.rePwdRef = React.createRef();
  }

  _initData = () => {
    const params = this.props.createWalletParams;
    this.setState({
      walletType: params.walletType,
      from: params.from,
    });
  };

  _addEventListener() {
    super._addEventListener();
    if (Platform.OS === 'ios') {
      this.keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShowHandler
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHideHandler
      );
    } else {
      // 如果你把android:windowSoftInputMode设置为adjustResize或是adjustNothing，则在 Android 上只有keyboardDidShow和keyboardDidHide事件有效
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardDidShowHandler
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this.keyboardDidHideHandler
      );
    }
  }

  _removeEventListener() {
    super._removeEventListener();
    if (Platform.OS === 'ios') {
      if (this.keyboardWillShowListener) {
        this.keyboardWillShowListener.remove();
      }
      if (this.keyboardWillHideListener) {
        this.keyboardWillHideListener.remove();
      }
    } else {
      if (this.keyboardDidShowListener) {
        this.keyboardDidShowListener.remove();
      }
      if (this.keyboardDidHideListener) {
        this.keyboardDidHideListener.remove();
      }
    }
  }

  layout() {
    const handle = findNodeHandle(this.rePwdRef.current);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      if (this.keyBoardIsShow) {
        this.textInputMarginBottom = Layout.WINDOW_HEIGHT - pageY - 40;
      } else {
        this.textInputMarginBottom = Layout.WINDOW_HEIGHT - pageY - 40 + 140;
      }
    });
  }

  keyboardWillShowHandler = event => {
    this.keyBoardIsShow = true;
    this.keyboardHeight = event.endCoordinates.height; // 软键盘高度

    this.titleBoxAnimated(event.duration, 0, 0, 0, 0);
  };

  keyboardWillHideHandler = event => {
    this.keyBoardIsShow = false;
    this._isShowRePwdWarn();
    this.keyboardHeight = 0;
    this.titleBoxAnimated(event.duration, 0, 140, 72, 18);
  };

  keyboardDidShowHandler = event => {
    this.keyBoardIsShow = true;
    // 'event',
    const duration = 100;
    this.keyboardHeight = event.endCoordinates.height;

    const t = this.textInputMarginBottom - this.keyboardHeight;
    if (this.isRePwdFocus && t < 0) {
      this.titleBoxAnimated(duration, t, 0, 0, 0);
    } else {
      this.titleBoxAnimated(duration, 0, 0, 0, 0);
    }
  };

  keyboardDidHideHandler = () => {
    this.keyBoardIsShow = false;
    this._isShowRePwdWarn();
    const duration = 100;
    this.keyboardHeight = 0;
    this.titleBoxAnimated(duration, 0, 140, 72, 18);
  };

  titleBoxAnimated(duration, marginTopToValue, titleToValue, imageToValue, textToValue) {
    Animated.parallel([
      Animated.timing(this.containerMarginTop, {
        duration,
        toValue: marginTopToValue,
      }),
      Animated.timing(this.titleHeight, {
        duration,
        toValue: titleToValue,
      }),
      Animated.timing(this.imageHeight, {
        duration,
        toValue: imageToValue,
      }),
      Animated.timing(this.textFontSize, {
        duration,
        toValue: textToValue,
      }),
    ]).start();
  }

  isOpenPwd() {
    const isShow = this.state.isShowPassword;
    this.setState({
      isShowPassword: !isShow,
    });
  }

  isOpenRePwd() {
    const isShow = this.state.isShowRePassword;
    this.setState({
      isShowRePassword: !isShow,
    });
  }

  // 产生助记词
  generateMnemonic() {
    walletUtils.generateMnemonic().then(
      data => {
        const params = this.props.createWalletParams;
        params.password = this.pwdtxt;
        params.name = this.nametxt;
        this.props.setCreateWalletParams(params);

        this.props.generateMnemonic(data);
        this.props.navigation.navigate('BackupWallet');
      },
      () => {
        showToast(I18n.t('toast.create_wallet_error'));
      }
    );
  }

  btnIsEnableClick() {
    if (
      this.nametxt === '' ||
      this.pwdtxt === '' ||
      this.rePwdtxt === '' ||
      this.pwdtxt !== this.rePwdtxt ||
      vertifyPassword(this.pwdtxt) !== '' ||
      this.nametxt.length > 12
    ) {
      const isShowRe = this.state.isShowRePwdWarn;
      this.setState({
        isDisabled: true,
        isShowRePwdWarn: this.pwdtxt === this.rePwdtxt ? false : isShowRe,
        isShowNameWarn: !!(this.nametxt === '' || this.nametxt.length > 12),
      });
    } else {
      this.setState({
        isDisabled: false,
        isShowRePwdWarn: false,
        isShowNameWarn: false,
      });
    }
  }

  _isShowRePwdWarn() {
    if (
      this.pwdtxt !== '' &&
      !this.state.isShowPwdWarn &&
      this.rePwdtxt !== '' &&
      this.pwdtxt !== this.rePwdtxt
    ) {
      if (!this.state.isShowRePwdWarn) {
        this.setState({
          isShowRePwdWarn: true,
        });
      }
    } else if (this.state.isShowRePwdWarn) {
      this.setState({
        isDisabled: false,
        isShowRePwdWarn: false,
      });
    }
  }

  _isShowPwdWarn() {
    let isMatchPwd = '';
    if (this.pwdtxt !== '') {
      isMatchPwd = vertifyPassword(this.pwdtxt);
      if (isMatchPwd !== '') {
        // 密码不匹配
        this.setState({
          isShowPwdWarn: true,
          isDisabled: true,
          pwdWarn: isMatchPwd,
        });
      } else {
        // 密码匹配
        this.setState({
          isShowPwdWarn: false,
          pwdWarn: '',
        });
        this.btnIsEnableClick();
      }
    } else {
      this.setState({
        isShowPwdWarn: true,
        isDisabled: true,
        pwdWarn: I18n.t('launch.password_warn'),
      });
    }
  }

  vertifyInputData() {
    Keyboard.dismiss();
    const name = this.nametxt;
    const pwd = this.pwdtxt;
    const rePwd = this.rePwdtxt;
    // let isMatchPwd = this.vertifyPassword()
    let warnMessage = '';
    if (name === '' || name == null || name === undefined) {
      warnMessage = I18n.t('toast.enter_wallet_name');
    } else if (pwd === '' || pwd == null || pwd === undefined) {
      warnMessage = I18n.t('toast.enter_password');
    } else if (rePwd === '' || rePwd == null || rePwd === undefined) {
      warnMessage = I18n.t('toast.enter_repassword');
    } else if (pwd !== rePwd) {
      warnMessage = I18n.t('toast.enter_same_password');
    }
    if (warnMessage !== '') {
      showToast(warnMessage);
    } else {
      this.generateMnemonic();
    }
  }

  toImportWallet() {
    this.props.navigation.navigate('ImportWallet');
  }

  renderComponent = () => {
    const pwdIcon = this.state.isShowPassword
      ? require('../../assets/launch/pwdOpenIcon.png')
      : require('../../assets/launch/pwdHideIcon.png');
    const rePwdIcon = this.state.isShowRePassword
      ? require('../../assets/launch/pwdOpenIcon.png')
      : require('../../assets/launch/pwdHideIcon.png');
    // let titleText = this.keyBoardIsShow ? '' : I18n.t('launch.creact_wallet');
    // let titleIcon = this.keyBoardIsShow ? null : require('../../assets/launch/create_icon.png');

    const titleText =
      this.state.walletType === 'itc'
        ? I18n.t('settings.create_itc_wallet')
        : I18n.t('settings.create_eth_wallet');
    const titleIcon = require('../../assets/launch/create_icon.png');
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgNoTitleHeader navigation={this.props.navigation} />
        {/* <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.hideKeyboard}>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                      keyboardShouldPersistTaps='handled'
        behavior="padding"> */}
        <ScrollView style={styles.scrollView}>
          <Animated.View style={[styles.contentContainer, { marginTop: this.containerMarginTop }]}>
            <Animated.View style={[styles.titleBox, { height: this.titleHeight }]}>
              <Animated.Image
                style={[styles.icon, { height: this.imageHeight }]}
                source={titleIcon}
                resizeMode="contain"
              />
              <Animated.Text style={[styles.titleTxt, { fontSize: this.textFontSize }]}>
                {titleText}
              </Animated.Text>
            </Animated.View>

            <View style={styles.warnBox}>
              <Item content={I18n.t('launch.create_wallet_warn1')} />
              <Item content={I18n.t('launch.create_wallet_warn2')} />
            </View>

            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholderTextColor={Colors.fontGrayColor_a0}
                returnKeyType="next"
                placeholder={I18n.t('launch.wallet_name_hint')}
                underlineColorAndroid="transparent"
                selectionColor="#00bfff"
                onChange={event => {
                  this.nametxt = event.nativeEvent.text;
                  this.btnIsEnableClick();
                }}
                onFocus={() => {
                  this.btnIsEnableClick();
                }}
              />
            </View>
            <Text style={this.state.isShowNameWarn ? styles.warnTxt : styles.warnTxtHidden}>
              {this.state.nameWarn}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholderTextColor={Colors.fontGrayColor_a0}
                returnKeyType="next"
                placeholder={I18n.t('launch.password_hint')}
                underlineColorAndroid="transparent"
                selectionColor="#00bfff"
                secureTextEntry={!this.state.isShowPassword}
                onChange={event => {
                  this.pwdtxt = event.nativeEvent.text;
                  this._isShowPwdWarn();
                }}
                onFocus={() => {
                  this._isShowPwdWarn();
                }}
              />
              <TouchableOpacity
                style={[styles.pwdBtnOpacity]}
                activeOpacity={0.6}
                onPress={() => this.isOpenPwd()}
              >
                <Image style={styles.pwdIcon} source={pwdIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <Text style={this.state.isShowPwdWarn ? styles.warnTxt : styles.warnTxtHidden}>
              {this.state.pwdWarn}
            </Text>

            <View style={styles.inputBox} ref={this.rePwdRef}>
              <TextInput
                style={styles.input}
                placeholderTextColor={Colors.fontGrayColor_a0}
                returnKeyType="done"
                placeholder={I18n.t('launch.re_password_hint')}
                underlineColorAndroid="transparent"
                selectionColor="#00bfff"
                secureTextEntry={!this.state.isShowRePassword}
                onChange={event => {
                  this.rePwdtxt = event.nativeEvent.text;
                  this.btnIsEnableClick();
                }}
                onFocus={() => {
                  this.isRePwdFocus = true;
                  this.layout();
                }}
                onBlur={() => {
                  this.isRePwdFocus = false;
                  this._isShowRePwdWarn();
                }}
              />
              <TouchableOpacity
                style={[styles.pwdBtnOpacity]}
                activeOpacity={0.6}
                onPress={() => this.isOpenRePwd()}
              >
                <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <Text style={this.state.isShowRePwdWarn ? styles.warnTxt : styles.warnTxtHidden}>
              {this.state.rePwdWarn}
            </Text>

            <BlueButtonBig
              buttonStyle={styles.button}
              isDisabled={this.state.isDisabled}
              onPress={() => this.vertifyInputData()}
              text={I18n.t('launch.create')}
            />
            {this.state.from === 0 ? null : (
              <TouchableOpacity
                style={[styles.importBtn]}
                activeOpacity={0.6}
                onPress={() => this.toImportWallet()}
              >
                <Text style={[styles.importText]}>{I18n.t('settings.import_wallet')}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    );
  };
}

class Item extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
  };

  render() {
    const { content } = this.props;
    return (
      <View style={styles.itemBox}>
        <LinearGradient
          colors={['#fff', '#fff', '#fff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.itemCircle}
        />
        <Text style={styles.itemText}>{content}</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.Core.mnemonic,
  createWalletParams: state.Core.createWalletParams,
});
const mapDispatchToProps = dispatch => ({
  generateMnemonic: mnemonic => dispatch(Actions.generateMnemonic(mnemonic)),
  setCreateWalletParams: params => dispatch(Actions.setCreateWalletParams(params)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletScreen);
