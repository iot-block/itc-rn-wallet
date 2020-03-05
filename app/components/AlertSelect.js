import React, { Component } from "react";
import { Image, TouchableOpacity, StyleSheet, Modal, View, Text, FlatList } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../config/GlobalConfig";
import {
  ExchangeModalWalletSelectCell, ExchangeWalletEmptyComponent
} from "../containers/exchange/component/ExchangeCell";
import { ItemDivideComponent } from "../containers/home/component/HomeCell";
import LayoutConstants from "../config/LayoutConstants";
import { I18n } from "../config/language/i18n";

export default class AlertSelect extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool.isRequired,
    Close: PropTypes.func
  };

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
    if (visible == false) {
      this.props.Close(false);
    }
  };
  renderItem = item => {
    const { onSelect } = this.props;

    return (
      <ExchangeModalWalletSelectCell
        item={item}
        onClick={() => {
          onSelect(item);
        }}
      />
    );

  };

  render() {
    const {
      modalVisible,
      items,
    } = this.props;
    return (
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
      >
        <View style={styles.container}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "transparent" }}
                            onPress={() => this._setModalVisible(false)}>
          </TouchableOpacity>
          <View style={{  backgroundColor: "white" }}>
            <FlatList
              data={items}
              renderItem={this.renderItem}
              ItemSeparatorComponent={ItemDivideComponent}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
              ListHeaderComponent={
                <Text
                  style={{
                    width: LayoutConstants.WINDOW_WIDTH,
                    height: 40,
                    marginTop: 20,
                    marginLeft: 20,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  { I18n.t('exchange.select_wallet')}
                </Text>
              }
            />


          </View>
        </View>

      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: "flex-end"
  }
});