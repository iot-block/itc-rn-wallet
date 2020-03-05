import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';
import Layout from '../config/LayoutConstants';
import { I18n } from '../config/language/i18n';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 180,
    backgroundColor: 'rgba(179,179,179,0.8)',
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH - 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    color: Colors.fontBlackColor_43,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  contentView: {
    width: Layout.WINDOW_WIDTH - 110,
    alignItems: 'flex-start',
  },
  content: {
    fontSize: 15,
    color: '#626262',
    textAlign: 'left',
    marginTop: 2,
  },
  buttonBox: {
    width: Layout.WINDOW_WIDTH - 110,
    marginTop: 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftBtnTouch: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
    borderRadius: 5,
    backgroundColor: 'transparent',
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBtnTouch: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    backgroundColor: Colors.fontBlueColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBtnTxt: {
    color: Colors.fontBlueColor,
    fontSize: 15,
  },
  rightBtnTxt: {
    color: 'white',
    fontSize: 15,
  },
});
export default class MyAlertComponent extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    contents: PropTypes.array,
    leftBtnTxt: PropTypes.string,
    rightBtnTxt: PropTypes.string,
    leftPress: PropTypes.func,
    rightPress: PropTypes.func,
  };

  static defaultProps = {
    title: I18n.t('modal.prompt'),
  };

  render() {
    const {
      contents,
      visible,
      title,
      content,
      leftBtnTxt,
      leftPress,
      rightPress,
      rightBtnTxt,
    } = this.props;
    const contentView = [];
    if (contents) {
      contents.forEach((txt, index) => {
        const keyValue = `content${index}`;
        contentView.push(
          <Text key={keyValue} style={styles.content}>
            {txt}
          </Text>
        );
      });
    }

    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.contentBox}>
            <Text style={styles.title}>{title}</Text>

            {contents ? (
              <View style={styles.contentView}>{contentView}</View>
            ) : (
              <Text style={styles.content}>{content}</Text>
            )}

            <View style={styles.buttonBox}>
              {leftBtnTxt ? (
                <TouchableOpacity style={styles.leftBtnTouch} onPress={leftPress}>
                  <Text style={styles.leftBtnTxt} numberOfLines={1}>
                    {leftBtnTxt}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity style={styles.rightBtnTouch} onPress={rightPress}>
                <Text style={styles.rightBtnTxt} numberOfLines={1}>
                  {rightBtnTxt}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
