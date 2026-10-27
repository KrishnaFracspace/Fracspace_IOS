import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import VerificationOrWallet from './VerificationOrWallet';
import ProfileStack from './ProfileStack';
import BottomNavi from './BottomNavi';
import DashboardStack from './DashboardStack';
import SpecialSectionStack from './SpecialSectionStack';

const Tab = createBottomTabNavigator();

export default function BottomNavigations() {
    // const bottomTabRef = useBottomTabRef();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavi {...props} />}
    >
      {/* <Tab.Screen  name="CoOwnStack" component={CoOwnStack} /> */}
      <Tab.Screen  name="HomeStack" component={HomeStack} />
      <Tab.Screen  name="VerificationOrWallet" component={VerificationOrWallet} />
      {/* Centre tab: Special Section (Stays · Shop · Concerts) */}
      <Tab.Screen name="SpecialSectionStack" component={SpecialSectionStack} />
      <Tab.Screen name="DashboardStack" component={DashboardStack} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
}