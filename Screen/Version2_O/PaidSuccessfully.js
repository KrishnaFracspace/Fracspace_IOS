import { View, Text,  Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaidSuccessfully(props) {
    const [tranDetail, setTranDetail] = useState(props?.route?.params?.tranDetail);
    const [email, setEmail] = useState(props?.route?.params?.email); 
 

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const withdrawDate = new Date(tranDetail?.initiatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })

    const creditedDate = new Date(tranDetail?.completedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })

  return (
    <SafeAreaView style={{flex:1}}>
        <ScrollView>
            <LinearGradient colors={['#C7E5FD','#FFFFFF']} style={{paddingBottom:70}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20}}>
                    <TouchableOpacity onPress={() => {
                       // navigation.navigate('WalletAmount', { email: email });
                       navigation.goBack();
                    }}>
                        <Icon name={'chevron-left'} size={23} color={'#000000'}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Montserrat-Bold',fontSize:18,color:'#000000'}}>Paid Successfully</Text>
                    <View></View>
                </View>

                <View style={{backgroundColor:'#FFFFFF',borderColor:'#62626233',borderWidth:1,padding:20,borderRadius:18,margin:20}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:24,color:'#000000'}}>₹{tranDetail?.amount}</Text>
                            {/* <Image source={require('./assets/Check.png')} style={{width:30,height:30,marginLeft:5}}/> */}
                        </View>
                    </View>
                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000000',marginBottom:5}}>Status: Withdrawed on {withdrawDate}</Text>
                    {/* <View style={{borderColor:'#62626233',borderWidth:0.6,backgroundColor:'#3742FA33',borderRadius:15,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',paddingRight:10}}>
                        <Icon name={'dot-single'} size={20} color={'#11BA0D'}/>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:10,color:'#000000'}}>Quarter 01, 2025</Text>
                    </View> */}

                    <View style={{borderTopColor:'#6262621A',borderTopWidth:1,marginVertical:15}}></View>

                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000000'}}>Payment Details</Text>

                    <View style={{flexDirection:'row',marginHorizontal:10,}}>
                        <View style={{borderLeftWidth:1,borderLeftColor:'#0E9625',marginVertical:20}}>
                            
                        </View>
                        <View style={{backgroundColor:'#FFFFFF',borderRadius:10,marginTop:10,flex:1,marginLeft:10}}>
                            <View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {tranDetail?.status === 'success' ?
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#0E9625',alignItems:'center',justifyContent:'center',marginLeft:-20}}>
                                            <Ico name={'check'} size={15} color={'#FFFFFF'}/>
                                        </View>
                                        :
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#FFFFFF',borderWidth:0.5,alignItems:'center',justifyContent:'center',marginLeft:-20}}>

                                        </View>
                                    }
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000000'}}>Payment Initiated</Text>
                                        <Text style={{fontFamily:'Montserrat-Regular',fontSize:12,color:'#000000'}}>Initiated on {withdrawDate}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{borderTopColor:'#E2E2E2',borderTopWidth:1,marginVertical:10}}></View>

                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {/* {tranDetail?.stage === 'processing' ?
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#0E9625',alignItems:'center',justifyContent:'center',marginLeft:-20}}>
                                            <Ico name={'check'} size={15} color={'#FFFFFF'}/>
                                        </View>
                                        :
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#FFFFFF',borderWidth:0.5,alignItems:'center',justifyContent:'center',marginLeft:-20}}>
                                           
                                        </View>
                                    } */}
                                    {tranDetail?.credited === true ||
                                        tranDetail?.stage === 'completed' ||
                                        tranDetail?.status === 'success' ? (
                                            
                                            <View style={{
                                                width:20,height:20,borderRadius:20,
                                                backgroundColor:'#0E9625',
                                                alignItems:'center',justifyContent:'center',
                                                marginLeft:-20
                                            }}>
                                                <Ico name={'check'} size={15} color={'#FFFFFF'}/>
                                            </View>

                                        ) : (
                                            <View style={{
                                                width:20,height:20,borderRadius:20,
                                                backgroundColor:'#FFFFFF',borderWidth:0.5,
                                                alignItems:'center',justifyContent:'center',
                                                marginLeft:-20
                                            }}/>
                                        )}




                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000000'}}>Processing Payment</Text>
                                        <Text style={{fontFamily:'Montserrat-Regular',fontSize:12,color:'#000000'}}>Bank transfer initiated, awaiting confirmation</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{borderTopColor:'#E2E2E2',borderTopWidth:1,marginVertical:10}}></View>

                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {tranDetail?.credited === true ?
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#0E9625',alignItems:'center',justifyContent:'center',marginLeft:-20}}>
                                            <Ico name={'check'} size={15} color={'#FFFFFF'}/>
                                        </View>
                                        :
                                        <View style={{width:20,height:20,borderRadius:20,backgroundColor:'#FFFFFF',borderWidth:0.5,alignItems:'center',justifyContent:'center',marginLeft:-20}}>
                                            {/* <Ico name={'x'} size={15} color={'#FFFFFF'}/> */}
                                        </View>
                                    }
                                    <View style={{marginLeft:20}}>
                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000000'}}>Amount Withdrawn</Text>
                                        {tranDetail?.credited === true ?
                                            <Text style={{fontFamily:'Montserrat-Regular',fontSize:12,color:'#000000'}}>Successfully transferred on {creditedDate}</Text>
                                            :
                                            <Text style={{fontFamily:'Montserrat-Regular',fontSize:12,color:'#000000'}}>Processing...</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{borderTopColor:'#F6F6F6',borderTopWidth:1,marginVertical:15}}></View>

                    <View>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#1A1A1A'}}>Need Help?</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000000CC'}}>For any payment-related issues, please contact your sales representative.</Text>
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',marginTop:15}}>
                        <View style={{paddingHorizontal:5,paddingBottom:5,borderColor:'#DCDCDC',borderWidth:1,borderRadius:10}}>
                            <Image resizeMode='contain' source={require('../assets/logo_FS.png')} style={{width:65,height:65}}/>
                        </View>
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000000'}}>Name : Adhvik</Text> */}
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000000'}}>support@fracspace.com</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#101010'}}>+919880626111</Text>
                        </View>
                    </View>
                    {/* <View style={{borderColor:'#021265',borderWidth:1,borderRadius:8,paddingHorizontal:15,paddingVertical:10,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',marginTop:15}}>
                        <Ico name={'phone'} size={15} color={'#021265'}/>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:11,color:'#021265',marginLeft:5}}>Contact Support Person</Text>
                    </View> */}
                </View>
            </LinearGradient>
        </ScrollView>
    </SafeAreaView>
  )
}