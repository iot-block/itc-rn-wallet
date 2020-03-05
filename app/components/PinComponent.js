import React, { PureComponent } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, Vibration } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';
import { I18n } from '../config/language/i18n';

const styles = StyleSheet.create({
  pinBox: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: Colors.fontBlackColor_43,
    marginTop: 80,
    marginBottom: 20,
  },
  pointBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  pointStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  circleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  circleStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  deleteBox: {
    width: 264,
    marginTop: 30,
    alignItems: 'flex-end',
  },
  deleteBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  deleteText: {
    fontSize: 16,
    color: Colors.fontBlueColor,
  },
  deleteTextUnClickable: {
    fontSize: 16,
    color: Colors.fontBlackColor_43,
  },
  pointView: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
  },
  pointBoxUnchecked: {
    backgroundColor: 'transparent',
  },
  pointBoxChecked: {
    backgroundColor: Colors.fontBlueColor,
  },
  circleContainer: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleView: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText1: {
    fontSize: 26,
    color: Colors.fontBlackColor_43,
  },
  circleText2: {
    fontSize: 10,
    color: Colors.fontBlackColor_43,
  },
});

export default class PinComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.translateXValue = new Animated.Value(0);
    this.inputPassword = '';
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    pointsCkeckedCount: PropTypes.number.isRequired,
    circlePressed: PropTypes.func.isRequired,
    deletePressed: PropTypes.func,
    isAnimation: PropTypes.bool,
    isShowDeleteBtn: PropTypes.bool,
    delDisabled: PropTypes.bool,
  };

  static defaultProps = {
    pointsCkeckedCount: 0,
    isAnimation: false,
    isShowDeleteBtn: false,
    delDisabled: false,
  };

  onCirclePressed = text => {
    const { circlePressed } = this.props;
    circlePressed(text);
  };

  deletePressed = () => {
    const { deletePressed } = this.props;
    deletePressed();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAnimation === true) {
      this.startAnimation();
    }
  }

  startAnimation() {
    Vibration.vibrate();
    Animated.sequence([
      Animated.timing(this.translateXValue, {
        duration: 50,
        toValue: -20,
      }),
      Animated.timing(this.translateXValue, {
        duration: 50,
        toValue: 40,
      }),
      Animated.timing(this.translateXValue, {
        duration: 50,
        toValue: 0,
      }),
    ]).start();
  }

  render() {
    const { title, pointsCkeckedCount, isShowDeleteBtn, delDisabled } = this.props;
    return (
      <View style={styles.pinBox}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={[styles.pointBox, { marginLeft: this.translateXValue }]}>
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 0} />
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 1} />
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 2} />
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 3} />
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 4} />
          <PinPoint pointStyle={styles.pointStyle} isChecked={pointsCkeckedCount > 5} />
        </Animated.View>
        <View style={styles.circleBox}>
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={1}
            text2=""
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={2}
            text2="A B C"
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={3}
            text2="D E F"
            onPress={this.onCirclePressed}
          />
        </View>
        <View style={styles.circleBox}>
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={4}
            text2="G H I"
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={5}
            text2="J K L"
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={6}
            text2="M N O"
            onPress={this.onCirclePressed}
          />
        </View>
        <View style={styles.circleBox}>
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={7}
            text2="P Q R S"
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={8}
            text2="T U V"
            onPress={this.onCirclePressed}
          />
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={9}
            text2="W X Y Z"
            onPress={this.onCirclePressed}
          />
        </View>
        <View style={styles.circleBox}>
          <PinCircle
            circleStyle={styles.circleStyle}
            text1={0}
            text2=""
            onPress={this.onCirclePressed}
            isNeedLetter={false}
          />
        </View>
        {isShowDeleteBtn ? (
          <View style={styles.deleteBox}>
            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.6}
              disabled={delDisabled}
              onPress={this.deletePressed}
            >
              <Text style={delDisabled ? styles.deleteTextUnClickable : styles.deleteText}>
                {I18n.t('home.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

class PinPoint extends PureComponent {
  static propTypes = {
    isChecked: PropTypes.bool.isRequired,
    pointStyle: PropTypes.object,
  };

  static defaultProps = {
    isChecked: false,
  };

  render() {
    const { pointStyle, isChecked } = this.props;
    return (
      <View
        style={[
          styles.pointView,
          pointStyle,
          isChecked ? styles.pointBoxChecked : styles.pointBoxUnchecked,
        ]}
      />
    );
  }
}

class PinCircle extends PureComponent {
  static propTypes = {
    text1: PropTypes.number.isRequired,
    text2: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    circleStyle: PropTypes.object,
    isNeedLetter: PropTypes.bool,
  };

  static defaultProps = {
    isDisabled: false,
    isNeedLetter: true,
  };

  onPressed = () => {
    const { text1, onPress } = this.props;
    onPress(text1);
  };

  render() {
    const { circleStyle, isDisabled, text1, text2, isNeedLetter } = this.props;
    return (
      <View style={[styles.circleContainer, circleStyle]}>
        <TouchableOpacity
          style={[styles.circleView]}
          activeOpacity={0.6}
          disabled={isDisabled}
          onPress={this.onPressed}
        >
          <Text style={styles.circleText1}>{text1}</Text>
          {isNeedLetter ? <Text style={styles.circleText2}>{text2}</Text> : null}
        </TouchableOpacity>
      </View>
    );
  }
}
