import { PermissionsAndroid } from 'react-native';

// 返回 Promise类型 里面是用户是否授权的布尔值
// 1.PermissionsAndroid.check(permission)  //permission是String型

// 返回String类型   'granted'：同意了  'denied'：拒绝了  'never_ask_again'：永久性拒绝下次再请求用户也看不到了
// 2. PermissionsAndroid.request(permission, rationale?) //permission是String型，rationale对象

// 返回一个对象
// PermissionsAndroid.requestMultiple(permissions) //permissions为String型数组

// 核实
function checkAndroidPermission(permission) {
  try {
    // 返回Promise类型
    const granted = PermissionsAndroid.check(permission);
    granted
      .then(
        data =>
          // 是否获取权限 data
          data
      )
      .catch(err => {
      });
  } catch (exception) {
    console.log('checkAndroidPermission exception', exception);
  }
}

// 请求权限
async function requestAndroidPermission(permission) {
  try {
    const granted = await PermissionsAndroid.request(
      permission
      /** {
                  'title': '申请' + title + '权限',
                  'message': message
              }* */
    );
    if (granted === 'granted') {
      // console.log("获得权限")
      return true;
    }
    // console.log("禁止权限")
    return false;
  } catch (exception) {
    console.log('requestAndroidPermission exception:', exception);
    return false;
  }
}

async function androidPermission(permission) {
  if (checkAndroidPermission(permission)) {
    return true; // 已获得了权限
  }
  // 未获得权限，申请权限
  const isAgree = await requestAndroidPermission(permission);
  if (isAgree) {
    return true; // 同意
  }
  return false; // 拒绝
}

// 请求多个权限
async function requestMultipleAndroidPermission(permissions) {
  try {
    const agreePermissions = [];
    const granteds = await PermissionsAndroid.requestMultiple(permissions); // 返回的是对象类型
    permissions.forEach((txt, index) => {
      if (granteds[permissions[index]] === 'granted') {
        agreePermissions.push(true);
      } else {
        agreePermissions.push(false);
      }
    });
    return agreePermissions;
  } catch (exception) {
    console.log('requestMultipleAndroidPermission exception', exception);
    return [];
  }
}

export {
  androidPermission,
  checkAndroidPermission,
  requestAndroidPermission,
  requestMultipleAndroidPermission,
};
