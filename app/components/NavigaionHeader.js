import React, { Component, PureComponent } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Keyboard } from 'react-native';

// import {StackNavigator} from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { BackWhiteButton } from './Button';
import Layout from '../config/LayoutConstants';
import { Colors, FontSize } from '../config/GlobalConfig';

const styles = StyleSheet.create({
  headerBgContainer: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH,
    backgroundColor: Colors.whiteBackgroundColor,
    zIndex: 10,
  },
  blackBgContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  transparentBgContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  icon: {
    height: 20,
    width: 20,
  },
  rightIcon: {
    height: 20,
    width: 20,
  },
  backWhiteIcon: {
    height: 16,
    width: 24,
  },
  headerButtonBox: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerTitleBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH - 100,
  },
  headerTitle: {
    fontSize: FontSize.HeaderSize,
    color: Colors.fontDarkColor,
    width: Layout.WINDOW_WIDTH - 100,
    textAlign: 'center',
  },
  whiteTitle: {
    fontSize: FontSize.HeaderSize,
    color: 'white',
    width: Layout.WINDOW_WIDTH - 100,
    textAlign: 'center',
  },
  rightText: {
    color: Colors.fontBlueColor,
    fontSize: 14,
    alignSelf: 'flex-end',
    height: 40,
    lineHeight: 40,
  },
});

// 白色返回按钮
class BlueHeader extends Component {
  //
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigation } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();

    return (
      <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']} style={[{ height }]}>
        <BackWhiteButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </LinearGradient>
    );
  }
}

// Header {黑色背景 白色返回按钮 白色title}
class BlackBgHeader extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    text: PropTypes.string,
    rightPress: PropTypes.func,
    rightIcon: PropTypes.number,
  };

  render() {
    const { navigation, text, rightPress, rightIcon } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();
    let contentMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      contentMarginTop = { marginTop: 48 };
    }
    return (
      <View style={[styles.blackBgContainer, { height }]}>
        <TouchableOpacity
          style={[styles.headerButtonBox, contentMarginTop]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={require('../assets/common/common_back_white.png')}
          />
        </TouchableOpacity>

        <View style={[styles.headerTitleBox, contentMarginTop]}>
          <Text style={styles.whiteTitle} numberOfLines={1}>
            {text}
          </Text>
        </View>

        <TouchableOpacity style={[styles.headerButtonBox, contentMarginTop]} onPress={rightPress}>
          <Image style={styles.icon} resizeMode="contain" source={rightIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

// Header {透明背景 白色返回按钮 白色title}
class TransparentBgHeader extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    text: PropTypes.string,
    rightPress: PropTypes.func,
    rightIcon: PropTypes.number,
  };

  render() {
    const { navigation, text, rightPress, rightIcon } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();
    let contentMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      contentMarginTop = { marginTop: 48 };
    }
    return (
      <View style={[styles.transparentBgContainer, { height }]}>
        <TouchableOpacity
          style={[styles.headerButtonBox, contentMarginTop]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={styles.backWhiteIcon}
            resizeMode="contain"
            source={require('../assets/common/common_back_white.png')}
          />
        </TouchableOpacity>

        <View style={[styles.headerTitleBox, contentMarginTop]}>
          <Text style={styles.whiteTitle} numberOfLines={1}>
            {text}
          </Text>
        </View>

        <TouchableOpacity style={[styles.headerButtonBox, contentMarginTop]} onPress={rightPress}>
          <Image style={styles.icon} resizeMode="contain" source={rightIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

// Header {透明背景 无返回按钮 白色title}
class TransparentBgNoBackButtonHeader extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    text: PropTypes.string,
    rightPress: PropTypes.func,
    rightIcon: PropTypes.number,
  };

  render() {
    const { navigation, text, rightPress, rightIcon } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();
    let contentMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      contentMarginTop = { marginTop: 48 };
    }
    return (
      <View style={[styles.transparentBgContainer, { height }]}>
        
        <View style={[styles.headerTitleBox, contentMarginTop]}>
          <Text style={styles.whiteTitle} numberOfLines={1}>
            {text}
          </Text>
        </View>

        {/* <TouchableOpacity style={[styles.headerButtonBox, contentMarginTop]} onPress={rightPress}>
          <Image style={styles.icon} resizeMode="contain" source={rightIcon} />
        </TouchableOpacity> */}
      </View>
    );
  }
}

// Header {白色背景 蓝色返回按钮 黑色title}
class WhiteBgHeader extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    leftPress: PropTypes.func,
    text: PropTypes.string,
    rightPress: PropTypes.func,
    rightIcon: PropTypes.number,
    rightText: PropTypes.string,
  };

  render() {
    const { navigation, text, rightPress, rightIcon, rightText, leftPress } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();
    let contentMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      contentMarginTop = { marginTop: 48 };
    }
    return (
      <View style={[styles.headerBgContainer, { height }]}>
        <TouchableOpacity
          style={[styles.headerButtonBox, contentMarginTop, { marginRight: rightText ? 60 : 0 }]}
          onPress={
            leftPress === undefined
              ? () => {
                  Keyboard.dismiss();
                  navigation.goBack();
                }
              : leftPress
          }
        >
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={require('../assets/common/common_back.png')}
          />
        </TouchableOpacity>

        <View style={[styles.headerTitleBox, contentMarginTop]}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {text}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerButtonBox, contentMarginTop, { width: rightText ? 100 : 40 }]}
          onPress={rightPress}
        >
          {!rightText ? (
            <Image style={styles.rightIcon} resizeMode="contain" source={rightIcon} />
          ) : (
            <Text style={styles.rightText} numberOfLines={1}>
              {rightText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

class WhiteBgNoBackHeader extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    const { text } = this.props;
    return (
      <View style={[{ height: 44, backgroundColor: '#32beff' }]}>
        <View style={styles.headerTitleBox}>
          <Text style={styles.whiteTitle} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </View>

      /* <View style={[styles.headerBgContainer, { height: 44 }]}>
                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>
                        {this.props.text}
                    </Text>
                </View>
        </View> */
    );
  }
}

class WhiteBgNoTitleHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onPress: PropTypes.func,
  };

  render() {
    const { navigation, onPress } = this.props;
    const height = Layout.NAVIGATION_HEIGHT();
    let contentMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      contentMarginTop = { marginTop: 48 };
    }
    return (
      <View style={[styles.headerBgContainer, { height }]}>
        <TouchableOpacity
          style={[styles.headerButtonBox, contentMarginTop]}
          onPress={
            onPress === undefined
              ? () => {
                  Keyboard.dismiss();
                  navigation.goBack();
                }
              : onPress
          }
        >
          <Image
            style={styles.icon}
            // resizeMode={'contain'}
            resizeMode="contain"
            source={require('../assets/common/common_back.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export {
  BlueHeader,
  WhiteBgHeader,
  WhiteBgNoTitleHeader,
  BlackBgHeader,
  TransparentBgHeader,
  WhiteBgNoBackHeader,
  TransparentBgNoBackButtonHeader
};
