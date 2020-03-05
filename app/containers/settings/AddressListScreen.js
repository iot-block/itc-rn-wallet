import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, SectionList, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH,
    height: Layout.NAVIGATION_HEIGHT(),
    backgroundColor: Colors.whiteBackgroundColor,
    // zIndex: 10,
    paddingTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
  },
  headerButtonBox: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerTitleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerLeftIcon: {
    height: 20,
    width: 20,
  },
  headerRightIcon: {
    height: 15,
    width: 15,
  },
  headerTitleText: {
    fontSize: 16,
    height: 20,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.fontBlackColor_43,
  },

  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    paddingBottom: 15,
  },
  emptyListContainer: {
    marginTop: 150,
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    width: 94,
    height: 114,
    marginBottom: 23,
  },
  emptyListText: {
    fontSize: 16,
    width: Layout.WINDOW_WIDTH * 0.9,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  item: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  itemRightView: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
    marginBottom: 2,
  },
  itemAddress: {
    fontSize: 12,
    color: Colors.fontGrayColor_a1,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: 'transparent',
    marginLeft: 15,
    marginRight: 15,
  },

  rAItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  rAItemAddress: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
    marginBottom: 2,
  },
  rAItemTime: {
    fontSize: 12,
    color: Colors.fontGrayColor_a1,
  },
  itemHeader: {
    height: 40,
    marginTop: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  itemHeaderTxt: {
    width: Layout.WINDOW_WIDTH - 40,
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    color: Colors.fontBlackColor_43,
  },
});

class AddressListScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
    };
    this.recentAddressList = [];
  }

  _initData = async () => {
    // this.from = this.props.navigation.state.params.from;
    const recentTransferAddress = await StorageManage.loadAllDataForKey(
      StorageKey.RecentTransferAddress
    );
    if (recentTransferAddress) {
      if (recentTransferAddress.length > 3) {
        this.recentAddressList = recentTransferAddress.reverse().slice(0, 2);
      } else {
        this.recentAddressList = recentTransferAddress.reverse();
      }
    } else {
      this.recentAddressList = [];
    }

    this.refreshData();
  };

  refreshData() {
    const { contactList } = this.props;
    this.recentAddressList.forEach(recentAddress => {
      const { address } = recentAddress;
      let isMathAddressName = '';
      for (let i = 0; i < contactList.length; i++) {
        if (address.toUpperCase() === contactList[i].address.toUpperCase()) {
          isMathAddressName = contactList[i].name;
          break;
        }
      }
      recentAddress.name = isMathAddressName;
    });

    const datas = [];
    if (this.recentAddressList.length > 0) {
      datas.push({ key: I18n.t('settings.recent_transfers'), data: this.recentAddressList });
    }
    if (contactList.length > 0) {
      datas.push({ key: I18n.t('settings.address_book'), data: contactList });
    }

    this.setState({
      addressList: datas,
    });
  }

  _onItemPress = info => {
    // 返回转账页面
    this.props.navigation.state.params.callback({ toAddress: info.item.address });
    this.props.navigation.goBack();
  };

  _renderItem = info => <Item info={info} onPressItem={() => this._onItemPress(info)} />;

  _renderItemHeader = info => (
    <View style={styles.itemHeader}>
      <Text style={styles.itemHeaderTxt}>{info.section.key}</Text>
    </View>
  );

  addContact = async () => {
    const _this = this;
    this.props.navigation.navigate('CreateContact', {
      callback() {
        _this.refreshData();
      },
    });
  };

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  // 空布局
  _renderEmptyView = isContactList => (
    <View style={styles.emptyListContainer}>
      <Image
        style={styles.emptyListIcon}
        source={require('../../assets/common/no_icon.png')}
        resizeMode="contain"
      />
      <Text style={styles.emptyListText}>
        {isContactList ? I18n.t('settings.no_contact') : I18n.t('settings.no_data')}
      </Text>
    </View>
  );

  renderComponent = () => {
    const { addressList } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer]}>
          <TouchableOpacity
            style={[styles.headerButtonBox]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Image
              style={styles.headerLeftIcon}
              resizeMode="contain"
              source={require('../../assets/common/common_back.png')}
            />
          </TouchableOpacity>

          <View style={[styles.headerTitleBox]}>
            <Text style={styles.headerTitleText}>{I18n.t('settings.address_book')}</Text>
          </View>

          <TouchableOpacity style={[styles.headerButtonBox]} onPress={this.addContact}>
            <Image
              style={styles.headerRightIcon}
              resizeMode="contain"
              source={require('../../assets/set/add.png')}
            />
          </TouchableOpacity>
        </View>

        <SectionList
          style={styles.listContainer}
          sections={addressList}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={this._renderItemHeader}
          renderItem={this._renderItem}
          ListEmptyComponent={() => this._renderEmptyView(true)}
          ItemSeparatorComponent={() => this._renderItemSeparatorComponent(true)}
          getItemLayout={(data, index) => ({ length: 60, offset: (60 + 1) * index, index })}
        />
      </View>
    );
  };
}

class Item extends PureComponent {
  render() {
    const { info, onPressItem } = this.props || {};
    const item = info.item || {};

    return info.section.key === I18n.t('settings.recent_transfers') ? (
      <RecentAddressItem item={item} onPressItem={onPressItem} />
    ) : (
      <ContactItem item={item} onPressItem={onPressItem} />
    );
  }
}

class ContactItem extends PureComponent {
  render() {
    const { item, onPressItem } = this.props || {};
    const { name, address } = item || {};
    const letter = name.substr(0, 1);
    let _letter = `${letter}`;
    if (letter >= 'a' && letter <= 'z') {
      _letter = letter.toUpperCase();
    } else {
      _letter = letter;
    }
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        {...this.props}
        style={styles.item}
        onPress={onPressItem}
      >
        <LinearGradient
          colors={['#32beff', '#0095eb', '#2093ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.itemCircle}
        >
          <Text style={styles.itemLetter}>{_letter}</Text>
        </LinearGradient>

        <View style={styles.itemRightView}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemAddress}>{_address}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class RecentAddressItem extends PureComponent {
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
    if(symbol === 'ITG'){
      return require('../../assets/home/ITG.png');
    }
    if(symbol === 'USDT'){
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
    const { item, onPressItem } = this.props || {};
    const { address, symbol, time, iconLarge, name } = item || {};
    const { loadIconError } = this.state;
    const icon = this._getLogo(symbol, iconLarge);
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;
    const _addressTxt = name === '' ? _address : `${_address} (${name})`;
    const _time = `${time} +0800`;
    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.item} onPress={onPressItem}>
        <Image
          style={styles.rAItemIcon}
          iosdefaultSource={require('../../assets/home/null.png')}
          source={
            iconLarge === '' || loadIconError === true || symbol === 'ITC' || symbol === 'ITG' || symbol === 'USDT' || symbol === 'ETH'
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

        <View style={styles.itemRightView}>
          <Text style={styles.rAItemAddress}>{_addressTxt}</Text>
          <Text style={styles.rAItemTime}>{_time}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressListScreen);
