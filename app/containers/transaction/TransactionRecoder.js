import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig';
import StorageManage from '../../utils/StorageManage';
import store from '../../config/store/ConfigureStore';
import {
  setTransactionDetailParams,
  setWalletTransferParams,
  setCoinBalance,
  setTransactionRecordList,
  setNewTransaction
} from '../../config/action/Actions';
import NetworkManager from '../../utils/NetworkManager';
import StatusBarComponent from '../../components/StatusBarComponent';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import { addressToName } from '../../utils/CommonUtil';
import Layout from '../../config/LayoutConstants';
import Analytics from '../../utils/Analytics';
import { connect } from "react-redux";
import NavHeader from '../../components/NavHeader';
const tokenIcon = {
  ETH: require('../../assets/transfer/ethIcon.png'),
  ITC: require('../../assets/transfer/itcIcon.png'),
  MANA: require('../../assets/transfer/manaIcon.png'),
  DPY: require('../../assets/transfer/dpyIcon.png'),
  USDT: require('../../assets/transfer/usdtIcon.png'),
};

let timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  flatList: {
    flex: 1,
    // marginTop:7,
  },
  bottomBtnView: {
    flexDirection: 'row',
    height: 45,
    backgroundColor: Colors.whiteBackgroundColor,
    marginBottom: 0,
    // justifyContent:"space-around",
    alignItems: 'center',
  },
  header: {
    height: Layout.TRANSFER_HEADER_MAX_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 4,
    // elevation: 10
  },
  balanceText: {
    fontSize: 32,
    color: Colors.fontBlueColor,
    alignSelf: 'center',
    fontWeight: '500',
  },
  balanceValueText: {
    marginTop: 3,
    fontSize: FontSize.alertTitleSize,
    color: Colors.fontDarkGrayColor,
  },
  emptyListContainer: {
    color: Colors.fontDarkGrayColor,
    marginTop: 120,
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    width: 94,
    height: 114,
    marginBottom: 23,
  },
  emptyListText: {
    width: Layout.WINDOW_WIDTH * 0.9,
    fontSize: 16,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  cell: {
    // height:60,
    backgroundColor: Colors.whiteBackgroundColor,
    flexDirection: 'row',
    // alignItems:"center"
  },
  icon: {
    marginLeft: 21,
    alignSelf: 'center',
    width: 14,
    height: 13,
  },
  addressContainer: {
    width: Layout.WINDOW_WIDTH * 0.4,
    marginLeft: 0,
    justifyContent: 'center',
  },
  transcationStatusContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 0,
    justifyContent: 'center',
  },
  transactionValue: {
    fontSize: FontSize.DetailTitleSize,
    textAlign: 'right',
  },
  transactionFailed: {
    fontSize: FontSize.alertTitleSize,
    textAlign: 'right',
    color: Colors.fontDarkGrayColor,
  },
  tranContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 21,
    flexDirection: 'row',
  },
  progresView: {
    marginLeft: 10,
    marginRight: 10,
    height: 25,
    // backgroundColor:"green",
  },
  backImage: {
    position: 'absolute',
    width: 38,
    height: 38,
    left: 12,
    top: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
    zIndex: 10,
  },
  functionBtn: {
    flex: 1,
    justifyContent: 'center',
    borderTopColor: Colors.fontGrayColor,
    borderTopWidth: 1,
  },
  itemSeparator: {
    height: 7,
    width: Layout.WINDOW_WIDTH,
    backgroundColor: Colors.clearColor,
  },
});

class Header extends Component {
  render() {
    return (
      <View style={[styles.header, Platform.OS === 'ios' ? styles.shadow : {}]}>
        <Text style={styles.balanceText}>{/* {this.props.balance} */}</Text>
        <Text style={styles.balanceValueText}>{/* {"≈$"+this.props.value} */}</Text>
      </View>
    );
  }
}

class EmptyComponent extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
  };

  render() {
    const { show } = this.props;
    return show ? (
      <View style={styles.emptyListContainer}>
        <Image
          style={styles.emptyListIcon}
          source={require('../../assets/common/no_icon.png')}
          resizeMode="contain"
        />
        <Text style={styles.emptyListText}>
          {I18n.t('transaction.no_transaction_history_found')}
        </Text>
      </View>
    ) : null;
  }
}

class ProgressView extends Component {
  // static propTypes={
  //     curProgress:PropTypes.number.isRequested,
  //     totalProgress:PropTypes.number.isRequested
  // }

  render() {
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
    const { curProgress, text, totalProgress } = this.props;
    return (
      <View style={styles.progresView}>
        <View
          style={{
            height: 4,
            flexDirection: 'row',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <AnimatedLinearGradient
            colors={['#32beff', '#0095eb', '#2093ff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: curProgress }}
          >
            <Text style={[styles.middleBlueBtnTitle, styles.normalMiddleBtnTitle]}>{text}</Text>
          </AnimatedLinearGradient>
          <View
            style={{
              flex: totalProgress - curProgress,
              backgroundColor: Colors.fontGrayColor,
            }}
          />
        </View>
      </View>
    );
  }
}

class Cell extends Component {
  static propTypes = {
    // item:PropTypes.any.isRequested,
    // onPress:PropTypes.any.isRequested
  };

  transcationStatusText = (transcationStatus, isGasTransaction,symbol,income) => {
    if (transcationStatus === '1') {
      return <Text style={styles.transactionFailed}>{I18n.t('transaction.transaction_fail')}</Text>;
    }
    // if((symbol === "itg" || symbol === "eth")&& !income){
    //   return <Text style={styles.transactionFailed}>{I18n.t('transaction.transaction_send_token')}</Text>
    // }

    return isGasTransaction ? (
      <Text style={styles.transactionFailed}>{I18n.t('transaction.transaction_send_token')}</Text>
    ) : null;
  };

  render() {
    const { item, onPress } = this.props;
    const { address, time, income, amount, symbol, name, isGasTransaction } = item.item || {};
    const { wallet } = store.getState().Core;
    let image = require('../../assets/transfer/recoder/direction_left.png');
    let showText = `-${amount} ${symbol}`;
    let colorStyle = { color: Colors.fontRedColor };

    if (income) {
      image = require('../../assets/transfer/recoder/direction_right.png');
      showText = `+${amount} ${symbol}`;
      colorStyle = { color: Colors.fontGreenColor };
    }

    const cellHeight = item.item.sureBlock <= 12 ? 80 : 60;
    const transcationStatus = item.item.isError;
    if (transcationStatus === '1') {
      image = require('../../assets/transfer/transaction_fail.png');
    }
    let itc_address = ''
    if(wallet.type === 'itc'){
      itc_address = address.indexOf('ITC')>-1?address:('ITC'+address).replace('0x','')
    }else {
      itc_address = address
    }
    return (
      <TouchableOpacity
        style={[styles.cell, { height: cellHeight }, Platform.OS === 'ios' ? styles.shadow : {}]}
        onPress={() => {
          onPress(item.index);
        }}
      >
        <Image style={styles.icon} source={image} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <View style={styles.tranContainer}>
            <View style={styles.addressContainer}>
              <Text
                style={{
                  fontSize: FontSize.TitleSize,
                  color: Colors.fontBlackColor,
                }}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {name === '' ? itc_address : name}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.alertTitleSize,
                  color: Colors.fontDarkGrayColor,
                }}
              >
                {time}
              </Text>
            </View>
            <View style={styles.transcationStatusContainer}>
              <Text style={[colorStyle, styles.transactionValue]}>{showText}</Text>
              {this.transcationStatusText(transcationStatus, isGasTransaction,symbol,income)}
            </View>
          </View>
          {item.item.sureBlock < 12 ? (
            <ProgressView totalProgress={12} curProgress={item.item.sureBlock} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

// 时间戳换时间格式
function timestampToTime(timestamp) {
  let date;
  if (timestamp.length === 10) {
    date = new Date(parseInt(timestamp, 10) * 1000);
  } else if (timestamp.length === 13) {
    date = new Date(parseInt(timestamp, 10));
  }
  const Y = `${date.getFullYear()}-`;
  const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${Y + M + D} ${h}:${m}:${s}`;
}

class TransactionRecoder extends BaseComponent {
  constructor(props) {
    super(props);
    // this.onRefresh = this.onRefresh.bind(this);

    const { amount, price, iconLarge, symbol } = store.getState().Core.balance;

    this.state = {
      itemList: [],
      balance: amount,
      price,
      isRefreshing: false,
      scroollY: new Animated.Value(0),
      showNoData: false,
      icon: iconLarge,
      loadIconError: false,
    };

    this.symbol = symbol;
    this.firstPage = 100; // 第一页最多显示100条转账记录,如果加载更多就将之前的所有记录全都加载出来
    this.totalRecoder = []  //获取到的交易记录
    this.totalItemList = []; // 加载的所有记录
    this.page = 1; // 上次获取的区块高度
    this.offset = 20;
    this.isGetRecodering = false;

    this.suggestGas = -1;
    this.ethBalance = -1;
    this.flatListRef = React.createRef();
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    clearInterval(timer);
    super.componentWillUnmount();
    this._isMounted = false;
  }

  getRecoder = async pull => {

    // console.log(this._isMounted,this.isGetRecodering)

    if (this._isMounted && !this.isGetRecodering) {

      this.isGetRecodering = true;

      if(pull){
        this.page = 1
      }

      const { address, decimal } = store.getState().Core.balance;
      const recoders = await NetworkManager.getTransations(
        {
          address,
          symbol: this.symbol,
          decimal,
        },
        this.page,
        this.offset
      );

      if(recoders && recoders.length == 0){

        this.isGetRecodering = false;
        return
      }

      if(this.page == 1){
        this.totalRecoder = recoders

        // //向前拼接
        // for (let index = recoders.length - 1; index > 0; index--) {
        //   const element = recoders[index];
          
        //   if(this.totalRecoder.indexOf(element) == -1){

        //     this.totalRecoder.unshift(element)
        //   }
        // }
      }
      else{

        //向后拼接
        for (let index = 0; index < recoders.length; index++) {
          const element = recoders[index];
          
          if(this.totalRecoder.indexOf(element) == -1){

            this.totalRecoder.push(element)
          }
        }
      }

      this.page = this.page+1

      await this.refreshBlockHeight()

      this.isGetRecodering = false;
    }
  };

  // 刷新页面
  refreshPage = async (itemList, isFirst) => {
    const balanceInfo = await this.loadBalanceInfo(isFirst);
    if (this._isMounted) {
      // store.dispatch(setTransactionRecoders(recoders));
      if (balanceInfo.balance !== this.state.balance) {
        NetworkManager.loadTokenList();
      }
      this.setState({
        showNoData: true,
        itemList,
        price: balanceInfo.price,
        balance: balanceInfo.amount,
      });
      store.dispatch(setCoinBalance(balanceInfo));
    }
  };

  refreshItemList = async (newRecoders, symbol, currentBlock) => {
    const { wallet } = store.getState().Core;
    const { contactList } = store.getState().Core;
    const newItemList = [];
    newRecoders.map((item, i) => {
      let address = ''
      if(wallet.type === 'itc'){
        address = item.to.toLowerCase() === ('ITC'+wallet.address.replace('0x','')).toLowerCase() ? item.from : item.to;
      }else {
        address = item.to.toLowerCase() === wallet.address.toLowerCase() ? item.from : item.to;
      }


      let amountValue;
      if (item.amount) {
        amountValue = item.amount;
      } else if (item.value) {
        amountValue = Number(this.subStringNum(parseFloat(item.value),8));
      } else {
        amountValue = item.amount;
      }
      const itc_address = (item.to.indexOf('ITC')>-1)?item.to.replace('ITC','0x').toLowerCase():item.to.toLowerCase()

      let at_address = ''
      if(wallet.type === 'itc'){
        at_address = address.indexOf('ITC')>-1?address:'ITC'+address.replace('0x','')
      }else {
        at_address = address
      }
      const data = {
        key: i.toString(),
        address,
        time: item.time ? item.time : timestampToTime(item.timeStamp),
        income: itc_address === wallet.address.toLowerCase(),
        amount: amountValue,
        symbol: symbol.toLowerCase(),
        sureBlock: currentBlock - item.blockNumber,
        isError: item.isError,
        name: addressToName(at_address, contactList),
        isGasTransaction: item.isGasTransaction,
        blockNumber: item.blockNumber,
        from: item.from,
        to: item.to,
        txFee: item.txFee,
        hash: item.hash,
      };
      newItemList.push(data);
    });

    return newItemList;
  };

  // 获取余额信息
  loadBalanceInfo = async isFirst => {
    const { address, decimal, price, amount, symbol } = store.getState().Core.balance;
    const { wallet } = store.getState().Core;
    let balanceAmount = '';
    if (isFirst) {
      balanceAmount = amount;
    } else if (wallet.type === 'itc') {
      balanceAmount = await NetworkManager.iotcGetBalance(wallet,{
        address,
        symbol,
        decimal
      });
    } else if (wallet.type === 'eth') {
      if (symbol !== 'ETH') {
        balanceAmount = await NetworkManager.getEthERC20Balance(wallet.address, address, decimal);
      } else {
        balanceAmount = await NetworkManager.getEthBalance(wallet.address);
      }
    }
    const balanceInfo = {
      amount: balanceAmount,
      price,
      symbol,
      address,
      decimal,
    };
    return balanceInfo;
  };

  // 存储最新的100条交易记录
  saveStorageTransactionRecoder = async (totalItemList) => {
    const records = totalItemList;
    this.topBlock = records.length > 0 ? records[0].blockNumber : 0;
    if (totalItemList.length === 0) {
      return;
    }

    let { transferRecordList, wallet } = store.getState().Core;
    let key = `${wallet.address}+${wallet.type}+${this.symbol.toLowerCase()}`
    transferRecordList[key] = totalItemList

    //存储
    store.dispatch(setTransactionRecordList(transferRecordList));  
  };

  // 从内存获取转账记录列表
  loadStoreTransactionRecoder = async () => {

    const { wallet } = store.getState().Core;

    let key = `${wallet.address}+${wallet.type}+${this.symbol.toLowerCase()}`
    let { transferRecordList } = store.getState().Core;

    // console.log('transferRecordList:',transferRecordList)

    if (Object.keys(transferRecordList).indexOf(key) != -1 && transferRecordList[key].length > 0) {

      this.totalItemList = this.totalItemList.concat(transferRecordList[key])

      await this.refreshPage(this.totalItemList, true);

      return true;
    }

    return false
  };

  onRefresh = async () => {
    if (this._isMounted) {
      this.setState({
        isRefreshing: true,
      });

      await this.getRecoder(true);

      this.setState({
        isRefreshing: false,
      });
    }
  };

  _onLoadMore = async () => {

    await this.getRecoder(false)
  };

  didTapTransactionButton = async () => {
    const { amount, price, symbol } = store.getState().Core.balance;
    const { wallet } = store.getState().Core;
    Analytics.recordClick('TransactionRecoder', 'transaction');
    if (this.ethBalance === -1) {
      this._showLoading();
      await this.getInfo();
      this._hideLoading();
    }

    /* 
      //没有余额时，不能进入转账页面
      if (this.ethBalance <= 0) {
      showToast(I18n.t('transaction.alert_4'));
      return;
    } */

    const transferProps = {
      transferType: symbol,
      ethBalance: this.ethBalance, // ETH钱包下：当前钱包的ETH余额， ITC钱包下：当前钱包的ITC余额
      balance: amount, // 余额
      suggestGasPrice: parseFloat(this.suggestGas),
      ethPrice: wallet.type == 'itc' ? 0 : price, // 当前Token对应当前货币单位的价格
      fromAddress: wallet.address,
    };
    store.dispatch(setWalletTransferParams(transferProps));
    this.props.navigation.navigate('Transaction', {key:this.props.navigation.state.key,
      onGoBack: () => {
        this.flatListRef.current.scrollToOffset(0);
        
        this.getRecoder(true);
        // 刷新首页list
        NetworkManager.loadTokenList();
      },
    });
  };

  didTapShowQrCodeButton = () => {
    Analytics.recordClick('TransactionRecoder', 'receipt');
    this.props.navigation.navigate('ReceiptCode');
  };

  async didTapTransactionCell(item) {
    this._showLoading();
    Analytics.recordClick('TransactionRecoder', 'transactionCell');
    try {
      const { symbol } = store.getState().Core.balance;
      const { wallet } = store.getState().Core;
      const recoder = item;
      const currentBlock = await NetworkManager.getCurrentBlockNumber();
      this._hideLoading();
      // "0"--已确认 "1"--错误  "2"--确认中
      let state = recoder.isError;

      if (state == 0) {
        const sureBlock = currentBlock - recoder.blockNumber;
        if (sureBlock < 12) {
          state = 2;
        }
      }

      let fromAddress= ''
      let toAddress = ''
      if(wallet.type === 'itc'){
        fromAddress = recoder.from.indexOf('ITC')>-1?recoder.from:('ITC'+recoder.from).replace('0x','')
        toAddress = recoder.to.indexOf('ITC')>-1?recoder.to:('ITC'+recoder.to).replace('0x','')
      }else {
        fromAddress = recoder.from
        toAddress = recoder.to
      }
      const transactionDetail = {
        // amount: parseFloat(recoder.value),
        // amount: Number(parseFloat(recoder.value).toFixed(8)),
        amount: item.amount,
        transactionType: symbol,
        fromAddress: fromAddress,
        toAddress: toAddress,
        txFee: recoder.txFee,
        remark: I18n.t('transaction.no'),
        transactionHash: recoder.hash,
        blockNumber: recoder.blockNumber,
        transactionTime: `${item.time} +0800`,
        tranStatus: state,
        name: item.name,
      };
      store.dispatch(setTransactionDetailParams(transactionDetail));
      this.props.navigation.navigate('TransactionDetail');
    } catch (err) {
      this._hideLoading();
    } finally {
      this._hideLoading();
    }
  }

  renderItem = item => (
    <Cell item={item} onPress={() => this.didTapTransactionCell(item.item)} key={item.item} />
  );

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  _initData = async () => {
    try {
      const isGetTRFromStore = await this.loadStoreTransactionRecoder(); // 从store获取
      if (!isGetTRFromStore) {

        this.showLoading();
        await this.getRecoder(true); // 从远端获取
        this.hideLoading();

      }
    } catch (err) {
      this.hideLoading();
    }
    this.getInfo();

    timer = setInterval(() => {
      this.getRecoder(true)
      this.refreshBlockHeight();
    }, 5 * 1000);
  };

  refreshBlockHeight = async ()=>{

    const { wallet } = store.getState().Core;

    const currentBlock = await NetworkManager.getCurrentBlockNumber();

    const lastTransaction = store.getState().Core.newTransaction;

    let recoder = []

    let key = `${wallet.address}_${wallet.type}_${this.symbol}`
    if (lastTransaction && Object.keys(lastTransaction).indexOf(key) != -1) {

      let tx = lastTransaction[key]

      let didContainNewTransaction = false;
      for (let i = 0; i < this.totalRecoder.length; i++) {

        const recoder = this.totalRecoder[i];

        if (tx.hash.toLowerCase() === recoder.hash.toLowerCase()) {
          store.dispatch(setNewTransaction(null));
          didContainNewTransaction = true;
          break;
        }
      }

      //判断地址一致、判断钱包交易网络类型一致、判断交易token一致，并且交易列表中不包含该交易，则插入最新的交易
      if (didContainNewTransaction === false) {

        tx.blockNumber = currentBlock;
        recoder.push(tx)

      }
    }

    recoder = recoder.concat(this.totalRecoder)

    this.totalItemList = await this.refreshItemList(recoder, this.symbol, currentBlock);

    await this.refreshPage(this.totalItemList, false);
    await this.saveStorageTransactionRecoder(this.totalItemList, this.symbol);
  }

  async getInfo() {

    const { wallet } = store.getState().Core;

    this.suggestGas = await NetworkManager.getSuggestGasPrice(wallet);
    this.ethBalance =
      wallet.type === 'itc'
        ? await NetworkManager.iotcGetBalance(wallet,{symbol:'ITG'})
        : await NetworkManager.getEthBalance(wallet.address);
  }

  showLoading() {
    this._showLoading(() => {
      if (this.state.showNoData) {
        this.setState({
          showNoData: false,
        });
      }
    });
  }

  async hideLoading(hided) {
    await this._hideLoading(hided);
    if (this.state.itemList.length === [] && !this.state.showNoData && this._isMounted) {
      this.setState({
        showNoData: true,
      });
    }
  }

  static getIconImage(symbol) {
    let imageSource = require('../../assets/transfer/naIcon.png');
    if (symbol === 'ETH' || symbol === 'ITC' || symbol === 'MANA' || symbol === 'DPY' || symbol === 'USDT') {
      imageSource = tokenIcon[symbol];
    }
    return imageSource;
  }

  _onBackPressed = () => {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
    return true;
  };

  _getLogo = (symbol, iconLarge) => {
    if (symbol === 'ITC') {
      return require('../../assets/home/ITC.png');
    }
    if (symbol === 'ITG') {
      return require('../../assets/home/ITG.png');
    }
    if (symbol === 'USDT') {
      return require('../../assets/transfer/usdtIcon.png');
    }
    if (iconLarge === '') {
      if (symbol === 'ETH') {
        return require('../../assets/home/ETH.png');
      }
      if (symbol === 'ITC') {
        return require('../../assets/home/ITC.png');
      }
    }
    return require('../../assets/home/null.png');
  };

  subStringNum = (a, num) => {

    if (a >0 && a < 0.0001) {
      a = 0;
    }

    a = a + "";
    var aArr = a.split(".");

    if (aArr.length > 1) {
      a = aArr[0] + "." + aArr[1].substr(0, num);
    }
    return a;
  }

  renderComponent = () => {
    const { price } = store.getState().Core.balance;
    let { amount } = store.getState().Core.balance;
    let value = parseFloat(amount) * parseFloat(price);
    value = Number(this.subStringNum(value,8));

    if (amount == null) {
      amount = 0;
      value = 0;
    }

    let bottomView = { height: 50 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      bottomView = { height: 58 };
    }

    let btnShadowStyle = {
      shadowColor: '#A9A9A9',
      shadowOffset: { width: 10, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    };

    if (Layout.DEVICE_IS_ANDROID()) {
      btnShadowStyle = {};
    }

    const space = Layout.TRANSFER_HEADER_MAX_HEIGHT - Layout.TRANSFER_HEADER_MIN_HEIGHT;

    const headerHeight = this.state.scroollY.interpolate({
      inputRange: [-Layout.WINDOW_HEIGHT + Layout.TRANSFER_HEADER_MAX_HEIGHT, 0, space],
      outputRange: [
        Layout.WINDOW_HEIGHT,
        Layout.TRANSFER_HEADER_MAX_HEIGHT,
        Layout.TRANSFER_HEADER_MIN_HEIGHT,
      ],
      extrapolate: 'clamp',
    });
    const headerZindex = this.state.scroollY.interpolate({
      inputRange: [0, space],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const headerTextOpacity = this.state.scroollY.interpolate({
      inputRange: [space - Layout.NAVIGATION_HEIGHT() - 30, space],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const titleTextOpacity = this.state.scroollY.interpolate({
      inputRange: [space - Layout.NAVIGATION_HEIGHT() - 50, space],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const pr = this.state.balance * this.state.price;

    // 价格
    const sign = store.getState().Core.monetaryUnit.symbol;
    const priceStr = Number.isNaN(pr) || pr === 0 ? '--' : `≈${sign}${this.subStringNum(pr,2)}`;
    // const TouchView = Animated.createAnimatedComponent(TouchableOpacity);

    const iconUri = this.state.icon;
    const icon = this._getLogo(this.symbol, iconUri);
    const { itemList } = this.state;
    return (
      <View style={styles.container}>
        <StatusBarComponent barStyle="light-content" />
        {/* <BackWhiteButton style={{position: 'absolute',left:20,top:10}} onPress={() => {this.props.navigation.goBack()}}/> */}
        <NavHeader navigation={this.props.navigation} color="transparent" />
        {/*<TouchableOpacity*/}
          {/*style={styles.backImage}*/}
          {/*onPress={() => {*/}
            {/*this.props.navigation.state.params.callback();*/}
            {/*this.props.navigation.goBack();*/}
          {/*}}*/}
        {/*>*/}
          {/*<Image*/}
            {/*style={{ marginTop: 0 }}*/}
            {/*source={require('../../assets/common/common_back_white2.png')}*/}
            {/*resizeMode="center"*/}
          {/*/>*/}
        {/*</TouchableOpacity>*/}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // backgroundColor: 'lightskyblue',
            height: headerHeight,
            zIndex: headerZindex,
          }}
        >
          <Image
            style={{ flex: 1, width: Layout.WINDOW_WIDTH }}
            source={require('../../assets/home/top_bg.png')}
          />
          <Animated.Text
            style={{
              position: 'absolute',
              left: 50,
              width: 100,
              height: 30,
              top: Layout.NAVIGATION_HEIGHT() - 32,
              color: 'white',
              opacity: titleTextOpacity,
              fontSize: 18,
              textAlign: 'left',
              fontWeight: '500',
            }}
          >
            {this.symbol}
          </Animated.Text>
          <Animated.Text
            style={{
              position: 'absolute',
              right: 20,
              width: 200,
              height: 30,
              top: Layout.NAVIGATION_HEIGHT() - 32,
              color: 'white',
              opacity: titleTextOpacity,
              fontSize: 18,
              textAlign: 'right',
              fontWeight: '500',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.01}
          >
            {amount}
          </Animated.Text>
          <Animated.Image
            style={{
              position: 'absolute',
              left: 20,
              bottom: 60,
              width: 36,
              height: 36,
              opacity: headerTextOpacity,
              borderRadius: 18,
              backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent',
            }}
            source={
              iconUri === '' || this.state.loadIconError === true || this.symbol === 'ITC' || this.symbol === 'USDT'
                ? icon
                : { uri: iconUri }
            }
            resizeMode="contain"
            iosdefaultSource={require('../../assets/home/null.png')}
            onError={() => {
              if (this._isMounted) {
                this.setState({
                  loadIconError: true,
                });
              }
            }}
          />
          <Animated.Text
            style={{
              position: 'absolute',
              left: 60,
              height: 30,
              bottom: 55,
              color: 'white',
              opacity: headerTextOpacity,
              fontSize: 17,
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            {this.symbol}
          </Animated.Text>
          <Animated.Text
            style={{
              position: 'absolute',
              right: 20,
              // height:40,
              bottom: 58,
              width: Layout.WINDOW_WIDTH - 120,
              color: 'white',
              opacity: headerTextOpacity,
              fontSize: 38,
              textAlign: 'right',
              fontWeight: '600',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.01}
          >
            {this.state.balance}
          </Animated.Text>
          <Animated.Text
            style={{
              position: 'absolute',
              right: 20,
              height: 30,
              bottom: 32,
              color: 'white',
              opacity: headerTextOpacity,
              fontSize: 15,
              textAlign: 'right',
              fontWeight: '500',
            }}
          >
            {priceStr}
          </Animated.Text>
          <Text
            style={{
              position: 'absolute',
              left: 50,
              width: Layout.WINDOW_WIDTH - 45,
              height: 40,
              top: Layout.NAVIGATION_HEIGHT() - 32,
              color: 'transparent',
            }}
            onPress={() => {
              this.flatListRef.current.scrollToOffset(0);
            }}
          />
        </Animated.View>
        <FlatList
          style={[styles.flatList]}
          ListHeaderComponent={
            <Header
              balance={Number(this.subStringNum(parseFloat(amount),4))}
              value={value}
              style={{ height: headerHeight }}
            />
          }
          ListEmptyComponent={<EmptyComponent show={this.state.showNoData} />}
          data={itemList}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
              tintColor={Colors.whiteBackgroundColor}
            />
          }
          // getItemLayout={(data, index) => ({ length: 60, offset: (60 + 7) * index, index })}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          scrollEventThrottle={1}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroollY } } },
          ])}
          keyExtractor={(item, index) => index.toString()}
          ref={this.flatListRef}
          onEndReachedThreshold={1}
          onEndReached={this._onLoadMore}
        />
        <View style={[styles.bottomBtnView, bottomView, btnShadowStyle]}>
          <TouchableOpacity
            style={[styles.functionBtn, { height: bottomView.height }]}
            onPress={this.didTapTransactionButton}
          >
            <Text
              style={{
                color: Colors.fontBlueColor,
                textAlign: 'center',
                fontSize: 16,
              }}
            >
              {I18n.t('transaction.transfer')}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: bottomView.height - 10,
              backgroundColor: Colors.fontGrayColor,
            }}
          />
          <TouchableOpacity
            style={[styles.functionBtn, { height: bottomView.height }]}
            onPress={this.didTapShowQrCodeButton}
          >
            <Text
              style={{
                color: Colors.fontBlueColor,
                textAlign: 'center',
                fontSize: 16,
              }}
            >
              {I18n.t('transaction.receipt')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}


const mapDispatchToProps = dispatch => ({
  clearLastTransaction: () => dispatch(setNewTransaction(null))
});

export default connect(
  mapDispatchToProps,
)(TransactionRecoder)