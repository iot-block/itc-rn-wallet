import React from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import StorageManage from '../../utils/StorageManage';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import ChoseItem from '../../components/ChoseComponent';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGrayColor,
  },
  contentBox: {
    marginTop: 15,
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
  },
  choseItemContent: {
    paddingLeft: 10,
    paddingRight: 0,
  },
});
class ChoseMonetaryUnitScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCheckCNY: false,
      isCheckUSD: false,
      isCheckKRW: false,
      isCheckEUR: false,
      isCheckRUB: false, // 卢布 饿语
      isCheckUAH: false, // 乌克兰格里夫纳
    };
    this.monetaryUnitType = '';
    this.monetaryUnitSymbol = '';
  }

  _initData = () => {
    this.monetaryUnitType = this.props.monetaryUnit.monetaryUnitType;
    this._checkMonetaryUnit();
  };

  _checkState(isCNY, isUSD, isKRW, isEUR, isRUB, isURA) {
    this.setState({
      isCheckCNY: isCNY,
      isCheckUSD: isUSD,
      isCheckKRW: isKRW,
      isCheckEUR: isEUR,
      isCheckRUB: isRUB,
      isCheckUAH: isURA,
    });
  }

  _checkMonetaryUnit() {
    if (this.monetaryUnitType === 'CNY') {
      this.monetaryUnitSymbol = '¥';
      this._checkState(true, false, false, false, false, false);
    } else if (this.monetaryUnitType === 'USD') {
      this.monetaryUnitSymbol = '$';
      this._checkState(false, true, false, false, false, false);
    } else if (this.monetaryUnitType === 'KRW') {
      this.monetaryUnitSymbol = '₩';
      this._checkState(false, false, true, false, false, false);
    } else if (this.monetaryUnitType === 'EUR') {
      this.monetaryUnitSymbol = '€';
      this._checkState(false, false, false, true, false, false);
    } else if (this.monetaryUnitType === 'RUB') {
      this.monetaryUnitSymbol = '₽';
      this._checkState(false, false, false, false, true, false);
    } else if (this.monetaryUnitType === 'UAH') {
      this.monetaryUnitSymbol = '₴';
      this._checkState(false, false, false, false, false, true);
    }
  }

  _onPressCNY = () => {
    this.monetaryUnitType = 'CNY';
    this._saveMonetaryUnit();
  };

  _onPressUSD = () => {
    this.monetaryUnitType = 'USD';
    this._saveMonetaryUnit();
  };

  _onPressKRW = () => {
    this.monetaryUnitType = 'KRW';
    this._saveMonetaryUnit();
  };

  _onPressEUR = () => {
    this.monetaryUnitType = 'EUR';
    this._saveMonetaryUnit();
  };

  _onPressRUB = () => {
    this.monetaryUnitType = 'RUB';
    this._saveMonetaryUnit();
  };

  _onPressUAH = () => {
    this.monetaryUnitType = 'UAH';
    this._saveMonetaryUnit();
  };

  _saveMonetaryUnit() {
    this._checkMonetaryUnit();
    const object = {
      monetaryUnitType: this.monetaryUnitType,
      symbol: this.monetaryUnitSymbol,
    };
    this.props.setMonetaryUnit(object);
    StorageManage.save(StorageKey.MonetaryUnit, object);
    // var loadRet = await StorageManage.load(StorageKey.MonetaryUnit)

    DeviceEventEmitter.emit('monetaryUnitChange', { monetaryUnit: object });
    this.props.navigation.state.params.callback({ monetaryUnit: object });
    this.props.navigation.goBack();
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.currency_unit')} />
      <View style={styles.contentBox}>
        <ChoseItem
          content="CNY"
          isCheck={this.state.isCheckCNY}
          itemPress={this._onPressCNY}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="USD"
          isCheck={this.state.isCheckUSD}
          itemPress={this._onPressUSD}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="KRW"
          isCheck={this.state.isCheckKRW}
          itemPress={this._onPressKRW}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="EUR"
          isCheck={this.state.isCheckEUR}
          itemPress={this._onPressEUR}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="RUB"
          isCheck={this.state.isCheckRUB}
          itemPress={this._onPressRUB}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="UAH"
          isCheck={this.state.isCheckUAH}
          itemPress={this._onPressUAH}
          choseItemContentStyle={styles.choseItemContent}
          isShowLine={false}
        />
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  monetaryUnit: state.Core.monetaryUnit,
});
const mapDispatchToProps = dispatch => ({
  setMonetaryUnit: monetaryUnit => dispatch(Actions.setMonetaryUnit(monetaryUnit)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoseMonetaryUnitScreen);
