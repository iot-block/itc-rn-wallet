import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import MappingTermsScreen from './MappingTermsScreen';

class Mapping extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
    this._isMounted = false;
  }

  componentWillMount() {
    this._isMounted = true;
    super.componentWillMount();
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  _monetaryUnitChange = () => {
    this.setState(prevState => ({
      refresh: !prevState.refresh,
    }));
  };

  render() {
    const { refresh } = this.state;
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#32beff', '#32beff']}>
        <View
          style={{
            flex: 1,
            marginTop: Layout.DEVICE_IS_IPHONE_X() ? 44 : 20,
            backgroundColor: 'white',
          }}
        >
          <MappingTermsScreen _this={this} refresh={refresh} />
        </View>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  wallet: state.Core.wallet,
  monetaryUnit: state.Core.monetaryUnit,
  network: state.Core.network,
});

export default connect(mapStateToProps)(Mapping);
