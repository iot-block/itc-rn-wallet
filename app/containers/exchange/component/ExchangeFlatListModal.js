import React, { Component } from 'react';
import { Modal, FlatList, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { ItemDivideComponent } from '../../home/component/HomeCell';
import {
  ExchangeModalCoinSelectCell,
  ExchangeModalWalletSelectCell,
  ExchangeWalletEmptyComponent,
} from './ExchangeCell';
import { I18n } from '../../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: 'flex-end',
    // flexDirection: 'column-reverse',
  },
});
export default class ExchangeFlatListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  static propsType = {
    selectCategory: PropTypes.string.isRequired,
  };

  renderItem = item => {
    const { selectCategory, onSelect } = this.props;
    if (selectCategory === 'coinSelect') {
      return (
        <ExchangeModalCoinSelectCell
          item={item}
          onClick={() => {
            onSelect(item);
          }}
        />
      );
    }
    if (selectCategory === 'walletSelect') {
      return (
        <ExchangeModalWalletSelectCell
          item={item}
          onClick={() => {
            onSelect(item);
          }}
        />
      );
    }
    return null;
  };

  showFlatModal() {
    this.setState({
      show: true,
    });
  }

  closeFlatModal() {
    this.setState({
      show: false,
    });
  }

  render() {
    const { show } = this.state;
    const { selectCategory, items, onEmptyCreatWallet } = this.props;
    let bottomHeight = LayoutConstants.DEVICE_IS_IPHONE_X ? 320 : 300;
    if (items.length > 0 && items.length < 4) {
      bottomHeight = (items.length + 1) * 60 + (LayoutConstants.DEVICE_IS_IPHONE_X ? 20 : 0);
    } else if (items.length === 0) {
      bottomHeight = LayoutConstants.DEVICE_IS_IPHONE_X ? 140 : 120;
    }
    return (
      <Modal
        animationType="fade"
        visible={show}
        transparent
        onRequestClose={() => {
          // console.log('安卓物理返回');
        }}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.closeFlatModal();
            }}
          >
            <View
              style={{
                backgroundColor: 'transparent',
                width: LayoutConstants.WINDOW_WIDTH,
                height: LayoutConstants.WINDOW_HEIGHT - bottomHeight,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: 'white',
              width: LayoutConstants.WINDOW_WIDTH,
              height: bottomHeight,
            }}
          >
            <FlatList
              data={items}
              renderItem={this.renderItem}
              ListEmptyComponent={
                selectCategory === 'walletSelect' ? (
                  <ExchangeWalletEmptyComponent onEmptyCreatWallet={onEmptyCreatWallet} />
                ) : null
              }
              ItemSeparatorComponent={ItemDivideComponent}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
              ListHeaderComponent={
                <Text
                  style={{
                    width: LayoutConstants.WINDOW_WIDTH,
                    height: 40,
                    marginTop: 20,
                    marginLeft: 20,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  {selectCategory === 'coinSelect'
                    ? I18n.t('exchange.select_currency')
                    : I18n.t('exchange.select_wallet')}
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  }
}
