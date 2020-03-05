import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from "react-native";
import { WhiteBgHeader } from "../../components/NavigaionHeader";
import { I18n } from "../../config/language/i18n";
import BaseComponent from "../base/BaseComponent";
import { StorageKey, Colors } from "../../config/GlobalConfig";
import LinearGradient from "react-native-linear-gradient";
import LayoutConstants from "../../config/LayoutConstants";
import StorageManage from "../../utils/StorageManage";
import { connect } from "react-redux";

class OverApprove extends BaseComponent {
  constructor(props) {
    super(props);
    const { key } = this.props.navigation.state.params;
    this.state = {
      key: key,
      identifyName: "",
      identifyNo: "",
      phone: ""
    };
  }

  async componentDidMount() {
    super.componentDidMount();

    let userInfo = this.props.userinfo;
    if (userInfo) {
      this.setState({
        identifyName: userInfo.identifyName,
        identifyNo: userInfo.identifyNo,
        phone: userInfo.phone

      });
    }
  }


  resert() {
    this.props.navigation.goBack(this.state.key);
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={"实名认证"}
        leftPress={() => this.resert()}
      />

      <View
        style={{ height: 200, width: LayoutConstants.WINDOW_WIDTH, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: 90, height: 90 }}
          source={require("../../assets/set/overapprovehead.png")}
          resizeMode="contain"
        />
      </View>


      <View style={styles.itembg}>
        <Text style={styles.title}>手机号</Text>
        <Text style={styles.context}>{this.state.phone}</Text>
      </View>
      <View style={styles.itembg}>
        <Text style={styles.title}>姓名</Text>
        <Text style={styles.context}>{this.state.identifyName}</Text>
      </View>
      <View style={styles.itembg}>
        <Text style={styles.title}>身份证</Text>
        <Text style={styles.context}>{this.state.identifyNo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center"
  },
  title: {
    fontSize: 16,
    color: Colors.fontGrayColor_a0
  },
  context: {
    fontSize: 16,
    color: Colors.fontDarkColor
  },
  itembg: {
    height: 50,
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomColor: Colors.bgGrayColor_e5,
    borderBottomWidth: 1
  }
});
const mapStateToProps = state => ({
  userinfo: state.Core.userinfo
});
const mapDispatchToProps = () => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverApprove);