import { AppRegistry, YellowBox } from 'react-native';

import './shim';
import App from './app/App';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Module RNRandomBytes',
  'Class RNFaceDetectorModuleMLKit',
]);

AppRegistry.registerComponent('rnWallet', () => App);
