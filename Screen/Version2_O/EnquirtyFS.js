import { View, ScrollView,Text, TouchableOpacity, StyleSheet, TextInput, Alert, Modal, Image, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../Context/AppContext';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import IconF from 'react-native-vector-icons/Feather';
import CalenderAcc from './CalenderAcc';
import IconAntDesign from 'react-native-vector-icons/Entypo';
import { GetBookingFSHotel } from '../Services/UserApi';
const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EnquirtyFS(props) {
    //console.log(props?.route?.params?.Hotel_id);
    const [modalVisibleRS, setModalVisibleRS] = useState(false);
    const { globalState, setGlobalState } = useContext(AppContext);
    const [HotelId, setHotelId] = useState(props?.route?.params?.Hotel_id);
    const [RoomId, setRoomID] = useState('');
    const navigation = useNavigation();
    const [Email, setEmail] = useState(globalState?.userEmail);
    const [Phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
    const [Name, setName] = useState(globalState?.userName);
    const [countryCode, setCountryCode] = useState("+91");
    const [BookingFor, setBookingFor] = useState('Myself');
    const [Rooms, setRooms] = useState(1);
    const [Aduts, setAduts] = useState(1);
    const [Child, setChild] = useState(0);
    const [Open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState({});
    const [Title, setTitle] = useState(globalState?.userEmail);
    const [Terms, setTerms] = useState(false);
    const TitleData = [
        { label: 'Mr', value: 'Mr' },
        { label: 'Mrs', value: 'Mrs' },
        { label: 'Miss', value: 'Miss' },

    ];


    const handleDayPress = (day) => {
        const selectedDate = day.dateString;

        if (!startDate) {
            // First date selected, set as start date
            setStartDate(selectedDate);
            setSelectedDates({
                [selectedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
            });
        } else if (!endDate) {
            // Second date selected, set as end date
            if (selectedDate < startDate) {
                Alert.alert('Invalid Date', 'End date cannot be before start date.');
                return;
            }
            setEndDate(selectedDate);

            // Mark the selected range (start date to end date)
            const range = getRangeDates(startDate, selectedDate);
            const markedDates = {};
            range.forEach((date) => {
                markedDates[date] = {
                    selected: true,
                    selectedColor: 'blue',
                    selectedTextColor: 'white',
                };
            });

            setSelectedDates(markedDates);
            setOpen(!Open);

            // console.log(startDate,endDate);


        } else {
            // If both dates are already selected, reset
            setStartDate(selectedDate);
            setEndDate(null);
            setSelectedDates({
                [selectedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
            });
        }
        // handleconvertDateFormat(startDate,endDate);

    };

    // Function to get the range of dates between start and end date
    const getRangeDates = (start, end) => {
       // console.log(start);

        const startDate = new Date(start);
        const endDate = new Date(end);
        const dates = [];

        while (startDate <= endDate) {
            dates.push(startDate.toISOString().split('T')[0]); // Get the date in YYYY-MM-DD format
            startDate.setDate(startDate.getDate() + 1);
        }

        return dates;
    };

    const handleBooking = async (HotelId, pax) => {
        let payload = JSON.stringify({
            hotelId: HotelId,
            roomId: "",
            userDetails: {
                email: Email,
                mobile: Phone,
                roomPaxDetails: [
                    {
                        paxDetails: pax
                    }
                ]
            },
            adults: Aduts,
            children: Child,
            checkIn: startDate,
            checkOut: endDate,
            paymentDetails: [

            ]
        });
        try {
            let { data: res } = await GetBookingFSHotel(payload);
             //console.log('datadagaRoom', res?.data);

            // setSearchInfo(res?.data?.searchInfo);
            if (res?.success) {
                setModalVisibleRS(true);



            }
        } catch (error) {
            if (error?.response) {
                console.log('Response Error', error?.response?.data);
                Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
            } else if (error?.request) {
                // console.log('Request error:', ${JSON.stringify(error?.request)});
                Alert.alert('Request Error:', 'Please Check Your Internet Connection');
                // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
            } else {
                //  console.log('error');
                Alert.alert('Error:', `${error}`);
            }
        }

    }



    useEffect(() => {
        //console.log(globalState?.HotelUserDetails?.Adult );
        
      if (globalState?.HotelUserDetails?.Adult != undefined && globalState?.HotelUserDetails?.Children != undefined && globalState?.HotelUserDetails?.rooms != undefined && globalState?.HotelUserDetails?.checkOutDate != undefined && globalState?.HotelUserDetails?.checkInDate != undefined) {
          setAduts(globalState?.HotelUserDetails?.Adult.toString());
          setChild(globalState?.HotelUserDetails?.Children.toString());
          setRooms(globalState?.HotelUserDetails?.Adult.toString());
          setStartDate(globalState?.HotelUserDetails?.checkInDate);
          setEndDate(globalState?.HotelUserDetails?.checkOutDate);
          //console.log(globalState?.HotelUserDetails?.checkInDate);
          
      }
      else {
          const date = new Date();
          const formattedDateStart = date.toISOString().split('T')[0];
          date.setDate(date.getDate() + 1); // Add 1 day
          const formattedDateEnd = date.toISOString().split('T')[0];
          setStartDate(formattedDateStart);
          setEndDate(formattedDateEnd);
      }


  }, []);








    return (
         <SafeAreaView style={{flex: 1,}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:15}}>
                <TouchableOpacity style={{ flex: 1 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Icon name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                <Text style={{fontSize: 15,fontFamily: 'WorkSans-SemiBold',color: '#000000'}}>My Bookings</Text>
                <View style={{width:120}}></View>
            </View>
            <ScrollView style={{ backgroundColor: '#FFFFFF', width: '100%', padding: 20 }}>
                <View style={{ paddingVertical: 10 }}>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 16,
                            fontFamily: "Montserrat-Bold",
                        }}>
                        I am booking for
                    </Text>
                </View>

                <View style={{ paddingBottom: 10, flexDirection: 'row', borderBottomColor: '#F0EFFB', borderBottomWidth: 1, }}>
                    <TouchableOpacity
                        onPress={() => {
                            setBookingFor('Myself');
                            setName(globalState?.userName);
                            setPhone(globalState?.userDetails?.phoneNumber);
                            setEmail(globalState?.userEmail);
                            //navigation.navigate('TermsAndCondition');
                        }} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
                        {BookingFor == 'Myself' ? <Icon name="radio-button-on" size={25} color={'#0E2038'} /> : <Icon name="radio-button-off" size={25} color={'#000'} />}
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 14,
                                fontFamily: "Montserrat-Medium",
                                paddingLeft: 5
                            }}>
                            Myself
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setBookingFor('Someone else');
                            setName('');

                            setPhone('');
                            setEmail('');

                            //navigation.navigate('TermsAndCondition');
                        }} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 20 }}>
                        {BookingFor == 'Someone else' ? <Icon name="radio-button-on" size={25} color={'#0E2038'} /> : <Icon name="radio-button-off" size={25} color={'#000'} />}
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 14,
                                fontFamily: "Montserrat-Medium",
                                paddingLeft: 5
                            }}>
                            Someone else
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text
                    style={{
                        color: '#000000',
                        fontSize: 14,
                        fontFamily: 'WorkSans-Medium',
                        // paddingLeft: 10,
                        paddingTop: 20,
                        paddingBottom: 10
                    }}>
                    Check-in date - Check-out date
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        setOpen(!Open);


                    }}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        paddingVertical: 16,
                        paddingHorizontal: 10,
                        borderColor: '#ADB2B8',
                        borderWidth: 1,
                        borderRadius: 10,
                        // marginTop: 20,
                        width: '100%',
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {/* <IconF name="calendar" size={15} color={'#000'} /> */}
                        <Text style={{ fontSize: 12, fontFamily: "WorkSans-Medium", color: '#1A1A1A' }}>
                            {startDate ? startDate.split('-').reverse().join('/') : ''} - {endDate ? endDate.split('-').reverse().join('/') : ''}
                        </Text>
                    </View>
                    <IconF name="calendar" size={20} color={'#000'} />
                </TouchableOpacity>
                <CalenderAcc visible={Open} handleDayPress={handleDayPress} selectedDates={selectedDates} />




                <View style={{ paddingVertical: 10 }}>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            // paddingLeft: 10,
                            paddingBottom: 10
                        }}>
                        No.of Rooms
                    </Text>
                    <View style={[styles.input, {}]}>


                        <TextInput
                            style={{
                                width: '100%',
                                height: 45,
                                paddingHorizontal: 10,
                            }}

                            placeholder="1"
                            value={Rooms}
                            keyboardType={'numeric'}
                            maxLength={10}
                            placeholderTextColor={'#000'}
                            onChangeText={txt => {
                                setRooms(txt);
                            }}

                        />

                    </View>
                </View>

                <View style={{ paddingVertical: 10 }}>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            // paddingLeft: 10,
                            paddingBottom: 10
                        }}>
                        No.of Adults
                    </Text>
                    <View style={[styles.input, {}]}>


                        <TextInput
                            style={{
                                width: '100%',
                                height: 45,
                                // paddingLeft: 30,
                                color: '#1E2135',
                                paddingHorizontal: 10,
                                fontFamily: 'Poppins-Regular',
                            }}
                            placeholder="1"
                            keyboardType={'numeric'}
                            placeholderTextColor={'#000'}
                            value={Aduts}
                            onChangeText={txt => {
                                setAduts(txt);
                            }}
                        />

                    </View>
                </View>

                <View style={{ paddingVertical: 10 }}>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            // paddingLeft: 10,
                            paddingBottom: 10
                        }}>
                        No.of Children
                    </Text>
                    <View style={[styles.input, {}]}>


                        <TextInput
                            style={{
                                width: '100%',
                                height: 45,
                                // paddingLeft: 30,
                                color: '#1E2135',
                                paddingHorizontal: 10,
                                fontFamily: 'Poppins-Regular',
                            }}
                            placeholder="0"
                            keyboardType={'numeric'}
                            // multiline
                            placeholderTextColor={'#000'}
                            value={Child}
                            onChangeText={txt => {
                                setChild(txt);
                            }}
                        />

                    </View>
                </View>
















                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingTop: 15 }}>
                    <View style={{ width: '25%' }}>
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 14,
                                fontFamily: 'WorkSans-Medium',
                                paddingLeft: 5,
                                paddingBottom: 10
                            }}>
                            Title
                        </Text>
                        <View style={{ width: '100%' }}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                // inputSearchStyle={styles.inputSearchStyle}
                                // iconStyle={styles.iconStyle}
                                itemTextStyle={styles.itemTextStyle}
                                data={TitleData}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Mr"
                                //  searchPlaceholder="Search..."
                                value={Title}
                                onChange={item => {
                                    setTitle(item.value);
                                }}

                            />
                        </View>
                    </View>
                    <View style={{ width: '100%' }}>
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 14,
                                fontFamily: 'WorkSans-Medium',
                                paddingLeft: 10,
                                paddingBottom: 10
                            }}>
                            Full Name
                        </Text>
                        <View style={[styles.input, { marginLeft: 10, width: '70%' }]}>


                            <TextInput
                                style={{
                                    width: '100%',
                                    height: 45,
                                    // paddingLeft: 30,
                                    color: '#1E2135',
                                    paddingHorizontal: 10,
                                    fontFamily: 'Poppins-Regular',
                                }}
                                placeholder="Full Name"

                                // multiline
                                placeholderTextColor={'#000'}
                                value={Name}
                                onChangeText={txt => {
                                    setName(txt);
                                }}
                            />

                        </View>
                    </View>

                </View>
                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>Mobile Number</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>

                    {/* <TouchableOpacity onPress={() => {

                        setShow(true);
                    }} style={{ flexDirection: 'row', borderColor: '#010101', borderRadius: 5, paddingHorizontal: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'WorkSans-Medium',
                            color: '#000000',
                        }}>{countryCode}</Text>
                        <Icon name={'caret-down'} size={16} color={'#333333'} />
                    </TouchableOpacity> */}
                    <View style={[styles.input, { width: '100%' }]}>
                        <TextInput
                            style={{
                                width: '100%',
                                height: 45,
                                paddingLeft: 15,
                                color: '#1E2135',
                                fontFamily: 'Poppins-Regular',
                            }}
                            placeholder="Enter your phone no."
                            placeholderTextColor={'#000'}
                            value={Phone}
                            onChangeText={txt => {
                                setPhone(txt);
                            }}
                        />
                    </View>
                </View>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 25,
                    paddingBottom: 10

                }}>Emai Id</Text>
                <View style={styles.input}>
                    {/* <View
                                        style={{
                                            justifyContent: 'flex-start',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: '100%',
                                         
                                            // paddingVertical: 5,
                                        }}> */}

                    <TextInput
                        style={{
                            width: '100%',
                            height: 45,
                            // paddingLeft: 30,
                            paddingHorizontal: 10,
                            color: '#1E2135',
                            fontFamily: 'Poppins-Regular',
                        }}
                        placeholder="Enter your email id"

                        // multiline
                        placeholderTextColor={'#000'}
                        value={Email}
                        onChangeText={txt => {
                            setEmail(txt);
                        }}
                    />

                    {/* </View> */}
                </View>



                <View
                    style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        padding: 5,
                        alignItems: 'center',
                        marginTop: 15,
                        width: '100%',
                        flex: 1,
                        // marginHorizontal: 15
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            setTerms(!Terms);
                        }}>
                        <View style={styles.option}>
                            <View style={[styles.checkbox, { backgroundColor: Terms == true ? '#0E2038' : '#FFFFFF', borderWidth: 1, borderColor: '#0E2038' }]}>
                                {Terms && (
                                    <IconAntDesign name="check" size={15} color="#FFFFFF" />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text
                        style={{
                            color: '#1E2135',
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 12,
                            paddingLeft: 5
                        }}>
                        I agree to
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Privacy');
                        }}>

                        <Text
                            style={{
                                color: '#566B77',
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 12,
                            }}>
                            {' '}
                            Privacy Policy, User 
                        </Text>
                    </TouchableOpacity>




                </View>

                <View
                    style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        // padding: 5,
                        // marginVertical: 15,
                        width: '100%',
                        flex: 1,
                        marginHorizontal: 40
                    }}>
                            <Text
                        style={{
                            color: '#566B77',
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 12,
                        }}>
                       Agreement
                    </Text>
                      
                    <Text
                        style={{
                            color: '#1E2135',
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 12,
                        }}>
                        {' '}
                        &{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('TermsAndCondition');
                        }}>
                        <Text
                            style={{
                                color: '#566B77',
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 12,
                            }}>
                            {' '}
                            Terms of Services{' '}
                        </Text>
                    </TouchableOpacity>
                </View>




                <View style={{ marginHorizontal: 20, }}>

                    <TouchableOpacity
                        disabled={!Terms}
                        style={{
                            backgroundColor: Terms == false ? '#AEAEAE' : '#0E2038',
                            flex: 1,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 10,
                            width: '100%',
                            marginTop: 30,

                            marginBottom: 80
                            // padding: 15,
                        }}
                        onPress={() => {

                            const generatedObjects = [];
                            // console.log('globalState?.Adult', globalState?.Adult);


                            for (let i = 0; i < Aduts; i++) {
                                generatedObjects.push({
                                    title: "Mr.",
                                    passengerType: "ADULT",
                                    lastName: Name,
                                    firstName: Name
                                });
                            };
                            handleBooking(HotelId, generatedObjects);


                        }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Poppins-Medium',
                                color: '#FFFFFF',
                            }}>
                            Book Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleRS}
                onRequestClose={() => {
                    setModalVisibleRS(false);
                }
                }
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {/* Loader Icon */}
                        <Image
                            style={{
                                width: width * 0.9,
                                height: 80,
                            }}
                            resizeMode='contain'
                            source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/Confirm.png', }}
                                       
                        //  source={require('./assets/Reco.png')}
                        />

                        {/* Processing Text */}
                        <Text style={styles.modalTitle}>Booking Request Confirmed!</Text>
                        <Text style={styles.modalSubtitle}>
                            Booking Request Received! A confirmation email and SMS will be sent to your registered email ID and phone number shortly. Thank you for choosing us!
                        </Text>

                        {/* Okay Button */}
                        <TouchableOpacity
                            style={styles.okayButton}
                            onPress={() => {

                                setModalVisibleRS(false);
                                navigation.navigate('HomePage');
                            }}
                        >
                            <Text style={styles.okayButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({


    option: {
        flexDirection: 'row',
        alignItems: 'center',
        //width:'100%'
    },
    checkbox: {
        height: 22,
        width: 23,
        backgroundColor: '#021265',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'

    },
    dropdown: {
        //  marginHorizontal:3,
        // marginVertical: 10,
        // height: 50,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        padding: 11,
        justifyContent: 'center',
        borderColor: '#010101',
        borderWidth: 1,

    },

    input: {
        borderColor: '#010101',
        borderWidth: 0.9,
        borderRadius: 5,
        fontFamily: 'Barlow-Medium',
        fontSize: 16,

    },
    selectedTextStyle: {
        color: '#000000'
    },
    itemTextStyle: {
        color: '#000000'
    },

    placeholderStyle: {
        fontSize: 14,
        fontFamily: 'WorkSans-Medium',
        color: '#000000',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        color: '#000',
        marginTop: 20,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#000000',
        marginTop: 10,
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: 20,
    },
    okayButton: {
        marginTop: 20,
        backgroundColor: '#0E2038',
        paddingVertical: 12,
        // paddingHorizontal: 0,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center'
    },
    okayButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});