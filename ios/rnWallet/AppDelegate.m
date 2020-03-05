/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif


#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import "JPUSHService.h"
#import <Firebase.h>
#import "AFNetworking.h"
@interface AppDelegate()
@end


@implementation AppDelegate

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //Optional
  NSLog(@"did Fail To Register For Remote Notifications With Error: %@", error);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object: notification.userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }
  
  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }
  
  completionHandler();
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([[UIDevice currentDevice].systemVersion floatValue]>= 10.0) {
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  }else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    //categories 可自定义
    [JPUSHService registerForRemoteNotificationTypes:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound |  UNAuthorizationOptionAlert)  categories:nil];
  }else {
    //categories 必须为nil
    [JPUSHService registerForRemoteNotificationTypes:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound |  UNAuthorizationOptionAlert)  categories:nil];
  }
  if (DEVELOPMENT == 1) {
    [JPUSHService setupWithOption:launchOptions appKey:@"05273fe7da8d46a73325ce20"
                          channel:nil apsForProduction:nil];
  }else{
    [JPUSHService setupWithOption:launchOptions appKey:@"865b586edec68f5b84d167ce"
                          channel:nil apsForProduction:nil];
  }
 
  
  NSURL *jsCodeLocation;
#ifdef DEBUG
  //开发包
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  //离线包
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index.ios.jsbundle" withExtension:nil];
#endif
  
  
  [FIRApp configure];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"rnWallet"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  
  
  
  return YES;
}

-(void)applicationDidBecomeActive:(UIApplication *)application{
  //测试环境调用接口判断是否直接下载更新
  if (DEVELOPMENT == 1) {
      [self checkApp];
  }
}

-(void)checkApp{
  NSString *Url = @"https://api.fir.im/apps/latest/5d82fb2423389f2ccb476418?api_token=ed09aeb159b0a9f03f896375299f9a12";
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  [manager GET:Url parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    NSLog(@"");
    NSString *install_url = [responseObject objectForKey:@"install_url"];
    NSString *versionShort = [responseObject objectForKey:@"versionShort"];
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    if([versionShort compare:app_Version] == NSOrderedDescending){
      UIAlertView * alertView = [[UIAlertView alloc] initWithTitle:[NSString stringWithFormat:@"版本更新%@",versionShort] message:nil delegate:self cancelButtonTitle:@"更新" otherButtonTitles:@"暂不更新", nil];
      alertView.tag = 20000;
      alertView.delegate = self;
      [alertView show];
    }
    NSString *URLencodeString = CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(kCFAllocatorDefault, (CFStringRef)install_url, NULL, CFSTR(":/?#[]@!$ &'()*+,;=\"<>%{}|\\^~`"), CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding)));
    _installURL = [NSString stringWithFormat:@"itms-services://?action=download-manifest&url=%@", URLencodeString];
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    NSLog(@"");
  }];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
  //1. 版本更新
  if (alertView.tag == 20000)
  {
    if(buttonIndex == 0){
      
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:_installURL]];
      exit(0);
    }
    
  }
}
@end
