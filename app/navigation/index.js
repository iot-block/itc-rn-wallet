import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import { FirstLaunchRouteConfig, HomeRouteConfig, Loading } from './RouteConfig';
import {
  HomeStackNavigationConfig,
  FirstLaunchStackNavigationConfig,
  HomeDrawerConfig,
} from './NavigatorConfig';
/**
 * 导航结构不同模块功能分开放入不同的导航栈内，全部放入一个导航栈，容易内存泄露
 */
// 首次启动导航栈
const FirstLaunchNavigation = createStackNavigator(
  FirstLaunchRouteConfig,
  FirstLaunchStackNavigationConfig
);

// 主页导航栈
const HomeNavigation = createStackNavigator(HomeRouteConfig, HomeStackNavigationConfig);

// 隐藏二级页面的侧滑菜单
HomeNavigation.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }
  return {
    drawerLockMode,
  };
};

// 首页侧滑导航
const HomeDrawer = createDrawerNavigator(
  {
    HomeNav: {
      screen: HomeNavigation,
    },
  },
  HomeDrawerConfig
);

// 导航栈选择
const SwicthNavigation = createSwitchNavigator(
  {
    Apploading: Loading,
    Home: HomeDrawer,
    FirstLaunch: FirstLaunchNavigation,
  },
  {
    initialRouteName: 'Apploading',
    backBehavior: 'none',
  }
);

export default SwicthNavigation;
