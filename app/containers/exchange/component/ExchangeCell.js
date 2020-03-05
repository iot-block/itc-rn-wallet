import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 21,
  },
  leftTextViews: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 200,
  },
  rightView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 21,
  },
  separator: {
    flex: 1,
    backgroundColor: 'rgb(247,248,249)',
    height: 1,
    marginHorizontal: 10,
  },
  icon: {
    width: 26,
    height: 26,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  emptyView: {
    flex: 1,
    height: LayoutConstants.WINDOW_HEIGHT - LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWaleetView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ExchangeEmptyComponent extends Component {
  render() {
    return (
      <View style={styles.emptyView}>
        <Text style={{ fontSize: 18, color: Colors.bgGrayColor_e5 }}>
          {I18n.t('exchange.no_exchange_history')}
        </Text>
      </View>
    );
  }
}

class ExchangeWalletEmptyComponent extends Component {
  render() {
    const { onEmptyCreatWallet } = this.props;
    return (
      <View style={styles.emptyWaleetView}>
        <TouchableOpacity onPress={onEmptyCreatWallet}>
          <Text style={{ fontSize: 16, color: Colors.themeColor }}>
            {I18n.t('exchange.creat_import_eth_wallet')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ExchangeModalCoinSelectCell extends Component {
  render() {
    const { item, onClick } = this.props;
    const { symbol, coinIcon, isSelect, balance } = item.item || {};
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Image style={styles.icon} source={coinIcon} resizeMode="contain" />
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 15, color: Colors.themeColor }}>{symbol}</Text>
              <Text style={{ fontSize: 13, color: Colors.fontDarkGrayColor }}>
                {`${I18n.t('exchange.balance')} ${balance} ${symbol}`}
              </Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Image
              style={{ width: 18, height: 18 }}
              source={
                isSelect
                  ? require('../../../assets/exchange/select_icon.png')
                  : require('../../../assets/exchange/unselect_icon.png')
              }
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class ExchangeModalWalletSelectCell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {};

  render() {
    const { item, onClick } = this.props;
    const { name, address, isSelect } = item.item || {};
    const addressSub = `${address.substr(0, 8)}...${address.substr(34, 42)}`;
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 15, color: Colors.themeColor }}>{name}</Text>
              <Text style={{ fontSize: 13, color: Colors.fontDarkGrayColor }}>{addressSub}</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Image
              style={{ width: 18, height: 18 }}
              source={
                isSelect
                  ? require('../../../assets/exchange/select_icon.png')
                  : require('../../../assets/exchange/unselect_icon.png')
              }
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class ExchangeCell extends Component {
  _getLogo = symbol => {
    switch (symbol) {
      case 'ETH':
        return require('../../../assets/home/ETH.png');
      case 'ITC':
        return require('../../../assets/home/ITC.png');
      case 'BIX':
        return require('../../../assets/exchange/bix_icon.png');
      case 'SWFTC':
        return require('../../../assets/exchange/swftc_icon.png');
      case 'HT':
        return require('../../../assets/exchange/ht_icon.png');
      default:
        return require('../../../assets/home/null.png');
    }
  };

  _getStatusTitle = state => {
    switch (state) {
      case 'not_complete':
        return I18n.t('exchange.unfinished');
      case 'exchange':
        return I18n.t('exchange.exchanging');
      case 'trade_fail':
        return I18n.t('exchange.exchange_failed');
      case 'timeout':
        return I18n.t('exchange.time_out');
      case 'complete':
        return I18n.t('exchange.completed');
      default:
        return 'unknow';
    }
  };

  render() {
    const { item, onClick } = this.props;
    const { fromCoinAmt, beginDate, fromCoinCode, toCoinAmt, toCoinCode, tradeState } =
      item.item || {};
    const icon = this._getLogo(fromCoinCode);
    const statusTitle = this._getStatusTitle(tradeState);
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Image
              style={styles.icon}
              source={icon}
              resizeMode="contain"
              iosdefaultSource={require('../../../assets/home/null.png')}
            />
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 14, color: 'black' }} numberOfLines={1}>
                {`${fromCoinAmt} ${fromCoinCode} → ${toCoinAmt} ${toCoinCode}`}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.fontDarkGrayColor }}>{beginDate}</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Text style={{ fontSize: 13, color: Colors.fontGrayColor_a }}>{statusTitle}</Text>
            <Image
              resizeMode="contain"
              style={{ width: 9, height: 15, marginLeft: 10 }}
              source={require('../../../assets/exchange/back_g.png')}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export {
  ExchangeCell,
  ExchangeModalCoinSelectCell,
  ExchangeEmptyComponent,
  ExchangeModalWalletSelectCell,
  ExchangeWalletEmptyComponent,
};
