import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
// dot-circle-o   circle-check   checkmark-circle   ellipse-outline  checkmark-circle
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import Slider from '@react-native-community/slider';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InteriorFSec() {
    //  console.log(props?.route?.params?.Data);
    const { globalState, setGlobalState } = useContext(AppContext);
  

    const navigation = useNavigation();
    const [Form, setForm] = useState();
    const [PropertyConfiguration, setPropertyConfiguration] = useState('');
    const [PropertySize, setPropertySize] = useState('500.00');



    return (
           <SafeAreaView style={{ flex: 1 ,}}>
        <ScrollView style={{ backgroundColor: '#FFFFFF', }}>
            <View style={{ width: '100%', backgroundColor: '#FFFFFF', paddingHorizontal: 15, flex: 1, }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <TouchableOpacity style={{ flex: 1 ,paddingVertical: 15,}}
                        onPress={() => {
                            navigation.navigate('InteriorForm');

                        }}>
                        <Icon name="chevron-back-outline" size={25} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 , paddingVertical: 15,}}
                        onPress={() => {
                            navigation.navigate('HomePage');

                        }}>
                        <Text style={{
                            fontSize: 15,
                            fontFamily: 'WorkSans-SemiBold',
                            color: '#0424CB',
                            textAlign: 'right',
                            paddingRight:3
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
                    <Icon name="checkmark-circle" size={25} color={'#021265'} />
                    <View style={{
                        borderBottomWidth: 1.5,
                        borderBottomColor: '#021265',
                        flex: 1,
                        // marginRight: 5
                    }}></View>
                    <IconF name="dot-circle-o" size={25} color={'#021265'} />
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
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    marginTop: 20
                }}>Pick your format *</Text>

                <View style={{ marginVertical: 20, paddingVertical: 10, backgroundColor: '#FFFFFF', padding: 20, borderColor: '#DCDCDC', borderWidth: 2, borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('1RK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flexDirection: 'row', justifyContent: 'flex-start' }}>

                        {PropertyConfiguration == '1RK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '1RK' ? '#101010' : '#707070',
                            // opacity:  0.6,
                        }}> 1 RK</Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('1BHK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {PropertyConfiguration == '1BHK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '1BHK' ? '#101010' : '#707070',
                            //  opacity:  0.6,
                        }}> 1 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('2BHK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {PropertyConfiguration == '2BHK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '2BHK' ? '#101010' : '#707070',
                            //  opacity:  0.6,
                        }}> 2 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('3BHK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {PropertyConfiguration == '3BHK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '3BHK' ? '#101010' : '#707070',
                            // opacity:  0.6,
                        }}> 3 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('4BHK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {PropertyConfiguration == '4BHK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '4BHK' ? '#101010' : '#707070',
                            //  opacity:  0.6,
                        }}> 4 BHK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setPropertyConfiguration('5+BHK');
                    }} style={{ alignItems: 'center', paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {PropertyConfiguration == '5+BHK' ? <IconF name="dot-circle-o" size={25} color={'#021265'} /> :
                            <Icon name="ellipse-outline" size={25} color={'#707070'} />}
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'WorkSans-Medium',
                            color: PropertyConfiguration == '5+BHK' ? '#101010' : '#707070',
                            // opacity:  0.6,
                        }}> 5+ BHK</Text>
                    </TouchableOpacity>
                </View>
                {globalState?.userEvent !='Construction' && 
                <>
                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            color: '#000000',
                            // marginTop: 15
                        }}>Area *</Text>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Medium',
                            color: '#021265',
                            //  marginTop: 15
                        }}> Your Area : {PropertySize}sq.ft</Text>
                    </View>
                  
                      <Slider
                        style={{ width: '100%', height: 60 }}
                        minimumValue={500}
                        maximumValue={5000}
                        minimumTrackTintColor="#021265"
                        maximumTrackTintColor="#DCDCDC"
                        thumbTintColor="#021265"
                        onValueChange={txt => {
                            setPropertySize(txt.toFixed(2))
                          //  console.log(txt);

                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Medium',
                            color: '#021265',
                            //  marginTop: 15
                        }}>  500sq.ft</Text>
                        <Text style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Medium',
                            color: '#021265',
                            //  marginTop: 15
                        }}>5000+sq.ft</Text>
                    </View>
                </>}

                {globalState?.userEvent == 'Construction' &&
                    <>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            color: '#000000',
                            marginTop: 20
                        }}>Area *</Text>
                        <View style={[styles.input, { marginBottom: 10, marginTop: 15 }]}>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    // paddingVertical: 5,
                                }}>
                                <View style={{ paddingHorizontal: 10, flex: 2 }}>

                                    <TextInput
                                        style={{
                                            width: '100%',
                                            height: 40,
                                            // paddingLeft: 30,
                                            color: '#1E2135',
                                            fontFamily: 'Poppins-Regular',

                                        }}
                                        placeholder=""
                                        keyboardType='numeric'
                                        //multiline
                                        //placeholderTextColor={'#000'}

                                        value={PropertySize}
                                        onChangeText={txt => {
                                            setPropertySize(txt);
                                        }}
                                    />
                                </View>
                                <Text style={{ color: '#1A1A1A', opacity: 0.6, fontFamily: 'Poppins-Medium', fontSize: 14 }}>sq ft</Text>
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
                    <TouchableOpacity style={{
                        marginHorizontal: 30,
                        backgroundColor: '#021265', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5
                    }}
                        onPress={() => {
                            if (PropertyConfiguration == '') {
                                Alert.alert('Mandatory section required', 'Please select configuration.');

                            }else if(globalState?.userEvent == 'Construction'){
                                navigation.navigate('InteriorFormThird', { Data: {PropertyConfiguration: PropertyConfiguration, PropertySize: PropertySize}});
                            }
                             else {

                                navigation.navigate('InteriorFormSec', { Data: {PropertyConfiguration: PropertyConfiguration, PropertySize: PropertySize } })
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
  
   
});