import React, { Component } from 'react';

import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import StorageManage from '../../utils/StorageManage';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import store from '../../config/store/ConfigureStore';
import { I18n } from '../../config/language/i18n';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: 'flex-end',
  },
  KeyboardContainer: {
    marginTop:
      Platform.OS === 'android' ? ScreenHeight - 400 - StatusBarHeight : ScreenHeight - 400,
    height: 400,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  scrollView: {
    flexDirection: 'row',
    flex: 1,
    height: 400,
  },
  leftContainer: {
    marginLeft: 0,
    backgroundColor: 'white',
    height: 400,
    width: ScreenWidth,
    alignItems: 'center',
  },
  rightContainer: {
    marginRight: 0,
    marginTop: 0,
    backgroundColor: 'white',
    height: 400,
    width: ScreenWidth,
    alignItems: 'center',
  },
  firstStepTitleView: {
    height: 44,
    width: ScreenWidth,
    marginRight: 0,
    borderBottomColor: Colors.fontGrayColor,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    color: Colors.fontBlackColor,
    // marginLeft:0,
    width: ScreenWidth - (30 + 15) * 2,
    fontSize: 17,
    textAlign: 'center',
  },
  costTextContainer: {
    height: 50,
    justifyContent: 'center',
  },
  costText: {
    fontSize: 20,
    textAlign: 'center',
  },
  leftInfoView: {
    height: 210,
    // backgroundColor:"red",
    width: ScreenWidth - 50,
  },
  infoTextViewFirst: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:"red",
    width: ScreenWidth - 60,
  },
  infoTitle: {
    fontSize: 13,
    color: Colors.fontDarkGrayColor,
  },
  infoDetailTitle: {
    fontSize: 13,
    color: Colors.fontBlackColor,
    marginLeft: 20,
    // marginRight:60
  },
  infoContent: {
    height: 210.0 / 3,
    // backgroundColor:"green",
    flexDirection: 'row',
  },
  lineView: {
    height: 0.5,
    backgroundColor: Colors.fontGrayColor,
  },
  infoContentTitle: {
    marginTop: 10,
    // backgroundColor:"red"
  },
  infoContentDetailTitle: {
    fontSize: 13,
    color: Colors.fontBlackColor,
  },
  infoContentDetailView: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 10,
    flex: 1,
    // backgroundColor:"blue"
  },
  nextBtn: {
    marginTop: 25,
    height: 44,
    borderRadius: 5,
    width: ScreenWidth - 60,
    backgroundColor: Colors.themeColor,
    justifyContent: 'center',
  },
  buttonTitle: {
    // flex:1,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  passwordFrameView: {
    borderWidth: 1,
    borderColor: Colors.fontGrayColor,
    borderRadius: 5,
    width: ScreenWidth - 50,
    marginTop: 20,
    height: 40,
  },
  passwordView: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    // backgroundColor:"red",
    height: 40,
    fontSize: 15,
    paddingVertical: 0,
  },
});

const InfoTextView = ({ transferType, fromAddress, toAddress, gasPrice, detailGas }) => (
  <View style={styles.leftInfoView}>
    <View style={styles.infoTextViewFirst}>
      <Text style={styles.infoTitle}>{I18n.t('transaction.payment_information')}</Text>
      <Text style={styles.infoDetailTitle}>{transferType}</Text>
    </View>
    <InfoContentView title={I18n.t('transaction.pay_to')} deatilContent={toAddress} />
    <InfoContentView title={I18n.t('transaction.payment_address')} deatilContent={fromAddress} />
    {/* <InfoContentView
            title={"矿工费用"}
            deatilContent={gasPrice}>
        </InfoContentView> */}
    <View style={{ flex: 1 }}>
      <View style={styles.lineView} />
      <View style={styles.infoContent}>
        <View style={styles.infoContentTitle}>
          <Text style={[styles.infoTitle]}>{I18n.t('transaction.miner_cost')}</Text>
        </View>
        <View style={styles.infoContentDetailView}>
          <Text style={styles.infoContentDetailTitle}>{gasPrice}</Text>
          <Text style={[styles.infoContentDetailTitle, { color: Colors.fontDarkGrayColor }]}>
            {detailGas}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const InfoContentView = ({ title, deatilContent }) => (
  <View style={{ flex: 1 }}>
    <View style={styles.lineView} />
    <View style={styles.infoContent}>
      <View style={styles.infoContentTitle}>
        <Text style={[styles.infoTitle]}>{title}</Text>
      </View>
      <View style={styles.infoContentDetailView}>
        <Text style={styles.infoContentDetailTitle}>{deatilContent}</Text>
      </View>
    </View>
  </View>
);

export default class TransactionStep extends Component {
  static propsType = {
    didTapSurePasswordBtn: PropTypes.func.isRequired,
  };

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      step: false,
      fromAddress: '0x',
      toAddress: '0x',
      totalAmount: '0',
      payType: '',
      gasPrice: '',
      gasPriceInfo: '',
      password: '',
    };
    this.showStepView = this.showStepView.bind(this);
    this.changeStepPage = this.changeStepPage.bind(this);
    this.passWordTextInputChanged = this.passWordTextInputChanged.bind(this);
  }
  // 加载完成
  // componentDidMount() {

  // }
  // view卸载
  // componentWillUnmount() {

  // }

  // 保存最近转账的地址
  async saveRecentAddress() {
    const { toAddress, totalAmount } = this.state;
    const _symbol = totalAmount.split(' ')[1];
    const _currentTime = TransactionStep.getCurrentTime();
    const { tokens } = store.getState().Core;
    let _iconLargeStr = '';
    for (let i = 0; i < tokens.length; i++) {
      if (_symbol.toUpperCase() === tokens[i].symbol.toUpperCase()) {
        const { iconLarge } = tokens[i];
        _iconLargeStr = iconLarge;
        break;
      }
    }

    let recentTransferAddress = await StorageManage.loadAllDataForKey(
      StorageKey.RecentTransferAddress
    );
    if (!recentTransferAddress) {
      recentTransferAddress = [];
    }
    let isSavedAddress = false;
    for (let i = 0; i < recentTransferAddress.length; i++) {
      if (recentTransferAddress[i].address.toUpperCase() === toAddress.toUpperCase()) {
        isSavedAddress = true;
        break;
      }
    }

    const keyId = toAddress; // 用地址作为存储的id
    const object = {
      address: toAddress,
      symbol: _symbol,
      time: _currentTime,
      iconLargeStr: _iconLargeStr,
    };
    if (isSavedAddress) {
      StorageManage.remove(StorageKey.RecentTransferAddress, keyId);
    }
    StorageManage.save(StorageKey.RecentTransferAddress, object, keyId);
    // let recentTransferAddressss = await StorageManage.loadAllDataForKey(StorageKey.RecentTransferAddress)
  }

  static getCurrentTime() {
    const date = new Date();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  showStepView(params) {
    const { show } = this.state;
    if (params) {
      this.setState({
        show: !show,
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        totalAmount: params.totalAmount,
        payType: params.payType,
        gasPrice: params.gasPrice,
        gasPriceInfo: params.gasPriceInfo,
      });
    } else {
      this.setState({
        show: !show,
      });
    }
  }

  closeStepView() {
    this.setState({
      show: false,
    });
  }

  changeStepPage() {
    this.setState(
      previousState => ({ step: !previousState.step }),
      () => {
        const { step } = this.state;
        if (step === false) {
          this.scroll.scrollTo({ x: 0, y: 0, animated: true });
          this.INPUT.blur();
        } else {
          this.scroll.scrollTo({ x: ScreenWidth, y: 0, animated: true });
          this.INPUT.focus();
        }
      }
    );
  }

  passWordTextInputChanged(text) {
    this.setState({
      password: text,
    });
  }

  render() {
    // const { walletPasswordPrompt } = store.getState().Core
    const {
      show,
      totalAmount,
      payType,
      toAddress,
      fromAddress,
      gasPrice,
      gasPriceInfo,
      password,
    } = this.state;
    const { didTapSurePasswordBtn } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={show}
        onShow={() => {
          // console.log('控件显示');
        }}
        onRequestClose={() => {
          // console.log('安卓物理返回');
        }}
      >
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={styles.KeyboardContainer}
            keyboardShouldPersistTaps="handled"
          >
            <ScrollView
              style={styles.scrollView}
              keyboardShouldPersistTaps="handled"
              horizontal // 水平方向
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              ref={scroll => {
                this.scroll = scroll;
              }}
              behavior="padding"
            >
              {/* 步骤一 确认交易信息 */}
              <View style={styles.leftContainer}>
                <View style={styles.firstStepTitleView}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={this.showStepView}>
                    <Image
                      resizeMode="contain"
                      source={require('../../assets/common/cancel.png')}
                      style={{ width: 15, height: 15 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.titleView}>{I18n.t('transaction.payment_details')}</Text>
                </View>
                <View style={styles.costTextContainer}>
                  <Text style={styles.costText}>{totalAmount}</Text>
                </View>
                <InfoTextView
                  transferType={payType}
                  fromAddress={fromAddress}
                  toAddress={toAddress}
                  gasPrice={gasPrice}
                  detailGas={gasPriceInfo}
                />

                <TouchableOpacity style={styles.nextBtn} onPress={this.changeStepPage}>
                  <Text style={styles.buttonTitle}>{I18n.t('transaction.next_step')}</Text>
                </TouchableOpacity>
              </View>

              {/* 步骤二 ，输入密码 */}
              <View style={styles.rightContainer}>
                <View style={[styles.firstStepTitleView, { borderBottomWidth: 0 }]}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={this.changeStepPage}>
                    <Image
                      resizeMode="contain"
                      source={require('../../assets/common/common_back.png')}
                      style={{ height: 20, width: 20 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.titleView}>{I18n.t('transaction.wallet_password')}</Text>
                </View>
                <View style={styles.passwordFrameView}>
                  <TextInput
                    style={styles.passwordView}
                    placeholderTextColor={Colors.fontGrayColor_a0}
                    placeholder={I18n.t('transaction.enter_password_hint')}
                    returnKeyType="done"
                    secureTextEntry
                    onChangeText={this.passWordTextInputChanged}
                    ref={textinput => {
                      this.INPUT = textinput;
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={() => {
                    this.saveRecentAddress();
                    this.showStepView();
                    didTapSurePasswordBtn(password);
                  }}
                >
                  <Text style={styles.buttonTitle}>{I18n.t('transaction.determine')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}
