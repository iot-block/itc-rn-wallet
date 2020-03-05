import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { Colors, FontSize, Network } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import NetworkManager from '../../utils/NetworkManager';

const contentWidth = Layout.WINDOW_WIDTH * 0.9;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(248,248,248,0.8)',
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  boxView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  headerBox: {
    width: Layout.WINDOW_WIDTH,
    height: 160,
  },
  headerTitleBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH,
  },
  headerTitleTouch: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  headerTitleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: FontSize.HeaderSize,
    color: 'white',
    marginLeft: -40,
  },
  amountView: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  amountTxt: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },
  unitTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 5,
    marginBottom: 2,
  },
  whiteBox: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  whiteView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH - 40,
    height: 15,
  },

  contentBox: {
    width: Layout.WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    marginBottom: 20,
  },

  infoView: {
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH - 40,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  infoContent: {
    width: Layout.WINDOW_WIDTH - 70,
    paddingBottom: 15,
    // height:100,
  },
  vLine: {
    height: 1,
    width: Layout.WINDOW_WIDTH - 70,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  titleView: {
    width: Layout.WINDOW_WIDTH - 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  titleTxt: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemView: {
    width: Layout.WINDOW_WIDTH - 70,
    marginTop: 10,
    alignItems: 'center',
    // height:50,
  },
  itemTitle: {
    fontSize: 15,
    width: Layout.WINDOW_WIDTH - 70,
    color: Colors.fontBlackColor_43,
  },
  itemContent: {
    marginTop: 2,
    color: Colors.fontGrayColor_a,
    width: Layout.WINDOW_WIDTH - 70,
    fontSize: 11,
  },
  lineView: {
    width: Layout.WINDOW_WIDTH - 40,
    // borderBottomWidth:1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 5,
  },
  initiationAddressText: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
    marginTop: 5,
  },
  initiationAddressBox: {
    width: Layout.WINDOW_WIDTH - 70,
    alignSelf: 'center',
    alignItems: 'center',
  },
  initiationAddressContent: {
    width: Layout.WINDOW_WIDTH - 70,
    flexDirection: 'row',
    height: 30,
  },
  promptBox: {
    flex: 1,
  },
  promptTouch: {
    width: 40,
    height: 30,
    paddingLeft: 5,
    paddingTop: 6,
  },
  promptIcon: {
    width: 12,
    height: 12,
  },
  triangleIcon: {
    width: 12,
    height: 10,
    marginTop: -8,
    marginLeft: 5,
  },
  promptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.9)',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    zIndex: 999,
  },
  promptDesc: {
    fontSize: 13,
    color: 'white',
  },
  bottomView: {
    width: Layout.WINDOW_WIDTH - 70,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getHelpBtn: {
    width: 90,
    height: 30,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.themeColor,
    backgroundColor: 'transparent',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getHelpBtnText: {
    color: Colors.themeColor,
    fontSize: 13,
  },
  auditTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
  },
  auditContentText: {
    color: Colors.fontGrayColor_a,
    fontSize: 11,
    marginTop: 5,
  },
});

class MappingRecordDetailScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      status: -1,
      time: '',
      isShowPrompt: false,
      ethTxHash: '',
      itcTxHash: '',
      updateTime: '',
      itcReciveAddress: '',
      fromAddress: '',
      destoryAddress: '',
      fee: '',
      locationHeight:0
    };
    this.mappingDetail = null;
    this.ether = new BigNumber(Math.pow(10, 18));
    this._setStatusBarStyleLight();
  }

  componentWillMount() {
    super.componentWillMount()
    this._isMounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this._isMounted = false;
  }

  componentDidUpdate(){

    this.warnBtnView.measure((x,y,widht,height,left,top) => {
        
      if(!isNaN(Number(top))){

        this.setState({
          locationHeight:top+height-1
        })
      }
    })

  }

  _initData = async () => {
    this.mappingDetail = this.props.navigation.state.params.mappingDetail;
    this._showLoading();
    const tra = await NetworkManager.getTransaction(this.mappingDetail.ethTxHash);
    this._hideLoading();
    let fee = '';
    if (tra) {
      fee = `${tra.gas * parseFloat(tra.gasPrice) * Math.pow(10, -18)} ETH`;
    }
    const valueBN = new BigNumber(this.mappingDetail.value);
    this.setState({
      amount: parseFloat(valueBN.dividedBy(this.ether)).toFixed(4),
      // status: this.mappingDetail.status,
      status: this.mappingDetail.status === 0 ? 1 : this.mappingDetail.status,
      time: `${this.mappingDetail.createTime}+0800`,
      updateTime: `${this.mappingDetail.updateTime}+0800`,
      ethTxHash: this.mappingDetail.ethTxHash,
      itcTxHash: this.mappingDetail.itcTxHash || '',
      fromAddress: this.mappingDetail.ethAddress,
      destoryAddress: this.mappingDetail.destoryAddress,
      itcReciveAddress: (this.mappingDetail.itcAddress.indexOf('ITC')>-1)?this.mappingDetail.itcAddress:'ITC'+this.mappingDetail.itcAddress.replace('0x',''),
      fee,
    });
  };

  warnBtn = () => {
    const isShow = this.state.isShowPrompt;
    this.setState({
      isShowPrompt: !isShow,
    });
  };

  goBackBtn = () => {
    this.props.navigation.goBack();
  };

  onGetHelp = () => {
    const content = `1. Erc20 address【${this.mappingDetail.ethAddress}】
2. Swap address【${this.mappingDetail.destoryAddress}】
3. Txhash【${this.mappingDetail.ethTxHash}】`;
    this.props.navigation.navigate('Feedback', { content });
  };

  getBottomView = status => {
    switch (status) {
      case 0:
        return (
          <ItemView
            title={I18n.t('mapping.transfer_unsuccess_title')}
            content={I18n.t('mapping.transfer_unsuccess_desc')}
          />
        );
      case 1:
      case 2:
        return (
          <View style={styles.bottomView}>
            <Text style={styles.auditTitle}>{I18n.t('mapping.auditing')}</Text>
            {/* <Text style={styles.auditContentText}>{I18n.t('mapping.delay_time')}</Text> */}
          </View>
        );
      case 4:
        return (
          <View style={styles.bottomView}>
            <Text style={styles.auditTitle}>{I18n.t('mapping.audit_error')}</Text>
            <TouchableOpacity style={styles.getHelpBtn} onPress={this.onGetHelp}>
              <Text style={styles.getHelpBtnText}>{I18n.t('mapping.get_help')}</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  onTxHashClick = () => {
    let detailUrl;
    if (this.props.network === Network.rinkeby) {
      detailUrl = `https://rinkeby.etherscan.io/tx/${this.state.ethTxHash}`;
    } else if (this.props.network === Network.main) {
      detailUrl = `https://etherscan.io/tx/${this.state.ethTxHash}`;
    }

    Linking.canOpenURL(detailUrl)
      .then(supported => {
        if (!supported) {
          // todo 弹toast
          return null;
          // console.warn('Can\'t handle url: ' + detailUrl);
        }
        return Linking.openURL(detailUrl);
      })
      .catch(err => console.log('An error occurred', detailUrl, ' err:', err));
  };

  renderComponent = () => {
    let headerMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      headerMarginTop = { marginTop: 48 };
    }
    const headerBg = require('../../assets/home/top_bg.png');

    const info1IsDone = this.state.status !== 0;
    const info2IsDone = this.state.status === 3;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ImageBackground style={styles.headerBox} source={headerBg}>
            <View style={styles.headerTitleBox}>
              <TouchableOpacity
                style={[styles.headerTitleTouch, headerMarginTop]}
                onPress={this.goBackBtn}
              >
                <Image
                  style={styles.backIcon}
                  resizeMode="center"
                  source={require('../../assets/common/common_back_white.png')}
                />
              </TouchableOpacity>
              <View style={[styles.headerTitleView, headerMarginTop]}>
                <Text style={styles.headerTitle}>{I18n.t('mapping.mapping_record')}</Text>
              </View>
            </View>
            <View style={styles.amountView}>
              <Text style={styles.amountTxt}>{this.state.amount}</Text>
              <Text style={styles.unitTxt}>ITC</Text>
            </View>
            <View style={styles.whiteBox}>
              <View style={styles.whiteView} />
            </View>
          </ImageBackground>
          <View style={[styles.contentBox]}>
            <View style={[styles.infoView]}>
              <View style={[styles.infoContent]}>
                <TitleView isCompleted={info1IsDone} content={I18n.t('mapping.destroy_itc')} />
                <View style={styles.vLine} />
                <ItemView
                  title={`${I18n.t('mapping.send_address')}(Erc20)`}
                  content={this.state.fromAddress}
                />
                <View style={[styles.itemView, { zIndex: 2 }]}>
                  <View style={styles.initiationAddressBox}>
                    <View style={styles.initiationAddressContent}>
                      <Text style={styles.initiationAddressText}>
                        {I18n.t('mapping.dedicated_mapping_address')}
                      </Text>
                      <View style={styles.promptBox} ref='location'>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          style={styles.promptTouch}
                          onPress={this.warnBtn}
                          ref={(ref)=>this.warnBtnView=ref}
                        >
                          <Image
                            style={styles.promptIcon}
                            source={require('../../assets/mapping/sighIcon.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        {this.state.isShowPrompt ? (
                          <Image
                            style={styles.triangleIcon}
                            source={require('../../assets/common/up_triangle.png')}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>
                    </View>
                    <Text style={styles.itemContent}>{this.state.destoryAddress}</Text>
                  </View>
                </View>
                <ItemView title={I18n.t('transaction.miner_fee')} content={this.state.fee} />
                <Text style={styles.itemTitle}>TxHash</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={this.onTxHashClick}>
                  <Text
                    style={{ color: Colors.fontBlueColor, fontSize: 11 }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {this.state.ethTxHash}
                  </Text>
                </TouchableOpacity>
                {/* <ItemView title="TxHash" content={this.state.ethTxHash} /> */}
                <ItemView title={I18n.t('mapping.transaction_hour')} content={this.state.time} />
              </View>
              <Line type={3} />
            </View>
            <View
              style={[
                styles.infoView,
                { marginTop: 15, paddingTop: 15, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
              ]}
            >
              <View style={[styles.infoContent]}>
                <TitleView
                  isCompleted={info2IsDone}
                  content={I18n.t('mapping.native_itc_issuance')}
                />
                <View style={styles.vLine} />
                {this.state.status === 3 ? (
                  <View>
                    <ItemView
                      title={I18n.t('mapping.collection_address')}
                      content={this.state.itcReciveAddress}
                    />
                    <ItemView title="TxHash" content={this.state.itcTxHash} />
                    <ItemView
                      title={I18n.t('mapping.transaction_hour')}
                      content={this.state.updateTime}
                    />
                  </View>
                ) : (
                  this.getBottomView(this.state.status)
                )}
              </View>
              <Line type={this.state.status} />
            </View>
          </View>
          {this.state.isShowPrompt ? (
                      <View style={[styles.promptDescView,{marginTop:this.state.locationHeight}]}>
                        <Text style={styles.promptDesc}>
                          {I18n.t('mapping.dedicated_mapping_address_desc')}
                        </Text>
                      </View>
            ) : null}
        </ScrollView>
      </View>
    );
  };
}

class ItemView extends PureComponent {
  render() {
    const { title, content } = this.props;
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemContent}>{content}</Text>
      </View>
    );
  }
}

class TitleView extends PureComponent {
  render() {
    const { isCompleted, content } = this.props;
    const titleIcon = isCompleted
      ? require('../../assets/mapping/doneIcon.png')
      : require('../../assets/mapping/ingIcon.png');
    return (
      <View style={styles.titleView}>
        <Image style={styles.titleIcon} resizeMode="center" source={titleIcon} />
        <Text style={styles.titleTxt}>{content}</Text>
      </View>
    );
  }
}

class Line extends PureComponent {
  render() {
    const { type } = this.props;
    let bgColor = '#fff';
    switch (type) {
      // case 0:
      //   bgColor = '#fff';
      //   break;
      case 3:
        bgColor = '#95C06D';
        break;
      default:
        bgColor = '#0094ff';
    }
    return (
      /* <LinearGradient
                style={[styles.lineView,{borderColor:type == 2 ? '#95C06D' : type == 1 ? '#0094ff' : '#fff'}]}
                colors={type == 2 ? ['#95C06D', '#6F9D44'] : type == 1 ? ['#0094ff', '#66ceff'] : ['#000', '#fff']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}>
            </LinearGradient> */
      <View
        style={[
          styles.lineView,
          {
            borderColor: bgColor,
            backgroundColor: bgColor,
          },
        ]}
      />
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
  network: state.Core.network,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MappingRecordDetailScreen);
