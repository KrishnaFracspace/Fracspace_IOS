import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingHistory from '../BookingHistory';
import WalletAmount from '../Version2_O/WalletAmount';
import SiteHistory from '../SiteHistory';
import Profile from '../Profile';
// import ProfileScreen from './ProfileScreen';
// import SiteVisitHis from './SiteVisitHis';
// import PurchaseHistory from './PurchaseHistory';
// import HelpSupport from './HelpSupport';
// import ZeroValueWallet from './ZeroValueWallet';
// import WalletAmount from './WalletAmount';
// import PaidSuccessfully from './PaidSuccessfully';
// import UploadDocuments from './UploadDocuments';
// import CoinHistory from './CoinHisorty';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SiteVisitHis" component={SiteVisitHis} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="ZeroValueWallet" component={ZeroValueWallet} />
        <Stack.Screen name="WalletAmount" component={WalletAmount} />
        <Stack.Screen name="PaidSuccessfully" component={PaidSuccessfully} />
        <Stack.Screen name='UploadDocuments' component={UploadDocuments} />
        <Stack.Screen name='CoinHistory' component={CoinHistory}/> */}

        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name="BookingHistory" component={BookingHistory} options={{headerShown: false}}/>
        <Stack.Screen name="WalletAmount" component={WalletAmount} options={{headerShown: false}}/>
        <Stack.Screen name="SiteHistory" component={SiteHistory} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}