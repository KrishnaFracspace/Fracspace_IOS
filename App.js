import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions,Linking } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import Video from 'react-native-video';
import appsFlyer from 'react-native-appsflyer';
import NavigationStack from './Screen/Navigation/NavigationStack';
import { AppProvider } from './Screen/Context/AppContext';
import store from './Screen/redux/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDeepLinkNav } from './Screen/redux/reducer/homeReducer';

const { width, height } = Dimensions.get('window');
const navigationRef = createNavigationContainerRef();

// Deep linking configuration
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
 // const dispatch = useDispatch();

  const navigateWithAuthCheck = async(redirectData) => {
        let vasu= store.dispatch(setDeepLinkNav(true));
       //  console.log('======',vasu)
   // console.log('navigateWithAuthCheck →', redirectData);

    const state = store.getState();
       const token = await AsyncStorage.getItem('mytoken');
//console.log(redirectData.params,"redirectData.params")
    if (token) {
    //  console.log('Authenticated → navigate to', redirectData.screen);
      navigationRef.navigate(redirectData.screen, redirectData.params);
    } else {
     // console.log('No token → go to NewLogin with redirect');
      navigationRef.navigate('NewLogin', {
        redirectAfterLogin: redirectData,
      });
      
    }
  };

  // Splash + Firebase permission
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          await messaging().getToken();
        }
      } catch (err) {
        console.log('Firebase permission error:', err);
      }
    };
    requestPermission();

    const timer = setTimeout(() => {
      setShowSplash(false);
     // console.log('Splash hidden → app ready');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Shared redirect logic
    const tryNavigate = (data, source = 'unknown') => {
      console.log(`[${source}] tryNavigate with data:`, data);

      if (!data?.deep_link_value) {
      //  console.log(`[${source}] No deep_link_value`);
        return;
      }

      if (data.deep_link_value === 'property' || 'property_share') {
       // console.log(`[${source}] MATCH – Property deep link`);

        const redirectData = {
          screen: 'Property',
          params: {
            Id: data.af_sub2 || data?.af_sub1 || data?.deep_link_sub1 || 'MISSING',
            referralCode: data.af_sub1||  'MISSING',
          },
        };

        const isFirstLaunch = data.is_first_launch === true || data.is_first_launch === 'true';

        if (isFirstLaunch && source === 'onInstallConversionData') {
      // Save to storage so it survives login/signup
        AsyncStorage.setItem('pendingDeepLink', JSON.stringify(redirectData))
        .then(() => console.log('Saved deferred deep link for after login'))
        .catch(err => console.log('Save pending error:', err));
    }

    // if (navigationRef.isReady()) {
    //   navigateWithAuthCheck(redirectData);
    // } else {
    //   pendingLinkRef.current = redirectData;
    // }

        if (navigationRef.isReady()) {
         // console.log('Direct URL → navigating to Property');
         // console.log(`[${source}] Nav ready – navigating`);
          navigateWithAuthCheck(redirectData);
        } else {
         // console.log(`[${source}] Nav not ready – pending`);
          pendingLinkRef.current = redirectData;
        }
      } else {
        console.log(`[${source}] Not property:`, data.deep_link_value);
      }
    };

    // 1. Unified Deep Linking (UDL) – main for installed app
    const deepLinkUnsub = appsFlyer.onDeepLink((res) => {
    //  console.log('=== onDeepLink ===', JSON.stringify(res, null, 2));
      if (res?.deepLinkStatus === 'FOUND') {
        tryNavigate(res.data, 'onDeepLink');
      }
    });

    // 2. Install Conversion Data – deferred deep links after install
    const installUnsub = appsFlyer.onInstallConversionData((res) => {
    //  console.log('=== onInstallConversionData ===', JSON.stringify(res, null, 2));
      tryNavigate(res?.data || {}, 'onInstallConversionData');
    });

    // 3. App Open Attribution – deep links when app is already open/re-opened
    const attributionUnsub = appsFlyer.onAppOpenAttribution((res) => {
     // console.log('=== onAppOpenAttribution ===', JSON.stringify(res, null, 2));
      tryNavigate(res?.data || {}, 'onAppOpenAttribution');
    });

    // Init SDK
    appsFlyer.initSdk(
      {
        devKey: 'z9iokP3YwU3z6uxEkKgJfn',
        appId: '6498551006',
        isDebug: __DEV__,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
      },
      () => console.log('✅ AppsFlyer init success'),
      (err) => console.log('❌ AppsFlyer init failed:', err)
    );

    // Cleanup
    return () => {
      deepLinkUnsub?.();
      installUnsub?.();
      attributionUnsub?.();
    };
  }, []);

  // Consume pending navigation
  useEffect(() => {
    const unsubscribe = navigationRef.addListener('ready', () => {
    //  console.log('Navigation is READY');
      if (pendingLinkRef.current) {
        //console.log('Consuming pending redirect');
        navigateWithAuthCheck(pendingLinkRef.current);
        pendingLinkRef.current = null;
      }
    });

    return unsubscribe;
  }, []);

  // Optional UID log
  useEffect(() => {
    appsFlyer.getAppsFlyerUID((err, uid) => {
      if (!err) console.log('AppsFlyer UID:', uid);
      //else console.log('UID error:', err);
    });
  }, []);

  // Handle direct URI scheme deep links (fracspace://, fsapp://)
  useEffect(() => {
    const parseAndNavigate = (url) => {
     // console.log('Parsing direct URL:', url);
      // Handle fracspace://property/123/ABC or fsapp://property/123/ABC
      if (url.includes('property/')) {
        const match = url.match(/property\/([^\/]+)\/([^\/\?]+)/);
        if (match) {
          const [, id, referralCode] = match;
          const redirectData = {
            screen: 'Property',
            params: { Id: id, referralCode: referralCode },
          };
          if (navigationRef.isReady()) {
         // console.log('Direct URL → navigating to Property');
            navigateWithAuthCheck(redirectData);
          } else {
            //console.log('Direct URL → pending');
            pendingLinkRef.current = redirectData;
          }
        }
      }
    };

    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
     //   console.log('Initial URI scheme:', url);
        parseAndNavigate(url);
      }
    };
    handleInitialURL();

    const subscription = Linking.addEventListener('url', ({ url }) => {
    //  console.log('Received URI scheme:', url);
      parseAndNavigate(url);
    });

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

export default App;