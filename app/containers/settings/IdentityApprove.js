import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from "react-native";
import { WhiteBgHeader } from "../../components/NavigaionHeader";
import { I18n } from "../../config/language/i18n";
import BaseComponent from "../base/BaseComponent";
import { StorageKey, Colors } from "../../config/GlobalConfig";
import LinearGradient from "react-native-linear-gradient";
import StorageManage from "../../utils/StorageManage";
import NetworkManager from "../../utils/NetworkManager";
import { showToast } from "../../utils/Toast";
import { isCardNo, isName } from "../../utils/CommonUtil";
import { setUserInfo } from "../../config/action/Actions";
import { connect } from "react-redux";
import Toast from "react-native-root-toast";
import LayoutConstants from "../../config/LayoutConstants";

class IdentityApprove extends BaseComponent {
  constructor(props) {
    super(props);
    const { key } = this.props.navigation.state.params;
    this.state = {
      key: key,
      idName: "",
      idNo: "'",
      isShowCarderror: false,
      isShowNameerror: false,
      isCard:false,
      isName:false
    };
  }

  setidName(text) {
    this.setState({
      idName: text
    });
    if (isName(text)) {
      this.setState({
        isShowNameerror: false,
        isName:true
      });
    } else {
      this.setState({
        isShowNameerror: true,
        isName:false
      });
    }
  }

  setidNo(text) {
    this.setState({
      idNo: text
    });
    if (isCardNo(text)) {
      this.setState({
        isShowCarderror: false,
        isCard:true
      });
    } else {
      this.setState({
        isShowCarderror: true,
        isCard:false
      });
    }
  }

  async identifySave() {

    if (this.state.idName === "") {
      showToast("请先输入姓名");
      return;
    }
    const userToken = await StorageManage.load(StorageKey.UserToken);
    const params = {
      userToken: userToken.userToken,
      idName: this.state.idName,
      idNo: this.state.idNo
    };
    NetworkManager.identifySave(params)
      .then(async response => {
        if (response.code === 200) {
          showToast("身份认证成功", Toast.positions.TOP);
          let userInfo = {
            identifyName: response.data.identifyName,
            identifyNo: response.data.identifyNo,
            identifyVerify: 1,
            phone: response.data.phone,
            userToken: userToken.userToken
          };
          this.props.dispatch(setUserInfo(userInfo));
          this.props.navigation.navigate("OverApprove", { key: this.state.key });
        } else {
          showToast(response.msg, LayoutConstants.DEVICE_IS_IPHONE_X()?50:Toast.positions.TOP);
        }
      })
      .catch(err => {

      });
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={"身份认证"}
        leftPress={() => this.props.navigation.goBack()}
      />
      <View style={{ width: "80%", marginTop: 30 }}>
        <Text style={styles.title}>姓名</Text>
      </View>
      <TextInput
        style={styles.inputText}
        underlineColorAndroid="transparent"
        selectionColor="#00bfff"
        onChangeText={this.setidName.bind(this)}
      />
      <View style={{ alignItems: "center", width: "80%", marginTop: 5, height: 20 }}>
        {
          this.state.isShowNameerror === true ?
            <Text style={{ fontSize: 10, color: "red", alignSelf: "flex-end" }}>请输入正确的姓名</Text> :
            null
        }

      </View>
      <View style={{ width: "80%", marginTop: 10 }}>
        <Text style={styles.title}>身份证号</Text>
      </View>
      <TextInput
        style={styles.inputText}
        keyboardType='numbers-and-punctuation'
        selectionColor="#00bfff"
        onChangeText={this.setidNo.bind(this)}
      />
      <View style={{ alignItems: "center", width: "80%", marginTop: 5, height: 20 }}>
        {
          this.state.isShowCarderror === true ?
            <Text style={{ fontSize: 10, color: "red", alignSelf: "flex-end" }}>请输入正确的身份证号</Text> :
            null
        }

      </View>
      <TouchableOpacity
        style={{ width: "80%" }}
        activeOpacity={0.6}
        disabled={(this.state.isCard === true && this.state.isName === true)?false:true}
        onPress={() => this.identifySave()}
      >
        <LinearGradient
          colors={(this.state.isCard === true && this.state.isName === true)?["#03B6FF", "#15A1FF"]:["#a0a0a0", "#a0a0a0", "#a0a0a0"] }
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 43, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 60 }}
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
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.bgGrayColor_e5,
    marginTop: 10,
    paddingLeft: 10
  },
  title: {
    fontSize: 16,
    color: Colors.fontDarkColor
  }
});

const mapStateToProps = state => ({
  userinfo: state.Core.userinfo
});

export default connect(mapStateToProps)(IdentityApprove);