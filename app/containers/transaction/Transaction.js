import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Keyboard
} from "react-native";

import PropTypes from "prop-types";
import I18n from "react-native-i18n";
import { Colors, TransferGasLimit, TransferType } from "../../config/GlobalConfig";
import TransactionStep from "./TransactionStep";
import NetworkManager from "../../utils/NetworkManager";
import store from "../../config/store/ConfigureStore";
import Layout from "../../config/LayoutConstants";
import { BlueButtonBig } from "../../components/Button";
import Slider from "../../components/Slider";
import { androidPermission } from "../../utils/PermissionsAndroid";
import KeystoreUtils from "../../utils/KeystoreUtils";
import { WhiteBgHeader } from "../../components/NavigaionHeader";
import BaseComponent from "../base/BaseComponent";
import { showToast } from "../../utils/Toast";
import StaticLoading from "../../components/StaticLoading";
import { getMonetaryUnitSymbol } from "../../utils/CommonUtil";
import {
  removeToken, setAllTokens,
  setIsNewWallet,
  setNetWork,
  setNewTransaction,
  setTotalAssets
} from "../../config/action/Actions";
import Analytics from "../../utils/Analytics";
import AutonymAlert from "../../components/AutonymAlert";
import { connect } from "react-redux";
const ScreenWidth = Dimensions.get("window").width;
import PlaintAlertComponent from "../../components/PlaintAlertComponent";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  sectionView: {
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "white"
  },
  sectionViewTopView: {
    flexDirection: "row"
  },
  sectionViewBottomView: {
    justifyContent: "center"
  },
  shadowStyle: {
    shadowColor: "#A9A9A9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1
    // elevation: 3
  },
  sectionViewTitleText: {
    flex: 1,
    fontSize: 13,
    color: Colors.fontBlackColor_43,
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10
  },

  infoViewDetailTitleTouchable: {
    alignSelf: "center",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingBottom: 10
  },
  blueText: {
    color: Colors.fontBlueColor,
    fontSize: 13,
    textAlign: "center"
  },
  sectionViewTextInput: {
    fontSize: 13,
    color: Colors.fontBlackColor_43,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  sliderBottomView: {
    marginTop: 12,
    marginLeft: 0,
    marginRight: 0,
    height: 140,
    backgroundColor: "white"
  },
  sliderTitleContainerView: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    width: ScreenWidth
  },
  sliderTitle: {
    marginLeft: 20,
    color: Colors.fontBlackColor
  },
  buttonTitle: {
    fontSize: 20,
    color: Colors.fontWhiteColor,
    textAlign: "center",
    fontWeight: "bold"
  },
  sliderContainerView: {
    width: ScreenWidth - 50 * 2 + 20,
    height: 40,
    marginTop: 20,
    marginLeft: 50,
    paddingLeft: 10,
    paddingRight: 10
  },
  sliderAlertView: {
    alignSelf: "center",
    width: ScreenWidth - 80,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  transferPrice: {
    textAlign: "center",
    color: Colors.fontGrayColor_a
  },
  buttonBox: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 80
  },

  amountBox: {
    width: Layout.WINDOW_WIDTH,
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: 12
  },
  amountTitle: {
    color: Colors.fontBlackColor_43,
    marginBottom: 12
  },
  amountInputBox: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  amountInput: {
    flex: 1,
    fontSize: 30,
    color: Colors.fontBlackColor_43,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  amountType: {
    fontSize: 20,
    color: Colors.fontBlueColor,
    marginBottom: 5
  },
  curBalanceBox: {
    height: 40,
    flexDirection: "row",
    alignItems: "center"
  },
  curBalance: {
    color: Colors.fontGrayColor_a,
    fontSize: 13
  },
  sendAll: {
    height: 40,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  sendAllTxt: {
    color: Colors.fontBlueColor,
    fontSize: 13
  },
  vLine: {
    width: Layout.WINDOW_WIDTH - 40,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5
  }
});

const sliderStyle = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    backgroundColor: "white",
    shadowColor: "#808080",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.45,
    elevation: 5
  }
});

class InfoView extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    returnKeyType: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    detailTitle: PropTypes.string,
    detailTitlePress: PropTypes.func,
    keyboardType: PropTypes.string,
    defaultValue: PropTypes.string
  };

  static defaultProps = {
    barStyle: "dark-content"
  };

  render() {
    const {
      title,
      detailTitlePress,
      detailTitle,
      placeholder,
      returnKeyType,
      keyboardType,
      onChangeText,
      defaultValue
    } = this.props;
    return (
      <View style={styles.sectionView}>
        <View style={styles.sectionViewTopView}>
          <Text style={styles.sectionViewTitleText}>{title}</Text>
          <TouchableOpacity
            style={styles.infoViewDetailTitleTouchable}
            activeOpacity={0.6}
            disabled={detailTitlePress === undefined}
            onPress={detailTitlePress}
          >
            <Text style={styles.blueText}>{detailTitle}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.sectionViewBottomView /* Platform.OS === 'ios' ? styles.shadowStyle : {} */
          ]}
        >
          <TextInput
            style={styles.sectionViewTextInput}
            placeholderTextColor={Colors.fontGrayColor_a0}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            multiline
          >
            {defaultValue}
          </TextInput>
        </View>
      </View>
    );
  }
}

class SliderView extends Component {
  static propTypes = {
    gasStr: PropTypes.string.isRequired,
    minGasPrice: PropTypes.number.isRequired,
    maxGasPrice: PropTypes.number.isRequired,
    initValue: PropTypes.number.isRequired,
    onValueChange: PropTypes.func.isRequired
  };

  render() {
    const { onValueChange, initValue, minGasPrice, maxGasPrice, gasStr } = this.props;
    return (
      <View style={[styles.sliderBottomView /* styles.shadowStyle */]}>
        <View style={styles.sliderTitleContainerView}>
          <Text style={styles.sliderTitle}>{I18n.t("transaction.miner_fee")}</Text>
        </View>
        <View style={styles.sliderContainerView}>
          <Slider
            style={sliderStyle.container}
            trackStyle={sliderStyle.track}
            thumbStyle={sliderStyle.thumb}
            minimumTrackTintColor={Colors.themeColor}
            maximumTrackTintColor={Colors.fontGrayColor}
            thumbTouchSize={{ width: 30, height: 24 }}
            onValueChange={onValueChange}
            value={initValue}
            minimumValue={minGasPrice}
            maximumValue={maxGasPrice}
            step={1}
          />
        </View>
        <View style={styles.sliderAlertView}>
          <Text>{I18n.t("transaction.slow")}</Text>
          <Text style={styles.transferPrice}>{gasStr}</Text>
          <Text style={{ alignSelf: "flex-end" }}>{I18n.t("transaction.fast")}</Text>
        </View>
      </View>
    );
  }
}

class Transaction extends BaseComponent {
  constructor(props) {
    super(props);
    // 参数
    const params = store.getState().Core.walletTransfer;
    this.didTapSurePasswordBtn = this.didTapSurePasswordBtn.bind(this);
    this.didTapNextBtn = this.didTapNextBtn.bind(this);
    this.getPriceTitle = this.getPriceTitle.bind(this);
    this.sliderValueChanged = this.sliderValueChanged.bind(this);
    this.getDetailPriceTitle = this.getDetailPriceTitle.bind(this);
    this.params = params;

    this.timeInterval = null;
    this.timeIntervalCount = 0;
    let key = "";
    if (this.props.navigation.state.params) {
      key = this.props.navigation.state.params.key;
    }
    const { wallet } = store.getState().Core;
    this.state = {
      transferType: params.transferType,
      minGasPrice: 1,
      maxGasPrice: 100,
      currentGas: params.suggestGasPrice,
      gasStr: this.getPriceTitle(params.suggestGasPrice),
      transferValue: undefined,
      toAddress: "",
      fromAddress: (wallet.type === 'itc')?'ITC'+params.fromAddress.replace('0x',''):params.fromAddress,
      detailData: "",
      isDisabled: true,

      isShowSLoading: false,
      sLoadingContent: "",
      autonymAlertshow: false,
      key: key,
      showITCAlert:false
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  /** static navigationOptions = ({navigation}) => ({
        header:<WhiteBgHeader navigation={navigation} text={ComponentTitle()}/>
    })* */

  getPriceTitle = gasPrice => {
    const { wallet } = store.getState().Core;
    const totalGas = this.getGas(gasPrice);
    // let totalGasPrice = totalGas * ethPrice;
    // totalGasPrice = totalGasPrice.toFixed(8);
    // return totalGas + "ether≈" + totalGasPrice + "$";

    const totalGasPrice = this.subStringNum(this.params.ethPrice * totalGas,6);
    const walletType = wallet.type === "itc" ? " itg" : " ether";
    const gasStr = `${totalGas + walletType} ≈ ${getMonetaryUnitSymbol()}${totalGasPrice}`;

    return gasStr;
  };

  getDetailPriceTitle = () => {
    const gasLimit = this.getGas();
    // let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
    // totalGas = Number(totalGas.toFixed(8));

    const { wallet } = store.getState().Core;
    const gasSymbol = wallet.type === "itc" ? "szabo" : "gwei";

    return `=Gas(${gasLimit})*Gas Price(${this.state.currentGas})${gasSymbol}`;
  };

  getGas = gasPrice => {
    const { wallet } = store.getState().Core;
    const { amount, price, symbol } = store.getState().Core.balance;

    if (wallet.type === "itc") {
      var gasLimit = this.params.transferType === "ITG"
        ? TransferGasLimit.itcGasLimit
        : TransferGasLimit.tokenGasLimit;
      var totalGas = gasPrice * 0.001 * 0.001 * gasLimit;
    } else if (wallet.type === "eth") {
      var gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
      var totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
    }
    if (gasPrice === undefined) {
      return gasLimit;
    }

    totalGas = Number(this.subStringNum(totalGas,8));
    return totalGas;
  };

  async startSendTransaction(privateKey) {
    Analytics.recordClick("Transaction", "startSendTransaction");
    try {
      const { address, symbol, decimal } = store.getState().Core.balance;

      const currentBlock = await NetworkManager.getCurrentBlockNumber();
      await NetworkManager.sendTransaction(
        {
          address,
          symbol,
          decimal
        },
        (this.state.toAddress.indexOf('ITC')>-1)?'0x'+this.state.toAddress.replace('ITC',''):this.state.toAddress,
        this.state.transferValue,
        this.state.currentGas,
        privateKey,
        hash => {
          if (hash === null) {
            this.hideLoading();
            this._showAlert(I18n.t("transaction.alert_1"));
            return;
          }
          const { wallet } = store.getState().Core;
          const timestamp = new Date().getTime();

          let gasLimit;
          if (wallet.type === "itc") {
              gasLimit = this.params.transferType === "ITG"
              ? TransferGasLimit.itcGasLimit
              : TransferGasLimit.tokenGasLimit;
            var totalGas = this.state.currentGas * 0.001 * 0.001 * gasLimit;
          } else if (wallet.type === "eth") {
            gasLimit =
              this.params.transferType === TransferType.ETH
                ? TransferGasLimit.ethGasLimit
                : TransferGasLimit.tokenGasLimit;
            var totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
          }

          totalGas = this.subStringNum(totalGas,8);
          const txHash = hash.indexOf("0x") === -1 ? `0x${hash}` : hash;
          const newTransaction = {
            from: (wallet.address.indexOf('ITC')>-1)?'0x'+wallet.address.replace('ITC',''):wallet.address,
            to: (this.state.toAddress.indexOf('ITC')>-1)?'0x'+this.state.toAddress.replace('ITC',''):this.state.toAddress,
            timeStamp: timestamp.toString(),
            hash: txHash,
            value: this.state.transferValue,
            isError: "0",
            gasPrice: totalGas,
            blockNumber: currentBlock,
            symbol,
            type:wallet.type
          };
          let key = `${(wallet.address.indexOf('ITC')>-1)?'0x'+wallet.address.replace('ITC',''):wallet.address}_${wallet.type}_${this.params.transferType}`
          let latestTransactionInfo = {}
          latestTransactionInfo[key] = newTransaction

          store.dispatch(setNewTransaction(latestTransactionInfo));
          this.hideLoading();

          // 回调刷新
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        },
        false
      );
    } catch (err) {
      this.hideLoading();
    }

    // if (!res) {
    //     setTimeout(() => {
    // alert(I18n.t('transaction.alert_1'));
    //         this._showAlert(I18n.t('transaction.alert_1'))
    //     }, 100);
    // }
  }

  changeLoading(num, password) {
    let content = "";
    if (num === 1) {
      content = I18n.t("transaction.getting_key");
    } else if (num === 2) {
      content = I18n.t("transaction.signing_transaction");
    } else {
      content = I18n.t("transaction.broadcasting_transaction");
    }
    this.setState({
      isShowSLoading: true,
      sLoadingContent: content
    });
    if (num === 3) {
      clearInterval(this.timeInterval);
      setTimeout(() => {
        this.didTapSurePasswordBtn(password);
      }, 0);
    }
  }

  async didTapSurePasswordBtn(password) {
    const { wallet } = store.getState().Core;

    let privateKey;
    try {

      privateKey = await KeystoreUtils.getPrivateKey(password, (wallet.address.indexOf('ITC')>-1)?'0x'+wallet.address.replace('ITC',''):wallet.address, wallet.type);
      if (privateKey == null) {

        console.log('密码错误，弹框提示')
        this.hideLoading();
        showToast(I18n.t("modal.password_error"));
      } else {
        this.startSendTransaction(privateKey);
      }
    } catch (err) {
      this.hideLoading();
    }
  }

  hideLoading() {
    this.setState({
      isShowSLoading: false,
      sLoadingContent: ""
    });
  }

  didTapNextBtnFirst = ()=>{
    const { wallet } = store.getState().Core;
    if(wallet.type === 'itc' && this.state.toAddress.indexOf('0x')>-1){
      this.setState({
        showITCAlert:true
      })
      return;
    }
    this.didTapNextBtn()
  }
  didTapNextBtn = () => {
    this.INPUT_ADDRESS.blur();

    if (!this.checkBalanceAndGas()) {
      return;
    }
    const { wallet } = store.getState().Core;
    const gas = this.getGas(this.state.currentGas);
    const walletType = wallet.type === "itc" ? " itg" : " ether";

    const userinfo = this.props.userinfo;
    if (userinfo) {
      const IdentifyVerify = userinfo.identifyVerify;
      if (this.props.monetaryUnit.monetaryUnitType === "CNY") {
        if (IdentifyVerify === 0) {
          if (this.params.transferType === "ITG") {

            if (parseInt(this.state.transferValue) >= 1000000) {
              this.setState({
                autonymAlertshow: true
              });
              return;
            }
          } else if (this.params.transferType === "ITC") {
            if (parseInt(this.state.transferValue) >= 200000) {
              this.setState({
                autonymAlertshow: true
              });
              return;
            }
          }
        }
      }
    }



    const params = {
      fromAddress:this.state.fromAddress   ,
      toAddress:this.state.toAddress     ,
      totalAmount: `${this.subStringNum(this.state.transferValue,8)} ${this.params.transferType}`,
      payType: I18n.t("transaction.transfer"),
      gasPrice: `${gas}${walletType}`,
      gasPriceInfo: this.getDetailPriceTitle()
    };

    this.dialog.showStepView(params);
  };

  _closeModal = () => {
    this.dialog.closeStepView();
  };

  // ----视图的事件方法
  sliderValueChanged = async value => {
    const gasStr = this.getPriceTitle(value);
    this.setState(
      {
        currentGas: value,
        gasStr
      },
      this.judgeCanSendInfoCorrect
    );
  };

  valueTextInputChangeText = txt => {
    const value = txt.trim();
    this.setState(
      {
        // transferValue: Number.isNaN(value) ? '' : txt,
        transferValue: value
      },
      this.judgeCanSendInfoCorrect
    );
  };

  toAddressTextInputChangeText = txt => {
    const address = txt.trim();
    this.setState(
      {
        toAddress: address
      },
      this.judgeCanSendInfoCorrect
    );
  };

  subStringNum = (a, num) => {

    if(isNaN(Number(a))){

      return '0'
    }

    if (a>0 && a < 0.0001) {
      a = 0;
    }


    a = a + "";
    var aArr = a.split(".");

    if (aArr.length > 1) {
      a = aArr[0] + "." + aArr[1].substr(0, num);
    }
    return a;
  }

  checkBalanceAndGas = () => {
    const { wallet } = store.getState().Core;
    const { balance, transferType, ethBalance } = this.params;

    const { transferValue, currentGas } = this.state;
    const gas = this.getGas(currentGas);
    let curBalance;
    let curMainBalance;
    if (transferType.toLowerCase() == 'eth' || transferType.toLowerCase() == 'itg') {
      curBalance = this.subStringNum(parseFloat(balance - transferValue - gas),8);
      curMainBalance = curBalance;
    } else {
      curBalance = this.subStringNum(parseFloat(balance - transferValue),8)
      curMainBalance = this.subStringNum(parseFloat(ethBalance - gas));
    }
    if (curBalance < 0) {
      // 余额不足
      this._showAlert(I18n.t("exchange.insufficient_balance"));
      return false;
    }
    if (curMainBalance < 0) {
      // 服务费不足
      this._showAlert(I18n.t("exchange.insufficient_service_fee"));
      return false;
    }
    return true;
  };

  judgeCanSendInfoCorrect = () => {
    const { transferValue, toAddress, fromAddress } = this.state;

    const c_toAddress = toAddress.indexOf('ITC')>-1?'0x'+toAddress.replace('ITC',''):toAddress
    const c_fromAddress = fromAddress.indexOf('ITC')>-1?'0x'+fromAddress.replace('ITC',''):fromAddress

    const amountIsNotValid =
      transferValue === undefined || Number.isNaN(transferValue) || parseFloat(transferValue) <= 0;
    const addressIsNotValid = !NetworkManager.isValidAddress(c_toAddress);
    const addressIsSame = c_toAddress === c_fromAddress;

    this.setState({
      isDisabled: amountIsNotValid || addressIsNotValid || addressIsSame
    });
  };

  routeContactList = () => {
    Analytics.recordClick("Transaction", "contactList");
    const _this = this;
    this.props.navigation.navigate("AddressList", {
      from: "transaction",
      callback(data) {
        const address = data.toAddress;
        _this.setState(
          {
            toAddress: address
          },
          _this.judgeCanSendInfoCorrect
        );
      }
    });
  };

  detailTextInputChangeText = text => {
    this.setState({
      detailData: text
    });
  };

  scanClick = async () => {
    Analytics.recordClick("Transaction", "san");
    const _this = this;
    let isAgree = true;
    if (Platform.OS === "android") {
      isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (isAgree) {
      this.props.navigation.navigate("ScanQRCode", {
        callback(data) {
          const address = data.toAddress;
          _this.setState(
            {
              toAddress: address
            },
            _this.judgeCanSendInfoCorrect
          );
        }
      });
    } else {
      this._showAlert(I18n.t("transaction.alert_2"));
    }
  };

  sendAllPress = () => {
    const { balance, transferType } = this.params;
    const { currentGas } = this.state;

    let curBalance;

    if (transferType.toLowerCase() == 'eth' || transferType.toLowerCase() == 'itg') {
      
      const gas = this.getGas(currentGas);
      curBalance = Number(this.subStringNum(parseFloat(balance - gas),4));
    } else {
      curBalance = Number(this.subStringNum(parseFloat(balance),4));
    }
    this.setState(
      {
        transferValue: curBalance
      },
      this.judgeCanSendInfoCorrect
    );
  };
  leftPress() {
    this.setState({
      showITCAlert: false
    });
  }

  rightPress() {
    this.setState({
      showITCAlert: false
    });
    this.didTapNextBtn()
  }
  renderComponent = () => {
    const {
      toAddress,
      fromAddress,
      transferValue,
      isDisabled,
      isShowSLoading,
      sLoadingContent
    } = this.state;
    const title = /* params.transferType + ' ' + */ I18n.t("transaction.transfer");
    const c_toAddress = toAddress.indexOf('ITC')>-1?'0x'+toAddress.replace('ITC','').toLowerCase():toAddress.toLowerCase()
    const c_fromAddress = fromAddress.indexOf('ITC')>-1?'0x'+fromAddress.replace('ITC','').toLowerCase():fromAddress.toLowerCase()

    const alertHeight =
      NetworkManager.isValidAddress(c_toAddress) && c_toAddress !== c_fromAddress ? 0 : 18;
    const wallet_type = this.props.wallet.type
    let address_valid = true
    if(wallet_type === 'eth'){
      address_valid  = toAddress.indexOf('0x')>-1
    }else{
      address_valid  = toAddress.indexOf('ITC')>-1 || toAddress.indexOf('0x')>-1
    }

    const isShowAddressWarn = c_toAddress !== "" && (alertHeight === 18 || address_valid===false );
    const curBalance = `${I18n.t("transaction.balance")}:${Number(
      this.subStringNum(parseFloat(this.params.balance),4)
    )} ${this.params.transferType}`;
    return (
      <View
        style={styles.container}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={title}
          rightPress={() => this.scanClick()}
          rightIcon={require("../../assets/common/scanIcon.png")}
        />
        <PlaintAlertComponent
          visible={this.state.showITCAlert}
          title={""}
          contents={[I18n.t("transaction.itc_tip")]}
          leftBtnTxt={I18n.t("setting.cancel")}
          rightBtnTxt={I18n.t("stak.goon")}
          leftPress={() => this.leftPress()}
          rightPress={() => this.rightPress()}
        />
        {/** <ScrollView style={styles.scrollView}
         bounces={false}
         keyboardShouldPersistTaps={'handled'}>* */}
        <StaticLoading visible={isShowSLoading} content={sLoadingContent}/>
        <View style={styles.contentBox}>
          <TransactionStep
            didTapSurePasswordBtn={password => {
              this.timeIntervalCount = 0;
              this.timeInterval = setInterval(() => {
                this.timeIntervalCount = this.timeIntervalCount + 1;
                this.changeLoading(this.timeIntervalCount, password);
              }, 500);
            }}
            ref={dialog => {
              this.dialog = dialog;
            }}
          />
          {/* 转账地址栏 */}
          <InfoView
            title={I18n.t("transaction.collection_address")}
            detailTitle={I18n.t("transaction.address_list")}
            placeholder={I18n.t("transaction.enter_transfer_address")}
            returnKeyType="next"
            onChangeText={txt => {
              this.toAddressTextInputChangeText(txt);
            }}
            defaultValue={toAddress}
            detailTitlePress={this.routeContactList}
          />
          {isShowAddressWarn ? (
            <Text
              style={{
                color: Colors.fontRedColor,
                textAlign: "right",
                marginTop: 8,
                marginLeft: 20,
                marginRight: 20,
                fontSize: 13
              }}
              adjustsFontSizeToFit
            >
              {I18n.t("modal.enter_valid_transfer_address")}
            </Text>
          ) : null}
          <View style={styles.amountBox}>
            <Text style={styles.amountTitle}>{I18n.t("transaction.amount")}</Text>
            <View style={styles.amountInputBox}>
              <TextInput
                style={styles.amountInput}
                placeholderTextColor={Colors.fontGrayColor_a0}
                // placeholder={I18n.t('transaction.enter')}
                // selectionColor={Colors.fontBlueColor}
                ref={textinput => {
                  this.INPUT_ADDRESS = textinput;
                }}
                returnKeyType="next"
                keyboardType="numeric"
                onChangeText={txt => {
                  this.valueTextInputChangeText(txt);
                }}
              >
                {transferValue}
              </TextInput>
              <Text style={styles.amountType}>{this.params.transferType}</Text>
            </View>
            <View style={styles.vLine}/>
            <View style={styles.curBalanceBox}>
              <Text style={styles.curBalance}>{curBalance}</Text>
              <TouchableOpacity
                style={styles.sendAll}
                activeOpacity={0.6}
                // disabled={detailTitlePress === undefined}
                onPress={this.sendAllPress}
              >
                <Text style={styles.sendAllTxt}>{I18n.t("transaction.send_all")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 滑竿视图 */}
          <SliderView
            gasStr={this.state.gasStr}
            minGasPrice={this.state.minGasPrice}
            maxGasPrice={this.state.maxGasPrice}
            initValue={this.params.suggestGasPrice}
            onValueChange={this.sliderValueChanged}
          />
          {/* 下一步按钮 */}
          <View style={styles.buttonBox}>
            <BlueButtonBig
              buttonStyle={styles.button}
              isDisabled={isDisabled}
              onPress={() => this.didTapNextBtnFirst()}
              text={I18n.t("transaction.next_step")}
            />
          </View>
        </View>
        <AutonymAlert
          visible={this.state.autonymAlertshow}
          topPress={() => this.goBindPhone()}
          buttomPress={() => this.setState({
            autonymAlertshow: false
          })}
        />
      </View>
    );
  };

  goBindPhone() {
    this.setState({
      autonymAlertshow: false
    });
    this.props.navigation.navigate("BindPhone", { key: this.state.key });
  }
}


const mapStateToProps = state => ({
  userinfo: state.Core.userinfo,
  monetaryUnit: state.Core.monetaryUnit,
  wallet: state.Core.wallet,
});


export default connect(
  mapStateToProps,
)(Transaction);