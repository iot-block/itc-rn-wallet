import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Animated } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';

const MIN_HEIGHT = 65;
const MAX_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    width: LayoutConstants.WINDOW_WIDTH,
    backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  TextInput: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.addTokenBorderColor,
    borderRadius: 5,
    height: 38,
    width: LayoutConstants.WINDOW_WIDTH - 40,
    marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
});

class AddTokenInput extends Component {
  render() {
    const {
      inputStyle,
      checkTextColor,
      onChange,
      title,
      keyboardType,
      returnKeyType,
      onFocus,
      ref,
      defaultValue,
      editable,
      checkText,
    } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          inputStyle,
          { height: checkTextColor === Colors.clearColor ? MIN_HEIGHT : MAX_HEIGHT },
        ]}
      >
        <Text
          style={{ height: 15, marginLeft: 20, fontSize: 13, color: Colors.addTokenLeftTitleColor }}
        >
          {title}
        </Text>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={Colors.fontGrayColor_a0}
          onChange={onChange}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          ref={ref}
          onFocus={onFocus}
          editable={editable}
          defaultValue={defaultValue}
        />
        <Text
          style={[
            {
              height: 30,
              alignSelf: 'flex-end',
              color: checkTextColor,
              marginHorizontal: 20,
              fontSize: 12,
            },
          ]}
        >
          {checkText}
        </Text>
      </Animated.View>
    );
  }
}

export default AddTokenInput;
