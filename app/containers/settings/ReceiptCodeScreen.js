import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Clipboard,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Layout from '../../config/LayoutConstants';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import { androidPermission } from '../../utils/PermissionsAndroid';
import { TransparentBgHeader } from '../../components/NavigaionHeader';
import { Colors, StorageKey, Network } from '../../config/GlobalConfig';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import store from '../../config/store/ConfigureStore';
import { setFirstQR } from '../../config/action/Actions';
import StorageManage from '../../utils/StorageManage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    paddingTop: 30,
    width: Layout.WINDOW_WIDTH * 0.82,
    alignItems: 'center',
  },
  qrCodeBox: {
    width: Layout.WINDOW_WIDTH * 0.82 - 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoIcon: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -20,
    zIndex: 10,
  },
  titleTxt: {
    fontSize: 15,
    color: Colors.fontDarkColor,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 55,
  },
  qrCode: {
    width: 180,
    height: 180,
    backgroundColor: Colors.bgGrayColor,
  },
  adderssTxt: {
    width: 180,
    fontSize: 14,
    marginTop: 15,
    color: Colors.fontBlackColor,
  },
  btnImageBackground: {
    alignItems: 'center',
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH * 0.82 - 3,
    height: Layout.WINDOW_WIDTH * 0.82 * 0.22,
    marginTop: -1,
    // alignSelf: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 20,
  },
  btnOpacity: {
    // backgroundColor:'transparent',
    width: Layout.WINDOW_WIDTH * 0.82,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 16,
    color: Colors.fontBlueColor,
    fontWeight: '500',
    marginTop: 20,
  },
  itcBox: {
    width: Layout.WINDOW_WIDTH * 0.82,
    alignSelf: 'center',
  },
  itcTextWarn: {
    width: Layout.WINDOW_WIDTH * 0.82,
    color: 'white',
    fontSize: 13,
  },
});

class ReceiptCodeScreen extends BaseComponent {
  /** static navigationOptions=({navigation}) => ({
        header:(<WhiteBgHeader navigation={navigation} 
                              text='收款码'
                              rightPress = {()=>navigation.state.params.headRightPress()}
                              rightIcon= {require('../../assets/common/scanIcon.png')}/>
                )
    })
   
    componentDidMount(){
        //在初始化render之后只执行一次，在这个方法内，可以访问任何组件，componentDidMount()方法中的子组件在父组件之前执行
        this.props.navigation.setParams({headRightPress:this.scanClick})
    }* */

  constructor(props) {
    super(props);
    this._setStatusBarStyleLight();
    this.state = {
      qrcodeLoading: true,
      isNotRemind: false,
      isMainNetwork: true,
      ethWarnModalVisible: false,
      itcWarnModalVisible: false,
    };
    this.isRemindAgainArray = [];
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  _initData = async () => {
    const { wallet, network } = this.props;
    const remindAgain = await StorageManage.load(StorageKey.NotRemindAgainTestITC);
    if (remindAgain) {
      this.isRemindAgainArray = remindAgain;
    } else {
      this.isRemindAgainArray = [];
    }

    if (wallet.type === 'itc') {
      const index = remindAgain ? remindAgain.findIndex(item => item.type === 'itcTestWarn') : -1;
      if (index === -1) {
        this.setState({
          itcWarnModalVisible: true,
        });
      } else {
        this.setState({
          itcWarnModalVisible: !remindAgain[index].isRemindAgain,
        });
      }
    } else if (wallet.type === 'eth') {
      if (network !== Network.main) {
        const index = remindAgain ? remindAgain.findIndex(item => item.type === 'ethTestWarn') : -1;
        this.setState({
          isMainNetwork: true,
          ethWarnModalVisible: index === -1 ? true : !remindAgain[index].isRemindAgain,
        });
      }
    }

    InteractionManager.runAfterInteractions(() => {
      if (this._isMounted) {
        this.setState({ qrcodeLoading: false });
        if (this.props.firstQR) {
          store.dispatch(setFirstQR());
        }
      }
    });
  };

  scanClick = async () => {
    // const {navigate} = this.props.navigation;//页面跳转
    // navigation('页面');
    let isAgree = true;
    if (Platform.OS === 'android') {
      isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    if (isAgree) {
      this.props.navigation.navigate('ScanQRCode');
    } else {
      this._showAlert(I18n.t('modal.permission_camera'));
    }
  };

  copyAddress() {
    const { address } = this.props.wallet;

    Clipboard.setString(this.props.wallet.type==='itc'?"ITC"+this.props.wallet.address.replace('0x','').toLowerCase():this.props.wallet.address.toLowerCase());
    showToast(I18n.t('toast.copied'));
  }

  onCloseEthWarnModal() {
    const object = {
      type: 'ethTestWarn',
      isRemindAgain: this.state.isNotRemind,
    };

    const index = this.isRemindAgainArray
      ? this.isRemindAgainArray.findIndex(item => item.type === 'ethTestWarn')
      : -1;

    if (index === -1) {
      this.isRemindAgainArray = this.isRemindAgainArray.concat(object);
    } else {
      this.isRemindAgainArray.splice(index, 1, object);
    }

    const key = StorageKey.NotRemindAgainTestITC;
    StorageManage.save(key, this.isRemindAgainArray);

    this.setState({ ethWarnModalVisible: false });
  }

  onCloseItcWarnModal() {
    const object = {
      type: 'itcTestWarn',
      isRemindAgain: this.state.isNotRemind,
    };

    const index = this.isRemindAgainArray
      ? this.isRemindAgainArray.findIndex(item => item.type === 'itcTestWarn')
      : -1;

    if (index === -1) {
      this.isRemindAgainArray = this.isRemindAgainArray.concat(object);
    } else {
      this.isRemindAgainArray.splice(index, 1, object);
    }

    const key = StorageKey.NotRemindAgainTestITC;
    StorageManage.save(key, this.isRemindAgainArray);

    this.setState({ itcWarnModalVisible: false });
  }

  notRemindPress() {
    this.setState(prevState => ({
      isNotRemind: !prevState.isNotRemind,
    }));
  }

  renderComponent = () => (
    <ImageBackground style={styles.container} source={require('../../assets/launch/splash_bg.png')}>
      <TransparentBgHeader
        navigation={this.props.navigation}
        text={I18n.t('settings.collection_code')}
        /** rightPress = {()=>this.scanClick()}
                                rightIcon= {require('../../assets/common/scanIcon.png')}* */
      />

      <ScreenshotWarn
        content={I18n.t('modal.itc_test_warn1')}
        content1={I18n.t('modal.itc_test_warn2')}
        btnText={I18n.t('modal.i_know')}
        modalVisible={this.state.ethWarnModalVisible}
        onPress={() => this.onCloseEthWarnModal()}
        isShowNotRemindBtn
        isNotRemind={!this.state.isNotRemind}
        notRemindPress={() => this.notRemindPress()}
      />
      <ScreenshotWarn
        content={I18n.t('modal.itc_wallet_test_warn')}
        btnText={I18n.t('modal.i_know')}
        modalVisible={this.state.itcWarnModalVisible}
        onPress={() => this.onCloseItcWarnModal()}
        isShowNotRemindBtn
        isNotRemind={!this.state.isNotRemind}
        notRemindPress={() => this.notRemindPress()}
      />
      <View style={styles.contentContainer}>
        <View style={styles.contentBox}>
          <Image
            style={styles.logoIcon}
            source={this.props.wallet.type==='itc'? require('../../assets/set/logoWhiteBg.png'):require('../../assets/set/logoWhiteBg_eth.png')}
            resizeMode="contain"
          />
          <View style={styles.qrCodeBox}>
            <Text style={styles.titleTxt}>{this.props.wallet.name}</Text>
            <View style={styles.qrCode}>
              <QRCode
                value={this.props.wallet.address}
                size={180}
                bgColor="#000"
                fgColor="#fff"
                onLoad={() => {}}
                onLoadEnd={() => {}}
              />
              {/* {this.state.qrcodeLoading && this.props.firstQR ? <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text
                                    style={{ color: 'black' }}>Loading...</Text>
                            </View>
                                :
                                <QRCode
                                    value={this.props.wallet.address}
                                    size={180}
                                    bgColor='#000'
                                    fgColor='#fff'
                                    onLoad={() => {}}
                                    onLoadEnd={() => { }}
                            />} */}
            </View>

            <Text style={styles.adderssTxt}>{this.props.wallet.type==='itc'?"ITC"+this.props.wallet.address.replace('0x',''):this.props.wallet.address}</Text>
          </View>

          <ImageBackground
            style={styles.btnImageBackground}
            source={require('../../assets/set/qrBtnBg.png')}
            resizeMode="contain"
          >
            <TouchableOpacity
              style={[styles.btnOpacity]}
              activeOpacity={0.6}
              onPress={() => this.copyAddress()}
            >
              <Text style={styles.btnTxt}>{I18n.t('settings.copy_payment_address')}</Text>
            </TouchableOpacity>
          </ImageBackground>

          {this.state.isMainNetwork ? null : (
            <View style={styles.itcBox}>
              <Text style={styles.itcTextWarn}>*{I18n.t('modal.itc_test_warn1')}</Text>
              <Text style={styles.itcTextWarn}>*{I18n.t('modal.itc_test_warn2')}</Text>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const mapStateToProps = state => ({
  wallet: state.Core.wallet,
  firstQR: state.Core.firstQR,
  network: state.Core.network,
});

export default connect(
  mapStateToProps,
  {}
)(ReceiptCodeScreen);
