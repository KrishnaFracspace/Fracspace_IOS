import {View,Text,Image,TouchableOpacity,StyleSheet,Dimensions,FlatList,Linking,ScrollView,Alert,Share,ImageBackground,Animated,Modal, TextInput, ActivityIndicator} from 'react-native';
import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import openMap, { createOpenLink } from 'react-native-open-maps';
import { AppContext } from './Context/AppContext';
const { width, height } = Dimensions.get('window');
// import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMail from 'react-native-vector-icons/Feather';
import { DisLike, Like, LikeData, NewUpdate, PropertyDetailsById, SiteVisit, UploadEnquiry } from './Services/UserApi';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewUpdates, profileDetailsById } from './redux/reducer/propertyReducer';
import PropertySkeleton from './component/PropertySkeleton ';
import appsFlyer from 'react-native-appsflyer';
// import Share from 'react-native-share'

import Icon from 'react-native-vector-icons/Entypo'
import Ico from 'react-native-vector-icons/Ionicons'
import Icoo from 'react-native-vector-icons/FontAwesome'
import Carousel from "react-native-reanimated-carousel";
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Test from './Test';
import Video from 'react-native-video';


export default function Property(props) {
 
  
  const { globalState, setGlobalState } = useContext(AppContext);
  const [IsLike, setIsLike] = useState([]);
  const [Event, setEvent] = useState(props?.route?.params?.status || false);
  const [Status, setStatus] = useState(true);
  const [Status1, setStatus1] = useState(true);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);
  const [image, setImage] = useState([]);
  // console.log("prop:", props?.route?.params);

  // const [PropertiesArray, setPropertiesArray] = useState(props?.route?.params?.details || []);
  const [PropertiesArray, setPropertiesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("Propety: ", props?.route?.params?.details);
  const [Newupdate, setNewupdate] = useState([]);
  const [propertyStatu, setPropertyStatu] = useState(0);
  const propertyId = props?.route?.params?.Id || globalState?.pendingDeepLinkId;
  const [open, setOpen] = useState(false);
  const [viewEnquire, setViewEnquire] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);
  const [selectHeader, setSelectHeader] = useState(PropertiesArray?.video?.Video1 ? 'Video':'Camera');
  const [viewEnquiry, setViewEnquiry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(globalState?.userName);
const [email, setEmail] = useState(globalState?.userEmail);
const [phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
  // console.log("id: ",propertyId);
  

  // console.log("Testim: ",PropertiesArray?.testimonial[1]);

  // const proId = props.route?.params?.Id;
  // const dispatch = useDispatch();
  // const Newupdate1 = useSelector(state => state.property.newUpdates);
  // const PropertiesArray1 = useSelector(
  //   state => state.property.PropertyDetailsById,
  // );
  // // console.log("newUp: ",Newupdate1);
  // // console.log("prope: ",PropertiesArray1);
  // const loading = useSelector(state => state.property.loading);
  // const [CustomerReview, setCustomerReview] = useState([]);
  const GgoToYosemite = location => {
    openMap({query: location});
  };

  // useEffect(() => {
  //   dispatch(fetchNewUpdates());
  //   dispatch(profileDetailsById({id: proId}));
  // }, []);

  useEffect(() => {
    fetchPropById(propertyId);
    handleUpdate();
    handleAllLike();
  }, []);

    useEffect(() => {
        const imageObject = PropertiesArray?.image || {};
        const imageArray = Object.values(imageObject).filter(Boolean);
        setImage(imageArray);
    }, [PropertiesArray]);

  const fetchPropById = async (id) => {
    setIsLoading(true);

    try {
      const { data: res } = await PropertyDetailsById(id);
      // console.log("Data: ",res);
      if (res) {
        // console.log("Data: ",res?.property);
        setPropertiesArray(res?.property); // force array
        setPropertyStatu(res?.property?.PropertyStatus);
      } else {
        setPropertiesArray([]);
      }

    } catch (error) {
      console.error(
        'Error in fetching Prop by Id:',
        error?.response?.data || error?.message
      );
      setPropertiesArray([]);
    }

    setIsLoading(false);
  };


  const handleUpdate = async () => {
    try {
      let { data: res } = await NewUpdate();

      if (res?.success) {
        setNewupdate(res?.updates);
        // console.log("Updarte: ",res?.updates);
        // setProperties(res?.properties);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

    const handleEnquiryForm = async () => {
        let payload = JSON.stringify({
            name: globalState?.userName,
            email: globalState?.userEmail,
            phoneNumber: globalState?.userDetails?.phoneNumber,
            message: `Enquiry for Altaira Villa. ${message}`
        });
        // console.log('payload: ', payload);
        try {
            let { data: res } = await UploadEnquiry(payload);
            if (res?.success) {
                Alert.alert('Thank You', 'Your Enquiry Submitted Successfully');
                setViewEnquiry(false);
            }
            console.log('Uploaded Successful: ', res?.message);
            return res;
        } catch (error) {
            console.error('Error in uploading enquiry form: ', error?.response?.message || error.message);
            return null;
        }
    };

  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
    // console.log(payload);
    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        const filteredNumbers = IsLike.filter(number => number !== Productid);
        setIsLike(filteredNumbers);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
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
      let { data: res } = await Like(payload);

      if (res?.success) {
        setIsLike([...IsLike, item?._id]);
      } else {
        handleDisLike(item?._id);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleAllLike = async () => {
    // const email = await AsyncStorage.getItem('Email');
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
        // console.log('like', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const SafeImage = ({ source, fallback, ...props }) => {
    // If require('image.png')
    if (typeof source === 'number') {
      return <Image {...props} source={source} />;
    }

    const uri = source?.uri;

    const isValidUri =
      uri && typeof uri === 'string' && uri.trim() !== '';

    return (
      <Image
        {...props}
        source={
          isValidUri
            ? { uri }
            : fallback || require('./assets/placeholder.png')
        }
      />
    );
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
  const handleMail = () => {
    const mailto = 'mailto:support@fracspace.com';
    Linking.openURL(mailto)
      .catch((err) => console.error('An error occurred', err));
  };

  const handleSiteVist = async date => {

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
    // console.log(payload);
    try {
      let { data: res } = await SiteVisit(payload);
        // console.log("ResL :",res);
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

        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const hideDatePicker = () => {
    setOpen(false);
  };

  const handleConfirm = date => {
    //console.log(date);

    handleSiteVist(new Date(date).toLocaleString());
    hideDatePicker();
  };

  // const shareProperty = propertyIdd => {
  //   const link = `https://fracspace.onelink.me/OVdL/oh6t4r97?deep_link_value=property_share&deep_link_sub1=${propertyIdd}`;
  //   // https://fracspace.onelink.me/OVdL/oh6t4r97?deep_link_value=property_share&deep_link_sub1=65ba3687d41d5864da96625d
  //   Share.share({ message: link });
  // };

  const shareProperty = (propertyIdd) => {
      const link =
        `https://fracspace.onelink.me/OVdL/oh6t4r97` +
        `?deep_link_value=property_share` +
        `&deep_link_sub1=${propertyIdd}`;

      const message = `🏠 A property was shared with you on Fracspace.

    Tap below to view:
    ${link}`;

      Share.share({ message });
  };

    const availableFrac = (PropertiesArray?.TotalFractions - PropertiesArray?.AvailableFractions)/(PropertiesArray?.TotalFractions) * 100;

  if(isLoading){
    return <PropertySkeleton/>
  }

  return (

    <SafeAreaView style={{flex:1,backgroundColor:'#021265'}}>
        <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
        >
            <View style={{zIndex:0}}>
              {selectHeader === 'Camera' &&
                <SafeImage
                    source={{uri: image[0]}}
                    style={{ width: "100%", height: height*0.45 }}
                />
              }
              {selectHeader === 'Video' &&
                <Video resizeMode='cover' volume={0} source={{uri: PropertiesArray?.video?.Video1}} style={{width:'100%',height:height*0.45}}/>
              }
                {/* Icons on image */}
              
                <View style={{position: "absolute",top: 25,left: 0,right: 0, }} >
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20}}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();
                        }}>
                            <Icon name={'chevron-left'} size={25} color={'#FFF'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {shareProperty(propertyId);}}>
                            <SafeImage source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/ShareButton.png'}} style={{width:25,height:25}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{position:'absolute',bottom:0,right:0,left:0}}>
                  <LinearGradient colors={['#00000000','#000000B3','#000000E6','#000000']} style={{}}>
                    <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'row',alignItems:'center'}}>
                      {PropertiesArray?.video?.Video1 &&
                        <TouchableOpacity onPress={() => {
                          setSelectHeader('Video');
                        }} style={{alignItems:'center',paddingHorizontal:15,borderBottomWidth:selectHeader === 'Video' ? 2:0,borderColor:'#FFF',marginRight:20}}>
                          <SafeImage source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/VideoIcon.png'}} style={{width:22,height:22}}/>
                          <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFF',marginVertical:5}}>Video</Text>
                        </TouchableOpacity>
                      }
                      <TouchableOpacity onPress={() => {
                        setSelectHeader('Camera');
                      }} style={{alignItems:'center',paddingHorizontal:15,borderBottomWidth:selectHeader === 'Camera' ? 2:0,borderColor:'#FFF'}}>
                        <SafeImage source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/CameraIcon.png'}} style={{width:22,height:22}}/>
                        <Text style={{fontFamily:'WorkSans-regular',fontSize:12,color:'#FFF',marginVertical:5}}>Image</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>

              {selectHeader === 'Camera' &&
                <View style={{position:'absolute',top:height*0.1,right:10,zIndex:1}}>
                    <View style={{padding:5,borderTopLeftRadius:6}}>
                        {image.slice(1,3).map((item, index) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('PropertyImages', { data: image });
                            }} key={index} style={{ borderColor: '#ffffff', borderWidth: 2, borderRadius: 6,marginBottom:5}}>
                                <SafeImage source={{ uri: item }} style={{ width: 65, height: 65, borderRadius: 6 }} />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('PropertyImages', { data: image });
                        }} style={{ alignItems: 'center', justifyContent: 'center',borderWidth:2,borderColor:'#ffffff',borderRadius: 6  }}>
                            <SafeImage source={{ uri: image[4] }} style={{ width: 65, height: 65, borderRadius: 6 }} />
                            <View style={{position:'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:'#00000092',alignItems:'center',justifyContent:'center',borderRadius:6}}>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#FFF'}}>+{image.length}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
              }
            </View>

            <View style={{backgroundColor:'#FAFAFA',padding:20,zIndex:99,position:'relative',borderTopLeftRadius:20,borderTopRightRadius:20}}>
                <View style={{position:'absolute',top:8,alignSelf:'center'}}>
                    <View style={{padding:2,width:width*0.15,backgroundColor:'#D9D9D9',borderRadius:5}}/>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,flex:1,marginRight:11}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:18,color:'#000',marginRight:15}}>{PropertiesArray?.name}</Text>
                    {/* <Ico name={'heart-outline'} size={20} color={'#000'}/> */}

                    <TouchableOpacity
                        onPress={() => {
                            if (IsLike.includes(`${PropertiesArray?._id}`)) {
                                handleDisLike(PropertiesArray?._id);
                            } else {
                                handleLike(PropertiesArray);
                            }
                        }}>
                        {IsLike.includes(`${PropertiesArray?._id}`) ? (
                            <IconM name={'cards-heart'} size={23} color={'#EB2C19'} />
                        ) : (
                            <IconM
                            name={'cards-heart-outline'}
                            size={23}
                            color={'#EB2C19'}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{borderTopWidth:0.5,borderBottomWidth:0.5,borderTopColor:'#0000001A',borderBottomColor:'#0000001A',paddingVertical:10,marginTop:5}}>
                    <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                        <View style={{flex:2}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000',marginRight:10,lineHeight:18}}>{PropertiesArray?.Location}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            GgoToYosemite(PropertiesArray?.Location);
                        }} style={{flex:1.3,alignItems:'flex-end'}}>
                            <SafeImage source={{uri: PropertiesArray?.LocationImage}} style={{width:'100%',height:70,borderRadius:5}}/>
                            <View style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'#00000040',borderRadius:5}}></View>
                        </TouchableOpacity>
                    </View>
                </View>

                {Newupdate[0]?.Status && Newupdate[0]?.eventName != PropertiesArray?.name && (
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
                                    {/* {'          '} */}
                                    {Newupdate[0]?.eventName}
                                </Text>
                                <Text
                                numberOfLines={2}
                                style={{ fontSize: 10, fontFamily: 'Poppins-Regular', letterSpacing: 0.3, color: '#000000Bf', }}>
                                    {/* {' '} */}
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
                )}

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>
                        Description
                    </Text>

                    <Text
                        numberOfLines={showFullDesc ? undefined : 3}
                        style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:8,lineHeight:15}}
                    >
                        {PropertiesArray?.Description}
                    </Text>

                    <Text
                        onPress={() => setShowFullDesc(!showFullDesc)}
                        style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#021265',marginTop:4}}
                    >
                        {showFullDesc ? 'Read less' : 'Read more'}
                    </Text>
                </View>

                <View style={{marginTop:15}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Property Status</Text>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{propertyStatu}%</Text>
                    </View>
                </View>

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
                                      <Ico name={'checkmark-circle'} size={20} color={'#021265'} />
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
                      <Text style={{fontFamily:isCurrent ? 'WorkSans-Medium' : 'WorkSans-Regular',fontSize: isCurrent ? 10 : 8,color:isCurrent ? '#000':'#00000065',textAlign: 'center',marginTop: 6 }} >
                          {item.data}
                      </Text>
                    </View>
                  )})}
                </View>

                {/* <Test data={PropertiesArray?.propertyUpdates}/> */}

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Property Details</Text>

                    {PropertiesArray?.investmentDetails?.show &&
                    <View style={{backgroundColor:'#021265',padding:18,borderRadius:10,gap:10,marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFFFFFB3'}}>{PropertiesArray?.investmentDetails?.product}</Text>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:15,color:'#FFFFFF'}}>{PropertiesArray?.investmentDetails?.type}</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{backgroundColor:'#FFFFFF1F',paddingHorizontal:10,paddingVertical:5,borderRadius:20}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFF'}}>{PropertiesArray?.investmentDetails?.positioning}</Text>
                            </View>
                            <View style={{backgroundColor:'#FFD75A2E',paddingHorizontal:10,paddingVertical:5,borderRadius:20,marginLeft:10}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFD75A'}}>PRE-LAUNCH</Text>
                            </View>
                        </View>
                    </View>
                    }

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                        <View style={{backgroundColor:'#9DB2CE1A',paddingHorizontal:12,paddingVertical:8,flex:1,borderRadius:5}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{backgroundColor:'#E1E6F0BF',borderRadius:20,padding:10}}>
                                    <SafeImage source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/Squaree.png'}} style={{width:15,height:15}}/>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000000BF'}}>AREA</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>{PropertiesArray?.area}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{backgroundColor:'#9DB2CE1A',paddingHorizontal:12,paddingVertical:8,flex:1,marginLeft:15,borderRadius:5}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{backgroundColor:'#E1E6F0BF',borderRadius:20,padding:10}}>
                                    <SafeImage source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/PprtyType.png'}} style={{width:15,height:15}}/>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000000BF'}}>Type</Text>
                                    <Text style={{fontFamily:'WorkSans-Medimu',fontSize:12,color:'#000'}}>{PropertiesArray?.P_Type}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Investment Breakdown</Text>

                    <View style={{backgroundColor:'#021265',padding:18,borderRadius:10,marginTop:15}}>
                        <View>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFFFFFBF'}}>TOTAL PROPERTY VALUE</Text>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#FFF'}}>₹{PropertiesArray?.Price}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:20,justifyContent:'space-around',flex:1}}>
                            <View style={{borderLeftWidth:2,borderLeftColor:'#FFF',paddingLeft:7,flex:1}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFFFFFBF'}}>FRAC VALUE</Text>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#FFF'}}>₹{PropertiesArray?.FC_Price}</Text>
                            </View>
                            <View style={{borderLeftWidth:2,borderLeftColor:'#FFF',paddingLeft:7,flex:1}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFFFFFBF'}}>BOOKING VALUE</Text>
                                {PropertiesArray?.name == 'ALTAIRA – FRACTIONAL OWNERSHIP VILLA' ?
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#FFF'}}>${PropertiesArray?.BookingAmt}</Text>
                                    :
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#FFF'}}>₹{PropertiesArray?.BookingAmt}</Text>
                                }
                            </View>
                            {PropertiesArray?.SPV &&
                                <View style={{borderLeftWidth:2,borderLeftColor:'#FFF',paddingLeft:7,flex:1}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFFFFFBF'}}>SPV VALUE</Text>
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#FFF'}}>₹{PropertiesArray?.SPV}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>

                <View style={{marginTop:15,borderColor:'#00000080',borderWidth:0.5,borderRadius:10,padding:20,backgroundColor:'#FFF'}}>
                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000000BF'}}>AVAILABILITY</Text>
                    {availableFrac < 100 && availableFrac > 10 ?
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000'}}>Only <Text style={{color:'#EB2C19'}}>{PropertiesArray?.AvailableFractions} Fracs</Text> left!</Text>
                        :
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000'}}><Text style={{color:'#EB2C19'}}>{PropertiesArray?.AvailableFractions} Fracs</Text> left!</Text>
                    }

                    <View style={{width:'100%',height:8,borderRadius:6,backgroundColor:'#02126533',marginTop:12}}>
                        <View style={{width:`${availableFrac}%`,height:8,borderRadius:6,backgroundColor:'#021265'}}></View>
                    </View>
                    {availableFrac == 0 ?
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000000BF',marginTop:5}}>Be among the first to own a frac in this property.</Text>
                        :
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000000BF',marginTop:5}}>{availableFrac}% of the property is already owned by {PropertiesArray?.TotalFractions - PropertiesArray?.AvailableFractions} investors</Text>
                    }
                </View>

                {PropertiesArray?.investmentDetails?.show &&
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                    <View style={{backgroundColor:'#FFF',borderRadius:14,padding:12,gap:10,flex:1}}>
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
                    </View>
                    <View style={{backgroundColor:'#FFF',borderRadius:14,padding:12,gap:10,flex:1,marginLeft:15}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{backgroundColor:'#0212651A',padding:3,borderRadius:5}}>
                                <IconMail name={'trending-up'} size={13} color={'#021265'}/>
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

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Ownership Advantages</Text>

                    <View>
                        {PropertiesArray?.Benefits?.map((item, index) => (
                            <View key={index} style={{backgroundColor:"#9DB2CE1A",paddingHorizontal:13,paddingVertical:10,borderRadius:5,borderLeftColor:'#021265',borderLeftWidth:6,marginTop:13}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <SafeImage source={{uri: item?.image}} style={{width:40,height:40,borderRadius:5}}/>
                                    <View style={{marginLeft:15,flex:1}}>
                                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000'}}>{item?.name}</Text>
                                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000080',marginTop:5}}>{item?.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {PropertiesArray?.investmentDetails?.show &&
                <View style={{marginTop:15}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Payment Plan</Text>
                        <View style={{backgroundColor:'#FFF',padding:5,borderRadius:5}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:10,color:'#0F1E5A'}}>₹50L total</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                        {/* {PropertiesArray?.investmentDetails?.paymentPlan[0]?.map((item, index) => (
                            <View key={index} style={{paddingHorizontal:20,paddingVertical:10,borderRadius:5,gap:3,backgroundColor:'#021265',alignItems:'center'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFFFFF99'}}>Now</Text>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#FFFFFF'}}>{item?.amount}</Text>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFFFFF99'}}>Booking</Text>
                            </View>
                        ))} */}
                        {PropertiesArray?.investmentDetails?.paymentPlan?.map((item, index) => {
                            const isFirst = index === 0;
                            return (
                                <View key={index} style={{paddingHorizontal:20,paddingVertical:10,borderRadius:5,gap:3,backgroundColor:isFirst?'#021265':'#FFF',alignItems:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:isFirst?'#FFFFFF99':'#02126599'}}>{item?.timeline}</Text>
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:isFirst?'#FFFFFF':'#021265'}}>{item?.amount}</Text>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:isFirst?'#FFFFFF99':'#02126599'}}>{item?.description}</Text>
                                </View>
                        )})}
                    </View>
                </View>
                }

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Signature Amenities</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:15}}>
                        {PropertiesArray?.DistinctiveAmenities?.map((item,index) => (
                            <View key={index} style={{backgroundColor:'#9DB2CE1A',width:width*0.3,padding:15,alignItems:'center',borderRadius:7,marginRight:13}}>
                                <View style={{backgroundColor:'#FFF',padding:6,borderRadius:20}}>
                                    <SafeImage source={{uri: item?.image}} style={{width:28,height:28}}/>
                                </View>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#0F1130',textAlign:'center'}}>{item?.name}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {PropertiesArray?.investmentDetails?.show &&
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                        <View style={{backgroundColor:'#021265',padding:15,borderRadius:10,flex:1,gap:3}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFFFFFB3'}}>{PropertiesArray?.investmentDetails?.exitType?.label}</Text>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFFFFF'}}>{PropertiesArray?.investmentDetails?.exitType?.type}</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#FFFFFFB3'}}>{PropertiesArray?.investmentDetails?.exitType?.duration}</Text>
                        </View>
                        <View style={{backgroundColor:'#021265',padding:15,borderRadius:10,flex:1,gap:3,marginLeft:15}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFFFFFB3'}}>{PropertiesArray?.investmentDetails?.possession?.label}</Text>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFFFFF'}}>{PropertiesArray?.investmentDetails?.possession?.estd}</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#FFFFFFB3'}}>{PropertiesArray?.investmentDetails?.possession?.description}</Text>
                        </View>
                    </View>
                    }
                </View>

                <View style={{marginTop:15}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Location Highlights</Text>

                    <View style={styles.container}>

                        <Carousel
                            loop
                            width={width*0.9}
                            height={270}
                            data={PropertiesArray?.locationHighlights}
                            scrollAnimationDuration={200}
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 200,
                                parallaxAdjacentItemScale: 0.8,
                            }}
                            style={{elevation:5}}
                            renderItem={({ item }) => (
                                <View style={styles.cardContainer}>
                                    <ImageBackground resizeMode='cover' source={{ uri: item.image }} style={styles.card} imageStyle={{ borderRadius: 10 }} >

                                    <View style={styles.overlay}>
                                        <Text style={styles.title}>{item.name}</Text>
                                        {/* <Text style={styles.location}>{item.location}</Text> */}
                                    </View>

                                    </ImageBackground>
                                </View>
                            )}
                        />

                    </View>
                </View>

                {PropertiesArray?.userReviews?.length > 0 &&
                  <View style={{marginTop:0}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Reviews</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
                      {PropertiesArray?.userReviews?.map((item, index) => (
                      <View key={index} style={{alignItems:'center',width:width*0.7,marginRight:10,marginBottom:5}}>
                          <View style={{backgroundColor:'#FFF',borderRadius:5,padding:20,alignItems:'center',gap:10,marginTop:15,elevation:2}}>
                            <View style={{alignItems:'center'}}>
                              <Text numberOfLines={showFullReview ? undefined : 3} style={{fontFamily:'Monserrat-Regular',fontSize:13,color:'#000',textAlign:'center'}}>{item?.review}</Text>
                              <Text
                                  onPress={() => setShowFullReview(!showFullReview)}
                                  style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#021265',marginTop:5}}
                              >
                                  {showFullReview ? 'Read less' : 'Read more'}
                              </Text>
                            </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((star, i) => {
                                        const isFilled = star <= item?.rating;

                                        return (
                                        <View key={i} style={{ marginRight: 6 }}>
                                            <Icoo
                                            name={isFilled ? 'star' : 'star-o'} // 👈 important
                                            size={20}
                                            color={isFilled ? '#F3BF0D' : '#D3D3D3'}
                                            />
                                        </View>
                                        );
                                    })}
                              </View>
                              <View style={{flexDirection:'row',alignItems:'center'}}>
                                  <Image source={require('../Screen/assets/NewProfileImage.jpg')} style={{width:25,height:25}}/>
                                  <Text style={{fontFamily:'Montserrat-Regular',fontSize:13,color:'#000',marginLeft:4}}>{item?.userName}</Text>
                              </View>
                              
                          </View>

                          {/* <Text style={{fontFamily:'Montserrat-Regular',fontSize:12,color:'#2F74E4',marginTop:10}}>Read all reviews →</Text> */}
                      </View>
                      ))}
                    </ScrollView>
                  </View>
                }

                <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                    {PropertiesArray?.name != 'ALTAIRA – FRACTIONAL OWNERSHIP VILLA' &&
                    <TouchableOpacity onPress={() => {
                        // navigation.navigate('Enquirenew', { property: PropertiesArray });
                        setViewEnquire(true);
                    }} style={{backgroundColor:'#EEF2F6',borderColor:'#BBC7D8',borderWidth:0.5,borderRadius:5,flex:1,padding:15,alignItems:'center',marginRight:15}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>Enquire Now</Text>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity
                    disabled={PropertiesArray?.AvailableFractions == 0 ? true : false}
                    onPress={() =>{
                        if(PropertiesArray?.name == 'ALTAIRA – FRACTIONAL OWNERSHIP VILLA'){
                            setViewEnquiry(true);
                        }else{
                            navigation.navigate('Book', { property: PropertiesArray });
                        }
                    }} style={{backgroundColor:PropertiesArray?.AvailableFractions == 0 ? '#AEAEAE' : '#021265',borderRadius:5,flex:1,padding:15,alignItems:'center'}}>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#FFF'}}>{PropertiesArray?.AvailableFractions==0?'Not Available':'Book Now'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

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
                                    style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
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
                                        style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
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
                                        style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
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
                                    style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000', marginLeft: 8, marginVertical: -3 }}
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
                            }} style={{backgroundColor: loading ? '#021265aa' : '#021265',borderRadius: 10,padding: 12,alignItems: 'center',marginTop: 30}}
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

        <Modal visible={viewEnquire} transparent animationType='slide'>
            <TouchableOpacity onPress={() => {
                setViewEnquire(false);
            }} style={{flex:1,backgroundColor:'#000000a8'}}/>
            <View style={{position:'absolute',bottom:0,left:0,right:0}}>
                <View style={{backgroundColor:'#FFF',borderTopLeftRadius:10,borderTopRightRadius:10,padding:20}}>
                    <View>
                        <SafeImage source={{uri: image[0]}} style={{width:'100%',height:170,borderRadius:10}}/>
                        <View style={{position:'absolute',bottom:5,left:10,right:10,zIndex:1}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#FFF'}}>{PropertiesArray?.name}</Text>
                            <View style={{flexDirection:'row',alignItems:'center',marginTop:3}}>
                                <Ico name={'location-outline'} size={15} color={'#FFF'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#FFF'}}>{PropertiesArray?.Location}</Text>
                            </View>
                        </View>
                        <LinearGradient colors={['#00000000', '#00000066', '#000000A6', '#000000CC']} 
                            style={{position:'absolute',bottom:0,left:0,right:0,height:70,zIndex:0}}
                        ></LinearGradient>
                    </View>

                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000'}}>Need Help With This Property?</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>We’re here to assist you</Text>

                        <TouchableOpacity onPress={() => {
                            handleCallNow();
                        }} style={{backgroundColor:'#021265',padding:10,marginVertical:15,borderRadius:5,alignItems:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Ico name={'call-outline'} size={18} color={'#FFF'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:16,color:'#FFF',marginLeft:8}}>Call Us</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            handleMail();
                        }} style={{borderColor:'#00000080',borderWidth:0.5,padding:10,borderRadius:5,alignItems:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <IconMail name={'mail'} size={18} color={'#000'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:16,color:'#000',marginLeft:8}}>Mail Us</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setOpen(true);
                        }} style={{borderColor:'#00000080',borderWidth:0.5,padding:10,marginVertical:15,borderRadius:5,alignItems:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Ico name={'calendar-outline'} size={18} color={'#000'}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:16,color:'#000',marginLeft:8}}>Schedule a visit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <DateTimePickerModal
            isVisible={open}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    </SafeAreaView>
  );
}