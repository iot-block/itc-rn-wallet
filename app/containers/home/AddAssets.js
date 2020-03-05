import React from 'react';
import { View, KeyboardAvoidingView, Keyboard } from 'react-native';
import BaseComponent from '../base/BaseComponent';
import AddTokenInput from './component/AddTokenInput';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { Colors } from '../../config/GlobalConfig';
import NetworkManager from '../../utils/NetworkManager';
import LayoutConstants from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import store from '../../config/store/ConfigureStore';
import { BlueButtonBig } from '../../components/Button';

class AddAssets extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tokenAddress: '',
      tokenSymbol: '',
      tokenDecimal: 0,
      isValidAddress: false,
      isValidSymbol: false,
      isValidDecimal: false,
      AddressCheckStr: I18n.t('home.address_check'),
      SymbolCheckStr: I18n.t('home.symbol_check'),
      DecimalCheckStr: I18n.t('home.decimal_check'),
      isFocusAddress: false,
      isFocusSymbol: false,
      isFocusDecimal: false,
    };
  }

  checkAddress(addrees) {
    const { tokens } = store.getState().Core;
    let checkStr = I18n.t('home.address_check');
    const tokensAddresses = tokens
      .filter(token => token.symbol !== 'ETH')
      .map(token => token.address);
    if (tokensAddresses.includes(addrees)) {
      checkStr = I18n.t('home.address_repeat');
    } else {
      NetworkManager.getContractAddressInfo(addrees)
        .then(data => {
          this.setState({
            isValidAddress: true,
            AddressCheckStr: checkStr,
            tokenAddress: addrees,
            tokenSymbol: data[0],
            tokenDecimal: data[1],
            isValidSymbol: true,
            isValidDecimal: true,
          });
        })
        .catch(() => {
          this.setState({
            isValidAddress: false,
            AddressCheckStr: I18n.t('home.address_invalid'),
            tokenAddress: addrees,
          });
        });
    }
    this.setState({
      isValidAddress: false,
      AddressCheckStr: checkStr,
      tokenAddress: addrees,
    });
  }

  renderComponent = () => {
    const inputColor1 = !this.state.isFocusAddress
      ? Colors.clearColor
      : Colors.addTokenCheckTextColor;
    const inputColor2 = !this.state.isFocusSymbol
      ? Colors.clearColor
      : Colors.addTokenCheckTextColor;
    const inputColor3 = !this.state.isFocusDecimal
      ? Colors.clearColor
      : Colors.addTokenCheckTextColor;
    return (
      <View
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => {
          Keyboard.dismiss();
          this.setState({
            isFocusAddress: false,
            isFocusSymbol: false,
            isFocusDecimal: false,
          });
        }}
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('home.add_token')} />
        <View style={{ height: 1, backgroundColor: Colors.bgGrayColor }} />
        <KeyboardAvoidingView
          behavior="padding"
          style={{ paddingTop: 20, width: LayoutConstants.WINDOW_WIDTH }}
          enabled
        >
          <AddTokenInput
            title={`${I18n.t('home.contract_address')}(${store.getState().Core.network})`}
            onChange={event => {
              const isValidAddressLet = NetworkManager.isValidAddress(event.nativeEvent.text);
              if (isValidAddressLet) {
                this.checkAddress(event.nativeEvent.text);
              } else {
                this.setState({
                  isValidAddress: isValidAddressLet,
                  tokenAddress: event.nativeEvent.text,
                  AddressCheckStr: I18n.t('home.address_check'),
                });
              }
            }}
            onFocus={() => {
              this.setState({
                isFocusAddress: true,
                isFocusSymbol: false,
                isFocusDecimal: false,
              });
            }}
            keyboardType="email-address"
            checkTextColor={
              this.state.tokenAddress !== '' && !this.state.isValidAddress
                ? Colors.RedColor
                : inputColor1
            }
            checkText={this.state.AddressCheckStr}
            editable
          />
          <AddTokenInput
            title={I18n.t('home.token_symbol')}
            onChange={event => {
              this.setState({
                isValidSymbol: !!(
                  event.nativeEvent.text.length > 0 && event.nativeEvent.text.length < 10
                ),
                tokenSymbol: event.nativeEvent.text,
              });
            }}
            onFocus={() => {
              this.setState({
                isFocusAddress: false,
                isFocusSymbol: true,
                isFocusDecimal: false,
              });
            }}
            checkTextColor={
              this.state.tokenSymbol !== '' && !this.state.isValidSymbol
                ? Colors.RedColor
                : inputColor2
            }
            checkText={this.state.SymbolCheckStr}
            editable={!this.state.isValidAddress}
            defaultValue={this.state.isValidAddress ? this.state.tokenSymbol : ''}
          />
          <AddTokenInput
            title={I18n.t('home.token_decimal')}
            onChange={event => {
              this.setState({
                isValidDecimal: !!(event.nativeEvent.text > 0 && event.nativeEvent.text < 36),
                tokenDecimal: event.nativeEvent.text,
              });
            }}
            onFocus={() => {
              this.setState({
                isFocusAddress: false,
                isFocusSymbol: false,
                isFocusDecimal: true,
              });
            }}
            keyboardType="numeric"
            checkTextColor={
              this.state.tokenDecimal !== '' &&
              this.state.tokenDecimal !== 0 &&
              !this.state.isValidDecimal
                ? Colors.RedColor
                : inputColor3
            }
            checkText={this.state.DecimalCheckStr}
            editable={!this.state.isValidAddress}
            defaultValue={this.state.isValidAddress ? this.state.tokenDecimal : '0'}
          />
          <View style={{ paddingTop: 20, alignItems: 'center' }}>
            <BlueButtonBig
              text={I18n.t('home.add')}
              isDisabled={
                !(
                  this.state.isValidAddress &&
                  this.state.isValidDecimal &&
                  this.state.isValidSymbol
                )
              }
              buttonStyle={{ marginTop: 0 }}
              onPress={() => {
                Keyboard.dismiss();
                this.props.navigation.state.params.callback({
                  tokenAddress: this.state.tokenAddress,
                  tokenSymbol: this.state.tokenSymbol,
                  tokenDecimal: this.state.tokenDecimal,
                });
                this.props.navigation.goBack();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
}

export default AddAssets;
