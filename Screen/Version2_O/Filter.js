import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native'
import React, { useState } from 'react';
import IconC from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { GetBuySellProp } from '../Services/UserApi';
const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Filter() {
    const navigation = useNavigation();
    const [PropertyPrice, setPropertyPrice] = useState('');
    const [Configuration, setConfiguration] = useState([]);
    const handlePropertyListing = async () => {
        let payload = JSON.stringify({
            propertyConfigurations: Configuration,
            maxPrice: parseFloat(PropertyPrice)
        });
        try {
            let { data: res } = await GetBuySellProp(payload);
  

            if (res?.success) {
                navigation.push('PropertyListing', { Configuration: res?.data });
            }
        } catch (error) {
            if (error?.response) {
                //navigation.push('PropertyListing');
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
    return (
         <SafeAreaView style={{flex:1}}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 15,
                width: '100%',
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                shadowColor: '#000',
                backgroundColor: '#FAFAFF',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 1,
                borderBottomColor: '#DDE1E5'
            }}>
                <TouchableOpacity style={{ flex: 1 ,paddingTop: height * 0.08, paddingBottom: 15}}
                    onPress={() => {
                        navigation.navigate('PropertyListing');

                    }}>
                    <IconC name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#000000',
                    paddingTop: height * 0.08,
                    paddingBottom: 15
                }}>
                    Fiters
                </Text>
                <View style={{ flex: 1 }}></View>
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
            </View>
            <ScrollView style={{ width: '100%', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>

                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'WorkSans-Medium',
                        color: '#000000',
                        // marginTop: 15
                    }}>Price Range</Text>

                </View>
                <Slider
                    style={{ width: '100%', height: 60 }}
                    minimumValue={5000}
                    maximumValue={50000000}
                    minimumTrackTintColor="#021265"
                    maximumTrackTintColor="#DCDCDC"
                    thumbTintColor="#021265"
                    onValueChange={txt => {
                        setPropertyPrice(txt.toFixed())
                        //  console.log(txt);

                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                        color: '#021265',
                        //  marginTop: 15
                    }}> {'\u20B9'} 5000</Text>
                    <Text style={{
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                        color: '#021265',
                        //  marginTop: 15
                    }}>
                        {'\u20B9'} {PropertyPrice == '' ? '5,00,00,000' : PropertyPrice}
                    </Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'WorkSans-Medium',
                        color: '#000000',

                    }}>Property Configuration </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginTop: 15
                    //borderWidth:1
                }}>
                    <TouchableOpacity
                        onPress={() => {

                            if (Configuration.includes('1RK')) {
                                let Design = Configuration.filter(item => item != '1RK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '1RK']);
                            }
                            //   setProperty({PropertyKind:'Residential' ,PropertyType: '1 RK' });

                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('1RK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('1RK') ? '#FFFFFF' : '#000000',
                            // opacity: 1 ,
                        }}>1 RK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {

                            if (Configuration.includes('1BHK')) {
                                let Design = Configuration.filter(item => item != '1BHK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '1BHK']);
                            }


                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('1BHK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('1BHK') ? '#FFFFFF' : '#000000',
                            // opacity: FeatureType.includes('1 BHK') ? 1 : 0.6,
                        }}>1 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {

                            if (Configuration.includes('2BHK')) {
                                let Design = Configuration.filter(item => item != '2BHK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '2BHK']);
                            }
                            //   setProperty({PropertyKind:'Residential' ,PropertyType: '1 RK' });

                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('2BHK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('2BHK') ? '#FFFFFF' : '#000000',
                            // opacity: FeatureType.includes('2 BHK') ? 1 : 0.6,
                        }}>2 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (Configuration.includes('3BHK')) {
                                let Design = Configuration.filter(item => item != '3BHK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '3BHK']);
                            }
                            // setPropertySec({ ...PropertySec, Configuration: '3BHK' });
                            //   setProperty({PropertyKind:'Residential' ,PropertyType: '1 RK' });

                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('3BHK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('3BHK') ? '#FFFFFF' : '#000000',
                            //  opacity: FeatureType.includes('3 BHK') ? 1 : 0.6,
                        }}>3 BHK</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginTop: 15
                    //borderWidth:1
                }}>
                    <TouchableOpacity
                        onPress={() => {

                            if (Configuration.includes('4BHK')) {
                                let Design = Configuration.filter(item => item != '4BHK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '4BHK']);
                            }
                            //   setProperty({PropertyKind:'Residential' ,PropertyType: '1 RK' });

                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('4BHK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('4BHK') ? '#FFFFFF' : '#000000',
                            // opacity: FeatureType.includes('2 BHK') ? 1 : 0.6,
                        }}>4 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (Configuration.includes('5+ BHK')) {
                                let Design = Configuration.filter(item => item != '5+ BHK');
                                setConfiguration(Design);

                            } else {
                                setConfiguration([...Configuration, '5+ BHK']);
                            }
                            // setPropertySec({ ...PropertySec, Configuration: '3BHK' });
                            //   setProperty({PropertyKind:'Residential' ,PropertyType: '1 RK' });

                        }}
                        style={{
                            borderColor: '#E8E8E8',
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: Configuration.includes('5+ BHK') ? '#021265' : '#FFFFFF',
                            borderRadius: 10,
                            alignItems: 'center',
                            marginRight: 8
                        }}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-Medium',
                            color: Configuration.includes('5+ BHK') ? '#FFFFFF' : '#000000',
                            //  opacity: FeatureType.includes('3 BHK') ? 1 : 0.6,
                        }}>5+ BHK</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View
                style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    // opacity:0.4
                }}>
                <TouchableOpacity
                    //  disabled={PropertiesArray?.AvailableFractions == 0 ? true : false}
                    style={{
                        backgroundColor: '#FFFFFF',
                        flex: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingVertical: 15,
                        borderColor: '#021265',
                        borderWidth: 1,
                        marginRight: 10,
                    }}
                    onPress={() => {

                        navigation.navigate('PropertyListing');

                    }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: 'Poppins-Medium',
                            color: '#101010',
                        }}>
                        Clear
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#021265',
                        flex: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 15
                    }}
                    onPress={() => {
                        // 
                        handlePropertyListing();
                    }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: 'Poppins-Medium',
                            color: '#FFFFFF',
                        }}>
                        Apply Filters
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}