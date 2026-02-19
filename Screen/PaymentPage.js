import { View, Text, Alert, Dimensions } from 'react-native';
import React, { useContext, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Back from './Back';
import { CoOwnerBookingverification } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentPage(props) {
  //console.log(props?.route?.params?.property);
    const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  const [Property,setProperty]=useState(props?.route?.params?.property);

  const HandlePayUPaymentVerify = async (status) => {
    let payload = JSON.stringify({
    propertyName: Property?.propertyName,
    propertyId: Property?.propertyId,
    email: Property?.email,
    fractionValue: Property?.FC_Price,
    numberOfFractions: Property?.numberOfFractions,
    totalBookingAmount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
    Price: Property?.Price,
    FC_Price: Property?.FC_Price,
    termsAndConditions:Property?.termsAndConditions,
    payUpayment: [
        {
            txnId: TxnID,
            amount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
            username: Property?.email,
            status: status,
            mihpayid: "MHP12345"
        }
    ],
    bookingStatus: status,
    statusKey: "BOOK123"
    });
  
    try {
        let { data: res } = await CoOwnerBookingverification(payload);
       // console.log('fghj',res);
        if (res?.success) {
       

        }
    } catch (error) {
        if (error?.response) {
            // console.log('Response Error', error?.response?.data);
            Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
        } else if (error?.request) {
            // console.log('Request error:', ${JSON.stringify(error?.request)});
            Alert.alert('Request Error:', 'Please Check Your Internet Connection');
            // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
        } else {
            //  console.log('error');
            Alert.alert('Error:', `${error}`);
        }
    }
};


 

  const handleNavigationStateChange = (state) => {
    // Track the URL when the page changes
   // console.log(state.url);
    if(state.url=='https://test.bunknbeyond.com/paymentfailure'){
      let data='Failed'
      HandlePayUPaymentVerify(data);
      Alert.alert(
        'Booking Failed!',"Oops! Your payment has been failed. Any refund amount detucted will be credited to the source account within 5-6 Working days",
      );
      navigation.navigate('Home',{details:globalState?.ProDetails});
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      let data='Success'
      HandlePayUPaymentVerify(data);
      Alert.alert(
        'Booking Completed!',"Our team is currently reviewing your booking status. Please allow us upto 24 hours to confirm your fraction booking status.",
      );
    
      navigation.navigate('Home',{details:globalState?.ProDetails});   
    }
    
    setPageUrl(state.url);
  };

  const handlePageLoad = () => {
    // This is called when the page has finished loading
    setLoading(false);
  };
  
  return (
   <SafeAreaView style={{flex: 1,}}>
      {/* <Back title={""}/> */}
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
    </SafeAreaView>
  )
}