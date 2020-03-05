import React from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import JPushModule from 'jpush-react-native';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import StorageManage from '../../utils/StorageManage';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import ChoseItem from '../../components/ChoseComponent';
import BaseComponent from '../base/BaseComponent';
import NetworkManager from '../../utils/NetworkManager';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGrayColor,
  },
  contentBox: {
    flex: 1,
    marginTop: 15,
  },
  choseItemContent: {},
});

class ChoseLanguageScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCheckZh: false,
      isCheckEn: false,
      isCheckKo: false,
      isCheckDe: false,
      isCheckEs: false,
      isCheckNl: false,
      isCheckFr: false,
      isCheckRu: false,
      isCheckUk: false,
    };

    this.lang = '';
    this.langStr = '';

    this.monetaryUnitType = '';
    this.monetaryUnitSymbol = '';
  }

  _initData = () => {
    this.lang = I18n.locale;
    this._checkLanguage();

    // this.getAllTags()
  };

  _checkState(isZh, isEn, isKo, isDe, isEs, isNl, isFr, isRu, isUk) {
    this.setState({
      isCheckZh: isZh,
      isCheckEn: isEn,
      isCheckKo: isKo,
      isCheckDe: isDe, // 德语
      isCheckEs: isEs, // 西班牙语
      isCheckNl: isNl, // 荷兰语
      isCheckFr: isFr, // 法语
      isCheckRu: isRu, // 俄语
      isCheckUk: isUk, // 乌克兰语
    });
  }

  _checkLanguage() {
    if (this.lang === 'zh') {
      this.langStr = '简体中文';
      this._checkState(true, false, false, false, false, false, false, false, false);

      this.monetaryUnitType = 'CNY';
      this.monetaryUnitSymbol = '¥';
    } else if (this.lang === 'en') {
      this.langStr = 'English';
      this._checkState(false, true, false, false, false, false, false, false, false);

      this.monetaryUnitType = 'USD';
      this.monetaryUnitSymbol = '$';
    } else if (this.lang === 'ko') {
      this.langStr = '한국어';
      this._checkState(false, false, true, false, false, false, false, false, false);

      this.monetaryUnitType = 'KRW';
      this.monetaryUnitSymbol = '₩';
    } else if (this.lang === 'de') {
      this.langStr = 'Deutsch';
      this._checkState(false, false, false, true, false, false, false, false, false);

      this.monetaryUnitType = 'EUR';
      this.monetaryUnitSymbol = '€';
    } else if (this.lang === 'es') {
      this.langStr = 'Español';
      this._checkState(false, false, false, false, true, false, false, false, false);

      this.monetaryUnitType = 'EUR';
      this.monetaryUnitSymbol = '€';
    } else if (this.lang === 'nl') {
      this.langStr = 'Nederlands';
      this._checkState(false, false, false, false, false, true, false, false, false);

      this.monetaryUnitType = 'EUR';
      this.monetaryUnitSymbol = '€';
    } else if (this.lang === 'fr') {
      this.langStr = 'Français';
      this._checkState(false, false, false, false, false, false, true, false, false);

      this.monetaryUnitType = 'EUR';
      this.monetaryUnitSymbol = '€';
    } else if (this.lang === 'ru') {
      this.langStr = 'Русский язык';
      this._checkState(false, false, false, false, false, false, false, true, false);

      this.monetaryUnitType = 'RUB';
      this.monetaryUnitSymbol = '₽';
    } else if (this.lang === 'uk') {
      this.langStr = 'УКРАЇНА';
      this._checkState(false, false, false, false, false, false, false, false, true);

      this.monetaryUnitType = 'UAH';
      this.monetaryUnitSymbol = '₴';
    }
  }

  async _saveLanguage(lang) {
    const preLang = this.lang;
    this.lang = lang;
    I18n.locale = this.lang;
    this._checkLanguage();

    const langObject = {
      lang: this.lang,
      langStr: this.langStr,
    };
    StorageManage.save(StorageKey.Language, langObject);
    const monetaryObject = {
      monetaryUnitType: this.monetaryUnitType,
      symbol: this.monetaryUnitSymbol,
    };
    this.props.setMonetaryUnit(monetaryObject);
    StorageManage.save(StorageKey.MonetaryUnit, monetaryObject);
    DeviceEventEmitter.emit('monetaryUnitChange', { monetaryUnit: monetaryObject });

    const params = {
      language: this.lang,
    };
    this.props.setLanguage(params);
    NetworkManager.userInfoUpdate(params)
      .then(response => {
        if (response.code === 200) {
          // console.log('userInfoUpdate success:', 'success');
        } else {
          Analytics.recordErr('userInfoUpdateRspErr', response.msg);
        }
      })
      .catch(err => {
        Analytics.recordErr('userInfoUpdateCatchErr', err);
      });
    this.resetJPushTag(preLang);
    this.props.navigation.navigate('Home');
    /* this.props.navigation.state.params.callback({ language: langObject, monetaryUnit: monetaryObject });
        this.props.navigation.goBack() */
  }

  resetJPushTag = preLang => {
    const nowLang = this.lang;
    JPushModule.deleteTags([preLang], map => {
      if (map.errorCode === 0) {
        JPushModule.addTags([nowLang], m => {
          if (m.errorCode === 0) {
            console.log(`Add tags succeed, tags: ${m.tags}`);
          } else {
            console.log(`Add tags failed, error code: ${m.errorCode}`);
          }
        });
      } else {
        console.log(`Delete tags failed, error code: ${map.errorCode}`);
      }
    });
  };

  getAllTags = () => {
    JPushModule.getAllTags(map => {
      if (map.errorCode === 0) {
        // console.log('AllTags: ' + map.tags)
      } else {
        // console.log('AllTags_error: ' + map.errorCode)
      }
    });
  };

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.multi_language')} />
      <View style={styles.contentBox}>
        <ChoseItem
          content="简体中文"
          isCheck={this.state.isCheckZh}
          itemPress={() => this._saveLanguage('zh')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="English"
          isCheck={this.state.isCheckEn}
          itemPress={() => this._saveLanguage('en')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="한국어"
          isCheck={this.state.isCheckKo}
          itemPress={() => this._saveLanguage('ko')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="Deutsch"
          isCheck={this.state.isCheckDe}
          itemPress={() => this._saveLanguage('de')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="Español"
          isCheck={this.state.isCheckEs}
          itemPress={() => this._saveLanguage('es')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="Français"
          isCheck={this.state.isCheckFr}
          itemPress={() => this._saveLanguage('fr')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="Pусский"
          isCheck={this.state.isCheckRu}
          itemPress={() => this._saveLanguage('ru')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="Nederlands"
          isCheck={this.state.isCheckNl}
          itemPress={() => this._saveLanguage('nl')}
          choseItemContentStyle={styles.choseItemContent}
        />
        <ChoseItem
          content="УКРАЇНА"
          isCheck={this.state.isCheckUk}
          itemPress={() => this._saveLanguage('uk')}
          choseItemContentStyle={styles.choseItemContent}
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
  setLanguage: myLanguage => dispatch(Actions.setLanguage(myLanguage)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoseLanguageScreen);
