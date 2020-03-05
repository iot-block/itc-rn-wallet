import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';

import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage';
import KeystoreUtils from '../../utils/KeystoreUtils';
import { NextButton, GreyButtonBig } from '../../components/Button';
import InputTextDialog from '../../components/InputTextDialog';
import InputPasswordDialog from '../../components/InputPasswordDialog';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig';
import * as Actions from '../../config/action/Actions';
import { showToast } from '../../utils/Toast';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import RemindDialog from '../../components/RemindDialog';
import StaticLoading from '../../components/StaticLoading';
import { defaultTokens, defaultTokensOfITC } from '../../utils/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bgGrayColor,
    paddingBottom: 20,
  },
  btnOpacity: {
    flexDirection: 'row',
    height: 56,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  btnTxt: {
    flex: 1,
    backgroundColor: 'transparent',
    color: Colors.fontBlackColor_43,
    fontSize: FontSize.TitleSize,
    height: 56,
    lineHeight: 56,
    textAlign: 'left',
  },
  headIcon: {
    height: 36,
    width: 36,
  },
  walletName: {
    fontSize: FontSize.DetailTitleSize,
    color: Colors.fontBlackColor_43,
  },
  buttonBox: {
    marginTop: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  marginBottom20: {
    marginBottom: 20,
  },
  delButtonBox: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginBottom: 20,
    alignSelf: 'center',
  },
});

class SetScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      wallet: { name: '', address: '' },
      nameModalVisible: false,
      passwordModalVisible: false,
      // isShowNameWarn: false,
      rightBtnDisabled: true,
      pwdRightBtnDisabled: true,
      nameWarnText: ' ',
      isShowRemindDialog: false,

      isShowSLoading: false,
      sLoadingContent: I18n.t('settings.verifying_password'),
    };

    this.isDeleteWallet = false;
    this.inputName = '';
    this.inputPwd = '';
    this.isCurrentWallet = false; // 是否是当前钱包
    this.timeInterval = null;
    this.timeIntervalCount = 0;

    this.inputTextDialog = React.createRef();
    this.inputPasswordDialog = React.createRef();
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  _initData = () => {
    const mWallet = this.props.navigation.state.params.wallet;
    this.isCurrentWallet =
      mWallet.address.toLowerCase() === this.props.currentWallet.address.toLowerCase();
    this.setState({
      wallet: mWallet,
    });
  };

  _closeModal = () => {
    this.setState({
      nameModalVisible: false,
      passwordModalVisible: false,
      isShowRemindDialog: false,
    });
  };

  openNameModal() {
    this.setState({
      nameModalVisible: true,
      // isShowNameWarn: false,
      rightBtnDisabled: true,
      nameWarnText: ' ',
    });
  }

  openPasswordModal() {
    this.setState({
      passwordModalVisible: true,
      pwdRightBtnDisabled: true,
    });
  }

  closeNameModal() {
    this.setState({ nameModalVisible: false });
  }

  closePasswordModal() {
    this.setState({ passwordModalVisible: false });
  }

  nameConfirmClick() {
    // var name = this.refs.inputTextDialog.state.text;
    const name = this.inputName;
    this.closeNameModal();
    if (name === '' || name === undefined) {
      showToast(I18n.t('toast.enter_wallet_name'));
    } else if (name === this.state.wallet.name) {
      showToast(I18n.t('toast.not_modified_wallet_name'));
    } else {
      this.modifyWalletName(name);
    }
  }

  nameOnChangeText = text => {
    const { wallet } = this.state;
    this.inputName = text;
    // let isShowWarn = (text == '' || text.length > 12) ? true : false
    const isDisabled = !!(text === '' || text.length > 12 || text === wallet.name);
    let warnText = '';
    if (text === '' || text.length > 12) {
      warnText = I18n.t('launch.enter_normative_wallet_name');
    }
    this.setState({
      // isShowNameWarn: isShowWarn,
      rightBtnDisabled: isDisabled,
      nameWarnText: warnText,
    });
  };

  pwdOnChangeText = text => {
    this.inputPwd = text;
    const isDisabled = !!(text === '' || text.length < 8);
    this.setState({
      pwdRightBtnDisabled: isDisabled,
    });
  };

  passwordConfirmClick() {
    // var password = this.refs.inputPasswordDialog.state.text;
    const password = this.inputPwd;
    this.closePasswordModal();
    if (password === '' || password === undefined) {
      showToast(I18n.t('toast.enter_password'));
    } else {
      this.timeIntervalCount = 0;
      this.timeInterval = setInterval(() => {
        this.timeIntervalCount = this.timeIntervalCount + 1;
        this.changeLoading(this.timeIntervalCount, password);
      }, 500);
    }
  }

  changeLoading(num, password) {
    let content = '';
    if (num === 1) {
      content = I18n.t('settings.verifying_password');
    } else if (num === 2) {
      content = I18n.t('settings.decrypting_keystore');
    }
    this.setState({
      isShowSLoading: true,
      sLoadingContent: content,
    });
    const n = this.isDeleteWallet ? 1 : 2;
    if (num === n) {
      clearInterval(this.timeInterval);
      setTimeout(() => {
        this.exportKeyPrivate(password);
      }, 0);
    }
  }

  async modifyWalletName(name) {
    const { wallet } = this.state;
    wallet.name = name;

    if (this.isCurrentWallet) {
      this.props.setCurrentWallet(wallet);
    }

    if (wallet.type === 'itc') {
      const itcWallets = await StorageManage.load(StorageKey.ItcWalletList);
      const index = itcWallets.findIndex(
        itcWallet => itcWallet.address.toLowerCase() === wallet.address.toLowerCase()
      );

      itcWallets.splice(index, 1, wallet);
      this.props.setItcWalletList(itcWallets);
      StorageManage.save(StorageKey.ItcWalletList, itcWallets);
    } else {
      const ethWallets = await StorageManage.load(StorageKey.EthWalletList);
      const index = ethWallets.findIndex(
        ethWallet => ethWallet.address.toLowerCase() === wallet.address.toLowerCase()
      );

      ethWallets.splice(index, 1, wallet);
      this.props.setEthWalletList(ethWallets);
      StorageManage.save(StorageKey.EthWalletList, ethWallets);
    }
  }

  async exportKeyPrivate(password) {
    let privateKey;
    const { address, type } = this.state.wallet;
    try {
      privateKey = await KeystoreUtils.getPrivateKey(password, address, type);
      this.hideStaticLoading(); // 关闭Loading
      if (privateKey == null) {
        showToast(
          this.isDeleteWallet
            ? I18n.t('modal.password_error')
            : I18n.t('modal.export_private_key_error')
        );
      } else if (this.isDeleteWallet) {
        this.setState({
          isShowRemindDialog: true,
        });
      } else {
        this.props.navigation.navigate('ExportPrivateKey', { privateKey });
      }
    } catch (e) {
      console.log('exportKeyPrivateErr:', e);
    } finally {
      this.hideStaticLoading();
    }
  }

  hideStaticLoading() {
    this.setState({
      isShowSLoading: false,
      sLoadingContent: '',
    });
  }

  async exportKeystore() {
    try {
      const { address, type } = this.state.wallet;
      const keystore = await KeystoreUtils.importFromFile(address, type);
      this.props.navigation.navigate('ExportKeystore', { keystore });
    } catch (err) {
      this._showAlert(I18n.t('modal.password_error'));
      console.log('exportKeystoreErr:', err);
    }
  }

  cancelDeleteClick() {
    this.setState({
      isShowRemindDialog: false,
    });
  }

  async confirmDeleteClick() {
    this.setState({
      isShowRemindDialog: false,
    });
    await this.deleteWallet();
  }

  deleteWallet = async () => {
    try {
      const { wallet } = this.state;

      await KeystoreUtils.removeKeyFile(wallet.address, wallet.type);
      const walletAddress = await StorageManage.load(StorageKey.Wallet);//挖矿选中钱包
      if(wallet.address === walletAddress){
        StorageManage.remove(StorageKey.Wallet)
      }

      let itcWalletList = await StorageManage.load(StorageKey.ItcWalletList);
      let ethWalletList = await StorageManage.load(StorageKey.EthWalletList);
      if (!itcWalletList) {
        itcWalletList = [];
      }
      if (!ethWalletList) {
        ethWalletList = [];
      }

      if (wallet.type === 'itc') {
        const index = itcWalletList.findIndex(
          item => item.address.toLowerCase() === wallet.address.toLowerCase()
        );
        itcWalletList.splice(index, 1);
        StorageManage.save(StorageKey.ItcWalletList, itcWalletList);
        this.props.setItcWalletList(itcWalletList);
      } else {
        const index = ethWalletList.findIndex(
          item => item.address.toLowerCase() === wallet.address.toLowerCase()
        );
        ethWalletList.splice(index, 1);
        StorageManage.save(StorageKey.EthWalletList, ethWalletList);
        this.props.setEthWalletList(ethWalletList);
      }
      StorageManage.remove(StorageKey.Tokens + wallet.address);

      const allWalletList = itcWalletList.concat(ethWalletList);
      if (this.isCurrentWallet) {
        // 删除的是当前钱包
        StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo);
        if (allWalletList.length > 0) {
          const newWallet = allWalletList[0];
          const newWalletType = newWallet.type;
          if (newWalletType === 'itc') {
            this.props.loadTokenBalance(defaultTokensOfITC);
          } else {
            this.props.loadTokenBalance(defaultTokens);
          }
          StorageManage.save(StorageKey.User, newWallet);
          this.props.setCurrentWallet(newWallet);
          this.props.setTransactionRecordList([]);
          DeviceEventEmitter.emit('changeWallet', {
            openRightDrawer: true,
            isChangeWalletList: true,
          });

          this.props.navigation.navigate('Home');
        } else {
          StorageManage.remove(StorageKey.User);
          this.props.setCurrentWallet({});
          this.props.setTransactionRecordList([]);

          this.props.navigation.navigate('FirstLaunch');
        }
      } else {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack();
      }
    } catch (e) {
      showToast(I18n.t('modal.password_error'));
      console.log('deleteWallet err', e);
    }
  };

  /* async deleteLocalData() {
        await KeystoreUtils.removeKeyFile(this.state.wallet.address)
        this.props.setCurrentWallet(null);
        //删除所有本地的数据
        StorageManage.remove(StorageKey.User)
        StorageManage.remove(StorageKey.Tokens + this.state.wallet.address)
        StorageManage.remove(StorageKey.Network)
        StorageManage.remove(StorageKey.UserToken)
        //StorageManage.remove(StorageKey.Language)
        //StorageManage.remove(StorageKey.MonetaryUnit)
        //StorageManage.remove(StorageKey.PinInfo)


        StorageManage.remove(StorageKey.NotRemindAgainTestITC)//
        //StorageManage.clearMapForkey(StorageKey.Contact)// id
        StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo)// id

        let params = {
            walletAddress: ''
        }
        NetworkManager.userInfoUpdate(params)
            .then((response) => {
                if (response.code === 200) {
                } else {
                    console.log('userInfoUpdate err msg:', response.msg)
                }
            })
            .catch((err) => {
                console.log('userInfoUpdate err:', err)
            })

        this._hideLoading();
        this.props.navigation.navigate('Apploading')
    } */

  _onBackPressed = () => {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
    return true;
  };

  backPressed() {
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={this.state.wallet.name}
        leftPress={() => this.backPressed()}
      />

      <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />

      <InputTextDialog
        ref={this.inputTextDialog}
        placeholder={I18n.t('settings.enter_wallet_name_hint')}
        leftTxt={I18n.t('modal.cancel')}
        rightTxt={I18n.t('modal.confirm')}
        leftPress={() => this.closeNameModal()}
        rightPress={() => this.nameConfirmClick()}
        modalVisible={this.state.nameModalVisible}
        onChangeText={this.nameOnChangeText}
        defaultValue={this.state.wallet.name}
        warnText={this.state.nameWarnText}
        isShowWarn
        rightBtnDisabled={this.state.rightBtnDisabled}
      />
      <InputPasswordDialog
        ref={this.inputPasswordDialog}
        placeholder={I18n.t('settings.enter_passowrd_hint')}
        leftTxt={I18n.t('modal.cancel')}
        rightTxt={I18n.t('modal.confirm')}
        leftPress={() => this.closePasswordModal()}
        rightPress={() => this.passwordConfirmClick()}
        modalVisible={this.state.passwordModalVisible}
        rightBtnDisabled={this.state.pwdRightBtnDisabled}
        onChangeText={this.pwdOnChangeText}
      />
      <RemindDialog
        content={I18n.t('settings.confirm_delete_wallet')}
        modalVisible={this.state.isShowRemindDialog}
        leftTxt={I18n.t('modal.cancel')}
        rightTxt={I18n.t('modal.confirm')}
        leftPress={() => this.cancelDeleteClick()}
        rightPress={() => this.confirmDeleteClick()}
      />

      <TouchableOpacity
        style={[styles.btnOpacity]}
        activeOpacity={0.6}
        onPress={() => {
          this.isDeleteWallet = false;
          this.openNameModal();
        }}
      >
        <Text style={styles.btnTxt}>{I18n.t('settings.modify_wallet_name')}</Text>
        <Text style={styles.walletName}>{this.state.wallet.name}</Text>
      </TouchableOpacity>

      <View style={styles.buttonBox}>
        <NextButton
          onPress={() => {
            this.isDeleteWallet = false;
            this.exportKeystore();
          }}
          text={I18n.t('settings.export_keystore')}
        />
      </View>
      <View style={styles.buttonBox}>
        <NextButton
          onPress={() => {
            this.isDeleteWallet = false;
            this.openPasswordModal();
          }}
          text={I18n.t('settings.export_private_key')}
        />
      </View>
      <View style={styles.delButtonBox}>
        <GreyButtonBig
          buttonStyle={styles.button}
          onPress={() => {
            this.isDeleteWallet = true;
            // this.openPasswordModal();
            this.setState({
              isShowRemindDialog: true,
            });
          }}
          text={I18n.t('settings.delete_wallet')}
        />
      </View>
    </View>
  );
}
const mapStateToProps = state => ({
  currentWallet: state.Core.wallet,
  tokens: state.Core.tokens,
});
const mapDispatchToProps = dispatch => ({
  setItcWalletList: itcWalletList => dispatch(Actions.setItcWalletList(itcWalletList)),
  setEthWalletList: ethWalletList => dispatch(Actions.setEthWalletList(ethWalletList)),
  setCurrentWallet: wallet => dispatch(Actions.setCurrentWallet(wallet)),
  setTransactionRecordList: list => dispatch(Actions.setTransactionRecordList(list)),
  loadTokenBalance: tokens => dispatch(Actions.loadTokenBalance(tokens)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetScreen);
