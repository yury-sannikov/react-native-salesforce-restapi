//
//  ViewController.m
//  RNSFOAuth
//
//  Created by Yuri Sanikov on 1/11/17.
//  Copyright © 2017 Fonteva. All rights reserved.
//

#import "RNSFOAuth.h"
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(OAuthManager, NSObject)

RCT_EXTERN_METHOD(loginUser:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
