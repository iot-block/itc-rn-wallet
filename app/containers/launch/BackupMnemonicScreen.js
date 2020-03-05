import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import { BlueButtonBig } from '../../components/Button';
import { Colors, FontSize } from '../../config/GlobalConfig';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader';
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
  contentBox: {
    flex: 1,
    width: Layout.WINDOW_WIDTH * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 3,
  },
  icon: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },

  titleTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.fontBlueColor,
    marginBottom: 30,
  },
  contentTxt: {
    fontSize: FontSize.ContentSize,
    color: Colors.fontGrayColor_a0,
    // alignSelf:'flex-start',
    textAlign: 'left',
  },
  mnemonicTxt: {
    alignSelf: 'stretch',
    backgroundColor: Colors.bgColor_e,
    fontSize: 16,
    color: 'black',
    borderRadius: 8,
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'left',
    lineHeight: 25,
  },
  buttonBox: {
    marginTop: 30,
    marginBottom: 30,
  },

  tableView: {
    width: Layout.WINDOW_WIDTH * 0.9,
    // height: 240,
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: Colors.bg_blue_e9,
  },
  itemBox: {
    flexDirection: 'row',
    height: 40,
    width: Layout.WINDOW_WIDTH * 0.9,
  },
  itemHLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.fontBlueColor,
  },
  itemVLine: {
    height: 40,
    width: 1,
    backgroundColor: Colors.fontBlueColor,
  },
  itemCommon: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
  },
  itemNum: {
    width: 20,
    paddingTop: 6,
    fontSize: 11,
    color: Colors.fontBlueColor,
    marginLeft: 10,
  },
  itemWord: {
    flex: 1,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 15,
    marginLeft: -15,
    color: Colors.fontBlueColor,
  },
});

class BackupMnemonicScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      mnemonic: [],
    };
  }

  _initData = () => {
    const mnemonicArray = this.props.mnemonic.split(' ');
    this.setState({
      mnemonic: mnemonicArray,
    });
  };

  onCloseModal() {
    this.setState({ modalVisible: false });
  }

  complete() {
    const _this = this;
    this.props.navigation.navigate('VerifyMnemonic', {
      callback() {
        _this.setState({
          modalVisible: true,
        });
      },
    });
  }

  _closeModal = () => {
    this.onCloseModal();
  };

  renderComponent = () => {
    const mnemonics = this.state.mnemonic;
    return (
      <View style={styles.container}>
        <WhiteBgNoTitleHeader navigation={this.props.navigation} />
        <ScreenshotWarn
          content={I18n.t('modal.screenshot_warn_content')}
          btnText={I18n.t('modal.i_know')}
          modalVisible={this.state.modalVisible}
          onPress={() => this.onCloseModal()}
        />
        <ScrollView style={styles.contentContainer}>
          <View style={styles.contentBox}>
            <Image
              style={styles.icon}
              source={require('../../assets/launch/backupWordIcon.png')}
              resizeMode="contain"
            />
            <Text style={styles.titleTxt}>{I18n.t('launch.backup_mnemonic')}</Text>
            <Text style={styles.contentTxt}>{I18n.t('launch.backup_mnemonic_prompt')}</Text>
            {/* <Text style={styles.mnemonicTxt}>{this.props.mnemonic}</Text> */}
            <View style={styles.tableView}>
              <Item num1="#1" word1={mnemonics[0]} num2="#2" word2={mnemonics[1]} />
              <Item num1="#3" word1={mnemonics[2]} num2="#4" word2={mnemonics[3]} />
              <Item num1="#5" word1={mnemonics[4]} num2="#6" word2={mnemonics[5]} />
              <Item num1="#7" word1={mnemonics[6]} num2="#8" word2={mnemonics[7]} />
              <Item num1="#9" word1={mnemonics[8]} num2="#10" word2={mnemonics[9]} />
              <Item num1="#11" word1={mnemonics[10]} num2="#12" word2={mnemonics[11]} isLastLine />
            </View>

            <BlueButtonBig
              buttonStyle={styles.buttonBox}
              onPress={() => this.complete()}
              text={I18n.t('launch.backup_mnemonic_complete')}
            />
          </View>
        </ScrollView>
      </View>
    );
  };
}

class Item extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    isLastLine: false,
  };

  render() {
    const { isLastLine, num1, word1, num2, word2 } = this.props;
    return (
      <View style={[styles.itemBox, isLastLine ? null : styles.itemHLine]}>
        <View style={[styles.itemCommon]}>
          <Text style={styles.itemNum}>{num1}</Text>
          <Text style={styles.itemWord}>{word1}</Text>
        </View>
        <View style={styles.itemVLine} />
        <View style={[styles.itemCommon]}>
          <Text style={styles.itemNum}>{num2}</Text>
          <Text style={styles.itemWord}>{word2}</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.Core.mnemonic,
});

export default connect(
  mapStateToProps,
  {}
)(BackupMnemonicScreen);
