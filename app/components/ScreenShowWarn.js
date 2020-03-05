import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../config/GlobalConfig';
import { I18n } from '../config/language/i18n';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(179,179,179,0.8)',
  },
  contentBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  icon: {
    width: 80,
    height: 80,
    marginTop: 15,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.fontBlackColor_31,
    marginBottom: 20,
  },
  contentTxt: {
    fontSize: 16,
    alignSelf: 'stretch',
    color: Colors.fontBlackColor_31,
    marginTop: 4,
  },
  btnOpacity: {
    height: 40,
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: '#ff3635',
    marginTop: 30,
  },
  linearGradient: {
    height: 40,
    alignSelf: 'stretch',
    borderRadius: 5,
  },
  txt: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  notRemindOpacity: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  notRemindIcon: {
    width: 18,
    height: 18,
  },
  notRemindText: {
    marginLeft: 6,
    color: Colors.fontBlackColor_43,
    fontSize: 14,
  },
});
export default class ScreenshotWarn extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    btnText: PropTypes.string.isRequired,
    title: PropTypes.string,
    content1: PropTypes.string,
    isShowNotRemindBtn: PropTypes.bool,
    notRemindPress: PropTypes.func,
    isNotRemind: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    content1: '',
    isShowNotRemindBtn: false,
    isNotRemind: false,
  };

  render() {
    const {
      isNotRemind,
      modalVisible,
      title,
      content,
      content1,
      onPress,
      btnText,
      isShowNotRemindBtn,
      notRemindPress,
    } = this.props;
    const choseIcon = isNotRemind
      ? require('../assets/set/chose_off.png')
      : require('../assets/set/chose.png');
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.contentBox}>
            <Image style={styles.icon} source={require('../assets/common/warningIcon.png')} />
            {title !== '' ? <Text style={styles.titleTxt}>{title}</Text> : null}
            <Text style={styles.contentTxt}>{content}</Text>
            <Text style={styles.contentTxt}>{content1}</Text>
            <TouchableOpacity style={styles.btnOpacity} activeOpacity={0.6} onPress={onPress}>
              <LinearGradient
                colors={['#ff3455', '#e90329']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.linearGradient]}
              >
                <Text style={styles.txt}>{btnText}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {isShowNotRemindBtn ? (
              <TouchableOpacity
                style={styles.notRemindOpacity}
                activeOpacity={0.6}
                onPress={notRemindPress}
              >
                <Image style={styles.notRemindIcon} source={choseIcon} resizeMode="contain" />
                <Text style={styles.notRemindText}>{I18n.t('modal.not_remind_again')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}
