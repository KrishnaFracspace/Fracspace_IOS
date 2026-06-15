import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground,
    Modal,
    TextInput,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Feather';
import Icc from 'react-native-vector-icons/Entypo';
import Ic from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { AppContext } from '../../Context/AppContext';
import { EnquiryForCreditUsage } from '../../Services/UserApi';
import { Calendar } from 'react-native-calendars';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MembershipProprtyDesc = (props) => {
    const [hotelData, setHotelData] = useState(props?.route?.params?.data);
    const [status, setStatus] = useState(props?.route?.params?.status);
    const [membershipType, setMembershipType] = useState(props?.route?.params?.membershipType);
    const [propertyType, setPropertyType] = useState(props?.route?.params?.propertyType);
    // console.log("status: ", props?.route?.params?.status);

    const { globalState, setGlobalState } = useContext(AppContext);
    const [infoVisible, setInfoVisible] = useState(false);
    const [agree, setAgree] = useState(false);

    const [name, setName] = useState(globalState?.userDetails?.userName);
    const [number, setNumber] = useState(globalState?.userDetails?.phoneNumber);
    const [email, setEmail] = useState(globalState?.userDetails?.email);
    const [numOfAdult, setNumOfAdult] = useState(1);
    const [numOfChildren, setNumOfChildren] = useState(0);
    const [visible2, setVisible2] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [guestModal, setGuestModal] = useState(false);
    const navigation = useNavigation();

    const isStatusActive = status?.toLowerCase()?.trim() === 'active';
    const isSilver = membershipType?.toLowerCase()?.trim() === 'escape silver';
    const isInternational = propertyType?.toLowerCase()?.trim() === 'international';
    const isButtonDisabled = !isStatusActive || (isSilver && isInternational);

    const submitUsage = async () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        let payload = JSON.stringify({
            name: globalState?.userDetails?.userName,
            email: globalState?.userDetails?.email,
            phoneNumber: globalState?.userDetails?.phoneNumber,
            propertyName: hotelData?.name,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            guestCount: numOfAdult + numOfChildren,
            adults: numOfAdult,
            children: numOfChildren
        })
        console.log("Payload: ", payload);
        try {
            let { data: res } = await EnquiryForCreditUsage(payload);
            if (res?.success) {
                console.log('Response: ', res);
                setVisible2(true);
                setInfoVisible(false);
            }
        } catch (error) {
            console.log("Error in submiting form: ", error?.response?.data || error?.response?.message);
        }
    }

    const validateForm = () => {
        if (!name?.trim()) {
            Alert.alert('Validation Error', 'Please enter Full Name');
            return false;
        }

        if (!email?.trim()) {
            Alert.alert('Validation Error', 'Please enter Email');
            return false;
        }

        if (!number?.trim()) {
            Alert.alert('Validation Error', 'Please enter Phone number');
            return false;
        }

        if (!checkInDate?.trim()) {
            Alert.alert('Validation Error', 'Please enter CheckIn Date');
            return false;
        }

        if (!checkOutDate?.trim()) {
            Alert.alert('Validation Error', 'Please enter CheckOut Date');
            return false;
        }

        if (numOfAdult == 0) {
            Alert.alert('Validation Error', 'Please select Number of guest.');
            return false;
        }

        return true;
    };

    const handleDayPress = (day) => {
        const date = day.dateString;

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // Set new check-in date and reset check-out
            setCheckInDate(date);
            setCheckOutDate(null);
            setSelectedDates({ [date]: { startingDay: true, color: "#f5a623", textColor: "#fff" } });
        } else if (!checkOutDate && moment(date).isAfter(checkInDate)) {
            // Set check-out date
            setCheckOutDate(date);
            highlightRange(checkInDate, date);
        }
    };

    // Highlight selected range
    const highlightRange = (start, end) => {
        let range = {};
        let currentDate = moment(start);

        while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
            const dateStr = currentDate.format("YYYY-MM-DD");
            range[dateStr] = {
                color: dateStr === start ? "#f5a623" : dateStr === end ? "#f5a623" : "#ffe4b2",
                textColor: "#fff",
                startingDay: dateStr === start,
                endingDay: dateStr === end,
            };
            currentDate.add(1, "day");
        }

        setSelectedDates(range);
        setShowCalendar(!showCalendar);
        setInfoVisible(true);


    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3EE' }}>
            <View style={styles.mainContainer}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#000'} />
                <ImageBackground source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Escape+Stay+BG.png' }} style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}>

                        {/* Back Button */}
                        <TouchableOpacity onPress={() => { navigation.goBack() }} activeOpacity={0.8} style={styles.backButton}>
                            <Icon name="chevron-back" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Gallery Section */}
                        <View style={styles.galleryContainer}>
                            <Image source={{ uri: hotelData?.images[0] }} style={styles.bigImage} />

                            {/* Right Images */}
                            <View style={styles.rightContainer}>
                                <Image source={{ uri: hotelData?.images[1] }} style={styles.topRightImage} />
                                <View style={styles.bottomRightRow}>
                                    <Image source={{ uri: hotelData?.images[2] }} style={styles.bottomSmallImage} />

                                    {/* View All Card */}
                                    <TouchableOpacity activeOpacity={0.9} style={{ width: '50%' }}>
                                        <Image source={{ uri: hotelData?.images[3] }} style={styles.viewAllImage} />
                                        {/* <View style={styles.viewAllOverlay}>
                                        <Text style={styles.viewAllText}>+4</Text>
                                        <Text style={styles.viewAllText}>View all</Text>
                                    </View> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Title */}
                        <Text style={styles.propertyTitle}>{hotelData?.name}</Text>

                        {/* Location */}
                        <View style={styles.locationRow}>
                            <Icon name="location-outline" size={12} color="#B8995A" />
                            <Text style={styles.locationText}>{hotelData?.location?.address}</Text>
                        </View>

                        {/* Description + Credit Card */}
                        <View style={styles.descriptionRow}>

                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={showFullDesc ? undefined : 4} style={styles.descriptionText}>
                                    {hotelData?.description}
                                </Text>
                                <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)} activeOpacity={0.8}>
                                    <Text style={styles.readMore}>{showFullDesc ? 'Read less' : 'Read More'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Credit Card */}
                            <View style={styles.creditCard}>
                                <Text style={styles.creditLabel}>Credit/Night</Text>
                                <View style={styles.creditBottom}>
                                    <Text style={styles.creditNumber}>1</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome6 name="coins" size={12} color="#F5B000" />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Amenities */}
                        <Text style={styles.sectionTitle}>Amenities</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amenitiesContainer} >
                            {hotelData?.amenities?.map((item, index) => (
                                <View key={index} style={styles.amenityCard}>
                                    {/* <FontAwesome6
                                name={item.icon}
                                size={18}
                                color="#C6A45E"
                                solid
                            /> */}
                                    <Image source={{ uri: item?.icon }} style={{ width: 18, height: 18 }} />
                                    <Text style={styles.amenityText}>{item?.text}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Nearby Places */}
                        <Text style={styles.sectionTitle}>Nearby Places</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearbyContainer}>
                            {hotelData?.nearByPlaces?.map((item, index) => (
                                <View key={index} style={styles.placeCard}>
                                    <View>
                                        <Image source={{ uri: item.image }} style={styles.placeImage} />
                                        {/* <View style={styles.distanceBadge}>
                                        <Text style={styles.distanceText}>{item.distance}</Text>
                                    </View> */}
                                    </View>
                                    <View style={styles.placeContent}>
                                        <Text style={styles.placeTitle}>{item.name}</Text>
                                        <Text style={styles.placeSubtitle}>{item.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Bottom Card */}
                        <View style={styles.bottomCard}>
                            <View style={styles.creditInfo}>
                                <View style={styles.creditIconContainer}>
                                    <FontAwesome6 name="coins" size={15} color="#F5B000" solid />
                                </View>
                                <View>
                                    <Text style={styles.availableText}>Your Available Credits</Text>
                                    <Text style={styles.creditCount}>4 Credits</Text>
                                </View>
                            </View>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => { setInfoVisible(true) }} >
                                <View style={{
                                    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: isButtonDisabled ? '#000000B3' : '#AC935C'
                                }}>
                                    <Text style={styles.checkButtonText}>
                                        {isButtonDisabled ? 'Members Only' : 'Check Availability'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                    <Modal visible={infoVisible} transparent animationType='fade'>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1, width: '100%', }}
                        >
                            {/*  */}
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => { setInfoVisible(false) }} style={{ backgroundColor: '#00000080', flex: 1 }} />
                                <ImageBackground
                                    resizeMode='cover'
                                    borderRadius={20}
                                    source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/EscapeBG.png' }}
                                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.6, width: width, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFF' }}
                                >
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TouchableOpacity onPress={() => {
                                                setInfoVisible(false);
                                            }}>
                                                <Icon name={'chevron-back'} size={20} color={'#000'} />
                                            </TouchableOpacity>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', alignSelf: 'center' }}>Check Availability </Text>
                                            <View style={{ width: 20 }} />
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Full Name</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 5, padding: 12 }}>
                                                <TextInput
                                                    placeholder='John Doe'
                                                    placeholderTextColor={'#00000066'}
                                                    value={name}
                                                    onChangeText={setName}
                                                    style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Mobile Number</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, padding: 12, borderRadius: 5, marginTop: 5 }}>
                                                <TextInput
                                                    placeholder='+91 1234567890'
                                                    placeholderTextColor={'#00000066'}
                                                    value={number}
                                                    onChangeText={setNumber}
                                                    keyboardType='number-pad'
                                                    style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Email ID</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, padding: 12, borderRadius: 5, marginTop: 5 }}>
                                                <TextInput
                                                    placeholder='johndoe@gmail.com'
                                                    placeholderTextColor={'#00000066'}
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Check-In Date</Text>
                                                <TouchableOpacity onPress={() => {
                                                    setShowCalendar(true);
                                                    setInfoVisible(false);
                                                }} style={{ borderColor: '#00000066', borderWidth: 0.5, padding: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 5, marginTop: 5, justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10 }}>
                                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>
                                                        {checkInDate ? moment(checkInDate).format("DD MMM YYYY") : "Check-In"}
                                                    </Text>
                                                    <Icon name={'calendar-outline'} size={15} color={'#AC935C'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, marginLeft: 15 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Check-Out Date</Text>
                                                <TouchableOpacity onPress={() => {
                                                    setShowCalendar(true);
                                                    setInfoVisible(false);
                                                }} style={{ borderColor: '#00000066', borderWidth: 0.5, padding: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 5, marginTop: 5, justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10 }}>
                                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>
                                                        {checkOutDate ? moment(checkOutDate).format("DD MMM YYYY") : "Check-Out "}
                                                    </Text>
                                                    <Icon name={'calendar-outline'} size={15} color={'#AC935C'} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Select Guests</Text>
                                            <TouchableOpacity onPress={() => {
                                                setGuestModal(true);
                                                setInfoVisible(false);
                                            }} style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 5, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', padding: 12 }}>
                                                {/* <TextInput 
                                            placeholder='2 Adults | 1 Child'
                                            placeholderTextColor={'#00000066'}
                                            // value={accHolName}
                                            // onChangeText={setAccHolName}
                                            style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',flex:1}}
                                        /> */}
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', flex: 1 }}>
                                                    {numOfAdult == 0 ? '' : `${numOfAdult} Adult`}
                                                    {numOfChildren == 0 ? '' : ` . ${numOfChildren} Children `}
                                                </Text>
                                                <Ico name={'users'} size={15} color={'#AC935C'} />
                                            </TouchableOpacity>
                                        </View>

                                        {/* <View style={{flexDirection:'row',alignItems:'center',marginTop:25}}>
                                    <TouchableOpacity onPress={() => {
                                        setAgree(!agree);
                                    }}>
                                        {agree ? 
                                            <Icon name={'checkbox'} size={20} color={'#021265'}/>
                                            :
                                            <Icon name={'square-outline'} size={20} color={'#000'}/>
                                        }
                                    </TouchableOpacity>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginLeft:7}}>I agree to the <Text style={{fontFamily:'WorkSans-SemiBold'}}>Terms & Conditions</Text> and <Text style={{fontFamily:'WorkSans-SemiBold'}}>Privacy Policy</Text></Text>
                                </View> */}

                                        <TouchableOpacity onPress={() => {
                                            submitUsage();
                                        }} style={{ backgroundColor: '#AC935C', borderRadius: 5, padding: 10, alignItems: 'center', marginTop: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#FFF' }}>Continue →</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </ImageBackground>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <Modal visible={visible2} transparent animationType="fade">
                        <TouchableOpacity onPress={() => {
                            setVisible2(false);
                        }} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', }}>
                            <View style={{ width: width * 0.8, backgroundColor: '#f6f6f6', borderRadius: 12, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, }}>
                                <FastImage
                                    source={require('../assets/TickAnim.gif')}
                                    style={{ width: 115, height: 115, alignSelf: 'center' }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, opacity: 0.8, color: '#000000', textAlign: 'center' }}>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Thank you</Text> for enquiring with Fracspace Escape. Our concierge team will reach out soon to help you plan your <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>perfect escape.</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <Modal visible={showCalendar} transparent animationType='fade'>
                        <View style={{ flex: 1, backgroundColor: '#000000B3' }}>
                            <TouchableOpacity onPress={() => {
                                setShowCalendar(false);
                                setInfoVisible(true);
                            }} style={{ flex: 1 }} />
                            <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 30, paddingTop: 10, paddingBottom: 40, borderWidth: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <Text style={{ flex: 1, fontFamily: 'Montserrat-SemiBold', fontSize: 17, color: '#000000' }}>Select Date</Text>
                                    <TouchableOpacity style={{ paddingVertical: 5, flex: 1, alignItems: 'flex-end' }} onPress={() => {
                                        setShowCalendar(!showCalendar);
                                        setInfoVisible(true);
                                    }}>
                                        <Icc name={'cross'} size={20} color={'#000000'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{}}>
                                    <Calendar
                                        onDayPress={handleDayPress}
                                        markingType="period"
                                        markedDates={selectedDates}
                                        minDate={moment().format("YYYY-MM-DD")}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal transparent animationType='fade' visible={guestModal} modalStyle={{ width: '100%', }}>
                        <View style={{ flex: 1, backgroundColor: '#000000B3' }}>
                            <TouchableOpacity onPress={() => {
                                setInfoVisible(true);
                                setGuestModal(false);
                            }} style={{ flex: 1 }} />
                            <ScrollView style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, }}>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#000000' }}>Select Numbers of Guests</Text>
                                </View>
                                <View style={{ paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000000' }}>Adults</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#262626CC' }}>Age 18 or above</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => {
                                            if (numOfAdult > 0)
                                                setNumOfAdult(numOfAdult - 1);
                                        }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Ic name={'minus'} size={15} color={'#0D2038'} />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000' }}>{numOfAdult}</Text>
                                        <TouchableOpacity onPress={() => {
                                            if (numOfAdult < 20)
                                                setNumOfAdult(numOfAdult + 1);
                                        }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AC935C' }}>
                                            <Ic name={'plus'} size={15} color={'#FFF'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000000' }}>Children</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#262626CC' }}>Age 0-17 years old</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => {
                                            if (numOfChildren > 0)
                                                setNumOfChildren(numOfChildren - 1);
                                        }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Ic name={'minus'} size={15} color={'#0D2038'} />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000' }}>{numOfChildren}</Text>
                                        <TouchableOpacity onPress={() => {
                                            if (numOfChildren < 20)
                                                setNumOfChildren(numOfChildren + 1);
                                        }} style={{ borderWidth: 0.6, borderColor: '#62626233', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AC935C' }}>
                                            <Ic name={'plus'} size={15} color={'#FFF'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setInfoVisible(true);
                                    setGuestModal(!guestModal);
                                }} style={{ marginBottom: 20, backgroundColor: '#AC935C', borderRadius: 30, padding: 10, alignItems: 'center', marginHorizontal: 60, marginVertical: 20 }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Apply</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Modal>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default MembershipProprtyDesc;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F7F3EE',
    },

    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.12,
    },

    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 20,
    },

    backButton: {
        width: 30,
        height: 30,
        borderRadius: 24,
        backgroundColor: '#8D8D8D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    galleryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    bigImage: {
        width: width * 0.49,
        height: 204,
        borderRadius: 10,
    },

    rightContainer: {
        width: width * 0.39,
        marginLeft: 8,
        justifyContent: 'space-between',
    },

    topRightImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },

    bottomRightRow: {
        flexDirection: 'row', marginTop: 5
    },

    bottomSmallImage: {
        width: '50%',
        height: 100,
        borderRadius: 10
    },

    viewAllImage: {
        // width: '100%',
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginLeft: 5
    },

    viewAllOverlay: {
        position: 'absolute',
        width: '100%',
        backgroundColor: '#00000080',
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center', marginLeft: 5
    },

    viewAllText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'WorkSans-Medium',
    },

    propertyTitle: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Montserrat-SemiBold',
        marginTop: 15,
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    locationText: {
        marginLeft: 5,
        color: '#00000080',
        fontSize: 12,
        fontFamily: 'WorkSans-Regular',
    },

    descriptionRow: {
        flexDirection: 'row',
        marginTop: 10,
    },

    descriptionText: {
        color: '#000',
        fontSize: 12,
        // lineHeight: 40,
        fontFamily: 'WorkSans-Regular',
        paddingRight: 10,
    },

    readMore: {
        color: '#AC935C',
        fontSize: 12,
        marginTop: 1,
        fontFamily: 'WorkSans-Medium',
    },

    creditCard: {
        borderWidth: 1,
        borderColor: '#AC935C4D',
        borderRadius: 5,
        paddingHorizontal: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF8F5',
    },

    creditLabel: {
        color: '#00000080',
        fontSize: 10,
        fontFamily: 'WorkSans-Regular',
    },

    creditBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: 5,
    },

    creditNumber: {
        fontSize: 20,
        color: '#000',
        marginRight: 8,
        fontFamily: 'WorkSans-SemiBold',
    },

    sectionTitle: {
        fontSize: 14,
        color: '#000',
        marginTop: 15,
        marginBottom: 10,
        fontFamily: 'Montserrat-SemiBold',
    },

    amenitiesContainer: {
        borderWidth: 1,
        borderColor: '#E3DED7',
        borderRadius: 10,
        overflow: 'hidden',
    },

    amenityCard: {
        // width: 140,
        // height: 75,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#E3DED7',
        backgroundColor: '#FBFAF8',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    amenityText: {
        color: '#021265',
        fontSize: 12,
        textAlign: 'center',
        // marginTop: 10,
        fontFamily: 'WorkSans-Medium',
        marginLeft: 7
    },

    nearbyContainer: {
        paddingBottom: 10,
    },

    placeCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E7E2DB',
    },

    placeImage: {
        width: '100%',
        height: 80,
    },

    distanceBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFFFFF66',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        textAlign: 'center'
    },

    distanceText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'WorkSans-Medium',
    },

    placeContent: {
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    placeTitle: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'WorkSans-Medium',
    },

    placeSubtitle: {
        color: '#00000080',
        fontSize: 10,
        // marginTop: 3,
        fontFamily: 'WorkSans-Regular',
    },

    bottomCard: {
        marginTop: 15,
        backgroundColor: '#f6f6f6',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 0.1,
        // borderColor: '#AC935C',
    },

    creditInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    creditIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 23,
        backgroundColor: '#AC935C1A',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    availableText: {
        color: '#8B8B8B',
        fontSize: 10,
        fontFamily: 'WorkSans-Regular',
    },

    creditCount: {
        color: '#000',
        fontSize: 14,
        marginTop: 2,
        fontFamily: 'WorkSans-SemiBold',
    },

    checkButton: {
        paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AC935C'

    },

    checkButtonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'WorkSans-Medium',
    },
});
