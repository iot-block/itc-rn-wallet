import MD5 from 'react-native-md5';
import NetAddr from './NetAddr';
import Analytics from './Analytics';

const signKey = '';
const signKeyScan = '';

export default class FetchUtils {
  /**
   * fetch timeout
   * @param {Promise} fetchPromise  fetch Request to return the Promise
   * @param {number} [timeout = 10000] In milliseconds, the default timeout is set to 10 seconds
   * @return {Promise}
   */
  static timeoutFetch(fetchPromise, timeout = 10000) {
    let timeoutFn = null;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutFn = () => {
        reject('timeout promise');
      };
    });
    const abortablePromise = Promise.race([fetchPromise, timeoutPromise]);
    setTimeout(() => {
      timeoutFn();
    }, timeout);
    return abortablePromise;
  }

  static requestSWFTGET(url, params) {
    Analytics.recordRequest('GET', url);
    if (params) {
      const paramsArray = [];
      Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    }
    return new Promise((resolve, reject) => {
      this.timeoutFetch(
        fetch(url, {
          method: 'GET',
        })
      )
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static requestSWFTPost(url, params, contentType) {
    // Analytics.recordRequest('POST', url);
    return new Promise((resolve, reject) => {
      this.timeoutFetch(
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': contentType || 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(params),
        })
      )
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static requestGet(url, params) {
    Analytics.recordRequest('GET', url);
    if (params) {
      const paramsArray = [];
      Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    }
    const currentTime = new Date().getTime();
    const sign = MD5.hex_md5(this.getSign(currentTime, url));
    const signParam = [`time=${currentTime}`, `sign=${sign}`].join('&');
    if (url.search(/\?/) === -1) {
      url += `?${signParam}`;
    } else {
      url += `&${signParam}`;
    }
    return new Promise((resolve, reject) => {
      this.timeoutFetch(
        fetch(url, {
          method: 'GET',
        })
      )
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static requestPost(url, params, images) {
    Analytics.recordRequest('POST', url);
    const currentTime = new Date().getTime();
    const sign = MD5.hex_md5(this.getSign(currentTime, url));
    params.sign = sign;
    params.time = currentTime;
    if (images) {
      const formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      for (let i = 0; i < images.length; i++) {
        const { uri } = images[i];
        const name = `${params.userToken}_${new Date().getTime()}_${i}.png`;
        const imagefile = { uri, type: 'multipart/form-data', name };
        formData.append('feedbackImage', imagefile);
      }
      return new Promise((resolve, reject) => {
        this.timeoutFetch(
          fetch(url, {
            method: 'POST',
            body: formData,
          })
        )
          .then(response => response.json())
          .then(responseJson => {
            resolve(responseJson);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      this.timeoutFetch(
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(params),
        })
      )
        .then(response => response.json())
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getSign(currentTime, url) {
    return ''
  }
}
