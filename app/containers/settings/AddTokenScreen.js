import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  Switch,
  DeviceEventEmitter,
} from 'react-native';

import { connect } from 'react-redux';
import lodash from 'lodash';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  topBox: {
    backgroundColor: Colors.whiteBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    marginTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
  },
  backBox: {
    height: 46,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    marginRight: 15,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.backgroundColor,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.fontGrayColor_a0,
    fontSize: 13,
  },
  cancelBox: {
    height: 38,
    paddingLeft: 10,
  },
  cancelText: {
    height: 38,
    lineHeight: 38,
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },
  line: {
    backgroundColor: Colors.backgroundColor,
    height: 10,
    width: Layout.WINDOW_WIDTH,
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  itemCenterBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemFullName: {
    fontSize: 12,
    color: Colors.fontGrayColor_a,
  },
  itemAddress: {
    fontSize: 12,
    color: Colors.fontGrayColor_a,
  },
  itemRightBox: {
    height: 30,
    justifyContent: 'center',
  },
  itemAddOrRemoveBtn: {
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemAddBtn: {
    borderColor: Colors.fontBlueColor,
    backgroundColor: Colors.fontBlueColor,
  },
  itemRemoveBtn: {
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
    backgroundColor: 'transparent',
  },
  itemAddText: {
    color: 'white',
  },
  itemRemoveText: {
    color: Colors.fontBlueColor,
  },
  itemSeparator: {
    height: 2,
    width: Layout.WINDOW_WIDTH - 20,
    backgroundColor: Colors.backgroundColor,
  },
});

class AddTokenScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
    };
    this.addedTokens = []; // 已经添加的Tokens
    this.tokenList = []; // 显示的列表
    this.flatList = React.createRef();
  }

  _changeTokensEmitter = async data => {
    if (data.from === 'searchTokenPage') {
      this._loadData(data.tokens);
    }
  };

  _initData = async () => {
    const { tokens } = this.props.navigation.state.params;
    this._loadData(tokens);
  };

  _loadData(tokens) {
    let allTokens = [];
    const defaultTokens = []; // 默认的
    const addTokens = []; // 添加的

    tokens.forEach((token, index) => {
      token.isAdded = true;
      if (index === 0 || index === 1) {
        defaultTokens.push(token);
      } else {
        addTokens.unshift(token);
      }
    });
    allTokens = defaultTokens.concat(addTokens);
    this.tokenList = [].concat(allTokens);
    this.addedTokens = [].concat(allTokens);
    this.setState({
      datas: allTokens,
    });
  }

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  _renderItem = item => (
    <ItemView item={item} addOrRemoveItem={() => this._addOrRemoveItem(item)} />
  );

  _addOrRemoveItem = async item => {
    try {
      const token = item.item;
      const isAdd = !token.isAdded;
      token.isAdded = isAdd;
      const index = this.tokenList.findIndex(
        t => t.address.toLowerCase() === token.address.toLowerCase()
      );
      if (index >= 0) {
        this.tokenList.splice(index, 1, token);
      }
      const addIndex = this.addedTokens.findIndex(
        addedToken => addedToken.address.toLowerCase() === token.address.toLowerCase()
      );
      if (isAdd) {
        // 添加
        this.props.addToken(token);
        if (addIndex < 0) {
          this.addedTokens.push(token);
        }
      }
      if (!isAdd && addIndex >= 2 && addIndex < this.addedTokens.length) {
        // 移除
        // 0 和 1分别是eth和itc不可移除
        this.props.removeToken(token.address);
        this.addedTokens.splice(addIndex, 1);
      }
      this.setState(
        {
          datas: lodash.cloneDeep(this.tokenList),
        },
        () => {
          DeviceEventEmitter.emit('changeTokens', { from: 'addTokenPage' });
        }
      );
      /* setTimeout(() => {
        DeviceEventEmitter.emit('changeTokens', { from: 'addTokenPage' });
      }, 0); */
    } catch (e) {
      Analytics.recordErr('addOrRemoveItemCatchErr', e);
    }
  };

  _search = async () => {
    this.props.navigation.navigate('SearchToken', {
      callback: () => {
        // console.log('SearchToken', 'SearchToken');
      },
    });
  };

  _backPress = () => {
    this.toHomePage();
  };

  _onBackPressed = () => {
    this.toHomePage();
    return true;
  };

  toHomePage() {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
  }

  renderComponent = () => (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <TouchableOpacity activeOpacity={0.6} style={styles.backBox} onPress={this._backPress}>
          <Image
            style={styles.backIcon}
            source={require('../../assets/common/common_back.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} style={styles.searchBox} onPress={this._search}>
          <Image
            style={styles.searchIcon}
            source={require('../../assets/common/search.png')}
            resizeMode="contain"
          />
          <Text style={styles.searchInput}>{I18n.t('settings.input_token_name')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
      <FlatList
        style={styles.listContainer}
        ref={this.flatList}
        data={this.state.datas}
        keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        getItemLayout={(data, index) => ({ length: 72, offset: (72 + 2) * index, index })}
      />
    </View>
  );
}

class ItemView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadIconError: false,
    };
  }

  _getLogo = (symbol, iconLarge) => {
    if (symbol === 'ITC') {
      return require('../../assets/home/ITC.png');
    }
    if (symbol === 'USDT') {
      return require('../../assets/home/USDT.png');
    }
    if (iconLarge === '') {
      if (symbol === 'ETH') {
        return require('../../assets/home/ETH.png');
      }
    }
    return require('../../assets/home/null.png');
  };

  render() {
    const { item, addOrRemoveItem } = this.props || {};
    const { iconLarge, symbol, name, address, isAdded } = item.item || {};
    const { loadIconError } = this.state;
    const icon = this._getLogo(symbol, iconLarge);

    const _address = `${address.substr(0, 6)}......${address.substr(36, 42)}`;
    const isHideBtn = !!(symbol.toLowerCase() === 'eth' || symbol.toLowerCase() === 'itc' || symbol.toLowerCase() === 'usdt');
    // let btnTxt = (isAdded == undefined || !isAdded) ? I18n.t('settings.add') : I18n.t('settings.remove');
    const isCheck = !(isAdded === undefined || !isAdded);
    const fullName = name === '' || name === undefined ? '---' : name;

    return (
      <View style={styles.item}>
        <Image
          style={styles.itemIcon}
          source={
            iconLarge === '' || loadIconError === true || symbol === 'ITC' || symbol === 'USDT'
              ? icon
              : { uri: iconLarge }
          }
          resizeMode="contain"
          iosdefaultSource={require('../../assets/home/null.png')}
          onError={() => {
            this.setState({
              loadIconError: true,
            });
          }}
        />
        <View style={styles.itemCenterBox}>
          <Text style={styles.itemName}>{symbol}</Text>
          <Text style={styles.itemFullName}>{fullName}</Text>
          <Text style={styles.itemAddress}>{_address}</Text>
        </View>
        {isHideBtn ? null : (
          <Switch
            value={isCheck}
            onTintColor={Colors.bgGrayColor_ed}
            thumbTintColor={isCheck ? Colors.fontBlueColor : Colors.bgGrayColor_e5}
            tintColor={Colors.bgGrayColor_ed}
            onValueChange={addOrRemoveItem}
          />
        )}
        {/* isHideBtn ? null :
                        <TouchableOpacity activeOpacity={0.6}
                            style={[styles.itemRightBox, styles.itemAddOrRemoveBtn, isAdded ? styles.itemRemoveBtn : styles.itemAddBtn]}
                            onPress={this._itemAddOrRemovePress}>
                            <Text style={[styles.itemAddOrRemoveText, isAdded ? styles.itemRemoveText : styles.itemAddText]}>{btnTxt}
                            </Text>
                        </TouchableOpacity> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // tokens: state.Core.tokens,
  wallet: state.Core.wallet,
});
const mapDispatchToProps = dispatch => ({
  addToken: token => dispatch(Actions.addToken(token)),
  removeToken: token => dispatch(Actions.removeToken(token)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTokenScreen);
