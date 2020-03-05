/*
    --- 路由配置 ---
    initialRouteName：设置默认的页面组件，必须是上面已注册的页面组件
    initialRouteParams：初始路由参数

    navigationOptions：配置StackNavigator的一些属性。

        title：标题，如果设置了这个导航栏和标签栏的title就会变成一样的，不推荐使用
        header：可以设置一些导航的属性，如果隐藏顶部导航栏只要将这个属性设置为null
        headerTitle：设置导航栏标题，推荐
        headerBackTitle：设置跳转页面左侧返回箭头后面的文字，默认是上一个页面的标题。可以自定义，也可以设置为null
        headerTruncatedBackTitle：设置当上个页面标题不符合返回箭头后的文字时，默认改成"返回"
        headerRight：设置导航条右侧。可以是按钮或者其他视图控件
        headerLeft：设置导航条左侧。可以是按钮或者其他视图控件
        headerStyle：设置导航条的样式。背景色，宽高等
        headerTitleStyle：设置导航栏文字样式
        headerBackTitleStyle：设置导航栏‘返回’文字样式
        headerTintColor：设置导航栏颜色
        headerPressColorAndroid：安卓独有的设置颜色纹理，需要安卓版本大于5.0
        gesturesEnabled：是否支持滑动返回手势，iOS默认支持，安卓默认关闭
*/
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '../config/GlobalConfig';
import RightDrawer from '../containers/home/RightDrawer';
import LayoutConstants from '../config/LayoutConstants';
import TabIcon from '../components/TabIcon';
import { I18n } from '../config/language/i18n';
import { getMessageCount } from '../utils/CommonUtil';

const StackNavigationConfig = {
  initialRouteName: 'Set',
  // initialRouteName: 'Home',
  // initialRouteName: 'Wallet',
  // initialRouteName: 'FirstLaunch',
  // initialRouteName: 'Transfer',
};

const HomeStackNavigationConfig = {
  initialRouteName: 'HomeTab',
  headerMode: 'none',
  /** navigationOptions: ({ navigation }) => ({
        headerStyle:{
            //height:{height},
            backgroundColor: Colors.backgroundWhiteColor
        }, 
        headerTitleStyle:{ 
            flex:1,
            alignSelf:'center',
            textAlign:'center',
            color:Colors.fontBlackColor,
            fontSize:16,
            fontWeight:"400"
        }

    })* */
};

const HomeDrawerConfig = {
  initialRouteName: 'HomeNav',
  drawerPosition: 'right',
  contentComponent: RightDrawer,
  drawerWidth: LayoutConstants.HOME_DRAWER_WIDTH,
};

const FirstLaunchStackNavigationConfig = {
  initialRouteName: 'FirstLaunch',
  headerMode: 'none',
};

const styles = StyleSheet.create({
  blueText: {
    fontSize: 12,
    color: '#01a1e6',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 2,
    marginTop: 0,
  },
  grayText: {
    fontSize: 12,
    color: '#aaaaaa',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 2,
    marginTop: 0,
  },
});

const HomeBottomTabNavigationConfig = {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom', // 设置TabNavigator的位置
  animationEnabled: true, // 是否在更改标签时显示动画
  swipeEnabled: true, // 是否允许在标签之间进行滑动
  lazy: false, // 是否在app打开的时候将底部标签栏全部加载
  backBehavior: 'none', // 按back键是否跳转到第一个Tab(首页)， none 为不跳转
  tabBarOptions: {
    activeBackgroundColor: 'white', // 活动标签的背景颜色
    inactiveBackgroundColor: 'white', // 非活动选项卡的背景颜色
    activeTintColor: Colors.fontBlueColor, // label和icon的前景色 活跃状态下（选中）
    inactiveTintColor: Colors.fontGrayColor_a, // label和icon的前景色 活跃状态下（未选中）
    showLabel: true, // 是否显示图标，默认关闭
    showIcon: true, // 是否显示label，默认开启
    upperCaseLabel: false, // Android属性  是否使标签大写，默认为true
    style: {
      // 整体TabBar的样式
      backgroundColor: 'white',
      height: 48,
      borderTopWidth: 0.5,
      borderTopColor: Colors.borderColor_e,
    },
    tabStyle: {
      // 选项卡的样式
      height: 48,
    },
    labelStyle: {
      // 选项卡标签的样式
      fontSize: 12,
    },
    indicatorStyle: {
      // android 线的样式
      height: 0,
    },
  },
  navigationOptions: ({ navigation }) => ({
    tabBarOnPress: () => {
      // 使用tabBarOnPress点击事件
      if (!navigation.isFocused()) {
        if (navigation.state.routeName === 'My') {
          getMessageCount();
        }
        navigation.navigate(navigation.state.routeName, {
          title: navigation.state.routeName,
        });
      }
    },
    tabBarLabel: ({ focused }) => {
      const { routeName } = navigation.state;

      switch (routeName) {
        case 'Home':
          return (
            <Text style={focused ? styles.blueText : styles.grayText} numberOfLines={1}>
              {I18n.t('home.tab_wallet')}
            </Text>
          );
        case 'Exchange':
          return (
            <Text style={focused ? styles.blueText : styles.grayText} numberOfLines={1}>
              {I18n.t('home.tab_exchange')}
            </Text>
          );
        case 'Mapping':
          return (
            <Text style={focused ? styles.blueText : styles.grayText} numberOfLines={1}>
              {I18n.t('home.tab_mapping')}
            </Text>
          );
        case 'My':
          return (
            <Text style={focused ? styles.blueText : styles.grayText} numberOfLines={1}>
              {I18n.t('home.tab_my')}
            </Text>
          );
        default:
          return null;
      }
    },
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      switch (routeName) {
        case 'Home': {
          const homeIcon = focused
            ? require('../assets/home/wallet_on.png')
            : require('../assets/home/wallet_off.png');
          return <TabIcon icon={homeIcon} />;
        }
        case 'Exchange': {
          const exchangeIcon = focused
            ? require('../assets/exchange/exchange.png')
            : require('../assets/exchange/exchange_huise.png');
          return <TabIcon icon={exchangeIcon} />;
        }
        case 'Mapping': {
          const mappingIcon = focused
            ? require('../assets/home/mapping_on.png')
            : require('../assets/home/mapping_off.png');
          return <TabIcon icon={mappingIcon} />;
        }
        case 'My': {
          const myIcon = focused
            ? require('../assets/home/my_on.png')
            : require('../assets/home/my_off.png');
          return <TabIcon icon={myIcon} isShowRedRemind={false} count={0} />;
        }
        default:
          return null;
      }
    },
  }),
};

export {
  HomeStackNavigationConfig,
  FirstLaunchStackNavigationConfig,
  StackNavigationConfig,
  HomeDrawerConfig,
  HomeBottomTabNavigationConfig,
};
