import React, { PureComponent } from 'react';
import {
  StyleSheet,
  BackHandler,
  AppState,
  Platform,
  DeviceEventEmitter,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { BlurView } from 'react-native-blur';
import Toast from 'react-native-root-toast';
import RootSiblings from 'react-native-root-siblings';
import TouchID from 'react-native-touch-id'; // https://github.com/naoufal/react-native-touch-id
import StatusBarComponent from '../../components/StatusBarComponent';
// import Loading from '../../components/LoadingComponent';
import Loading from '../../components/Loading';
import { showToast } from '../../utils/Toast';
import PinModal from '../../components/PinModal';
import store from '../../config/store/ConfigureStore';
import { I18n } from '../../config/language/i18n';
import LayoutConstants from '../../config/LayoutConstants';
import { Common } from '../../config/GlobalConfig';
import MyAlert from '../../components/MyAlert';
import Analytics from '../../utils/Analytics';
// import {  isFirstTime,
//   isRolledBack,
//   packageVersion,
//   currentVersion,
//   checkUpdate,
//   downloadUpdate,
//   switchVersion,
//   switchVersionLater,
//   markSuccess,} from "react-native-update";
// import _updateConfig from './../../../update.json';
// const {appKey} = _updateConfig[Platform.OS];
let lastBackPressed = 0;

const touchIdOptionalConfig = {
  title: I18n.t('modal.authentication_required'), // android 确认对话框的标题
  color: '#e00606', // Android 确认对话框的颜色
  sensorDescription: '', // Android 指纹图像旁边显示的文字
  cancelText: I18n.t('modal.cancel'), // Android 取消按钮文字
  fallbackLabel: '', // iOS (if empty, then label is hidden)   默认情况下指定“显示密码”标签。 如果设置为空，则字符串标签不可见。
  unifiedErrors: true, // use unified error messages (default false) 返回统一错误消息（默认= false）
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: LayoutConstants.WINDOW_HEIGHT,
    zIndex: 1000,
  },
});

// 所有继承该组件的组件，重写该组件方法请先运行super.funcName()
export default class BaseComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
    this.state = {
      isShowLoading: false,
      isShowPin: false,
      showBlur: false,
      isShowAlert: false,
      alertTitle: '',
      alertContent: '',
    };

    this.currentRouteName = '';

    this.touchIDVeryifyFailCount = 0; // touchId验证失败的次数
    this.backgroundTimer = 0; // 在后台的时间

    this._addEventListener = this._addEventListener.bind(this);
    this._removeEventListener = this._removeEventListener.bind(this);
    this._showLoading = this._showLoading.bind(this);
    this._hideLoading = this._hideLoading.bind(this);
    this._setStatusBarStyleLight = this._setStatusBarStyleLight.bind(this);
    this._setStatusBarStyleDark = this._setStatusBarStyleDark.bind(this);
    this._initData = this._initData.bind(this);
    this._checkUpdate = this._checkUpdate.bind(this);
    this._onBackPressed = this._onBackPressed.bind(this);
    //  this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._barStyle = 'dark-content';
    this._isMounted = false;
    this.versionUpdateInfo = null;
    this.showVersionUpdateModal = false;
  }

  // 设置StatusBar的barStyle为light-content,默认为dark-content
  _setStatusBarStyleLight() {
    this._barStyle = 'light-content';
  }

  _setStatusBarStyleDark() {
    this._barStyle = 'dark-content';
  }

  componentWillMount() {
    /* JPushModule.notifyJSDidLoad((resultCode)=>{
            if(resultCode === 0){

            }
        })
        JPushModule.addReceiveOpenNotificationListener((map)=>{
            this.props.navigation.navigate('MessageCenter');
        }) */

    this._addEventListener();
    // markSuccess();
  }

  componentDidMount() {
    this._initData();
  }

  componentWillUnmount() {
    this._removeEventListener();

    // JPushModule.removeReceiveOpenNotificationListener()
  }

  // 初始化数据
  _initData = () => {};

  //检查热更新
  async _checkUpdate() {
    // if (__DEV__ || Platform.OS === 'ios') {
    //   // 开发模式不支持热更新，跳过检查
    //   return;
    // }
    // let info;
    // try {
    //   info = await checkUpdate(appKey);
    // } catch (err) {
    //   console.warn(err);
    //   return;
    // }
    // if (info.expired) {
    //   Alert.alert(I18n.t('checkapp.prompt'), I18n.t('checkapp.appstore'), [
    //     {
    //       text: I18n.t('checkapp.yes'), onPress: () => {
    //         info.downloadUrl && Linking.openURL(info.downloadUrl)
    //       }
    //     },
    //     { text: I18n.t('checkapp.no'), },
    //   ]);
    // } else if (info.upToDate) {
    //   // Alert.alert('提示', '您的应用版本已是最新.');
    // } else {
    //   Alert.alert(I18n.t('checkapp.prompt'), I18n.t('checkapp.newversion') + info.name + I18n.t('checkapp.wantdown'), [
    //     {
    //       text: I18n.t('checkapp.yes'), onPress: () => {
    //         this.doUpdate(info)
    //       }
    //     },
    //     { text: I18n.t('checkapp.no'), },
    //   ]);
    // }
  };
  // doUpdate = async (info) => {
  //   try {
  //     this._showLoading();
  //     const hash = await downloadUpdate(info);
  //     this._hideLoading();
  //
  //     setTimeout(() => {
  //       Alert.alert(I18n.t('checkapp.prompt'), I18n.t('checkapp.download'), [
  //         {text: I18n.t('checkapp.yes'), onPress: ()=>{switchVersion(hash);}},
  //         {text: I18n.t('checkapp.no'),},
  //         {text: I18n.t('checkapp.nexttime'), onPress: ()=>{switchVersionLater(hash);}},
  //       ]);
  //
  //     },  500);
  //
  //
  //   } catch(err) {
  //     Alert.alert(I18n.t('checkapp.prompt'), I18n.t('checkapp.updatefail'));
  //   }
  // };
  // 添加事件监听
  _addEventListener() {
    this.netRequestErrHandler = DeviceEventEmitter.addListener(
      'netRequestErr',
      this._netRequestErr
    ); // 网络异常情况监听
    this.monetaryUnitChangeHandler = DeviceEventEmitter.addListener(
      'monetaryUnitChange',
      this._monetaryUnitChange
    ); // 监听货币单位改变
    this.pinIsShowHandler = DeviceEventEmitter.addListener('pinIsShow', this._pinIsShowEmitter); // 监听pin是否显示
    this.messageCountHandler = DeviceEventEmitter.addListener(
      'messageCount',
      this._messageCountEmitter
    ); // messageCount
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._onBackPressed); // Android物理返回键监听
    this.backgroundStateHandler = DeviceEventEmitter.addListener(
      'backgroundState',
      this._backgroundStateEmitter
    );
    this.changeWalletHandler = DeviceEventEmitter.addListener(
      'changeWallet',
      this._changeWalletEmitter
    ); // 切换钱包监听
    this.changeTokensHandler = DeviceEventEmitter.addListener(
      'changeTokens',
      this._changeTokensEmitter
    ); // token列表改变的监听
  }

  // 移除事件监听
  _removeEventListener() {
    if (this.monetaryUnitChangeHandler) {
      this.monetaryUnitChangeHandler.remove();
    }
    if (this.backHandler) {
      this.backHandler.remove();
    }
    if (this.pinIsShowHandler) {
      this.pinIsShowHandler.remove();
    }
    if (this.messageCountHandler) {
      this.messageCountHandler.remove();
    }
    if (this.changeWalletHandler) {
      this.changeWalletHandler.remove();
    }
    if (this.backgroundStateHandler) {
      this.backgroundStateHandler.remove();
    }
    if (this.changeTokensHandler) {
      this.changeTokensHandler.remove();
    }
  }

  _addChangeListener() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _removeChangeListener() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // 显示Loading
  _showLoading(showed) {
    if (this._isMounted) {
      this.setState({ isShowLoading: true }, showed);
    }
  }

  // 隐藏Loading
  _hideLoading(hided) {
    if (this._isMounted) {
      this.setState({ isShowLoading: false }, hided);
    }
  }

  // 显示PinCode
  _showPin(showPined) {
    this.setState({ isShowPin: true }, showPined);
  }

  // 隐藏PinCode
  _hidePin(hidePined) {

    this.setState({ isShowPin: false }, hidePined);
  }

  // pin显示的时候，其他的modal必须关系，否则pin显示不出来
  _closeModal = () => {};

  // 渲染子组件
  renderComponent = () => {};

  // 进入后台模糊（仅支持ios）
  _handleAppStateChange = nextAppState => {
    if (nextAppState != null && nextAppState === 'active') {
      const isNeedVerify =
        this.backgroundTimer !== 0 &&
        Date.now() - this.backgroundTimer >= 60000 &&
        !Common.touchIDVertifing;
      this.backgroundTimer = 0;
      DeviceEventEmitter.emit('backgroundState', {
        nextAppState,
        isNeedVerify,
      });
      if (isNeedVerify) {
        this._verifyIdentidy();
      }
    } else {
      DeviceEventEmitter.emit('backgroundState', {
        nextAppState,
        isNeedVerify: false,
      });
      this.backgroundTimer =
        !Common.touchIDVertifing && nextAppState === 'background' ? Date.now() : 0;
    } /* else if(nextAppState != null && nextAppState === 'background'){
            this.backgroundTimer = Common.touchIDVertifing ? 0 : Date.now();
            DeviceEventEmitter.emit('backgroundState', {nextAppState: nextAppState});
        }else if(nextAppState != null && nextAppState === 'inactive'){
            //过渡状态  ios 在进入后台的时候会进入 active->inactive->background  从后台回到前台时不会进入 background->active
            //iOS 在弹起touchID/faceID验证的时候 处于的状态是inactive 
            DeviceEventEmitter.emit('backgroundState', {nextAppState: nextAppState});
            this.backgroundTimer = 0;
        }else {
            DeviceEventEmitter.emit('backgroundState', {nextAppState: nextAppState});
            this.backgroundTimer = 0
        } */
  };

  _showAlert(content, title) {
    if (this._isMounted) {
      this.setState({
        isShowAlert: true,
        alertTitle: title,
        alertContent: content,
      });
    }
  }

  _hideAlert() {
    const { isShowAlert } = this.state;
    if (isShowAlert) {
      this.setState({
        isShowAlert: false,
      });
    }
  }

  render() {
    const { pinInfo } = store.getState().Core;
    const {
      isShowAlert,
      alertTitle,
      alertContent,
      showBlur,
      isShowLoading,
      isShowPin,
      hiddenPinSuccessCall
    } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
      >
        <StatusBarComponent barStyle={this._barStyle} />

        {this.renderComponent()}
        {isShowAlert === undefined ? null : (
          <MyAlert
            modalVisible={isShowAlert}
            title={alertTitle}
            content={alertContent}
            okPress={() => this._hideAlert()}
          />
        )}
        {Platform.OS === 'ios' && showBlur && (
          <BlurView style={styles.blurStyle} blurType="light" blurAmount={10} />
        )}
        {isShowLoading === undefined ? null : <Loading visible={isShowLoading} />}
        {isShowPin === undefined ? null : (
          <PinModal success={hiddenPinSuccessCall} visible={isShowPin} password={pinInfo == null ? '' : pinInfo.password} />
        )}
      </ScrollView>
    );
  }

  // 接收到货币单位改变的监听所需要的操作
  _monetaryUnitChange = () => {};

  // 接收到Pin显示隐藏的监听所需要的操作
  _pinIsShowEmitter = data => {
    const { pinType } = data.pinObject;
    const isVisible = data.pinObject.visible;
    if (pinType === 'PinModal') {
      this.setState({
        isShowPin: isVisible,
      });
    }
  };

  _messageCountEmitter = () => {};

  _changeWalletEmitter = () => {};

  _changeTokensEmitter = () => {};

  // 尝试使用Face ID / Touch ID进行身份验证。 返回Promise对象。
  _touchIdAuthenticate = () => {
    Common.touchIDVertifing = true;
    TouchID.authenticate(I18n.t('modal.vertify_self'), touchIdOptionalConfig)
      .then(() => {
        // 身份验证成功
        Common.touchIDVertifing = false;
        this._hidePin(this._touchIdAuthenticateSuccess);
      })
      .catch(err => {
        // 身份验证失败
        Common.touchIDVertifing = false;
        const error = err;
        this._touchIdAuthenticateFail(error);
      });
  };

  // 是否支持Face ID / Touch ID
  _touchIdIsSupported = () => {
    // 如果不支持TouchID，则返回拒绝的Promise。 在iOS上解析为具有FaceID或TouchID的biometryType字符串。
    TouchID.isSupported(touchIdOptionalConfig)
      .then(type => {
        if (type === 'FaceID') {
          // FaceID is supported
          this._supportTouchId();
        } else {
          // TouchID is supported
          this._supportFaceId();
        }
      })
      .catch(err => {
        const error = err;
        this._notSupportTouchId(error);
      });
  };

  _supportTouchId() {
    this._touchIdAuthenticate();
  }

  _supportFaceId() {
    this._touchIdAuthenticate();
  }

  _notSupportTouchId() {
    this._showPin();
  }

  _touchIdAuthenticateSuccess = () => {
    //回调
    if(this.state.hiddenPinSuccessCall){

      //1.5秒后回调该方法，因为pin码的modal可能未消失
      setTimeout(()=>{
        this.state.hiddenPinSuccessCall()
      },1500)
    }
  };

  _touchIdAuthenticateFail(err) {
    if (err === 'TouchIDError: User canceled authentication') {
      this._showPin();
    } else if (err === 'TouchIDError: Authentication failed') {
      // ios 验证失败后系统会再试一次(共三次)
      // 三次验证失败才会进入_touchIdAuthenticateFail()   err == 'TouchIDError: Authentication failed'
      // 超过三次验证失败 系统则会锁住

      // android 验证失败后再调起touchIdAuthenticate 三次验证失败则会弹起pinCode页面
      if (Platform.OS === 'ios') {
        this.touchIDVeryifyFailCount = 0;
        this._showPin();
      } else {
        this.touchIDVeryifyFailCount = this.touchIDVeryifyFailCount + 1;
        if (this.touchIDVeryifyFailCount >= 3) {
          this.touchIDVeryifyFailCount = 0;
          this._showPin();
        } else {
          this._touchIdAuthenticate();
        }
      }
    } else {
      // 其他原因造成的验证touchID失败，则弹起pinCode验证
      this._showPin();
    }
  }

  // 网络请假错误回调
  _netRequestErr = err => {
    this._hideLoading();
    try {
      if (this.toast instanceof RootSiblings) {
        return;
      }
      if (
        err.message === 'Network request failed' ||
        err.message ===
          'Invalid JSON RPC response: "The Internet connection appears to be offline."' ||
        err.message === 'Error: Network Error'
      ) {
        this.toast = showToast(I18n.t('toast.net_request_err'), Toast.positions.TOP + 10);
      } else if (err.message === "Couldn't decode uint256 from ABI: 0x") {
        this.toast = showToast(
          I18n.t('toast.net_request_token_unable_resolve'),
          Toast.positions.TOP + 10
        );
      } else if (
        err.Hd === '10 seconds' ||
        err.qe === '10 seconds' ||
        err.message === 'timeout of 10000ms exceeded' ||
        err === ' timeout promise' ||
        err.message === 'Error: timeout of 10000ms exceeded'
      ) {
        this.toast = showToast(I18n.t('toast.net_request_timeout'), Toast.positions.TOP + 10);
      } else if (err === 'No transactions found' || err.message === 'No transactions found') {
        return;
      } else {
        const errMessage = err.message === undefined ? err : err.message;
        // this.toast = showToast(errMessage, Toast.positions.TOP + 10);
        console.log('errMessage:', errMessage);
      }
    } catch (error) {
      this.toast = showToast('unknow error', Toast.positions.TOP + 10);
      Analytics.recordErr('netRequestErrCatchErr', error);
    }
  };

  // 点击android物理返回键的操作
  _onBackPressed = () => {
    const { navigation } = this.props;
    const { routeName } = navigation.state;
    if (
      routeName === 'FirstLaunch' ||
      routeName === 'Home' ||
      routeName === 'My' ||
      routeName === 'Mapping'
    ) {
      // 在首页按了物理键返回,Home、FirstLaunch
      if (lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp();
        return false;
      }
      showToast(I18n.t('toast.exit_app'));
      lastBackPressed = Date.now();
      return true;
    }
    navigation.goBack();
    return true;
  };

  // 接收前台后台切换的监听
  _backgroundStateEmitter = data => {
    const state = data.nextAppState;
    const { isNeedVerify } = data;
    if (isNeedVerify) {
      this._hideLoading();
      this._hideAlert();
      this._closeModal();
    }
    if (state != null && state === 'active') {
      this.setState({
        showBlur: false,
      });
    } else {
      this.setState({
        showBlur: true,
      });
    }
  };

  _verifyIdentidy(success) {
    const { pinInfo } = store.getState().Core;
    if (pinInfo != null) {

      if(success){
        this.setState({
          hiddenPinSuccessCall:success
        })
      }

      this._showPin(() => {
        if (pinInfo.isUseTouchId) {
          this._touchIdIsSupported();
        }
      });
    }
    /* if (pinInfo != null) {
      setTimeout(() => {
        this._showPin();
        if (pinInfo.isUseTouchId) {
          if (Platform.OS === 'ios') {
            setTimeout(() => {
              this._touchIdIsSupported();
            }, 100);
          } else {
            this._touchIdIsSupported();
          }
        }
      }, 100);
    } */
  }
}
