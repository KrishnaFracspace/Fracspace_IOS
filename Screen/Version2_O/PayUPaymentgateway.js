import { View, Text, Alert, Dimensions,TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { PayUPaymentVerify } from '../Services/UserApi';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PayUPaymentgateway(props) {
 
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);


  const HandlePayUPaymentVerify = async () => {
    let payload = JSON.stringify({
       txnID:TxnID
    });
  
    try {
        let { data: res } = await PayUPaymentVerify(payload);
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

      HandlePayUPaymentVerify();
   

      navigation.navigate('StayCancel');
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      HandlePayUPaymentVerify();
      navigation.navigate('StayBookingConfirm');   
    }
    
    setPageUrl(state.url);
  };

  const handlePageLoad = () => {
    // This is called when the page has finished loading
    setLoading(false);
  };
  
  return (
    // <View>
    <SafeAreaView style={{flex:1}}>
     <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 15,
          paddingTop: height * 0.06,
          width: '100%',
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 2,
          backgroundColor: '#0197B2',
          //elevation: 1,
          borderBottomColor: '#DDE1E5',
        }}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            navigation.navigate('StayBookNow');
          }}>
          <Icon name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'WorkSans-SemiBold',
              color: '#FFFFFF',
            }}>
            
          </Text>
        </View>
        {/* <TouchableOpacity style={{ flex: 1 }}
                                onPress={() => {
        
                                    navigation.navigate('HomePage');
        
                                }}>
                                <Text style={{
                                    fontSize: 15,
                                    fontFamily: 'WorkSans-SemiBold',
                                    color: '#0424CB',
                                    textAlign: 'right'
                                }}>EXIT</Text>
                            </TouchableOpacity> */}
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            navigation.navigate('HomePage');
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'WorkSans-SemiBold',
              color: '#FFFFFF',
              textAlign: 'right',
            }}>
            EXIT
          </Text>
        </TouchableOpacity>
      </View>
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
  </SafeAreaView>
    // </View>
  )
}