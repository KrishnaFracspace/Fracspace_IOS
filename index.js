/**
 * @format
 */

// 1. Reanimated MUST be imported first (very important)
import 'react-native-reanimated';

// 2. Firebase modules
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
//import crashlytics from '@react-native-firebase/crashlytics';

import App from './App';
import { name as appName } from './app.json';

// Background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

// Enable Crashlytics (only in production or controlled)
//crashlytics().setCrashlyticsCollectionEnabled(__DEV__ === false);

// Register the app
AppRegistry.registerComponent(appName, () => App)