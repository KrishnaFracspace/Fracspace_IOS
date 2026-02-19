

import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext, useRef } from 'react';
import IconDown from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/Feather';
import IconD from 'react-native-vector-icons/Octicons';
import * as Progress from 'react-native-progress';
import IconC from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-swiper';
import {
  PaymentUPI,
  RentalData,
  SendConfirmationOTP,
  SendConfirmationOTPEmail,
  VerifyOtpAndStoreMessage,
  VerifyOtpAndStoreMessageEmail,
} from './Services/UserApi';
import { AppContext } from './Context/AppContext';
import CustomModal from './CustomModal';
// import RNFetchBlob from 'rn-fetch-blob';
import openMap, { createOpenLink } from 'react-native-open-maps';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from './redux/reducer/homeReducer';

export default function Dashboard(props) {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [OwnedPropertyDetails, setOwnedPropertyDetails] = useState(
    props?.route?.params?.ownedProDetails || [],
  );
  const [selectDetails, setSelectDetails] = useState('Investment Details');
  const [loader, setLoader] = useState(false);
  const [propertyStatu, setPropertyStatu] = useState(
    props?.route?.params?.ownedProDetails?.propertyDetails?.PropertyStatus || 0,
  );
  //console.log(propertyStatu, "======pro=====")
  // const [propertyStatu, setPropertyStatu] = useState('10');
  const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const firstInput = useRef();
  const secoundInput = useRef();
  const thirdInput = useRef();
  const fourInput = useRef();
  const fiveInput = useRef();
  const sixInput = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [Year, setYear] = useState('');
  const [PayOutDetails, setPayOutDetails] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [PropertiesArray, setPropertiesArray] = useState([]);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);
  const [sort, setSort] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [month, setMonth] = useState(false);
  const [monthBy, setMonthBy] = useState('');
  const [yearData, setYearData] = useState(false);
  const [yearBy, setYearBy] = useState('');
  const dispatch = useDispatch();
  const Properties = useSelector(state => state.home.AllProperties);
  const loading = useSelector(state => state.home.loading);
  //  console.log(Properties,"===prp=====")
  // useSelector( state => state.auth?.user?.email);
  const phoneNumber = useSelector(state => state.profile?.user?.phoneNumber);
  const isFetched = useRef(false)
  useEffect(() => {
    dispatch(fetchProperties());
  }, []);
  const createButtonAlert = () =>
    Alert.alert('Ready to part ways?', 'Confirm to sell your Frac now.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleResell() },
    ]);
  const handleResell = async () => {
    setLoader(true);
    if (
      globalState?.userDetails?.phoneNumber.startsWith('+91') &&
      globalState?.userDetails?.phoneNumber.length === 13
    ) {
      let payload = JSON.stringify({
        propertyName: OwnedPropertyDetails?.propertyDetails?.name,
        phoneNumber: globalState?.userDetails?.phoneNumber,
      });
      try {
        let { data: res } = await SendConfirmationOTP(payload);
        if (res?.success) {
          setModalVisible(true);
          setLoader(false);
          //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
          setLoader(false);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert(
            'Request Error:',
            'Please Check Your Internet Connection',
          );
          setLoader(false);
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
          setLoader(false);
        }
      }
    } else {
      let payload = JSON.stringify({
        propertyName: OwnedPropertyDetails?.propertyDetails?.name,
        email: globalState?.userDetails?.email,
      });
      try {
        let { data: res } = await SendConfirmationOTPEmail(payload);
        if (res?.success) {
          setModalVisible(true);
          setLoader(false);
          //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
          setLoader(false);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert(
            'Request Error:',
            'Please Check Your Internet Connection',
          );
          setLoader(false);
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
          setLoader(false);
        }
      }
    }
  };

  const handleResellVerification = async (code, message) => {
    if (
      globalState?.userDetails?.phoneNumber.startsWith('+91') &&
      globalState?.userDetails?.phoneNumber.length === 13
    ) {
      let payload = JSON.stringify({
        phoneNumber: globalState?.userDetails?.phoneNumber,
        otp: code,
        message: message,
      });
      try {
        let { data: res } = await VerifyOtpAndStoreMessage(payload);
        if (res?.success) {
          setModalVisible(false);
          Alert.alert(
            'Thank You for Enquiry',
            `Your ${OwnedPropertyDetails?.propertyDetails?.name} property will be sold within the next 60 days.`,
          );
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert(
            'Request Error:',
            'Please Check Your Internet Connection',
          );
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
        }
      }
    } else {
      let payload = JSON.stringify({
        email: globalState?.userDetails?.email,
        otp: code,
        message: message,
      });
      try {
        let { data: res } = await VerifyOtpAndStoreMessageEmail(payload);
        if (res?.success) {
          setModalVisible(false);
          Alert.alert(
            'Thank You for Enquiry',
            `Your ${OwnedPropertyDetails?.propertyDetails?.name} property will be sold within the next 60 days.`,
          );
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert(
            'Request Error:',
            'Please Check Your Internet Connection',
          );
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
        }
      }
    }
  };

  const [downloading, setDownloading] = useState(false);
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    const imageObject = OwnedPropertyDetails?.propertyDetails?.image || {};
    const imageArray = Object.values(imageObject).filter(Boolean); // removes null/undefined
    setImages(imageArray);
  }, []);

  const extraImages = images.length > 5 ? images.length - 4 : 0;
  const [GestArray, setGestArray] = useState([]);
  const handleGuestUpdate = async () => {
    let payload = JSON.stringify({
      propertyId: OwnedPropertyDetails?.propertyDetails?._id,
    });
    try {
      let { data: res } = await RentalData(payload);
      if (res?.success) {
        setGestArray(res?.data);
      }
    } catch (error) {
      if (error?.response) {
        // Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  useEffect(() => {
    const filteredNumbers = Properties.filter(
      number => number._id == OwnedPropertyDetails?.propertyDetails?._id,
    );
    setPropertiesArray(filteredNumbers[0]);
    if (propertyStatu == 100) {
      handleGuestUpdate();
    }
  }, []);

  const GgoToYosemite = location => {
    openMap({ query: location });
  };
  const handleSmallImagePress = index => {
    setCurrentIndex(index + 1);
    setExpanded(true);
  };

  const formatINR = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const safeStatus = Number(propertyStatu);
  const progress =
    !isNaN(safeStatus) && safeStatus >= 0
      ? Math.min(safeStatus / 100, 1)
      : 0;

const handleResetFilters = () => {
  setSort(false);
  setMonth(false);
  setYearData(false);

  setSortBy(null);
  setMonthBy(null);
  setYearBy(null);
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
        <View style={styles.mainImageContainer}>
          <Swiper
            autoplay={!expanded}
            loop
            showsPagination={false}
            //scrollEnabled={false}
            scrollEnabled={true}
            index={currentIndex}
            onIndexChanged={index => setCurrentIndex(index)}
            autoplayTimeout={3}>
            {images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            ))}
          </Swiper>

          <TouchableOpacity
            onPress={() => expanded ? setExpanded(false) : navigation.goBack()}
            style={{ position: 'absolute', top: 30, left: 20 , backgroundColor: "rgba(0,0,0,0.45)",borderRadius:30}}>
            <Icon name={'chevron-left'} size={30} color={'#FFFFFF'} />
          </TouchableOpacity>


 {/* <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Icon name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
        </View> */}


          <View
            style={[
              styles.bottomImagesContainer,
              expanded && { height: 100, width: width },
            ]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((item, index) => {
                // Show all images if expanded, else only first 4
                if (!expanded && index > 2) return null;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => handleSmallImagePress(index)}
                    style={{ marginRight: expanded ? 10 : -40 }}>
                    <Image
                      source={{ uri: item }}
                      style={[styles.smallImage, currentIndex === index]}
                    />
                  </TouchableOpacity>
                );
              })}

              {!expanded && extraImages > 0 && (
                <TouchableOpacity
                  onPress={() => setExpanded(true)}
                  activeOpacity={0.8}
                  style={{ marginRight: 10 }}>
                  <View style={styles.smallImage}>
                    <Image
                      source={{ uri: images[4] }}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode="contain"
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.moreText}>+{extraImages}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <TouchableOpacity
            onPress={() => {
              setSelectDetails('Property Details');
            }}
            style={{
              borderColor:
                selectDetails === 'Property Details' ? '#021365' : '#DDDEE2',
              borderWidth: selectDetails === 'Property Details' ? 1 : 0,
              backgroundColor:
                selectDetails === 'Property Details' ? '#CCD5F954' : '#F0F0F0',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color:
                  selectDetails === 'Property Details' ? '#021265' : '#8F909D',
              }}>
              Property Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectDetails('Investment Details');
            }}
            style={{
              borderColor:
                selectDetails === 'Investment Details' ? '#021365' : '#DDDEE2',
              borderWidth: selectDetails === 'Investment Details' ? 1 : 0,
              marginLeft: 10,
              backgroundColor:
                selectDetails === 'Investment Details'
                  ? '#CCD5F954'
                  : '#F0F0F0',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'WorkSans-Medium',
                fontSize: 14,
                color:
                  selectDetails === 'Investment Details'
                    ? '#021265'
                    : '#8F909D',
              }}>
              Investment Details
            </Text>
          </TouchableOpacity>
          {propertyStatu == 100 && (
            <TouchableOpacity
              onPress={() => {
                setSelectDetails('Guest Booking Details');
              }}
              style={{
                borderColor:
                  selectDetails === 'Guest Booking Details'
                    ? '#021365'
                    : '#DDDEE2',
                borderWidth: selectDetails === 'Guest Booking Details' ? 1 : 0,
                marginLeft: 10,
                backgroundColor:
                  selectDetails === 'Guest Booking Details'
                    ? '#CCD5F954'
                    : '#F0F0F0',
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 14,
                  color:
                    selectDetails === 'Guest Booking Details'
                      ? '#021265'
                      : '#8F909D',
                }}>
                Guest Booking Details
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>
        <View
          style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, flex: 1 }}>
          <View style={{ marginTop: 0 }}>
            <Text
              style={{
                fontFamily: 'WorkSans-SemiBold',
                fontSize: 22,
                color: '#000000',
              }}>
              {OwnedPropertyDetails?.propertyDetails?.name}
            </Text>
          </View>

          {(OwnedPropertyDetails?.propertyDetails?.name ==
            'FRACSPACE ABODE-I' ||
            OwnedPropertyDetails?.propertyDetails?.name ==
            'FRACSPACE ABODE-II') && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MonthlyInsight', {
                    OwnedPropertyDetails: OwnedPropertyDetails,
                  });
                }}
                style={{
                  backgroundColor: '#FA9F9F38',
                  padding: 20,
                  borderRadius: 15,
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                  }}>
                  📊 Monthly Insight:
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                    color: '#00000091',
                    marginTop: 5,
                  }}>
                  This property has not received any bookings this month.{' '}
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 12,
                      color: '#C12525',
                      textDecorationLine: 'underline',
                    }}>
                    Know more{' '}
                  </Text>
                  to understand the performance insights.
                </Text>
              </TouchableOpacity>
            )}
          {selectDetails === 'Investment Details' && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      resizeMode="contain"
                      source={require('./assets/NewProfileimage.jpg')}
                      style={{ width: 42, height: 40, borderRadius: 30 }}
                    />
                    <Image
                      resizeMode="contain"
                      source={require('./assets/NewProfileimage.jpg')}
                      style={{
                        width: 42,
                        height: 40,
                        borderRadius: 30,
                        marginLeft: -20,
                      }}
                    />
                    <Image
                      resizeMode="contain"
                      source={require('./assets/NewProfileimage.jpg')}
                      style={{
                        width: 42,
                        height: 40,
                        borderRadius: 30,
                        marginLeft: -20,
                      }}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 15,
                        color: '#0F1130',
                      }}>
                      Total Investors
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 12,
                    color: '#000000',
                    paddingRight: 5,
                  }}>
                  {OwnedPropertyDetails?.numberOfOwners} Investors
                </Text>

              </View>

              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 20,
                  elevation: 5,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      marginRight: 15,
                      borderWidth: 2,
                      width: 25,
                      height: 25,
                      borderRadius: 25,
                      borderColor: '#081F62',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconDown
                      name="currency-rupee"
                      size={15}
                      color={'#081F62'}
                    />
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                        color: '#0F113075',
                      }}>
                      Collective Cost
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'WorkSans-SemiBold',
                        fontSize: 12,
                        color: '#081F62',
                      }}>

                      {'\u20B9'} {(OwnedPropertyDetails?.propertyDetails?.Price)}

                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderLeftColor: '#969494',
                    borderLeftWidth: 1,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      marginRight: 15,
                      borderWidth: 2,
                      width: 25,
                      height: 25,
                      borderRadius: 25,
                      borderColor: '#081F62',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconDown
                      name="currency-rupee"
                      size={15}
                      color={'#081F62'}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                        color: '#0F113075',
                      }}>
                      Total Investment
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'WorkSans-SemiBold',
                        fontSize: 12,
                        color: '#081F62',
                      }}>
                      {' '}
                      {'\u20B9'} {OwnedPropertyDetails?.totalInvestment}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  // paddingHorizontal: 20,
                  paddingVertical: 10,
                  paddingBottom: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>Property Status</Text>
                  <Text style={styles.title}>{propertyStatu}%</Text>
                </View>
                <Progress.Bar
                  progress={progress}
                  width={width - 60}
                  borderColor="#043862"
                  color="#043862"
                  borderWidth={1}
                  height={8}
                />


              </View>
              <View
                style={{
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: '#DAE5F336',
                  borderColor: '#B1CEF3',
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#000000',
                    paddingVertical: 10,

                    // paddingBottom: 5,
                  }}>
                  Acquired Fractions
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      color: '#1A1A1A',
                      textAlign: 'left',
                      // paddingBottom: 5,
                    }}>
                    Shares Owned
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      color: '#1A1A1A',
                      opacity: 0.7,
                      // paddingBottom: 5,
                    }}>
                    {OwnedPropertyDetails?.totalSharesOwned?.length || 0}
                  </Text>
                </View>
                {OwnedPropertyDetails?.totalSharesOwned.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        color: '#1A1A1A',
                      }}>
                      Frac {item?.fraction} acquired on
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        color: '#1A1A1A',
                        opacity: 0.7,
                      }}>
                      {item?.installmentDateAndAmount[0]?.date}
                    </Text>
                  </View>
                ))}
              </View>

              {propertyStatu == 100 && (
                <TouchableOpacity
                  onPress={() => {
                    // handleLogOut();
                    navigation.navigate('Enquire', {
                      propertyid: OwnedPropertyDetails?.propertyDetails?.name,
                    });
                  }}
                  style={{
                    // flexDirection: 'row',
                    //justifyContent: 'space-between',
                    backgroundColor: '#F7F9FC',
                    borderColor: '#B1CEF3',
                    borderWidth: 1,
                    padding: 15,

                    marginVertical: 20,
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.title,
                        { paddingBottom: 0, paddingLeft: 0 },
                      ]}>
                      Complimentary Stay
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          backgroundColor: '#759CCE',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 30,
                          width: 30,
                          borderRadius: 30,

                          //marginLeft:50
                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            color: '#ffffff',
                            fontSize: 11,
                            fontFamily: 'Montserrat-SemiBold',
                            //padding:20
                          }}>
                          {' '}
                          {OwnedPropertyDetails?.AvailableFreeStays}/N{' '}
                        </Text>
                      </View>
                      <Icon1 name="chevron-right" size={25} color="#000000" />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {OwnedPropertyDetails?.ownershipDocuments.length != 0 && (
                <View
                  style={{
                    //backgroundColor: 'white',
                    // padding: 10,
                    borderRadius: 10,
                    // marginHorizontal: 30,
                    marginBottom: 20,
                  }}>
                  <Text style={styles.title}>Ownership Documents</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    {OwnedPropertyDetails?.ownershipDocuments.map(
                      (item, index) => (

                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            navigation.navigate('DisplayDoc', { Link: item });
                          }}>
                          {item != '' && (
                            <View style={{}}>
                              <Image
                                style={[
                                  styles.reviewChildLayout,
                                  { marginRight: 20 },
                                ]}
                                resizeMode="contain"
                                source={require('./assets/Agreement.jpeg')}
                              />
                              <Text style={[styles.cardTypo]}>
                                {item.includes('ownershipagreement')
                                  ? 'FOA'
                                  : item.includes('shareholdercertificate')
                                    ? 'SHC'
                                    : ''}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  createButtonAlert();
                }}
                disabled={!OwnedPropertyDetails?.eligibleToResell}
                style={{
                  alignItems: 'center',
                  backgroundColor: !OwnedPropertyDetails?.eligibleToResell
                    ? '#AEAEAE'
                    : '#56018A',
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  marginVertical: 8,
                  // marginHorizontal: 30,
                  marginBottom: 20,
                  justifyContent: 'center',
                }}>
                {loader == true ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontFamily: 'OpenSans-SemiBold',
                    }}>
                    Sell My Frac
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          modalStyle={styles.customModal}>
          <View style={[styles.modal]}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-SemiBold',
                color: '#043862',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {'  '}Enter Code
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
                color: '#1E2135',
                textAlign: 'center',
                paddingTop: 10,
                marginHorizontal: 20,
              }}>
              Enter the code one time password sent to{' '}
              {globalState?.userDetails?.phoneNumber.startsWith('+91') &&
                globalState?.userDetails?.phoneNumber.length === 13
                ? globalState?.userDetails?.phoneNumber
                : globalState?.userDetails?.email}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                padding: 20,
                marginBottom: 10,
              }}>
              <TextInput
                style={{
                  // height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                ref={firstInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  txt && secoundInput.current.focus();
                  setOtp({ ...otp, 1: txt });
                }}
              />
              <TextInput
                style={{
                  //height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                ref={secoundInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  txt ? thirdInput.current.focus() : firstInput.current.focus();
                  setOtp({ ...otp, 2: txt });
                  // setPhone(txt);
                }}
              />
              <TextInput
                style={{
                  // height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                //value={otp.charAt(2)}
                ref={thirdInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  // setPhone(txt);
                  txt
                    ? fourInput.current.focus()
                    : secoundInput.current.focus();
                  setOtp({ ...otp, 3: txt });
                }}
              />
              <TextInput
                style={{
                  //height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                // value={otp.charAt(3)}
                ref={fourInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  // setPhone(txt);\
                  txt ? fiveInput.current.focus() : thirdInput.current.focus();
                  setOtp({ ...otp, 4: txt });
                  //setOtp(otp + txt);
                }}
              />
              <TextInput
                style={{
                  // height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                ref={fiveInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  txt ? sixInput.current.focus() : fourInput.current.focus();
                  setOtp({ ...otp, 5: txt });
                }}
              />
              <TextInput
                style={{
                  //  height: 40,
                  color: '#1E2135',
                  borderWidth: 2,
                  borderColor: '#043862',
                  borderRadius: 5,
                  padding: 15,
                  alignItems: 'center',
                }}
                placeholder=""
                ref={sixInput}
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'#000'}
                onChangeText={txt => {
                  !txt && fiveInput.current.focus();
                  setOtp({ ...otp, 6: txt });
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text></Text>
              <TouchableOpacity
                onPress={() => {
                  handleResell();
                }}>
                <Text
                  style={{
                    color: '#043862',
                    fontSize: 16,
                    fontFamily: 'OpenSans-SemiBold',
                    paddingRight: 20,
                  }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <View style={styles.input}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <TextInput
                    style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                    editable
                    multiline
                    //  numberOfLines={8}
                    placeholder="Reason for Sale"
                    value={message}
                    // placeholderTextColor={'#DADADA'}
                    onChangeText={txt => {
                      setMessage(txt);
                    }}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.labelContainer,
                  {
                    top: -(height * 0.01),
                  },
                ]}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: 16,
                    },
                  ]}>
                  Message
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                const code =
                  otp?.[1] +
                  otp?.[2] +
                  otp?.[3] +
                  otp?.[4] +
                  otp?.[5] +
                  otp?.[6];
                handleResellVerification(code, message);
              }}
              style={{
                alignItems: 'center',
                backgroundColor: '#043862',
                borderRadius: 12,
                marginHorizontal: 20,
                padding: 20,
                marginBottom: 50,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </CustomModal>

        {selectDetails === 'Guest Booking Details' && (
          <View style={{ padding: 20 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: 'row', paddingBottom: 10 }}>
              <View
                style={{
                  borderColor: '#EEF1FD',
                  borderWidth: 1,
                  backgroundColor: '#0F1130',
                  padding: 10,
                  borderRadius: 8,
                }}>
                <IconC name={'funnel-outline'} size={15} color={'#FFFFFF'} />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setSort(!sort);
                }}
                style={{
                  borderColor: '#021265',
                  borderWidth: 1,
                  backgroundColor: '#EEF1FD',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 15,
                    color: '#021265',
                  }}>
                  Sort
                </Text>
                <Icon
                  name={'chevron-down'}
                  size={15}
                  color={'#021265'}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMonth(!month);
                }}
                style={{
                  borderColor: '#021265',
                  borderWidth: 1,
                  backgroundColor: '#EEF1FD',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 15,
                    color: '#021265',
                  }}>
                  Month
                </Text>
                <Icon
                  name={'chevron-down'}
                  size={15}
                  color={'#021265'}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setYearData(!yearData);
                }}
                style={{
                  borderColor: '#021265',
                  borderWidth: 1,
                  backgroundColor: '#EEF1FD',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#021265',
                  }}>
                  Year
                </Text>
                <Icon
                  name={'chevron-down'}
                  size={15}
                  color={'#021265'}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              {(sortBy || monthBy || yearBy) && (
  <TouchableOpacity
    onPress={handleResetFilters}
    style={{
      borderColor: '#D32F2F',
      borderWidth: 1,
      backgroundColor: '#FFEAEA',
      borderRadius: 20,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    }}>
    <Text
      style={{
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 14,
        color: '#D32F2F',
      }}>
      Reset
    </Text>
  </TouchableOpacity>
)}

            </ScrollView>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 18,
                color: '#081F62',
                paddingVertical: 10,
              }}>
              Guest Booking Details
            </Text>

            {(() => {
              const filteredData = [...GestArray]
                // Remove 0 rentals when sorting by amount
                .filter(rental => {
                  if (sortBy === 'Low to High' || sortBy === 'High to Low') {
                    return rental.rentalAmount > 0;
                  }
                  return true;
                })
                // Sort
                .sort((a, b) => {
                  if (sortBy === 'Low to High') {
                    return a.rentalAmount - b.rentalAmount;
                  } else if (sortBy === 'High to Low') {
                    return b.rentalAmount - a.rentalAmount;
                  }
                  return 0;
                })
                // Complimentary stays filter
                .filter(rental => {
                  if (sortBy == 'Complimentary Stays') {
                    return rental.rentalAmount === 0;
                  }
                  return true;
                })
                // Month filter
                .filter(rental => {
                  if (!monthBy) return true;
                  const parts = rental.checkInDate.split('-');
                  const checkIn = new Date(
                    `${parts[2]}-${parts[1]}-${parts[0]}`,
                  );

                  const today = new Date();
                  const cutoff = new Date();
                  cutoff.setMonth(today.getMonth() - monthBy);

                  return checkIn >= cutoff;
                })
                // Year filter
                .filter(rental => {
                  if (!yearBy) return true;
                  const parts = rental.checkInDate.split('-');
                  const checkIn = new Date(
                    `${parts[2]}-${parts[1]}-${parts[0]}`,
                  );
                  const today = new Date();
                  const cutoff = new Date();
                  cutoff.setFullYear(today.getFullYear() - yearBy);

                  return checkIn >= cutoff;
                });

              // Calculate Total Revenue
              const totalRevenue = filteredData.reduce(
                (acc, curr) => acc + (curr.rentalAmount || 0),
                0,
              );

              return (
                <>
                  {/* Total Revenue Box */}
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        backgroundColor: '#ECF7FE',
                        flexDirection: 'row',
                        padding: 10,
                        justifyContent: 'space-between',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'WorkSans-SemiBold',
                          fontSize: 16,
                          color: '#000000',
                        }}>
                        Total Revenue
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'WorkSans-SemiBold',
                          fontSize: 20,
                          color: '#21721F',
                        }}>
                        ₹ {totalRevenue.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {/* Render Filtered Guest Cards */}
                  {filteredData.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#F6F6F6',
                        borderRadius: 10,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                      }}>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Image
                          source={require('./assets/NewProfileimage.jpg')}
                          style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <View style={{ width: '85%', paddingLeft: 10 }}>
                          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 12,
                                color: '#0F1130',
                              }}>
                              {item?.guestName}
                            </Text>

                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 14,
                                color: '#188C16',
                              }}>
                              ₹{item?.rentalAmount}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 12,
                                color: '#1E3A8A',
                              }}>
                              {item?.checkInDate} -
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 12,
                                color: '#1E3A8A',
                              }}>
                              {item?.checkOutDate}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 12,
                                color: '#0F1130',
                              }}>
                              Source of Booking :
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 11,
                                color: '#1E3A8A',
                              }}>
                              {' '}
                              {item?.via}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              );
            })()}


          </View>
        )}

        {selectDetails === 'Property Details' && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#FFFFFF',
              //marginVertical:10
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 19,
                color: '#081F62',
                paddingBottom: 5,
              }}>
              Description
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontFamily: 'WorkSans-Medium',
                color: '#949494',
              }}>
              {showFullText
                ? PropertiesArray?.Description
                : PropertiesArray?.Description.slice(0, 160)}
            </Text>
            <TouchableOpacity
              onPress={() => {
               // console.log(PropertiesArray?.Description);
                setShowFullText(!showFullText);
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#6D6D6D',
                }}>
                {showFullText ? 'Read less' : 'Read more..'}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 19,
                color: '#081F62',
                paddingVertical: 15,
              }}>
              Property Details
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#DADADA',
                borderRadius: 15,
                marginBottom: 10,
                backgroundColor: '#FFFFFF',
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
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#1A1A1A',
                  }}>
                  Property Type
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                    textTransform: 'capitalize',
                  }}>
                  {PropertiesArray?.P_Type}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingVertical: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#1A1A1A',
                  }}>
                  Area Details
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Total Area
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {PropertiesArray?.area}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingVertical: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#1A1A1A',
                  }}>
                  Price Details
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Property Value
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {' '}
                  {'\u20B9 '}
                  {PropertiesArray?.Price}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Frac Value
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {' '}
                  {'\u20B9 '}
                  {PropertiesArray?.FC_Price}
                </Text>
              </View>
              {!isNaN(Number(PropertiesArray?.SPV)) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 12,
                      color: '#1A1A1A',
                    }}>
                    SPV Value
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 12,
                      color: '#000000',
                      opacity: 0.7,
                    }}>
                    {'\u20B9 '}
                    {Math.round(Number(PropertiesArray?.SPV))}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Booking Value
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {' '}
                  {'\u20B9 '}
                  {PropertiesArray?.BookingAmt}
                </Text>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingVertical: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#1A1A1A',
                  }}>
                  Fracs Details
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Total Fracs
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {PropertiesArray?.TotalFractions}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Available Fracs
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {PropertiesArray?.AvailableFractions}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  //paddingVertical: 10,
                  marginTop: 10,
                }}></View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 14,
                    color: '#1A1A1A',
                  }}>
                  Property Status
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                    opacity: 0.7,
                  }}>
                  {propertyStatu}%
                </Text>
              </View>
              <Progress.Bar
                progress={progress}
                width={width - 60}
                borderColor="#043862"
                color="#043862"
                borderWidth={1}
                height={8}
              />


            </View>

            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 19,
                color: '#081F62',
                paddingTop: 15,
              }}>
              Benefits
            </Text>
            <FlatList
              horizontal
              data={PropertiesArray?.Benefits || []}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 0,
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: 90,
                    alignItems: 'center',
                    marginRight: 15,
                  }}
                >
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={{ uri: item?.image }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'WorkSans-Medium',
                      color: '#949494',
                      textAlign: 'center',
                      marginTop: -7,
                    }}
                    numberOfLines={2}
                  >
                    {item?.name}
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              onPress={() => {
                GgoToYosemite(PropertiesArray?.Location);
                //navigation.navigate('Contact');
              }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop:15
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 19,
                    color: '#081F62',
                    paddingBottom: 5,
                  }}>
                  Property Location
                </Text>
              </View>
              <Image
                style={{
                  width: '100%',
                  height: 200,
                  borderWidth: 1,
                  borderColor: '#A5A5A5',
                  borderRadius: 10,
                }}
                source={{ uri: PropertiesArray?.LocationImage }}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 19,
                color: '#081F62',
                paddingVertical: 5,
              }}>
              Testimonials
            </Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ScrollView horizontal={true}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VideoTour', {
                      vlink: PropertiesArray?.testimonial[1],
                      location: 'Testimonials',
                    });
                  }}
                  style={{
                    marginVertical: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 10 }}
                    source={require('./assets/video1.jpeg')}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: 130,
                    }}>
                    <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VideoTour', {
                      vlink: PropertiesArray?.testimonial[0],
                      location: 'Testimonials',
                    });
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    margin: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 10 }}
                    source={require('./assets/video2.jpeg')}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: 130,
                    }}>
                    <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VideoTour', {
                      vlink: PropertiesArray?.testimonial[2],
                      location: 'Testimonials',
                    });
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    margin: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{ width: 150, height: 130, borderRadius: 10 }}
                    source={require('./assets/video3.jpeg')}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: 130,
                    }}>
                    <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>

      {sort && (
        <CustomModal visible={true} modalStyle={{ width: '100%' }}>
          <View
            style={{
              backgroundColor: '#F6F6F6',
              padding: 20,
              borderRadius: 30,
              paddingBottom: 40,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 18,
                  color: '#000000',
                }}>
                Sort By
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSort(!sort);
                }}>
                <Icon name={'cross'} size={20} color={'#000000'} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderTopColor: '#E7E9EB',
                borderTopWidth: 1,
                marginVertical: 15,
              }}></View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  setSortBy(prev =>
                    prev === 'Complimentary Stays' ? '' : 'Complimentary Stays',
                  );
                  setSort(!sort);
                }}
                style={{ flexDirection: 'row' }}>
                {sortBy == 'Complimentary Stays' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Complimentary Stays
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSortBy(prev =>
                    prev === 'Low to High' ? '' : 'Low to High',
                  );
                  setSort(!sort);
                }}
                style={{ flexDirection: 'row', marginVertical: 15 }}>
                {sortBy == 'Low to High' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Price (Low to High)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSortBy(prev =>
                    prev === 'High to Low' ? '' : 'High to Low',
                  );
                  setSort(!sort);
                }}
                style={{ flexDirection: 'row' }}>
                {sortBy == 'High to Low' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Price (High to Low)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      )}
      {month && (
        <CustomModal visible={true} modalStyle={{ width: '100%' }}>
          <View
            style={{ backgroundColor: '#F6F6F6', padding: 20, borderRadius: 30 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 18,
                  color: '#000000',
                }}>
                Select Months
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMonth(!month);
                }}>
                <Icon name={'cross'} size={20} color={'#000000'} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderTopColor: '#E7E9EB',
                borderTopWidth: 1,
                marginVertical: 15,
              }}></View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  setMonthBy(prev => (prev === '3' ? '' : '3'));
                  setMonth(!month);
                }}
                style={{ flexDirection: 'row' }}>
                {monthBy == '3' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Last 3 Months
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMonthBy(prev => (prev === '6' ? '' : '6'));
                  setMonth(!month);
                }}
                style={{ flexDirection: 'row', marginVertical: 15 }}>
                {monthBy == '6' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Last 6 Months
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMonthBy(prev => (prev === '12' ? '' : '12'));
                  setMonth(!month);
                }}
                style={{ flexDirection: 'row' }}>
                {monthBy == '12' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Last 12 Months
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </CustomModal>
      )}
      {yearData && (
        <CustomModal visible={true} modalStyle={{ width: '100%' }}>
          <View
            style={{ backgroundColor: '#F6F6F6', padding: 20, borderRadius: 30 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 18,
                  color: '#000000',
                }}>
                Select Months
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setYearData(!yearData);
                }}>
                <Icon name={'cross'} size={20} color={'#000000'} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderTopColor: '#E7E9EB',
                borderTopWidth: 1,
                marginVertical: 15,
              }}></View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  setYearBy(prev => (prev === '1' ? '' : '1'));
                  setYearData(!yearData);
                }}
                style={{ flexDirection: 'row' }}>
                {yearBy == '1' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Last 1 Year
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setYearBy(prev => (prev === '2' ? '' : '2'));
                  setYearData(!yearData);
                }}
                style={{ flexDirection: 'row', marginVertical: 15 }}>
                {yearBy == '2' ? (
                  <IconC
                    name={'radio-button-on-outline'}
                    size={20}
                    color={'#001DD8'}
                  />
                ) : (
                  <IconC
                    name={'radio-button-off-outline'}
                    size={20}
                    color={'#9B9B9B'}
                  />
                )}
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  Last 2 Years
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    paddingLeft: 5,
    paddingBottom: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    //alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2E2E2E',
    // opacity: 0.9,
  },
  cardTypo: {
    // borderWidth:1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    // left: 10,
    color: '#1e2135',
    // fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingTop: 150,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    letterSpacing: 0.8,
  },
  reviewChildLayout: {
    height: 180,
    width: 150,
    borderColor: '#2B53A1',
    borderRadius: 10,
    borderWidth: 1,
    // borderRadius: 5,

    // left: 32,
    //position: 'absolute',
  },
  modal: {
    width: '100%',
    alignSelf: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: 'white',
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#043862',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  labelContainer: {
    position: 'absolute',

    left: 16,
    top: -6,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 14,
    // fontWeight: 600,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',

    // color: 'black'
  },
  mainImageContainer: {
    width: width,
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 260,
  },
  bottomImagesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    padding: 5,
    width: width * 0.47,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

   backBtn: {
    position: "absolute",
    top: 40,
    left: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

});
