import React from 'react';
import { View, StyleSheet, WebView, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH,
    marginBottom: 20,
  },
  webview: {
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Layout.WINDOW_WIDTH * 0.9 - 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  checkImage: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 8,
  },
  checkText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 20 - 26,
    color: Colors.fontBlueColor,
    fontSize: 14,
  },
  button: {
    // width:Layout.WINDOW_WIDTH*0.8,
    marginTop: 10,
    alignSelf: 'center',
  },
});

// const GetWebviewHeight = `(function(){
//     var height = null;
//     function changeHeight(){
//         if(document.body.scrollHeight != height){
//             height = document.body.scrollHeight;
//             if(window.postMessage){
//                 window.postMessage(JSON.stringify({
//                     type:'setHeight',
//                     height:height,
//                 }))
//             }
//         }
//     }
//     setInterval(changeHeight,300);
// } ())
// `;
export default class ServiceAgreementScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
      isDisabled: true,
      webviewHeight: Layout.WINDOW_HEIGHT - 200,
    };
  }

  isAgreePress() {
    const isAg = this.state.isAgree;
    this.setState({ isAgree: !isAg });
  }

  agreeBtn() {
    this.props.navigation.state.params.callback({ isShowPin: true });
    this.props.navigation.goBack();
  }

  onLoadEnd = () => {
    this.setState({
      isDisabled: false,
    });
    // try {
    //   const action = JSON.parse(event.nativeEvent.data);
    //   if (action.type === 'setHeight' && action.height > 0) {
    //     this.setState({
    //       webviewHeight: action.height,
    //     });
    //   }
    // } catch (err) {
    //   console.log('onMessage', err);
    // }
  };

  renderComponent = () => {
    const checkIcon = this.state.isAgree
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png');
    const lang = I18n.locale;
    const webUri =
      lang === 'zh'
        ? 'https://wallet.iotchain.io/serviceAgreement.html'
        : 'https://wallet.iotchain.io/serviceAgreement_en.html'
    return (
      <View style={styles.container}>
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('launch.service_agreement')}
        />
        <ScrollView bounces={false} style={[styles.contentBox]}>
          <WebView
            style={[styles.webview, { height: this.state.webviewHeight }]}
            source={{ uri: webUri, method: 'GET' }}
            // injectedJavaScript={GetWebviewHeight}
            // scalesPageToFit
            // javaScriptEnabled
            startInLoadingState
            bounces={false}
            scrollEnabled
            automaticallyAdjustContentInsets
            // contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
            // onMessage={this.onMessage}
            domStorageEnabled
            onLoadEnd={this.onLoadEnd}
          />
          <TouchableOpacity
            style={styles.checkBox}
            disabled={this.state.isDisabled}
            activeOpacity={0.6}
            onPress={() => this.isAgreePress()}
          >
            <Image style={styles.checkImage} source={checkIcon} resizeMode="contain" />
            <Text style={styles.checkText}>{I18n.t('launch.agree_service_agreement')}</Text>
          </TouchableOpacity>
          <BlueButtonBig
            buttonStyle={styles.button}
            isDisabled={!this.state.isAgree}
            onPress={() => this.agreeBtn()}
            text={I18n.t('launch.agree_and_set_login_password')}
          />
        </ScrollView>
      </View>
    );
  };
}
