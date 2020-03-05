import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../config/LayoutConstants';
import { Colors, FontSize } from '../config/GlobalConfig';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  backBtn: {
    marginLeft: 12,
    width: 20,
    height: 20,
  },
  headerRight: {
    marginRight: 15,
    width: 20,
    height: 20,
  },
  backItem: {
    width: 20,
    height: 20,
  },
  normalBtn: {
    width: Layout.WINDOW_WIDTH * 0.9,
    // alignSelf:'stretch',
    height: 44,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 20,
  },
  normalBtnGradient: {
    width: Layout.WINDOW_WIDTH * 0.9,
    // alignSelf:'stretch',
    height: 44,
    borderRadius: 5,
    justifyContent: 'center',
  },
  normalBtnTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greyBtn: {
    backgroundColor: Colors.fontGrayColor_a0,
  },
  blueBtn: {
    backgroundColor: Colors.fontBlueColor,
  },
  blueBtnTitle: {
    color: Colors.fontWhiteColor,
  },
  GreyBtnText: {
    color: 'white',
  },
  whiteBtn: {
    backgroundColor: Colors.fontWhiteColor,
    borderColor: Colors.fontWhiteColor,
  },
  whiteBtnTitle: {
    color: Colors.fontBlueColor,
  },
  clearBtn: {
    backgroundColor: Colors.clearColor,
    borderColor: Colors.fontWhiteColor,
  },
  clearBtnTitle: {
    color: Colors.fontWhiteColor,
  },
  redBtn: {
    backgroundColor: Colors.ClearColor,
    borderColor: Colors.fontWhiteColor,
  },
  normalMiddleBtn: {
    width: Layout.WINDOW_WIDTH * 0.7,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  normalMiddleBtnTitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  middleWhiteBtn: {
    borderWidth: 1.5,
    borderColor: Colors.fontBlueColor,
    backgroundColor: Colors.fontWhiteColor,
  },
  middleWhiteBtnTitle: {
    color: Colors.fontBlueColor,
  },
  middleBlueBtnTitle: {
    color: Colors.fontWhiteColor,
  },
  normalSmallBtn: {
    width: Layout.WINDOW_WIDTH * 0.35,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  btnOpacity: {
    flexDirection: 'row',
    height: 56,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  txt: {
    flex: 1,
    backgroundColor: 'transparent',
    color: Colors.fontBlackColor_43,
    fontSize: FontSize.TitleSize,
    height: 56,
    lineHeight: 56,
    textAlign: 'left',
  },
  icon: {
    width: 8,
    height: 12,
  },

  whiteBorderBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  rightBlueNextTxt: {
    color: Colors.fontBlueColor,
  },
  whiteTxt: {
    color: Colors.fontWhiteColor,
  },
  nextIcon: {
    height: 12,
    width: 12,
  },
});

class BackButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  render() {
    const { onPress } = this.props;
    let backItemStyle = { marginTop: 0 };

    if (Layout.DEVICE_IS_IPHONE_X()) {
      backItemStyle = { marginTop: 0 };
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.backBtn, backItemStyle]} onPress={onPress}>
          <Image
            style={styles.backItem}
            resizeMode="contain"
            source={require('../assets/common/common_back.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class BackWhiteButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  render() {
    const { onPress } = this.props;
    let backItemStyle = { marginTop: 30 };

    if (Layout.DEVICE_IS_IPHONE_X()) {
      backItemStyle = { marginTop: 50 };
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.backBtn, backItemStyle]} onPress={onPress}>
          <Image
            style={styles.backItem}
            resizeMode="contain"
            source={require('../assets/common/common_back_white.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

// 透明按钮
class ClarityWhiteButtonBig extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { onPress, text } = this.props;
    return (
      <TouchableOpacity style={[styles.normalBtn, styles.clearBtn]} onPress={onPress}>
        <Text style={[styles.clearBtnTitle, styles.normalBtnTitle]} numberOfLines={1}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

class BlueButtonBig extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    buttonStyle: PropTypes.object,
  };

  render() {
    const { buttonStyle, isDisabled, onPress, text } = this.props;
    return (
      // <TouchableOpacity style={[styles.normalBtn, this.props.isDisabled ? styles.greyBtn : styles.blueBtn,this.props.buttonStyle]}
      <TouchableOpacity
        style={[styles.normalBtn, buttonStyle]}
        activeOpacity={0.6}
        disabled={isDisabled}
        onPress={onPress}
      >
        <LinearGradient
          colors={isDisabled ? ['#a0a0a0', '#a0a0a0', '#a0a0a0'] : ['#66ceff', '#0094ff']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.normalBtnGradient, { flex: 1 }]}
        >
          <Text style={[styles.blueBtnTitle, styles.normalBtnTitle]} numberOfLines={1}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

class GreyButtonBig extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    buttonStyle: PropTypes.object,
  };

  render() {
    const { buttonStyle, isDisabled, onPress, text } = this.props;
    return (
      // <TouchableOpacity style={[styles.normalBtn, this.props.isDisabled ? styles.greyBtn : styles.blueBtn,this.props.buttonStyle]}
      <TouchableOpacity
        style={[styles.normalBtn, buttonStyle]}
        activeOpacity={0.6}
        disabled={isDisabled}
        onPress={onPress}
      >
        <LinearGradient
          colors={['#a0a0a0', '#a0a0a0', '#a0a0a0']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.normalBtnGradient, { flex: 1 }]}
        >
          <Text style={[styles.GreyBtnText, styles.normalBtnTitle]} numberOfLines={1}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

class GreyButtonMidele extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    buttonStyle: PropTypes.object,
  };

  render() {
    const { buttonStyle, isDisabled, onPress, text } = this.props;
    return (
      // <TouchableOpacity style={[styles.normalBtn, this.props.isDisabled ? styles.greyBtn : styles.blueBtn,this.props.buttonStyle]}
      <TouchableOpacity
        style={[styles.normalMiddleBtn, buttonStyle]}
        activeOpacity={0.6}
        disabled={isDisabled}
        onPress={onPress}
      >
        <LinearGradient
          colors={['#D2D2D2', '#D2D2D2', '#D2D2D2']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.normalMiddleBtn, buttonStyle , { flex: 1 }]}
        >
          <Text style={[styles.middleBlueBtnTitle, styles.normalMiddleBtnTitle]} numberOfLines={1}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

class WhiteButtonBig extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    buttonStyle: PropTypes.object,
  };

  render() {
    const { buttonStyle, onPress, text } = this.props;
    return (
      <TouchableOpacity
        style={[styles.normalBtn, styles.whiteBtn, buttonStyle]}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <Text style={[styles.whiteBtnTitle, styles.normalBtnTitle]} numberOfLines={1}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

class WhiteButtonMiddle extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.any.isRequired,
  };

  render() {
    const { image, onPress, text } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.normalMiddleBtn,
          styles.middleWhiteBtn,
          { flexDirection: 'row', alignItems: 'center' },
        ]}
        onPress={onPress}
      >
        <Image
          source={image}
          style={{ marginRight: 5, height: 20, width: 20 }}
          resizeMode="contain"
        />
        <Text style={[styles.normalMiddleBtnTitle, styles.middleWhiteBtnTitle]} numberOfLines={1}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

class BlueButtonMiddle extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { onPress, text } = this.props;
    return (
      <TouchableOpacity style={styles.normalMiddleBtn} onPress={onPress}>
        <LinearGradient
          colors={['#66ceff', '#0094ff']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.normalMiddleBtn, { flex: 1 }]}
        >
          <Text style={[styles.middleBlueBtnTitle, styles.normalMiddleBtnTitle]} numberOfLines={1}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

class WhiteButtonSmall extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { onPress, text } = this.props;
    return (
      <TouchableOpacity style={[styles.normalSmallBtn, styles.middleWhiteBtn]} onPress={onPress}>
        <Text style={[styles.normalMiddleBtnTitle, styles.middleWhiteBtnTitle]} numberOfLines={1}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

class BlueButtonSmall extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  };

  render() {
    const { onPress, text, isDisabled } = this.props;
    /* let backItemStyle = { marginTop: 30 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      backItemStyle = { marginTop: 50 };
    } */
    return (
      <TouchableOpacity style={styles.normalSmallBtn} onPress={onPress} disabled={isDisabled}>
        <LinearGradient
          colors={isDisabled ? ['#a0a0a0', '#a0a0a0', '#a0a0a0'] : ['#66ceff', '#0094ff']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.normalSmallBtn, { flex: 1 }]}
        >
          <Text style={[styles.middleBlueBtnTitle, styles.normalMiddleBtnTitle]} numberOfLines={1}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

class NextButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { onPress, text } = this.props;
    return (
      <TouchableOpacity style={[styles.btnOpacity]} activeOpacity={0.6} onPress={onPress}>
        <Text style={styles.txt} numberOfLines={1}>
          {text}
        </Text>
        <Image
          style={styles.icon}
          source={require('../assets/set/next.png')}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

class HeaderButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    img: PropTypes.string,
  };

  render() {
    const { onPress, img } = this.props;
    let backItemStyle = { marginTop: 30 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      backItemStyle = { marginTop: 50 };
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.headerRight, backItemStyle]} onPress={onPress}>
          <Image style={styles.backItem} resizeMode="contain" source={img} />
        </TouchableOpacity>
      </View>
    );
  }
}

class WhiteBorderButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    buttonStyle: PropTypes.object,
  };

  render() {
    const { buttonStyle, onPress, text } = this.props;
    return (
      <TouchableOpacity
        style={[styles.normalBtn, styles.whiteBorderBtn, buttonStyle]}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <Text style={[styles.normalBtnTitle, styles.whiteTxt]} numberOfLines={1}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

export {
  BackButton, // 蓝色返回按钮
  BackWhiteButton, // 白色返回按钮
  BlueButtonBig, // 大号蓝色按钮
  GreyButtonBig, // 大号灰色按钮
  ClarityWhiteButtonBig, // 大号透明白色按钮
  WhiteButtonBig, // 大号白色按钮
  WhiteButtonMiddle, // 中号白色按钮
  BlueButtonMiddle, // 中号蓝色按钮
  WhiteButtonSmall, // 小号白色按钮
  BlueButtonSmall, // 小号蓝色按钮
  NextButton, // 设置页面功能按钮
  HeaderButton, // 导航栏按钮
  WhiteBorderButton, // 白色边框、透明背景、白色字体
  GreyButtonMidele  
};
