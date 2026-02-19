

import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, Modal, TextInput, Alert, Linking, ActivityIndicator } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../Context/AppContext';
import { UploadEnquiry } from '../Services/UserApi';

export default function LablePropertyDis(prop) {
    const { globalState, setGlobalState } = useContext(AppContext);
    const [propertyDetails, setPropertyDetails] = useState(prop?.route?.params?.data);
    // console.log('Data: ',prop?.route?.params?.data);
    // const userData = {
    //     name: 'Krishna Gupta',
    //     email: 'krishna@fracspace.com',
    //     phone: '6307006215'
    // };

    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    const [viewAll, setViewAll] = useState(false);
    const [images, setImages] = useState([]);
    const [viewEnquiry, setViewEnquiry] = useState(false);
    const [viewSchedule, setViewSchedule] = useState(false);
    const [name, setName] = useState(globalState?.userName);
    const [email, setEmail] = useState(globalState?.userEmail);
    const [phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => {
                setIsFocused(false);
                videoRef.current?.seek(0);
            };
        }, [])
    );

    useEffect(() => {
        const imageObject = propertyDetails?.image || {};
        const imageArray = Object.values(imageObject).filter(Boolean);
        setImages(imageArray);
    }, [propertyDetails]);

    const handleEnquiryForm = async () => {

        let payload = JSON.stringify({
            name: globalState?.userName,
            email: globalState?.userEmail,
            phoneNumber: globalState?.userDetails?.phoneNumber,
            message: message
        });
        //console.log('payload: ', payload);
        try {
            let { data: res } = await UploadEnquiry(payload);
            // if (res?.success) {
            //     Alert.alert('Thank You', 'Your Enquiry Submitted Successfully');
            //     setViewEnquiry(false);
            // }
          // console.log('Uploaded Successful: ', res?.message);
           return res;
        } catch (error) {
            console.error('Error in uploading enquiry form: ', error?.response?.message || error.message);
            return null;
        }
    };

    const handleCallNow = () => {

        const phoneNumber = '+919880626111';
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
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#E9E8E5', flex: 1 }}>
                <View>
                    {/* <Image resizeMode='cover' source={require('./assets/Tajjj.png')} style={{width:width,height:400}}/> */}
                    {isFocused && (
                        <Video
                            ref={videoRef}
                            resizeMode='cover'
                            repeat
                            muted
                            source={{ uri: propertyDetails?.headerVideo }}
                            style={{ width, height: 400 }}
                        />
                    )}
                    <View style={{ position: 'absolute', top: 30, left: 20 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('LableProperty');
                        }}>
                            <Icon name={'chevron-left'} size={22} color={'#FFF'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }}>
                        <View style={{ backgroundColor: '#f6f6f6', padding: 15, borderRadius: 10, width: width * 0.7, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#0B2C0B' }}>{propertyDetails?.name}</Text>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#000', textAlign: 'center', marginTop: 6 }}>
                                Perched 2000 ft above sea level - where serenity meets strategy
                            </Text>
                        </View>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 20, gap: 20 }}>
                    {images.slice(0, 3).map((item, index) => (
                        <View key={index} style={{ borderColor: '#ffffffc1', borderWidth: 2, borderRadius: 6, marginRight: 20 }}>
                            <Image source={{ uri: item }} style={{ width: 80, height: 80, borderRadius: 6 }} />
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => {
                        // setViewAll(true);
                        navigation.navigate('Label', { data: images });
                    }} style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 20, }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000' }}>View All</Text>
                    </TouchableOpacity>
                </ScrollView>

                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Description</Text>

                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#000', marginTop: 8, letterSpacing: 0.5 }}>
                        {propertyDetails?.Description}
                    </Text>
                </View>

                <View style={{ padding: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Resort Highlights</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingTop: 15 }}>
                        {propertyDetails?.DistinctiveAmenities?.map((item, index) => (
                            <View key={index} style={{ backgroundColor: '#f6f6f6', borderRadius: 6, padding: 8, width: 90, marginRight: 20, alignItems: 'center' }}>
                                <Image source={{ uri: item?.image }} style={{ width: 35, height: 35 }} />
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 11, color: '#000', marginTop: 8, textAlign: 'center' }}>{item?.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Investment Details</Text>

                    <View style={{ backgroundColor: '#f6f6f6', borderRadius: 14, paddingHorizontal: 15, paddingVertical: 20, marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000d2' }}>Property Type</Text>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000d2' }}>{propertyDetails?.P_Type}</Text>
                        </View>
                        <View style={{ backgroundColor: '#797575', borderTopWidth: 0.5, marginVertical: 12 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#1a1a1a' }}>Area Details</Text>
                        </View>
                        <View style={{ backgroundColor: '#797575', borderTopWidth: 0.5, marginVertical: 12 }} />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>Total Area</Text>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>{propertyDetails?.area}</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#1a1a1a' }}>Price Details</Text>
                            <View style={{ backgroundColor: '#797575', borderTopWidth: 0.5, marginVertical: 12 }} />
                        </View>

                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>Minimum Investment</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>₹ {propertyDetails?.FC_Price}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>Annual Returns</Text>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1a1a1a' }}>{propertyDetails?.Type.substring(2, propertyDetails?.Type.length)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>Lock-In Period</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>{propertyDetails?.Communitylink}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>Total Investors</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#1a1a1a' }}>{propertyDetails?.TotalFractions} Global Investors</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={{ padding: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Why invest in Altaira?</Text>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ width: width * 0.55, flex: 1, height: width * 0.55, marginLeft: -40, alignSelf: 'center', borderRadius: width * 0.55, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', borderWidth: 4, borderRadius: 75, borderColor: '#FFF' }}>
                                <Image resizeMode='cover' source={require('./assets/Alt.png')} style={{ width: 120, height: 120, borderRadius: 75 }} />
                            </View>
                        </View>
                        <View style={{ gap: 15, flex: 1 }}>
                            <View style={{ backgroundColor: '#C6AF83', alignSelf: 'flex-start', borderRadius: 30, padding: 6, marginLeft: -90, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: propertyDetails?.Benefits[0]?.image }} style={{ width: 22, height: 20 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#FFF', marginHorizontal: 8 }}>{propertyDetails?.Benefits[0]?.name}</Text>
                            </View>

                            <View style={{ backgroundColor: '#C6AF83', alignSelf: 'flex-start', borderRadius: 30, padding: 6, marginLeft: -45, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: propertyDetails?.Benefits[1]?.image }} style={{ width: 22, height: 20 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#FFF', marginHorizontal: 8 }}>{propertyDetails?.Benefits[1]?.name}</Text>
                            </View>

                            <View style={{ backgroundColor: '#C6AF83', alignSelf: 'flex-start', borderRadius: 30, padding: 6, marginLeft: -22, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: propertyDetails?.Benefits[2]?.image }} style={{ width: 22, height: 20 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#FFF', marginHorizontal: 8 }}>{propertyDetails?.Benefits[2]?.name}</Text>
                            </View>

                            <View style={{ backgroundColor: '#C6AF83', alignSelf: 'flex-start', borderRadius: 30, padding: 6, marginLeft: -45, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: propertyDetails?.Benefits[3]?.image }} style={{ width: 22, height: 20 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#FFF', marginHorizontal: 8 }}>{propertyDetails?.Benefits[3]?.name}</Text>
                            </View>

                            <View style={{ backgroundColor: '#C6AF83', alignSelf: 'flex-start', borderRadius: 30, padding: 6, marginLeft: -90, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#FFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: propertyDetails?.Benefits[4]?.image }} style={{ width: 22, height: 20 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#FFF', marginHorizontal: 8 }}>{propertyDetails?.Benefits[4]?.name}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Property Location</Text>

                    <View style={{ marginTop: 15 }}>
                        <Image resizeMode='cover' source={{ uri: propertyDetails?.LocationImage }} style={{ width: '100%', height: 200 }} />
                    </View>
                </View>

                <View style={{ padding: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Location Advantages</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
                        {propertyDetails?.locationHighlights.map((item, index) => (
                            <View key={index} style={{ width: 120, marginRight: 15 }}>
                                <View>
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 80, borderRadius: 8 }} />
                                </View>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 11, color: '#000', textAlign: 'center', marginTop: 8 }}>{item?.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Sustainability Responsibility</Text>

                    <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 50, borderBottomLeftRadius: 50, marginTop: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image resizeMode='cover' source={{ uri: propertyDetails?.CarpetArea }} style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1, padding: 15 }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#000' }}>
                                Built with local materials, powered by solar, and designed with zero-waste principles - because true luxury sustains what it touches
                            </Text>
                        </View>
                    </View>
                </View>



                <Modal visible={viewEnquiry} transparent animationType='fade'>
                    <View style={{ flex: 1, backgroundColor: '#000000b3' }}>
                        <TouchableOpacity onPress={() => {
                            setViewEnquiry(false);
                        }} style={{ flex: 1 }} />
                        <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#E9E8E5', width: width, padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 0.5, borderColor: '#00000099' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => {
                                    setViewEnquiry(false);
                                }}>
                                    <Icon name={'chevron-left'} size={20} color={'#000'} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Enquiry Form</Text>
                                <View style={{ width: 20 }} />
                            </View>

                            <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>Name</Text>

                                    <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                                        <TextInput
                                            placeholder='Enter Name'
                                            placeholderTextColor={'#00000086'}
                                            value={name}
                                            onChangeText={setName}
                                            style={{ fontFamily: 'Montserrat-Medium',padding:10, fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, gap: 15 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>Mobile Number</Text>

                                        <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                                            <TextInput
                                                placeholder='Enter Phone'
                                                placeholderTextColor={'#00000086'}
                                                value={phone}
                                                onChangeText={setPhone}
                                                keyboardType='number-pad'
                                                style={{ fontFamily: 'Montserrat-Medium',padding:10, fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>Email ID</Text>

                                        <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                                            <TextInput
                                                placeholder='Enter Mail'
                                                placeholderTextColor={'#00000086'}
                                                value={email}
                                                onChangeText={setEmail}
                                                style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8,padding:10, marginVertical: -3 }}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>Your Message</Text>

                                    <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                                        <TextInput
                                            // placeholder='Enter Message'
                                            placeholderTextColor={'#00000086'}
                                            numberOfLines={5}
                                            value={message}
                                            onChangeText={setMessage}
                                            style={{ fontFamily: 'Montserrat-Medium',padding:10, fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
                                        />
                                    </View>
                                </View>

                                {/* <TouchableOpacity onPress={() => {
                                    console.log(message);
                                    
                                    if (name == "" || phone == "" || email == "" || message == "") {
                                        Alert.alert('Missing Information', 'Please fill in all required details.');
                                        return;
                                    }else{
                                    handleEnquiryForm();
                                    }
                                    //console.log("Data: ", res);


                                }} style={{ backgroundColor: '#C6AF83', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 30 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: '#FFF' }}>Submit</Text>
                                </TouchableOpacity> */}

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={async () => {
                                        if (name === "" || phone === "" || email === "" || message === "") {
                                            Alert.alert('Missing Information', 'Please fill in all required details.');
                                            return;
                                        }

                                        setLoading(true); // 🔥 start loader

                                        try {
                                            const res = await handleEnquiryForm();
                                            console.log("Data: ", res);

                                            if (res?.success) {
                                                Alert.alert('Thank You', 'Your Enquiry Submitted Successfully');
                                                setViewEnquiry(false);
                                            }
                                        } finally {
                                            setLoading(false); // 🔥 stop loader (always)
                                        }
                                    }} style={{backgroundColor: loading ? '#C6AF83aa' : '#C6AF83',borderRadius: 10,padding: 12,alignItems: 'center',marginTop: 30}}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: '#FFF' }}>
                                        Submit
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={viewSchedule} transparent animationType='fade'>
                    <View style={{ flex: 1, backgroundColor: '#000000b3' }}>
                        <TouchableOpacity onPress={() => {

                            setViewSchedule(false);
                        }} style={{ flex: 1 }} />
                        <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#E9E8E5', width: width, padding: 20, borderTopRightRadius: 30, borderTopLeftRadius: 30, borderWidth: 0.5, borderColor: '#00000099' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => {

                                    setViewSchedule(false);
                                }}>
                                    <Icon name={'chevron-left'} size={20} color={'#000'} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Schedule a Call</Text>
                                <View style={{ width: 20 }} />
                            </View>

                            <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                                <View style={{ paddingHorizontal: 35, marginTop: 10 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', textAlign: 'center' }}>
                                        Need more details? Reach out to us via call or email - we’ll get back soon
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => {
                                    handleCallNow();
                                    setViewSchedule(false);
                                }} style={{ backgroundColor: '#C6AF83', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#FFF' }}>Call us at:   +91 9880626111</Text>
                                </TouchableOpacity>

                                <View style={{ backgroundColor: '#C6AF83', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#FFF' }}>Mail to:   support@fracspace.com</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            <View style={{ padding: 20, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <TouchableOpacity onPress={() => {
                        setViewSchedule(true);
                    }} style={{ flex: 1, borderWidth: 0.5, borderColor: '#000', alignItems: 'center', marginRight: 20, borderRadius: 5, justifyContent: 'center', padding: 12 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000' }}>Schedule a Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setViewEnquiry(true);
                    }} style={{ flex: 1, backgroundColor: '#C6AF83', alignItems: 'center', borderRadius: 5, justifyContent: 'center', padding: 12 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#fff' }}>Enquire Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
