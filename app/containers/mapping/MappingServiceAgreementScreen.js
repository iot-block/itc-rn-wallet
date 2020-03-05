import React from 'react';
import { WebView, View, StyleSheet } from 'react-native';
import BaseComponent from '../base/BaseComponent';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import LayoutConstants from '../../config/LayoutConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
    width: LayoutConstants.WINDOW_WIDTH,
    height: LayoutConstants.WINDOW_HEIGHT - 80,
  },
});

export default class MappingServiceAgreement extends BaseComponent {
  renderComponent = () => {
    const lang = I18n.locale;
    
    const webUri =
      lang === 'zh'
        ? 'https://wallet.iotchain.io/mappingService.html'
        : 'https://wallet.iotchain.io/mappingService_en.html'
    return (
      <View style={styles.container}>
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.service_agreement_title')}
        />
        <WebView
          style={styles.webView}
          source={{ uri: webUri, method: 'GET' }}
          startInLoadingState
          bounces={false}
          scrollEnabled
          automaticallyAdjustContentInsets
          domStorageEnabled
        />
      </View>
    );
  };
}
