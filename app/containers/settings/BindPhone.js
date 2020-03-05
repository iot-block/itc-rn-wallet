import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from "react-native";
import { WhiteBgHeader } from "../../components/NavigaionHeader";
import { I18n } from "../../config/language/i18n";
import BaseComponent from "../base/BaseComponent";
import { StorageKey, Colors } from "../../config/GlobalConfig";
import LayoutConstants from "../../config/LayoutConstants";
import LinearGradient from "react-native-linear-gradient";
import { checkPhone } from "../../utils/CommonUtil";
import NetworkManager from "../../utils/NetworkManager";
import StorageManage from "../../utils/StorageManage";
import { showToast } from "../../utils/Toast";
import { BlueButtonBig } from "../../components/Button";
import CountdownUtil from "../../utils/CountdownUtil";
import Toast from "react-native-root-toast";

export default class BindPhone extends BaseComponent {
  constructor(props) {
    super(props);
    const { key } = this.props.navigation.state.params;
    this.state = {
      phoneNumber: "",
      verifycode: "",
      key: key,
      isAgree: true,
      isCorrectPhone: false,//手机号是否输入正确
      isShowerror: false,//是否显示手机号码错误
      getVerificationName: "获取验证码",
      isSentCode: false
    };
  }

  setphoneNumber(text) {
    this.setState({
      phoneNumber: text
    });
    if (checkPhone(text)) {
      this.setState({
        isCorrectPhone: true,
        isShowerror: false
      });
    } else {
      this.setState({
        isCorrectPhone: false,
        isShowerror: true
      });
    }
  }

  setverifycode(text) {
    this.setState({
      verifycode: text
    });
    if (this.state.isSentCode === true) {
      if (text !== "") {
        this.setState({
          isAgree: false
        });
      } else {
        this.setState({
          isAgree: true
        });
      }
    }
  }

  /*下一步*/
  async goIdentityApprove() {
    if (this.state.phoneNumber === "") {
      showToast("请先输入手机号");
      return;
    }
    if (this.state.verifycode === "") {
      showToast("请先输入验证码");
    } else {
      const userToken = await StorageManage.load(StorageKey.UserToken);
      const params = {
        userToken: userToken.userToken,
        code: this.state.verifycode
      };
      NetworkManager.verifycode(params)
        .then(response => {
          if (response.code === 200) {

            this.props.navigation.navigate("IdentityApprove", { key: this.state.key !== "" ? this.state.key : this.props.navigation.state.key });
          } else {
            showToast("验证码错误",LayoutConstants.DEVICE_IS_IPHONE_X()?50:Toast.positions.TOP);
          }
        })
        .catch(err => {

        });
    }

  }


  /*发送验证码*/
  async sendCode() {

    if (checkPhone(this.state.phoneNumber)) {


      const userToken = await StorageManage.load(StorageKey.UserToken);
      const params = {
        userToken: userToken.userToken,
        phoneNumber: this.state.phoneNumber
      };
      NetworkManager.sendcode(params)
        .then(response => {
          if (response.code === 200) {
            // showToast("验证码发送成功");
            let countdownDate = new Date(new Date().getTime() + 60 * 1000);
            CountdownUtil.settimer(countdownDate, (time) => {
              this.setState({
                getVerificationName: time.sec > 0 ? time.sec + "s" : "重新获取",
                isSentCode: time.sec > 0 ? true : false
              });
            });
          } else {

          }
        })
        .catch(err => {

        });
    } else {
    }
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={"绑定手机"}
        leftPress={() => this.props.navigation.goBack()}
      />
      <View
        style={{ height: 200, width: LayoutConstants.WINDOW_WIDTH, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: 90, height: 90 }}
          source={require("../../assets/set/autonym_alert_head.png")}
          resizeMode="contain"
        />
      </View>

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        width: "80%",
        borderRadius: 5,
        borderColor: Colors.bgGrayColor_e5,
        borderWidth: 1
      }}>
        <Text style={{ color: Colors.fontDarkColor, fontSize: 16 ,marginLeft:10}}>+86</Text>
        <View
          style={{ height: 28, width: 1, backgroundColor: Colors.bgGrayColor_e5, marginLeft: 10, marginRight: 10 }}/>

        <TextInput
          keyboardType='numeric'
          style={styles.inputText}
          placeholderTextColor="#a5a5a5"
          placeholder={"手机号"}
          underlineColorAndroid="transparent"
          selectionColor="#00bfff"
          onChangeText={this.setphoneNumber.bind(this)}
        />
      </View>
      <View style={{ alignItems: "center", width: "80%", marginTop: 5, height: 20 }}>
        {
          this.state.isShowerror === true ?
            <Text style={{ fontSize: 10, color: "red", alignSelf: "flex-end" }}>请输入正确的手机号</Text> :
            null
        }

      </View>
      <View
        style={{
          height: 45,
          width: "80%",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row"
          , borderRadius: 5, borderColor: Colors.bgGrayColor_e5, borderWidth: 1
        }}>
        <TextInput
          keyboardType='numeric'
          style={{
            marginLeft: 10, height: 40,
            color: Colors.fontDarkColor,
            flex:1
          }}
          placeholderTextColor="#a5a5a5"
          placeholder={"验证码"}
          underlineColorAndroid="transparent"
          selectionColor="#00bfff"
          onChangeText={this.setverifycode.bind(this)}
        />
        <TouchableOpacity onPress={() => this.sendCode()}
                          disabled={(this.state.isCorrectPhone === true && this.state.isSentCode === false) ? false : true}>
          <View style={{
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            borderLeftColor: Colors.bgGrayColor_e5,
            borderLeftWidth: 1,
            height: 28
          }}>
            <Text style={{
              fontSize: 15,
              color: (this.state.isCorrectPhone === false || this.state.isSentCode === true) ? "#a5a5a5" : "#14A2FF"
            }}>{this.state.getVerificationName}</Text>
          </View>

        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ width: "80%" }}
        activeOpacity={0.6}
        disabled={this.state.isAgree}
        onPress={() => this.goIdentityApprove()}
      >
        <LinearGradient
          colors={this.state.isAgree ? ["#a0a0a0", "#a0a0a0", "#a0a0a0"] : ["#03B6FF", "#15A1FF"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 43, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 30 }}
        >
          <Text style={{ color: "white", fontSize: 15 }} numberOfLines={1}>下一步
          </Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center"
  },
  inputText: {
    height: 40,
    color: Colors.fontDarkColor,
    width: 200,
    fontSize:16
  },
  button: {
    width: "80%",
    marginTop: 30,
    height: 43, alignItems: "center", justifyContent: "center"
  }
});