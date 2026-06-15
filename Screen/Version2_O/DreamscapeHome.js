import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  FlatList,
  Modal,
} from 'react-native';
import React, {Children, useContext, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomModal from './../CustomModal';
import {Dropdown} from 'react-native-element-dropdown';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../Context/AppContext';
import {DreamscapeHotels, UpComingHotels} from '../Services/UserApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { nearByStaysApi, upComingProjectApi } from '../redux/reducer/propertyReducer';
import DreamScapeHomeSkeleton from '../components/DreanScapeHomeSkeleton';

export default function DreamscapeHome(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const {width, height} = Dimensions.get('window');
  const [guestModal, setGuestModal] = useState(false);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [value, setValue] = useState('Hyderabad');
  const [selectedDates, setSelectedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [like, setLike] = useState([]);
  const navigation = useNavigation();
  const [HotelDetails, setHotelDetails] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ourStays, setOurStays] = useState(globalState?.ourStays || []);
  const [selectedLocation, setSelectedLocation] = useState('');  
  const [allHotels, setAllHotels] = useState([]);
  const dispatch = useDispatch();
  const UpComingDetails  = useSelector(state => state.property.upComingProjects);
  const nearByStaysDetails = useSelector((state)=> state.property.nearByStays)
  const loading = useSelector((state)=> state.property.loading)


  useEffect(()=>{
  dispatch(upComingProjectApi())
  dispatch(nearByStaysApi({}))
  },[dispatch])
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
      setShowCalendar(!showCalendar);
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

  const toggleLikes = item => {
    setLike(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(selected => selected !== item)
        : [...prevSelected, item],
    );
  };

const handleListedHotels = async () => {
  try {
    const { data: res } = await DreamscapeHotels();

    const availableHotels = res?.hotels?.filter(
      hotel => hotel?.availabilityStatus
    );

    setHotelDetails(availableHotels);

    const locationList = [];
    const citySet = new Set();

    availableHotels?.forEach(hotel => {
      const city = hotel?.location?.city;

      if (!citySet.has(city)) {
        citySet.add(city);

        locationList.push({
          label: city,              // for dropdown
          value: city,              // for dropdown
          image: hotel?.locationImage // for OurStays section
        });
      }
    });

    setLocations(locationList); // 🔴 this was missing

  } catch (error) {
    console.log('Error in Listed Hotels:', error);
  }
};

const handleListedHotels1 = async () => {
  try {
    const { data: res } = await DreamscapeHotels();

    setHotelDetails(res?.hotels || []);

    const uniqueLocations = [
      ...new Set(res?.hotels?.map(hotel => hotel?.location?.city))
    ];

   // setLocations(uniqueLocations);

  } catch (error) {
    console.log('Error in Listed Hotels:', error);
  }
};

const filterHotelsByLocation = (city) => {
  const filteredHotels = hotelDetails?.filter(
    hotel => hotel?.location?.city === city
  );

  setHotelDetails(filteredHotels);
};
  const handleUpcomingHotels = async () => {
    try {
      let {data: res} = await UpComingHotels();
     // setUpComingDetails(res?.data);
    } catch (error) {
      console.log('Error in UpComing Hotels: ', error);
    }
  };

  useEffect(() => {
    handleListedHotels();
   // handleUpcomingHotels();
  }, []);

  const scaleAnimations = useRef({}).current;

  // const toggleLikes = (item) => {
  //     setLike((prevSelected) =>
  //         prevSelected.includes(item)
  //             ? prevSelected.filter((selected) => selected !== item)
  //             : [...prevSelected, item]
  //     );
  // };

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
      return <DreamScapeHomeSkeleton/>;
    }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{width: '100%'}}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/Dreamscape1.png'}}
          style={{width: '100%', height: height * 0.31}}>
          <View
            style={{
              // marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if(props?.route?.params?.from === 'HomePage'){
                  navigation.navigate('HomePage');
                }else{
                  navigation.navigate('BottomNavigations', {
                    screen: 'HomePage'
                  })
                }
                // navigation.popToTop();
              }}>
              <AntDesign name={'left'} size={20} color={'#FFFFFF'} />
            </TouchableOpacity>
            <Image
              resizeMode="cover"
              //source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/DreamscapeLogo.png' }}
              source={require('./assets/Dreamscapelogo.png')}
              style={{width: width * 0.29, height: height * 0.06}}
            />

            <View></View>
          </View>
          <View style={{padding: 20, marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 15,
                  color: '#FFFFFF',
                }}>
                Hello, {globalState?.userName}{' '}
              </Text>
              <Image
                resizeMode="cover"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/Hand.png',
                }}
                style={{width: 18, height: 18}}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                color: '#DDDDDD',
              }}>
              A Cozy Escape Awaits – Book Now!
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            marginTop: -height * 0.07,
            paddingHorizontal: 20,
            paddingVertical: 10,
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 30,
              elevation: 5,
              width: '100%',
            }}>
            <View style={{marginVertical: 20, marginHorizontal: 10}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                  paddingBottom: 3,
                }}>
                Select a Location
              </Text>

              <Dropdown
                style={styles.dropdown}
                itemTextStyle={{
                  fontSize: 12,
                  color: '#0D1E36',
                  fontFamily: 'Poppins-Medium',
                }}
                placeholderStyle={{
                  fontSize: 12,
                  color: '#0D1E36',
                  fontFamily: 'Poppins-Medium',
                }}
                selectedTextStyle={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#0D1E36',
                }}
                data={locations}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Hyderabad'}
                value={value}
                onChange={item => {
                  setValue(item.value);
                }}
              />

            </View>
            <View
              style={{
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                flex: 1,
              }}>
              <View style={{flex: 1, marginRight: 10}}>
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
                  <Ionicons name={'calendar-outline'} size={15} color={'#0D1F36'} />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 12,
                      color: '#0D1E36',
                      marginLeft: 5,
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
              <View style={{flex: 1}}>
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
                    marginTop: 5,
                  }}>
                  <Ionicons name={'people-outline'} size={15} color={'#0D1E36'} />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 12,
                      color: '#0D1E36',
                      marginLeft: 5,
                      alignItems: 'center',
                      flex: 1,
                      flexWrap: 'wrap',
                    }}>
                    {adult == 0 ? '' : `${adult} Adult .`}
                    {children == 0 ? '' : `${children} Children . `}
                    {rooms == 0 ? '' : `${rooms} Room`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (checkInDate == null && checkOutDate == null) {
                  Alert.alert(
                    'Please Enter Your Check-In & Check-Out Dates',
                    'To proceed with check availabilty, kindly enter your desired check-in and check-out dates. This will help us find the best available options for you!',
                  );
                } else {
                  navigation.navigate('RoomListing', {
                    city: value,
                    Adult: adult,
                    Children: children,
                    rooms: rooms,
                    checkOutDate: checkOutDate,
                    checkInDate: checkInDate,
                  });
                }
              }}
              style={{
                flex: 1,
                backgroundColor: '#E09E3B',
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                marginTop: 20,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 16,
                  color: '#FFFFFF',
                }}>
                Check Availabilty{' '}
              </Text>
              <AntDesign
                name={'search1'}
                size={20}
                color={'#FFFFFF'}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
                color: '#000000',
              }}>
              Nearby Stays
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RoomListing');
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#1D17C8',
                  textDecorationLine: 'underline',
                }}>
                View all
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 3,
              paddingBottom: 0,
            }}></View>
<FlatList
  data={HotelDetails}
  horizontal
  keyExtractor={(item, index) => item?.name + index}
  showsHorizontalScrollIndicator={false}
  renderItem={({item}) => {
    const itemName = item?.name;
    if (!scaleAnimations[itemName]) {
      scaleAnimations[itemName] = new Animated.Value(1);
    }
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SelectRoom', {detail: item, nav: 'DSHome'});
        }}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 10,
          width: width * 0.75,
          marginRight: 25,
        }}>
        <View>
          <Image
            resizeMode="cover"
            source={{uri: item?.images[0]}}
            style={{
              width: '100%',
              height: height * 0.22,
              borderRadius: 30,
            }}
          />

          {/* OFFER */}
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

          {/* LIKE */}
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
                    <AntDesign name="heart" size={15} color="#ED1C24" />
                  ) : (
                    <AntDesign name="hearto" size={15} color="#FFFFFFD1" />
                  )}
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* DETAILS */}
        <View
          style={{
            paddingHorizontal: 10,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex:1,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 14,
                color: '#000000',
              }}>
              {item?.name}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Ionicons
                name="location-outline"
                size={12}
                color="#262D3D"
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 12,
                  color: '#262D3D',
                  marginLeft: 5,
                }}>
                {item?.location?.place}, {item?.location?.city}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#262D3D',
              width: 45,
              height: 45,
              borderRadius: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AntDesign name="arrowright" size={15} color="#DD9D3B" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }}
/>


          <View style={{marginTop: 30}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#000000',
                paddingBottom: 15,
              }}>
              Our Stays
            </Text>
          </View>
{/* 
          <View
            //horizontal={true}
            style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Ourstay', {location: 'Hyderabad'});
              }}
              style={{paddingRight: 18, alignItems: 'center'}}>
              <Image
                resizeMode="cover"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/Hyderabad.png',
                }}
                style={{width: 90, height: 90}}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 11,
                  color: '#000000',
                  marginTop: 10,
                }}>
                Hyderabad
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Ourstay', {location: 'Munnar'});
              }}
              style={{alignItems: 'center'}}>
              <Image
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/Munnar2.png',
                }}
                style={{width: 91, height: 91}}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 11,
                  color: '#000000',
                  marginTop: 9,
                }}>
                Munnar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Ourstay', {location: 'Varanasi'});
              }}
              style={{alignItems: 'center', paddingHorizontal: 18}}>
              <Image
                resizeMode="cover"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/Varanasi.png',
                }}
                style={{width: 90, height: 90}}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 11,
                  color: '#000000',
                  marginTop: 10,
                }}>
                Varanasi
              </Text>
            </TouchableOpacity>
          </View> */}

   

  <FlatList
  data={ourStays}
  horizontal
  keyExtractor={(item, index) => index.toString()}
  showsHorizontalScrollIndicator={false}
  renderItem={({item}) => (

 <TouchableOpacity
              onPress={() => {
                navigation.navigate('Ourstay', {location: item.city});
              }}
              style={{alignItems: 'center', paddingRight: 18}}>
              <Image
                resizeMode="stretch"
                source={{
                  uri:item.locationImage,
                }}
                style={{width: 90, height: 90}}
              />

              <Text
                style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 11,
                  color: '#000000',
                  marginTop: 10,
                }}>
           {item.city}
              </Text>
            </TouchableOpacity>
  )}
/>

          {UpComingDetails.length > 0 &&
          <View>
            <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Coming Soon
              </Text>
            </View>

            <FlatList
              data={UpComingDetails}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: 10,
                    marginRight: 20,
                    borderRadius: 25,
                  }}>
                  <View>
                    <Image
                      source={{uri: item?.images[0]}}
                      style={{
                        width: width * 0.5,
                        height: height * 0.178,
                        borderRadius: 20,
                      }}
                    />
                    <View style={{position: 'absolute', bottom: 10, right: 10}}>
                      <LinearGradient
                        colors={['#0000006B', '#9999996B']}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#FFFFFF',
                          borderWidth: 1,
                        }}>
                        <Entypo name="map" color="#DD9D3B" size={18} />
                      </LinearGradient>
                    </View>
                  </View>

                  <View style={{marginLeft: 5, marginTop: 10}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      {item?.propertyName}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Ionicons
                        name="location-outline"
                        size={15}
                        color="#262D3D"
                      />
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          fontSize: 12,
                          color: '#000000',
                          marginLeft: 3,
                        }}>
                        {item?.location}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
          }

          <View style={{marginTop: 30}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#000000',
              }}>
              Video Tour of Luxury Stays
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 5,
            }}>
            <ScrollView horizontal={true}>
              <TouchableOpacity
                // key={index}
                onPress={() => {
                  navigation.navigate('VideoTour', {
                    vlink: `https://duixj37yn5405.cloudfront.net/videos/dreamscapes-video1.mp4`,
                    location: 'DREAMSCAPE',
                  });
                }}
                style={{
                  //backgroundColor: '#FFFFFF',

                  marginVertical: 10,
                  marginRight: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 120, height: 120, borderRadius: 10}}
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/appImages/Dreamscape.jpeg',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    width: '100%',
                    height: 120,
                    //borderWidth:1
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#1A1A1A',
                        opacity: 0.8,
                        // borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 25,
                          backgroundColor: '#1A1A1AB2',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Ionicons
                          name={'play-outline'}
                          size={10}
                          color={'#FFFFFF'}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Dreamscape
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                // key={index}
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  // console.log(item);
                  navigation.navigate('VideoTour', {
                    vlink: `https://duixj37yn5405.cloudfront.net/videos/MunnarVideo.mp4`,
                    location: 'Hilltop By Fracspace',
                  });
                }}
                style={{
                  //backgroundColor: '#FFFFFF',

                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 120, height: 120, borderRadius: 10}}
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/images/unnathsir%40munnar.jpeg',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    width: '100%',
                    height: 120,
                    //borderWidth:1
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#1A1A1A',
                        opacity: 0.8,
                        // borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 25,
                          backgroundColor: '#1A1A1AB2',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Ionicons
                          name={'play-outline'}
                          size={10}
                          color={'#FFFFFF'}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Hilltop
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                // key={index}
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  // console.log(item);
                  navigation.navigate('VideoTour', {
                    vlink: `https://duixj37yn5405.cloudfront.net/videos/IMG_4124.MP4`,
                    location: 'Eleven Views',
                  });
                }}
                style={{
                  //backgroundColor: '#FFFFFF',

                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 120, height: 120, borderRadius: 10}}
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/images/elevenviews.jpeg',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    width: '100%',
                    height: 120,
                    //borderWidth:1
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#1A1A1A',
                        opacity: 0.8,
                        // borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 25,
                          backgroundColor: '#1A1A1AB2',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Ionicons
                          name={'play-outline'}
                          size={10}
                          color={'#FFFFFF'}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Eleven Views
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                // key={index}
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  // console.log(item);
                  navigation.navigate('VideoTour', {
                    vlink: `https://duixj37yn5405.cloudfront.net/videos/abode-video1.mp4`,
                    location: 'Fracspace Abode',
                  });
                }}
                style={{
                  //backgroundColor: '#FFFFFF',

                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 120, height: 120, borderRadius: 10}}
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/images/hotelImage1.jpeg',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    width: '100%',
                    height: 120,
                    //borderWidth:1
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#1A1A1A',
                        opacity: 0.8,
                        // borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        height: 35,
                        width: 35,
                        borderRadius: 35,
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 25,
                          backgroundColor: '#1A1A1AB2',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Ionicons
                          name={'play-outline'}
                          size={10}
                          color={'#FFFFFF'}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Abode
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {guestModal && (
        <Modal visible={true} transparent animationType='fade' modalStyle={{width: '100%'}}>
          <View style={{flex:1,backgroundColor:'#00000065'}}>
            <TouchableOpacity onPress={() => {setGuestModal(false)}} style={{flex:1}}/>
            <View
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
                    <AntDesign name={'minus'} size={15} color={'#0D2038'} />
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
                    <AntDesign name={'plus'} size={15} color={'#E09E3B'} />
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
                    <AntDesign name={'minus'} size={15} color={'#0D2038'} />
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
                    <AntDesign name={'plus'} size={15} color={'#E09E3B'} />
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
                    <AntDesign name={'minus'} size={15} color={'#0D2038'} />
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
                    <AntDesign name={'plus'} size={15} color={'#E09E3B'} />
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
            </View>
          </View>
        </Modal>
      )}

      {showCalendar && (
        <Modal transparent animationType='fade' visible={true} modalStyle={{width: '100%'}}>
          <View style={{backgroundColor:'#00000065',flex:1}}>
            <TouchableOpacity onPress={() => {setShowCalendar(false)}} style={{flex:1}}/>
            <View
              style={{
                position:'absolute', bottom:0, left:0, right:0,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 30,
                paddingVertical: 10,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}></View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 17,
                    color: '#000000',
                  }}>
                  Select Date
                </Text>
                <TouchableOpacity
                  style={{paddingVertical: 5, flex: 1, alignItems: 'flex-end'}}
                  onPress={() => {
                    setShowCalendar(!showCalendar);
                  }}>
                  <Entypo name={'cross'} size={20} color={'#000000'} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    // height: 50,
    borderColor: '#62626233',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  datePicker: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    width: 220,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});
