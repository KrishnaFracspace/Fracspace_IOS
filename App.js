import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Linking, Alert, AppState } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import Video from 'react-native-video';
import appsFlyer from 'react-native-appsflyer';
import NavigationStack from './Screen/Navigation/NavigationStack';
import { AppProvider } from './Screen/Context/AppContext';
import store from './Screen/redux/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDeepLinkNav } from './Screen/redux/reducer/homeReducer';
import Toast from 'react-native-toast-message';
import { withStallion, useStallionUpdate, restart } from 'react-native-stallion';
import analytics from '@react-native-firebase/analytics';
const { width, height } = Dimensions.get('window');
const navigationRef = createNavigationContainerRef();


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
  const splashVideo = require('./Screen/assets/Demovideo.mp4');
const { isRestartRequired, newReleaseBundle, currentlyRunningBundle } = useStallionUpdate();

  const navigateWithAuthCheck = async (redirectData) => {
    store.dispatch(setDeepLinkNav(true));
    const token = await AsyncStorage.getItem('mytoken');
    if (token) {
      navigationRef.navigate(redirectData.screen, redirectData.params);
    } else {
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
  console.log('=== Stallion Debug ===');
  console.log('isRestartRequired:', isRestartRequired);
  // console.log('newReleaseBundle:', newReleaseBundle);
  console.log('currentlyRunningBundle:', currentlyRunningBundle); 

  if (isRestartRequired) {
    Alert.alert(
      'Update Available',
      newReleaseBundle?.releaseNote || 'A new version of Fracspace is ready.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Restart Now', onPress: restart },
      ]
    );
  }
}, [isRestartRequired, newReleaseBundle]);

// useEffect(() => {
//   console.log('=== Stallion Debug ===');
//   console.log('isRestartRequired:', isRestartRequired);
//   console.log('newReleaseBundle:', newReleaseBundle);
//   console.log('currentlyRunningBundle:', currentlyRunningBundle);

//   if (isRestartRequired) {
//     console.log('OTA update downloaded.');

//     const handleAppStateChange = nextAppState => {
//       if (nextAppState === 'background' || nextAppState === 'inactive') {
//         console.log('Restarting app with new OTA bundle...');
//         restart();
//       }
//     };

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => {
//       subscription.remove();
//     };
//   }
// }, [isRestartRequired]);



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
          Id: data.af_sub2 || data?.af_sub1 || data?.deep_link_sub1 || 'MISSING',
          referralCode: data.af_sub1 || 'MISSING',
        },
      };
    } else if (data.deep_link_value === 'wallet_section') {
      redirectData = { screen: 'WalletAmount', params: {} };
    } else if (data.deep_link_value === 'payment_link') {
      redirectData = { screen: 'Book', params: { Id: data?.deep_link_sub1 || 'MISSING' } };
    } else if (data.deep_link_value === 'escape_section'){
      redirectData = { screen: 'MembershipHome', params: {}};
    } else {
      return;
    }

    const isFirstLaunch = data?.is_first_launch === true || data?.is_first_launch === 'true';
    if (isFirstLaunch || source === 'onInstallConversionData') {
      AsyncStorage.setItem('pendingDeepLink', JSON.stringify(redirectData))
        .catch(err => console.log('Save pending error:', err));
    }
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
  };

  useEffect(() => {
    const deepLinkUnsub = appsFlyer.onDeepLink((res) => {
      if (res?.deepLinkStatus === 'FOUND') tryNavigate(res.data, 'onDeepLink');
    });

    const installUnsub = appsFlyer.onInstallConversionData((res) => {
      tryNavigate(res?.data || {}, 'onInstallConversionData');
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

  return (
    <>
      {showSplash ? (
        <Video
          source={splashVideo}
          style={styles.video}
          resizeMode="cover"
          muted
          onError={(e) => console.log('Video error:', e)}
        />
      ) : (
        <Provider store={store}>
          <AppProvider>
            <NavigationContainer ref={navigationRef} linking={linking}>
              <NavigationStack />
            </NavigationContainer>
          </AppProvider>
        </Provider>
      )}
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    width,
    height,
  },
});

export default withStallion(App);