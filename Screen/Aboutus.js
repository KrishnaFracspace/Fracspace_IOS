import { View, Text,ScrollView } from 'react-native';
import React from 'react';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Aboutus() {
  return (
<SafeAreaView style={{ flex: 1 }}>
  <Back title={"About Us"}/>
    <ScrollView style={{width:'100%',backgroundColor:'#FFFFFF',padding:10}}>
      <Text style={{color: '#043862',fontSize:18,fontFamily:'OpenSans-Bold',textAlign: 'center'}}>About Us</Text>
      <Text style={{color:'#1E2135',fontSize:13,fontFamily:'Poppins-Regular',paddingHorizontal:10,marginVertical:20}}>Fracspace is thrilled to announce the successful launch of our inaugural phase on the Google Play Store! As a pioneering fractional ownership,Rental,Holiday Home & Hotels company with a robust global presence, Fracspace takes immense pride in offering a diverse portfolio of properties spanning the globe. From luxurious villas nestled in exotic destinations to cozy retreats in bustling cities, Fracspace ensures that every stay is an unforgettable shared adventure</Text>
      <Text style={{color:'#1E2135',fontSize:13,fontFamily:'Poppins-Regular',paddingHorizontal:10}}>Our user-friendly app has been meticulously crafted to provide our esteemed customers with a seamless and immersive experience. With Fracspace, exploring our exquisite collection of properties has never been easier. Customers can effortlessly browse through our portfolio, save their preferred properties to their wish list, and seamlessly book their dream accommodations with secure payment options at their fingertips.</Text>
      <Text style={{color:'#1E2135',fontSize:13,fontFamily:'Poppins-Regular',paddingHorizontal:10,marginVertical:20}}>At Fracspace, we believe in redefining the way people experience travel and leisure. Through our innovative platform, we strive to empower individuals to embark on extraordinary journeys, create lasting memories, and forge meaningful connections with the world around them.</Text>
      <Text style={{color:'#1E2135',fontSize:13,fontFamily:'Poppins-Regular',paddingHorizontal:10}}>Join us as we embark on this exhilarating journey together. Welcome to Fracspace – where every stay is a shared adventure!</Text>
    </ScrollView>
    </SafeAreaView>
  )
}
