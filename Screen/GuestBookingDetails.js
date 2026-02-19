import { View, Text,ScrollView,Image ,Alert} from 'react-native'
import React, { useState ,useEffect} from 'react';
import Back from './Back';
import { RentalData } from './Services/UserApi';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function GuestBookingDetails(props) {
  const [GestArray,setGestArray]=useState([]);
 // console.log(props?.route?.params?.propertyid);
  const handleGuestUpdate = async () => {
    //console.log(props?.route?.params?.propertyid);
    let payload = JSON.stringify({
      propertyId: props?.route?.params?.propertyid,
    });
    try {
      let {data: res} = await RentalData(payload);
   
      if (res?.success) {
        setGestArray(res?.data);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {
    handleGuestUpdate();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
    <Back title={"Guest Booking Details"}/>
    <ScrollView style={{width:'100%',backgroundColor: '#ffff',padding:20}}>
     {GestArray.length==0?
     <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%'}}>
     <Text style={{color:'#043862',fontSize:18,fontFamily:"Poppins-SemiBold",textAlign:'center',}}>Anticipating Reservations Shortly</Text>
     </View>
     :<>
    {GestArray.map((item, index) => (
    <View  key={index} style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#B9C4CA',paddingBottom:5,marginBottom:20,paddingTop:3,}}>
      <Image
          source={require('./assets/NewProfileimage.jpg')}
          style={{width: 50, height: 50, marginRight: 5,borderRadius:50}}
        />
        <View style={{paddingLeft:5,width:'100%',flex:1}}>
         <View style={{flexDirection:'row',justifyContent:'space-between'}}>  
         <Text style={{fontSize: 16,   fontFamily:'OpenSans-SemiBold', color: 'black'}}>
          {item?.guestName}
        </Text>
        <Text style={{fontSize: 14,   fontFamily:'Poppins-Regular', color: '#008000',paddingTop:5}}>
        {'\u20B9'}{item?.rentalAmount}
        </Text>
        </View> 
        <Text style={{fontSize: 14,   fontFamily:'OpenSans-SemiBold', color: 'gray'}}>
          {item?.checkInDate} - {item?.checkOutDate}
        </Text>
        </View>
      </View>))}
      </>}

      

      

    
      
    </ScrollView>
    </SafeAreaView>
  )
}