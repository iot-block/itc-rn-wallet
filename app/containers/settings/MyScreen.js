import React, { PureComponent } from "react";
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Colors, FontSize, StorageKey } from "../../config/GlobalConfig";
import { I18n } from "../../config/language/i18n";
import Layout from "../../config/LayoutConstants";
import BaseComponent from "../base/BaseComponent";
import StorageManage from "../../utils/StorageManage";
// import Analytics from '../../utils/Analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.bgGrayColor,
    paddingBottom: 20
  },
  topBg: {
    paddingTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
    width: Layout.WINDOW_WIDTH,
    alignItems: "center"
  },
  topTitle: {
    marginTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
    color: "white",
    fontSize: FontSize.HeaderSize
  },
  topLog: {
    width: 100,
    marginTop: 16,
    marginBottom: 16
  },

  itemBox: {
    width: Layout.WINDOW_WIDTH
  },
  itemTouchable: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    width: Layout.WINDOW_WIDTH,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white"
  },
  itemIcon: {
    width: 14
  },
  itemTitle: {
    flex: 1,
    color: Colors.fontBlackColor_43,
    fontSize: 14,
    marginLeft: 12
  },
  itemRightView: {
    flexDirection: "row"
  },
  itemRedCircle: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 11,
    marginRight: 10
  },
  itemRedCircleText: {
    lineHeight: 22,
    color: "white",
    textAlign: "center"
  },
  itemLine: {
    width: Layout.WINDOW_WIDTH,
    height: 1,
    backgroundColor: "transparent"
  },
  itemNextIcon: {
    width: 8,
    height: 12
  },
  textSize14: {
    fontSize: 14
  },
  textSize12: {
    fontSize: 12
  },
  textSize10: {
    fontSize: 10
  },
  marginTop10: {
    marginTop: 10
  }
});

class Item extends PureComponent {
  static propTypes = {
    itemStyle: PropTypes.object,
    itemOnPress: PropTypes.func,
    isDisabled: PropTypes.bool,
    count: PropTypes.number,
    title: PropTypes.string,
    isNeedLine: PropTypes.bool
  };

  static defaultProps = {
    isDisabled: false,
    isNeedLine: true,
    count: 0
  };

  render() {
    const { icon, count, itemStyle, itemOnPress, isDisabled, title, isNeedLine, rightText } = this.props;
    const isShowRed = !(count <= 0);
    let mCount;
    let textSize;
    if (isShowRed) {
      mCount = count <= 99 ? count : "99+";
      const ts = count < 10 ? styles.textSize14 : styles.textSize12;
      textSize = count > 99 ? styles.textSize10 : ts;
    }

    return (
      <View style={[styles.itemBox, itemStyle]}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.itemTouchable}
          onPress={itemOnPress}
          disabled={isDisabled}
        >
          <Image style={styles.itemIcon} source={icon} resizeMode="contain"/>
          <Text style={styles.itemTitle}>{title}</Text>
          <View style={styles.itemRightView}>
            {isShowRed ? (
              <View style={styles.itemRedCircle}>
                <Text style={[styles.itemRedCircleText, textSize]}>{mCount}</Text>
              </View>
            ) : null}
            {rightText ? <Text style={{ fontSize: 15, color: "#a5a5a5", marginRight: 10 }}>{rightText}</Text> : null}
            <Image
              style={styles.itemNextIcon}
              source={require("../../assets/set/next.png")}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        {isNeedLine ? <View style={styles.itemLine}/> : null}
      </View>
    );
  }
}

class MyScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      newMessageCounts: 0,
      refreshPage: false,
      IdentifyVerify: 0
    };
    this._setStatusBarStyleLight();

  }

  _messageCountEmitter = async data => {
    const { messageCount } = data;
    this.setState({
      newMessageCounts: messageCount
    });
    // const UserInfo = await StorageManage.load(StorageKey.UserInfo);
    // this.setState({
    //   IdentifyVerify: UserInfo.identifyVerify
    // })
  };

  gotoSet = () => {
    this.props.navigation.navigate("SystemSet", {
      callback() {
        /* _this.setState({
                    refreshPage: ! _this.state.refreshPage,
                })
               _this.props.navigation.navigate('HomeTab') */
      }
    });
  };

  renderComponent = () => {
    const { newMessageCounts } = this.state;
    let userInfo = this.props.userinfo;
    let IdentifyVerify = 0;
    if (userInfo) {
      IdentifyVerify = userInfo.identifyVerify;
    }

    const topBg = require("../../assets/launch/splash_bg.png");
    const topLogo = require("../../assets/launch/splash_logo.png");
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.topBg} source={topBg}>
          {/* <Text style={styles.topTitle}>{I18n.t('home.my')}</Text> */}
          <Image style={styles.topLog} source={topLogo} resizeMode="contain"/>
        </ImageBackground>
        <Item
          title={I18n.t("settings.message_center")}
          icon={require("../../assets/home/menu/menu_notice.png")}
          itemOnPress={() =>
            this.props.navigation.navigate("MessageCenter", {
              newMessageCounts
            })
          }
          count={newMessageCounts}
        />
        <Item
          title={I18n.t("home.wallet_tool")}
          icon={require("../../assets/home/menu/menu_tool.png")}
          itemOnPress={() => this.props.navigation.navigate("WalletList")}
        />
        <Item
          title={I18n.t("home.contact")}
          icon={require("../../assets/home/menu/menu_contact.png")}
          itemOnPress={() => this.props.navigation.navigate("ContactList", { from: "home" })}
        />
        <Item
          title={I18n.t("home.system_settings")}
          icon={require("../../assets/home/menu/menu_set.png")}
          itemOnPress={this.gotoSet}
        />
        {
          I18n.locale === "zh"?
            <Item
              title={I18n.t("home.autonym")}
              rightText={IdentifyVerify === 0 ? I18n.t("home.noapprove") : I18n.t("home.haveapprove")}
              icon={require("../../assets/home/menu/menu_autonym.png")}
              itemOnPress={() => this.goAppove()}
              isNeedLine={false}
            />:null
        }


        <Item
          title={I18n.t("home.feedback")}
          icon={require("../../assets/home/menu/menu_feedback.png")}
          itemOnPress={() => {
            const content = "";
            this.props.navigation.navigate("Feedback", { content });
          }}
          itemStyle={styles.marginTop10}
        />
        <Item
          title={I18n.t("home.about")}
          icon={require("../../assets/home/menu/menu_about.png")}
          itemOnPress={() => this.props.navigation.navigate("AboutUs")}
          isNeedLine={false}
        />
      </View>
    );
  };

  goAppove() {
    let userInfo = this.props.userinfo;
    let IdentifyVerify = 0;
    if (userInfo) {
      IdentifyVerify = userInfo.identifyVerify;
    }
    if (IdentifyVerify === 0) {
      this.props.navigation.navigate("NoApprove");
    } else {
      this.props.navigation.navigate("OverApprove", { key: "" });
    }
  }
}

const mapStateToProps = state => ({
  myLanguage: state.Core.myLanguage,
  userinfo: state.Core.userinfo,
  monetaryUnit: state.Core.monetaryUnit,
});
const mapDispatchToProps = () => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyScreen);
