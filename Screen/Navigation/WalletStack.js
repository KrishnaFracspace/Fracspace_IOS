import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import WalletAmount from './WalletAmount';
// import PaidSuccessfully from './PaidSuccessfully';
import WalletAmount from '../Version2_O/WalletAmount';
import PaidSuccessfully from '../Version2_O/PaidSuccessfully';


const Stack = createNativeStackNavigator();

export default function WalletStack() {
  return (
    <Stack.Navigator initialRouteName='WalletAmount' screenOptions={{headerShown: false}}>
      <Stack.Screen name="WalletAmount" component={WalletAmount} />
      <Stack.Screen name="PaidSuccessfully" component={PaidSuccessfully} />
    </Stack.Navigator>
  );
}