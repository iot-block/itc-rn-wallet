import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  TextInput,
  Image,
  DeviceEventEmitter,
} from 'react-native';

import { connect } from 'react-redux';
import lodash from 'lodash';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

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
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: Colors.backgroundColor,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.fontGrayColor_a0,
    fontSize: 13,
    height: 28,
    paddingVertical: 0,
  },
  cancelBox: {
    height: 30,
    paddingRight: 15,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  cancelIcon: {
    width: 18,
    height: 18,
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

  itemBtn: { height: 30, width: 56 },
  itemAddText: {
    color: 'white',
  },
  itemRemoveText: {
    // color: Colors.fontBlueColor,
    color: Colors.fontGrayColor_a,
  },
  itemSeparator: {
    height: 2,
    width: Layout.WINDOW_WIDTH - 20,
    backgroundColor: Colors.backgroundColor,
  },
  emptyListContainer: {
    flex: 1,
    paddingTop: 80,
    // height:Layout.WINDOW_HEIGHT - Layout.DEVICE_IS_IPHONE_X() ? 112 : 88,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    // marginBottom:20,
  },
  emptyListBox: {
    alignItems: 'center',
  },
  emptyListIcon: {
    width: 94,
    height: 114,
    marginBottom: 23,
  },
  emptyListText: {
    fontSize: 16,
    width: Layout.WINDOW_WIDTH * 0.8,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  toFeedbackBtn: {
    height: 36,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 50,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: Colors.fontBlueColor,
  },
  feedBackText: {
    fontSize: 16,
    color: Colors.fontBlueColor,
    lineHeight: 34,
  },
});

class SearchTokenScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      datas: [], // 列表数据
      searchValue: '',
      isShowEmptyView: false,
    };

    this.searchText = '';
    this.allTokens = []; // 所有的tokens
    this.searchTokens = []; // 搜索到符合的条件的tokens
    this.addedTokens = []; // 已经添加的Tokens

    this.searchInputRef = React.createRef();
    this.flatList = React.createRef();
  }

  _initData = () => {
    this.allTokens = this.props.allTokens;
    this.addedTokens = this.props.tokens.map(token => {
      token.isAdded = true;
      return token;
    });
  };

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  // 空布局
  _renderEmptyView = () =>
    this.state.isShowEmptyView ? (
      <View style={styles.emptyListContainer}>
        <View style={styles.emptyListBox}>
          <Image
            style={styles.emptyListIcon}
            source={require('../../assets/common/no_icon.png')}
            resizeMode="contain"
          />
          <Text style={styles.emptyListText}>{I18n.t('settings.no_related_currency_found')}</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.toFeedbackBtn}
            onPress={this._toFeedbackPress}
          >
            <Text style={styles.feedBackText}>{I18n.t('settings.feedback')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;

  _toFeedbackPress = () => {
    const content = '';
    this.props.navigation.navigate('Feedback', { content });
  };

  _renderItem = item => (
    <ItemView item={item} addOrRemoveItem={() => this._addOrRemoveItem(item)} />
  );

  _addOrRemoveItem = async item => {
    try {
      const token = item.item;
      const isAdd = !token.isAdded;
      token.isAdded = isAdd;
      const index = this.searchTokens.findIndex(
        searchToken => searchToken.address.toLowerCase() === token.address.toLowerCase()
      );
      if (index >= 0) {
        this.searchTokens.splice(index, 1, token);
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
      // 移除
      if (!isAdd && addIndex >= 2 && addIndex < this.addedTokens.length) {
        // 0 和 1分别是eth和itc不可移除
        this.props.removeToken(token.address);
        this.addedTokens.splice(addIndex, 1);
      }
      this.setState(
        {
          datas: lodash.cloneDeep(this.searchTokens),
          isShowEmptyView: true,
        },
        () => {
          const newTokens = this.props.tokens;
          DeviceEventEmitter.emit('changeTokens', {
            tokens: newTokens,
            from: 'searchTokenPage',
          });
        }
      );
      // this.changeTokensEmitter();
    } catch (e) {
      console.log('add_remove_token_err', e);
    }
  };

  changeTokensEmitter() {
    setTimeout(() => {
      const newTokens = this.props.tokens;
      DeviceEventEmitter.emit('changeTokens', {
        tokens: newTokens,
        from: 'searchTokenPage',
      });
    }, 10);
  }

  _backPress = () => {
    this._goBack();
  };

  _onBackPressed = () => {
    this._goBack();
    return true;
  };

  _goBack = () => {
    const { tokens } = this.props;
    this.props.navigation.state.params.callback({ tokens });
    this.props.navigation.goBack();
  };

  _onChangeText(text) {
    this.searchText = text.trim();
    if (!this.searchText || this.searchText === '') {
      this.searchTokens = [];
      this.setState({
        datas: [],
        isShowEmptyView: false,
      });
    } else {
      this._matchToken();
    }
  }

  _matchToken = () => {
    const _this = this;
    this.searchTokens = [];
    const addedTokenList = this.addedTokens;
    const searchContent = this.searchText;
    this.allTokens.forEach(token => {
      if (
        token.symbol
          .trim()
          .toLowerCase()
          .indexOf(searchContent.trim().toLowerCase()) >= 0
      ) {
        const index = addedTokenList.findIndex(
          addedToken => addedToken.address.toLowerCase() === token.address.toLowerCase()
        );
        const obj = {
          iconLarge: token.iconLarge,
          symbol: token.symbol,
          name: token.name,
          decimal: token.decimal,
          address: token.address,
          isAdded: index >= 0,
        };
        _this.searchTokens.push(obj);
      }
    });

    this.setState({
      datas: lodash.cloneDeep(_this.searchTokens),
      isShowEmptyView: true,
    });
    this.searchText = '';
  };

  refreshDatas = () => {
    const addedTokenList = this.addedTokens;
    const dataList = [];
    this.searchTokens.forEach(data => {
      let added = false; // 是否已添加
      for (let i = 0; i < addedTokenList.length; i++) {
        if (data.address === addedTokenList[i].address) {
          added = true;
          break;
        }
      }
      const obj = {
        iconLarge: data.iconLarge,
        symbol: data.symbol,
        name: data.name,
        decimal: data.decimal,
        address: data.address,
        isAdded: added,
      };
      dataList.push(obj);
    });
    this.setState({
      datas: dataList,
      isShowEmptyView: true,
    });
    this.searchText = '';
  };

  _cancelPress = () => {
    this.searchText = '';
    this.searchTokens = [];
    // this.searchInputRef.clear();
    this.setState({
      datas: [],
      isShowEmptyView: false,
      searchValue: '',
    });
  };

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
        <View style={styles.searchBox}>
          <Image
            style={styles.searchIcon}
            source={require('../../assets/common/search.png')}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            ref={this.searchInputRef}
            autoFocus
            placeholderTextColor={Colors.fontGrayColor_a0}
            placeholder={I18n.t('settings.input_token_name')}
            onChangeText={text => {
              this.setState({
                searchValue: text,
              });
              this._onChangeText(text);
            }}
          >
            {this.state.searchValue}
          </TextInput>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.cancelBox}
            onPress={this._cancelPress}
          >
            <Image
              style={styles.cancelIcon}
              source={require('../../assets/common/delete.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
      <FlatList
        style={styles.listContainer}
        ref={this.flatList}
        data={this.state.datas}
        keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmptyView}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        getItemLayout={(data, index) => ({ length: 72, offset: (72 + 1) * index, index })}
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
    const isHideBtn = !!(symbol.toLowerCase() === 'eth' || symbol.toLowerCase() === 'itc');
    /* const btnTxt =
      isAdded === undefined || !isAdded ? I18n.t('settings.add') : I18n.t('settings.added'); */
    const btnIcon =
      isAdded === undefined || !isAdded
        ? require('../../assets/common/add_btn.png')
        : require('../../assets/common/added_btn.png');
    const fullName = name === '' || name === undefined ? '...' : name;

    return (
      <View style={styles.item}>
        <Image
          style={styles.itemIcon}
          iosdefaultSource={require('../../assets/home/null.png')}
          source={
            iconLarge === '' || loadIconError === true || symbol === 'ITC'
              ? icon
              : { uri: iconLarge }
          }
          cache="force-cache"
          resizeMode="contain"
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
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.itemRightBox]}
            onPress={addOrRemoveItem}
          >
            {/* <Text style={[isAdded ? styles.itemRemoveText : styles.itemAddText]}>{btnTxt}</Text> */}
            <Image style={styles.itemBtn} source={btnIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  allTokens: state.Core.allTokens,
  tokens: state.Core.tokens,
  network: state.Core.network,
  wallet: state.Core.wallet,
});
const mapDispatchToProps = dispatch => ({
  addToken: token => dispatch(Actions.addToken(token)),
  removeToken: token => dispatch(Actions.removeToken(token)),
  setCurrentWallet: wallet => dispatch(Actions.setCurrentWallet(wallet)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchTokenScreen);
