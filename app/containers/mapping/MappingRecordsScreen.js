import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import BigNumber from 'bignumber.js';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import NetworkManager from '../../utils/NetworkManager';
import { showToast } from '../../utils/Toast';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  descBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  descTitleBox: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  descTitleIcon: {
    height: 14,
    width: 14,
    marginLeft: 10,
    marginRight: 5,
  },
  descTitle: {
    flex: 1,
    height: 28,
    lineHeight: 28,
    fontSize: 14,
    color: 'white',
    marginTop: 2,
  },
  descAddress: {
    fontSize: 14,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  changeBox: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  changeText: {
    height: 30,
    lineHeight: 30,
    fontSize: 13,
    color: 'white',
  },
  changeIcon: {
    height: 10,
    width: 10,
    paddingLeft: 3,
    paddingRight: 10,
  },

  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    marginBottom: 20,
  },

  item: {
    width: Layout.WINDOW_WIDTH * 0.9,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
  },

  itemContentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemConetntLeftView: {
    flex: 1,
  },
  itemAmount: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
  },
  itemTime: {
    color: Colors.fontGrayColor_a,
    fontSize: 13,
    marginTop: 2,
  },
  itemStatus: {
    fontSize: 15,
  },
  progresView: {
    height: 24,
    width: Layout.WINDOW_WIDTH * 0.9 - 30,
    justifyContent: 'center',
    paddingTop: 15,
    paddingLeft: 0,
    paddingRight: 0,
    alignSelf: 'center',
  },
  emptyListContainer: {
    marginTop: 120,
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
  itemSeparator: {
    height: 5,
    width: Layout.WINDOW_WIDTH * 0.9,
    backgroundColor: 'transparent',
  },
});
class MappingRecordsScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      mappingRecords: [],
      nativeReceiveAddress: '', // 原生itc接收地址
      isRefreshing:false
    };
    this.flatList = React.createRef();
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _initData = async () => {
    const { convertAddress } = this.props.navigation.state.params;
    this.setState({
      nativeReceiveAddress: 'ITC'+convertAddress.itcAddress.replace('0x',''),
    });
    this._showLoading();
    try {
      const rsp = await NetworkManager.queryConvertTxList({
        itcAddress: convertAddress.itcAddress,
      });
      if (rsp.code === 200) {
        this.setState({
          mappingRecords: rsp.data.reverse(),
        });
      } else {
        showToast(rsp.msg);
      }
    } catch (e) {
      console.log(' queryConvertTxList error:', e);
    }
    this._hideLoading();
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
      <Text style={styles.emptyListText}>{I18n.t('settings.no_data')}</Text>
    </View>
  );

  _renderItem = item => <Item item={item} onPressItem={() => this._onPressItem(item)} />;

  _onPressItem = item => {
    const mappingDetail = item.item;
    this.props.navigation.navigate('MappingRecordDetail', { mappingDetail });
  };

  _onChaneAddressPress = () => {
    this.props.navigation.navigate('ChangeBindAddress', {
      callback() {
        // const itcWallet = data.itcWallet;
      },
    });
  };

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('mapping.mapping_record')} />
      <LinearGradient
        style={styles.descBox}
        colors={['rgba(63, 193, 255, 0.8)', 'rgba(63, 193, 255, 0.8)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.descTitleBox}>
          <Image
            style={styles.descTitleIcon}
            source={require('../../assets/mapping/linkIcon.png')}
            resizeMode="contain"
          />
          <Text style={styles.descTitle}>{I18n.t('mapping.native_itc_receive_address')}</Text>
          {/* <TouchableOpacity
            activeOpacity={0.6}
            style={styles.changeBox}
            onPress={this._onChaneAddressPress}
          >
            <Text style={styles.changeText}>{I18n.t('mapping.change')}</Text>
            <Image
              style={styles.changeIcon}
              source={require('../../assets/common/back_white.png')}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>
        <Text style={styles.descAddress}>{this.state.nativeReceiveAddress}</Text>
      </LinearGradient>
      <FlatList
        style={styles.listContainer}
        ref={this.flatList}
        data={this.state.mappingRecords}
        keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmptyView}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        // getItemLayout={(data, index) => ({ length: 60, offset: (60 + 1) * index, index })}
        refreshControl={
          <RefreshControl
            onRefresh={this.onRefresh}
            refreshing={this.state.isRefreshing}
            tintColor={Colors.themeColor}
          />
        }
      />
    </View>
  );

  onRefresh = async () => {

    this.setState({
      isRefreshing: true
    });
    await this._initData();
    this.setState({
      isRefreshing: false
    });
  };
}

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.ether = new BigNumber(Math.pow(10, 18));
  }

  _status = status => {
    if (status === 0) {
      return I18n.t('mapping.already_applied');
    }
    if (status === 1 || status === 2) {
      return I18n.t('mapping.in_the_audit');
    }
    if (status === 3) {
      return I18n.t('mapping.completed');
    }
    return I18n.t('mapping.audit_error');
  };

  render() {
    // status 0 已申请 1 申请中  2 已完成
    const { item, onPressItem } = this.props || {};
    const { value, createTime, status } = item.item || {};
    const valueBN = new BigNumber(value);
    const amountTxt = `${parseFloat(valueBN.dividedBy(this.ether)).toFixed(4)} ITC`;
    const timeTxt = createTime;
    const statusTxt = this._status(status);
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        {...this.props}
        style={[styles.item, { height: 60 }]}
        onPress={onPressItem}
      >
        <View style={[styles.itemContentView]}>
          <View style={styles.itemConetntLeftView}>
            <Text style={styles.itemAmount}>{amountTxt}</Text>
            <Text style={styles.itemTime}>{timeTxt}</Text>
          </View>
          <Text
            style={[
              styles.itemStatus,
              { color: status === 3 ? Colors.fontGreenColor_46 : Colors.fontGrayColor_a },
            ]}
          >
            {statusTxt}
          </Text>
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
)(MappingRecordsScreen);
