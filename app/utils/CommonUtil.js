import { DeviceEventEmitter } from "react-native";
import StorageManage from "./StorageManage";
import NetworkManager from "./NetworkManager";
import { StorageKey } from "../config/GlobalConfig";
import store from "../config/store/ConfigureStore";
import { I18n } from "../config/language/i18n";

function validateEmail(email) {
  const mailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (mailRegex.test(email)) {
    return true;
  }
  return false;
}

/*判断手机号码是否有效*/
function checkPhone(phone) {
  let str = phone.replace(/\s+/g, "");
  if (!(/^1\d{10}$/.test(str))) {
    return false;
  } else {
    return true;
  }
}

function addressToName(address, contacts) {
  let addressName = "";
  const { length } = contacts;
  for (let i = 0; i < length; i++) {
    if (contacts[i].address.toLowerCase() === address.toLowerCase()) {
      const { name } = contacts[i];
      addressName = name;
      break;
    }
  }
  return addressName;
}

// 获取未度消息数
async function getMessageCount() {
  const userToken = await StorageManage.load(StorageKey.UserToken);
  if (!userToken || userToken === null) {
    return;
  }
  const params = {
    userToken: userToken.userToken
  };
  NetworkManager.getUnReadMessageCount(params)
    .then(response => {
      if (response.code === 200) {
        const messageCount = response.data.account;
        DeviceEventEmitter.emit("messageCount", { messageCount });
      } else {
        console.log("getMessageCountErr msg:", response.msg);
      }
    })
    .catch(err => {
      console.log("getMessageCountErr:", err);
    });
}

function getMonetaryUnitSymbol() {
  // 优先判断货币 如果货币本地没有再使用语言
  // const currentLocale = I18n.currentLocale()
  // var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
  const { monetaryUnit } = store.getState().Core;

  if (monetaryUnit) {
    const { symbol } = monetaryUnit;
    return symbol;
  }
  const currentLocale = I18n.locale;
  if (currentLocale.includes("zh")) {
    return "¥";
  }
  if (currentLocale.includes("ko")) {
    return "₩";
  }
  if (currentLocale.includes("ru")) {
    return "₽";
  }
  if (currentLocale.includes("uk")) {
    return "₴";
  }
  if (
    currentLocale.includes("de") ||
    currentLocale.includes("es") ||
    currentLocale.includes("nl") ||
    currentLocale.includes("fr")
  ) {
    return "€";
  }
  // 默认美元
  return "$";
}


function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  } else {
    return true;
  }
}

function isName(name) {
  var nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
  if (nameReg.test(name)) {
    return true;
  } else {
    return false;
  }
}

function  compareSort(key, desc) {
  return function (a, b) {
    if (desc) {
      return a[key] <= b[key] ? 1 : -1;
    } else {
      return a[key] >= b[key] ? 1 : -1;
    }
  }
}

export { validateEmail, addressToName, getMessageCount, getMonetaryUnitSymbol, checkPhone, isCardNo,isName,compareSort };
