import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions, Linking, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMa from 'react-native-vector-icons/MaterialIcons';
import { CallRecord, PaymentUPI } from '../Services/UserApi';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Context/AppContext';
import Back from '../Back';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PopularDestination(props) {
    const navigation = useNavigation();
    const { globalState, setGlobalState } = useContext(AppContext);

    const [PropertiesArray, setPropertiesArray] = useState(props?.route?.params?.details || []);
    const[PropertyImage,setPropertyImage]=useState(PropertiesArray?.images[0]);
    const [showFullText, setShowFullText] = useState(false);
    //console.log(props?.route?.params?.details?.name);
    const handleCallRecord = async (property,phone) => {
        let payload = JSON.stringify({
            email: globalState?.userEmail,
            ContactNumberOfFs: phone,
            enquiryAbout: `Popular Destinations ${property}`
        });
  

        try {
            let { data: res } = await CallRecord(payload);
         


            if (res?.success) {
                handleCallNow(phone);
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

    const openApp = async link => {
        // console.log(link);
        const url = link;
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          } else {
            // console.log(link);
            handlewhatsapplink(link);
            //  Alert.alert('Error', "Can't handle URL: " + url);
          }
        } catch (error) {
          handlewhatsapplink(link);
          // Alert.alert('Error', 'An error occurred: ' + error.message);
        }
      };
    
      const handlewhatsapplink = async link => {
        let payload = JSON.stringify({
          message: `Enguire  Via whatsapp ${link}`,
          phoneNumber: globalState?.userDetails?.phoneNumber,
        });
        // console.log(payload);
        try {
          let {data: res} = await PaymentUPI(payload);
          if (res?.success) {
            Alert.alert(
              'Congratulations!',
              'The whatsapp link has been successfully sent to your message section.Kindly Enquire',
            );
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
        // Replace '1234567890' with the phone number you want to call
        const phoneNumber = phone;
        const phoneUrl = `tel:${phoneNumber}`;

        // Use the Linking API to initiate the phone call
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
         <Back title={PropertiesArray?.name} />
        <ScrollView style={{ color: '#FAFAFF', width: '100%' }}>
            <View style={{ flex: 1 }}>
                <Image
                    style={{
                        // width: 400,
                        //height: 300,
                        width: width,
                        height: height * 0.35,
                    }}
                    // source={require('./assets/upcomming.png')}
                    source={{ uri: PropertyImage}}
                />
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
                        marginTop: height * 0.24,
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        padding: 10
                        //marginLeft: '8%',
                    }}>
                   <TouchableOpacity  onPress={() => {
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
            setPropertyImage(PropertiesArray?.images[4]);
          }}>
                        <Image
                            style={{
                                // width: 150,
                                width: width * 0.20,
                                height: height * 0.08,
                                borderRadius: 5,
                                marginRight: 6
                            }}
                            source={{ uri: PropertiesArray?.images[4] }}
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
                        alignItems: 'center',
                        marginVertical: 8,
                        paddingHorizontal: 10,
                        flex: 1,
                        width: '100%'
                    }}>
                    <View style={{ flex: 1}} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15,width:'100%',flex:1 }}>
                           
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontFamily: 'WorkSans-SemiBold',
                                    color: '#000000',
                                    //letterSpacing:0.5
                                }}>

                                {PropertiesArray?.name}
                            </Text>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text
                                    style={{
                                        fontSize: 23,
                                        fontFamily: 'WorkSans-SemiBold',
                                        color: '#000000',

                                        //letterSpacing:0.5
                                    }}>
                                    {'\u20B9'}{PropertiesArray?.price}/
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'WorkSans-Medium',
                                        color: '#2E2E2E',
                                        //letterSpacing:0.5
                                    }}>
                                    N
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                flex: 1,
                                width: '100%',
                                paddingTop: 8,
                            }}>
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
                                    lineHeight: 20,
                                    fontFamily: 'Montserrat-SemiBold',
                                }}>
                                {PropertiesArray?.location?.address},{PropertiesArray?.location?.place}, {PropertiesArray?.location?.city}, {PropertiesArray?.location?.state}
                            </Text>
                        </View>
                    </View>



                </View>



            </View>
            {PropertiesArray?.description != '' && <View
                style={{
                    paddingHorizontal: 18,
                    paddingVertical: 20,
                    // backgroundColor: 'white',
                    //marginVertical:10
                }}>
                <Text
                    style={{
                        fontSize: 16,
                        // color: '#1E2135',
                        fontFamily: 'Montserrat-SemiBold',
                        //letterSpacing: 0.2,
                        color: '#000000',
                        // paddingVertical:8
                        paddingBottom: 10,
                    }}>
                    About
                </Text>

                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: 'WorkSans-Regular',
                        color: '#000000',
                        letterSpacing: 0.3,
                        lineHeight: 18
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
                            fontFamily: 'WorkSans-SemiBold',
                            letterSpacing: 0.3,
                            // fontFamily: 'Montserrat-SemiBold',
                            color: '#043862',
                            // paddingBottom: 5,
                        }}>
                        {showFullText ? 'less' : 'more...'}
                    </Text>
                </TouchableOpacity>
            </View>}

            <View style={{ paddingHorizontal: 18 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 5, alignItems: 'center' }}
                   >
                    <Text style={{
                        fontSize: 16,

                        fontFamily: 'Montserrat-SemiBold',
                        color: '#000000',
                        paddingBottom: 10,
                    }}>Amenities</Text>
                    <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#081F62', }}>
                        {/* <Text style={styles.viewTypo11}>VIEW ALL</Text> */}
                    </View>
                </View>
                <ScrollView horizontal={true}>
                    <View style={{ flexDirection: 'row' }}>
                        {PropertiesArray?.majorAmenities.includes('Free WiFi') &&
                            <View style={{
                                marginRight: 20,
                                borderRadius: 20
                                , borderColor: '#DCDCDC',
                                borderWidth: 1,
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingVertical: 30,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                elevation: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                padding: 10,
                            }}>
                                <IconM name={'wifi'} size={30} color={'#101010'} />
                                <Text style={{
                                    color: '#101010',
                                    fontFamily: 'Montserrat-Medium',
                                    fontSize: 10,
                                    lineHeight: 20
                                }}>Free WiFi</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('Room service') &&
                            <View style={{
                                marginRight: 20,
                                borderRadius: 20,
                                borderColor: '#DCDCDC',
                                borderWidth: 1, alignItems: 'center',
                                padding: 20, alignItems: 'center',
                                justifyContent: 'center',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                elevation: 1,
                                backgroundColor: '#ffffff',
                            }}>
                                <IconM name={'room-service'} size={30} color={'#101010'} />
                                <Text style={{
                                    lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10
                                }}>Room service</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('Family Room') &&
                            <View style={{
                                marginRight: 20,
                                borderRadius: 20,
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                alignItems: 'center',
                                padding: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                elevation: 1,
                                backgroundColor: '#ffffff',
                            }}>
                                <IconMa name={'family-restroom'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>Family Rooms</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('Couple Room') &&
                            <View style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                elevation: 1,
                                backgroundColor: '#ffffff',
                                marginRight: 20,
                                borderRadius: 20,
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                alignItems: 'center',
                                padding: 20, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <IconMa name={'people-alt'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>Couple Room</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('Garden view') &&
                            <View style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                elevation: 1,
                                backgroundColor: '#ffffff',
                                marginRight: 20,
                                borderRadius: 20,
                                borderColor: '#DCDCDC', borderWidth: 1, alignItems: 'center', padding: 20, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <IconM name={'flower-tulip'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>Garden view</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('CCTV (Outside Property)') &&
                            <View style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                backgroundColor: '#ffffff',
                                elevation: 1, marginRight: 20, borderRadius: 20, borderColor: '#DCDCDC', borderWidth: 1, alignItems: 'center', padding: 20, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <IconM name={'cctv'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>CCTV (Outside Property)</Text>
                            </View>}
                        {PropertiesArray?.majorAmenities.includes('Non-smoking rooms') &&
                            <View style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                backgroundColor: '#ffffff',
                                elevation: 1, marginRight: 20, borderRadius: 20, borderColor: '#DCDCDC', borderWidth: 1, alignItems: 'center', padding: 20, justifyContent: 'center'
                            }}>
                                <IconM name={'smoking-off'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>Non-smoking Rooms</Text>
                            </View>}

                        {PropertiesArray?.majorAmenities.includes('Flat-screen TV') &&
                            <View style={{
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.01,
                                shadowRadius: 1,
                                backgroundColor: '#ffffff',
                                elevation: 1, marginRight: 20, borderRadius: 20, borderColor: '#DCDCDC', borderWidth: 1, alignItems: 'center', padding: 20, justifyContent: 'center'
                            }}>
                                <IconMa name={'tv'} size={30} color={'#101010'} />
                                <Text style={{ lineHeight: 20, color: '#101010', fontFamily: 'Montserrat-Medium', fontSize: 10 }}>Flat-screen TV</Text>
                            </View>}

                    </View>
                </ScrollView>
            </View>


            <View style={{ paddingHorizontal: 18 }}>

                <Text style={{
                    fontSize: 16,

                    fontFamily: 'Montserrat-SemiBold',
                    color: '#000000',
                    paddingVertical: 20,
                }}>Location</Text>

                <Image
                    style={{ width: '100%', height: 150 }}
                    source={{ uri: PropertiesArray?.locationImage }}
                />
            </View>




            <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 5, alignItems: 'center' }}
                >
                    <Text style={{
                        fontSize: 16,

                        fontFamily: 'Montserrat-SemiBold',
                        color: '#000000',
                        paddingBottom: 10,
                    }}>House Rules & Policies</Text>
                    <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#081F62', }}>
                        {/* <Text style={styles.viewTypo11}>VIEW ALL</Text> */}
                    </View>
                </View>
            </View>
            <Text style={{
                fontSize: 12,

                fontFamily: 'Montserrat-SemiBold',
                color: '#1A1A1A',
                paddingBottom: 20,
                paddingHorizontal: 18,
                // paddingB:20
            }}>Check-in Check-out</Text>


            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 18, alignItems: 'center', }}>
                <IconM name={'clock-time-four-outline'} size={20} color={'#333333'} />

                <Text style={{
                    fontSize: 12,

                    fontFamily: 'WorkSans-Medium',

                    color: '#000000',
                    opacity: 0.8,
                    //paddingBottom: 10,
                    //paddingHorizontal: 18
                }}>  {PropertiesArray?.checkInTime}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 18, alignItems: 'center', }}>
                <IconM name={'clock-time-four-outline'} size={20} color={'#333333'} />
                <Text style={{
                    fontSize: 12,


                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    opacity: 0.8,
                    // paddingBottom: 10,
                    // paddingHorizontal: 18
                }}>  {PropertiesArray?.checkOutTime}</Text>
            </View>


            <Text style={{
                fontSize: 12,

                fontFamily: 'Montserrat-SemiBold',
                color: '#1A1A1A',
                paddingBottom: 20,
                paddingHorizontal: 18,
                paddingTop: 20,

            }}>During your stay</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 18, alignItems: 'center', }}>
                {/* <IconM name={'clock-time-four-outline'} size={20} color={'#333333'} /> */}

                <Image
                    style={{ width: 15, height: 15 }}
                    source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V6.png',
                    }}
                />
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    opacity: 0.8,
                    paddingLeft:5
                  
                }}>No pets</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 18, alignItems: 'center', paddingVertical: 10 }}>
                <Icon name={'logo-no-smoking'} size={20} color={'#333333'} />
                <Text style={{
                    fontSize: 12,


                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    opacity: 0.8,
                    paddingLeft:5

                    // paddingHorizontal: 18
                }}>No smoking</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 22, alignItems: 'center', }}>
                {/* <IconM name={'clock-time-four-outline'} size={20} color={'#333333'} /> */}
                <Image
                    style={{ width: 17, height: 17 }}
                    source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V7.png',
                    }}
                />
                <Text style={{
                    fontSize: 12,


                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    opacity: 0.8,
                    paddingLeft:5

                    // paddingBottom: 10,
                    // paddingHorizontal: 18
                }}>No parties or events</Text>
            </View>

            <View style={{ paddingHorizontal: 18 }}>

                <Text style={{
                    fontSize: 16,

                    fontFamily: 'Montserrat-SemiBold',
                    color: '#000000',
                    paddingBottom: 15,
                    marginTop: 30
                }}>Location Highlights</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ScrollView horizontal={true}>

                    {PropertiesArray?.locationHighlights.map((item, index) => (<View
                        key={index}
                        style={{
                            backgroundColor: 'white',
                            margin: 10,
                            // paddingBottom: 80,
                        }}>
                        <Image
                            style={{ borderRadius: 10, width: 160, height: 260 }}
                            //source={require('./assets/Home11.jpeg')}
                            source={{ uri: item?.image }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                width: '100%',
                                height: 240,
                                // paddingLeft: 20
                            }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF' }}>{item?.name}</Text>
                        </View>
                    </View>))}


                </ScrollView>
            </View>





            



        </ScrollView>
        <View style={{ padding:10}}>
        <TouchableOpacity
            onPress={() => {
               // handleCallRecord(PropertiesArray?.name,PropertiesArray?.contactDetails?.phone);
            //    {PropertiesArray?.name=='Hilltop By Fracspace'?openApp('https://wa.me/message/2GE5PMLTQFN5E1'):openApp('https://wa.me/qr/GTDPDDHK5X5MA1')}
                {globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber.length ==13 ?handleCallRecord(PropertiesArray?.name,PropertiesArray?.contactDetails?.phone):PropertiesArray?.name=='Hilltop By Fracspace'?openApp('https://wa.me/message/2GE5PMLTQFN5E1'):openApp('https://wa.me/qr/GTDPDDHK5X5MA1')}
            }}
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                //  backgroundColor: '#56018A',
                paddingHorizontal: 20,
                paddingVertical: 15,
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