#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNAppsFlyer.h>
#import "StallionModule.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Fracspace";
  [FIRApp configure];
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  NSURL *defaultBundle = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  // return [StallionModule getBundleURL:defaultBundle];
  // NSURL *bundleURL = [StallionModule getBundleURL:defaultBundle];
  // NSLog(@"[STALLION] Bundle URL: %@", bundleURL);
  // return bundleURL;

  NSURL *bundleURL = [StallionModule getBundleURL:defaultBundle];

  NSData *data = [NSData dataWithContentsOfURL:bundleURL];
  // NSString *content = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

  // NSLog(@"[STALLION] Bundle preview: %@", [content substringToIndex:200]);
  const unsigned char *bytes = (const unsigned char *)[data bytes];

  NSMutableString *hexPreview = [NSMutableString string];

  for (int i = 0; i < MIN(20, data.length); i++) {
      [hexPreview appendFormat:@"%02x ", bytes[i]];
  }

  NSLog(@"[STALLION] First bytes: %@", hexPreview);

  NSLog(@"[STALLION] Bundle path: %@", bundleURL);
  NSLog(@"[STALLION] Bundle size: %lu", (unsigned long)data.length);

  return bundleURL;
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary *)options
{
  [[AppsFlyerAttribution shared] handleOpenUrl:url options:options];
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  [[AppsFlyerAttribution shared] continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

@end
