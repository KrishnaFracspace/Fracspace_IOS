import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Linking, StyleSheet, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import IconC from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import { CallRecordBuyAndRent, GetBuySellProp, PropertyMetaData, PropertyMetaDataApi } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchProperties } from '../redux/reducer/homeReducer';
const { width, height } = Dimensions.get('window');

export default function PropertyListing(props) {
    const { globalState, setGlobalState } = useContext(AppContext);
    const [PropertyFor, setPropertyFor] = useState('');
    const [Location, setLocation] = useState('');
    const navigation = useNavigation();
    const [Configuration, setConfiguration] = useState(props?.route?.params?.Configuration);
    //console.log(Configuration,"===========con==========")
    // const {globalState, setGlobalState} = useContext(AppContext);
    const [PropertyData, setPropertyData] = useState([]);
    const [PropertyMetaData, setPropertyMetaData] = useState([]);
     const {
    LableProDetails,
    offer,
    recommended,
    indianProperties,
    srilankaProperties,
    loading,popularHotels,
    success,
    error,
    notifications } = useSelector(state => state.home);

     useEffect(() => {
        dispatch(fetchProperties());
      //  dispatch(fetchPopularHotels());
      }, []);


    const handlePropertyListing = async () => {
        let payload = JSON.stringify({
            propertyConfigurations: Configuration,
        }); 
        try {
            let { data: res } = await GetBuySellProp(payload);
        if (res?.success) {
                const PropertyData =res?.data?.filter(user=>user?.isVerify==true);
                if(props?.route?.params?.section){
                    const filtered = PropertyData.filter(user =>
                        user?.listingType.includes(props?.route?.params?.section),
                    );
                    // console.log(filtered.length);
                    setPropertyData(filtered);
                    setGlobalState(prevState => ({
                        ...prevState,
                        PropertyBuyAnsRent: filtered,
                    }));
                }else{
                setPropertyData(res?.data);
                setGlobalState(prevState => ({
                    ...prevState,
                    PropertyBuyAnsRent: res?.data,
                }));
            }
                //setBookingData(res?.data);
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
    const handlePropertyMetaData = async () => {
        try {
            let { data: res } = await PropertyMetaDataApi();
   if (res?.success) {
               setPropertyMetaData(res?.data?.cities);
                //setBookingData(res?.data);
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
    const PropertyForData = [
        { label: 'Sell', value: 'Sell' },
        { label: 'Rent', value: 'Rent' },
      
    ];


    const handleCallRecord = async (Phone, PropId) => {
        let payload = JSON.stringify({
            sellerPhone: Phone,
            propertyId: PropId,
            leadPhoneNumber: globalState?.userDetails?.phoneNumber,
            leadEmail: globalState?.userEmail,
        });
        try {
            let { data: res } = await CallRecordBuyAndRent(payload);
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

useEffect(() => {
        if(props?.route?.params?.Configuration){
            setPropertyData(props?.route?.params?.Configuration);
        }else{
        handlePropertyListing();
        handlePropertyMetaData();
        }
    }, [Configuration])

    return (
          <SafeAreaView style={{flex:1}}>
        <View style={{ flex: 1, backgroundColor: '#FAFAFF', }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                width: '100%'
            }}>
                <TouchableOpacity style={{ flex: 1 ,paddingTop: height * 0.08,}}
                    onPress={() => {
                        navigation.navigate('HomePage');

                    }}>
                    <IconC name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, paddingTop: height * 0.08, }}
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

            <View style={{ borderBottomWidth: 1, borderBottomColor: '#E8E8E8' }}></View>
            <ScrollView style={{ backgroundColor: '#FAFAFF', paddingHorizontal: 15, paddingTop: 10, }}>
            <ScrollView horizontal={true}>
                        <View style={{ marginTop: 5, marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Filter');

                            }} style={{ marginRight: 10, backgroundColor: '#0424CB', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 5 }}>
                                <Icon name="filter" size={18} color="#FFFFFF" />
                            </TouchableOpacity>



                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                data={PropertyMetaData}
                                // search
                                iconColor={'#021265'}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Location"
                                searchPlaceholder="Search..."
                                value={Location}
                                onChange={item => {
                                    setLocation(item.value);
                                    const filtered = globalState?.PropertyBuyAnsRent.filter(user =>
                                        user?.city.includes(item.value),
                                    );
                                    setPropertyData(filtered);
                                }}

                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setPropertyFor('');
                                    setLocation('');
                                    setPropertyData(globalState?.PropertyBuyAnsRent);


                                }}
                                style={{ marginRight: 10, flexDirection: 'row', justifyContent: 'center', borderColor: '#021265', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 18 }}>
                                <Text style={{ color: '#BF0000', fontSize: 14, fontFamily: 'Poppins-Medium', alignItems: 'center', justifyContent: 'center' }}>Clear x</Text>

                            </TouchableOpacity>






                            {/* <View style={{marginRight:10,flexDirection:'row',justifyContent:'center',borderColor:'#021265',borderWidth:1,backgroundColor:'#FFFFFF',paddingHorizontal:15,paddingVertical:5,borderRadius:18}}>
                        <Text style={{color:'#021265',fontSize:14,fontFamily:'Poppins-Medium',alignItems:'center',justifyContent:'center'}}>Sell </Text>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                        <IconC name="chevron-down-outline" size={15} color={'#021265'} />
                        </View>
                        </View> */}
                        </View>
                    </ScrollView>
            {PropertyData.length !== 0 &&
                
                    
                    <View style={{ marginBottom: 150 }}>
                        {PropertyData.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: '100%',
                                    borderRadius: 3,
                                    borderColor: '#DADADA',
                                    borderWidth: 0.1,
                                    padding: 8,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    //    alignItems: 'center',
                                    backgroundColor: '#FFFFFF',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 0.15,
                                    //  shadowRadius: 2,
                                    elevation: 5,
                                    marginBottom: 20,
                                    //marginHorizontal:10
                                }}
                                onPress={() => {
                                    navigation.navigate('PropertyDetailsNew', { details: item })

                                }}>
                                <Image
                                    style={{
                                        width: width * 0.45,
                                        height: height * 0.25,

                                    }}
                                    resizeMode='cover'
                                    source={{ uri: item?.images[0] }}
                                />

                                <View style={{ paddingLeft: 10, flex: 1, width: '100%', alignItems: 'flex-start' }}>
                                    <Text
                                        style={{
                                            color: '#000000',
                                            fontSize: 14,
                                            //fontFamily:"Montserrat-Bold",
                                            fontFamily: "Montserrat-SemiBold",
                                            paddingVertical: 2,
                                        }}>
                                        {item?.propertyName}
                                    </Text>
                                    <View style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#F0EFFB', width: '100%'
                                    }}>
                                        <Text
                                            style={{
                                                color: '#4D5369',
                                                fontSize: 10,
                                                //fontFamily:"Montserrat-Bold",
                                                fontFamily: "Poppins-Regular",
                                                paddingVertical: 2,

                                            }}>
                                            {item?.propertyType} in {item?.city}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 8, paddingBottom: 8, marginVertical: 3 }}>

                                        <Image
                                            style={{ width: 15, height: 15, }}
                                            contentFit="cover"
                                            source={require('./assets/Square.png')}
                                        />
                                        <View>
                                            <Text style={{

                                                color: '#000929',
                                                fontSize: 10, fontFamily: 'Montserrat-Medium',
                                            }}> {item?.totalArea} sqft  </Text>
                                        </View>
                                        {item?.features?.bedrooms != 0 &&
                                            <>
                                                <IconC name="bed-outline" size={15} color="#021265" />
                                                <Text style={{

                                                    color: '#000929',
                                                    fontSize: 10, fontFamily: 'Montserrat-Medium',
                                                }}> {item?.features?.bedrooms} Bed  </Text>
                                            </>}


                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'WorkSans-Medium',
                                            color: '#000000',
                                            marginBottom: 10
                                            //letterSpacing:0.5
                                        }}>
                                        {'\u20B9'}{item?.price}
                                    </Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={{
                                            //  backgroundColor: '#021265',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 15,
                                            paddingVertical: 10,
                                            borderRadius: 5,
                                            borderColor: '#021265',
                                            borderWidth: 1

                                        }}
                                            onPress={() => {
                                                handleCallRecord(item?.sellerPhone,item?._id)
                                               // handleCallNow(item?.sellerPhone);
                                                // navigation.navigate('PropertyFormThird', { PropertyData: Data })
                                            }}>
                                            <Text style={{
                                                fontSize: 10, fontFamily: 'Montserrat-SemiBold',
                                                color: '#021265',
                                            }}>Enquire Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>}
                </ScrollView>
               </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
input: {
        borderColor: '#EAEAEA',
        borderWidth: 1,
        borderRadius: 5,
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
    },
    image: {
        width: width,
        height: 190,
        flex: 1,
    },
    dropdown: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#021265',
        borderWidth: 1,
        marginRight: 10
    },
    placeholderStyle: {
        color: '#021265',

    },
    selectedTextStyle: {
        color: '#021265', fontSize: 14, fontFamily: 'Poppins-Medium',
    },
    itemTextStyle: {
        color: '#000000'
    }
});