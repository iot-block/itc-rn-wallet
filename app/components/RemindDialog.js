import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../config/GlobalConfig';
import { BlueButtonSmall, WhiteButtonSmall } from './Button';
import { I18n } from '../config/language/i18n';

const styles = StyleSheet.create({
  modeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: 'center',
  },
  contentBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    // marginTop:Layout.WINDOW_HEIGHT*0.23,
    marginLeft: 20,
    marginRight: 20,
    // borderRadius:5,
  },
  text: {
    fontSize: 15,
    color: Colors.fontBlackColor,
    textAlign: 'center',
  },
  buttonBox: {
    flexDirection: 'row',
    marginTop: 40,
  },
  leftBtnBox: {
    flex: 1,
  },
  rightBtnBox: {
    flex: 1,
    marginLeft: 20,
  },
});
export default class RemindDialog extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    leftPress: PropTypes.func.isRequired,
    rightPress: PropTypes.func.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    rightTxt: PropTypes.string,
    leftTxt: PropTypes.string,
  };

  static defaultProps = {
    leftTxt: I18n.t('modal.cancel'),
    rightTxt: I18n.t('modal.confirm'),
  };

  /** constructor(props){
        super(props);
        this.state = {
            isVisible : false,
        }
    }

    componentWillMount(){
        this.setState({
            isVisible : this.props.modalVisible,
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isVisible : nextProps.modalVisible,
        })
    }

    showModal(){
        if(!this.state.isVisible){
            this.setState({
                isVisible : true,
            })
        }   
    }

    hideModal(){
        if(this.state.isVisible){
            this.setState({
                isVisible : false,
            })
        } 
    }
    
    leftPressed=()=>{
        if(this.props.leftPress != undefined){
            this.props.leftPress
        }else{
            this.hideModal();
        } 
    }
    
    rightPressed=()=>{
        this.props.rightPress
    }* */

  render() {
    const { modalVisible, content, leftPress, leftTxt, rightTxt, rightPress } = this.props;
    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}
        onShow={() => {}}
      >
        <View style={styles.modeBox}>
          <View style={styles.contentBox}>
            <Text style={styles.text}>{content}</Text>
            <View style={styles.buttonBox}>
              <View style={styles.leftBtnBox}>
                <WhiteButtonSmall onPress={leftPress} text={leftTxt} />
              </View>
              <View style={styles.rightBtnBox}>
                <BlueButtonSmall onPress={rightPress} text={rightTxt} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
