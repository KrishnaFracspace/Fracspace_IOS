import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  TextInput,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icc from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/Octicons';
import {Dropdown} from 'react-native-element-dropdown';
import CustomModal from './../CustomModal';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {DreamscapeHotels, PopularDestination} from '../Services/UserApi';
import Swiper from 'react-native-swiper';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { nearByStaysApi } from '../redux/reducer/propertyReducer';
import RoomListingSkeleton from '../components/RoomListingSkeleton';

export default function RoomListing(props) {
  const [guestData, setGuestData] = useState(props?.route?.params);
  const {width, height} = Dimensions.get('window');
  const [guestModal, setGuestModal] = useState(false);
  const [adult, setAdult] = useState(props?.route?.params?.Adult || 1);
  const [children, setChildren] = useState(props?.route?.params?.Children || 0);
  const [rooms, setRooms] = useState(props?.route?.params?.rooms || 1);
  const [value, setValue] = useState(props?.route?.params?.city);
  const [selectedDates, setSelectedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState(
    props?.route?.params?.checkInDate,
  );
  const [checkOutDate, setCheckOutDate] = useState(
    props?.route?.params?.checkOutDate,
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState(false);
  const flatListRef = useRef(null);
  const [priceRange, setPriceRange] = useState([0, 30000]); // [minPrice, maxPrice]
  const [roomType, setRoomType] = useState('');
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [sort, setSort] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [like, setLike] = useState([]);
  const navigation = useNavigation();
  const [hotelDetails, setHotelDetails] = useState([]);
  const [propertyType, setPropertyType] = useState('');

  const dispatch = useDispatch();
  const nearByStaysDetails = useSelector((state)=> state.property.nearByStays)
  const loading = useSelector((state)=> state.property.loading)
  const data = [
    {label: 'Hyderabad', value: 'Hyderabad'},
    {label: 'Munnar', value: 'Munnar'},
  ];

    useEffect(()=>{
    dispatch(nearByStaysApi({}))
    },[dispatch])
  const toggleAmenity = item => {
    setRoomAmenities(
      prevSelected =>
        prevSelected.includes(item)
          ? prevSelected.filter(amenity => amenity !== item) // Remove if already selected
          : [...prevSelected, item], // Add if not selected
    );
  };

  // Handle date selection
  const handleDayPress = day => {
    const date = day.dateString;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Set new check-in date and reset check-out
      setCheckInDate(date);
      setCheckOutDate(null);
      setSelectedDates({
        [date]: {startingDay: true, color: '#f5a623', textColor: '#fff'},
      });
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

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      range[dateStr] = {
        color:
          dateStr === start
            ? '#f5a623'
            : dateStr === end
            ? '#f5a623'
            : '#ffe4b2',
        textColor: '#fff',
        startingDay: dateStr === start,
        endingDay: dateStr === end,
      };
      currentDate.add(1, 'day');
    }

    setSelectedDates(range);
  };

  const handleListedHotels = async () => {
    let payload = JSON.stringify({
      location: '',
      city: value,
      minPrice: null,
      maxPrice: null,
    });
    // console.log("Payload: ",res);
    try {
      let {data: res} = await DreamscapeHotels(payload);
      // console.log("Payload: ",res);
      setHotelDetails(res?.hotels);
    } catch (error) {
      console.log('Error in Listed Hotels: ', error);
    }
  };

  useEffect(() => {
    handleListedHotels();
  }, []);

  ///
  const propertyTypes = ['Hotel', 'Villa', 'Resort', 'Apartment'];
  const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe'];

  const amenities = [
    'Wifi',
    'AC',
    'TV',
    'Mini Fridge',
    'Coffee Maker/Kettle',
    'Iron & Ironing Board',
    'Hair Dryer',
  ];

  const scaleAnimations = useRef({}).current;

  const toggleLikes = item => {
    setLike(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(selected => selected !== item)
        : [...prevSelected, item],
    );
  };

  const triggerScaleAnimation = itemName => {
    if (!scaleAnimations[itemName]) {
      scaleAnimations[itemName] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.timing(scaleAnimations[itemName], {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[itemName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

   if (loading) {
        return <RoomListingSkeleton/>;
      }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#0D2038',
            width: width,
            height: height * 0.12,
          }}>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 34,
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DreamscapeHome');
              }}>
              <Icon name={'left'} size={20} color={'#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 16,
                color: '#FFFFFF',
              }}>
              Available Hotels
            </Text>
            {/* <Icon name={'phone'} size={20} color={'#FFFFFF'} style={{ transform: [{ rotate: '90deg' }] }} /> */}
            <View></View>
          </View>
        </View>

        {/* <View
          style={{
            marginHorizontal: 20,
            borderRadius: 15,
            marginTop: -height * 0.12,
            backgroundColor: '#FFFFFF',
            elevation: 5,
            marginBottom: 20,
          }}>
          <View style={{paddingHorizontal: 15, marginTop: 20}}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 16,
                color: '#000000',
              }}>
              Select a Location
            </Text>
            <View style={[styles.dropdown, {justifyContent: 'center'}]}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 12,
                  color: '#0D1E36',
                }}>
                {value}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', paddingHorizontal: 15, marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Date
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCalendar(!showCalendar);
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#62626233',
                  padding: 10,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Ico name={'calendar-outline'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                    color: '#0D1E36',
                    marginLeft: 10,
                  }}>
                  {checkInDate
                    ? moment(checkInDate).format('DD MMM')
                    : 'Select '}{' '}
                  -{' '}
                  {checkOutDate
                    ? moment(checkOutDate).format('DD MMM')
                    : 'Date'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Guest
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setGuestModal(!guestModal);
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#62626233',
                  padding: 10,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  marginTop: 5,
                }}>
                <Ico name={'people-outline'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                    color: '#0D1E36',
                    marginLeft: 5,
                  }}>
                  {adult == 0 ? '' : ` ${adult} Ad.. `}
                  {children == 0 ? '' : ` ${children} Ch.. `}
                  {rooms == 0 ? '' : ` ${rooms} Ro..`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#F0EFFB',
              marginVertical: 15,
            }}></View>

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                setFilter(!filter);
              }}
              style={{
                backgroundColor: '#0E1E36F2',
                flex: 1,
                borderRadius: 25,
                padding: 14,
                marginHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/filter.png',
                }}
                style={{width: 20, height: 20}}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 12,
                  color: '#E09E3B',
                  marginLeft: 5,
                }}>
                FILTERS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSort(!sort);
              }}
              style={{
                backgroundColor: '#0E1E36F2',
                flex: 1,
                borderRadius: 25,
                padding: 14,
                marginHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ic name={'sort-desc'} size={20} color={'#E09E3B'} />
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 12,
                  color: '#E09E3B',
                  marginLeft: 5,
                }}>
                SORTS
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {[...hotelDetails]
          .filter(hotel => {
            return hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
          })
          .filter(hotel => {
            if (roomType === 'Suite' || roomType === 'Deluxe') {
              return hotel.name === 'DREAMSCAPE'; // Only Dreamscape for these types
            }
            return true; // Show all for "Single" and "Double"
          })
          .sort((a, b) => {
            if (sortBy === 'Low to High') {
              return a.price - b.price;
            } else if (sortBy === 'High to Low') {
              return b.price - a.price;
            }
            return 0;
          })
          .map((item, index) => {
            const itemName = item?.name;
            if (!scaleAnimations[itemName]) {
              scaleAnimations[itemName] = new Animated.Value(1);
            }

            return (
              <TouchableOpacity
                onPress={() => {
                  // console.log("egfqwfk",item?.name);
                  navigation.navigate('SelectRoom', {detail: item});
                }}
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 25,
                  marginHorizontal: 20,
                  marginVertical: 15,
                  elevation: 5,
                  alignSelf: 'center',
                  width: width * 0.9,
                  overflow: 'hidden',
                }}>
                <View>
                  {item.images && (
                    <Swiper
                      style={{height: height * 0.22}}
                      showsPagination={true}
                      loop={true}
                      paginationStyle={{
                        bottom: 10,
                      }}
                      dotStyle={{
                        backgroundColor: '#0E213861',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                      }}
                      activeDotStyle={{
                        backgroundColor: '#0E2138',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                      }}
                      >
                      {item.images.map((img, imgIndex) => (
                        <Image
                          key={imgIndex}
                          source={{uri: img}}
                          style={{width: width * 0.9, height: height * 0.22}}
                        />
                      ))}
                    </Swiper>
                  )}
      
                  {item?.offers &&
                  <View style={{position: 'absolute', top: 15, left: 15}}>
                    <LinearGradient
                      colors={['#0000006B', '#9999996B']}
                      style={{
                        padding: 8,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        borderColor: '#FFFFFF',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 12,
                          color: '#FFFFFF',
                        }}>
                        {item?.offers}
                      </Text>
                    </LinearGradient>
                  </View>
                  }

                  <View style={{position: 'absolute', top: 15, right: 15}}>
                    <TouchableOpacity
                      onPress={() => {
                        triggerScaleAnimation(itemName);
                        toggleLikes(itemName);
                      }}>
                      <LinearGradient
                        colors={
                          like.includes(itemName)
                            ? ['#FFFFFF', '#FFFFFF']
                            : ['#0000006B', '#9999996B']
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#FFFFFF',
                          borderWidth: 1,
                        }}>
                        <Animated.View
                          style={{
                            transform: [{scale: scaleAnimations[itemName]}],
                          }}>
                          {like.includes(itemName) ? (
                            <Icon name="heart" size={15} color="#ED1C24" />
                          ) : (
                            <Icon name="hearto" size={15} color="#FFFFFFD1" />
                          )}
                        </Animated.View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {(item?.name == 'DREAMSCAPE' || item?.name == 'Fracspace Abode' || item?.name == 'Eleven Views' || item?.name == 'Hilltop By Fracspace') &&
                  <View style={{position: 'absolute', bottom: 0, right: 0}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item?.name == 'DREAMSCAPE') {
                          navigation.navigate('VideoTour', {
                            vlink: `https://duixj37yn5405.cloudfront.net/videos/dreamscapes-video1.mp4`,
                            location: 'DREAMSCAPE',
                          });
                        } else if (item?.name == 'Fracspace Abode') {
                          navigation.navigate('VideoTour', {
                            vlink: `https://duixj37yn5405.cloudfront.net/videos/abode-video1.mp4`,
                            location: 'Fracspace Abode',
                          });
                        } else if (item?.name == 'Eleven Views') {
                          navigation.navigate('VideoTour', {
                            vlink: `https://duixj37yn5405.cloudfront.net/videos/IMG_4124.MP4`,
                            location: 'Eleven Views',
                          });
                        } else if (item?.name == 'Hilltop By Fracspace') {
                          navigation.navigate('VideoTour', {
                            vlink: `https://duixj37yn5405.cloudfront.net/videos/MunnarVideo.mp4`,
                            location: 'Hilltop By Fracspace',
                          });
                        }
                      }}
                      style={{position: 'absolute', bottom: 10, right: 15}}>
                      <View
                        style={{
                          backgroundColor: 'rgba(153, 153, 153, 0.42)',
                          width: 40,
                          height: 35,
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: '#FFFFFF33',
                        }}>
                        <Image
                          resizeMode="contain"
                          source={{
                            uri: 'https://duixj37yn5405.cloudfront.net/appImages/videoo.png',
                          }}
                          style={{width: 20, height: 20}}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
          }
                </View>
                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <View style={{}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 17,
                          color: '#000000',
                        }}>
                        {item?.name}
                      </Text>
                      {/* <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#0E2037'}}>{( Deluxe Room )}</Text> */}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Ico
                        name={'location-outline'}
                        size={15}
                        color={'#262D3D'}
                      />
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          fontSize: 12,
                          color: '#262D3D',
                          marginLeft: 5,
                        }}>{`${item?.location?.address}, ${item?.location?.city}`}</Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'flex-end', flex: 1}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 17,
                        color: '#0D2038',
                      }}>{`₹ ${item?.price} /-`}</Text>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 9,
                        color: '#0E2037',
                      }}>
                      + taxes & fees{' '}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 10,
                        color: '#0E2037',
                      }}>
                      Per Night
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>

      {guestModal && (
        <Modal visible={true} transparent animationType='fade' modalStyle={{width: '100%'}}>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={() => {setGuestModal(false)}} style={{flex:1,backgroundColor:'#00000065'}}/>
            <ScrollView
              style={{
                position:'absolute',bottom:0,left:0,right:0,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                padding: 30,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 18,
                    color: '#000000',
                  }}>
                  Select Guests and Rooms
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      color: '#000000',
                    }}>
                    Adults
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 12,
                      color: '#262626CC',
                    }}>
                    Age 18 or above
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 100,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (adult > 0) setAdult(adult - 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name={'minus'} size={15} color={'#0D2038'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: '#000000',
                    }}>
                    {adult}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (adult < 20) setAdult(adult + 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0D2038',
                    }}>
                    <Icon name={'plus'} size={15} color={'#E09E3B'} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      color: '#000000',
                    }}>
                    Children
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 12,
                      color: '#262626CC',
                    }}>
                    Age 0-17 years old
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 100,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (children > 0) setChildren(children - 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name={'minus'} size={15} color={'#0D2038'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: '#000000',
                    }}>
                    {children}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (children < 20) setChildren(children + 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0D2038',
                    }}>
                    <Icon name={'plus'} size={15} color={'#E09E3B'} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      color: '#000000',
                    }}>
                    Rooms
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 12,
                      color: '#262626CC',
                    }}>
                    No.of rooms
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 100,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (rooms > 0) setRooms(rooms - 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name={'minus'} size={15} color={'#0D2038'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 14,
                      color: '#000000',
                    }}>
                    {rooms}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (rooms < 20) setRooms(rooms + 1);
                    }}
                    style={{
                      borderWidth: 0.6,
                      borderColor: '#62626233',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0D2038',
                    }}>
                    <Icon name={'plus'} size={15} color={'#E09E3B'} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setGuestModal(!guestModal);
                }}
                style={{
                  backgroundColor: '#0D2038',
                  borderRadius: 30,
                  padding: 10,
                  alignItems: 'center',
                  marginHorizontal: 60,
                  marginVertical: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {showCalendar && (
        <Modal visible={true} transparent animationType='fade' modalStyle={{width: '100%'}}>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={() => {setShowCalendar(false)}} style={{flex:1, backgroundColor:'#00000065'}}/>
            <View
              style={{
                position:'absolute',bottom:0,left:0,right:0,
                backgroundColor: '#FFFFFF',
                padding: 30,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View></View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 17,
                    color: '#000000',
                  }}>
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCalendar(!showCalendar);
                  }}>
                  <Icc name={'cross'} size={20} color={'#000000'} />
                </TouchableOpacity>
              </View>
              <View style={{}}>
                <Calendar
                  onDayPress={handleDayPress}
                  markingType="period"
                  markedDates={selectedDates}
                  minDate={moment().format('YYYY-MM-DD')}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {filter && (
        <Modal visible={true} transparent animationType='fade' modalStyle={{width: width, flex: 1}}>
          <View style={{flex:1,}}>
            <TouchableOpacity onPress={() => {setFilter(false)}} style={{flex:1,backgroundColor:'#00000065'}}/>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{flexGrow: 1}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity
                  onPress={() => {
                    setFilter(!filter);
                  }}>
                  <Icc name={'cross'} size={20} color={'#000000'} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#E7E9EB',
                  marginVertical: 15,
                }}></View>

              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Select Price Range:
              </Text>
              {/*  */}
              {/* MultiSlider for Min and Max Price */}
              <View style={{paddingHorizontal: 10}}>
                <MultiSlider
                  style={{width: width}}
                  values={priceRange}
                  sliderLength={width * 0.85}
                  onValuesChange={values => setPriceRange(values)}
                  min={0}
                  max={30000}
                  step={1000}
                  selectedStyle={{
                    backgroundColor: '#4C61D0', // Blue range between min and max
                  }}
                  unselectedStyle={{
                    backgroundColor: '#E3E3E3', // Gray for outside range
                  }}
                  customMarker={e => (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: '#0424CB',
                        borderRadius: 10,
                      }}></View>
                  )}
                />
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: '#EAEAEA',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 11,
                      color: '#101010',
                    }}>
                    Min
                  </Text>
                  <TextInput
                    value={`₹${priceRange[0]}`}
                    editable={false}
                    style={{marginLeft: 10, color: '#101010'}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: '#EAEAEA',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 11,
                      color: '#101010',
                    }}>
                    Max
                  </Text>
                  <TextInput
                    value={`₹${priceRange[1]}`}
                    editable={false}
                    style={{marginLeft: 10, color: '#101010'}}
                  />
                </View>
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#E7E9EB',
                  marginVertical: 15,
                }}></View>

              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Meidum',
                    fontSize: 16,
                    color: '#000000',
                  }}>
                  Property Type:{' '}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 15,
                    flexWrap: 'wrap',
                    marginTop: 10,
                  }}>
                  {propertyTypes.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setPropertyType(prev => (prev === item ? '' : item));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor:
                          propertyType == item ? '#E09E3B' : '#62626233',
                        backgroundColor:
                          propertyType == item ? '#E09E3B' : '#FFFFFF',
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          fontSize: 12,
                          color: propertyType == item ? '#FFFFFF' : '#00000099',
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    borderTopColor: '#F0EFFB',
                    borderTopWidth: 1,
                    marginVertical: 15,
                  }}></View>
              </View>

              <View style={{}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#000000',
                  }}>
                  Room Type:{' '}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 15,
                    flexWrap: 'wrap',
                    marginTop: 10,
                  }}>
                  {roomTypes.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // setRoomType(item);
                        setRoomType(prev => (prev === item ? '' : item)); // Deselect if same
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: roomType == item ? '#E09E3B' : '#62626233',
                        backgroundColor: roomType == item ? '#E09E3B' : '#FFFFFF',
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          fontSize: 12,
                          color: roomType == item ? '#FFFFFF' : '#00000099',
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    borderTopColor: '#F0EFFB',
                    borderTopWidth: 1,
                    marginTop: 15,
                  }}></View>
              </View>

              <View style={{margin: 20, paddingBottom: 20}}>
                <TouchableOpacity
                  onPress={() => {
                    setFilter(!filter);
                  }}
                  style={{
                    backgroundColor: '#0E2037',
                    padding: 15,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 14,
                      color: '#FFFFFF',
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {sort && (
        <Modal visible={true} transparent animationType='fade' modalStyle={{width: '100%'}}>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={() => {setSort(false)}} style={{flex:1,backgroundColor:'#00000065'}}/>
            <View
              style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor: '#FFFFFF', padding: 20, borderRadius: 30}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  <Icc name={'cross'} size={20} color={'#000000'} />
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
                    setSortBy('Popularity');
                    setSort(!sort);
                  }}
                  style={{flexDirection: 'row'}}>
                  {sortBy == 'Popularity' ? (
                    <Ico
                      name={'radio-button-on-outline'}
                      size={20}
                      color={'#001DD8'}
                    />
                  ) : (
                    <Ico
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
                    Popularity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSortBy('Low to High');
                    setSort(!sort);
                  }}
                  style={{flexDirection: 'row', marginVertical: 15}}>
                  {sortBy == 'Low to High' ? (
                    <Ico
                      name={'radio-button-on-outline'}
                      size={20}
                      color={'#001DD8'}
                    />
                  ) : (
                    <Ico
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
                    setSortBy('High to Low');
                    setSort(!sort);
                  }}
                  style={{flexDirection: 'row'}}>
                  {sortBy == 'High to Low' ? (
                    <Ico
                      name={'radio-button-on-outline'}
                      size={20}
                      color={'#001DD8'}
                    />
                  ) : (
                    <Ico
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
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#62626233',
    borderWidth: 0.6,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 8,
    height: 8,
  },
  container: {
    position:'absolute',bottom:0,left:0,right:0,
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    elevation: 3,
    flexWrap: 'wrap',
    paddingBottom: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
});


