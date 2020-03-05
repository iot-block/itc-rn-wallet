import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodash from 'lodash';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGrayColor,
  },

  itemHeaderBox: {
    width: Layout.WINDOW_WIDTH,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    marginTop: 12,
  },
  itemHeaderIcon: {
    width: 20,
    height: 20,
  },
  itemHeaderTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.fontBlackColor_43,
    marginLeft: 2,
  },
  itemHeaderTouchable: {
    height: 42,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  itemHeaderBtnTxt: {
    fontSize: 14,
    color: Colors.fontBlueColor,
  },

  itemBox: {
    height: 46,
    width: Layout.WINDOW_WIDTH,
  },
  itemTouchBox: {
    width: Layout.WINDOW_WIDTH,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
    backgroundColor: 'white',
  },
  itemContentView: {
    flex: 1,
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },
  itemAddress: {
    fontSize: 12,
    color: Colors.fontGrayColor_a,
  },
  itemNextIcon: {
    width: 8,
    height: 12,
  },
  itemLine: {
    width: Layout.WINDOW_WIDTH,
    height: 1,
    backgroundColor: Colors.bgGrayColor_ed,
  },
});

class WalletListScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      itcWallets: [],
      ethWallets: [],
    };
  }

  _initData = () => {
    this.refreshPage();
  };

  refreshPage() {
    const itcWallets = lodash.cloneDeep(this.props.itcWalletList);
    const ethWallets = lodash.cloneDeep(this.props.ethWalletList);
    this.setState({
      itcWallets,
      ethWallets,
    });
  }

  createEthOrItcWallet = walletType => {
    const params = {
      walletType,
      from: 2,
    };
    this.props.setCreateWalletParams(params);
    this.props.navigation.navigate('CreateWallet');
  };

  walletItemOnPress = wallet => {
    const _this = this;
    this.props.navigation.navigate('Set', {
      wallet,
      callback() {
        _this.refreshPage();
      },
    });
  };

  _changeWalletEmitter = () => {
    this.refreshPage();
  };

  renderComponent = () => {
    const _this = this;
    const itcWalletsView = [];

    const ethWalletsView = [];
    this.state.itcWallets.forEach(wallet => {
      itcWalletsView.push(
        <Item
          key={wallet.address}
          wallet={wallet}
          onItemPressed={() => _this.walletItemOnPress(wallet)}
        />
      );
    });

    this.state.ethWallets.forEach(wallet => {
      ethWalletsView.push(
        <Item
          key={wallet.address}
          wallet={wallet}
          onItemPressed={() => _this.walletItemOnPress(wallet)}
        />
      );
    });
    return (
      <View style={styles.container}>
        <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.set')} />
        <ScrollView style={{ marginBottom: 12 }} showsVerticalScrollIndicator={false}>
          <ItemHeader
            title={I18n.t('settings.eth_wallet')}
            icon={require('../../assets/set/eth_icon.png')}
            isShowButton={!(this.state.ethWallets.length >= 100)}
            btnText={I18n.t('settings.create_eth_wallet')}
            onItemHeaderPressed={() => this.createEthOrItcWallet('eth')}
          />
          {ethWalletsView}
          <ItemHeader
            title={I18n.t('settings.itc_wallet')}
            icon={require('../../assets/set/itc_icon.png')}
            isShowButton={!(this.state.itcWallets.length >= 100)}
            btnText={I18n.t('settings.create_itc_wallet')}
            onItemHeaderPressed={() => this.createEthOrItcWallet('itc')}
          />
          {itcWalletsView}
        </ScrollView>
      </View>
    );
  };
}

class ItemHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    btnText: PropTypes.string.isRequired,
    onItemHeaderPressed: PropTypes.func.isRequired,
    isShowButton: PropTypes.bool.isRequired,
  };

  static defaultProps = {};

  render() {
    const { icon, title, isShowButton, onItemHeaderPressed, btnText } = this.props;
    return (
      <View style={styles.itemHeaderBox}>
        <Image style={styles.itemHeaderIcon} source={icon} resizeMode="contain" />
        <Text style={styles.itemHeaderTitle}>{title}</Text>

        {isShowButton ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.itemHeaderTouchable}
            onPress={onItemHeaderPressed}
          >
            <Text style={styles.itemHeaderBtnTxt}>+{btnText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

class Item extends PureComponent {
  static propTypes = {
    onItemPressed: PropTypes.func.isRequired,
    wallet: PropTypes.object.isRequired,
    isNeedLine: PropTypes.bool,
    isDisabled: PropTypes.bool,
  };

  static defaultProps = {
    isNeedLine: true,
    isDisabled: false,
  };

  onItemPressed = () => {
    const { wallet, onItemPressed } = this.props;
    onItemPressed(wallet);
  };

  render() {
    const { wallet, onItemPressed, isDisabled, isNeedLine } = this.props;
    const address = wallet.type === 'itc'?"ITC"+`${wallet.address.substr(0, 8)}...${wallet.address.substr(34, 42)}`.replace('0x',''):`${wallet.address.substr(0, 8)}...${wallet.address.substr(34, 42)}`;
    return (
      <View style={styles.itemBox}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.itemTouchBox}
          onPress={onItemPressed}
          disabled={isDisabled}
        >
          <View style={styles.itemContentView}>
            <Text style={styles.itemName}>{wallet.name}</Text>
            <Text style={styles.itemAddress}>{address}</Text>
          </View>
          <Image
            style={styles.itemNextIcon}
            source={require('../../assets/set/next.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {isNeedLine ? <View style={styles.itemLine} /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ethWalletList: state.Core.ethWalletList,
  itcWalletList: state.Core.itcWalletList,
});
const mapDispatchToProps = dispatch => ({
  setItcWalletList: itcWalletList => dispatch(Actions.setItcWalletList(itcWalletList)),
  setEthWalletList: ethWalletList => dispatch(Actions.setEthWalletList(ethWalletList)),
  setCurrentWallet: wallet => dispatch(Actions.setCurrentWallet(wallet)),
  setCreateWalletParams: params => dispatch(Actions.setCreateWalletParams(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletListScreen);
