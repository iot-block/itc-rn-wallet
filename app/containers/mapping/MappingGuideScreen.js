import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';

const rightViewHeight = Layout.WINDOW_HEIGHT - 60 - 48 - (Layout.DEVICE_IS_IPHONE_X() ? 118 : 64);
const stepItemWidth = Layout.WINDOW_WIDTH - 50 - 20;
const stepItemHeight = rightViewHeight / 3;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  contentBox: {
    flex: 1,
    marginTop: 20,
  },
  contentView: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
  },
  contentLeft: {
    width: 50,
    marginTop: 6,
    //  backgroundColor: 'yellow'
  },
  contentRight: {
    flex: 1,
    marginRight: 20,
  },
  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomBtn: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLine: {
    height: 40,
    width: 1,
    backgroundColor: Colors.bgGrayColor_ed,
  },
  btnText: {
    color: Colors.fontBlueColor,
    fontSize: 15,
    lineHeight: 60,
    height: 60,
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Layout.WINDOW_WIDTH * 0.9 - 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  checkImage: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 8,
  },
  checkText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 20 - 26,
    color: Colors.fontBlueColor,
    fontSize: 14,
  },
  button: {
    // width:Layout.WINDOW_WIDTH*0.8,
    marginTop: 10,
    alignSelf: 'center',
  },

  stepItemBox: {
    width: stepItemWidth,
    height: stepItemHeight,
    marginRight: 20,
    alignItems: 'center',
  },
  stepItemTitleBox: {
    width: stepItemWidth,
    height: 32,
    flexDirection: 'row',
  },
  stepItemBgArrow: {
    width: 15,
    height: 24,
    alignSelf: 'center',
  },
  stepItemTitleBg: {
    width: stepItemWidth - 10,
    height: 32,
    borderRadius: 5,
    marginLeft: -5,
  },
  stepItemTitle: {
    width: stepItemWidth - 50,
    lineHeight: 32,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    paddingLeft: 15,
    paddingRight: 20,
  },
  stepItemBgDesc: {
    color: Colors.fontBlackColor_43,
    fontSize: 14,
    width: stepItemWidth - 50,
    marginTop: 10,
  },
  stepItemImg: {
    marginTop: 10,
    width: stepItemWidth - 100,
    height: ((stepItemWidth - 100) / 212) * 54,
  },

  liItemBox: {
    width: 60,
    height: stepItemHeight,
    alignItems: 'center',
  },
  liItemNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3fc1ff',
  },
  liItemNumText: {
    fontSize: 14,
    color: 'white',
  },
  liItemLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#D7F0FF',
  },
});

export default class MappingGuideScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
    };
  }

  isAgreePress() {
    const agree = this.state.isAgree;
    this.setState({ isAgree: !agree });
  }

  startBtn() {

    this.props.navigation.navigate('BindWalletAddress');
  }

  /* _toTermsService() {

  }

  _toMappingTutorial() {

  } */

  renderComponent = () => (
    /* const { isAgree } = this.state;
   const checkIcon = isAgree
     ? require('../../assets/launch/check_on.png')
     : require('../../assets/launch/check_off.png'); */
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={I18n.t('mapping.itc_mapping_service')}
      />
      <View style={styles.contentBox}>
        <View style={styles.contentView}>
          <View style={styles.contentLeft}>
            <LiItem num="1" />
            <LiItem num="2" />
            <LiItem num="3" isShowLine={false} />
          </View>
          <View style={styles.contentRight}>
            <StepItem
              title={`STEP 1:${I18n.t('mapping.bind_map_address')}`}
              desc={I18n.t('mapping.bind_map_address_des')}
              image={require('../../assets/mapping/mappingStepOne.png')}
            />
            <StepItem
              title={`STEP 2:${I18n.t('mapping.application_mapping')}`}
              desc={I18n.t('mapping.application_mapping_des')}
              image={require('../../assets/mapping/mappingStepTwo.png')}
            />
            <StepItem
              title={`STEP 3:${I18n.t('mapping.native_issuance')}`}
              desc={I18n.t('mapping.native_issuance_des')}
              image={require('../../assets/mapping/mappingStepThree.png')}
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.bottomBox}>
            <TouchableOpacity
              style={styles.bottomBtn}
              activeOpacity={0.6}
              onPress={() => console.log('_toTermsService') /* this._toTermsService() */}
            >
              <Text style={styles.btnText}>{I18n.t('mapping.terms_service')}</Text>
            </TouchableOpacity>
            <View style={styles.bottomLine} />
            <TouchableOpacity
              style={styles.bottomBtn}
              activeOpacity={0.6}
              onPress={() => console.log('_toMappingTutorial') /* this._toMappingTutorial() */}
            >
              <Text style={styles.btnText}>{I18n.t('mapping.mapping_tutorial')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

class LiItem extends PureComponent {
  static defaultProps = {
    isShowLine: true,
  };

  render() {
    const { num, isShowLine } = this.props;
    return (
      <View style={styles.liItemBox}>
        <View style={styles.liItemNum}>
          <Text style={styles.liItemNumText}>{num}</Text>
        </View>
        {isShowLine ? <View style={styles.liItemLine} /> : null}
      </View>
    );
  }
}

class StepItem extends PureComponent {
  render() {
    const { image, title, desc } = this.props;
    return (
      <View style={styles.stepItemBox}>
        <View style={styles.stepItemTitleBox}>
          <Image
            style={styles.stepItemBgArrow}
            source={require('../../assets/mapping/leftTriangle.png')}
            resizeMode="center"
          />
          <LinearGradient
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.stepItemTitleBg}
          >
            <Text style={styles.stepItemTitle}>{title}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.stepItemBgDesc}>{desc}</Text>
        <Image style={styles.stepItemImg} source={image} resizeMode="contain" />
      </View>
    );
  }
}
