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
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
//import { ScrollView } from 'react-native-virtualized-view';
import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import openMap, { createOpenLink } from 'react-native-open-maps';
import { AppContext } from './Context/AppContext';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import IconEn from 'react-native-vector-icons/Entypo';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from './CustomModal';
import Iconcall from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import * as Progress from 'react-native-progress';
import Video, { VideoRef } from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DisLike,
  GetReviewData,
  Like,
  LikeData,
  NewUpdate,
  PropertyDetailsById,
  ReviewData,
  SiteVisit,
  UploadEnquiry,
} from './Services/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNewUpdates,
  profileDetailsById,
  refrerLink,
  resetProfileState,
} from './redux/reducer/propertyReducer';
import PropertySkeleton from './components/PropertySkeleton';
import store from './redux/store/store';
import { fetchProperties, setDeepLinkNav } from './redux/reducer/homeReducer';
import Back from './Back';
import LinearGradient from 'react-native-linear-gradient';
import { ApartmentLogo, AreaLogo } from './Version2_O/assets';
import HighlightCarousel from './components/propertyDEtails.js/LocationHighlight';
import Stepper from './components/Stipper';
import InvestmentCards from './components/propertyDEtails.js/InvestMentcards';
import PaymentPlan from './components/propertyDEtails.js/PaymentPlan';
import analytics from '@react-native-firebase/analytics';
import CardConverter from './components/CardConverter';


export default function Property(props) {
  const { globalState, setGlobalState } = useContext(AppContext);
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
  const [propertyStatu, setPropertyStatu] = useState(props?.route?.params?.details?.PropertyStatus || 0);
  const isDeepLink = useSelector(state => state.home.isDepplinkNav);
  // const Newupdate = useSelector(state => state.property.newUpdates);
  const [Newupdate, setNewupdate] = useState([]);
  // console.log(Newupdate,"newUpdates======")
  // const PropertiesArray = useSelector(state => state.property.PropertyDetailsById);
  const [PropertiesArray, setPropertiesArray] = useState([]);
  const loading = useSelector(state => state.property.loading);
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;
  const [CustomerReview, setCustomerReview] = useState([]);
  const referralData = useSelector(state => state.property.referralData);
  const updates = PropertiesArray?.propertyUpdates || [];
  const [activeIndex, setActiveIndex] = useState(1);
  const locations = PropertiesArray?.locationHighlights || [];
  const [showHelp, setShowHelp] = useState(false)
  const [showVideo, setShowVideo] = useState(false);
  const itemWidth = Dimensions.get('window').width / updates.length;
  const PropertyDetails = useSelector(state => state.home.Properties);
  const [viewEnquiry, setViewEnquiry] = useState(false);
  const isSpecialProperty = PropertiesArray?._id === '69c4c39546c743d80a8a0c63';
  const [name, setName] = useState(globalState?.userName);
  const [email, setEmail] = useState(globalState?.userEmail);
  const [phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
  const [message, setMessage] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [actionsActive, setActionsActive] = useState(true);
    const [visible, setVisible] = useState(false);
  const actionsOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const TotalFractions = PropertiesArray?.TotalFractions;
  const AvailableFractions = PropertiesArray?.AvailableFractions;
  //console.log(TotalFractions, PropertiesArray?.TotalFractions, "PropertiesArray?.TotalFractions", AvailableFractions)
  const CompletedFractions = TotalFractions - AvailableFractions;
  const FracPer =
    PropertiesArray?.TotalFractions > 0
      ? ((TotalFractions - AvailableFractions) /
        TotalFractions) *
      100
      : 0;

  const CompletedPercentage =
    TotalFractions > 0
      ? Math.round((CompletedFractions / TotalFractions) * 100)
      : 0;

  const lastCompletedIndex = updates
    .map((i, idx) => (i.completed ? idx : -1))
    .filter(i => i !== -1)
    .pop();

  const currentIndex = lastCompletedIndex + 1;

  const [Proid, setProId] = useState(proId)
  //console.log(PropertiesArray,"PropertiesArray")
  const GgoToYosemite = location => {
    openMap({ query: location });
  };


useFocusEffect(
  useCallback(() => {
    if (proId) {
      dispatch(profileDetailsById({ id: proId }));
    }
  }, [proId])
);

// const getExchangeRate = async() => {
//   try{
//     const rate = await fetch(
//       'https://open.er-api.com/v6/latest/INR'
//     );
//     const data = await rate.json();
//     console.log("data of exchange: ", data);
//   }catch(error){
//     console.log("error in exchange rate: ", error);
//   }
// }


useFocusEffect(
  useCallback(() => {
    // dispatch(fetchNewUpdates());
    dispatch(fetchProperties());
  }, [])
);

useEffect(() => {
  dispatch(refrerLink());
}, []);

  useEffect(() => {
    analytics().logEvent('view_property', {
      property_id: PropertiesArray?._id
    });
  }, []);

  const fetchPropetyById = async (id) => {
    setLoadingCount(c => c+1);
    try{
      const {data: res} = await PropertyDetailsById(id);
      if(res){
        setPropertiesArray(res?.property);
        setPropertyStatu(res?.property?.PropertyStatus);
      }else{
        setPropertiesArray([]);
      }
    } catch(error) {
      console.error('Error in fetching property by id: ', error?.response?.data || error?.message);
      setPropertiesArray([]);
    }finally{
      setLoadingCount(c => c-1);
    }
  }

  const handleUpdate = async () => {
    setLoadingCount(c => c+1);
    try {
      let { data: res } = await NewUpdate();
      if (res?.success) {
        setNewupdate(res?.updates);
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
    } finally{
      setLoadingCount(c => c-1);
    }
  };

  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
    console.log("Payload for Dislike: ", payload);
    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        const filteredNumbers = IsLike.filter(number => number !== Productid);
        setIsLike(filteredNumbers);
      }
      console.log('Response from Dislike: ', res);
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
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
    console.log("Payload for Like: ", payload);
    try {
      let { data: res } = await Like(payload);
      if (res?.success) {
        setIsLike([...IsLike, item?._id]);
      } else {
        handleDisLike(item?._id);
      }
      console.log('Response from Like: ', res);
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleAllLike = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
    });
    try {
      let { data: res } = await LikeData(payload);

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
    
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
//console.log(PropertiesArray?.GoogleMapLink,"PropertiesArray?.GoogleMapLink")
  const handleReview = async () => {
    //const email = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      propertyName: PropertiesArray?.name,
    });
    try {
      let { data: res } = await GetReviewData(payload);
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
    fetchPropetyById(proId);
    handleUpdate();
    handleAllLike();
    handleReview();
  }, []);

  const shareReferral = async (propertyId) => {
    try {
      if (!referralData?.referralCode) return;
      analytics().logEvent('share_property', {
        property_id: propertyId
      });
      const link =
        `https://fracspace.onelink.me/OVdL` +
        `?deep_link_value=property` +
        `&af_sub1=${referralData.referralCode}` +
        `&af_sub2=${propertyId}`;
      await Share.share({
        message: `Invest smarter with Fracspace 🚀\nJoin using my link:\n${link}`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const formatInvestmentAmount = (value) => {
    if (!value) return "";

    return value
      .replace(/Lakhs?/i, "L")   // Lakhs → L
      .replace(/Crores?/i, "Cr") // Crores → Cr (future safe)
      .replace(/\s+/g, "");      // remove space
  };
  const propertyProgress = Number(PropertiesArray?.PropertyStatus);

  const handleCallNow = () => {
    const phoneNumber = '+919880626111';
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          console.log('Phone number is not supported');
        } else {
          console.log('Phone call initiated');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };

  const handleMail = () => {
    const mailto = 'mailto:support@fracspace.com';
    Linking.openURL(mailto)
      .catch((err) => console.error('An error occurred', err));
  };

  const handleSiteVist = async date => {
    // console.log(date);
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      userName: globalState?.userName,
      propertyId: PropertiesArray?._id,
      propertyName: PropertiesArray?.name,
      price: PropertiesArray?.Price,
      FC_Price: PropertiesArray?.FC_Price,
      phoneNumber: globalState?.userDetails?.phoneNumber,
      date: date,
      time: date,
    });
    //  console.log(payload);

    try {
      let { data: res } = await SiteVisit(payload);

      if (res?.success) {
        Alert.alert(
          'Successful Schedule Site Visit',
          `Your Site Visit Schedule is ${date}`,
        );
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  if (loading || !PropertiesArray || isLoading) {
    return <PropertySkeleton />;
  }
  const reviews = PropertiesArray?.userReviews || [];
  
  const images = Array.isArray(PropertiesArray?.image)
    ? PropertiesArray.image
    : Object.values(PropertiesArray?.image || {}).filter(Boolean);

  const imageCount = images.length;

  const handleEnquiryForm = async () => {
    let payload = JSON.stringify({
      name: globalState?.userName,
      email: globalState?.userEmail,
      phoneNumber: globalState?.userDetails?.phoneNumber,
      message: `Enquiry for Altaira Villa. ${message}`
    });
    try {
      let { data: res } = await UploadEnquiry(payload);
      return res;
    } catch (error) {
      console.error('Error in uploading enquiry form: ', error?.response?.message || error.message);
      return null;
    }
  };


  const VideoImgData = () => {
    const hasVideo = PropertiesArray?.video;

    return (
      <LinearGradient
      //  pointerEvents="box-none"
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 70,
          justifyContent: 'center',
          paddingHorizontal: 10,
         // borderWidth:1
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 30,
          }}
        >

          {/* VIDEO */}
          {hasVideo && (
            <TouchableOpacity
              onPress={() => setShowVideo(true)}
              style={{ alignItems: 'center' }}
            >
              <Image
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/VideoIcon.png',
                }}
                style={{
                  height: 28,
                  width: 38,
                  resizeMode: 'contain',
                  tintColor: '#fff',
                }}
              />

              {/* NAME */}
              <Text style={{ color: '#fff', marginTop: 4 }}>
                Video
              </Text>

              {/* ACTIVE LINE */}
              {showVideo && (
                <View
                  style={{
                    height: 2,
                    width: 50,
                    backgroundColor: '#fff',
                    marginTop: 6,
                    borderRadius: 2,
                  }}
                />
              )}
            </TouchableOpacity>
          )}

          {/* CAMERA */}
          <TouchableOpacity
            onPress={() => setShowVideo(false)}
            style={{ alignItems: 'center' }}
          >
            <Image
              source={{
                uri: 'https://duixj37yn5405.cloudfront.net/appImages/CameraIcon.png',
              }}
              style={{
                height: 28,
                width: 38,
                resizeMode: 'contain',
                tintColor: '#fff',
              }}
            />

            {/* NAME */}
            <Text style={{ color: '#fff', marginTop: 4 }}>
              Image
            </Text>

            {/* ACTIVE LINE */}
            {!showVideo && (
              <View
                style={{
                  height: 2,
                  width: 60,
                  backgroundColor: '#fff',
                  marginTop: 6,
                  borderRadius: 2,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  const ScrollData = () => {
    return (
      <View style={{
        flex: 1, backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      }}>
        <View style={{ borderWidth: 2, width: 70, alignSelf: "center", borderColor: "rgba(217, 217, 217, 1)", marginTop: 10, borderRadius: 10, marginBottom: 10 }} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 12,
            paddingHorizontal: 15,
            flex: 1,
            width: '100%',
          }}>

          <Text
            style={{
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              color: '#1E2135',
              width: "80%"
            }}>
            {PropertiesArray?.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (IsLike.includes(`${PropertiesArray?._id}`)) {
                handleDisLike(PropertiesArray?._id);
              } else {
                handleLike(PropertiesArray);
              }
            }}>
            {IsLike.includes(`${PropertiesArray?._id}`) ? (
              <Icon name={'heart'} size={28} color={'#FF3659'} />
            ) : (
              <Icon
                name={'heart-outline'}
                size={28}
                color={'#FF3659'}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#b3b0b0" }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
            {/* <MaterialIcons name="location-pin" size={20} color="#043862" /> */}
            <Text
              style={{
                fontSize: 13,
                color: '#1E2135',
                fontFamily: 'Poppins-SemiBold',
                width: '55%',
                // borderWidth:1
              }}>
              {PropertiesArray?.Location}
            </Text>
            <View>

              <TouchableOpacity
                onPress={() => {
                  {PropertiesArray?.GoogleMapLink ? Linking.openURL(PropertiesArray?.GoogleMapLink) : GgoToYosemite(PropertiesArray?.Location)}
                }}>
                <View
                  style={{}}>

                </View>
                <Image resizeMode='cover'
                  style={{ width: 150, height: 90, borderRadius: 10 }}
                  source={{ uri: PropertiesArray?.LocationImage }}
                />
              </TouchableOpacity>

            </View>
          </View>

          <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#b3b0b0" }} />

          {Newupdate[0]?.Status && Newupdate[0]?.eventName !== PropertiesArray?.name ? (
            <TouchableOpacity disabled={Event}
              onPress={() => {
                const filtered = globalState?.ProDetails.filter(user =>
                  user?.name.includes(Newupdate[0]?.eventName))
                const propertyMap = Object.fromEntries(
                  PropertyDetails.map(p => [p.name.toLowerCase(), p._id])
                );
                const propertyId =
                  propertyMap[Newupdate?.[0]?.eventName?.toLowerCase()]
                const id = propertyId
              //  dispatch(resetProfileState());
              //   dispatch(
              //     profileDetailsById({ id }),
              //   );
               // setProId(id)
                navigation.push('Property', {
                  status: true,
                  Id: id
                })
              }}
              style={{ backgroundColor: 'rgba(200, 223, 200, 0.55)', paddingVertical: 8, borderRadius: 10, marginTop: 20 }} >

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginTop: 6,
                }}>

                <View style={{ flex: 2, paddingRight: 10, }}>
                  <View style={{ backgroundColor: "rgba(177, 207, 177, 1)", borderRadius: 10, padding: 4, width: 100 }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Work Sans', alignSelf: "center" }}>NEW LAUNCH</Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      fontFamily: 'WorkSans-SemiBold',
                      color: '#000000',
                      marginBottom: 1,
                      paddingVertical: 10
                    }}>
                    {Newupdate[0]?.eventName}
                  </Text>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 10,
                      fontFamily: 'Work Sans',
                      color: '#1E2135',
                      lineHeight: 16,
                    }}>
                    {Newupdate[0]?.Description}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'Work Sans',
                    color: 'rgba(44, 118, 44, 1)',
                    lineHeight: 14,
                    fontWeight: 500,
                    paddingVertical: 3
                  }}>View Property {""}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: Newupdate[0]?.Image }}
                    resizeMode="cover"
                    style={{
                      width: 118,
                      height: 104,
                      borderRadius: 10,
                    }}
                  />

                </View>
              </View>
            </TouchableOpacity>

          ) : null}

          {/* {Newupdate[0]?.Status && Newupdate[0]?.eventName != PropertiesArray?.name && (
                    <View style={{ backgroundColor: '#D0DDD080',paddingHorizontal:12,paddingVertical:10,borderRadius:10,marginTop:15 }}>
                        
                        <TouchableOpacity disabled={Event} onPress={() => {
                            const filtered = globalState?.ProDetails.filter(user =>
                                user?.name.includes(Newupdate[0]?.eventName),
                            );
                            navigation.push('Property', {Id: filtered[0]?._id,status: true,});
                        }} style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',marginTop:5}}>
                            <View style={{ flex: 2 ,gap:5}}>
                                <View style={{backgroundColor:'#B1CFB1',borderRadius:15,padding:5,paddingHorizontal:10,alignSelf:'flex-start'}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:10,color:'#000'}}>NEW LAUNCH</Text>
                                </View>
                                <Text style={{ fontSize: 14, fontFamily: 'WorkSans-SemiBold', color: '#000000', }}>
                                    {Newupdate[0]?.eventName}
                                </Text>
                                <Text
                                numberOfLines={2}
                                style={{ fontSize: 10, fontFamily: 'Poppins-Regular', letterSpacing: 0.3, color: '#000000Bf', }}>
                                    {Newupdate[0]?.Description}
                                </Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#2C762C'}}>View Property</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:10 }}>
                                <SafeImage
                                    style={{ width: 114, height: 105, borderRadius: 10 }}
                                    resizeMode="cover"
                                    source={{ uri: Newupdate[0]?.Image }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )} */}

          <View
            style={{
              paddingTop: 20,
              paddingVertical: 10,
              backgroundColor: 'white',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                paddingBottom: 5,
              }}
            >
              Description
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Work Sans',
                color: '#1E2135',
                letterSpacing: 0.3,
              }}
            >
              {showFullText
                ? PropertiesArray?.Description
                : PropertiesArray?.Description?.slice(0, 150)}

              {PropertiesArray?.Description?.length > 150 && (
                <Text
                  onPress={() => setShowFullText(!showFullText)}
                  style={{
                    fontSize: 13,
                    fontFamily: 'OpenSans-SemiBold',
                    color: 'rgba(0, 0, 0, 1)',
                  }}
                >
                  {showFullText ? ' Read less' : '... Read more'}
                </Text>
              )}
            </Text>
          </View>


          <View style={{ paddingTop: 10, backgroundColor: 'white' }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000',
                  //  marginBottom: 15
                }}
              >
                Property Status
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000',
                  marginBottom: 20,
                  marginRight: 15
                }}
              >
                {PropertiesArray?.PropertyStatus}%
              </Text>
            </View>

            {/* <View style={{ marginLeft: -14 }}>
              <Stepper updates={updates} currentIndex={2} />
            </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                    {PropertiesArray?.propertyUpdates?.map((item, index) => {
                        const isCompleted = item.completed === true;
                        const isCurrent = item.stage === "underConstruction";
                        return (
                          <View key={index} style={{ alignItems: 'center', width: width * 0.14, zIndex: 1}}>    
                              <View
                                  style={{
                                      width: 24,height: 24,borderRadius: 12,alignItems: 'center',justifyContent: 'center',borderWidth: 2,
                                      backgroundColor: '#fff',
                                      borderColor: isCompleted || isCurrent ? '#021265' : '#BDBDBD'
                                  }}
                              >
                                  {isCompleted && (
                                      <Icon name={'checkmark-circle'} size={20} color={'#021265'} />
                                  )}
                                  {isCurrent && (
                                      <View style={{width: 8,height: 8,borderRadius: 4,backgroundColor: '#021265' }} />
                                  )}
                              </View>
                          </View>
                        );
                    })}
                    <View style={{ position: 'absolute', top: 12, left: 20, right: 20, height: 2, backgroundColor: '#D3D3D3' }}/>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  {PropertiesArray?.propertyUpdates?.map((item, index) => {
                    const isCurrent = item?.stage === 'underConstruction'
                    return(
                    <View key={index} style={{width:width*0.14}}>
                      <Text style={{fontFamily:isCurrent ? 'WorkSans-Medium' : 'WorkSans-Regular',fontSize: 8,color:isCurrent ? '#000':'#00000065',textAlign: 'center',marginTop: 6 }} >
                          {item.data}
                      </Text>
                    </View>
                  )})}
                </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "WorkSans-SemiBold",
                color: "#000",
                marginBottom: 15,
              }}
            >
              Property Details
            </Text>
            {PropertiesArray?.investmentDetails?.show ? <View
              style={{
                backgroundColor: "#0E1F66",
                borderRadius: 12,
                padding: 18,
                marginBottom: 10
              }}
            >
              <Text style={{ color: "#AAB3E3", fontSize: 12 }}>
                {PropertiesArray?.investmentDetails?.product}
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 17,
                  fontFamily: "Work Sans",
                  marginVertical: 8,
                }}
              >

                {PropertiesArray?.investmentDetails?.type}
              </Text>

              <View style={{ flexDirection: "row", }}>
                <View style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: 12, paddingHorizontal: 10,
                  padding: 5,
                }}>
                  <Text style={{
                    color: "#AAB3E3", fontSize: 10, fontFamily: "Work Sans"
                  }}>  {PropertiesArray?.investmentDetails?.positioning}</Text>
                </View>
                <View style={{
                  backgroundColor: "rgba(255, 215, 90, 0.18)",
                  borderRadius: 12, paddingHorizontal: 10,
                  padding: 5, justifyContent: "center", marginLeft: 10
                }}>
                  <Text style={{
                    color: "rgba(255, 215, 90, 1)", fontSize: 10, fontFamily: "Work Sans",
                  }}>PRE-LAUNCH</Text>
                </View>
              </View>
            </View> : null}



            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

              {/* AREA */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: "#F5F7FB",
                  padding: 15,
                  borderRadius: 10,
                  marginRight: 10,
                  alignItems: "center",
                  width: "45%"
                }}
              >
                <View style={{ backgroundColor: "rgba(225, 230, 240, 0.75)", padding: 10, borderRadius: 20, alignItems: "center", marginRight: 5 }}>
                  <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Squaree.png' }} style={{ height: 20, width: 20, alignSelf: "center" }} />
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: "#7B7B7B" }}>AREA</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "WorkSans",
                      marginTop: 5,
                      width: "100%",
                      // borderWidth:1
                    }}
                  >
                    {PropertiesArray?.area ?? "- Sq.ft"}
                  </Text>
                </View>

              </View>

              {/* TYPE */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: "#F5F7FB",
                  padding: 15,
                  borderRadius: 10,
                  marginLeft: 10,
                  alignItems: "center",
                  width: "50%"
                }}
              >
                <View style={{ backgroundColor: "rgba(225, 230, 240, 0.75)", padding: 10, borderRadius: 20, alignItems: "center", marginRight: 5, }}>
                  <Image source={{ uri: "https://duixj37yn5405.cloudfront.net/appImages/PprtyType.png" }} style={{ height: 20, width: 20, alignSelf: "center" }} />
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: "#7B7B7B" }}>TYPE</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "WorkSans",
                      marginTop: 5,
                      width: 124,
                      //  borderWidth:1
                    }}
                  >
                    {PropertiesArray?.P_Type ?? "Apartment"}
                  </Text>
                </View>

              </View>

            </View>
          </View>

          <View style={{ marginTop: 15, }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "WorkSans-SemiBold",
                color: "#000",
                marginBottom: 15,
              }}
            >
              Investment Breakdown
            </Text>

            {/* <View
              style={{
                backgroundColor: "#0E1F66",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <Text style={{ color: "#AAB3E3", fontSize: 12 }}>
                TOTAL PROPERTY VALUE
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontFamily: "WorkSans-Bold",
                  marginVertical: 8,
                }}
              >
                ₹{PropertiesArray?.Price ?? "0,00,00,000"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: PropertiesArray?.SPV ? "space-between" : "flex-start",
                  // flexWrap:"wrap",
                  marginTop: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.verticalDivider} />
                  <View>
                    <Text style={{ color: "#AAB3E3", fontSize: 11 }}>FRAC VALUE</Text>
                    <Text style={{ color: "white", fontSize: 14 }}>
                      ₹{PropertiesArray?.FC_Price ?? "10,00,000"}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", }}>
                  <View style={[styles.verticalDivider, { marginLeft: PropertiesArray?.SPV ? 0 : 20 }]} />
                  <View>
                    <Text style={{ color: "#AAB3E3", fontSize: 11 }}>BOOKING VALUE</Text>
                    <Text style={{ color: "white", fontSize: 14 }}>
                      {isSpecialProperty ? '$' : '₹'}{PropertiesArray?.BookingAmt ?? "00,000"}
                    </Text>
                  </View>
                </View>


                {PropertiesArray?.SPV ? (<>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.verticalDivider} />
                    <View>
                      <Text style={{ color: "#AAB3E3", fontSize: 11 }}>SPV VALUE</Text>
                      <Text style={{ color: "white", fontSize: 14 }}>
                        ₹{PropertiesArray?.spvValue ?? "25,000"}
                      </Text>
                    </View>
                  </View>

                </>
                ) : null}

              </View>
            </View> */}

            <CardConverter PropertiesArray={PropertiesArray}/>

          </View>


          <View
            style={{
              backgroundColor: "white",
              marginVertical: 20,
              padding: 18,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E6E6E6",
            }}
          >
            <Text style={{ fontSize: 12, color: "#7B7B7B" }}>AVAILABILITY</Text>

            {(PropertiesArray?.TotalFractions / 2 || 5) < PropertiesArray?.AvailableFractions ? (
              <Text style={{ fontSize: 16, fontFamily: "WorkSans-SemiBold", marginVertical: 6 }}>
                <Text style={{ color: "#FF3B30" }}>
                  {PropertiesArray?.AvailableFractions ?? "-"} {PropertiesArray?.name == "ALTAIRA – VILLA" ? "Villas" : "Fracs"}
                </Text>{" "}
                left!
              </Text>
            ) : PropertiesArray?.AvailableFractions === 0 ? (
              <Text style={{ color: "#FF3B30", fontSize: 16, fontFamily: "WorkSans-SemiBold", marginVertical: 6 }} >
                0 {PropertiesArray?.name == "ALTAIRA – VILLA" ? "Villas" : "Fracs"}
              </Text>
            ) : (
              <Text style={{ fontSize: 16, fontFamily: "WorkSans-SemiBold", marginVertical: 6 }}>
                Only{" "}
                <Text style={{ color: "#FF3B30" }}>
                  {PropertiesArray?.AvailableFractions ?? "-"} {PropertiesArray?.name == "ALTAIRA – VILLA" ? "Villas" : "Fracs"}
                </Text>{" "}
                left!
              </Text>
            )}


            {/* Progress Bar */}
            <View
              style={{
                height: 6,
                backgroundColor: "#E5E7EB",
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  width: `${FracPer}%`,
                  height: 6,
                  backgroundColor: "#0E1F66",
                  borderRadius: 5,
                }}
              />
            </View>

            {(PropertiesArray?.AvailableFractions !== PropertiesArray?.TotalFractions) ?
              <Text
                style={{
                  fontSize: 11,
                  color: "#7B7B7B",
                  marginTop: 6,
                }}
              >
                {CompletedPercentage}% of the property is already owned by {CompletedFractions} investors
              </Text> : <Text style={{
                fontSize: 11,
                color: "#7B7B7B",
                marginTop: 6,
              }}>Be among the first to own a frac in this property.</Text>}
          </View>

          {/* {PropertiesArray?.investmentDetails?.show ? <InvestmentCards
            leftCard={{
              icon: '$',
              tag: PropertiesArray?.investmentDetails?.broi?.tenure,
              value: PropertiesArray?.investmentDetails?.broi?.percentage,
              title: PropertiesArray?.investmentDetails?.broi?.label,
              subtitle: PropertiesArray?.investmentDetails?.broi?.description,
            }}
            rightCard={{
              icon: '📈',
              tag: PropertiesArray?.investmentDetails?.appreciation?.duration,
              value: PropertiesArray?.investmentDetails?.appreciation?.expectedUpside,
              title: PropertiesArray?.investmentDetails?.appreciation?.label,
              subtitle: PropertiesArray?.investmentDetails?.appreciation?.entry,
            }}
          /> : null} */}

          {PropertiesArray?.investmentDetails?.show &&
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                    {/* <View style={{backgroundColor:'#FFF',borderRadius:14,padding:12,gap:10,flex:1}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{backgroundColor:'#E6F4EA',padding:3,borderRadius:5}}>
                                <IconMail name={'dollar-sign'} size={13} color={'#1A6E38'}/>
                            </View>
                            <View style={{backgroundColor:'#E6F4EA',padding:3,borderRadius:5,paddingHorizontal:6}}>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:11,color:'#1A6E38'}}>{PropertiesArray?.investmentDetails?.broi?.tenure}</Text>
                            </View>
                        </View>
                        <View style={{gap:3}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#111827'}}>{PropertiesArray?.investmentDetails?.broi?.percentage}%</Text>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:11,color:'#0F1130'}}>{PropertiesArray?.investmentDetails?.broi?.label}</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000099'}}>{PropertiesArray?.investmentDetails?.broi?.description}</Text>
                        </View>
                    </View> */}
                    <View style={{backgroundColor:'#ffffffb1',borderRadius:14,padding:12,gap:10,flex:1,borderWidth:0.5,borderColor:'#E6E6E6'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{backgroundColor:'#0212651A',padding:3,borderRadius:5}}>
                                <Iconcall name={'trending-up'} size={13} color={'#021265'}/>
                            </View>
                            <View style={{backgroundColor:'#0212651A',padding:3,borderRadius:5,paddingHorizontal:6}}>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:11,color:'#021265'}}>{PropertiesArray?.investmentDetails?.appreciation?.duration}</Text>
                            </View>
                        </View>
                        <View style={{gap:3}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#111827'}}>{PropertiesArray?.investmentDetails?.appreciation?.expectedUpside}</Text>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:11,color:'#0F1130'}}>{PropertiesArray?.investmentDetails?.appreciation?.label}</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000099'}}>{PropertiesArray?.investmentDetails?.appreciation?.entry}</Text>
                        </View>
                    </View>
                </View>
                }

          <View style={{ backgroundColor: "white", marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Ownership Advantages</Text>

            {PropertiesArray?.Benefits?.map((item, index) => (
              <View key={index} style={styles.advantageCard}>

                {/* <View style={styles.leftBorder} /> */}

                <Image source={{ uri: item?.image }} style={styles.advantageIcon} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.advantageTitle}>{item?.name}</Text>
                  <Text style={styles.advantageDesc}>{item?.description}</Text>
                </View>

              </View>
            ))}
          </View>

          {/* {PropertiesArray?.investmentDetails?.show ?
            <View style={{ paddingTop: 10, backgroundColor: 'white', marginTop: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text
                  style={styles.sectionTitle}
                >Payment Plan
                </Text>
                <View style={{
                  backgroundColor:"#FFF",
                  borderRadius:5,
                  shadowColor: '#02060d',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  justifyContent:"center",
                  marginBottom:15,
                  padding:7
                  }}>
                    <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Work Sans',
                    color: 'rgba(2, 18, 101, 1)',
                    backgroundColor: "#fff",
                    alignSelf:"center"
                  }}
                >
                  {formatInvestmentAmount(
                    PropertiesArray?.investmentDetails?.fractionModel?.costPerFraction
                  )} total
                </Text>
                </View>
              
              </View>

              <View style={{ marginLeft: 0 }}>
                <PaymentPlan data={PropertiesArray?.investmentDetails?.paymentPlan} />
              </View>
            </View> : null} */}


          <View style={{ backgroundColor: "white", marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Signature Amenities</Text>

            {/* <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={PropertiesArray?.DistinctiveAmenities}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.amenityCard}>

                    <View style={styles.amenityIconCircle}>
                      <Image source={{ uri: item?.image }} style={styles.amenityIcon} />
                    </View>

                    <Text style={styles.amenityText}>{item.name}</Text>

                  </View>
                )
              }} /> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:15}}>
              {PropertiesArray?.DistinctiveAmenities?.map((item, index) => (
                <View key={index} style={{backgroundColor:'#9db2ce1a',width:width*0.3,padding:15,alignItems:'center',borderRadius:7,marginRight:13}}>
                  <View style={{backgroundColor:'#FFF',padding:6,borderRadius:20}}>
                    <Image source={{uri: item?.image}} style={{width:28,height:28}}/>
                  </View>
                  <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#0f1130',textAlign:'center',marginTop:5}}>{item?.name}</Text>
                </View>
              ))}
            </ScrollView>

          </View>

          {PropertiesArray?.investmentDetails?.show ?
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: "rgba(2, 18, 101, 1)",
                  borderRadius: 10,
                  padding: 18,
                  marginBottom: 10,
                  width: "49%"
                }}
              >
                <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11 }}>
                  {PropertiesArray?.investmentDetails?.exitType?.label}
                </Text>

                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontFamily: "Work Sans",
                    marginVertical: 8,
                    fontWeight: 500
                  }}
                >
                  {PropertiesArray?.investmentDetails?.exitType?.type}
                </Text>

                <Text style={{
                  color: "rgba(255, 255, 255, 0.7)", fontSize: 12, fontFamily: "Work Sans"
                }}>
                  {PropertiesArray?.investmentDetails?.exitType?.duration}
                </Text>

              </View>

              <View
                style={{
                  backgroundColor: "rgba(2, 18, 101, 1)",
                  borderRadius: 10,
                  padding: 18,
                  marginBottom: 10,
                  width: "49%"
                }}
              >
                <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11 }}>
                  {PropertiesArray?.investmentDetails?.possession?.label}
                </Text>

                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontFamily: "Work Sans",
                    marginVertical: 8,
                    fontWeight: 500
                  }}
                >

                  {PropertiesArray?.investmentDetails?.possession?.estd}
                </Text>
                <Text style={{
                  color: "rgba(255, 255, 255, 0.7)", fontSize: 12, fontFamily: "Work Sans"
                }}>{PropertiesArray?.investmentDetails?.possession?.description}
                </Text>
              </View>
            </View>


            : null}
          <View style={{ backgroundColor: "white", marginTop: 30 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Location Highlights</Text>
            <HighlightCarousel highlights={PropertiesArray?.locationHighlights} />
          </View>

          {reviews.length > 0 && (
            <View style={{ backgroundColor: "white", marginVertical: 20 }}>

              <Text style={styles.sectionTitle}>Reviews</Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={reviews}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingLeft: 10 }}
                renderItem={({ item }) => (
                  <View style={[styles.card, { width: 320, justifyContent: "center", alignItems: "center" }]}>

                    {/* Review Text */}
                    <Text numberOfLines={4} style={styles.reviewText}>
                      {item.review}
                    </Text>

                    {/* Stars */}
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="star"
                          size={16}
                          color={star <= item.rating ? "#FFD700" : "#e5e4de"}
                          style={{ marginRight: 3 }}
                        />
                      ))}
                    </View>

                    {/* User */}
                    <View style={styles.userRow}>
                      <Image
                        source={{
                          uri: item?.userImage || `https://ui-avatars.com/api/?name=${item.userName}&background=043862&color=fff`,
                        }}
                        style={styles.userIcon}
                      />
                      <Text style={styles.userName}>{item.userName}</Text>
                    </View>

                  </View>
                )}
              />
            </View>
          )}
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
            paddingBottom: 45,
          }}
        >
          {PropertiesArray?.currencyType != 'INR' ? (
            // ✅ ONLY ONE BUTTON FOR THIS PROPERTY
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(2, 18, 101, 1)',
                flex: 1,
                borderRadius: 10,
                alignItems: 'center',
                padding: 20,
              }}
              onPress={() => {
                setViewEnquiry(true); // 🔥 OPEN MODAL
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-Bold',
                  color: '#FFFFFF',
                }}
              >
                Book Now
              </Text>
            </TouchableOpacity>
          ) : (
            // ✅ NORMAL UI FOR OTHER PROPERTIES
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(238, 242, 246, 1)',
                  flex: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  padding: 20,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: 'rgba(187, 199, 216, 1)',
                }}
                onPress={() => {
                  setShowHelp(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'OpenSans-Bold',
                    color: '#070000',
                  }}
                >
                  Enquire Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={PropertiesArray?.AvailableFractions == 0}
                style={{
                  backgroundColor:
                    PropertiesArray?.AvailableFractions == 0
                      ? '#AEAEAE'
                      : 'rgba(2, 18, 101, 1)',
                  flex: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  padding: 20,
                  marginLeft: 10,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: 'rgba(187, 199, 216, 1)',
                }}
                onPress={() => {
                  navigation.navigate('Book', {
                    property: PropertiesArray,
                    Id: proId || PropertiesArray?._id,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-Bold',
                    color: '#FFFFFF',
                  }}
                >
                  {PropertiesArray?.AvailableFractions == 0
                    ? 'Not Available'
                    : 'Book Now'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    )
  }

  
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <ScrollView style={{  flex: 1, backgroundColor: "#ffffff" }}
      bounces={false}
       stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}>

        {/* Layer 1: Fixed background image — no touches */}
        <View
          style={{zIndex:0}}>

          {showVideo && PropertiesArray?.video ? (
            <Video
              source={{ uri: PropertiesArray.video?.Video1 }}
              style={{ width: '100%', height: 360 }}
              resizeMode="cover"
              paused={false}
              muted={true}
              repeat={true}
            />
          ) : (
            <Image
              source={{ uri: images[0] }}
              style={{ width: '100%',height: 360}}
              resizeMode="cover"
            />
          )}
     
          <Animated.View
          pointerEvents={actionsActive ? 'box-none' : 'none'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 360,
            overflow: 'hidden',
            opacity: actionsOpacity,
          }}
        >
          {/* Back + Share */}
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              top: 20,
              left: 15,
              right: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
    <TouchableOpacity onPress={() => {
  //  if (navigation.canGoBack()) {
  //     navigation.goBack();
  //   } else {
  //     navigation.navigate("Home");
  //   }
  navigation.goBack();
  }}>
      <Icon name="chevron-back-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareReferral(Proid)}>
              <Image
                source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/ShareButton.png' }}
                style={{ height: 25, width: 100 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Thumbnails */}
          {!showVideo && (
            <View style={{ position: 'absolute', right: 30, top: 100 }}>
              {images.slice(1, 4).map((img, index) => {
                const isLast = index === 2;
                const extraCount = imageCount - 4;
                return (
                  <TouchableOpacity
                    key={index}
                    style={{ marginBottom: 7 }}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('BookingStatus', {
                        Image: images,
                        selectedIndex: index + 1,
                      })
                    }
                  >
                    <Image
                      source={{ uri: img }}
                      style={{ width: 60, height: 60, borderRadius: 8, borderWidth: 2, borderColor: '#fff' }}
                    />
                    {isLast && extraCount > 0 && (
                      <View style={{
                        position: 'absolute', width: 60, height: 60,
                        borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+{extraCount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <VideoImgData />
        </Animated.View>
   </View>
           <View style={{backgroundColor:'#FFF',zIndex:10,borderTopLeftRadius:15,borderTopRightRadius:15}}>
          <ScrollData />
        </View>
      </ScrollView>

      <Modal
        visible={showHelp}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>

          {/* Overlay */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#00000080",
            }}
            onPress={() => setShowHelp(false)}
          />

          {/* Bottom Card */}
          <View style={styles.helpCard}>
            {/* Property Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: PropertiesArray?.image?.Image1 }}
                style={styles.propertyImage}
              />

              <View style={styles.overlay}>
                <Text style={styles.propertyTitle}>{PropertiesArray?.name}</Text>
                <Text style={[styles.location, { width: 300 }]}>
                  {PropertiesArray?.Location}
                </Text>
              </View>
            </View>

            <Text style={styles.helpTitle}>Need Help With This Property?</Text>
            <Text style={styles.helpSubtitle}>We're here to assist you</Text>

            <TouchableOpacity style={styles.callButton} onPress={handleCallNow}>
              <Iconcall name="phone" size={18} color="#fff" />
              <Text style={styles.callText}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleMail}>
              <Icon name="mail" size={22} color="#021265" />
              <Text style={styles.secondaryText}>Mail Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setOpen(true)}>
              <IconM name="calendar-clock-outline" size={22} color="#021265" />
              <Text style={styles.secondaryText}>Schedule a visit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={open}
        date={date}
        //textColor='green'
        title={'Unlock Your Visit Date : Reserve Your Property Preview!'}
        onConfirm={date => {
          //console.log('dtafsghysy',new Date(date).toLocaleString());
          handleSiteVist(new Date(date).toLocaleString());
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />


      <Modal visible={viewEnquiry} transparent animationType='fade'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: '#000000b3' }}>

            <TouchableOpacity onPress={() => {
              setViewEnquiry(false);
            }} style={{ flex: 1 }} />

            <View
              style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#E9E8E5',
                width: width,
                padding: 20,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                borderWidth: 0.5,
                borderColor: '#00000099'
              }}
            >

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                  setViewEnquiry(false);
                }}>
                  <IconEn name={'chevron-left'} size={20} color={'#000'} />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>
                  Enquiry Form
                </Text>

                <View style={{ width: 20 }} />
              </View>

              <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>

                <View>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000', }}>
                    Name
                  </Text>

                  <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                    <TextInput
                      placeholder='Enter Name'
                      placeholderTextColor={'#00000086'}
                      value={name}
                      onChangeText={setName}
                      style={{ fontFamily: 'Montserrat-Medium', padding: 10, fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3, paddingHorizontal: 15, minHeight: 40 }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, gap: 15 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>
                      Mobile Number
                    </Text>

                    <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                      <TextInput
                        placeholder='Enter Phone'
                        placeholderTextColor={'#00000086'}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='number-pad'
                        style={{ fontFamily: 'Montserrat-Medium', padding: 10, fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3, minHeight: 40 }}
                      />
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000' }}>
                      Email ID
                    </Text>

                    <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                      <TextInput
                        placeholder='Enter Mail'
                        placeholderTextColor={'#00000086'}
                        value={email}
                        onChangeText={setEmail}
                        style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8, padding: 10, marginVertical: -3, minHeight: 40 }}
                      />
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000', }}>
                    Your Message
                  </Text>

                  <View style={{ borderWidth: 0.5, borderColor: '#00000099', borderRadius: 5, marginTop: 10 }}>
                    <TextInput
                      multiline
                      numberOfLines={5}
                      value={message}
                      onChangeText={setMessage}
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        padding: 10,
                        fontSize: 12,
                        color: '#000',
                        marginLeft: 8,
                        height: 100, // 🔥 IMPORTANT
                        textAlignVertical: 'top', // 🔥 for Android
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  disabled={loading}
                  onPress={async () => {
                    if (name === "" || phone === "" || email === "" || message === "") {
                      Alert.alert('Missing Information', 'Please fill in all required details.');
                      return;
                    }

                    try {
                      const res = await handleEnquiryForm();
                      console.log("Data: ", res);

                      if (res?.success) {
                        setVisible(true)
                       // Alert.alert('Thank You', 'Your Enquiry Submitted Successfully');
                        setViewEnquiry(false);
                      }
                    } finally {
                     // setLoading(false);
                    }
                  }}
                  style={{
                    backgroundColor: loading ? '#C6AF83aa' : '#021265',
                    borderRadius: 10,
                    padding: 12,
                    alignItems: 'center',
                    marginTop: 30
                  }}
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
        </KeyboardAvoidingView>
      </Modal>

        <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Thank You!</Text>
            <Text style={styles.message}>
              We’ve received your request. We’ll get back to you shortly.
            </Text>

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
  },
  modal: {
    width: '100%',
    alignSelf: 'center',
    borderColor: '#DADADA',
    borderWidth: 0,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 25,
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
  // const styles = StyleSheet.create({

  sectionTitle: {
    fontSize: 16,
    fontFamily: "WorkSans-SemiBold",
    marginBottom: 15
  },

  advantageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
    borderLeftWidth: 8,
    borderLeftColor: "#0E1F66"
  },


  advantageIcon: {
    width: 44,
    height: 40,
    marginHorizontal: 10,
    padding: 10,
    margin: 3,
    resizeMode: "contain"
  },

  advantageTitle: {
    fontSize: 14,
    fontFamily: "WorkSans-SemiBold"
  },

  advantageDesc: {
    fontSize: 12,
    color: "#7B7B7B",
    fontFamily: "Work Sans",
    marginVertical: 5,
    //lineHeight: 25
  },

  amenitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  amenityCard: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(157, 178, 206, 0.1)",
    marginRight: 10,
    padding: 20,
    borderRadius: 8,
    width: 135
  },

  amenityIconCircle: {
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    padding: 8

  },

  amenityIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    padding: 10,
  },

  amenityText: {
    fontSize: 12,
    textAlign: "center"
  },

  locationCard: {
    marginRight: 12
  },

  locationImage: {
    width: 140,
    height: 160,
    borderRadius: 12
  },

  locationOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 6,
    borderRadius: 4
  },

  locationTitle: {
    color: "white",
    fontSize: 12
  },

  reviewCard: {
    backgroundColor: "#F5F7FB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center"
  },

  reviewText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10
  },

  reviewStars: {
    fontSize: 16,
    marginBottom: 5
  },

  reviewUser: {
    fontSize: 12,
    color: "#555"
  },

  slide: {
    alignItems: "center",
    justifyContent: "center"
  },

  centerCard: {
    width: 200,
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    zIndex: 10
  },

  leftCard: {
    position: "absolute",
    left: 20,
    width: 140,
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    opacity: 0.8
  },

  rightCard: {
    position: "absolute",
    right: 20,
    width: 140,
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    opacity: 0.8
  },

  image: {
    width: "100%",
    height: "100%"
  },

  label: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  labelText: {
    color: "white",
    fontSize: 12
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  reviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    marginBottom: 12,
  },

  starRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 18,
    marginRight: 10,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  helpCard: {
    backgroundColor: "#fff",
    //margin:20,
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    paddingBottom: 20,
    borderTopLeftRadius: 10,
    borderWidth: 1
  },

  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15
  },

  propertyImage: {
    width: "100%",
    height: 180
  },

  overlay: {
    position: "absolute",
    bottom: 10,
    left: 12
  },

  propertyTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold"
  },

  location: {
    color: "#fff",
    fontSize: 12
  },

  helpTitle: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
    color: "#252B5C"
  },

  helpSubtitle: {
    fontSize: 13,
    color: "#7B7E8E",
    marginBottom: 15
  },

  callButton: {
    backgroundColor: "#043862",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },

  callText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    marginLeft: 10
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#B9C4CA",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },

  secondaryText: {
    color: "#252B5C",
    fontSize: 15,
    marginLeft: 10
  },
  verticalDivider: {
    width: 2,
    height: '100%',   // adjust height as needed
    backgroundColor: '#E5E7EB',
    marginRight: 8
    //height:100
  },
  helpCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    paddingBottom: 30,
  },
   button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  okBtn: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  okText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


