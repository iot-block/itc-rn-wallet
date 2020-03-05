import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import { BlueButtonBig } from '../../components/Button';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import { validateEmail } from '../../utils/CommonUtil';
import CommonTextInput from '../../components/TextInputComponent';
import BaseComponent from '../base/BaseComponent';
import ImageButton from '../../components/ImageButton';
import NetworkManager from '../../utils/NetworkManager';
import StorageManage from '../../utils/StorageManage';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGrayColor,
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  keyboardAwareScrollView: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 20,
  },
  contentBox: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Layout.WINDOW_WIDTH * 0.9,
  },
  text: {
    color: Colors.fontBlackColor,
    fontSize: 13,
    marginBottom: 3,
  },
  textInput: {
    marginBottom: 12,
  },
  desTextInput: {
    height: 130,
    paddingTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  warnTxt: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-end',
    marginBottom: 10,
    paddingLeft: 10,
  },
  warnTxtHidden: {
    height: 0,
  },
  button: {
    marginTop: 40,
    marginBottom: 30,
  },
});

export default class FeedbackScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      isShowEmailWarn: false,
      isShowAddressWarn: false,
      emailWarn: I18n.t('toast.email_format_incorrect'),
      addressWarn: I18n.t('settings.feedback_eth_address_prompt'),
      photoArray: [],
    };

    this.name = '';
    this.email = '';
    this.description = '';
    this.address = '';
    this.keyBoardIsShow = false;
    this.isEmailFocus = false;
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  _addEventListener() {
    super._addEventListener();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShowHandler
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHideHandler
    );
  }

  _removeEventListener() {
    super._removeEventListener();
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  keyboardDidShowHandler = () => {
    this.keyBoardIsShow = true;
  };

  keyboardDidHideHandler = () => {
    this.keyBoardIsShow = false;
  };

  hideKeyboard = () => {
    if (this.keyBoardIsShow) {
      Keyboard.dismiss();
    }
  };

  btnIsEnableClick() {
    if (this.name === '' || this.email === '' || this.description === '') {
      if (!this.state.isDisabled) {
        this.setState({
          isDisabled: true,
        });
      }
    } else if (this.state.isDisabled) {
      this.setState({
        isDisabled: false,
      });
    }
  }

  vertifyEmail() {
    let emailIsOk = true;
    if (this.email !== '') {
      emailIsOk = validateEmail(this.email);
      this.setState({
        isShowEmailWarn: !emailIsOk,
        isDisabled: this.name === '' || this.description === '' || !emailIsOk,
      });
    } else if (!this.state.isDisabled) {
      this.setState({
        isDisabled: true,
      });
    }
  }

  vertifyAddress() {
    if (this.address !== '') {
      const validAddress = NetworkManager.isValidAddress(this.address);
      const { isShowEmailWarn } = this.state;
      this.setState({
        isShowAddressWarn: !validAddress,
        isDisabled: this.name === '' || this.description === '' || isShowEmailWarn || !validAddress,
      });
    } else if (!this.state.isDisabled) {
      this.setState({
        isDisabled: true,
      });
    }
  }

  nameOnChangeText = text => {
    this.name = text;
    this.btnIsEnableClick();
  };

  addressOnChangeText = text => {
    this.address = text;
    this.vertifyAddress();
  };

  emailOnChangeText = text => {
    this.email = text;
    this.vertifyEmail();
  };

  descriptionOnChangeText = text => {
    this.description = text;
    this.btnIsEnableClick();
  };

  async submit() {
    Keyboard.dismiss();
    this._showLoading();
    const userToken = await StorageManage.load(StorageKey.UserToken);
    const params = {
      userToken: userToken.userToken,
      name: this.name,
      mailAddress: this.email,
      system: Platform.OS,
      systemVersion: DeviceInfo.getSystemVersion(),
      deviceModel: DeviceInfo.getModel(),
      content: this.description,
      ethAddress: this.address,
      appversion: `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`,
    };
    NetworkManager.uploadFeedback(params, this.state.photoArray)
      .then(res => {
        this._hideLoading(() => {
          if (res.code === 200) {
            showToast(I18n.t('toast.submitted_successfully'));
            this.props.navigation.goBack();
          } else {
            showToast(res.msg);
            Analytics.recordErr('uploadFeedbackResErr', res);
          }
        });
      })
      .catch(err => {
        showToast(I18n.t('toast.submission_failed'));
        this._hideLoading();
        Analytics.recordErr('uploadFeedbackCatchErr', err);
      });
  }

  renderComponent = () => {
    const photoSelectComponents = [];
    this.state.photoArray.forEach((value, index) => {
      const keyValue = `photo${index}`;
      photoSelectComponents.push(
        <View key={keyValue} style={{ width: 56, height: 56, marginRight: 10, marginTop: 5 }}>
          <Image style={{ width: 56, height: 56 }} source={value} />
          <ImageButton
            btnStyle={{
              position: 'absolute',
              right: 5,
              top: 5,
              width: 14,
              height: 14,
            }}
            backgroundImageSource={require('../../assets/home/delete.png')}
            onClick={() => {
              this.setState(previousState => {
                const newArray = previousState.photoArray.concat();
                newArray.splice(index, 1);
                return { photoArray: newArray };
              });
            }}
          />
        </View>
      );
    });

    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.feedback')} />
        <ScrollView style={styles.scrollView}>
          <KeyboardAvoidingView
            style={styles.keyboardAwareScrollView}
            keyboardShouldPersistTaps="handled"
            behavior="padding"
          >
            <View style={styles.contentBox}>
              <Text style={styles.text}>{I18n.t('settings.nickname')}</Text>
              <CommonTextInput
                textInputStyle={styles.textInput}
                onChangeText={this.nameOnChangeText}
              />

              <Text style={styles.text}>{I18n.t('settings.contact_email')}</Text>
              <CommonTextInput
                textInputStyle={styles.textInput}
                onChangeText={this.emailOnChangeText}
                keyboardType="email-address"
                onFocus={() => {
                  this.isEmailFocus = true;
                }}
                onBlur={() => {
                  this.isEmailFocus = false;
                }}
              />
              <Text style={this.state.isShowEmailWarn ? styles.warnTxt : styles.warnTxtHidden}>
                {this.state.emailWarn}
              </Text>
              <Text style={styles.text}>{I18n.t('settings.feedback_address_title')}</Text>
              <CommonTextInput
                textInputStyle={styles.textInput}
                onChangeText={this.addressOnChangeText}
              />
              <Text style={this.state.isShowAddressWarn ? styles.warnTxt : styles.warnTxtHidden}>
                {this.state.addressWarn}
              </Text>
              <Text style={styles.text}>{I18n.t('settings.problem_description')}</Text>
              <CommonTextInput
                defaultValue={this.props.navigation.state.params.content}
                textInputStyle={styles.desTextInput}
                returnKeyType="done"
                onChangeText={this.descriptionOnChangeText}
                multiline
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {photoSelectComponents}
                {this.state.photoArray.length < 9 ? (
                  <ImageButton
                    btnStyle={{ width: 56, height: 56, marginTop: 5 }}
                    imageStyle={{ width: 56, height: 56 }}
                    backgroundImageSource={require('../../assets/home/kuang.png')}
                    onClick={() => {
                      ImagePicker.launchImageLibrary({}, response => {
                        if (response.didCancel) {
                          console.log('User cancelled image picker');
                        } else if (response.error) {
                          console.log('ImagePicker Error: ', response.error);
                        } else if (response.customButton) {
                          console.log('User tapped custom button: ', response.customButton);
                        } else {
                          const source = { uri: response.uri };
                          this.setState(previousState => {
                            const newArray = previousState.photoArray.concat();
                            newArray.push(source);
                            return { photoArray: newArray };
                          });
                        }
                      });
                    }}
                  />
                ) : null}
              </View>
              <BlueButtonBig
                buttonStyle={styles.button}
                isDisabled={this.state.isDisabled}
                onPress={() => {
                  this.submit();
                }}
                text={I18n.t('settings.submit')}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  };
}
