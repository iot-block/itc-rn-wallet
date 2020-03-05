import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import StorageManage from '../../utils/StorageManage';
import { BlueButtonBig } from '../../components/Button';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { androidPermission } from '../../utils/PermissionsAndroid';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import NetworkManager from '../../utils/NetworkManager';
import CommonTextInput from '../../components/TextInputComponent';
import RemindDialog from '../../components/RemindDialog';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentBox: {
    marginTop: 10,
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  text: {
    color: Colors.fontBlackColor,
    fontSize: 13,
    marginBottom: 3,
    marginTop: 12,
  },
  textInput: {
    // marginBottom:15,
  },
  warnTxt: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-end',
    paddingTop: 5,
    paddingLeft: 10,
  },
  warnTxtHidden: {
    height: 0,
  },
  button: {
    marginTop: 40,
  },
  deleteTouchable: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  deleteText: {
    fontSize: 16,
    color: Colors.fontBlueColor,
  },
});

class ContactInfoScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      contentChangeCount: 1,
      isShowDialog: false,
      isShowNameWarn: false,
      isShowAddressWarn: false,
      nameWarn: I18n.t('settings.enter_normative_contact_name'),
      addressWarn: I18n.t('toast.enter_valid_transfer_address'),
    };

    this.contactInfo = {};
    this.index = undefined;
    this.storageId = undefined;
    this.name = '';
    this.remark = '';
    this.address = '';
    this.isAddressFocus = '';
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
    this.contactInfo = this.props.navigation.state.params.contactInfo;
    this.index = this.props.navigation.state.params.index;

    this.name = this.contactInfo.name;
    this.remark = this.contactInfo.remark;
    this.address = this.contactInfo.address;

    const { contentChangeCount } = this.state;
    this.setState(
      {
        contentChangeCount: contentChangeCount + 1,
        // name:this.contactInfo.name,
        // remark:this.contactInfo.remark,
        // address:this.contactInfo.address,
      },
      this.getStorageId
    );

    // this.getStorageId();
  };

  getStorageId = async () => {
    const ids = await StorageManage.loadIdsForKey(StorageKey.Contact);
    this.storageId = ids[this.index];
  };

  btnIsEnableClick() {
    if (
      this.name === '' ||
      this.address === '' ||
      this.name.length > 12 ||
      (this.name === this.contactInfo.name &&
        this.remark === this.contactInfo.remark &&
        this.address === this.contactInfo.address)
    ) {
      this.setState({
        isDisabled: true,
        isShowNameWarn: !!(this.name === '' || this.name.length > 12),
      });
    } else {
      this.setState({
        isDisabled: false,
        isShowNameWarn: false,
      });
    }
  }

  vertifyAddress() {
    let addressIsOK = true;
    if (this.address !== '') {
      const itc_address = (this.address.indexOf('ITC')>-1)?'0x'+this.address.replace('ITC',''):this.address
      addressIsOK = NetworkManager.isValidAddress(itc_address);
      const disabled =
        this.name === '' ||
        (this.name === this.contactInfo.name &&
          this.remark === this.contactInfo.remark &&
          this.address === this.contactInfo.address) ||
        !addressIsOK ||
        this.name.length > 12;
      this.setState({
        isShowAddressWarn: !addressIsOK,
        isDisabled: disabled,
      });
    } else if (!this.state.isDisabled) {
      this.setState({
        isDisabled: true,
      });
    }
  }

  scanClick = async () => {
    Keyboard.dismiss();
    const _this = this;
    let isAgree = true;
    if (Platform.OS === 'android') {
      isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (isAgree) {
      this.props.navigation.navigate('ScanQRCode', {
        callback(data) {
          const address = data.toAddress;
          _this.address = address;
          _this.setState({
            // address: address
            contentChangeCount: this.state.contentChangeCount + 1,
          });
          _this.vertifyAddress();
        },
      });
    } else {
      this._showAlert(I18n.t('modal.permission_camera'));
    }
  };

  nameOnChangeText = text => {
    this.name = text;
    this.btnIsEnableClick();
  };

  remarkOnChangeText = text => {
    this.remark = text;
    this.btnIsEnableClick();
  };

  addressOnChangeText = text => {
    this.address = text;
    const { contentChangeCount } = this.state;
    this.setState({
      // address:text,
      contentChangeCount: contentChangeCount + 1,
    });
    this.vertifyAddress();
  };

  async saveModify() {
    Keyboard.dismiss();
    const c_toAddress = this.address.indexOf('ITC')>-1?'0x'+this.address.replace('ITC',''):this.address
    if (!NetworkManager.isValidAddress(c_toAddress)) {
      showToast(I18n.t('toast.enter_valid_transfer_address'));
      return;
    }
    const object = {
      name: this.name,
      address: this.address,
      remark: this.remark,
    };
    StorageManage.save(StorageKey.Contact, object, this.storageId);
    const contactData = await StorageManage.loadAllDataForKey(StorageKey.Contact);
    this.props.setContactList(contactData);

    this.props.navigation.state.params.callback({});
    this.props.navigation.goBack();
  }

  deleteContact() {
    this.setState({
      isShowDialog: true,
    });
  }

  async onConfirmDelete() {
    this.setState({
      isShowDialog: false,
    });
    StorageManage.remove(StorageKey.Contact, this.storageId);

    const contactData = await StorageManage.loadAllDataForKey(StorageKey.Contact);
    this.props.setContactList(contactData);

    this.props.navigation.state.params.callback({});
    this.props.navigation.goBack();
  }

  onCancelClick() {
    this.setState({
      isShowDialog: false,
    });
  }

  _closeModal = () => {
    this.setState({
      isShowDialog: false,
    });
  };

  renderComponent = () => (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderGrant={() => {
        Keyboard.dismiss();
      }}
    >
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={this.contactInfo.name}
        rightPress={() => this.scanClick()}
        rightIcon={require('../../assets/common/scanIcon.png')}
      />
      <RemindDialog
        content={I18n.t('settings.make_sure_delete_contact')}
        modalVisible={this.state.isShowDialog}
        leftPress={() => this.onCancelClick()}
        rightPress={() => this.onConfirmDelete()}
        leftTxt={I18n.t('modal.cancel')}
        rightTxt={I18n.t('modal.confirm')}
      />

      <View style={styles.contentBox}>
        <Text style={styles.text}>{I18n.t('settings.name')} </Text>
        <CommonTextInput
          textInputStyle={styles.textInput}
          onChangeText={this.nameOnChangeText}
          defaultValue={this.name}
        />
        <Text style={this.state.isShowNameWarn ? styles.warnTxt : styles.warnTxtHidden}>
          {this.state.nameWarn}
        </Text>
        <Text style={styles.text}>{I18n.t('settings.remarks')}</Text>
        <CommonTextInput
          textInputStyle={styles.textInput}
          onChangeText={this.remarkOnChangeText}
          defaultValue={this.remark}
        />

        <Text style={styles.text}>{I18n.t('settings.wallet_address')}</Text>
        <CommonTextInput
          textInputStyle={styles.textInput}
          returnKeyType="done"
          onChangeText={this.addressOnChangeText}
          defaultValue={this.address}
          onFocus={() => {
            this.isAddressFocus = true;
            this.vertifyAddress();
          }}
          onBlur={() => {
            this.isAddressFocus = false;
          }}
        />
        <Text style={this.state.isShowAddressWarn ? styles.warnTxt : styles.warnTxtHidden}>
          {this.state.addressWarn}
        </Text>
        <BlueButtonBig
          buttonStyle={styles.button}
          isDisabled={this.state.isDisabled}
          onPress={() => this.saveModify()}
          text={I18n.t('settings.save_changes')}
        />
        <TouchableOpacity
          style={styles.deleteTouchable}
          activeOpacity={0.6}
          onPress={() => this.deleteContact()}
        >
          <Text style={styles.deleteText}>{I18n.t('settings.delete_contact')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
)(ContactInfoScreen);
