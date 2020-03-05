import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { WhiteBgNoBackHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import { BlueButtonBig } from '../../components/Button';
import StatusBarComponent from '../../components/StatusBarComponent';
import store from '../../config/store/ConfigureStore';
import { setCreateWalletParams } from '../../config/action/Actions';
import StorageManage from '../../utils/StorageManage';

const rightViewHeight = Layout.WINDOW_HEIGHT - 100 - 48 - (Layout.DEVICE_IS_IPHONE_X() ? 118 : 64);
const stepItemWidth = Layout.WINDOW_WIDTH - 50 - 20;
const stepItemHeight = rightViewHeight / 3;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  contentBox: {
    flex: 1,
    marginTop: 20,
  },
  contentView: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
  },
  contentLeft: {
    width: 50,
    marginTop: 6,
    //  backgroundColor: 'yellow'
  },
  contentRight: {
    flex: 1,
    marginRight: 20,
  },
  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    alignItems: 'center',
    // backgroundColor: 'white',
    // todo height: 120,
    // height: 100,
    margin: 0,
    padding: 0,
  },
  checkBox: {
    flexDirection: 'row',
    // justifyContent: 'center',
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    marginTop: 30,
  },
  checkBtn: {
    width: 30,
    height: 30,
    flexDirection: 'row',
    // justifyContent: 'center',
    // width: 200,
    alignSelf: 'center',
  },
  checkImage: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 8,
  },
  checkText: {
    // width: 150,
    color: Colors.fontBlueColor,
    fontSize: 14,
  },
  button: {
    // width:Layout.WINDOW_WIDTH*0.8,
    width: Layout.WINDOW_WIDTH * 0.9,
    marginTop: 20,
    marginBottom: 20,
    padding: 0,
    alignSelf: 'center',
  },

  stepItemBox: {
    width: stepItemWidth,
    // height: stepItemHeight,
    marginRight: 20,
    alignItems: 'center',
  },
  stepItemTitleBox: {
    width: stepItemWidth,
    height: 32,
    flexDirection: 'row',
  },
  stepItemBgArrow: {
    width: 15,
    height: 24,
    alignSelf: 'center',
  },
  stepItemTitleBg: {
    width: stepItemWidth - 10,
    height: 32,
    borderRadius: 5,
    marginLeft: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItemTitle: {
    width: stepItemWidth - 40,
    lineHeight: 32,
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    paddingLeft: 10,
    paddingRight: 5,
  },
  stepItemBgDesc: {
    color: Colors.fontBlackColor_43,
    fontSize: 14,
    width: stepItemWidth - 50,
    marginTop: 10,
  },
  stepItemImg: {
    marginTop: 10,
    width: stepItemWidth - 100,
    height: ((stepItemWidth - 100) / 212) * 54,
  },

  liItemBox: {
    width: 60,
    // height: stepItemHeight,
    alignItems: 'center',
  },
  liItemNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3fc1ff',
  },
  liItemNumText: {
    fontSize: 14,
    color: 'white',
  },
  liItemLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#D7F0FF',
  },
  modeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(179,179,179,0.8)',
  },
  modeContentBox: {
    backgroundColor: 'white',
    flexDirection: 'column',
    borderRadius: 6,
    paddingTop: 15,
    paddingBottom: 30,
    width: Layout.WINDOW_WIDTH * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCanceBox: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
  },
  modalCancelIcon: {
    width: 19,
    height: 18,
  },
  modalIcon: {
    width: 80,
    height: 80,
  },
  modalTitleTxt: {
    width: Layout.WINDOW_WIDTH * 0.7,
    fontSize: 16,
    color: Colors.fontBlackColor,
    marginTop: 20,
    textAlign: 'center',
  },
  modalContentTxt: {
    width: Layout.WINDOW_WIDTH * 0.7,
    fontSize: 14,
    color: Colors.fontBlackColor_43,
    marginTop: 12,
  },
  modalBtnBox: {
    width: Layout.WINDOW_WIDTH * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  modalLeftBtnBox: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.btn_bg_blue,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 5,
  },
  modalRightBtnBox: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.btn_bg_blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  modalLeftBtnText: {
    fontSize: 15,
    color: Colors.btn_bg_blue,
  },
  modalRightBtnText: {
    fontSize: 15,
    color: 'white',
  },
  linearGradient: {
    height: 40,
    alignSelf: 'stretch',
    borderRadius: 5,
  },
});

export default class MappingTermsScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
      stepItem1Height: 0,
      stepItem2Height: 0,
      modalVisible: false,
    };
    this._setStatusBarStyleDark();
    this.stepItem1Ref = React.createRef();
    this.stepItem2Ref = React.createRef();
  }

  isAgreePress = () => {
    const agree = this.state.isAgree;
    this.setState({ isAgree: !agree });
  };

  _initData = async () => {
    const enable = await StorageManage.load(StorageKey.MappingServiceAgreement);
    if (enable) {
      this.setState({
        isAgree: true,
      });
    }
  };

  // _onBackPressed = ()=>{
  //   console.log('重写安卓按钮返回事件')
  //   return true;
  // }

  startBtn = () => {
    
    const { itcWalletList } = store.getState().Core;
    if (!itcWalletList || itcWalletList.length <= 0) {
      this.setState({
        modalVisible: true,
      });
    } else {
      const { _this } = this.props;
      _this.props.navigation.navigate('BindWalletAddress');
    }
  };

  cancleModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  routeTo = toPage => {
    const { _this } = this.props;
    const params = {
      walletType: 'itc',
      from: 4,
    };
    this.setState({ modalVisible: false }, () => {
      store.dispatch(setCreateWalletParams(params));
      _this.props.navigation.navigate(toPage);
    });
  };


  componentWillMount(){
    super.componentWillMount()

    this._isMounted = true
  }

  componentWillUnmount(){
    super.componentWillUnmount()
    this._isMounted=false
  }

  renderComponent = () => (
    /* const checkIcon = this.state.isAgree
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png'); */
    <View style={styles.container}>
      <StatusBarComponent barStyle="light-content" />
      <WhiteBgNoBackHeader text={I18n.t('mapping.itc_mapping_service')} />

      <WarnModal
        modalVisible={this.state.modalVisible}
        cancleModalPress={this.cancleModal}
        importItcWalletModalPress={() => this.routeTo('ImportWallet')}
        createItcWalletModalPress={() => this.routeTo('CreateWallet')}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentBox}>
          <View style={styles.contentView}>
            <View style={styles.contentLeft}>
              <LiItem newHeight={this.state.stepItem1Height} num="1" />
              <LiItem newHeight={this.state.stepItem2Height} num="2" />
              <LiItem num="3" isShowLine={false} />
            </View>
            <View style={styles.contentRight}>
              <StepItem
                onLayout={e => {
                  const { height } = e.nativeEvent.layout;
                  this.setState({
                    stepItem1Height: height,
                  });
                }}
                title={`STEP 1: ${I18n.t('mapping.bind_map_address')}`}
                desc={I18n.t('mapping.bind_map_address_des')}
                image={require('../../assets/mapping/mappingStepOne.png')}
              />
              <StepItem
                onLayout={e => {
                  const { height } = e.nativeEvent.layout;
                  this.setState({
                    stepItem2Height: height,
                  });
                }}
                title={`STEP 2: ${I18n.t('mapping.application_mapping')}`}
                desc={I18n.t('mapping.application_mapping_des')}
                image={require('../../assets/mapping/mappingStepTwo.png')}
              />
              <StepItem
                title={`STEP 3: ${I18n.t('mapping.native_issuance')}`}
                desc={I18n.t('mapping.native_issuance_des')}
                image={require('../../assets/mapping/mappingStepThree.png')}
              />
            </View>
          </View>
          <View style={styles.bottomBox}>
            <View style={styles.checkBox}>
              <TouchableOpacity
                style={styles.checkBtn}
                activeOpacity={0.6}
                onPress={this.isAgreePress}
              >
                <Image
                  style={styles.checkImage}
                  source={
                    this.state.isAgree
                      ? require('../../assets/launch/check_on.png')
                      : require('../../assets/launch/check_off.png')
                  }
                  resizeMode="contain"
                />
                {/* <Text style={[styles.checkText, { color: 'black' }]}>
                  {I18n.t('mapping.read_and_agreed')}
                </Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  const { _this } = this.props;
                  _this.props.navigation.navigate('MappingServiceAgreement');
                  StorageManage.save(StorageKey.MappingServiceAgreement, true);
                }}
              >
                {/* <Text style={styles.checkText}>{I18n.t('mapping.read_and_agreed')}</Text> */}
                <Text style={styles.checkText}>{I18n.t('mapping.service_agreement')}</Text>
              </TouchableOpacity>
            </View>
            <BlueButtonBig
              buttonStyle={styles.button}
              isDisabled={!this.state.isAgree}
              onPress={this.startBtn}
              text={I18n.t('mapping.start')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

class LiItem extends PureComponent {
  static defaultProps = {
    isShowLine: true,
  };

  render() {
    const { num, isShowLine, newHeight } = this.props;
    return (
      <View style={[styles.liItemBox, { height: newHeight === 0 ? stepItemHeight : newHeight }]}>
        <View style={styles.liItemNum}>
          <Text style={styles.liItemNumText}>{num}</Text>
        </View>
        {isShowLine ? <View style={styles.liItemLine} /> : null}
      </View>
    );
  }
}

class StepItem extends PureComponent {
  render() {
    const { image, title, desc, onLayout } = this.props;
    return (
      <View onLayout={onLayout} style={styles.stepItemBox}>
        <View style={styles.stepItemTitleBox}>
          <Image
            style={styles.stepItemBgArrow}
            source={require('../../assets/mapping/leftTriangle.png')}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.stepItemTitleBg}
          >
            <Text style={styles.stepItemTitle} numberOfLines={1}>
              {title}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.stepItemBgDesc}>{desc}</Text>
        <Image style={styles.stepItemImg} source={image} resizeMode="contain" />
      </View>
    );
  }
}

class WarnModal extends PureComponent {
  render() {
    const {
      modalVisible,
      cancleModalPress,
      importItcWalletModalPress,
      createItcWalletModalPress,
    } = this.props;
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.modeContentBox}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.modalCanceBox}
              onPress={cancleModalPress}
            >
              <Image
                style={styles.modalCancelIcon}
                source={require('../../assets/common/cancel.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Image
              style={styles.modalIcon}
              source={require('../../assets/common/wal_warning.png')}
              resizeMode="contain"
            />
            <Text style={styles.modalTitleTxt}>{I18n.t('modal.no_itc_wallet_detected')}</Text>
            <Text style={styles.modalContentTxt}>
              {I18n.t('modal.create_import_itc_wallet_first')}
            </Text>
            <View style={styles.modalBtnBox}>
              <TouchableOpacity
                style={styles.modalLeftBtnBox}
                activeOpacity={0.6}
                onPress={importItcWalletModalPress}
              >
                <Text style={styles.modalLeftBtnText}>{I18n.t('launch.import')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRightBtnBox}
                activeOpacity={0.6}
                onPress={createItcWalletModalPress}
              >
                <Text style={styles.modalRightBtnText}>{I18n.t('launch.create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
