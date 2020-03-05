import { I18n } from '../../config/language/i18n';

// 打乱数组的顺序
function upsetArrayOrder(array) {
  const len = array.length;
  for (let i = len - 1; i >= 0; i--) {
    // 随机索引值randomIndex是从0-arr.length中随机抽取的
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // 从数组中随机抽取到的值与当前遍历的值互换位置
    const itemIndex = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = itemIndex;
  }
  return array;

  /* const len = array.length;
  for (let i = 0; i < len; i++) {
    const end = len - 1;
    // const index = (Math.random() * (end + 1)) >> 0;
    const index = Math.random() * (end + 1) * 10;
    const t = array[end];
    array[end] = array[index];
    array[index] = t;
  }
  return array; */
}

// 将字符串前后所有的空格去掉
function stringTrim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

// 将字符串中的多个空格缩减为一个空格
function resetStringBlank(str) {
  const regEx = /\s+/g;
  const newStr = str.replace(regEx, ' ');
  return newStr;
}

function matchFormat(iscontainUpper, iscontainLower, iscontainNum, iscontainSymbol) {
  if (iscontainUpper && !iscontainLower && !iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_1');
  }
  if (!iscontainUpper && iscontainLower && !iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_2');
  }
  if (!iscontainUpper && !iscontainLower && iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_3');
  }
  if (!iscontainUpper && !iscontainLower && !iscontainNum && iscontainSymbol) {
    return I18n.t('launch.password_warn_4');
  }
  if (iscontainUpper && iscontainLower && !iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_5');
  }
  if (iscontainUpper && !iscontainLower && iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_6');
  }
  if (iscontainUpper && !iscontainLower && !iscontainNum && iscontainSymbol) {
    return I18n.t('launch.password_warn_7');
  }
  if (!iscontainUpper && iscontainLower && iscontainNum && !iscontainSymbol) {
    return I18n.t('launch.password_warn_8');
  }
  if (!iscontainUpper && iscontainLower && !iscontainNum && iscontainSymbol) {
    return I18n.t('launch.password_warn_9');
  }
  if (!iscontainUpper && !iscontainLower && iscontainNum && iscontainSymbol) {
    return I18n.t('launch.password_warn_10');
  }
  return '';
}

// 密码最少为8位，至少包含大小写字母、数字、符号中的2种
function vertifyPassword(pwd) {
  // var regex = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){8,20}$/;//大、小写字母、数字、符号中的2种
  // var regex = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/;//大小写字母、数字、符号中的2种
  // var regex = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,20}$/; //密码最少为8位，需包含大、小写字母、数字、符号

  const regUpper = /[A-Z]/;
  const regLower = /[a-z]/;
  const regNum = /[0-9]/;
  const regSymbol = /[^A-Za-z0-9]/;

  let warnContent = '';
  const iscontainUpper = !!regUpper.test(pwd);
  const iscontainLower = !!regLower.test(pwd);
  const iscontainNum = !!regNum.test(pwd);
  const iscontainSymbol = !!regSymbol.test(pwd);

  if (pwd.length < 8) {
    warnContent =
      I18n.t('launch.password_warn_least_8') +
      matchFormat(iscontainUpper, iscontainLower, iscontainNum, iscontainSymbol);
  } else {
    warnContent = matchFormat(iscontainUpper, iscontainLower, iscontainNum, iscontainSymbol);
  }

  return warnContent;
}

export { upsetArrayOrder, stringTrim, resetStringBlank, vertifyPassword };
