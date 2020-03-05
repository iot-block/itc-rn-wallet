import Toast from 'react-native-root-toast';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 20,
    // height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    zIndex: 99999,
  },
});

function showToast(message, position, duration, toastHideCallback) {
  const toast = Toast.show(message, {
    visible: true,
    duration: duration === undefined ? Toast.durations.Long : duration, // 显示时间
    position: position === undefined ? Toast.positions.BOTTOM : position, // 吐司的位置显示在屏幕上（负数表示距离屏幕底部的距离。正数表示距屏幕顶部的距离.0将吐司定位到屏幕中间。）
    shadow: true, // Toast元素周围投下阴影
    animation: false, // 动画
    backgroundColor: 'black', // 背景颜色
    textColor: 'white', // 字体颜色
    hideOnPress: false, // 通过按下吐司来隐藏出现的吐司。
    delay: 0, // 吐司开始前的延迟时间出现在屏幕上
    containerStyle: styles.containerStyle,
    onShow: () => {
      // Toast出现动画开始的回调
    },
    onShown: () => {
      // Toast出现动画结束的回调
    },
    onHide: () => {
      // Toast的隐藏动画开始的回调
    },
    onHidden: () => {
      // Toast的隐藏动画结束的回调
      if (toastHideCallback) {
        toastHideCallback();
      }
    },
  });
  return toast;
  // 手动隐藏动画
  // Toast.hide(toast);
}

function hideToast(toast) {
  Toast.hide(toast);
}
export { showToast, hideToast };
