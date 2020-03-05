import React from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, Platform } from 'react-native';

import { NavigationActions, DrawerActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { BlurView } from 'react-native-blur';
import store from '../../config/store/ConfigureStore';
import { DrawerCell, DrawerCellReminder } from './component/DrawerCell';
import { Colors } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from '../../components/Loading';
import LayoutConstants from '../../config/LayoutConstants';

const styles = StyleSheet.create({
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

class DrawerComponent extends BaseComponent {
  navigateToScreen = (route, params) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params,
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this._barStyle = 'light-content';
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowReminder: false,
      noticeNumber: 0,
    };

    this.messageCount = 0;
  }

  _messageCountEmitter = data => {
    this.setState({
      isShowReminder: data.messageCount > 0,
      noticeNumber: data.messageCount,
    });
  };

  render() {
    // 这个地方直接render，防止把其他页面的状态栏颜色改了
    if (this.props.navigation.state.isDrawerOpen) {
      this._barStyle = 'dark-content';
    } else {
      this._barStyle = 'light-content';
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBarComponent barStyle={this._barStyle} />
        <View
          style={{
            marginTop: 80,
            height: 70,
            backgroundColor: Colors.bgBlue_drawer_top,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          <Image
            source={require('../../assets/home/menu/menu_icon.png')}
            style={{ height: 46, width: 46, marginLeft: 21 }}
          />
          <Text
            style={{
              fontSize: 15,
              marginLeft: 10,
              color: Colors.fontBlackColor_31,
              fontWeight: '400',
            }}
          >
            {store.getState().Core.wallet.name}
          </Text>
        </View>
        <ScrollView style={{ marginTop: 50 }}>
          <DrawerCellReminder
            onClick={this.navigateToScreen('MessageCenter')}
            text={I18n.t('settings.message_center')}
            imageSource={require('../../assets/home/menu/menu_notice.png')}
            isShowReminder={this.state.isShowReminder}
            noticeNumber={this.state.noticeNumber}
          />
          <View style={{ backgroundColor: Colors.bgGrayColor, height: 1, marginHorizontal: 5 }} />
          <DrawerCell
            onClick={this.navigateToScreen('Set')}
            text={I18n.t('home.wallet_tool')}
            imageSource={require('../../assets/home/menu/menu_tool.png')}
          />
          <DrawerCell
            onClick={this.navigateToScreen('ContactList', { from: 'home' })}
            text={I18n.t('home.contact')}
            imageSource={require('../../assets/home/menu/menu_contact.png')}
          />
          <DrawerCell
            onClick={this.navigateToScreen('SystemSet')}
            text={I18n.t('home.system_settings')}
            imageSource={require('../../assets/home/menu/menu_set.png')}
          />
          <View style={{ backgroundColor: Colors.bgGrayColor, height: 1, marginHorizontal: 5 }} />
          <DrawerCell
            onClick={this.navigateToScreen('Feedback')}
            text={I18n.t('home.feedback')}
            imageSource={require('../../assets/home/menu/menu_feedback.png')}
          />
          <DrawerCell
            onClick={this.navigateToScreen('AboutUs')}
            text={I18n.t('home.about')}
            imageSource={require('../../assets/home/menu/menu_about.png')}
          />
        </ScrollView>
        {Platform.OS === 'ios' && this.state.showBlur && (
          <BlurView style={styles.blurStyle} blurType="light" blurAmount={10} />
        )}
        {this.state.isShowLoading === undefined ? null : (
          <Loading visible={this.state.isShowLoading} />
        )}
      </SafeAreaView>
    );
  }
}

DrawerComponent.prototypes = {
  navigation: PropTypes.object,
};

export default DrawerComponent;
