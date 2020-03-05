import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';

const whiteContainerHeight =
  LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT - (LayoutConstants.DEVICE_IS_IPHONE_X ? 150 : 125);

const whiteContainerWidth = LayoutConstants.WINDOW_WIDTH - 40;

const childViewHight = whiteContainerHeight / 6;

const iosCreateExchangeBtnMarginTop = childViewHight - 5 > 40 ? -20 : -8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT,
  },
  whiteContainer: {
    marginTop: LayoutConstants.DEVICE_IS_IPHONE_X ? 80 : 55,
    marginLeft: 20,
    marginRight: 20,
    height: whiteContainerHeight,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  childViewContainer: {
    flex: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  coinTypeIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    marginRight: 3,
  },
  coinType: {
    width: (whiteContainerWidth - 45) / 3,
    height: childViewHight - 5 > 40 ? 40 : childViewHight - 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTypeText: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
    marginRight: 3,
  },
  input: {
    width: ((whiteContainerWidth - 45) * 2) / 3,
    height: childViewHight - 5 > 40 ? 40 : childViewHight - 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.bgGrayColor_ed,
    paddingRight: 5,
    padding: 0,
    fontSize: 13,
  },
  tr: {
    width: 10,
    height: 6,
  },
  walletSelect: {
    flexDirection: 'row',
    width: (whiteContainerWidth - 45) / 2,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    alignItems: 'center',
    height: 15,
  },
  walletSelectText: {
    color: Colors.themeColor,
    fontSize: 13,
  },
  balanceText: {
    width: (whiteContainerWidth - 45) / 2,
    fontSize: 12,
    // height: childViewHight - 5 > 40 ? 40 : childViewHight - 5,
    color: '#d2d2d2',
    backgroundColor: 'transparent',
    height: 15,
  },
  titleText: {
    marginTop: 10,
  },
  createExchangeBtn: {
    width: whiteContainerWidth - 40,
    height: childViewHight - 5 > 40 ? 40 : childViewHight - 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(62,192,253)',
    borderRadius: 5,
    marginTop: LayoutConstants.DEVICE_IS_ANDROID() ? 0 : iosCreateExchangeBtnMarginTop,
  },
});

export default class ExchangeHeadView extends Component {
  _getLogo = symbol => {
    if (symbol === 'ITC') {
      return require('../../../assets/home/ITC.png');
    }
    if (symbol === 'ETH') {
      return require('../../../assets/home/ETH.png');
    }
    return require('../../../assets/home/null.png');
  };

  render() {
    const {
      onCoinTypeSelectDeposit,
      onCoinTypeSelectRecevie,
      onWalletSelectDeposit,
      onWalletSelectRecevie,
      currentDepositCoin,
      currentReceiveCoin,
      currentDepositWallet,
      currentReceiveWallet,
      onDepositInputChange,
      depositInputValue,
      onReceiveInputChange,
      receiveInputValue,
      depositPlaceholder,
      receivePlaceholder,
      instantRate,
      onExchange,
      onRefore,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={[styles.childViewContainer, { alignItems: 'center' }]}>
            <Text style={styles.titleText}>{`1 ${currentDepositCoin.symbol}`}</Text>
            <TouchableOpacity onPress={onRefore}>
              <Image
                source={require('../../../assets/exchange/refore.png')}
                style={[styles.coinTypeIcon, { marginTop: 5, marginLeft: 7, marginRight: 7 }]}
              />
            </TouchableOpacity>
            <Text style={styles.titleText}>{`${
              instantRate !== '' ? parseFloat(instantRate).toFixed(6) : '?'
            } ${currentReceiveCoin.symbol}`}</Text>
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'center' }]}>
            <TouchableOpacity onPress={onCoinTypeSelectDeposit} style={styles.coinType}>
              <Image source={currentDepositCoin.coinIcon} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText} numberOfLines={1}>
                {currentDepositCoin.symbol}
              </Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              returnKeyType="next"
              keyboardType="numeric"
              textAlign="right"
              placeholder={depositPlaceholder}
              style={styles.input}
              defaultValue={depositInputValue}
              onChange={e => {
                onDepositInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View style={[styles.childViewContainer, { flex: 5 }]}>
            <Text style={styles.balanceText}>{`${I18n.t('exchange.available_balance')}: ${
              currentDepositCoin.balance
            }`}</Text>
            <TouchableOpacity style={styles.walletSelect} onPress={onWalletSelectDeposit}>
              <Text style={styles.walletSelectText} numberOfLines={1}>
                {currentDepositWallet.name}
              </Text>
              <Image
                source={require('../../../assets/exchange/icon_tr.png')}
                style={[styles.tr, { marginLeft: 5 }]}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'center' }]}>
            <TouchableOpacity onPress={onCoinTypeSelectRecevie} style={styles.coinType}>
              <Image source={currentReceiveCoin.coinIcon} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText}>{currentReceiveCoin.symbol}</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              returnKeyType="done"
              textAlign="right"
              placeholder={`${I18n.t('exchange.receiving_quantity')}${receivePlaceholder}`}
              style={styles.input}
              defaultValue={receiveInputValue}
              onChange={e => {
                onReceiveInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View style={[styles.childViewContainer, { flex: 6 }]}>
            <TouchableOpacity
              style={[styles.walletSelect, { width: whiteContainerWidth - 40 }]}
              onPress={onWalletSelectRecevie}
            >
              <Text style={styles.walletSelectText}>{currentReceiveWallet.name}</Text>
              <Image
                source={require('../../../assets/exchange/icon_tr.png')}
                style={[styles.tr, { marginLeft: 5 }]}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'center' }]}>
            <TouchableOpacity style={styles.createExchangeBtn} onPress={onExchange}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                {I18n.t('exchange.create_exchange_order')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginTop: 5, color: 'white', fontSize: 10 }}>
            Powered by SWFT Blockchain
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginTop: 10,
          }}
        >
          <Text style={{ marginTop: 20, marginLeft: 20, color: 'gray' }}>
            {I18n.t('exchange.exchange_record')}
          </Text>
        </View>
      </View>
    );
  }
}
