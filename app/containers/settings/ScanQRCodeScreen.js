import React from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import {RNCamera} from 'react-native-camera';
import { connect } from 'react-redux';
import BaseComponent from '../base/BaseComponent';
import { BlackBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scanBox: {
    flex: 1,
    // backgroundColor:'black',
    // justifyContent:'center',
    // alignItems:'center',
  },
  scanView: {
    width: 220,
    height: 220,
  },
  scanBorder: {
    position: 'absolute',
    borderColor: 'rgb(85,146,246)',
    width: 220,
    height: 220,
  },
  topLeft: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    top: 0,
    left: 0,
  },
  topRight: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  bottomRight: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scanLine: {
    height: 2,
    width: 220,
    backgroundColor: 'rgb(85,146,246)',
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor:'rgba(0,0,0,0.6)'
  },
  tranView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

class ScanQRCodeScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isGetResult: false, // 是否获得扫描结果
      isAnimatin: true, // 是否需要执行扫描动画
      animatedValue: new Animated.Value(0),
    };
    this.scanLine = Animated.timing(this.state.animatedValue, {
      toValue: 200,
      duration: 2000,
      easing: Easing.linear,
    });

    this._setStatusBarStyleLight();
  }

  _initData = () => {
    this.scanLineMove();
  };

  // 扫描二维码结果
  _onBarCodeRead(e) {
    if (!this.state.isGetResult) {
      // 避免多次返回
      this.setState({
        isGetResult: true,
        isAnimatin: false,
      });
      const result = e.data;
      this.props.navigation.state.params.callback({ toAddress: result });
      this.props.navigation.goBack();
    }
  }

  // 扫描框
  _renderQRScanView() {
    const animatedStyle = {
      transform: [{ translateY: this.state.animatedValue }],
    };
    return (
      <View style={styles.scanView}>
        <View style={[styles.scanBorder, styles.topLeft]} />
        <View style={[styles.scanBorder, styles.topRight]} />
        <View style={[styles.scanBorder, styles.bottomLeft]} />
        <View style={[styles.scanBorder, styles.bottomRight]} />
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          <View style={styles.scanLine} />
        </Animated.View>
      </View>
    );
  }

  // 扫描条动画
  scanLineMove() {
    if (this.state.isAnimatin) {
      this.state.animatedValue.setValue(0);
      this.scanLine.start(() => this.scanLineMove()); // 循环扫描
    }
  }

  stopLineMove() {
    this.setState({
      isAnimatin: false,
    });
  }

  _removeEventListener() {
    // this.state.animatedValue.stopAnimation()
    this.stopLineMove();
  }

  renderComponent = () => (
    <View style={styles.container}>
      <BlackBgHeader navigation={this.props.navigation} text={I18n.t('settings.scan_qrcode')} />

      <RNCamera
        style={styles.contentContainer}
        type={RNCamera.Constants.Type.back}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onBarCodeRead={e => this._onBarCodeRead(e)}
        // aspect={RNCamera.constants.Aspect.fill}
      >
        <View style={styles.scanBox}>
          <View style={styles.tranView} />
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.tranView} />
            {this._renderQRScanView()}
            <View style={styles.tranView} />
          </View>
          <View style={styles.tranView}>
            <Text style={styles.text}>{I18n.t('settings.scan_qrcode_prompt')}</Text>
          </View>
        </View>
      </RNCamera>
    </View>
  );
}
// {this._renderQRScanView()}

const mapStateToProps = state => ({
  balance: state.Core.balance,
});

export default connect(
  mapStateToProps,
  {}
)(ScanQRCodeScreen);
