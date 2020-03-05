import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    alignSelf: 'center',

    // alignItems:'stretch',
  },
  icon: {
    marginTop: 30,
    alignSelf: 'center',
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  blueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.fontBlueColor,
    marginBottom: 15,
    marginTop: 15,
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  itemBox: {
    flexDirection: 'row',
    // alignItems:'center',
    marginBottom: 8,
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  itemCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 6,
  },
  itemText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 14,
    color: Colors.fontBlackColor,
    fontSize: 14,
    lineHeight: 16,
  },
  viewBottom: {
    // flex:1,
    // justifyContent:'flex-end',
    alignItems: 'center',
    marginTop: 40,
    width: Layout.WINDOW_WIDTH * 0.9,
    marginBottom: 30,
    alignSelf: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH * 0.9,
    // alignItems:'center',
    // alignSelf:'center',
  },
  checkImage: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 8,
  },
  checkText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 26,
    color: Colors.fontBlackColor,
    fontSize: 14,
  },
});

export default class BackupWalletScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
    };
  }

  isReadPress() {
    this.setState(prevState => ({
      isCheck: !prevState.isCheck,
    }));
  }

  renderComponent = () => {
    const { navigation } = this.props;
    const { isCheck } = this.state;
    const checkIcon = isCheck
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png');
    return (
      <View style={styles.container}>
        <WhiteBgHeader navigation={navigation} text={I18n.t('launch.backup_wallet')} />
        <ScrollView style={styles.contentContainer}>
          <Image
            style={styles.icon}
            source={require('../../assets/launch/backup.png')}
            resizeMode="contain"
          />

          <Text style={styles.blueText}>{I18n.t('launch.why_backup_wallet')}</Text>
          <Item content={I18n.t('launch.reason_backup_wallet1')} />
          <Item content={I18n.t('launch.reason_backup_wallet2')} />

          <Text style={styles.blueText}>{I18n.t('launch.how_backup_wallet')}</Text>
          <Item content={I18n.t('launch.reason_backup_wallet3')} />
          <Item content={I18n.t('launch.reason_backup_wallet4')} />

          <View style={styles.viewBottom}>
            <TouchableOpacity
              style={styles.checkBox}
              activeOpacity={0.6}
              onPress={() => this.isReadPress()}
            >
              <Image style={styles.checkImage} source={checkIcon} resizeMode="contain" />
              <Text style={styles.checkText}>{I18n.t('launch.readed')}</Text>
            </TouchableOpacity>
            <BlueButtonBig
              buttonStyle={{ marginTop: 10 }}
              isDisabled={!isCheck}
              onPress={() => navigation.navigate('BackupMnemonic')}
              text={I18n.t('launch.backup_mnemonic')}
            />
          </View>
        </ScrollView>
      </View>
    );
  };
}

class Item extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
  };

  render() {
    const { content } = this.props;
    return (
      <View style={styles.itemBox}>
        <LinearGradient
          colors={['#32beff', '#0095eb', '#2093ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.itemCircle}
        />
        <Text style={styles.itemText}>{content}</Text>
      </View>
    );
  }
}
