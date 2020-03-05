import React, { Component } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import lodash from 'lodash';
import store from './config/store/ConfigureStore';
import Navigator from './navigation';
import Analytics from './utils/Analytics';

console.disableYellowBox = true;//关闭警告提示
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false });
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });

// 给全局文本组件添加空字体，fix在某些android机型上，添加fontWeight导致字体隐藏的问题
const styles = StyleSheet.create({
  defaultFontFamily: {
    // fontFamily: 'system font',
  },
});

Text.render = lodash.wrap(Text.render, (func, ...args) => {
  const originText = func.apply(this, args);
  return React.cloneElement(originText, {
    style: [originText.props.style, styles.defaultFontFamily],
  });
});

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getCurrentRouteName(currentState);
            const prevScreen = getCurrentRouteName(prevState);
            if (prevScreen !== currentScreen) {
              Analytics.setCurrentScreen(currentScreen);
            }
          }}
        />
      </Provider>
    );
  }
}
