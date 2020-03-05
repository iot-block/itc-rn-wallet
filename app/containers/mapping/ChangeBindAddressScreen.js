import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  contentDescBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    // height: 40,
    borderRadius: 5,
    backgroundColor: Colors.bg_blue,
    justifyContent: 'center',
    marginTop: 20,
    // marginBottom: 20,
  },
  contentDescText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },

  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    height: Layout.DEVICE_IS_IPHONE_X() ? 100 : 80,
    backgroundColor: 'white',
    paddingBottom: Layout.DEVICE_IS_IPHONE_X() ? 20 : 0,
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row',
    height: 66,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
  },
  itemConetntView: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemBindName: {
    fontSize: 15,
    color: Colors.fontGrayColor_a1,
  },
  itemAddress: {
    fontSize: 13,
    color: Colors.fontGrayColor_a1,
    marginTop: 2,
  },
  itemCheckedImg: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  itemSeparator: {
    height: 1,
    width: Layout.WINDOW_WIDTH - 20,
    backgroundColor: Colors.bgGrayColor_ed,
    alignSelf: 'center',
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
});

class ChangeBindAddressScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      itcWallets: [],
      isDisabled: true,
      selectedWallet: null,
    };
    this.flatList = React.createRef();
  }

  _initData = () => {
    const { itcWalletList } = this.props;
    const { chosedItcWallet } = this.props.navigation.state.params;
    this.setState({
      itcWallets: itcWalletList,
      selectedWallet: chosedItcWallet,
    });
  };

  confirmBtn() {
    const { selectedWallet } = this.state;
    this.props.navigation.state.params.callback({ itcWallet: selectedWallet });
    this.props.navigation.goBack();
    // this.props.navigation.navigate('BindWalletAddress')
  }

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
      <Text style={styles.emptyListText}>{I18n.t('settings.no_data')}</Text>
    </View>
  );

  _renderItem = item => (
    <Item
      item={item}
      choseWalletAddress={
        this.state.selectedWallet === null ? '' : this.state.selectedWallet.address
      }
      onPressItem={() => this._onPressItem(item)}
    />
  );

  _onPressItem = item => {
    const choseWallet = item.item;
    const { selectedWallet } = this.state;
    if (
      selectedWallet === null ||
      selectedWallet.address.toUpperCase() !== choseWallet.address.toUpperCase()
    ) {
      this.setState({
        selectedWallet: choseWallet,
        isDisabled: false,
      });
    } else {
      this.setState({
        selectedWallet: null,
        isDisabled: true,
      });
    }
  };

  renderComponent = () =>{

    let newList = []
    
    for (const idx in this.state.itcWallets) {
      
        newList.push({
          ...this.state.itcWallets[idx],
          key:idx
        })
    }

    return(

      <View style={styles.container}>
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.binding_replace_address')}
        />
        <View style={styles.contentBox}>
          <LinearGradient
            style={styles.contentDescBox}
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.contentDescText}>
              {I18n.t('mapping.binding_replace_address_desc')}
            </Text>
          </LinearGradient>
          <FlatList
            style={styles.listContainer}
            ref={this.flatList}
            data={newList}
            keyExtractor={(item, index) => item.key} // 给定的item生成一个不重复的key
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmptyView}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
            // getItemLayout={(d, index) => ({ length: 80, offset: (80 + 1) * index, index })}
          />
        </View>
  
        <View style={styles.bottomBox}>
          <BlueButtonBig
            isDisabled={this.state.isDisabled}
            onPress={() => this.confirmBtn()}
            text={I18n.t('transaction.determine')}
          />
        </View>
      </View>
    );
  } 
}

class Item extends PureComponent {
  render() {
    const { item, choseWalletAddress, onPressItem } = this.props || {};
    const { name, address, bind } = item.item || {};

    const _name = bind ? name + I18n.t('mapping.bind') : name;
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;

    const checkIcon =
      choseWalletAddress.toUpperCase() === address.toUpperCase()
        ? require('../../assets/launch/check_on.png')
        : require('../../assets/launch/check_off.png');
    const icon = bind ? require('../../assets/mapping/bind_icon.png') : checkIcon;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        {...this.props}
        style={styles.item}
        onPress={onPressItem}
        disabled={bind}
      >
        <View style={styles.itemConetntView}>
          <Text style={bind ? styles.itemBindName : styles.itemName}>{_name}</Text>
          <Text style={styles.itemAddress}>{_address}</Text>
        </View>
        <Image style={styles.itemCheckedImg} source={icon} resizeMode="center" />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
  itcWalletList: state.Core.itcWalletList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeBindAddressScreen);
