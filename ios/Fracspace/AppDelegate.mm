#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNAppsFlyer.h>
#import "StallionModule.h"
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Fracspace";
  // New Architecture: registers third-party Fabric components / TurboModules (RN 0.77+)
  self.dependencyProvider = [RCTAppDependencyProvider new];
  [FIRApp configure];
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

// RN 0.74+ (bridgeless / New Architecture) loads JS from bundleURL.
// Release builds load the Stallion OTA bundle, falling back to the bundled main.jsbundle.
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  NSURL *defaultBundle = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [StallionModule getBundleURL:defaultBundle];
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
