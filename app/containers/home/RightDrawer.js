import React, { PureComponent } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import { NavigationActions, DrawerActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';
import {
  setCurrentWallet,
  setCreateWalletParams,
  setTransactionRecordList,
  loadTokenBalance,
} from '../../config/action/Actions';
import store from '../../config/store/ConfigureStore';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import StorageManage from '../../utils/StorageManage';
import BaseComponent from '../base/BaseComponent';
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from '../../components/Loading';
import LayoutConstants from '../../config/LayoutConstants';
import { defaultTokens, defaultTokensOfITC } from '../../utils/Constants';

const styles = StyleSheet.create({
  blurStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: LayoutConstants.WINDOW_HEIGHT,
    zIndex: 1000,
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  addButtonBox: {
    width: 195,
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    // borderStyle:'dashed',
  },
  addButtonBg: {
    width: 195,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 12,
    height: 12,
    marginLeft: 20,
  },
  addButtonText: {
    lineHeight: 38,
    textAlign: 'center',
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
  },

  itemHeaderBox: {
    height: 40,
    marginTop: 20,
  },
  itemHeaderView: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 20,
  },
  itemHeaderIcon: {
    height: 20,
    width: 20,
  },
  itemHeaderText: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
    marginLeft: 10,
  },
  itemHeaderLine: {
    height: 1,
    backgroundColor: Colors.bgGrayColor,
  },
  itemBox: {
    height: 36,
  },
  itemTouchable: {
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  itemCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemGrayCircle: {
    backgroundColor: Colors.fontGrayColor,
  },
  itemBlueCircle: {
    backgroundColor: Colors.fontBlueColor,
  },
  itemText: {
    fontSize: 13,
    marginLeft: 15,
  },
  itemGrayText: {
    color: Colors.fontGrayColor_a1,
  },
  itemBlueText: {
    color: Colors.fontBlueColor,
  },
  itemLine: {
    height: 1,
    backgroundColor: Colors.bgGrayColor,
  },
});

class RightDrawer extends BaseComponent {
  navigateToScreen = (route, params) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params,
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this._barStyle = 'light-content';
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshPage: false,
    };
  }

  itcWalletOnPress = async wallet => {
    this.props.navigation.closeDrawer();
    this._barStyle = 'light-content';
    StorageManage.save(StorageKey.User, wallet);
    store.dispatch(setCurrentWallet(wallet));

    store.dispatch(setTransactionRecordList([]));
    StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo);
    store.dispatch(loadTokenBalance(defaultTokensOfITC));
    this.setState(prevState => ({
      refreshPage: !prevState.refreshPage,
    }));

    DeviceEventEmitter.emit('changeWallet', { openRightDrawer: false, isChangeWalletList: false });
  };

  ethWalletOnPress = async wallet => {
    this.props.navigation.closeDrawer();
    this._barStyle = 'light-content';
    StorageManage.save(StorageKey.User, wallet);
    store.dispatch(setCurrentWallet(wallet));

    store.dispatch(setTransactionRecordList([]));
    StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo);
    store.dispatch(loadTokenBalance(defaultTokens));
    this.setState(prevState => ({
      refreshPage: !prevState.refreshPage,
    }));

    DeviceEventEmitter.emit('changeWallet', { openRightDrawer: false, isChangeWalletList: false });
  };

  createEthOrItcWallet = walletType => {
    const params = {
      walletType,
      from: 1,
    };
    store.dispatch(setCreateWalletParams(params));
    this.props.navigation.navigate('CreateWallet');
  };

  render() {
    const { wallet, itcWalletList, ethWalletList } = store.getState().Core;
    const currentWallet = wallet;

    // 这个地方直接render，防止把其他页面的状态栏颜色改了
    const _this = this;
    if (this.props.navigation.state.isDrawerOpen) {
      this._barStyle = 'dark-content';
    } else {
      this._barStyle = 'light-content';
    }

    const itcWalletsView = [];

    const ethWalletsView = [];
    itcWalletList.forEach((itcWallet, index) => {
      const isSelected =
        itcWallet.address.toLowerCase() === currentWallet.address.toLowerCase() &&
        currentWallet.type === 'itc';
      const keyValue = `itc${index}`;
      itcWalletsView.push(
        <Item
          key={keyValue}
          wallet={itcWallet}
          isSelected={isSelected}
          itemOnPress={() => _this.itcWalletOnPress(itcWallet)}
        />
      );
    });

    ethWalletList.forEach((ethWallet, index) => {
      const isSelected =
        ethWallet.address.toLowerCase() === currentWallet.address.toLowerCase() &&
        currentWallet.type === 'eth';
      const keyValue = `eth${index}`;
      ethWalletsView.push(
        <Item
          key={keyValue}
          wallet={ethWallet}
          isSelected={isSelected}
          itemOnPress={() => _this.ethWalletOnPress(ethWallet)}
        />
      );
    });

    return (
      <SafeAreaView style={styles.container}>
        <StatusBarComponent barStyle={this._barStyle} />

        <ScrollView
          style={{height:LayoutConstants.WINDOW_HEIGHT - 20}}
          // showsVerticalScrollIndicator={false}
        >
          <ItemHeader
            icon={require('../../assets/set/eth_icon.png')}
            text={I18n.t('settings.eth_wallet')}
          />
          {ethWalletsView}
          {ethWalletList.length >= 100 ? null : (
            <View>
              <AddButton
                text={I18n.t('settings.create_eth_wallet')}
                addOnPress={() => this.createEthOrItcWallet('eth')}
              />
              <View style={{height:20}}></View>
            </View>
          )}
          <ItemHeader
            icon={require('../../assets/set/itc_icon.png')}
            text={I18n.t('settings.itc_wallet')}
          />
          {itcWalletsView}
          {itcWalletList.length >= 100 ? null : (
            <AddButton
              text={I18n.t('settings.create_itc_wallet')}
              addOnPress={() => this.createEthOrItcWallet('itc')}
            />
          )}
        </ScrollView>
        {Platform.OS === 'ios' && this.state.showBlur && (
          <BlurView style={styles.blurStyle} blurType="light" blurAmount={10} />
        )}
        {this.state.isShowLoading === undefined ? null : (
          <Loading visible={this.state.isShowLoading} />
        )}
      </SafeAreaView>
    );
  }
}

class Item extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    itemOnPress: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    isNeedLine: PropTypes.bool,
    itemStyle: PropTypes.object,
  };

  static defaultProps = {
    isSelected: false,
    isNeedLine: false,
  };

  render() {
    const { wallet, isSelected, itemStyle, isNeedLine, itemOnPress } = this.props;
    return (
      <View style={[styles.itemBox, itemStyle]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.itemTouchable}
          onPress={itemOnPress}
          disabled={isSelected}
        >
          <View
            style={[styles.itemCircle, isSelected ? styles.itemBlueCircle : styles.itemGrayCircle]}
          />
          <Text
            style={[styles.itemText, isSelected ? styles.itemBlueText : styles.itemGrayText]}
            numberOfLines={1}
          >
            {wallet.name}
          </Text>
        </TouchableOpacity>

        {isNeedLine ? <View style={styles.itemLine} /> : null}
      </View>
    );
  }
}

class ItemHeader extends PureComponent {
  static propTypes = {
    icon: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { icon, text } = this.props;
    return (
      <View style={styles.itemHeaderBox}>
        <View activeOpacity={0.6} style={styles.itemHeaderView}>
          <Image style={styles.itemHeaderIcon} source={icon} resizeMode="contain" />
          <Text style={styles.itemHeaderText} numberOfLines={1}>
            {text}
          </Text>
        </View>
        <View style={styles.itemHeaderLine} />
      </View>
    );
  }
}

class AddButton extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    addOnPress: PropTypes.func.isRequired,
  };

  render() {
    const { addOnPress, text } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.addButtonBox} onPress={addOnPress}>
        <ImageBackground
          style={styles.addButtonBg}
          source={require('../../assets/common/add_bg.png')}
          resizeMode="contain"
        >
          <Image
            style={styles.addIcon}
            source={require('../../assets/common/add_icon.png')}
            resizeMode="contain"
          />
          <Text style={styles.addButtonText} numberOfLines={1}>
            {text}
          </Text>
        </ImageBackground>
        {/* <Image style={styles.addImage} source={addBg} resizeMode={'center'} /> */}
      </TouchableOpacity>
    );
  }
}

RightDrawer.prototypes = {
  navigation: PropTypes.object,
};

export default RightDrawer;
