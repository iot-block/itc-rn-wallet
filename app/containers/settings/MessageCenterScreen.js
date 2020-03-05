import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text,
  Image,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import JPushModule from 'jpush-react-native';
import StorageManage from '../../utils/StorageManage';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import { addressToName } from '../../utils/CommonUtil';
import NetworkManager from '../../utils/NetworkManager';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    // marginTop: 12,
    backgroundColor: 'white',
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
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 25,
    paddingRight: 25,
  },
  itemContentBox: {
    flex: 1,
  },
  itemTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 16,
    height: 18,
    lineHeight: 18,
    width: Layout.WINDOW_WIDTH - 50,
  },
  itemAddress: {
    width: Layout.WINDOW_WIDTH - 50,
    color: Colors.fontGrayColor_a1,
    fontSize: 13,
  },
  itemTime: {
    width: Layout.WINDOW_WIDTH - 50,
    color: Colors.fontGrayColor_a1,
    fontSize: 13,
  },
  itemSeparator: {
    height: 1,
    // backgroundColor:'transparent',
    backgroundColor: Colors.bgGrayColor_ed,
    marginLeft: 15,
    marginRight: 15,
  },
  listFooter: {
    width: Layout.WINDOW_WIDTH * 0.9,
    height: 40,
    alignSelf: 'center',
  },
  listFooterText: {
    height: 40,
    lineHeight: 40,
    fontSize: 14,
    width: Layout.WINDOW_WIDTH * 0.9,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  loadMoreBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadMoreTouch: {
    height: 40,
    width: Layout.WINDOW_WIDTH * 0.6,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
    alignSelf: 'center',
  },
  loadMoreText: {
    textAlign: 'center',
    height: 40,
    lineHeight: 40,
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },
});

class MessageCenterScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表数据
      isRefreshing: false,
      isLoadMoreing: false,
    };

    this.page = 1;
    this.pageCount = 10; // 每页显示的10条数据
    this.haveNextPage = true; // 是否还有下一页
    this.callBackIsNeedRefresh = true;

    // this.unReadMessageCount = 0;
    this.userToken = {};
  }

  _initData = async () => {
    // this.unReadMessageCount = this.props.navigation.state.params.newMessageCounts;
    this.userToken = await StorageManage.load(StorageKey.UserToken);
    if (!this.userToken || this.userToken === null) {
      return;
    }
    this.loadData(true);
  };

  async loadData(isShowLoading) {
    if (isShowLoading) {
      this._showLoading();
    }
    const params = {
      userToken: this.userToken.userToken,
      page: this.page,
      size: this.pageCount,
    };
    NetworkManager.getMessageList(params)
      .then(response => {
        if (response.code === 200) {
          this.haveNextPage = response.data.haveNextPage;
          const list = response.data.messages;
          const meaasges = [];
          list.forEach(data => {
            const message = {};
            message.msgId = data.msgId;
            message.messageType = data.messageType; // (消息类型)  1-消息通知、2-公告
            message.readStatus = data.readStatus; // （消息状态） 1-未读、2-已读
            message.updateTime = data.updateTime;
            message.deviceToken = data.deviceToken;
            if (data.messageType === 1) {
              message.hashId = data.hashId;
              message.transactionType = data.transactionType; // （交易类型） 1-收款、2-转账
              message.status = data.status; // 1-成功、2失败
              message.symbol = data.symbol;
              message.fromAddress = data.fromAddress;
              message.toAddress = data.toAddress;
              message.transactionValue = data.transactionValue;
            } else if (data.messageType === 2) {
              message.alertTitle = data.alertTitle;
              message.alertSubTitle = data.alertSubTitle;
              message.contentUrl = data.contentUrl;
              message.sender = data.sender;
            }
            meaasges.push(message);
          });
          if (this.page === 1) {
            this.setState({
              data: meaasges,
            });
          } else {
            this.setState(prevState => ({
              data: prevState.data.concat(meaasges),
            }));
          }
        } else {
          Analytics.recordErr('getMessageListRspErr', response.msg);
        }
        this._hideLoading();
      })
      .catch(err => {
        Analytics.recordErr('getMessageListCatchErr', err);
        this._hideLoading();
      });
  }

  _onRefresh = isShowLoading => {
    const showLoading = isShowLoading === undefined || isShowLoading;
    if (!this.userToken || this.userToken === null) {
      return;
    }
    if (!this.state.isRefreshing) {
      this.page = 1;
      this.loadData(showLoading);
    }
  };

  _pulldownRefresh = () => {
    if (!this.userToken || this.userToken === null) {
      return;
    }
    if (!this.state.isRefreshing) {
      this.setState({
        isRefreshing: true,
      });

      this.page = 1;
      this.loadData(false);

      this.setState({
        isRefreshing: false,
      });
    }
  };

  _onLoadMore = () => {
    if (!this.userToken || this.userToken === null) {
      return;
    }
    // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
    // if (!this.state.isLoadMoreing && this.haveNextPage) {
    if (this.haveNextPage) {
      this.setState({
        isLoadMoreing: true,
      });
      this.page = this.page + 1;
      this.loadData(true);

      this.setState({
        isLoadMoreing: true,
      });
    }
  };

  _onPressItem = item => {
    try {
      if (item.item.readStatus === 1) {
        this.callBackIsNeedRefresh = true;
        this._readMessage(item.item.msgId);
      } else {
        this.callBackIsNeedRefresh = false;
      }

      if (item.item.messageType === 1) {
        this._showLoading();
        this.transactionNotification(item.item);
      } else if (item.item.messageType === 2) {
        this.announcement(item.item);
      }
    } catch (err) {
      Analytics.recordErr('messageItemClick', err);
      this._hideLoading();
    }
  };

  _readMessage = async msgId => {
    if (!this.userToken || this.userToken === null) {
      return;
    }
    const params = {
      userToken: this.userToken.userToken,
      msgId,
    };
    NetworkManager.readMessage(params)
      .then(response => {
        if (response.code === 200) {
          // todo
          // JPushModule.clearNotificationById(msgId);
          this.getMessageCount();
          this._onRefresh(false);
        } else {
          Analytics.recordErr('readMessageRspErr', response.msg);
        }
      })
      .catch(err => {
        Analytics.recordErr('readMessageCatchErr', err);
        this._hideLoading();
      });
  };

  // 获取未度消息数
  async getMessageCount() {
    const userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      return;
    }
    const params = {
      userToken: userToken.userToken,
    };
    NetworkManager.getUnReadMessageCount(params)
      .then(response => {
        if (response.code === 200) {
          const messageCount = response.data.account;
          // ios
          if (Platform.OS === 'ios') {
            JPushModule.setBadge(messageCount, () => {});
          }
          DeviceEventEmitter.emit('messageCount', {
            messageCount,
          });
        } else {
          Analytics.recordErr('getUnReadMessageCountRspErr', response.msg);
        }
      })
      .catch(err => {
        Analytics.recordErr('getUnReadMessageCountCatchErr', err);
        this._hideLoading();
      });
  }

  _onBackPressed = () => {
    this.props.navigation.goBack();
    return true;
  };

  backPressed() {
    this.props.navigation.goBack();
  }

  // 交易通知
  async transactionNotification(item) {
    const itemSymbol = item.symbol.toUpperCase();
    const isHaveToken = await this.routeToTransactionRecoder(item);
    if (!isHaveToken) {
      const { allTokens } = this.props;
      let isMatchToken = false;
      let tokenInfo = null;
      for (let i = 0; i < allTokens.length; i++) {
        const token = allTokens[i];
        if (token.symbol.toUpperCase() === itemSymbol) {
          isMatchToken = true;
          tokenInfo = {
            iconLarge: token.iconLarge,
            symbol: token.symbol,
            name: token.name,
            decimal: parseInt(token.decimal, 10),
            address: token.address,
          };
          break;
        }
      }
      if (isMatchToken) {
        // await this.saveTokenToStorage(tokenInfo)
        // await NetworkManager.loadTokenList()
        this.props.addToken(tokenInfo);
        await NetworkManager.getTokensBalance();
        await this.routeToTransactionRecoder(item);
      } else {
        this._hideLoading();
      }
    }
  }

  async routeToTransactionRecoder(item) {
    const sy = item.symbol.substring(0, 3).toUpperCase(); // itc(erc20)
    const itemSymbol = sy === 'ITC' ? sy : item.symbol.toUpperCase();
    const { tokens } = this.props;
    let isHaveToken = false;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.symbol.toUpperCase() === itemSymbol) {
        isHaveToken = true;
        const balanceInfo = {
          amount: token.balance,
          price: token.price,
          symbol: token.symbol,
          address: token.address,
          decimal: token.decimal,
        };
        this.props.setCoinBalance(balanceInfo);

        /* let transation = await NetworkManager.getTransaction(item.hashId);

        let status = 2;
        if (transation.isError == undefined || transation.isError == false) {
          status = 0;
        }
        if (status == 0) {
          let currentBlockNumber = await NetworkManager.getCurrentBlockNumber();
          if (currentBlockNumber - transation.blockNumber < 12) {
            status = 1;
          }
        } */

        // let address = transation.to.toLowerCase() == this.props.wallet.address.toLowerCase() ? transation.from : transation.to
        const address =
          item.fromAddress === this.props.wallet.address.toLowerCase()
            ? item.fromAddress
            : item.toAddress;
        const transactionDetail = {
          amount: parseFloat(item.transactionValue),
          transactionType: item.symbol.toUpperCase(),
          tranStatus: item.status === 2 ? 2 : 0,
          fromAddress: item.fromAddress, // transation.from,
          toAddress: item.toAddress, // transation.to,
          gasPrice: '',
          transactionHash: item.hashId, // transation.hash,
          blockNumber: '', // transation.blockNumber,
          transactionTime: `${item.updateTime} +0800`,
          remark: I18n.t('transaction.no'),
          name: addressToName(address, this.props.contactList),
        };

        this._hideLoading();
        this.props.setTransactionDetailParams(transactionDetail);
        this.props.navigation.navigate('TransactionDetail');
        break;
      }
    }
    return isHaveToken;
  }

  // 公告
  announcement(item) {
    this.props.navigation.navigate('MessageWebView', {
      url: item.contentUrl,
      title: item.alertTitle,
      callback() {},
    });
  }

  // read all
  _readAll = async () => {
    if (!this.userToken || this.userToken === null) {
      return;
    }
    this._showLoading();
    const params = {
      userToken: this.userToken.userToken,
    };
    NetworkManager.readAllMessage(params)
      .then(response => {
        if (response.code === 200) {
          // JPushModule.clearAllNotifications();
          // ios
          if (Platform.OS === 'ios') {
            JPushModule.setBadge(0, () => {});
          }
          DeviceEventEmitter.emit('messageCount', { messageCount: 0 });
          this._onRefresh(false);
        } else {
          Analytics.recordErr('readAllMessageRspErr', response.msg);
        }
        this._hideLoading();
      })
      .catch(err => {
        Analytics.recordErr('readAllMessageCatchErr', err);
        this._hideLoading();
      });
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
      <Text style={styles.emptyListText}>{I18n.t('settings.no_message')}</Text>
    </View>
  );

  _listFooterView = () =>
    this.haveNextPage ? (
      <View style={styles.loadMoreBox}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.loadMoreTouch}
          onPress={this._onLoadMore}
        >
          <Text style={styles.loadMoreText}>Load more</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.listFooter}>
        <Text style={styles.listFooterText}>{I18n.t('settings.no_more_data')}</Text>
      </View>
    );

  _renderItem = item => <Item item={item} onPressItem={() => this._onPressItem(item)} />;

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={I18n.t('settings.message_center')}
        leftPress={() => this.backPressed()}
        rightPress={() => this._readAll()}
        rightText={I18n.t('settings.read_all')}
      />
      <FlatList
        style={styles.listContainer}
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
        renderItem={this._renderItem}
        ListEmptyComponent={this._renderEmptyView}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        // getItemLayout={(data, index) => ({ length: 80, offset: (80 + 1) * index, index })}
        refreshControl={
          <RefreshControl
            onRefresh={this._pulldownRefresh} // 下拉刷新
            refreshing={this.state.isRefreshing}
            colors={[Colors.themeColor]}
            tintColor={Colors.whiteBackgroundColor}
          />
        }
        // onEndReachedThreshold={0.1}
        // onEndReached={this._onLoadMore} // 加载更多
        ListFooterComponent={
          this.state.data && this.state.data.length > 0 ? this._listFooterView : null
        }
      />
    </View>
  );
}

class Item extends PureComponent {
  render() {
    const { item, onPressItem } = this.props || {};
    const { messageType, updateTime, readStatus } = item.item || {};
    let title = '';
    let content = '';

    if (messageType === 1) {
      const { transactionType, status, symbol, fromAddress, toAddress, transactionValue } =
        item.item || {};
      const title1 =
        transactionType === 1
          ? I18n.t('settings.receipt_notice')
          : I18n.t('settings.transfer_notice');
      const title2 = `${transactionValue + symbol.toUpperCase()} `;
      const title3Tran =
        status === 1 ? I18n.t('settings.successful_transfer') : I18n.t('settings.transfer_failed');
      const title3 = transactionType === 2 ? title3Tran : I18n.t('settings.successful_payment');
      title = title1 + title2 + title3;

      const address = transactionType === 1 ? fromAddress : toAddress;
      const content1 =
        transactionType === 1 ? I18n.t('settings.sender') : I18n.t('settings.receiver');
      content = `${content1 + address.substr(0, 8)}......${address.substr(34, 42)}`;
    } else if (messageType === 2) {
      const { alertSubTitle, sender } = item.item || {};
      title = I18n.t('settings.announcement') + alertSubTitle;
      content = sender;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={[styles.item, { backgroundColor: readStatus === 2 ? 'white' : Colors.bg_blue }]}
        onPress={onPressItem}
      >
        <View style={styles.itemContentBox}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.itemAddress} numberOfLines={1}>
            {content}
          </Text>
          <Text style={styles.itemTime} numberOfLines={1}>
            {updateTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  allTokens: state.Core.allTokens,
  tokens: state.Core.tokens,
  contactList: state.Core.contactList,
  wallet: state.Core.wallet,
});
const mapDispatchToProps = dispatch => ({
  setCoinBalance: balanceInfo => dispatch(Actions.setCoinBalance(balanceInfo)),
  setTransactionDetailParams: transactionDetail =>
    dispatch(Actions.setTransactionDetailParams(transactionDetail)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageCenterScreen);
