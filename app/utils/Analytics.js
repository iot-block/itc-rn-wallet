import firebase from 'react-native-firebase';
import LayoutConstants from '../config/LayoutConstants';
// firebase.utils().errorOnMissingPlayServices = false;
// firebase.utils().promptOnMissingPlayServices = false;

async function checkPlayServicesBasic() {
  const utils = firebase.utils();

  const { isAvailable, hasResolution, isUserResolvableError } = utils.playServicesAvailability;

  // all good and valid \o/
  if (isAvailable) return Promise.resolve();

  // if the user can resolve the issue i.e by updating play services
  // then call Google Play's own/default prompting functionality
  if (isUserResolvableError) {
    return Promise.reject('play services unAvailable');
  }

  // call Google Play's own/default resolution functionality
  if (hasResolution) {
    return Promise.reject('play services unAvailable');
  }

  // There's no way to resolve play services on this device
  // probably best to show a dialog / force crash the app
  return Promise.reject(new Error('Unable to find a valid play services version.'));
}

let enableGoogleServer = false;
export default class Analytics {
  static enable() {
    if (!enableGoogleServer) {
      if (LayoutConstants.DEVICE_IS_ANDROID()) {
        checkPlayServicesBasic()
          .then(
            () => {
              enableGoogleServer = true;
              firebase.analytics().setAnalyticsCollectionEnabled(true);
            },
            err => {
              console.log('checkPlayServicesBasicRejectErr', err);
            }
          )
          .catch(err => {
            console.log('checkPlayServicesBasicCatchErr', err);
          });
      } else {
        enableGoogleServer = true;
        firebase.analytics().setAnalyticsCollectionEnabled(true);
      }
    }
  }

  static recordUserId(userId) {
    if (enableGoogleServer) {
      firebase.analytics().setUserId(userId);
    }
  }

  static setCurrentScreen(screenClass) {
    if (enableGoogleServer) {
      firebase.analytics().setCurrentScreen(screenClass);
    }
  }

  static setUserProperty(name, value) {
    if (enableGoogleServer) {
      firebase.analytics().setUserProperty(name, value);
    }
  }

  static recordRequest(method, url) {
    if (enableGoogleServer) {
      try {
        const urlStr = url.length > 100 ? url.substring(0, 99) : url;
        firebase.analytics().logEvent('request', {
          reqMethod: method,
          reqUrl: urlStr,
        });
      } catch (err) {
        firebase.analytics().logEvent('customErr', {
          errName: 'recordRequest',
          errDetsail: method,
        });
      }
    }
  }

  static recordErr(errName, err) {
    if (enableGoogleServer) {
      if (err === 'No transactions found') {
        return;
      }
      try {
        let errStr;
        if (err.message) {
          errStr = err.message;
        } else {
          errStr = JSON.stringify(err);
        }
        console.log(errName, errStr);
        if (errStr.length > 100) {
          errStr = errStr.substring(0, 99);
        }
        firebase.analytics().logEvent('customErr', {
          errName,
          errDetail: errStr,
        });
      } catch (e) {
        firebase.analytics().logEvent('customErr', { errName: 'recordErr', errDetail: errName });
      }
    }
  }

  static recordClick(category, detail) {
    if (enableGoogleServer) {
      try {
        firebase.analytics().logEvent('click', {
          category,
          detail,
        });
      } catch (err) {
        firebase.analytics().logEvent('customErr', {
          errName: 'recordClick',
          errDetail: category,
        });
      }
    }
  }
}
