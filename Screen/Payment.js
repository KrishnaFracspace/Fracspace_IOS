import { View, Text, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Back from './Back';
import { CoOwnerBookingverification } from './Services/UserApi';
const {width, height} = Dimensions.get('window');
export default function Payment(props) {
  //console.log(props?.route?.params?.property);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (state) => {
    // Track the URL when the page changes
   // console.log(state.url);
    if(state.url=='https://test.bunknbeyond.com/paymentfailure'){
     
      let data='Failed'
   
      Alert.alert(
        'Booking Failed!',"Oops! Your payment has been failed. Any refund amount detucted will be credited to the source account within 5-6 Working days",
      );
      navigation.navigate('Home');
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      let data='Success'
    
      Alert.alert(
        'Booking Completed!',"Our team is currently reviewing your booking status. Please allow us upto 24 hours to confirm your fraction booking status.",
      );
    
      navigation.navigate('Home');   
    }
    
   
  };

  const handlePageLoad = () => {
    // This is called when the page has finished loading
    setLoading(false);
  };
  
  return (
    <>
      <Back title={""}/>
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
    </>
  )
}