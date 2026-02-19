import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import PropertyDetails from './PropertyDetails';
// import Transfer from './Transfer';
// import MonthlyInsight from './MonthlyInsight';
// import CumulativeEarning from './CumulativeEarning';
// import DetailedReport from './DetailedReport';
// import CompStays from './CompStays';
// import ExitRequest from './ExitRequest';
import Owned from '../Owned';
import Dashboard from '../Dashboard';
import MonthlyInsight from '../Version2_O/MonthlyInsight';
import Transfer from '../Version2_O/Transfer';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator initialRouteName='Owned' screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name='Dashboard' component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name='PropertyDetails' component={PropertyDetails} options={{headerShown:false}} />
        <Stack.Screen name='ExitRequest' component={ExitRequest} options={{headerShown:false}} />
        <Stack.Screen name='MonthlyInsight' component={MonthlyInsight} options={{headerShown:false}} />
        <Stack.Screen name='Transfer' component={Transfer} options={{headerShown:false}} />
        <Stack.Screen name='CumulativeEarning' component={CumulativeEarning} options={{headerShown:false}} />
        <Stack.Screen name='DetailedReport' component={DetailedReport} options={{headerShown:false}} />
        <Stack.Screen name='CompStays' component={CompStays} options={{headerShown:false}} /> */}

        <Stack.Screen name="Owned" component={Owned} options={{headerShown: false}}/>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
        <Stack.Screen name="MonthlyInsight" component={MonthlyInsight} options={{headerShown: false}}/>
        <Stack.Screen name="Transfer" component={Transfer} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}