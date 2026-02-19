//
//  Cryptography.h
//  MKITPayUI
//
//  Created by isg on 10/17/16.
//  Copyright © 2016 ISG. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MKITCryptography : NSObject

+(NSString*)sha256HashFor:(NSString*)input;

+ (NSString*) encryptedString:(NSString*)plaintext withKey:(NSString*)key;
+ (NSString*) decryptedString:(NSString*)ciphetext withKey:(NSString*)key;
+ (NSArray*)sortObjC:(NSArray*)arr;
@end
