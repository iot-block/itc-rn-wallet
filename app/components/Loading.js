import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';
import loadingImage from '../assets/common/loadingIcon.png';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modeContent: {
    backgroundColor: 'rgba(246,246,246,1)',
    width: 100,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationImg: {
    width: 60,
    height: (60 / 68) * 77,
  },
  text: {
    marginTop: 10,
    color: Colors.fontBlueColor1,
    fontSize: 15,
  },
});
export default class Loading extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0),
    };
  }

  static propTypes = { visible: PropTypes.bool.isRequired };

  static defaultProps = {
    visible: false,
  };

  componentDidMount() {
    const { rotateValue } = this.state;
    // 组件加载完成后启动动画
    this.animationLoading = Animated.timing(rotateValue, {
      toValue: 360,
      duration: 900,
      easing: Easing.linear,
    });
    Animated.loop(this.animationLoading).start();
  }

  componentWillReceiveProps() {
    Animated.loop(this.animationLoading).start();
  }

  render() {
    const { visible } = this.props;
    const { rotateValue } = this.state;
    const animatedTransform = {
      transform: [
        {
          rotateY: rotateValue.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => {
          console.log('re--close--');
          Animated.loop(this.animationLoading).stop();
        }}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.modeContent}>
            <Animated.Image
              style={[animatedTransform, styles.animationImg]}
              source={loadingImage}
              resizeMode="contain"
            />
            <Text style={styles.text}>Loading</Text>
          </View>
        </View>
      </Modal>
    );
  }
}
