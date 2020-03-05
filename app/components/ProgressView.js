import React, { PureComponent } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../config/GlobalConfig';

const styles = StyleSheet.create({
  progresView: {
    marginLeft: 10,
    marginRight: 10,
    height: 25,
  },
});

export default class ProgressView extends PureComponent {
  static propTypes = {
    totalProgress: PropTypes.number.isRequired,
    curProgress: PropTypes.number.isRequired,
    progresView: PropTypes.object,
  };

  render() {
    const { progresView, curProgress, totalProgress } = this.props;
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
    return (
      <View style={[styles.progresView, progresView]}>
        <View style={{ height: 4, flexDirection: 'row', borderRadius: 4, overflow: 'hidden' }}>
          <AnimatedLinearGradient
            colors={['#32beff', '#0095eb', '#2093ff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: curProgress }}
          />
          <View
            style={{
              flex: totalProgress - curProgress,
              backgroundColor: Colors.fontGrayColor,
            }}
          />
        </View>
      </View>
    );
  }
}
