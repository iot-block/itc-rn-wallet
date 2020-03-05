//
//  RNGetInfo.m
//  rnWallet
//
//  Created by 周天伦 on 2019/9/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNGetInfo.h"

@implementation RNGetInfo

RCT_EXPORT_MODULE()
- (NSDictionary *)constantsToExport
{
  return @{  
           @"iotchain_network_mainnet": @DEVELOPMENT,
           };
}

@end
