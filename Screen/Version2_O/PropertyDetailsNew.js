import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking, Alert, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMa from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Context/AppContext';
import { CallRecordBuyAndRent } from '../Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
export default function PropertyDetailsNew(props) {

  const navigation = useNavigation();
  const { globalState, setGlobalState } = useContext(AppContext);
//  console.log(globalState?.userDetails?.phoneNumber);
  
  const [PropertiesArray, setPropertiesArray] = useState(props?.route?.params?.details || []);

  
  const [showFullText, setShowFullText] = useState(false);
  const [PropertyImage, setPropertyImage] = useState(PropertiesArray?.images[0]);
  const handleCallRecord = async (Phone,PropId) => {
    let payload = JSON.stringify({
      sellerPhone: Phone,
  		propertyId: PropId,
 			leadPhoneNumber: globalState?.userDetails?.phoneNumber,
      leadEmail: globalState?.userEmail,
    });
 

    try {
      let { data: res } = await CallRecordBuyAndRent(payload);
      //  console.log(res?.data[0]?.images[0]);
     

      if (res?.success) {
       // handleCallNow();
        handleCallNow(Phone);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      } else {
        Alert.alert('Error:', `${error}`);
      }
    }
  };
  const handleCallNow = (phone) => {
    const phoneNumber = phone;
    const phoneUrl = `tel:${phoneNumber}`;


    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone number is not supported');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };
  
  return (
   <SafeAreaView style={{flex:1}}>
    <ScrollView style={{ color: '#FAFAFF', width: '100%' }}>
           <View style={{ flex: 1 }}>
                    <Image
                        style={{
                            // width: 400,
                            //height: 300,
                            width: width,
                            height: height * 0.42,
                        }}
                        resizeMode='cover'
                        // source={require('./assets/upcomming.png')}
                        source={{ uri: PropertyImage }}
                    />
                    <View style={{
                flexDirection: 'row',
                position:'absolute',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                width: '100%',
                paddingHorizontal: 15,
              //  borderBottomWidth: 1,
                //shadowColor: '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.8,
                // shadowRadius: 2,
                // elevation: 1,
              //  borderBottomColor: '#DDE1E5'
            }}>
                <TouchableOpacity style={{ flex: 1 ,paddingTop: height * 0.05,}}
                    onPress={() => {
                        navigation.navigate('PropertyListing');

                    }}>
                    <IconC name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                {/* <Text style={{
                    fontSize: 18,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#000000',
                }}>
                    {PropertiesArray?.name}
                </Text> */}
                <TouchableOpacity style={{ flex: 1 ,paddingTop: height * 0.05,}}
                    onPress={() => {
                        navigation.navigate('HomePage');

                    }}>
                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'WorkSans-SemiBold',
                        color: '#0424CB',
                        textAlign: 'right'
                    }}>EXIT</Text>
                </TouchableOpacity>
            </View>









                    <View
                        style={{
                            width: '90%',
                            height: height * 0.10,
                            borderRadius: 10,
                            position: 'absolute',
                            // justifyContent: 'flex-end',
                            flex: 1,
                            alignItems: 'center',
                            backgroundColor: '#C5C5C5',
                            //paddingLeft:10,
                            marginTop: height * 0.31,
                            marginHorizontal: 20,
                            flexDirection: 'row',
                            padding: 10,
                            opacity: 0.9,
                            //marginLeft: '8%',
                        }}>
                        <TouchableOpacity onPress={() => {
                            setPropertyImage(PropertiesArray?.images[1]);
                        }}>
                            <Image
                                style={{
                                    // width: 150,
                                    width: width * 0.20,
                                    height: height * 0.08,
                                    borderRadius: 5,
                                    marginRight: 6
                                }}
                                source={{ uri: PropertiesArray?.images[1] }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setPropertyImage(PropertiesArray?.images[2]);
                        }}>
                            <Image
                                style={{
                                    // width: 150,
                                    width: width * 0.20,
                                    height: height * 0.08,
                                    borderRadius: 5,
                                    marginRight: 6
                                }}
                                source={{ uri: PropertiesArray?.images[2] }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setPropertyImage(PropertiesArray?.images[3]);
                        }}>
                            <Image
                                style={{
                                    // width: 150,
                                    width: width * 0.20,
                                    height: height * 0.08,
                                    borderRadius: 5,
                                    marginRight: 6
                                }}
                                source={{ uri: PropertiesArray?.images[3] }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            //   style={{ paddingBottom: 30, backgroundColor: 'white' }}
                            onPress={() => {
                                setPropertyImage(PropertiesArray?.images[0]);
                            }}>
                            <Image
                                style={{
                                    // width: 150,
                                    width: width * 0.20,
                                    height: height * 0.08,
                                    borderRadius: 5,
                                    marginRight: 6
                                }}
                                source={{ uri: PropertiesArray?.images[0] }}
                            />
                            {/* <View style={{ width: width * 0.20, height: height * 0.08, position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'WorkSans-SemiBold', }}>+3</Text>
                        </View> */}
                        </TouchableOpacity>
                    </View>
                </View>
      <View
        style={{
          // paddingHorizontal: 20,
          ///  backgroundColor: 'white',
          //paddingVertical: 10,
          //  marginVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
           //alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 15,
            flex: 1,
            width: '100%'
          }}>
          <View style={{ flex: 1,}} >
           {PropertiesArray?.propertyName==''?<Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                //letterSpacing:0.5
              }}>
             New Property
            </Text> :<Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                //letterSpacing:0.5
              }}>
              {PropertiesArray?.propertyName}
            </Text>}
          </View>
          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                //letterSpacing:0.5
              }}>
              {'\u20B9'}{PropertiesArray?.price}
            </Text>
          </View>
        </View>
    
          <View
              style={{  paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'flex-start', flex: 1, width: '100%', alignItems: 'center' }}>
              {/* <Image
            style={[styles.iconLayout1, {marginLeft: 10}]}
            resizeMode="cover"
            source={require('./assets/place.png')}
          /> */}
              <Icon name="location-sharp" size={20} color="#043862" />
              <Text
                style={{
                  fontSize: 14,
                  // fontWeight: 700,
                  color: '#4A4949',
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                {PropertiesArray?.locationDetails?.place},{PropertiesArray?.location},{PropertiesArray?.locationDetails?.postalCode}
              </Text>
            </View>
      </View>
      {PropertiesArray?.description!='' &&<View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          // backgroundColor: 'white',
          //marginVertical:10
        }}>
        <Text
          style={{
            fontSize: 16,
            // color: '#1E2135',
            fontFamily: 'Montserrat-Medium',
            //letterSpacing: 0.2,
            color: '#000000',
            // paddingVertical:8
           marginVertical:10,
            paddingBottom: 5,
          }}>
          Property Description
        </Text>

        <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-Regular',
              color: '#1E2135',
              letterSpacing: 0.3,
              // paddingBottom: 5,
            }}>
            {showFullText
              ? PropertiesArray?.description
              : PropertiesArray?.description.slice(0, 160)}
          </Text>
        <TouchableOpacity
          onPress={() => {
            setShowFullText(!showFullText);
          }}>
          <Text
            style={{
              fontSize: 14,
              // fontWeight: 600,
              fontFamily: 'OpenSans-SemiBold',
              letterSpacing: 0.3,
              // fontFamily: 'Montserrat-SemiBold',
              color: '#043862',
              // paddingBottom: 5,
            }}>
            {showFullText ? 'Read less' : 'Read more...'}
          </Text>
        </TouchableOpacity>
      </View>}

      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 5, alignItems: 'center' }}
          onPress={() => {


          }}>
          <Text style={{
            fontSize: 14,
            // color: '#1E2135',
            fontFamily: 'Montserrat-Medium',
            //letterSpacing: 0.2,
            color: '#000000',
            // paddingVertical:8
            paddingBottom: 5,
          }}>Amenities</Text>
          {/* <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#081F62', }}>
            <Text style={styles.viewTypo11}>VIEW ALL</Text>
          </View> */}
        </TouchableOpacity>
       <ScrollView horizontal={true}>
        <View style={{flexDirection:'row'}}>
        {PropertiesArray?.amenities.includes('Wifi') &&<View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <Icon name={'wifi'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Wifi</Text>
        </View>}
        {PropertiesArray?.amenities.includes('CCTV') && <View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <IconM name={'cctv'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>CCTV</Text>
        </View>}
        {PropertiesArray?.amenities.includes('Spa') && <View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <IconM name={'spa'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Spa</Text>
        </View>}
        {PropertiesArray?.amenities.includes('Clubhouse') && <View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <IconM name={'hoop-house'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Clubhouse</Text>
        </View>}
        {PropertiesArray?.amenities.includes('Pool') && <View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <IconM name={'pool'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Pool</Text>
        </View>}
        {PropertiesArray?.amenities.includes('Fitness Center') && <View style={{marginRight:20,borderRadius:20,borderColor:'#DCDCDC',borderWidth:1,alignItems:'center',padding:20,alignItems:'center',justifyContent:'center'}}> 
          <IconMa name={'fitness-center'} size={22} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Fitness Center</Text>
        </View>}
        </View>
        </ScrollView>
      </View>

      <View
        style={{
          // backgroundColor: 'white',
          marginVertical: 20,
        }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 10,
            //flexDirection: 'row',
            // justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 14,
              // color: '#1E2135',
              fontFamily: 'Montserrat-Medium',
              //letterSpacing: 0.2,
              color: '#000000',
              paddingBottom: 15,
            }}>
            Property Details
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            marginHorizontal: 20,
            borderColor: '#DADADA',
            //padding: 10,
            borderRadius: 15,
            marginBottom: 10,
            // backgroundColor: 'white',
            padding: 10,
          }}>
              <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#DADADA',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Property For
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.listingType} {"  "}

            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Property Type
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.propertyType} {"  "}

            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Property kind
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.propertyCategory} {"  "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Listed By
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.postedBy} {"  "}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              Area Details
            </Text>
          </View>
          {PropertiesArray?.builtUpArea!='' &&<View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              Total Area
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              {PropertiesArray?.totalArea}
            </Text>
          </View>}
          {PropertiesArray?.builtUpArea!='' &&<View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              Builtup Area
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              {PropertiesArray?.builtUpArea}
            </Text>
          </View>}
         {PropertiesArray?.plotArea!=''&& <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,

                color: '#000000'
              }}>
              Plot Area
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              {PropertiesArray?.plotArea}
            </Text>
          </View>}
          {PropertiesArray?.carpetArea!=''&& <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              //paddingVertical: 5,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              Carpet Area
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000'
              }}>
              {PropertiesArray?.carpetArea}
            </Text>
          </View>}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderTopColor: '#DADADA',
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Property Status
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.availableStatus} {"  "}
            </Text>
          </View>
         {PropertiesArray?.propertyAge!=''&& <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              // borderTopWidth:1,
              // borderTopColor:'#DADADA',
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Age of Property
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.propertyAge}
            </Text>
          </View>}
       

         {PropertiesArray?.floordetails?.floorNumber!=0 &&
         <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              // borderTopWidth:1,
              // borderTopColor:'#DADADA',
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Floor
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.floordetails?.floorNumber}/{PropertiesArray?.floordetails?.totalFloors}
            </Text>
          </View>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              // borderTopWidth:1,
              // borderTopColor:'#DADADA',
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Furnishing
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.furnishingDetails}
            </Text>
          </View>
         { PropertiesArray?.parkingDetails!='' && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              // borderTopWidth:1,
              // borderTopColor:'#DADADA',
              borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              Parking
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.parkingDetails}
            </Text>
          </View>}
         {PropertiesArray?.availableFrom!='' && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
             // borderBottomWidth: 1,
              // borderTopWidth:1,
              // borderTopColor:'#DADADA',
             // borderBottomColor: '#DADADA',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                // color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
            Available from
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                //letterSpacing: 0.2,
                color: '#000000',

              }}>
              {PropertiesArray?.availableFrom}
            </Text>
          </View>}


        </View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
      <Text
          style={{
            fontSize: 14,
            // color: '#1E2135',
            fontFamily: 'Montserrat-Medium',
            //letterSpacing: 0.2,
            color: '#000000',
            // paddingVertical:8
            paddingBottom: 5,
          }}>
          Available Features
        </Text>
        <View style={{flexDirection:'row',paddingVertical:20}}>
        {PropertiesArray?.features?.bedrooms!=0 &&<View style={{marginRight:30,borderRadius:20,alignItems:'center',padding:0,alignItems:'center',justifyContent:'center'}}> 
          <Icon name={'bed'} size={45} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>Bedroom {PropertiesArray?.features?.bedrooms}</Text>
        </View>}
        {PropertiesArray?.features?.bathrooms!=0 &&<View style={{borderRadius:20,alignItems:'center',padding:0,alignItems:'center',justifyContent:'center'}}> 
          <IconF name={'bathtub'} size={45} color={'#101010'}/>
          <Text style={{color:'#101010',fontFamily:'Montserrat-Medium',fontSize:10}}>bathrooms {PropertiesArray?.features?.bathrooms}</Text>
        </View>}
        </View>
        </View>
      <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => {
              handleCallRecord(PropertiesArray?.sellerPhone,PropertiesArray?._id);
             // handleCallNow(PropertiesArray?.sellerPhone);
            }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              //  backgroundColor: '#56018A',
              padding: 20,
              borderColor: '#021265',
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              //marginBottom:50,
         
            }}>
            <Icon name="call" size={20} color="#021265" />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-Bold", color: '#021265' }}>
              {'  '}Enquire Now
            </Text>
          </TouchableOpacity>
        </View>
    


    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  viewTypo11: {
    color: "#081F62",
    fontFamily: 'Montserrat-Medium',
    textAlign: "center",
    letterSpacing: 0,
    fontSize: 12,

  },
});