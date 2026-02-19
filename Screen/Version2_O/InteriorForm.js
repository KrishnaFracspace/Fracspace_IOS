import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Dimensions, Alert } from 'react-native'
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import { AppContext } from '../Context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
export default function InteriorForm() {
    const { globalState, setGlobalState } = useContext(AppContext);
    const navigation = useNavigation();
    const [PropertyType, setPropertyType] = useState('');
    const [PropertyTypeC, setPropertyTypeC] = useState('');
    const [Property, setProperty] = useState({ PropertyKind: 'Residential', PropertyTypeR: 'Apartment', PropertyTypeC: 'Office Spaces', ifOtherPropertyType: '', ifOtherPropertyTypeC: '' });



    return (
         <SafeAreaView style={{flex: 1,}}>
        <ScrollView style={{backgroundColor: '#FFFFFF',width: '100%',}}>
            <View style={{ width: '100%',  paddingHorizontal: 15, flex: 1, }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                   
                    width: '100%'
                }}>
                    <TouchableOpacity style={{ flex: 1 ,paddingVertical: 15,}}
                        onPress={() => {
                            
                            navigation.navigate('HomePage');

                        }}>
                        <Icon name="chevron-back-outline" size={25} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 ,
                    paddingVertical: 15,}}
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


             <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginVertical: 10,
                    alignItems: 'center'
                }}>
                    <IconF name="dot-circle-o" size={25} color={'#021265'} />
                    <View style={{
                        borderBottomWidth: 1.5,
                        borderBottomColor: '#021265',
                        flex: 1,
                        // marginRight: 5
                    }}></View>
                    <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} />
                    <View style={{
                        borderBottomWidth: 1.5,
                        flex: 1,
                        borderBottomColor: '#DDDDDD',
                        // marginRight: 5
                    }}></View>
                    <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} />
                    {globalState?.userEvent != 'Construction' && <><View style={{
                        borderBottomWidth: 1.5,
                        flex: 1,
                        // marginRight: 5,
                        borderBottomColor: '#DDDDDD'
                    }}></View>
                        <Icon name="ellipse-outline" size={25} color={'#DDDDDD'} /></>}
                </View>
                <Text style={{
                    fontSize: 18,
                    fontFamily: 'WorkSans-SemiBold', color: '#000000', paddingVertical: 20,
                }}>Ready to transform your space?</Text>
                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000'
                }}>Residential or Commercial *</Text>

                {/* <TouchableOpacity onPress={() => {
                        setProperty({ ...Property, PropertyKind: 'Commercial' });
                    }}
                        style={{padding:3,alignItems:'center', borderWidth: Property?.PropertyKind == 'Commercial' ? 3 : 0, borderColor: '#021265', borderRadius: 9,  width: '100%', marginTop: 13 }}>
                    
                        <Image
                            //resizeMode="stretch"
                           // resizeMode='contain'
                          style={{width:width*0.95,height:height*0.19} }
                          resizeMode='contain'
                            source={require('./assets/Commerciall.png')}
                        />
                 
                    </TouchableOpacity> */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        setProperty({ ...Property, PropertyKind: 'Residential' });
                    }}
                        style={{ borderWidth: Property?.PropertyKind == 'Residential' ? 2 : 0, borderColor: '#021265', borderRadius: 12, alignItems: 'center', width: '100%', marginBottom: 5, marginTop: 20 }}>
                        <Image
                            //resizeMode="stretch"
                            resizeMode='contain'
                            style={{ width:width * 0.9, flex: 1, height: height * 0.21 }}
                            source={globalState?.userEvent == 'Construction' ?require('./assets/constructionimage2.png') :require('./assets/Resy.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setProperty({ ...Property, PropertyKind: 'Commercial' });
                    }}
                        style={{ borderWidth: Property?.PropertyKind == 'Commercial' ? 2 : 0, borderColor: '#021265', borderRadius: 9, alignItems: 'center', width: '100%', marginTop: 13 }}>
                        <Image
                            //resizeMode="stretch"
                            resizeMode='contain'
                            style={{ width: width * 0.9, flex: 1, height: height * 0.21}}
                            source={globalState?.userEvent == 'Construction' ?require('./assets/constructionimage1.png') :require('./assets/commy.png')}
                        />
                    </TouchableOpacity>

                </View>

















                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 15
                }}>Property type *</Text>
                {Property?.PropertyKind == 'Residential' &&

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        width: '100%',

                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setProperty({ ...Property, PropertyTypeR: 'Apartment' });

                            }} style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 30,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeR == 'Apartment' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center',
                                marginRight: 8
                            }}>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'WorkSans-Medium',
                                color: Property?.PropertyTypeR == 'Apartment' ? '#FFFFFF' : '#000000',
                                opacity: Property?.PropertyTypeR == 'Apartment' ? 1 : 0.6,
                            }}>Apartment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setProperty({ ...Property, PropertyTypeR: 'Villa' });
                            }}
                            style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 30,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeR == 'Villa' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center',
                                marginRight: 8
                            }}>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'WorkSans-Medium',
                                color: Property?.PropertyTypeR == 'Villa' ? '#FFFFFF' : '#000000',
                                opacity: Property?.PropertyTypeR == 'Villa' ? 1 : 0.6,
                            }}>Villa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setProperty({ ...Property, PropertyTypeR: 'Other' });
                            }}
                            style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 30,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeR == 'Other' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'WorkSans-Medium',
                                color: Property?.PropertyTypeR == 'Other' ? '#FFFFFF' : '#000000',
                                opacity: Property?.PropertyTypeR == 'Other' ? 1 : 0.6,
                            }}>Other</Text>
                        </TouchableOpacity>
                    </View>
                    }
                {Property?.PropertyTypeR == 'Other' && Property?.PropertyKind == 'Residential' &&
                    <>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            color: '#000000',
                            paddingTop: 30,
                            paddingBottom: 20
                        }}>If other, enter the property type *</Text>
                        <View style={styles.input}>
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    // paddingVertical: 5,
                                }}>

                                <TextInput
                                    style={{
                                        width: '100%',
                                        height: 45,
                                        // paddingLeft: 30,
                                        color: '#1E2135',
                                        fontFamily: 'Poppins-Regular',
                                    }}
                                    placeholder=""
                                    // multiline
                                    placeholderTextColor={'#000'}
                                    value={Property?.ifOtherPropertyType}
                                    onChangeText={txt => {
                                        //setPropertyType(txt);
                                        setProperty({ ...Property, ifOtherPropertyType: txt });
                                        // setProperty({ ...Property, PropertyTypeR: Other(${txt})});
                                    }}
                                />

                            </View>
                        </View>

                    </>


                }



                {Property?.PropertyKind == 'Commercial' && globalState?.userEvent != 'Construction' &&
                    <>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            // paddingVertical: 20,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Office Spaces' });

                                }} style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Office Spaces' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Office Spaces' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Office Spaces' ? 1 : 0.6,
                                }}>Office Spaces</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Cafe & Bar' });
                                }}
                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Cafe & Bar' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Cafe & Bar' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Cafe & Bar' ? 1 : 0.6,
                                }}>Cafe & Bar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setProperty({ ...Property, PropertyTypeC: 'Supermarket' });

                            }} style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeC == 'Supermarket' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center',

                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Supermarket' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Supermarket' ? 1 : 0.6,
                                }}>Supermarket</Text>
                            </TouchableOpacity>

                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            paddingVertical: 15
                            //borderWidth:1
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Retail' });

                                }}
                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Retail' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8

                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Retail' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Retail' ? 1 : 0.6,
                                }}>Retail</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeC == 'Hotels & Resorts' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center',
                                marginRight: 8
                            }} onPress={() => {
                                setProperty({ ...Property, PropertyTypeC: 'Hotels & Resorts' });

                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Hotels & Resorts' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Hotels & Resorts' ? 1 : 0.6,
                                }}>Hotels & Resorts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Restaurants' });

                                }}

                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Restaurants' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 20,
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Restaurants' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Restaurants' ? 1 : 0.6,
                                }}>Restaurants</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            //paddingVertical: 20,
                        }}>



                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Educational Institute' });

                                }}
                                style={{
                                    marginRight: 8,
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Educational Institute' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center'
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Educational Institute' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Educational Institute' ? 1 : 0.6,
                                }}>Educational Institute</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Other' });

                                }}

                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Other' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center'
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Other' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Other' ? 1 : 0.6,
                                }}>Other</Text>
                            </TouchableOpacity>
                        </View>

                    </>}

                {Property?.PropertyKind == 'Commercial' && globalState?.userEvent == 'Construction' &&
                    <>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            // paddingVertical: 20,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Office Spaces' });

                                }} style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Office Spaces' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Office Spaces' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Office Spaces' ? 1 : 0.6,
                                }}>Office Spaces</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Warehouse' });
                                }}
                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Warehouse' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Warehouse' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Warehouse' ? 1 : 0.6,
                                }}>Warehouse</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setProperty({ ...Property, PropertyTypeC: 'Supermarket' });

                            }} style={{
                                borderColor: '#E8E8E8',
                                borderWidth: 1,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                backgroundColor: Property?.PropertyTypeC == 'Supermarket' ? '#021265' : '#FFFFFF',
                                borderRadius: 20,
                                alignItems: 'center',

                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Supermarket' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Supermarket' ? 1 : 0.6,
                                }}>Supermarket</Text>
                            </TouchableOpacity>

                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            paddingVertical: 15
                            //borderWidth:1
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Retail' });

                                }}
                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Retail' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    marginRight: 8

                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Retail' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Retail' ? 1 : 0.6,
                                }}>Retail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProperty({ ...Property, PropertyTypeC: 'Other' });

                                }}

                                style={{
                                    borderColor: '#E8E8E8',
                                    borderWidth: 1,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    backgroundColor: Property?.PropertyTypeC == 'Other' ? '#021265' : '#FFFFFF',
                                    borderRadius: 20,
                                    alignItems: 'center'
                                }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'WorkSans-Medium',
                                    color: Property?.PropertyTypeC == 'Other' ? '#FFFFFF' : '#000000',
                                    opacity: Property?.PropertyTypeC == 'Other' ? 1 : 0.6,
                                }}>Other</Text>
                            </TouchableOpacity>


                        </View>


                    </>}














                {Property?.PropertyTypeC == 'Other' && Property?.PropertyKind == 'Commercial' &&
                    <>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            color: '#000000',
                            paddingTop: 30,
                            paddingBottom: 20
                        }}>If other, enter the property type *</Text>
                        <View style={styles.input}>
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    // paddingVertical: 5,
                                }}>

                                <TextInput
                                    style={{
                                        width: '100%',
                                        height: 45,
                                        // paddingLeft: 30,
                                        color: '#1E2135',
                                        fontFamily: 'Poppins-Regular',
                                    }}
                                    placeholder=""
                                    // multiline
                                    placeholderTextColor={'#000'}
                                    value={Property?.ifOtherPropertyTypeC}
                                    onChangeText={txt => {
                                        // setPropertyTypeC(txt);
                                        setProperty({ ...Property, ifOtherPropertyTypeC: txt });
                                        // setProperty({ ...Property, PropertyTypeR: Other(${txt})});
                                    }}
                                />

                            </View>
                        </View>

                    </>

                }




                <View style={{
                    justifyContent: 'flex-end',
                    paddingVertical: 20,
                    flex: 1,
                    marginTop: 40,
                    width: '100%'
                }}>
                    <TouchableOpacity style={{ marginHorizontal: 30, backgroundColor: '#021265', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }}
                        onPress={() => {
                            if (globalState?.userEvent == 'Construction') {

                                if (Property?.PropertyTypeR == 'Other' && Property?.ifOtherPropertyType == '') {
                                    Alert.alert('Mandatory section required', 'Please provide the information in all required fields.');

                                } else if (Property?.PropertyTypeC == 'Other' && Property?.ifOtherPropertyTypeC == '') {

                                    Alert.alert('Mandatory section required', 'Please provide the information in all required fields.');
                                }  else if (Property?.PropertyKind == 'Residential') {
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        ConstructionFData: Property
                                    }));
                                    navigation.navigate('InteriorFSec');
                                }
                                else {
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        ConstructionFData: Property
                                    }));
                                    navigation.navigate('InteriorFormSec');
                                }

                            } else {
                                if (Property?.PropertyTypeR == 'Other' && Property?.ifOtherPropertyType == '') {
                                    Alert.alert('Mandatory section required', 'Please provide the information in all required fields.');

                                } else if (Property?.PropertyTypeC == 'Other' && Property?.ifOtherPropertyTypeC == '') {

                                    Alert.alert('Mandatory section required', 'Please provide the information in all required fields.');
                                }
                                else if (Property?.PropertyKind == 'Residential') {
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        ConstructionFData: Property
                                    }));
                                    navigation.navigate('InteriorFSec');
                                }
                                else {
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        ConstructionFData: Property
                                    }));
                                    navigation.navigate('InteriorFormSec');
                                }
                            }
                        }}>
                        <Text style={{ fontSize: 16, fontFamily: 'WorkSans-SemiBold', color: '#FFFFFF', }}>Next</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </ScrollView>
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
    image1: {
        width: width,
        flex: 1,
    },
});