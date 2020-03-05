import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../config/GlobalConfig";
import Layout from "../config/LayoutConstants";
import { I18n } from "../config/language/i18n";
import LinearGradient from "react-native-linear-gradient";
import LayoutConstants from "../config/LayoutConstants";


export default class AutonymAlert extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    topPress: PropTypes.func,
    buttomPress: PropTypes.func
  };

  static defaultProps = {
    title: I18n.t("modal.prompt")
  };

  render() {
    const {
      visible,
      topPress,
      buttomPress
    } = this.props;

    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => {
        }}
        onShow={() => {
        }}
      >
        <View style={styles.modeBox}>
          <View style={styles.contentBox}>
            <Image
              style={{ marginBottom: 20,width:90,height:90 }}
              source={require("../assets/set/autonym_alert_head.png")}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 15, color: "#272727", fontWeight: "bold" }}>实名认证</Text>
            <Text style={{ fontSize: 15, color: "#313131", marginTop: 15 }}>请完成实名制认证，体验完整功能</Text>

            <TouchableOpacity
              style={{ width: "90%" }}
              activeOpacity={0.6}
              onPress={topPress}
            >
              <LinearGradient
                colors={["#03B6FF", "#15A1FF"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: 36, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 15 }}
              >
                <Text style={{ color: "white", fontSize: 15 }} numberOfLines={1}>去认证
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "90%" }}
              activeOpacity={0.6}
              onPress={buttomPress}
            >
              <View
                style={{ height: 36, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 10 }}
              >
                <Text style={{ color: "#14A3FF", fontSize: 15 }} numberOfLines={1}>稍后再说
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    alignItems: "center",
    paddingTop: LayoutConstants.DEVICE_IS_IPHONE_X()?230:180,
    backgroundColor: "rgba(179,179,179,0.8)"
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH - 60,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 5
  },
  title: {
    fontSize: 16,
    color: Colors.fontBlackColor_43,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500"
  },
  contentView: {
    width: Layout.WINDOW_WIDTH - 110,
    alignItems: "flex-start"
  },
  content: {
    fontSize: 15,
    color: "#626262",
    textAlign: "left",
    marginTop: 2
  },
  buttonBox: {
    width: Layout.WINDOW_WIDTH - 110,
    marginTop: 20,
    height: 40,
    flexDirection: "row",
    alignItems: "center"
  },
  leftBtnTouch: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.fontBlueColor,
    borderRadius: 5,
    backgroundColor: "transparent",
    marginRight: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  rightBtnTouch: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    backgroundColor: Colors.fontBlueColor,
    alignItems: "center",
    justifyContent: "center"
  },
  leftBtnTxt: {
    color: Colors.fontBlueColor,
    fontSize: 15
  },
  rightBtnTxt: {
    color: "white",
    fontSize: 15
  }
});