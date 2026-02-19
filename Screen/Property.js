import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
//import { ScrollView } from 'react-native-virtualized-view';
import {useState, useContext, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import openMap, {createOpenLink} from 'react-native-open-maps';
import {AppContext} from './Context/AppContext';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomModal from './CustomModal';
import Iconcall from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import * as Progress from 'react-native-progress';
import Video, {VideoRef} from 'react-native-video';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  DisLike,
  GetReviewData,
  Like,
  LikeData,
  NewUpdate,
  ReviewData,
  SiteVisit,
} from './Services/UserApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchNewUpdates,
  profileDetailsById,
  resetProfileState,
} from './redux/reducer/propertyReducer';
import PropertySkeleton from './components/PropertySkeleton';
import store from './redux/store/store';
import { setDeepLinkNav } from './redux/reducer/homeReducer';

export default function Property(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const dispatch = useDispatch();
  //console.log(globalState?.userDetails);
  const [Event, setEvent] = useState(props?.route?.params?.status || false);
  const [Status, setStatus] = useState(true);
  const [Status1, setStatus1] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);
  const [date, setDate] = useState(new Date());
  const [IsLike, setIsLike] = useState([]);
  const proId = props.route?.params?.Id;
  //console.log(proId, '============prop====',props.route?.params?.Id);
  const [propertyStatu, setPropertyStatu] = useState(
    props?.route?.params?.details?.PropertyStatus || 0,
  );
  const isDeepLink = useSelector(state => state.home.isDepplinkNav);
  const Newupdate = useSelector(state => state.property.newUpdates);
  const PropertiesArray = useSelector(state => state.property.PropertyDetailsById);
  const loading = useSelector(state => state.property.loading);
  const [CustomerReview, setCustomerReview] = useState([]);
  const GgoToYosemite = location => {
    openMap({query: location});
  };

  useFocusEffect(
  useCallback(() => {
    dispatch(resetProfileState());
     dispatch(fetchNewUpdates());
    dispatch(profileDetailsById({ id: proId }));
  }, [proId])
);

  const handleUpdate = async () => {
    try {
      let {data: res} = await NewUpdate();
      if (res?.success) {
        //  setNewupdate(res?.updates);
        // setProperties(res?.properties);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
    // console.log(payload);
    try {
      let {data: res} = await DisLike(payload);
      if (res?.success) {
        const filteredNumbers = IsLike.filter(number => number !== Productid);
        setIsLike(filteredNumbers);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // console.log('Request error:', `${JSON.stringify(error)}`);
        //Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleLike = async item => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: item?._id,
    });
    try {
      let {data: res} = await Like(payload);
      if (res?.success) {
        //setIsLike(Productid);
        setIsLike([...IsLike, item?._id]);
      } else {
        handleDisLike(item?._id);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleAllLike = async () => {
    //const email = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: globalState?.userEmail,
    });
    try {
      let {data: res} = await LikeData(payload);

      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          LikeData: res?.pIds,
        }));
        setIsLike(res?.pIds);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('like', `${JSON.stringify(error?.request)}`);
        //Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleReview = async () => {
    //const email = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      propertyName: PropertiesArray?.name,
    });
    try {
      let {data: res} = await GetReviewData(payload);
      if (res?.success) {
        setCustomerReview(res);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('like', `${JSON.stringify(error?.request)}`);
        //Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {
    //  handleUpdate();
    handleAllLike();
    handleReview();
  }, []);

  const propertyProgress = Number(PropertiesArray?.PropertyStatus);

  const renderItem = ({item}) => (
    <View style={{alignItems: 'center', flex: 1, padding: 8}}>
      <Image
        style={[styles.maskGroupIconLayout]}
        resizeMode="cover"
        source={{uri: item?.image}}
      />
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 12,
            // fontWeight: 400,
            fontFamily: 'OpenSans-SemiBold',
            letterSpacing: 0.3,
            //fontFamily: 'Montserrat-SemiBold',
            color: '#2E2E2E',
            textAlign: 'center',
          }}>
          {item?.name}
        </Text>
      </View>
    </View>
  );
  const renderItemSec = ({item}) => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        padding: 8,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderColor: '#E8ECF3',
        borderBottomWidth: 1,
      }}>
      <Image
        style={[styles.maskGroupIconLayout, {borderRadius: 10}]}
        resizeMode="cover"
        source={{uri: item?.image}}
      />
      <View style={{alignItems: 'flex-start', marginHorizontal: 5, flex: 1}}>
        <Text
          style={{
            fontSize: 12,
            // fontWeight: 400,
            fontFamily: 'OpenSans-SemiBold',
            letterSpacing: 0.3,
            //fontFamily: 'Montserrat-SemiBold',
            color: '#2E2E2E',
            textAlign: 'center',
          }}>
          {item?.name}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <PropertySkeleton />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* {(loading || PropertiesArray.length === 0) && <PropertySkeleton/>}   */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 15,
          width: '100%',
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 2,
          backgroundColor: '#081F62',
          //elevation: 1,
          borderBottomColor: '#DDE1E5',
        }}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
           // console.log(props?.route?.params?.navi,"props?.route?.params?.nav====",globalState?.ProDetails)
            if (props?.route?.params?.navi) {
               navigation.navigate('Home');
            }else if(isDeepLink === 'true'){
               navigation.navigate('BottomNavigations')
              // store.dispatch(setDeepLinkNav(false));
             } 
            else if(props?.route?.params?.nav){
               navigation.navigate('HomePage')
             } else {
              navigation.navigate('Home', {details: globalState?.ProDetails});
            //  navigation.navigate("BottomNavigations")
            }
          }}>
          <Icon name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-SemiBold',
              color: '#FFFFFF',
            }}>
            Property Details
          </Text>
        </View>

        <TouchableOpacity
          style={{flex: 1, alignItems: 'flex-end'}}
          onPress={() => {
            navigation.navigate('CustomersReview', {
              PropertyName: PropertiesArray?.name,
              camera: 'open',
            });
          }}>
          <Iconcall name="camera" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>

      {/* <Back title={'Property Details'} /> */}
      <ScrollView
        style={{
          backgroundColor: '#f5f7fe',
        }}>
        <TouchableOpacity
          style={{paddingBottom: 30, backgroundColor: 'white'}}
          onPress={() => {
            navigation.navigate('BookingStatus', {
              Image: PropertiesArray?.image,
            });
          }}>
          <Swiper
            style={styles.wrapper}
            height={240}
            onMomentumScrollEnd={(e, state, context) => {}}
            dot={
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  // marginBottom: 3
                }}
              />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: '#043862',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  //   marginBottom: 3,
                }}
              />
            }
            paginationStyle={{
              bottom: -23,
              // left: null,
              right: 10,
            }}
            // loop={false}
            autoplay>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={{uri: PropertiesArray?.image?.Image1}}
            />

            <Image
              resizeMode="cover"
              style={styles.image}
              source={{uri: PropertiesArray?.image?.Image2}}
            />

            <Image
              resizeMode="cover"
              style={styles.image}
              source={{uri: PropertiesArray?.image?.Image3}}
            />

            <Image
              resizeMode="cover"
              style={styles.image}
              source={{uri: PropertiesArray?.image?.Image4}}
            />
          </Swiper>
        </TouchableOpacity>

        <View
          style={{
            // paddingHorizontal: 20,
            backgroundColor: 'white',
            //paddingVertical: 10,
            marginVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
              paddingHorizontal: 15,
              flex: 1,
              width: '100%',
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'OpenSans-Bold',
                  color: '#1E2135',
                  //letterSpacing:0.5
                }}>
                {PropertiesArray?.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flex: 1,
                  width: '100%',
                  alignItems:"center"
                }}>
                {/* <Image
            style={[styles.iconLayout1, {marginLeft: 10}]}
            resizeMode="cover"
            source={require('./assets/place.png')}
          /> */}
                <MaterialIcons name="location-pin" size={20} color="#043862" />
                <Text
                  style={{
                    fontSize: 13,
                    color: '#1E2135',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {PropertiesArray?.Location}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (IsLike.includes(`${PropertiesArray?._id}`)) {
                  handleDisLike(PropertiesArray?._id);
                } else {
                  handleLike(PropertiesArray);
                }
              }}>
              {IsLike.includes(`${PropertiesArray?._id}`) ? (
                <IconM name={'cards-heart'} size={32} color={'#FF3659'} />
              ) : (
                <IconM
                  name={'cards-heart-outline'}
                  size={32}
                  color={'#FF3659'}
                />
              )}
            </TouchableOpacity>
          </View>

          {Newupdate[0]?.eventName !== PropertiesArray?.name ? (
            <View
              style={{
                backgroundColor: '#dafdd5',
                borderRadius: 16,
                marginHorizontal: 16,
                marginVertical: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#dde8ff',
                  width: '18%',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderBottomRightRadius: 30,
                }}>
                <Text
                  style={{
                    color: '#1E2135',
                    fontSize: 12,
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  NEW
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginTop: 6,
                }}>
                <View style={{flex: 2, paddingRight: 10}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      fontFamily: 'WorkSans-SemiBold',
                      color: '#000000',
                      marginBottom: 4,
                    }}>
                    {Newupdate[0]?.eventName}
                  </Text>

                  <Text
                    numberOfLines={4}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Regular',
                      color: '#1E2135',
                      lineHeight: 18,
                    }}>
                    {Newupdate[0]?.Description}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={Event}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    dispatch(
                      profileDetailsById({id: '663074e88c3bd1839dd17c35'}),
                    );

                    const filtered = globalState?.ProDetails.filter(user =>
                      user?.name.includes(Newupdate[0]?.eventName),
                    );

                    navigation.push('Property', {
                      status: true,
                    });
                  }}>
                  <Image
                    source={{uri: Newupdate[0]?.Image}}
                    resizeMode="cover"
                    style={{
                      width: 78,
                      height: 78,
                      borderRadius: 10,
                    }}
                  />

                  <IconM
                    name="chevron-right-circle"
                    size={30}
                    color="#2F5233"
                    style={{marginLeft: 6}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: 'white',
            //marginVertical:10
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'WorkSans-SemiBold',
              color: '#000000',
              paddingBottom: 5,
            }}>
            Description
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Regular',
              color: '#1E2135',
              letterSpacing: 0.3,
              // paddingBottom: 5,
            }}>
            {showFullText
              ? PropertiesArray?.Description
              : PropertiesArray?.Description?.slice(0, 160)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowFullText(!showFullText);
            }}>
            <Text
              style={{
                fontSize: 14,
                // fontWeight: 600,
                fontFamily: 'OpenSans-SemiBold',
                letterSpacing: 0.3,
                // fontFamily: 'Montserrat-SemiBold',
                color: '#043862',
                // paddingBottom: 5,
              }}>
              {showFullText ? 'Read less' : 'Read more...'}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: 'white',
              //paddingHorizontal: 20,
              paddingVertical: 10,
              paddingBottom: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  //color: '#1E2135',
                  // paddingVertical:8
                  paddingBottom: 5,
                }}>
                Property Status
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  paddingBottom: 5,
                }}>
                {PropertiesArray?.PropertyStatus ?? 0}%
              </Text>
            </View>
            <Progress.Bar
              progress={(PropertiesArray?.PropertyStatus ?? 0) / 100}
              width={width - 40}
              borderColor="#252b5d"
              color="#252b5d"
              borderWidth={1}
              height={5}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginVertical: 20,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              //flexDirection: 'row',
              // justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                letterSpacing: 0.3,
                // fontWeight: 600,
                //color: '#1E2135',
                // color: 'black',
                paddingBottom: 15,
              }}>
              Property Details
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              marginHorizontal: 20,
              borderColor: '#DADADA',
              //padding: 10,
              borderRadius: 15,
              marginBottom: 10,
              backgroundColor: 'white',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Property Type
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                  textTransform: 'capitalize',
                }}>
                {PropertiesArray?.P_Type}{' '}
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Total Area
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Property Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  flex: 3,
                }}>
                Frac Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  flex: 1,
                  textAlign: 'center',
                }}>
                {' '}
                {'\u20B9 '}
                {PropertiesArray?.FC_Price}
              </Text>
            </View>

            {PropertiesArray?.SPV && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    flex: 3,
                  }}>
                  SPV Value
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    //flex: 1,
                    //textAlign: 'center',
                  }}>
                  {' '}
                  {'\u20B9 '}
                  {PropertiesArray?.SPV}
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  flex: 3,
                }}>
                Booking Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  //flex: 1,
                  //textAlign: 'center',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Fracs Details
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Total Fracs
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
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
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Available Fracs
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                {PropertiesArray?.AvailableFractions}
              </Text>
            </View>

            {PropertiesArray?.name == 'FRACSPACE @ HAVELOCK CITY' && (
              <View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#DADADA',
                    paddingVertical: 10,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#1E2135',
                    }}>
                    Pool Details
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
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#1E2135',
                    }}>
                    Pool-I
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                    }}>
                    6/15
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#DADADA',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: 10,
                  }}>
                  <Icon name="ellipse" size={10} color={'#1E2135'} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                      paddingLeft: 10,
                    }}>
                    Earn fixed 12% yield.
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
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#1E2135',
                    }}>
                    Pool-II
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                    }}>
                    20/20
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#DADADA',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: 10,
                  }}>
                  <Icon name="ellipse" size={10} color={'#1E2135'} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                      paddingLeft: 8,
                    }}>
                    Equal distribution of rentals after possession of the
                    Property.
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
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#1E2135',
                    }}>
                    Pool-III
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                    }}>
                    15/15
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: 10,
                  }}>
                  <Icon name="ellipse" size={10} color={'#1E2135'} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-Medium',
                      color: '#1E2135',
                      paddingLeft: 10,
                    }}>
                    Only capital appreciation.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{backgroundColor: 'white'}}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                // paddingBottom: 5,
              }}>
              Benefits
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            {PropertiesArray?.Benefits?.map((item, index) => (
              <View
                key={index}
                style={{alignItems: 'center', flex: 1, padding: 5}}>
                <Image
                  style={{width: 90, height: 90}}
                  resizeMode="cover"
                  source={{uri: item?.image}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',

                    textAlign: 'center',
                    top: -10,
                    // paddingBottom: 5,
                  }}>
                  {item?.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            GgoToYosemite(PropertiesArray?.Location);
            //navigation.navigate('Contact');
          }}
          style={{
            backgroundColor: 'white',
            marginVertical: 10,
            paddingBottom: 10,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                // paddingBottom: 5,
              }}>
              Property Location
            </Text>
          </View>
          <Image
            style={{width: '100%', height: 300}}
            source={{uri: PropertiesArray?.LocationImage}}
          />
        </TouchableOpacity>

        <View style={{backgroundColor: 'white', marginBottom: 10}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setStatus(!Status);
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                paddingBottom: Status ? 0 : 20,
              }}>
              Distinctive Amenities
            </Text>
            {Status ? (
              <Iconcall name="chevron-down" size={20} color="#1E2135" />
            ) : (
              <Iconcall name="chevron-right" size={20} color="#1E2135" />
            )}
          </TouchableOpacity>

          {Status && (
            <View
              style={{
                borderWidth: 1,
                marginHorizontal: 10,
                backgroundColor: '#E8ECF3',
                borderColor: '#DADADA',
                //padding: 10,
                borderRadius: 10,
                marginVertical: 10,
                //backgroundColor: 'white',
                padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <FlatList
                  data={PropertiesArray?.DistinctiveAmenities}
                  numColumns={3}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            </View>
          )}
        </View>
        <View style={{backgroundColor: 'white', marginBottom: 10}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setStatus1(!Status1);
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                //letterSpacing: 0.8,
                paddingBottom: Status ? 0 : 20,
              }}>
              Location Highlights
            </Text>
            {Status1 ? (
              <Iconcall name="chevron-down" size={20} color="#1E2135" />
            ) : (
              <Iconcall name="chevron-right" size={20} color="#1E2135" />
            )}
          </TouchableOpacity>

          {Status1 && (
            <View
              style={{
                //borderWidth: 1,
                marginHorizontal: 10,
                //backgroundColor: '#E8ECF3',
                //borderColor: '#DADADA',
                //padding: 10,
                borderRadius: 10,
                marginVertical: 10,
                //backgroundColor: 'white',
                //padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <FlatList
                  data={PropertiesArray?.locationHighlights}
                  numColumns={1}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItemSec}
                />
              </View>
            </View>
          )}
        </View>

        <View style={{backgroundColor: 'white'}}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                // paddingBottom: 5,
              }}>
              Testimonials
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <ScrollView horizontal={true}>
              <TouchableOpacity
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  navigation.navigate('VideoDisplay', {
                    vlink: PropertiesArray?.testimonial[1],
                  });
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 130, height: 100, borderRadius: 10}}
                  source={require('./assets/video1.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 100,
                  }}>
                  <Icon name={'caret-forward'} size={20} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  navigation.navigate('VideoDisplay', {
                    vlink: PropertiesArray?.testimonial[0],
                  });
                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 130, height: 100, borderRadius: 10}}
                  source={require('./assets/video2.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 100,
                  }}>
                  <Icon name={'caret-forward'} size={20} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  navigation.navigate('VideoDisplay', {
                    vlink: PropertiesArray?.testimonial[2],
                  });
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 130, height: 100, borderRadius: 10}}
                  source={require('./assets/video3.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 100,
                  }}>
                  <Icon name={'caret-forward'} size={20} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {PropertiesArray?.propertyReviewVideos?.length != 0 && (
          <View style={{backgroundColor: '#FFFFFF'}}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  // paddingBottom: 5,
                }}>
                Customers Reviews
              </Text>
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CustomersReview', {
                    PropertyName: PropertiesArray?.name,
                  });
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#021265',
                    textDecorationLine: 'underline',
                    // paddingBottom: 5,
                  }}>
                  + Add Review
                </Text>
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <ScrollView horizontal={true}>
                {PropertiesArray?.propertyReviewVideos?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      //  GgoToYosemite(PropertiesArray?.Location);
                      //navigation.navigate('Contact');
                      // console.log(item);
                      navigation.navigate('VideoDisplay', {vlink: item});
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      margin: 10,
                      paddingBottom: 10,
                    }}>
                    <Image
                      style={{width: 150, height: 180, borderRadius: 15}}
                      source={{uri: PropertiesArray?.userReviewImages[index]}}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: 180,
                      }}>
                      <Icon
                        name={'caret-forward'}
                        size={40}
                        color={'#AEAEAE'}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {CustomerReview?.videos != undefined &&
          CustomerReview?.videos.map((item, index) => (
            <View key={index} style={{backgroundColor: '#FFFFFF', padding: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 40}}
                    source={{uri: item?.uploader?.profilePic}}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'WorkSans-SemiBold',
                      color: '#000000',
                      marginLeft: 10,
                      // marginVertical:20
                    }}>
                    {item?.uploader?.name}
                  </Text>
                </View>

                <View
                  style={{
                    paddingVertical: 1,
                    borderRadius: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    backgroundColor: '#021265',
                    paddingHorizontal: 5,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#FFFFFF',
                      // marginVertical:20
                    }}>
                    {item?.rating}
                  </Text>
                  <Icon name="star" size={8} color="#FFFFFF" />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'WorkSans-Medium',
                  color: '#000000',
                  marginVertical: 10,
                  paddingLeft: 10,
                }}>
                {item?.description}
              </Text>
              {item?.url.slice(-3) == 'MP4' ? (
                <Video
                  source={{
                    uri: item?.url,
                  }} // Use a URL or local file path
                  style={styles.backgroundVideo}
                  repeat={true} // Optional: Repeat the video
                  muted={true} // Optional: Mute the video
                  resizeMode="cover" // Optional: Choose the right resize mode
                />
              ) : (
                <Image
                  style={{
                    width: 90,
                    height: 80,
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                  source={{uri: item?.url}}
                />
              )}
            </View>
          ))}
      </ScrollView>
      {/* <Share/> */}
      <View
        style={{
          width: '100%',
          backgroundColor: '#f5f7fe',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          // opacity:0.4
        }}>
        <TouchableOpacity
          disabled={PropertiesArray?.AvailableFractions == 0 ? true : false}
          style={{
            backgroundColor:
              PropertiesArray?.AvailableFractions == 0 ? '#AEAEAE' : '#56018A',
            flex: 1,
            borderRadius: 10,
            alignItems: 'center',
            padding: 20,
            marginRight: 10,
          }}
          onPress={() => {
            navigation.navigate('Book', {property: PropertiesArray});
          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: 15,
              fontFamily: 'Montserrat-Bold',
              color: '#FFFFFF',
            }}>
            {PropertiesArray?.AvailableFractions == 0
              ? 'Not Available'
              : 'Book Now'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#021265',
            flex: 1,
            borderRadius: 10,
            alignItems: 'center',
            padding: 20,
          }}
          onPress={() => {
            //setModalVisible(true);
            //console.log(CustomerReview?.videos);
            navigation.navigate('Enquirenew', {property: PropertiesArray});
          }}>
          <Text
            style={{
              // fontFamily: 'Roboto',
              fontSize: 15,
              fontFamily: 'OpenSans-Bold',
              color: '#FFFFFF',
            }}>
            Enquire Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  maskGroupIconLayout: {
    width: width * 0.2,
    height: height * 0.12,
  },
  maskGroupIconLayout1: {
    width: width * 0.2,
    height: height * 0.12,
  },
  customModal: {
    width: '100%',
    // paddingBottom: 20,
  },
  modal: {
    // paddingTop: hp(2),
    // height: hp(70),
    width: '100%',
    alignSelf: 'center',
    borderColor: '#DADADA',
    borderWidth: 0,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    //backgroundColor: '#8A8A8A',
    //opacity:0.7,
    // marginBottom: hp(6),
    //  borderBottomWidth: 0,
    //borderColor:'red',
    // borderWidth:3,
    marginHorizontal: 20,
    paddingHorizontal: 25,
    //paddingVertical:hp(2),
  },

  iconLayout1: {
    height: 16,
    width: 16,
    overflow: 'hidden',
    left: -8,
    // marginLeft: 10,
  },
  image: {
    width,
    flex: 1,
  },
  wrapper: {},
  container: {
    flex: 1,
  },
  backgroundVideo: {
    width: 60,
    height: 60,
    marginLeft: 10,
    //borderRadius:10
  },
});
