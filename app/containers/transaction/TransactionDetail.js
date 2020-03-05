import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Image,
  Linking,
  ImageBackground,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import Layout from '../../config/LayoutConstants';
import { TransparentBgHeader } from '../../components/NavigaionHeader';
import { Colors, Network } from '../../config/GlobalConfig';
import store from '../../config/store/ConfigureStore';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import {itcNetworkConfig} from '../../utils/NetConfig'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  containerBox: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  countBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH * 0.9,
    // alignSelf: 'center',
    alignItems:'center',
    marginBottom: Layout.WINDOW_HEIGHT * 0.08,
    justifyContent: 'center',
  },
  countTxt: {
    fontSize: 39,
    color: 'white',
    fontWeight: '700',
  },
  coinTypeTxt: {
    fontSize: 18,
    marginLeft: 6,
    color: 'white',
  },
  fromAddressTitleBox: {
    flexDirection: 'row',
  },
  fromAddressName: {
    flex: 1,
    marginLeft: 8,
  },
  fromAddressBox: {
    flexDirection: 'row',
  },
  addContact: {
    alignSelf: 'flex-end',
    paddingLeft: 20,
    paddingTop: 10,
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    // paddingTop: Layout.WINDOW_HEIGHT * 0.08,
    // paddingBottom: Layout.WINDOW_HEIGHT * 0.07,
    paddingTop: Layout.WINDOW_HEIGHT * 0.07,
    paddingBottom: Layout.WINDOW_HEIGHT * 0.06,
  },

  statusIcon: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -50,
    zIndex: 10,
  },

  fontBlue: {
    fontSize: 13,
    color: Colors.fontBlueColor,
  },
  fontBlack: {
    fontSize: 13,
    color: Colors.fontBlackColor,
  },
  fontGray: {
    fontSize: 13,
    color: Colors.fontDarkGrayColor,
  },
  marginTop2: {
    // marginTop: Layout.WINDOW_HEIGHT * 0.009,
    marginTop: Layout.WINDOW_HEIGHT * 0.007,
    // marginTop:6
  },
  marginTop10: {
    // marginTop: Layout.WINDOW_HEIGHT * 0.02,
    // marginTop:16
    marginTop: Layout.WINDOW_HEIGHT * 0.016,
  },
  marginTop12: {
    marginTop: Layout.WINDOW_HEIGHT * 0.025,
  },
  bottomBox: {
    flexDirection: 'row',
    // marginTop: Layout.WINDOW_HEIGHT * 0.045,
    marginTop: Layout.WINDOW_HEIGHT * 0.04,
    // marginTop: 35,
  },
  infoLeftBox: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  qrCodeBox: {
    marginLeft: 20,
  },
  copyBtn: {
    height: 29,
    marginTop: Layout.WINDOW_HEIGHT * 0.02,
    // marginTop: 16,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: Colors.themeColor,
  },
  copyBtnTxt: {
    backgroundColor: 'transparent',
    color: Colors.themeColor,
    fontSize: 13,
    height: 29,
    lineHeight: 29,
    textAlign: 'center',
  },
});

export default class TransactionDetail extends BaseComponent {
  constructor(props) {
    super(props);

    this.copyUrl = this.copyUrl.bind(this);

    const params = store.getState().Core.transactionDetail;
    const { wallet } = store.getState().Core;
    this.state = {
      amount: params.amount,
      transactionType: params.transactionType,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      txFee: params.txFee,
      remark: params.remark,
      transactionHash: params.transactionHash,
      blockNumber: params.blockNumber,
      transactionTime: params.transactionTime,
      tranStatus: params.tranStatus,
      name: params.name,
    };
    this.myAddress = wallet.address;
    const fromAddress = (params.fromAddress.indexOf('ITC')>-1)?params.fromAddress.replace('ITC','0x').toLowerCase():params.fromAddress.toLowerCase()
    this.isFrom = fromAddress === wallet.address.toLowerCase();
    this.otherAddress = this.isFrom ? params.toAddress : params.fromAddress;
    this._setStatusBarStyleLight();
  }

  didTapTransactionNumber = () => {
    const { network, wallet } = store.getState().Core;
    let detailUrl;
    if (wallet.type === 'itc') {
      detailUrl = `${itcNetworkConfig.txDetailUrl}${this.state.transactionHash}`;
    } else if (wallet.type === 'eth') {
      if (network === Network.rinkeby) {
        detailUrl = `https://rinkeby.etherscan.io/tx/${this.state.transactionHash}`;
      } else if (network === Network.main) {
        detailUrl = `https://etherscan.io/tx/${this.state.transactionHash}`;
      }
    }

    Linking.canOpenURL(detailUrl)
      .then(supported => {
        if (!supported) {
          // todo 弹toast
          return null;
        }
        return Linking.openURL(detailUrl);
      })
      .catch(err => console.log('An error occurred', detailUrl, ' err:', err));
  };

  copyUrl() {
    Clipboard.setString(this.state.transactionHash);
    showToast(I18n.t('toast.copied'));
  }

  addContact = () => {
    const _this = this;
    this.props.navigation.navigate('CreateContact', {
      address: _this.otherAddress,
      callback(data) {
        if (_this.otherAddress === data.contactInfo.address) {
          _this.setState({
            name: data.contactInfo.name,
          });
        }
      },
    });
  };

  renderComponent = () => {
    let statusIcon;
    if (this.state.tranStatus == 0) {
      statusIcon = require('../../assets/transfer/trans_ok.png');
    } else if (this.state.tranStatus == 2) {
      statusIcon = require('../../assets/transfer/trans_ing.png');
    } else if (this.state.tranStatus == 1) {
      statusIcon = require('../../assets/transfer/trans_fail.png');
    }

    const name = this.state.name === '' ? '' : `(${this.state.name})`;

    return (
      <ImageBackground
        style={styles.container}
        source={require('../../assets/launch/splash_bg.png')}
      >
        <TransparentBgHeader
          navigation={this.props.navigation}
          text={I18n.t('transaction.transaction_details')}
        />
        <ScrollView style={styles.scrollView}>
          <View style={[{ flex: 1, justifyContent: 'center' }]}>
            <View style={styles.containerBox}>
              <View style={styles.countBox}>
                <Text style={styles.countTxt}>{this.state.amount}</Text>
                <Text style={styles.coinTypeTxt}>{this.state.transactionType}</Text>
              </View>
              <View style={styles.contentBox}>
                <View style={styles.content}>
                  <View style={[styles.fromAddressTitleBox]}>
                    <Text style={[styles.fontGray, { paddingTop: 10 }]}>
                      {I18n.t('transaction.sending_party')}
                    </Text>
                    <Text style={[styles.fontGray, styles.fromAddressName, { paddingTop: 10 }]}>
                      {!this.isFrom ? name : ''}
                    </Text>
                    {!this.isFrom && this.state.name === '' ? (
                      <TouchableOpacity
                        style={[styles.addContact]}
                        activeOpacity={0.6}
                        onPress={this.addContact}
                      >
                        <Text style={[styles.fontBlue]} numberOfLines={1} ellipsizeMode="middle">
                          {I18n.t('transaction.add_contact')}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>
                    {this.state.fromAddress}
                  </Text>

                  <View style={[styles.fromAddressTitleBox]}>
                    <Text style={[styles.fontGray, { paddingTop: 10 }]}>
                      {I18n.t('transaction.beneficiary')}
                    </Text>
                    <Text style={[styles.fontGray, styles.fromAddressName, { paddingTop: 10 }]}>
                      {this.isFrom ? name : ''}
                    </Text>
                    {this.isFrom && this.state.name === '' ? (
                      <TouchableOpacity
                        style={[styles.addContact]}
                        activeOpacity={0.6}
                        onPress={this.addContact}
                      >
                        <Text style={[styles.fontBlue]} numberOfLines={1} ellipsizeMode="middle">
                          {I18n.t('transaction.add_contact')}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.toAddress}</Text>

                  <Text style={[styles.fontGray, styles.marginTop10]}>
                    {I18n.t('transaction.miner_cost')}
                  </Text>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>
                    { (!this.state.txFee || this.state.txFee === '')
                      ? '~'
                      : `${this.state.txFee ? this.state.txFee : '~'} ${store.getState().Core.wallet.type == 'itc' ? 'itg' : 'eth'}`}
                  </Text>

                  <View style={styles.bottomBox}>
                    <View style={styles.infoLeftBox}>
                      <Text style={[styles.fontGray]}>
                        {I18n.t('transaction.transaction_number')}
                      </Text>
                      <TouchableOpacity
                        style={[styles.marginTop2]}
                        activeOpacity={0.6}
                        onPress={this.didTapTransactionNumber}
                      >
                        <Text style={[styles.fontBlue]} numberOfLines={1} ellipsizeMode="middle">
                          {this.state.transactionHash}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.fontGray, styles.marginTop10]}>
                        {I18n.t('transaction.block')}
                      </Text>
                      <Text style={[styles.fontBlack, styles.marginTop2]}>
                        {this.state.tranStatus == 0 ? this.state.blockNumber : '~'}
                      </Text>
                      <Text style={[styles.fontGray, styles.marginTop10]}>
                        {I18n.t('transaction.transaction_time')}
                      </Text>
                      <Text style={[styles.fontBlack, styles.marginTop2]}>
                        {this.state.transactionTime}
                      </Text>
                    </View>
                    <View style={[styles.qrCodeBox, { marginTop: 6 }]}>
                      <QRCode
                        value={this.state.transactionHash}
                        size={96}
                        bgColor="#000"
                        fgColor="#fff"
                        onLoad={() => {}}
                        onLoadEnd={() => {}}
                      />
                      <TouchableOpacity
                        style={[styles.copyBtn]}
                        activeOpacity={0.6}
                        onPress={this.copyUrl}
                      >
                        <Text style={styles.copyBtnTxt}>{I18n.t('transaction.copy_address')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Image style={styles.statusIcon} source={statusIcon} resizeMode="contain" />
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
}
