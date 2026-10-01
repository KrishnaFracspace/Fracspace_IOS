import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Linking, Alert, Platform, PermissionsAndroid, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import Video from 'react-native-video';
import appsFlyer from 'react-native-appsflyer';
import NavigationStack from './Screen/Navigation/NavigationStack';
import store from './Screen/redux/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDeepLinkNav } from './Screen/redux/reducer/homeReducer';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import UpdatePopup from './components/UpdatePopup';
import { getAppVersionConfig } from './Screen/Services/versionService';
import { compareVersions } from './Screen/utils/versionUtils';
import { AppProvider } from './Screen/Context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './Screen/components/NoInternet';

// OTA is split per platform: Stallion on iOS, CodePush on Android.
// Lazy requires so neither library's JS is evaluated on the other platform.
const Stallion = Platform.OS === 'ios' ? require('react-native-stallion') : null;
const codePush = Platform.OS === 'android' ? require('react-native-code-push') : null;

const { width, height } = Dimensions.get('window');
const navigationRef = createNavigationContainerRef();

// iOS only: must render inside withStallion (useStallionUpdate needs its provider).
const IOSStallionUpdater = () => {
  const { isRestartRequired, currentlyRunningBundle } = Stallion.useStallionUpdate();

  useEffect(() => {
    if (!__DEV__) {
      Stallion.sync();
    }
  }, []);

  useEffect(() => {
    console.log('=== Stallion Debug ===');
    console.log('isRestartRequired:', isRestartRequired);
    if (!__DEV__ && isRestartRequired) {
      console.log('currentlyRunningBundle:', currentlyRunningBundle);
      Stallion.restart();
    }
  }, [isRestartRequired]);

  return null;
};


const linking = {
  prefixes: ['fracspace://', 'fsapp://', 'https://fracspace.com', 'https://fracspace.onelink.me'],
  config: {
    screens: {
      Property: 'property/:Id/:referralCode',
      NewLogin: 'login',
      NewSigin: 'signup',
      BottomNavigations: {
        screens: {
          HomePage: 'home',
        },
      },
    },
  },
};

const App = () => {
  const pendingLinkRef = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const [updateConfig, setUpdateConfig] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const routeNameRef = useRef();

  const navigateWithAuthCheck = async (redirectData) => {
    store.dispatch(setDeepLinkNav(true));
    const token = await AsyncStorage.getItem('mytoken');
    console.log('navigateWithAuthCheck: token:', token);
    if (token) {
      navigationRef.navigate(redirectData.screen, redirectData.params);
    } else {
      // Keep the target so signup can pick it up too.
      await AsyncStorage.setItem(
        'pendingDeepLink',
        JSON.stringify(redirectData),
      ).catch(err => console.log('Save pending error:', err));
      navigationRef.navigate('NewLogin', {
        redirectAfterLogin: redirectData,
      });
    }
  };

  useEffect(() => {
    const sendEvent = async() => {
      try{
        await analytics().logEvent('app_open');
        console.log('Firebase event sent');
      }catch(e){
        console.log('Firebase error: ', e);
      }
    }
    sendEvent();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected !== false);
    });
    return () => unsubscribe();
  }, []);

  const checkConnection = () => {
    NetInfo.fetch().then(state => setIsConnected(state.isConnected !== false));
  };

  // Foreground push: show title/body; skip data-only messages.
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage?.notification?.title;
      const body = remoteMessage?.notification?.body;
      if (title || body) {
        Alert.alert(title || '', body || '');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getDeviceToken = async() => {
      try{
        const data = await messaging().getToken();
        console.log("FCM Token: ", data);
      }catch(error){
        console.log("Fcm token error: ",error);
      }
    }
    
    getDeviceToken();
  }, []);

  // const getDeviceToken = async () => {
  //   try{
  //     const data = await messaging().getToken();
  //     console.log("FCM token: ", data);
  //   }catch(error){
  //     console.log("FCM token error: ", error);
  //   }
  // };

  const tryNavigate = (data, source = 'unknown') => {
    console.log(`[${source}] Deep link received:`, data);
    if (!data?.deep_link_value) return;
    let redirectData = null;
    if (data.deep_link_value === 'property' || data.deep_link_value === 'property_share') {
      redirectData = {
        screen: 'Property',
        params: {
          Id: data?.af_sub2 || data?.deep_link_sub1 || data?.af_sub1 || 'MISSING',
          referralCode: data.af_sub1 || 'MISSING',
        },
      };
    } else if (data.deep_link_value === 'wallet_section') {
      redirectData = { screen: 'WalletAmount', params: {} };
    } else if (data.deep_link_value === 'payment_link') {
      redirectData = {
        screen: 'Book',
        params: { Id: data?.deep_link_sub1 || data?.af_sub2 || data?.af_sub1 || 'MISSING' },
      };
    } else if (data.deep_link_value === 'escape_section'){
      redirectData = { screen: 'MembershipHome', params: {}};
    } else if (data.deep_link_value === 'concert_section') {
      redirectData = {
        screen: 'ConcertDetails',
        params: { concertId: data?.deep_link_sub1 || data?.af_sub2 || data?.af_sub1 || null },
      };
    } else {
      return;
    }

    const isFirstLaunch = data?.is_first_launch === true || data?.is_first_launch === 'true';
    if (isFirstLaunch || source === 'onInstallConversionData') {
      AsyncStorage.setItem('pendingDeepLink', JSON.stringify(redirectData))
        .catch(err => console.log('Save pending error:', err));
    }
    AsyncStorage.getItem('mytoken').then((token) => {
      if (!token) {
        // Logged out: keep the target so it survives NewLogin -> NewSigin
        // and an app restart in the middle of logging in.
        AsyncStorage.setItem('pendingDeepLink', JSON.stringify(redirectData))
          .catch(err => console.log('Save pending error:', err));
      }
      if (navigationRef.isReady()) {
        if (token) {
          navigationRef.navigate(redirectData.screen, redirectData.params);
        } else {
          navigationRef.navigate('NewLogin', { redirectAfterLogin: redirectData });
        }
      } else {
        pendingLinkRef.current = redirectData;
      }
    });
  };

  useEffect(() => {
    const deepLinkUnsub = appsFlyer.onDeepLink((res) => {
      if (res?.deepLinkStatus === 'FOUND') tryNavigate(res.data, 'onDeepLink');
    });

    // Conversion data is re-delivered on later launches; only act on the first launch.
    const installUnsub = appsFlyer.onInstallConversionData((res) => {
      const data = res?.data || {};
      const isFirstLaunch = data?.is_first_launch === true || data?.is_first_launch === 'true';
      if (isFirstLaunch) tryNavigate(data, 'onInstallConversionData');
    });

    const attributionUnsub = appsFlyer.onAppOpenAttribution((res) => {
      tryNavigate(res?.data || {}, 'onAppOpenAttribution');
    });

    appsFlyer.initSdk(
      {
        devKey: 'z9iokP3YwU3z6uxEkKgJfn',
        appId: '6498551006',
        isDebug: __DEV__,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
      },
      () => console.log(' AppsFlyer init success'),
      (err) => console.log('AppsFlyer init failed:', err)
    );

    return () => {
      deepLinkUnsub?.();
      installUnsub?.();
      attributionUnsub?.();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('ready', () => {
      if (pendingLinkRef.current) {
        navigateWithAuthCheck(pendingLinkRef.current);
        pendingLinkRef.current = null;
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          if (Platform.Version >= 33) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
          }
          await messaging().getToken();
          return;
        }
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) await messaging().getToken();
      } catch (err) {
        console.log('Firebase permission error:', err);
      }
    };
    requestPermission();
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkPendingAfterSplash = async () => {
      if (!showSplash) {
        const pending = await AsyncStorage.getItem('pendingDeepLink');
        if (pending && navigationRef.isReady()) {
          try {
            const data = JSON.parse(pending);
            navigateWithAuthCheck(data);
            await AsyncStorage.removeItem('pendingDeepLink');
          } catch (e) {}
        }
      }
    };
    checkPendingAfterSplash();
  }, [showSplash]);

  useEffect(() => {
    const parseAndNavigate = (url) => {
      if (url.includes('property/')) {
        const match = url.match(/property\/([^\/]+)\/([^\/\?]+)/);
        if (match) {
          const [, id, referralCode] = match;
          const redirectData = {
            screen: 'Property',
            params: { Id: id, referralCode: referralCode },
          };
          AsyncStorage.getItem('mytoken').then((token) => {
            if (navigationRef.isReady()) {
              if (token) {
                navigationRef.navigate(redirectData.screen, redirectData.params);
              } else {
                navigationRef.navigate('NewLogin', { redirectAfterLogin: redirectData });
              }
            } else {
              pendingLinkRef.current = redirectData;
            }
          });
        }
      }
    };

    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) parseAndNavigate(url);
    };

    handleInitialURL();
    const subscription = Linking.addEventListener('url', ({ url }) => parseAndNavigate(url));
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const checkVersion = async () => {
        try {
          const config = await getAppVersionConfig();
          if (!config) return;

          const installedVersion = DeviceInfo.getVersion();
          const targetVersion =
            Platform.OS === 'ios'
              ? config.iosCurrentVersion
              : config.androidCurrentVersion;

          if (
            config.showPopup &&
            targetVersion &&
            compareVersions(installedVersion, targetVersion) < 0
          ) {
            setUpdateConfig(config);
            setShowUpdateModal(true);
          }
        } catch (error) {
          console.log('Error checking app update:', error);
        }
      };

      checkVersion();
    }
  }, [showSplash]);

  const handleUpdatePress = async () => {
    if (!updateConfig) return;
    const url =
      Platform.OS === 'ios'
        ? updateConfig.appStoreUrl
        : updateConfig.playStoreUrl;

    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          await Linking.openURL(url);
        }
      } catch (err) {
        console.log('Error opening store URL:', err);
      }
    }
  };

  const handleLaterPress = () => {
    setShowUpdateModal(false);
  };

  return (
    <>
      {Platform.OS === 'ios' && <IOSStallionUpdater />}
      {showSplash ? (
        <Video
          source={{uri: "https://duixj37yn5405.cloudfront.net/videos/fracspace_.mp4"}}
          style={styles.video}
          // resizeMode="cover"
          hideShutterView
          muted
          onError={(e) => console.log('Video error:', e)}
        />
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <AppProvider>
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={() => {
                  routeNameRef.current = navigationRef.getCurrentRoute()?.name;
                }}
                onStateChange={async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRouteName = navigationRef.getCurrentRoute()?.name;
                  if (currentRouteName && previousRouteName !== currentRouteName) {
                    try {
                      await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                      });
                    } catch (e) {
                      console.log('Screen view analytics error:', e);
                    }
                  }
                  routeNameRef.current = currentRouteName;
                }}
              >
                <NavigationStack />
              </NavigationContainer>
              {!isConnected && (
                <View style={styles.offlineOverlay}>
                  <NoInternet onRetry={checkConnection} />
                </View>
              )}
            </AppProvider>
          </Provider>
        </GestureHandlerRootView>
      )}
      <Toast />
      <UpdatePopup
        visible={showUpdateModal}
        title={updateConfig?.title}
        message={updateConfig?.message}
        forceUpdate={updateConfig?.forceUpdate}
        onLater={handleLaterPress}
        onUpdate={handleUpdatePress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    width,
    height,
  },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
});

// iOS: Stallion. Android: CodePush HOC (checks on app start, installs immediately).
let RootApp = App;
if (Platform.OS === 'ios') {
  RootApp = Stallion.withStallion(App);
} else if (!__DEV__) {
  RootApp = codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.IMMEDIATE,
  })(App);
}

export default RootApp;