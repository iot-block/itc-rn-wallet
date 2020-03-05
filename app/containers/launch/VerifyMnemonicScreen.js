import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Vibration,
  TouchableOpacity,
  DeviceEventEmitter,
  Platform
} from 'react-native';
import keythereum from 'keythereum';
import HDWallet from 'react-native-hdwallet';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import bip39 from 'react-native-hdwallet/src/utils/bip39';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Toast from 'react-native-root-toast';
import KeystoreUtils from '../../utils/KeystoreUtils';
import StorageManage from '../../utils/StorageManage';
import * as Actions from '../../config/action/Actions';
import { upsetArrayOrder } from './Common';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader';
import { showToast } from '../../utils/Toast';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import StaticLoading from '../../components/StaticLoading';
import BaseComponent from '../base/BaseComponent';
import { defaultTokens, defaultTokensOfITC } from '../../utils/Constants';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH * 0.8,
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 20,
    // alignItems:'stretch',
  },
  icon: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  titleTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.fontBlueColor,
    marginBottom: 20,
  },
  contentTxt: {
    fontSize: FontSize.ContentSize,
    color: Colors.fontGrayColor_a0,
    textAlign: 'center',
    width: Layout.WINDOW_WIDTH * 0.8,
  },

  scrollViewStyle: {
    flexDirection: 'row',
    marginTop: 40,
    width: Layout.WINDOW_WIDTH,
    height: 220,
  },
  itemBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH,
    height: 220,
    alignItems: 'center',
  },
  itemLeftRightView: {
    width: 25,
    height: 180,
  },
  itemLeftView: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  itemRightView: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  itemView: {
    flex: 1,
    height: 220,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: Colors.bg_blue_77,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    marginBottom: 40,
  },
  itemTextView: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
    flex:1,
  },
  itemNumberText: {
    fontWeight: '600',
    fontSize: 26,
    color: 'white',
    alignItems: 'flex-end',
    fontFamily:  Platform.OS === 'android'?'system font':null
  },

  itemSerialNumText: {
    fontWeight: '600',
    fontSize: 26,
    color: 'white',
    fontFamily:  Platform.OS === 'android'?'system font':null
  },
  itemSerialTotalNumText: {
    fontWeight: '600',
    fontSize: 15,
    color: 'white',
    marginBottom: 2,
    fontFamily:  Platform.OS === 'android'?'system font':null
  },
  itemRow: {
    flexDirection: 'row',
  },
  itemBtnStyle1: {
    marginRight: 10,
  },
  itemBtnStyle2: {
    marginLeft: 10,
  },
  itemBtnStyle3: {
    marginTop: 15,
    marginRight: 10,
  },
  itemBtnStyle4: {
    marginTop: 15,
    marginLeft: 10,
  },

  itemBtnBox: {
    flex: 1,
    height: 40,
    borderRadius: 20,
  },

  itemBtnText: {
    height: 40,
    lineHeight: 40,
    color: Colors.fontDarkGrayColor,
    fontSize: 15,
    textAlign: 'center',
  },
});

class VerifyMnemonicScreen extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      randomSectionMnemonics: [], // 4个单词匹配的四组单词
      numberArray: [],
      checkedNums: [],
      isShowSLoading: false,
      sLoadingContent: '',
    };

    this.from = 0; // 0.第一次创建   1.从侧滑点击进入   2.从钱包工具点击进入 3.从映射（绑定钱包地址）进入  4.ITC映射服务页面进入
    this.walletType = 'eth';
    this.password = '';
    this.name = '';
    this.mnemonics = [];
    this.sectionMnemonics = []; // 需要验证的4个单词
    this.matchCorrectNum = 0; // 已经验证正确的单词的个数
    this.wordList = [];
    this.scrollToX = 0;

    this.timeInterval = null;
    this.timeIntervalCount = 0;
  }

  _initData = () => {
    const params = this.props.createWalletParams;
    if (params) {
      this.walletType = params.walletType;
      this.from = params.from;
      this.password = params.password;
      this.name = params.name;
    }

    this.mnemonics = this.props.mnemonic.split(' ');
    // console.log('L_mnemonics', this.mnemonics);
    this.initAllData();
  };

  initAllData() {
    this.scrollToX = 0;
    this.sectionMnemonics = upsetArrayOrder(this.props.mnemonic.split(' ')).splice(0, 4);
    this.wordList = bip39.wordlists.english;
    this.matchCorrectNum = 0;
    this.getRandomArray();
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
  }

  getRandomArray() {
    const randomSectionMnemonics = [];
    const numberArray = [];
    const wordListLength = this.wordList.length;
    for (let i = 0; i < this.sectionMnemonics.length; i++) {
      const arr = [];
      const word = this.sectionMnemonics[i].toLowerCase();
      arr.push(word);
      do {
        const l = Math.floor(Math.random() * (1 - wordListLength) + wordListLength); // 获取1-wordListLength的随机数
        const w = this.wordList[l - 1].toLowerCase();
        let isExist = false;
        for (let j = 0; j < arr.length; j++) {
          if (w === arr[j].toLowerCase()) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          arr.push(w);
        }
      } while (arr.length < 3);

      do {
        const u = Math.floor(Math.random() * (1 - 12) + 12); // 获取1-12的随机数
        const w = upsetArrayOrder(this.props.mnemonic.split(' '))[u - 1].toLowerCase();
        let isExist = false;
        for (let j = 0; j < arr.length; j++) {
          if (w === arr[j].toLowerCase()) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          arr.push(w);
        }
      } while (arr.length < 4);

      const usm = upsetArrayOrder(arr);
      const n = this.mnemonics.indexOf(word) + 1;

      randomSectionMnemonics.push(usm);
      numberArray.push(`#${n}`);
    }

    this.setState({
      checkedNums: [-1, -1, -1, -1],
      randomSectionMnemonics, // 4个单词匹配的四组单词
      numberArray,
    });
  }

  _onPressItem = (text, num) => {
    const word = this.sectionMnemonics[num].toLowerCase();
    const checkedNumIndex = this.state.randomSectionMnemonics[num].indexOf(text);
    const checkedNumArray = this.state.checkedNums;
    const checkedNums = lodash.cloneDeep(checkedNumArray);
    checkedNums[num] = checkedNumIndex;

    /* this.setState(Object.assign({}, this.state, {
            checkedNums : checkedNums
        })); */
    this.setState({
      checkedNums,
    });

    if (text.toLowerCase() === word) {
      this.matchCorrectNum = this.matchCorrectNum + 1;
      // Vibration.vibrate([0, 20], false)
      if (this.matchCorrectNum < 4) {
        // 滑动到下一块
        this.scrollToX = this.scrollToX + Layout.WINDOW_WIDTH;
        this.scroll.scrollTo({ x: this.scrollToX, y: 0, animated: true });
      } else {
        // showToast(I18n.t('launch.modal_mnemonic_success'))
        // 验证成功，开始创建钱包
        this.timeIntervalCount = 0;
        this.timeInterval = setInterval(() => {
          this.timeIntervalCount = this.timeIntervalCount + 1;
          this.changeLoading(this.timeIntervalCount);
        }, 500);
      }
    } else {
      // 验证失败
      Vibration.vibrate();
      showToast(I18n.t('launch.toast_verify_mnemonic_fail'), Toast.positions.TOP + 10);

      this.initAllData();
    }
  };

  changeLoading(num) {
    let content = '';
    if (num === 1) {
      content = I18n.t('launch.start_create_wallet');
    } else if (num === 2) {
      content = I18n.t('launch.generating_key_pairs');
    } else {
      content = I18n.t('launch.generating_keystore_file');
    }
    this.setState(
      {
        isShowSLoading: true,
        sLoadingContent: content,
      },
      () => {
        if (num === 3) {
          clearInterval(this.timeInterval);
          this.startCreateEthWallet();
        }
      }
    );
    /* if (num === 3) {
      clearInterval(this.timeInterval);
      setTimeout(() => {
        this.startCreateEthWallet();
      }, 0);
    } */
  }

  async startCreateEthWallet() {
    try {
      const m = this.props.mnemonic; // 助记词
      const seed = walletUtils.mnemonicToSeed(m);
      // const seedHex = seed.toString('hex');
      const hdwallet = HDWallet.fromMasterSeed(seed);
      const derivePath = "m/44'/60'/0'/0/0";
      hdwallet.setDerivePath(derivePath);
      const privateKey = hdwallet.getPrivateKey();
      const checksumAddress = hdwallet.getChecksumAddressString();

      const params = { keyBytes: 32, ivBytes: 16 };
      const dk = keythereum.create(params);
      const keyObject = await KeystoreUtils.dump(this.password, privateKey, dk.salt, dk.iv);
      await KeystoreUtils.exportToFile(keyObject, this.walletType, 'keystore');
      // var str = await KeystoreUtils.importFromFile(keyObject.address)
      // var newKeyObject = JSON.parse(str)

      const wallet = {
        name: this.name,
        address: checksumAddress,
        extra: '',
        type: this.walletType, // 钱包类型
      };
      let wallets = [];
      if (this.from === 1 || this.from === 2 || this.from === 4) {
        let preWalletList = [];
        if (this.walletType === 'itc') {
          preWalletList = await StorageManage.load(StorageKey.ItcWalletList);
        } else {
          preWalletList = await StorageManage.load(StorageKey.EthWalletList);
        }

        if (!preWalletList) {
          preWalletList = [];
        }
        wallets = preWalletList.concat(wallet);
      } else {
        wallets.push(wallet);
        this.props.setIsNewWallet(true);
      }

      if (this.walletType === 'itc') {
        StorageManage.save(StorageKey.ItcWalletList, wallets);
        this.props.setItcWalletList(wallets);
      } else {
        StorageManage.save(StorageKey.EthWalletList, wallets);
        this.props.setEthWalletList(wallets);
      }

      StorageManage.save(StorageKey.User, wallet);
      this.props.setCurrentWallet(wallet);

      // 页面跳转
      this.routeTo();
    } catch (err) {
      this.setState({
        isShowSLoading: false,
      });

      showToast(I18n.t('toast.create_wallet_error'), Toast.positions.TOP + 10);
      this.initAllData();
      Analytics.recordErr('startCreateEthWalletCatchErr', err);
    }
  }

  routeTo() {
    if (this.walletType === 'itc') {
      this.props.loadTokenBalance(defaultTokensOfITC);
    } else {
      this.props.loadTokenBalance(defaultTokens);
    }
    if (this.from === 1 || this.from === 2 || this.from === 4 || this.from === 7) {
      this.props.setTransactionRecordList([]);
      StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo);

      DeviceEventEmitter.emit('changeWallet', { openRightDrawer: false, isChangeWalletList: true });
    }
    this.setState(
      {
        isShowSLoading: false,
      },
      () => {
        if (this.from === 1) {
          this.props.navigation.navigate('Home');
          // this.props.navigation.openDrawer()
        } else if (this.from === 2) {
          this.props.navigation.navigate('WalletList');
        } else if (this.from === 4) {
          // ITC映射服务页面进入
          this.props.navigation.popToTop();
        }else {
          this.props.navigation.navigate('Home');
        }
      }
    );
  }

  _onBackPressed = () => {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
    return true;
  };

  backPressed() {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
  }

  _closeModal() {
    this.setState({
      isShowSLoading: false,
    });
  }

  renderComponent = () => {
    const { numberArray, randomSectionMnemonics, checkedNums } = this.state;

    return (
      <View style={styles.container}>
        <WhiteBgNoTitleHeader
          navigation={this.props.navigation}
          onPress={() => this.backPressed()}
        />
        <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        <View style={styles.contentContainer}>
          <Image
            style={styles.icon}
            source={require('../../assets/launch/confirmWordIcon.png')}
            resizeMode="contain"
          />
          <Text style={styles.titleTxt}>{I18n.t('launch.confirm_mnemonic')}</Text>
          <Text style={styles.contentTxt}>{I18n.t('launch.confirm_mnemonic_prompt')}</Text>

          <ScrollView
            ref={scroll => {
              this.scroll = scroll;
            }}
            style={styles.scrollViewStyle}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            <Item
              number={numberArray[0]}
              serialNum={1}
              randomMnemonics={randomSectionMnemonics[0]}
              onPressItem={this._onPressItem}
              checkedNum={checkedNums[0]}
              isShowLeftView={false}
            />
            <Item
              number={numberArray[1]}
              serialNum={2}
              randomMnemonics={randomSectionMnemonics[1]}
              onPressItem={this._onPressItem}
              checkedNum={checkedNums[1]}
            />
            <Item
              number={numberArray[2]}
              serialNum={3}
              randomMnemonics={randomSectionMnemonics[2]}
              onPressItem={this._onPressItem}
              checkedNum={checkedNums[2]}
            />
            <Item
              number={numberArray[3]}
              serialNum={4}
              randomMnemonics={randomSectionMnemonics[3]}
              onPressItem={this._onPressItem}
              checkedNum={checkedNums[3]}
              isShowRightView={false}
            />
          </ScrollView>
        </View>
      </View>
    );
  };
}

class Item extends PureComponent {
  static propTypes = {
    number: PropTypes.string.isRequired,
    serialNum: PropTypes.number.isRequired,
    randomMnemonics: PropTypes.array.isRequired,
    checkedNum: PropTypes.number.isRequired,
    isShowLeftView: PropTypes.bool,
    isShowRightView: PropTypes.bool,
  };

  static defaultProps = {
    isShowLeftView: true,
    isShowRightView: true,
    randomMnemonics: ['', '', '', ''],
    serialNum: 1,
    number: '#0',
    checkedNum: -1,
  };

  _onPress = text => {
    const { onPressItem, serialNum } = this.props;
    onPressItem(text, serialNum - 1);
  };

  render() {
    const {
      isShowLeftView,
      isShowRightView,
      randomMnemonics,
      checkedNum,
      number,
      serialNum,
    } = this.props;

    return (
      <View style={styles.itemBox}>
        <View
          style={[
            styles.itemLeftRightView,
            styles.itemLeftView,
            { backgroundColor: isShowLeftView ? Colors.bg_blue_e9 : 'white' },
          ]}
        />

        <View style={styles.itemView}>

          <View style={styles.itemTitle}>

            <View style={styles.itemTextView}>
              <Text style={styles.itemNumberText}>{number}</Text>
            </View>

            <View style={[styles.itemTextView,{justifyContent: 'flex-end'}]}>
              <Text style={styles.itemSerialNumText}>{serialNum}</Text>
              <Text style={styles.itemSerialTotalNumText}>/4</Text>
            </View>

          </View>


          <View style={styles.itemRow}>
            <ItemButtom
              itemBtnStyle={styles.itemBtnStyle1}
              text={randomMnemonics[0]}
              onPressItem={this._onPress}
              isChecked={checkedNum === 0}
            />
            <ItemButtom
              itemBtnStyle={styles.itemBtnStyle2}
              text={randomMnemonics[1]}
              onPressItem={this._onPress}
              isChecked={checkedNum === 1}
            />
          </View>
          <View style={styles.itemRow}>
            <ItemButtom
              itemBtnStyle={styles.itemBtnStyle3}
              text={randomMnemonics[2]}
              onPressItem={this._onPress}
              isChecked={checkedNum === 2}
            />
            <ItemButtom
              itemBtnStyle={styles.itemBtnStyle4}
              text={randomMnemonics[3]}
              onPressItem={this._onPress}
              isChecked={checkedNum === 3}
            />
          </View>
        </View>

        <View
          style={[
            styles.itemLeftRightView,
            styles.itemRightView,
            { backgroundColor: isShowRightView ? Colors.bg_blue_e9 : 'white' },
          ]}
        />
      </View>
    );
  }
}

class ItemButtom extends PureComponent {
  static defaultProps = {
    isChecked: false,
  };

  _onPress = () => {
    const { text, onPressItem } = this.props;
    onPressItem(text);
  };

  render() {
    const { isChecked, text, itemBtnStyle } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.itemBtnBox,
          { backgroundColor: isChecked ? Colors.bg_blue_55 : 'white' },
          itemBtnStyle,
        ]}
        activeOpacity={0.6}
        onPress={this._onPress}
      >
        <Text style={[styles.itemBtnText, { color: isChecked ? 'white' : Colors.fontBlueColor }]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.Core.mnemonic,
  ethWalletList: state.Core.ethWalletList,
  createWalletParams: state.Core.createWalletParams,
});
const mapDispatchToProps = dispatch => ({
  setIsNewWallet: isNewWallet => dispatch(Actions.setIsNewWallet(isNewWallet)),

  setItcWalletList: itcWalletList => dispatch(Actions.setItcWalletList(itcWalletList)),
  setEthWalletList: ethWalletList => dispatch(Actions.setEthWalletList(ethWalletList)),
  setCurrentWallet: wallet => dispatch(Actions.setCurrentWallet(wallet)),
  setCreateWalletParams: params => dispatch(Actions.setCreateWalletParams(params)),
  setTransactionRecordList: records => dispatch(Actions.setTransactionRecordList(records)),
  loadTokenBalance: tokens => dispatch(Actions.loadTokenBalance(tokens)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyMnemonicScreen);
