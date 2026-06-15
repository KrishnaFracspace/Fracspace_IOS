import { View, Text,  ScrollView, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions, Modal, Animated, Alert,Share  } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/Feather';
import Icc from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import {
  DisLike,
  Like,
  LikeData,
 } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from './redux/reducer/homeReducer';
import { refrerLink } from './redux/reducer/propertyReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home(props) {
  const dispatch = useDispatch();
  const PropertyDetails = useSelector(state => state.home.Properties);
  //console.log(PropertyDetails,"PropertyDetails")
  const frontendReferral= useSelector(state => state.property.referralLinkfront);
  const referralData = useSelector(state => state.property.referralData);
  const prior = useSelector(state => state.home.prior);
//  const [PropertyDetails, setPropertyDetails] = useState(props?.route?.params?.details || []);
 const { globalState, setGlobalState } = useContext(AppContext);
  const [selectCountry, setSelectCountry] = useState(prior || '');
  const [propDetails, setPropDetails] = useState([]);
  const [likedProperty, setLikedProperty] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [location, setLocation] = useState([]);
  const [apartment, setApartment] = useState('');
  const [categories, setCategories] = useState('All')
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const [filterBy, setFilterBy] = useState('Property Type');
  const defaultRange = [500000, 3000000];
  const [priceRange, setPriceRange] = useState(defaultRange);
  const [visible, setVisible] = useState(false);
  const [like, setLike] = useState([]);
  const [hasUsedFilters, setHasUsedFilters] = useState(false);
  const scaleAnimation = useRef({}).current;

    useEffect(() => {
      dispatch(fetchProperties());
    }, []);


  useEffect(() => {
    if (selectCountry == 'India') {
      const indianProperties = PropertyDetails.filter(
        item => !item.country && item.PropertyType == 'Domastic',
      );
      indianProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
      setPropDetails(indianProperties);
    } else {
      const srilankaProperties = PropertyDetails.filter(
        item => item.country == 'International',
      );
      srilankaProperties.sort((a, b) => (a.num > b.num ? 1 : 1));
      setPropDetails(srilankaProperties);
     // console.log(srilankaProperties,"srilankaProperties")
    }
  }, [selectCountry]);


useEffect(() => {
  dispatch(refrerLink());
}, []);


const shareReferral = async (propertyId) => {
  try {
    if (!referralData?.referralCode) return;
    const link =
      `https://fracspace.onelink.me/OVdL` +
      `?deep_link_value=property` +
      `&af_sub1=${referralData.referralCode}` +
      `&af_sub2=${propertyId}`;
//console.log(link,"========link")
    await Share.share({
      message: `Invest smarter with Fracspace 🚀\nJoin using my link:\n${link}`,
    });
  } catch (err) {
    console.log('Share error:', err);
  }
};

  const handleAllLike = async () => {
    let payload = JSON.stringify({
      email:  globalState?.userEmail,
    });
    try {
      let { data: res } = await LikeData(payload);
      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          LikeData: res?.pIds,
        }));

        const likeProp = res?.properties.map(item => item._id);
        setLikedProperty(likeProp);
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

  useEffect(() => {
    handleAllLike();
  }, []);

   const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });

    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        // const filteredNumbers = IsLike.filter(number => number !== Productid);
        // setIsLike(filteredNumbers);
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

  const handleLike = async propId => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId:propId,
    });

    try {
      let { data: res } = await Like(payload);
      if (res?.success) {
        //setIsLike(Productid);
      //   setIsLike([...IsLike, item?._id]);
      // } else {
      //   handleDisLike(item?._id);
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


  const toggleLike = (item) => {
    setLike((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };

  const triggerScaleAnimation = (itemName) => {
    if (!scaleAnimation[itemName]) {
      scaleAnimation[itemName] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.timing(scaleAnimation[itemName], {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation[itemName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const cityMap = {};
  const typeMap = {};

  propDetails?.forEach(item => {
    const city = item.city?.trim().toLowerCase();
    if (city) {
      cityMap[city] = (cityMap[city] || { name: item.city, count: 0 });
      cityMap[city].count += 1;
    }
  });

  propDetails?.forEach(item => {
    const type = item.P_Type?.trim().toLowerCase();
    if (type) {
      typeMap[type] = (typeMap[type] || { name: item.P_Type, count: 0 });
      typeMap[type].count += 1;
    }
  })

  const uniqueCities = Object.values(cityMap);
  const uniqueTypes = Object.values(typeMap);

//console.log(propDetails,"propDetails")
  const filteredAvlProps = (propDetails || [])
    .filter(item =>  item.AvailableFractions > 0)
    .filter((prop) => {
      if (propertyType.length > 0) {
        return propertyType.some(type => prop.P_Type?.toLowerCase() === type.toLowerCase());
      }
      return true;
    })

    .filter((prop) => {
      if (location.length > 0) {
        return location.some(loc => prop.city?.toLowerCase() === loc.toLowerCase());
      }
      return true;
    })
    // .filter((item) => {
    //   const price = parseInt(item.FC_Price.replace(/[^\d]/g, ''));
    //   return price >= priceRange[0] && price <= priceRange[1];
    // })
    .filter((item) => {
      if (searchQuery.trim() !== '') {
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.Location?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
//console.log(filteredAvlProps,"filteredAvlProps/")
  const filteredNonAvlProps = (propDetails || [])
    .filter(item => item.AvailableFractions === 0)
    .filter(prop => {
      if (propertyType.length > 0) {
        return propertyType.includes(prop.P_Type?.toLowerCase());
      }
      return true;
    })
    .filter(loc => {
      if (location.length > 0) {
        return location.includes(loc.city?.toLowerCase());
      }
      return true;
    })
    .filter(item => {
      const price = parseInt(item.FC_Price.replace(/[^\d]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((item) => {
      if (searchQuery.trim() !== '') {
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.Location?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#FFF" }}>
      <View style={{flex:1,backgroundColor: '#FFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#0000001A', borderBottomWidth: 1, paddingTop: 20 }}>
          <TouchableOpacity onPress={() => {
         navigation?.navigate("BottomNavigations") || navigation.popToTop();
          }} style={{ backgroundColor: '#FFFFFF' }}>
            <Icc name={'chevron-left'} size={20} color={'#000000'} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#191D31' }}>Property Listing</Text>
          <View></View>
        </View>

        <View style={{ padding: 20, paddingBottom: 80 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ borderColor: '#0000001A', flex: 1, borderWidth: 1, borderRadius: 30, paddingHorizontal: 15, height: 45, flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <Ic name={'search'} size={20} color={'#00000099'} />
              <TextInput
                placeholder='Search'
                placeholderTextColor={'#00000099'}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={{ marginLeft: 10, flex: 1, fontFamily: 'Poppins-Medium', fontSize: 13, color: '#000' }}
              />
            </View>
            <TouchableOpacity onPress={() => {
              setVisible(!visible);
            }} style={{ borderColor: '#0000001A', borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, padding: 12 }}>
              <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Filter1.png' }} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#9DB2CE3D', borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => {
              setSelectCountry('India');
            }} style={{ padding: 10, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'India' ? '#0F1130' : 'transparent', borderRadius: 10 }}>
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'India' ? '#FFF' : '#000' }}>Domestic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectCountry('SriLanka');
            }} style={{ padding: 10, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'SriLanka' ? '#0F1130' : 'transparent', borderRadius: 10 }}>
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'SriLanka' ? '#FFF' : '#000' }}>Global</Text>
            </TouchableOpacity>
          </View>

          {(hasUsedFilters || propertyType.length > 0 || location.length > 0 || priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) &&
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#191D31' }}>Categories</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setCategories('All');
                    setPropertyType([]);
                    setLocation([]);
                    if (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) {
                      setPriceRange(defaultRange);
                    }
                    setHasUsedFilters(true);
                  }}
                  style={{
                    borderRadius: 20, padding: 8, paddingHorizontal: 20,
                    backgroundColor:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? '#0F1130' : '#FFFFFF',
                    borderColor:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? 'transparent' : '#0061FF1A',
                    borderWidth:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] &&
                        priceRange[1] === defaultRange[1]
                        ? 0
                        : 1,
                  }}
                >
                  <Text style={{
                    fontFamily: propertyType.length === 0 &&
                      location.length === 0 && priceRange[0] === defaultRange[0] &&
                      priceRange[1] === defaultRange[1] ? 'WorkSans-SemiBold' : 'WorkSans-Regular',
                    fontSize: 12,
                    color: propertyType.length === 0 &&
                      location.length === 0 &&
                      priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? '#FFFFFF' : '#191D31',
                  }}>All</Text>
                </TouchableOpacity>

                {propertyType.length > 0 && propertyType.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setPropertyType(prev => prev.filter(item => item !== type));
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                ))}

                {!(priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1]) && (
                  <TouchableOpacity
                    onPress={() => {
                      setPriceRange(defaultRange);
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>
                      ₹{priceRange[0] / 1000}K - ₹{priceRange[1] / 1000}K
                    </Text>
                  </TouchableOpacity>
                )}

                {location.length > 0 && location.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setLocation(prev => prev.filter(item => item !== loc));
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          }

          <View style={{ marginTop: 0 }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#191D31' }}>Filtered Properties</Text>
          </View>

          {filteredAvlProps.length === 0 && filteredNonAvlProps.length === 0 ?
            (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/NoResultt.jpg' }} style={{ width: width * 0.7, height: 200 }} />
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#191D31', marginTop: 20 }}>No properties match your selected filters</Text>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7A7A7A', marginTop: 5 }}>Try adjusting or resetting filters</Text>
              </View>
            )
            :
            (filteredAvlProps
              .map((item, index) => {
                const itemName = item?.name;
                const propId = item?._id;
                const isLiked = likedProperty.includes(propId);
                if (!scaleAnimation[itemName]) {
                  scaleAnimation[itemName] = new Animated.Value(1);
                }
                return (
                  <TouchableOpacity onPress={() => {
                    // setPropertyDesc(item);
                    // navigation.navigate('CoOwnPropDetail');
                    navigation.navigate('Property', { details: item,Id:item._id,navi:'true'});
                    //console.log(item,"=========item====")
                  }} key={index} style={{ borderColor: '#0000001A', borderWidth: 1, backgroundColor: '#FFFFFF', padding: 10, elevation: 5, marginTop: 20 }}>
                    <View>
                      <View>
                        <Image source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 200 }} />
                         
                        <View style={{ position: 'absolute', bottom: -25, right: 25 }}>
                          <Image resizeMode='contain' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/HotProperty.png' }} style={{ width: 60, height: 100 }} />
                        </View>
                      </View>
{/* 
                      <TouchableOpacity onPress={()=> shareReferral(item._id)} style={{ position: 'absolute',top:12, right: 25 }}>
                      
                        <LinearGradient
                            colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                            style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                             <Ico name={'share-social'} size={20} color="#000" />
                          </LinearGradient>
                      
                      </TouchableOpacity> */}
                      

                      <View style={{ position: 'absolute', top: 15, left: 15 }}>
                        <TouchableOpacity onPress={() => {
                          triggerScaleAnimation(itemName);
                          toggleLike(itemName);
                          if (isLiked) {
                            handleDisLike(propId);
                            setLikedProperty(prev => prev.filter(id => id !== propId));
                          } else {
                            handleLike(propId);
                            setLikedProperty(prev => [...prev, propId]);
                          }
                        }} style={{}}>
                          <LinearGradient
                            colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                            style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                              {isLiked ? (
                                <Ico name={'heart'} size={20} color="#ED1C24" />
                              ) : (
                                <Ico name={'heart-outline'} size={20} color="#ED1C24" />
                              )}
                            </Animated.View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>{item?.name}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#1E3A8A' }}>₹{item?.Price}</Text>
                        </View>
                      </View>
                      {item?.name !== 'ALTAIRA – VILLA' &&
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Frac value:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>₹ {item?.FC_Price}</Text>
                        </View>
                      </View>
              }
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Available Frac</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>{item?.AvailableFractions}</Text>
                        </View>
                      </View>
                      <View style={{ borderColor: '#00000024', borderTopWidth: 1, marginVertical: 8 }}></View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/square.png' }} style={{ width: 18, height: 18 }} />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 10 }}>{item?.area}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/building.png' }} style={{ width: 20, height: 20 }} />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 7 }}>{item?.P_Type}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            )}

          {filteredNonAvlProps
            .map((item, index) => {
              const itemName = item?.name;
              const propId = item?._id;
              const isLiked = likedProperty.includes(propId);
              if (!scaleAnimation[itemName]) {
                scaleAnimation[itemName] = new Animated.Value(1);
              }

              return (
                <TouchableOpacity onPress={() => {
                  // setPropertyDesc(item);
                  // navigation.navigate('CoOwnPropDetail');
                    navigation.navigate('Property', { details: item, Id:item._id,navi:'true'});
                }} key={index} style={{ borderColor: '#0000001A', borderWidth: 1, backgroundColor: '#FFFFFF', padding: 10, elevation: 5, marginTop: 20 }}>
                  <View>
                    <ImageBackground source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 200 }}>
                      <View style={{ flex: 1, backgroundColor: '#FFFCFC7F' }}></View>
                    </ImageBackground>
                    <View style={{ position: 'absolute', top: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%' }}>
                      <TouchableOpacity onPress={() => {
                        triggerScaleAnimation(itemName);
                        toggleLike(itemName);
                        if (isLiked) {
                          handleDisLike(propId);
                          setLikedProperty(prev => prev.filter(id => id !== propId));
                        } else {
                          handleLike(propId);
                          setLikedProperty(prev => [...prev, propId]);
                        }
                      }} style={{ marginLeft: 15 }}>
                        <LinearGradient
                          colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                          style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                            {isLiked ? (
                              <Ico name={'heart'} size={20} color="#ED1C24" />
                            ) : (
                              <Ico name={'heart-outline'} size={20} color="#ED1C24" />
                            )}
                          </Animated.View>
                        </LinearGradient>
                      </TouchableOpacity>
                      <View>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/sold.png' }} style={{ width: 90, height: 30 }} />
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>{item?.name}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#1E3A8A' }}>₹ {item?.Price}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Frac value:</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>₹ {item?.FC_Price}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Available Frac</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>{item?.AvailableFractions}</Text>
                      </View>
                    </View>
                    <View style={{ borderColor: '#00000024', borderTopWidth: 1, marginVertical: 8 }}></View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/square.png' }} style={{ width: 18, height: 18 }} />
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 10 }}>{item?.area}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/building.png' }} style={{ width: 20, height: 20 }} />
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 7 }}>{item?.P_Type}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
        </View>
      </ScrollView>

      {/* --------------------------------------Filters-------------------------------------- */}

      {visible &&
        <Modal visible={true} modalStyle={{ width: width, flex: 1}}>
          <View style={{ flex: 1, backgroundColor: '#FAFAFA' ,paddingTop:51}}>
            <View style={{ backgroundColor: '#FFFFFF', padding: 20, flexDirection: 'row', justifyContent: 'space-between', elevation: 5, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#191D31' }}>Filter by</Text>
              <TouchableOpacity onPress={() => {
                setPropertyType([]);
                setLocation([]);
                if (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) {
                  setPriceRange(defaultRange);
                }
              }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#191D31' }}>Reset</Text>
                <Ico name={'refresh'} size={17} color={'#000000'} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', elevation: 5 }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => {
                  setFilterBy('Property Type');
                }} style={{ marginTop: 20, padding: 20, backgroundColor: filterBy == 'Property Type' ? '#FFFFFF' : '', borderLeftWidth: filterBy == 'Property Type' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Property Type' ? '#386BF6' : '#000000' }}>Property Type</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setFilterBy('Location');
                }} style={{ backgroundColor: filterBy == 'Location' ? '#FFFFFF' : '', padding: 20, borderLeftWidth: filterBy == 'Location' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Location' ? '#386BF6' : '#000000' }}>Location</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setFilterBy('Price Range');
                }} style={{ padding: 20, backgroundColor: filterBy == 'Price Range' ? '#FFFFFF' : '', borderLeftWidth: filterBy == 'Price Range' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Price Range' ? '#386BF6' : '#000000' }}>Price range</Text>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: filterBy == 'Price Range' ? '#386BF68F' : '#00000047' }}>(Per Frac)</Text>
                </TouchableOpacity>

              </View>

              <View style={{ borderLeftColor: '#00000021', borderLeftWidth: 1 }}></View>

              <View style={{ flex: 1.5 }}>
                {filterBy == 'Property Type' &&
                  <View>
                    {uniqueTypes.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setPropertyType(prev =>
                            prev.includes(item.name.toLowerCase())
                              ? prev.filter(t => t !== item.name.toLowerCase())
                              : [...prev, item.name.toLowerCase()]
                          );
                        }}
                        style={{ flexDirection: 'row', marginTop: 25, paddingHorizontal: 20, justifyContent: 'space-between' }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000' }}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0000004D' }}>{item.count}</Text>
                          {propertyType.includes(item.name.toLowerCase()) ? (
                            <Ico name={'checkbox'} size={20} color={'#386BF6'} />
                          ) : (
                            <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'} />
                          )}
                        </View>
                      </TouchableOpacity>

                    ))}
                  </View>
                }

                {filterBy == 'Location' &&
                  <View>
                    {uniqueCities.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setLocation(prev =>
                            prev.includes(item.name.toLowerCase())
                              ? prev.filter(c => c !== item.name.toLowerCase())
                              : [...prev, item.name.toLowerCase()]
                          );
                        }}
                        style={{ flexDirection: 'row', marginTop: 25, paddingHorizontal: 20, justifyContent: 'space-between' }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000' }}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0000004D' }}>{item.count}</Text>
                          {location.includes(item.name.toLowerCase()) ? (
                            <Ico name={'checkbox'} size={20} color={'#386BF6'} />
                          ) : (
                            <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'} />
                          )}
                        </View>
                      </TouchableOpacity>

                    ))}
                  </View>
                }

                {filterBy == 'Price Range' &&
                  <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 25, paddingHorizontal: 20 }}>
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000' }}>Choose Price Range</Text>
                    </View>
                    <View style={{ margin: 20 }}>
                      <MultiSlider
                        style={{ width: width * 0.5 }}
                        values={priceRange}
                        sliderLength={width * 0.48}
                        onValuesChange={(values) => setPriceRange(values)}
                        min={500000}
                        max={3000000}
                        step={100000}
                        selectedStyle={{ backgroundColor: '#2853CE', }}
                        unselectedStyle={{ backgroundColor: '#E3E3E3' }}
                        customMarker={(e) => (
                          <View style={{ alignItems: 'center', }}>
                            {/* Marker Dot */}
                            <View style={{ width: 20, height: 20, backgroundColor: '#2853CE', borderRadius: 10, marginTop: 40 }} />
                            {/* Label Below Marker */}
                            <Text style={{ marginTop: 5, fontSize: 12, fontFamily: 'WorkSans-Medium', color: '#2853CE', }}>
                              ₹{e.currentValue.toLocaleString('en-IN')}
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000' }}>Finalised Price Range</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <View style={{}}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#101010' }}>Min</Text>
                          <Text style={{ color: '#386BF6', fontFamily: 'Montserrat-SemiBold', fontSize: 15, marginTop: 5 }}>
                            {`₹${priceRange[0]}`}
                          </Text>
                        </View>
                        <View style={{}}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#101010' }}>Max</Text>
                          <Text style={{ color: '#386BF6', fontFamily: 'Montserrat-SemiBold', fontSize: 15, marginTop: 5 }}>
                            {`₹${priceRange[1]}`}
                          </Text>
                        </View>
                      </View>
                      {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#386BF6',marginTop:10}}>{`₹${priceRange[1]}`}</Text> */}
                    </View>
                  </View>
                }
              </View>
            </View>

            <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 35, elevation: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                  setVisible(!visible);
                }} style={{ backgroundColor: '#0F1130', borderColor: '#000000', borderWidth: 1, padding: 10, flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 15, color: '#FFFFFF' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setVisible(!visible);
                }} style={{ backgroundColor: '#F0F4FA', borderWidth: 1, borderColor: '#9DB2CE30', padding: 10, flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 15, color: '#021265' }}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      }
      {/* <Footer navigation={navigation} activeFooterTab={'home'} /> */}
      </View>
    </SafeAreaView>
  )
}

