import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Linking } from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    alignSelf: 'center',
    width: 120,
    height: 136.5,
    marginTop: Layout.WINDOW_HEIGHT * 0.1,
    marginBottom: 16,
  },
  title: {
    alignSelf: 'center',
    color: Colors.fontBlackColor_0a,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  version: {
    alignSelf: 'center',
    color: Colors.fontBlackColor_0a,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: Layout.WINDOW_HEIGHT * 0.1,
  },
  itemBox: {
    height: 45,
  },
  item: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.fontDarkColor,
    paddingLeft: 20,
  },
  itemIcon: {
    width: 14,
    height: 14,
    marginRight: 20,
  },
  itemTouchable: {
    alignItems: 'center',
    paddingRight: 20,
  },
  itemUrl: {
    fontSize: 14,
    color: Colors.fontBlueColor,
  },
  itemLine: {
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  itemLine10: {
    height: 10,
    backgroundColor: Colors.bgGrayColor,
  },
});

export default class AboutUsScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
    };
    this.version = '';
  }

  _initData = () => {
    this.setState({
      version: `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`,
    });
  };

  _toPrivacyPolicyPage() {
    this.props.navigation.navigate('UseAndPrivacyPolicy');
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.about')} />
      <Image
        style={styles.image}
        source={require('../../assets/set/logo_black.png')}
        resizeMode="contain"
      />
      <Text style={styles.title}>ITC Wallet</Text>
      <Text style={styles.version}>{this.state.version}</Text>

      {/* <TouchableOpacity  style={styles.item}
                                   activeOpacity={0.6}
                                   onPress={()=>this._toPrivacyPolicyPage()}>
                    <Text style={styles.itemTitle}>{I18n.t('settings.terms_use_and_privacy_policy')}</Text>
                    <Image style={styles.itemIcon} source={require('../../assets/set/next.png')} resizeMode='contain'/>
                </TouchableOpacity>
        <View style={styles.itemLine10}></View> */}

      <Item title="Website" url="iotchain.io" isDisabled={false} />
      <Item title="Email" url="support@iotchain.io" isDisabled />
      <Item title="Telegram" url="https://t.me/IoTChain" isDisabled={false} />
    </View>
  );
}

class Item extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  };

  _onPress = () => {
    const { url } = this.props;
    let urlLink;
    if (url.substr(0, 5) === 'https') {
      urlLink = url;
    } else {
      urlLink = `https://${url}`;
    }

    Linking.canOpenURL(urlLink)
      .then(supported => {
        if (supported) {
          Linking.openURL(urlLink);
        } else {
          // showToast('打不开')
        }
      })
      .catch(err => Analytics.recordErr('OpenURLCatchErr', err));
  };

  render() {
    const { title, isDisabled, url } = this.props;
    return (
      <View style={styles.itemBox}>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{title}</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.itemTouchable}
            onPress={this._onPress}
            disabled={isDisabled}
          >
            <Text style={styles.itemUrl}>{url}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemLine} />
      </View>
    );
  }
}
