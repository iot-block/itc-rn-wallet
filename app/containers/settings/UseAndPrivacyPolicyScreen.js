import React from 'react';
import { View, StyleSheet, WebView, ScrollView } from 'react-native';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
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

const GetWebviewHeight = `(function(){
    var height = null;
    function changeHeight(){
        if(document.body.scrollHeight != height){
            height = document.body.scrollHeight;
            if(window.postMessage){
                window.postMessage(JSON.stringify({
                    type:'setHeight',
                    height:height,
                }))
            }
        }
    }
    setInterval(changeHeight,300);
} ())
`;
export default class UseAndPrivacyPolicyScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
      webviewHeight: Layout.WINDOW_HEIGHT,
    };
  }

  isAgreePress() {
    this.setState(prevState => ({ isAgree: !prevState.isAgree }));
  }

  agreeBtn() {
    this.props.navigation.state.params.callback({ isShowPin: true });
    this.props.navigation.goBack();
  }

  onMessage(event) {
    try {
      const action = JSON.parse(event.nativeEvent.data);

      if (action.type === 'setHeight' && action.height > 0) {
        this.setState({
          webviewHeight: action.height,
        });
      }
    } catch (err) {
      console.log('onMessage', err);
    }
  }

  renderComponent = () => (
    /* const checkIcon = this.state.isAgree
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png'); */
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={I18n.t('settings.terms_use_and_privacy_policy')}
      />
      <ScrollView style={[styles.contentBox]}>
        <WebView
          style={[styles.webview, { height: this.state.webviewHeight }]}
          source={{ uri: 'https://wallet.iotchain.io/serviceAgreement.html', method: 'GET' }}
          injectedJavaScript={GetWebviewHeight} // 当网页加载之前注入一段 js 代码。其值是字符串形式。
          scalesPageToFit // ios 用于设置网页是否缩放自适应到整个屏幕视图，以及用户是否可以改变缩放页面
          javaScriptEnabled // android  是否开启 JavaScript，在ios中的WebView是默认开启的
          decelerationRate="normal"
          startInLoadingState // 是否开启页面加载的状态，其值为 true 或者 false。
          bounces={false} // ios 回弹特性。默认为 true。如果设置为 false，则内容拉到底部或者头部都不回弹。
          scrollEnabled={false} // ios 用于设置是否开启页面滚动
          automaticallyAdjustContentInsets // 设置是否自动调整内容
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }} // 设置内容所占的尺寸大小。格式：{top:number,left:number,bottom:number,right:number}
          domStorageEnabled // android 用于控制是否开启 DOM Storage（存储）
          onMessage={this.onMessage}
        />
      </ScrollView>
    </View>
  );
}
