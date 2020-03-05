import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
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
  rightView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    borderRadius: 15,
  },
  emptyView: {
    flex: 1,
    height: LayoutConstants.WINDOW_HEIGHT - LayoutConstants.HOME_HEADER_CONTENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ItemDivideComponent extends Component {
  render() {
    return <View style={styles.separator} />;
  }
}

class EmptyComponent extends Component {
  render() {
    return (
      <View style={styles.emptyView}>
        <Text style={{ fontSize: 20 }}>{I18n.t('home.no_assets')}</Text>
      </View>
    );
  }
}

class HomeCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadIconError: false,
    };
  }

  static propTypes = {
    monetaryUnitSymbol: PropTypes.string.isRequired,
  };

  _getLogo = (symbol, iconLarge) => {
    
    if (symbol.toLocaleUpperCase() == 'ITC') {
      return require('../../../assets/home/ITC.png');
    }
    if (symbol.toLocaleUpperCase() == 'ITG') {
      return require('../../../assets/home/ITG.png');
    }
    if (symbol.toLocaleUpperCase() == 'USDT') {
      return require('../../../assets/home/USDT.png');
    }
    if (iconLarge === '') {
      if (symbol === 'ETH') {
        return require('../../../assets/home/ETH.png');
      }
    }
    return require('../../../assets/home/null.png');
  };

  render() {
    const { item, onClick, monetaryUnitSymbol } = this.props;
    const { symbol, balance, price, isTotalAssetsHidden, iconLarge } = item.item || {};
    const { loadIconError } = this.state;
    const icon = this._getLogo(symbol, iconLarge);
    let balanceText =
      Number.isNaN(balance) || balance === 0 || balance === '0.0000' ? '0.00' : balance;
    let balancePriText =
      Number.isNaN(balance * price) || balance * price === 0
        ? '--'
        : `≈${monetaryUnitSymbol}${(balance * price).toFixed(2)}`;
    if (isTotalAssetsHidden) {
      balanceText = '****';
      balancePriText = '--';
    }
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            {/* <Image style={styles.icon}
                            source={imageSource}
                         ></Image> */}
            <Image
              style={styles.icon}
              source={
                iconLarge === '' || loadIconError === true || symbol === 'ITC' || symbol === 'USDT'
                  ? icon
                  : { uri: iconLarge }
              }
              resizeMode="contain"
              iosdefaultSource={require('../../../assets/home/null.png')}
              onError={() => {
                this.setState({
                  loadIconError: true,
                });
              }}
            />
            <Text style={{ fontSize: 15, color: Colors.fontBlackColor_43, fontWeight: '500' }}>
              {symbol}
            </Text>
          </View>
          <View style={styles.rightView}>
            <Text style={{ fontSize: 15, color: Colors.themeColor }}>{balanceText}</Text>
            <Text style={{ fontSize: 13, color: Colors.fontDarkGrayColor }}>{balancePriText}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export { ItemDivideComponent, HomeCell, EmptyComponent };
