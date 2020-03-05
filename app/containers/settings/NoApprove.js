import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from "react-native";
import { WhiteBgHeader } from "../../components/NavigaionHeader";
import { I18n } from "../../config/language/i18n";
import BaseComponent from "../base/BaseComponent";
import { StorageKey, Colors } from "../../config/GlobalConfig";
import LinearGradient from "react-native-linear-gradient";
import LayoutConstants from "../../config/LayoutConstants";

export default class NoApprove extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={"实名认证"}
        leftPress={() => this.props.navigation.goBack()}
      />
      <View style={{width:LayoutConstants.WINDOW_WIDTH,height:1,backgroundColor: Colors.bgGrayColor_e5}}/>
      <View
        style={{ height: 200, width: LayoutConstants.WINDOW_WIDTH, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ width: 90, height: 90 }}
          source={require("../../assets/set/noapprovehead.png")}
          resizeMode="contain"
        />
      </View>
      <Text style={{ fontSize: 16, color: Colors.fontDarkColor }}>尚未完成实名认证</Text>
      <TouchableOpacity
        style={{ width: "40%" }}
        activeOpacity={0.6}
        onPress={() => this.props.navigation.navigate("BindPhone",{key:this.props.navigation.state.key})}
      >
        <LinearGradient
          colors={["#03B6FF", "#15A1FF"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 43, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 30 }}
        >
          <Text style={{ color: "white", fontSize: 15 }} numberOfLines={1}>立即认证
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
  }
});