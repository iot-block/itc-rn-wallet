import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH * 0.9,
    paddingTop: 12,
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
    borderRadius: 5,
    borderColor: Colors.borderColor_e,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  itemCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 12,
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
    height: 12,
    backgroundColor: 'transparent',
  },
});

class ContactListScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表数据
    };

    this.from = undefined; // 从哪个页面跳转过来的
    this.flatList = React.createRef();
  }

  _initData = () => {
    this.from = this.props.navigation.state.params.from;
    this.loadContactData();
  };

  loadContactData() {
    // let contactData = await StorageManage.loadAllDataForKey(StorageKey.Contact)
    const contactData = this.props.contactList;
    this.setState({
      data: contactData,
    });
  }

  _onPressItem = item => {
    const _this = this;
    // this.props.navigation.navigate('',{contactInfo:item.item,index:item.index});
    if (this.from === 'transaction') {
      // 返回转账页面
      this.props.navigation.state.params.callback({ toAddress: item.item.address });
      this.props.navigation.goBack();
    } else {
      // 跳转到联系人详情页
      this.props.navigation.navigate('ContactInfo', {
        contactInfo: item.item,
        index: item.index,
        callback() {
          _this.loadContactData();
        },
      });
    }
  };

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  // 空布局
  _renderEmptyView = () => (
    <View style={styles.emptyListContainer}>
      <Image
        style={styles.emptyListIcon}
        source={require('../../assets/common/no_icon.png')}
        resizeMode="contain"
      />
      <Text style={styles.emptyListText}>{I18n.t('settings.no_contact')}</Text>
    </View>
  );

  _renderItem = item => <FlatListItem item={item} onPressItem={() => this._onPressItem(item)} />;

  addContact = async () => {
    const _this = this;
    this.props.navigation.navigate('CreateContact', {
      callback() {
        _this.loadContactData();
      },
    });
  };

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={I18n.t('settings.address_book')}
        rightPress={() => this.addContact()}
        rightIcon={require('../../assets/set/add.png')}
      />
      <FlatList
        style={styles.listContainer}
        ref={this.flatList}
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmptyView}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        getItemLayout={(data, index) => ({ length: 60, offset: (60 + 10) * index, index })}
      />
    </View>
  );
}

class FlatListItem extends PureComponent {
  render() {
    const { item, onPressItem } = this.props || {};
    const { name, address } = item.item || {};
    const letter = name.substr(0, 1);
    let _letter = `${letter}`;
    if (letter >= 'a' && letter <= 'z') {
      _letter = letter.toUpperCase();
    } else {
      _letter = letter;
    }
    const _address = `${address.substr(0, 8)}......${address.substr(34, 42)}`;
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

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactListScreen);
