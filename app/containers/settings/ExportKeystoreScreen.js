import React from 'react';
import { View, StyleSheet, Image, Text, Clipboard, ScrollView } from 'react-native';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import { showToast } from '../../utils/Toast';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGrayColor,
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
  },
  warnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgBlue_9a,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
  warnIcon: {
    width: 42,
    height: 42,
    marginRight: 10,
  },
  warnTxt: {
    flex: 1,
    color: Colors.fontWhiteColor,
    fontSize: 14,
    lineHeight: 16,
  },
  privateKeyBox: {
    height: 180,
    backgroundColor: Colors.bgGrayColor_ed,
    borderRadius: 5,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  privateKeyScroll: {
    // overflow:'auto',
    flex: 1,
    // justifyContent:'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  privateKeyText: {
    color: Colors.fontBlackColor_31,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  buttonBox: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
});

export default class ExportKeystoreScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      keystore: '',
      screenshotWarnVisible: false,
    };
  }

  _initData = () => {
    this.showKeystore();
  };

  showKeystore() {
    this.setState({
      keystore: this.props.navigation.state.params.keystore,
      screenshotWarnVisible: true,
    });
  }

  _closeModal = () => {
    this.onCloseModal();
  };

  /** async exportKeystore(){
        try{
              //this.refs.loading.show();
              
              var key = 'uesr'
              var user = await StorageManage.load(key);
              if(user == null){
                  throw "请先创建或导入钱包"
              }
              try{
                  var str = await KeystoreUtils.importFromFile(user.address)
              }catch(e){
                throw "导出KeyStore出错"
              }
              //var newKeyObject = JSON.parse(str)
              //this.refs.loading.close()
              this.setState({
                keystore:str,
                loadingVisible:false,
                screenshotWarnVisible:true
              })
        }catch (err) {
            this.setState({
                loadingVisible:false,
            });
            showToast(err);
            console.log('exportKeystoreErr:', err)
        }
    }* */
  onCloseModal() {
    requestAnimationFrame(() => {
      // 下一帧就立即执行回调,可以异步来提高组件的响应速度
      this.setState({ screenshotWarnVisible: false });
    });
  }

  copy() {
    Clipboard.setString(this.state.keystore);
    showToast(I18n.t('toast.copied_keystore'));
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.export_keystore')} />
      <ScreenshotWarn
        content={I18n.t('settings.export_keystore_modal_prompt')}
        content1={I18n.t('settings.export_keystore_modal_prompt1')}
        btnText={I18n.t('modal.i_know')}
        modalVisible={this.state.screenshotWarnVisible}
        onPress={() => this.onCloseModal()}
      />
      <View style={styles.contentBox}>
        <View style={styles.warnBox}>
          <Image
            style={styles.warnIcon}
            source={require('../../assets/set/ShieldIcon.png')}
            resizeMode="contain"
          />
          <Text style={styles.warnTxt}>{I18n.t('settings.export_keystore_prompt')}</Text>
        </View>

        <View style={styles.privateKeyBox}>
          <ScrollView style={styles.privateKeyScroll}>
            <Text style={styles.privateKeyText}>{this.state.keystore}</Text>
          </ScrollView>
        </View>

        <View style={styles.buttonBox}>
          <BlueButtonBig onPress={() => this.copy()} text={I18n.t('settings.copy_keystore')} />
        </View>
      </View>
    </View>
  );
}
