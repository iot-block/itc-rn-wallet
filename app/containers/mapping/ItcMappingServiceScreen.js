import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors, TransferGasLimit } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import NetworkManager from '../../utils/NetworkManager';
import { showToast } from '../../utils/Toast';
import KeystoreUtils from '../../utils/KeystoreUtils';
import { defaultTokens } from '../../utils/Constants';

const StatusBarHeight = StatusBar.currentHeight;
const contentWidth = Layout.WINDOW_WIDTH * 0.9;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAwareScrollView: {
    flex: 1,
  },

  topImg: {
    width: contentWidth - 40,
    height: ((contentWidth - 40) / 288) * 76,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  mappingGuideBox: {
    textAlignVertical: 'bottom',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'center',
  },
  mappingGuideText: {
    fontSize: 14,
    color: Colors.fontBlueColor,
    textDecorationLine: 'underline',
  },
  mAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
  },
  mAddressContent: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  mAddressTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
    marginBottom: 6,
  },
  mAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
  },
  changeBox: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
  },
  changeText: {
    color: Colors.fontGrayColor_a0,
    fontSize: 15,
    paddingRight: 5,
  },
  changeIcon: {
    width: 12,
    height: 12,
  },

  mAmountTitle: {
    width: contentWidth,
    alignSelf: 'center',
    color: Colors.fontBlueColor,
    fontSize: 18,
    marginTop: 16,
  },
  mAmountInputView: {
    flexDirection: 'row',
    marginTop: 10,
    width: contentWidth,
    alignSelf: 'center',
    height: 40,
    alignItems: 'flex-end',
    padding: 0,
  },
  mAmountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '600',
    height: 40,
    padding: 0,
    margin: 0,
    // textAlignVertical: 'bottom',
    alignItems: 'flex-end',
    color: Colors.fontBlueColor,
  },
  unit: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.fontBlueColor,
  },
  vLine: {
    width: contentWidth,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  commonText: {
    width: contentWidth,
    color: Colors.fontGrayColor_a,
    fontSize: 13,
    marginTop: 5,
    alignSelf: 'center',
  },
  btn: {
    alignSelf: 'center',
  },

  initiationAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
  },
  initiationAddressContent: {
    width: contentWidth,
    flexDirection: 'row',
    height: 30,
  },
  initiationAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 5,
  },
  promptBox: {
    flex: 1,
  },
  promptTouch: {
    width: 40,
    height: 30,
    paddingLeft: 5,
    paddingTop: 6,
  },
  promptIcon: {
    width: 12,
    height: 12,
  },
  triangleIcon: {
    width: 12,
    height: 10,
    marginTop: -8,
    marginLeft: 5,
  },
  promptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    zIndex: 10,
  },
  promptDesc: {
    fontSize: 13,
    color: 'white',
  },

  modalBox: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.blackOpacityColor,
  },
  modalContent: {
    // height: 450,
    flex: 1,
    marginTop: Layout.WINDOW_HEIGHT - 500,
    width: Layout.WINDOW_WIDTH,
  },
  modalKeyboardContainer: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    // marginTop:Layout.WINDOW_HEIGHT - 450,
    margin: 0,
  },
  modalScrollView: {
    // marginTop: Platform.OS === 'android' ? Layout.ScreenHeight - 450 - StatusBarHeight : Layout.ScreenHeight - 450,
    flexDirection: 'row',
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    marginBottom: 0,
    height: 500,
    backgroundColor: 'white',
  },
  mDetailBox: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    alignItems: 'center',
  },
  mTitleView: {
    width: Layout.WINDOW_WIDTH,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  mDetailTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginLeft: 50,
  },
  mDetailCancelBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  mDetailCancelIcon: {
    width: 40,
    height: 40,
  },
  mDetailAmount: {
    height: 50,
    lineHeight: 60,
    color: Colors.fontBlackColor_43,
    fontSize: 22,
    fontWeight: '600',
  },
  mDetailItemView: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH - 40,
    marginTop: 15,
    marginBottom: 15,
  },
  mDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 80,
  },
  mDetailItemDesc: {
    flex: 1,
  },
  mDetailItemGray: {
    fontSize: 14,
    color: Colors.fontGrayColor_a,
  },
  mDetailItemBlack: {
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },

  mVLine: {
    width: Layout.WINDOW_WIDTH,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  mItenLine: {
    width: Layout.WINDOW_WIDTH - 40,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },

  mPwdBox: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    alignItems: 'center',
    marginRight: 0,
    marginBottom: 0,
  },
  mPwdBackBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mPwdBackIcon: {
    width: 30,
    height: 30,
  },
  mPwdTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginRight: 50,
  },
  mPwdContentBox: {
    flex: 1,
    alignItems: 'center',
  },
  mPwdInput: {
    marginTop: 15,
    height: 40,
    borderColor: Colors.bgGrayColor_e5,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    width: Layout.WINDOW_WIDTH - 40,
    fontSize: 15,
    // color: Colors.fontGrayColor_a,
  },
  modalNextBtn: {
    marginBottom: 30,
  },
  modalConfirmBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalConfirmBtn: {
    marginBottom: 30,
  },

  modalPromptBox: {
    flexDirection: 'row',
    width: 80,
  },
  mPropmptDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 60,
  },
  modalPromptTouch: {
    width: 20,
    height: 30,
  },
  modalTriangleIcon: {
    width: 12,
    height: 10,
    marginTop: -14,
  },
  modalPromptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    top: 38,
    zIndex: 10,
  },
  convertEthWalletItcBalance: {
    color: Colors.fontBlackColor_0a,
    fontSize: 14,
    marginTop: 5,
    marginRight: 0,
  },
  contentDescBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    height: 50,
    marginLeft:Layout.WINDOW_WIDTH  * 0.05,
    borderRadius: 5,
    backgroundColor: Colors.bg_blue,
    justifyContent: 'center',
    marginTop: 20,
    // marginBottom: 20,
  },
  contentDescText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
  },
});

class ItcMappingServiceScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      convertEthWallet: {}, // 发起钱包
      gasCost: 0, // Gas费用
      isShowPrompt: false,
      isDisabled: true,
      convertItcWallet: {},
      suggestGasPrice: 0,
      // defaultInputAmount: '',

      isShowMappingDetail: false,
    };

    this.inputAmount = '';
    this.ethAmount = '0.008';
    this.gasAmount = '600';

    this.stepItem1Ref = React.createRef();
    this.stepItem2Ref = React.createRef();

    // this.scroll = React.createRef();
    // this.inputText = React.createRef();
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _initData = async () => {
    const { mappingData } = this.props.navigation.state.params;
    this._showLoading();
    const { gasCost, gasPrice } = await this.getCurrentGas(mappingData.convertEthWallet);
    this.setState({
      convertEthWallet: mappingData.convertEthWallet,
      convertItcWallet: mappingData.itcWallet,
      gasCost, // Gas费用
      suggestGasPrice: gasPrice,
    });
    this._hideLoading();
    this.INPUT.focus();
  };

  getCurrentGas = async wallet => {
    const gasPrice = await NetworkManager.getSuggestGasPrice(wallet);
    return { gasCost: gasPrice * 0.001 * 0.001 * 0.001 * TransferGasLimit.tokenGasLimit, gasPrice };
  };

  mappingRecord = () => {
    Keyboard.dismiss();
    const convertAddress = {
      ethAddress: this.state.convertEthWallet.address,
      itcAddress: this.state.convertItcWallet.address,
    };
    this.props.navigation.navigate('MappingRecords', { convertAddress });
  };

  confirmBtn = () => {

    this.INPUT.blur();
    const { convertEthWallet, gasCost } = this.state;
    if (convertEthWallet.itcBalance < parseFloat(this.inputAmount)) {
      // 余额不够
      this._showAlert(I18n.t('exchange.insufficient_balance'));
      return;
    }
    if (convertEthWallet.ethBalance < gasCost) {
      // eth 不够gas
      this._showAlert(I18n.t('exchange.insufficient_service_fee'));
      return;
    }
    this.setState({
      isShowMappingDetail: true,
    });
  };

  warnBtn = () => {
    const isShow = this.state.isShowPrompt;
    this.setState({
      isShowPrompt: !isShow,
    });
  };

  onAmountChangeText = text => {
    this.inputAmount = text;
    this.setState({
      isDisabled: this.inputAmount === '',
    });
  };

  modalCancelBtn = () => {
    this.setState({
      isShowMappingDetail: false,
    });
  };

  getPriKey = async password => {
    try {
      return await KeystoreUtils.getPrivateKey(
        password,
        this.state.convertEthWallet.address,
        this.state.convertEthWallet.type
      );
    } catch (err) {
      showToast('check privateKey error', 30);
      return null;
    }
  };

  modalConfirmBtn = password => {
    this.setState(
      {
        isDisabled: true,
        isShowMappingDetail: false,
      },
      async () => {
        const priKey = await this.getPriKey(password);
        if (priKey == null) {
          showToast(I18n.t('modal.password_error'), 30);
        } else {
          const { convertItcWallet, convertEthWallet } = this.state;
          const blackHoleAddress = NetworkManager.createBlackHoleAddress(
            convertEthWallet.address,
            convertItcWallet.address
          );
          this._showLoading();
          await this.startSendTransaction(priKey, blackHoleAddress);
          this._hideLoading();
        }
      }
    );
    // this.props.navigation.navigate('MappingRecords');
  };

  startSendTransaction = async (privateKey, blackHoleAddress) => {
    let txHash;
    let result;
    try {
      result = await NetworkManager.sendERC20Transaction(
        defaultTokens[1].address,
        defaultTokens[1].decimal,
        blackHoleAddress,
        parseFloat(this.inputAmount),
        this.state.suggestGasPrice,
        privateKey,
        async hash => {
          txHash = hash;
        },
        this.state.convertEthWallet.address
      );
    } catch (e) {
      showToast('transaction error', 30);
    }
    if (txHash && result) {
      // showToast(I18n.t('mapping.successful'), -30);
      const convertAddress = {
        ethAddress: this.state.convertEthWallet.address,
        itcAddress: this.state.convertItcWallet.address,
      };
      this.props.navigation.navigate('MappingRecords', { convertAddress });
    } else {
      showToast(I18n.t('mapping.failed'), -30);
    }
  };

  renderComponent = () => {
    const { convertEthWallet, convertItcWallet, gasCost } = this.state;
    const topImg = require('../../assets/mapping/mappingService.png');
    const itcBalanceText = `${I18n.t('exchange.balance')}: ${convertEthWallet.itcBalance} ITC`;
    const itc_address = convertItcWallet.type === 'itc'?"ITC"+convertItcWallet.address.replace('0x',''):convertItcWallet.address
    return (
      <View
        style={styles.container}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.itc_mapping_service')}
          rightPress={this.mappingRecord}
          rightText={I18n.t('mapping.mapping_record')}
        />
        
        <KeyboardAvoidingView
          style={styles.keyboardAwareScrollView}
          keyboardShouldPersistTaps="handled"
          behavior="padding"
          keyboardVerticalOffset={-StatusBarHeight}
        >
          <ConfirmMappingModal
            visible={this.state.isShowMappingDetail}
            amount={this.inputAmount}
            payAddress={convertEthWallet.address}
            receiveAddress={convertItcWallet.address}
            rec
            ethAmount={this.state.gasCost}
            gasPrice={this.state.suggestGasPrice}
            pwdInputChangeText={this.pwdInputChangeText}
            modalCancelBtn={this.modalCancelBtn}
            modalConfirmBtn={this.modalConfirmBtn}
          />
          <LinearGradient
            style={styles.contentDescBox}
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.contentDescText}>
              {I18n.t('mapping.mapping_alert')}
            </Text>
          </LinearGradient>
          <ImageBackground style={styles.topImg} source={topImg} resizeMode="contain">
            {/* <TouchableOpacity
              activeOpacity={0.6}
              style={styles.mappingGuideBox}
              onPress={this._toMappingGuide}
            >
              <Text style={styles.mappingGuideText}>{I18n.t('mapping.mapping_guide')}</Text>
            </TouchableOpacity> */}
          </ImageBackground>
          <View style={styles.mAddressBox}>
            <View style={styles.mAddressContent}>
              <Text style={styles.mAddressTitle}>
                {I18n.t('mapping.native_itc_receive_address')}
              </Text>
              <Text style={styles.mAddressText}>{itc_address}</Text>
            </View>

            {/* <TouchableOpacity
              activeOpacity={0.6}
              style={styles.changeBox}
              onPress={this._onChaneAddressPress}
            >
              <Text style={styles.changeText}>{I18n.t('mapping.change')}</Text>
              <Image
                style={styles.changeIcon}
                source={require('../../assets/common/right_gray.png')}
                resizeMode="center"
              />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.mAmountTitle}>{I18n.t('mapping.map_amount')}</Text>
          <View style={styles.mAmountInputView}>
            <TextInput
              style={[styles.mAmountInput]}
              ref={textinput => {
                this.INPUT = textinput;
              }}
              placeholderTextColor={Colors.fontGrayColor_a0}
              placeholder=""
              // value={this.state.defaultInputAmount}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              multiline={false}
              returnKeyType="done"
              keyboardType="numeric"
              onChangeText={this.onAmountChangeText}
            />
            <Text style={styles.unit}>ITC</Text>
          </View>
          <View style={styles.vLine} />
          <View style={styles.initiationAddressBox}>
            <View style={styles.initiationAddressContent}>
              <Text style={styles.initiationAddressText}>
                {I18n.t('mapping.initiation_address')}
              </Text>
              <View style={styles.promptBox}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.promptTouch}
                  onPress={this.warnBtn}
                >
                  <Image
                    style={styles.promptIcon}
                    source={require('../../assets/mapping/sighIcon.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {this.state.isShowPrompt ? (
                  <Image
                    style={styles.triangleIcon}
                    source={require('../../assets/common/up_triangle.png')}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
              <Text style={styles.convertEthWalletItcBalance}>{itcBalanceText}</Text>
            </View>
            <Text style={styles.commonText}>{convertEthWallet.address}</Text>
            <Text style={styles.commonText}>{`Gas${I18n.t('mapping.cost')}:${gasCost} eth`}</Text>

            {this.state.isShowPrompt ? (
              <View style={styles.promptDescView}>
                <Text style={styles.promptDesc}>{I18n.t('mapping.initiation_address_prompt')}</Text>
              </View>
            ) : null}
          </View>

          <BlueButtonBig
            buttonStyle={styles.btn}
            isDisabled={false}
            onPress={this.confirmBtn}
            text={I18n.t('mapping.confirm_mapping')}
          />
        </KeyboardAvoidingView>
      </View>
    );
  };
}

class ConfirmMappingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmBtnIsDisabled: true,
    };
    this.inputPwd = '';
  }

  toInputPwd = () => {
    this.SCROLL.scrollTo({ x: Layout.WINDOW_WIDTH, y: 0, animated: true });
  };

  toMappingDetail = () => {
    this.SCROLL.scrollTo({ x: 0, y: 0, animated: true });
  };

  pwdInputChangeText = text => {
    this.inputPwd = text;
    const isDisabled = !!(text === '' || text.length < 8);
    this.setState({
      confirmBtnIsDisabled: isDisabled,
    });
  };

  confirmBtn = () => {
    const { modalConfirmBtn } = this.props;
    modalConfirmBtn(this.inputPwd);
  };

  render() {
    const {
      amount,
      payAddress,
      ethAmount,
      gasPrice,
      visible,
      receiveAddress,
      modalCancelBtn,
    } = this.props;
    const { confirmBtnIsDisabled } = this.state;
    const amountInfo = `${amount} ITC`;
    const ethAmountInfo = `${ethAmount}ether`;
    const gasAmountInfo = `= GasLimt(${
      TransferGasLimit.tokenGasLimit
    })*Gas price(${gasPrice} gwei)`;
    const itc_receiveAddress = ('ITC'+receiveAddress).replace('0x','')
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => console.log('close')}
        onShow={() => console.log('show')}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalContent}>
            <KeyboardAvoidingView
              style={styles.modalKeyboardContainer}
              keyboardShouldPersistTaps="handled"
              behavior="padding"
            >
              <ScrollView
                ref={scroll => {
                  this.SCROLL = scroll;
                }}
                style={styles.modalScrollView}
                keyboardShouldPersistTaps="handled"
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                behavior="padding"
              >
                <View style={styles.mDetailBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <Text style={styles.mDetailTitle}>{I18n.t('mapping.mapping_detail')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mDetailCancelBtn}
                      onPress={modalCancelBtn}
                    >
                      <Image
                        style={styles.mDetailCancelIcon}
                        source={require('../../assets/common/cancel.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mVLine} />
                  <Text style={styles.mDetailAmount}>{amountInfo}</Text>
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>{I18n.t('mapping.ratio')}</Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>1 : 1</Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>
                      {I18n.t('mapping.initiation_address')}
                    </Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                      {payAddress}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>
                      {I18n.t('mapping.native_itc_receive_address')}
                    </Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                      {itc_receiveAddress}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>{I18n.t('transaction.miner_cost')}</Text>
                    <View style={styles.mDetailItemDesc}>
                      <Text style={styles.mDetailItemBlack}>{ethAmountInfo}</Text>
                      <Text style={styles.mDetailItemGray}>{gasAmountInfo}</Text>
                    </View>
                  </View>
                  <View style={styles.modalConfirmBtnView}>
                    <BlueButtonBig
                      buttonStyle={styles.modalNextBtn}
                      onPress={this.toInputPwd}
                      text={I18n.t('mapping.next')}
                    />
                  </View>
                </View>

                <View style={styles.mPwdBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mPwdBackBtn}
                      onPress={this.toMappingDetail}
                    >
                      <Image
                        style={styles.mPwdBackIcon}
                        source={require('../../assets/common/common_back.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                    <Text style={styles.mPwdTitle}>{I18n.t('transaction.wallet_password')}</Text>
                  </View>
                  {/* <View style={styles.mPwdContentBox}> */}
                  <TextInput
                    style={styles.mPwdInput}
                    returnKeyType="done"
                    placeholderTextColor={Colors.fontGrayColor_a0}
                    placeholder={I18n.t('transaction.enter_password_hint')}
                    underlineColorAndroid="transparent"
                    selectionColor="#00bfff"
                    multiline={false}
                    secureTextEntry
                    onChangeText={this.pwdInputChangeText}
                  />
                  {/* </View> */}
                  <View style={styles.modalConfirmBtnView}>
                    <BlueButtonBig
                      buttonStyle={styles.modalConfirmBtn}
                      onPress={this.confirmBtn}
                      isDisabled={confirmBtnIsDisabled}
                      text={I18n.t('modal.confirm')}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItcMappingServiceScreen);
