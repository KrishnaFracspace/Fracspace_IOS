import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/Feather';
import Ic from 'react-native-vector-icons/Ionicons';
import Icc from 'react-native-vector-icons/FontAwesome5';
import Iccoo from 'react-native-vector-icons/FontAwesome6';
import Icco from 'react-native-vector-icons/Entypo';
import Iconn from 'react-native-vector-icons/MaterialCommunityIcons';
import Icnn from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');
export default function RoomDescription(props) {
  //console.log(props?.route?.params?.roomDetail);

  const [description, setDescription] = useState(props?.route?.params?.detail);
  //const [roomDetails, setRoomDetails] = useState(props?.route?.params?.roomDetail);
  const [RoomType, setRoomType] = useState(props?.route?.params?.name);
  const [visible1, setVisible1] = useState('Restaurants');
  const [rules, setRules] = useState(false);
  const [policy, setPolicy] = useState(false);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={{backgroundColor: '#FAFAFF', width: '100%'}}>
        <View
          style={{
            backgroundColor: '#0E2037',
        
            padding: 20,
          
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelectRoom',{detail:description});
              }}>
              <Icon name={'left'} size={20} color={'#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Montserrat-Medium',
                fontSize: 16,
                color: '#FFFFFF',
              }}>
              {description?.name}
            </Text>
            {/* <Ico name={'camera'} size={20} color={'#FFFFFF'} /> */}
            <View></View>
          </View>
        </View>

        {/* <Swiper
                    style={{ height: height * 0.3 }}
                    showsPagination={true}
                    loop={true}
                    dotStyle={{ backgroundColor: '#0E213861', width: 8, height: 8, borderRadius: 4 }}
                    activeDotStyle={{ backgroundColor: '#0E2138', width: 8, height: 8, borderRadius: 4 }}
                    autoplay
                >
                    {description?.images.map((img, imgIndex) => (
                        <Image resizeMode='cover' key={imgIndex} source={{ uri: img }} style={{ width: width, flex: 1 }} />
                    ))}
                </Swiper> */}

        <Swiper
          style={{height: height * 0.3}}
          showsPagination={true}
          loop={true}
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
          autoplay>
          {description?.name == 'DREAMSCAPE'
            ? RoomType?.roomImages.map((img, imgIndex) => (
                <Image
                  resizeMode="cover"
                  key={imgIndex}
                  source={{uri: img}}
                  style={{width: width, flex: 1}}
                />
              ))
            : description?.images.map((img, imgIndex) => (
                <Image
                  resizeMode="cover"
                  key={imgIndex}
                  source={{uri: img}}
                  style={{width: width, flex: 1}}
                />
              ))}
        </Swiper>

        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'WorkSans-SemiBold',
                fontSize: 16,
                color: '#000000',
              }}>
              {description?.name}-
            </Text>
            <Text
              style={{
                fontFamily: 'WorkSans-SemiBold',
                fontSize: 16,
                color: '#000000',
              }}>
              {RoomType?.type}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
            <Ic name={'location-sharp'} size={15} color={'#0D2037'} />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                color: '#000',
                // textDecorationLine: 'underline',
                marginLeft: 5,
              }}>{`${description?.location?.address}, ${description?.location?.city}`}</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 20, paddingTop: 0}}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: '#000000',
            }}>
            Property Description
          </Text>
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'WorkSans-Regular',
                fontSize: 14,
                color: '#000000',
                flex: 1,
              }}>
              {description?.description}
              {/* <TouchableOpacity>
                                    <Text style={{fontFamily:'Montserrat-Regular',fontSize:14,color:'#818181'}}>More...</Text>
                                </TouchableOpacity> */}
            </Text>
          </View>
        </View>

        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: '#000000',
              }}>
              Popular Amenities
            </Text>
            {/* <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 10,
                color: '#0424CB',
                textDecorationLine: 'underline',
              }}>
              VIEW ALL
            </Text> */}
          </View>

          <ScrollView horizontal={true} style={{marginTop: 15, gap: 15}}>
            {description?.majorAmenities?.includes('Free WiFi') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icc name={'wifi'} size={20} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                    textAlign:'center',
                    //flex:1
                  }}>
                  Wifi
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Room service') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Image resizeMode='contain' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon3.png' }} style={{ width: 30, height: 22 }} /> */}
                <Iconn name={'room-service'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                    textAlign:'center',
                   // flex:1
                    
                    
                  }}>
                  Room
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                   // marginTop: 5,
                    textAlign:'center',
                    
                    
                  }}>
                Service
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Free Parking') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Iconn name={'parking'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                    //flex:1
                  }}>
                  Parking
                </Text>
              </View>
            )}
            {/* {description?.majorAmenities?.includes('Restaurant') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon2.png',
                  }}
                  style={{width: 30, height: 23}}
                />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Dinner
                </Text>
              </View>
            )} */}
         
            {description?.majorAmenities?.includes('Ac') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon1.png',
                  }}
                  style={{width: 30, height: 22}}
                />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                   // flex:1

                  }}>
                  AC
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Gym') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Image resizeMode='contain' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon5.png' }} style={{ width: 30, height: 30 }} /> */}
                <Iccoo name={'dumbbell'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 10,
                   // flex:1
                  }}>
                  GYM
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('TV') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icc name={'tv'} size={20} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                    
                  }}>
                  TV
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Kettle') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Iconn name={'kettle'} size={22} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Kettle
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Fridge') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Iconn name={'fridge'} size={25} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Refrigerator
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Locker') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icnn name={'shield-lock'} size={25} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Digital
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    //marginTop: 5,
                  }}>
                 Locker
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Pool') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Iconn name={'pool'} size={30} color={'#252525'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    //marginTop: 5,
                  }}>
                  Swimming
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Pool
                </Text>
              </View>
            )}
            {description?.majorAmenities?.includes('Break Fast') && (
              <View
                style={{
                  borderColor: '#62626233',
                  borderWidth: 1,
                  marginHorizontal: 5,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon2.png',
                  }}
                  style={{width: 30, height: 23}}
                />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                    marginTop: 5,
                  }}>
                  Break
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 10,
                    color: '#101010',
                   
                  }}>
                  Fast
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: '#000000',
            }}>
            Nearby Places to Explore
          </Text>
          <View style={{marginTop: 15, flexDirection: 'row', gap: 30}}>
            <TouchableOpacity
              onPress={() => {
                setVisible1('Restaurants');
              }}
              style={{
                borderBottomWidth: visible1 == 'Restaurants' ? 1.5 : 0,
                borderBottomColor: '#000000',
              }}>
              <Text
                style={{
                  fontFamily:
                    visible1 == 'Restaurants'
                      ? 'Poppins-SemiBold'
                      : 'Poppins-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Restaurants
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible1('Cafe');
              }}
              style={{
                borderBottomWidth: visible1 == 'Cafe' ? 1.5 : 0,
                borderBottomColor: '#000000',
              }}>
              <Text
                style={{
                  fontFamily:
                    visible1 == 'Cafe' ? 'Poppins-SemiBold' : 'Poppins-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Cafe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible1('Shopping');
              }}
              style={{
                borderBottomWidth: visible1 == 'Shopping' ? 1.5 : 0,
                borderBottomColor: '#000000',
              }}>
              <Text
                style={{
                  fontFamily:
                    visible1 == 'Shopping'
                      ? 'Poppins-SemiBold'
                      : 'Poppins-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Shopping
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible1('Transport');
              }}
              style={{
                borderBottomWidth: visible1 == 'Transport' ? 1.5 : 0,
                borderBottomColor: '#000000',
              }}>
              <Text
                style={{
                  fontFamily:
                    visible1 == 'Transport'
                      ? 'Poppins-SemiBold'
                      : 'Poppins-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Transport
              </Text>
            </TouchableOpacity>
          </View>

          {visible1 == 'Restaurants' && (
            <View style={{marginTop: 15, gap: 15}}>
              {description?.sightseeing?.Restaurants.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginRight: 20,
                  }}>
                  <View style={{flexDirection: 'row', justifyContent:'space-between', flex: 1}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <Image source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/spoon.png'}} style={{ width: 15, height: 15 }} />
                      <Text
                        style={{
                          fontFamily: 'WorkSans-Medium',
                          fontSize: 12,
                          color: '#000000',
                          marginHorizontal: 20,
                        }}>
                        {item?.name}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: 'WorkSans-Medium',
                        fontSize: 12,
                        color: '#000000',
                      }}>
                      {item?.Dist}
                    </Text>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <Icon
                      name={'arrowright'}
                      size={18}
                      color={'#0424CB'}
                      style={{transform: [{rotate: '315deg'}]}}
                    />
                    
                  </View> */}
                </View>
              ))}
              {/* <View
                style={{
                  borderWidth: 1,
                  borderColor: '#62626233',
                  backgroundColor: '#FFFFFF',
                  padding: 7,
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 12,
                    color: '#000000',
                  }}>
                  Load more
                </Text>
              </View> */}
            </View>
          )}

          {visible1 == 'Cafe' && (
            <View style={{marginTop: 15, gap: 10}}>
              {description?.sightseeing?.Cafe.map((item, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ico name={'coffee'} size={20} color={'#000000'} />
                  <Text
                    style={{
                      fontFamily: 'WorkSans-Medium',
                      fontSize: 12,
                      color: '#000000',
                      marginLeft: 10,
                    }}>
                    {item?.name}
                  </Text>
                </View>
              ))}
              {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ico name={'coffee'} size={20} color={'#000000'} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Cafe de paris</Text>
                            </View> */}
            </View>
          )}

          {visible1 == 'Shopping' && (
            <View style={{marginTop: 15, gap: 15}}>
              {description?.sightseeing?.Shopping.map((item, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icco name={'shopping-bag'} size={20} color={'#000000'} />
                  <Text
                    style={{
                      fontFamily: 'WorkSans-Medium',
                      fontSize: 12,
                      color: '#000000',
                      marginLeft: 10,
                    }}>
                    {item?.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {visible1 == 'Transport' && (
            <View style={{marginTop: 15, gap: 10}}>
              {/* {description?.sightseeing?.Transport.map((item, index) => ( */}
              <View style={{flexDirection: 'row'}}>
                <Iconn name={'bus'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  {description?.sightseeing?.Transport[0]?.name}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Iconn
                  name={'gas-station-outline'}
                  size={20}
                  color={'#000000'}
                />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  {description?.sightseeing?.Transport[1]?.name}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Ic name={'train-outline'} size={20} color={'#000000'} />
                <Text
                  style={{
                    fontFamily: 'WorkSans-Medium',
                    fontSize: 12,
                    color: '#000000',
                    marginLeft: 10,
                  }}>
                  {description?.sightseeing?.Transport[2]?.name}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#000000' }}>Nearby Places to Explore</Text>
                    <View style={{ marginTop: 15, flexDirection: 'row', gap: 30 }}>
                        <TouchableOpacity onPress={() => {
                            setVisible1("Restaurants");
                        }} style={{ borderBottomWidth: visible1 == "Restaurants" ? 1.5 : 0, borderBottomColor: '#000000' }}>
                            <Text style={{ fontFamily: visible1 == "Restaurants" ? 'Poppins-SemiBold' : 'Poppins-Medium', fontSize: 12, color: '#000000' }}>Restaurants</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setVisible1("Cafe");
                        }} style={{ borderBottomWidth: visible1 == "Cafe" ? 1.5 : 0, borderBottomColor: '#000000' }}>
                            <Text style={{ fontFamily: visible1 == "Cafe" ? 'Poppins-SemiBold' : 'Poppins-Medium', fontSize: 12, color: '#000000' }}>Cafe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setVisible1("Shopping");
                        }} style={{ borderBottomWidth: visible1 == "Shopping" ? 1.5 : 0, borderBottomColor: '#000000' }}>
                            <Text style={{ fontFamily: visible1 == "Shopping" ? 'Poppins-SemiBold' : 'Poppins-Medium', fontSize: 12, color: '#000000' }}>Shopping</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setVisible1("Transport");
                        }} style={{ borderBottomWidth: visible1 == "Transport" ? 1.5 : 0, borderBottomColor: '#000000' }}>
                            <Text style={{ fontFamily: visible1 == "Transport" ? 'Poppins-SemiBold' : 'Poppins-Medium', fontSize: 12, color: '#000000' }}>Transport</Text>
                        </TouchableOpacity>
                    </View>

                    {visible1 == "Restaurants" &&
                        <View style={{ marginTop: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Image source={require('./assets/spoon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginHorizontal: 20 }}>Mehfil</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <Icon name={'arrowright'} size={18} color={'#0424CB'} style={{ transform: [{ rotate: '315deg' }] }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000' }}>0.8km</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginVertical: 15 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Image source={require('./assets/spoon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginHorizontal: 20 }}>Paradise</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <Icon name={'arrowright'} size={18} color={'#0424CB'} style={{ transform: [{ rotate: '315deg' }] }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000' }}>1.8km</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Image source={require('./assets/spoon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginHorizontal: 20 }}>Bawarchi Green</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <Icon name={'arrowright'} size={18} color={'#0424CB'} style={{ transform: [{ rotate: '315deg' }] }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000' }}>3.2km</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginVertical: 15 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Image source={require('./assets/spoon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginHorizontal: 20 }}>Hotel Luna</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <Icon name={'arrowright'} size={18} color={'#0424CB'} style={{ transform: [{ rotate: '315deg' }] }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000' }}>4.8km</Text>
                                </View>
                            </View>
                            <View style={{ borderWidth: 1, borderColor: '#62626233', backgroundColor: '#FFFFFF', padding: 7, alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#000000' }}>Load more</Text>
                            </View>
                        </View>
                    }

                    {visible1 == "Cafe" &&
                        <View style={{ marginTop: 15, gap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ico name={'coffee'} size={20} color={'#000000'} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Cafe de paris</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ico name={'coffee'} size={20} color={'#000000'} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Cafe de paris</Text>
                            </View>
                        </View>
                    }

                    {visible1 == "Shopping" &&
                        <View></View>
                    }

                    {visible1 == "Transport" &&
                        <View style={{ marginTop: 15, gap: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ic name={'airplane-outline'} size={20} color={'#000000'} style={{ transform: [{ rotate: '-90deg' }], }} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Airport</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ic name={'train-outline'} size={20} color={'#000000'} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Metro</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Iconn name={'gas-station-outline'} size={20} color={'#000000'} />
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Shell petrol bunk</Text>
                            </View>
                        </View>
                    }
                </View> */}

        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <TouchableOpacity
            onPress={() => {
              setRules(!rules);
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: '#000000',
                textDecorationLine: 'underline',
              }}>
              Hotel Rules & Policies
            </Text>
            {rules ? (
              <Icco
                name={'chevron-down'}
                size={15}
                color={'#333333'}
                style={{marginLeft: 10}}
              />
            ) : (
              <Icco
                name={'chevron-up'}
                size={15}
                color={'#333333'}
                style={{marginLeft: 10}}
              />
            )}
          </TouchableOpacity>

          {!rules && (
            <>
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  Check-in Check-out
                </Text>
                <View style={{marginVertical: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ico name={'clock'} size={18} color={'#333333'} />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        color: '#000000',
                        marginLeft: 10,
                      }}>
                      {description?.checkInTime}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Ico name={'clock'} size={18} color={'#333333'} />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        color: '#000000',
                        marginLeft: 10,
                      }}>
                      {description?.checkOutTime}
                    </Text>
                  </View>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Iconn name={'account-check-outline'} size={20} color={'#333333'} />
                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000', marginLeft: 10 }}>Self check in with building staff</Text>
                                    </View> */}
                </View>
              </View>

              {/* <View style={{marginTop: 10}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 12,
                    color: '#1A1A1A',
                  }}>
                  During your stay
                </Text>
                <View style={{marginVertical: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Iconn
                      name={'paw-off-outline'}
                      size={20}
                      color={'#333333'}
                    />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        color: '#000000',
                        marginLeft: 10,
                      }}>
                      No pets
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 10,
                    }}>
                    <Ic name={'logo-no-smoking'} size={20} color={'#333333'} />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        color: '#000000',
                        marginLeft: 10,
                      }}>
                      No Smoking
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/appImages/icon6.png',
                      }}
                      style={{width: 20, height: 20}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        color: '#000000',
                        marginLeft: 10,
                      }}>
                      No parties or events
                    </Text>
                  </View>
                </View>
              </View> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F0EFFB',
                  marginTop: 10,
                }}></View>
            </>
          )}
        </View>

        <View style={{paddingHorizontal: 20, paddingVertical: 5}}>
          <TouchableOpacity
            onPress={() => {
              setPolicy(!policy);
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: '#000000',
                textDecorationLine: 'underline',
              }}>
              Cancellation policy
            </Text>
            {policy ? (
              <Icco
                name={'chevron-down'}
                size={15}
                color={'#333333'}
                style={{marginLeft: 10}}
              />
            ) : (
              <Icco
                name={'chevron-up'}
                size={15}
                color={'#333333'}
                style={{marginLeft: 10}}
              />
            )}
          </TouchableOpacity>

          {!policy && (
            <View>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#000000',
                  marginVertical: 10,
                }}>
                Add a touch of elegance to your lifestyle with our Premium{' '}
                {description?.name}. This stylish property effortlessly blends
                modern architecture with the beauty of nature, making it a
                versatile haven for luxury living More..
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Full refund:
                <Text
                  style={{
                    fontFamily: 'WorkSans-Regular',
                    fontSize: 12,
                    color: '#000000',
                  }}>
                  {' '}
                  {description?.policies?.cancellationPolicy}
                </Text>
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F0EFFB',
                  marginVertical: 7,
                }}></View>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Pet Policy:
                <Text
                  style={{
                    fontFamily: 'WorkSans-Regular',
                    fontSize: 12,
                    color: '#000000',
                  }}>
                  {' '}
                  {description?.policies?.petPolicy}
                </Text>
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F0EFFB',
                  marginVertical: 7,
                }}></View>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Other Policy:
                <Text
                  style={{
                    fontFamily: 'WorkSans-Regular',
                    fontSize: 12,
                    color: '#000000',
                  }}>
                  {' '}
                  {description?.policies?.otherPolicies}
                </Text>
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F0EFFB',
                  marginVertical: 7,
                }}></View>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          flexDirection: 'row',
          elevation: 5,
        }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              fontSize: 21,
              color: '#101010',
            }}>
            ₹{RoomType?.price}/N
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              fontSize: 14,
              color: '#0D2037',
            }}>
            + taxes and fees
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EnquirtyFS', {Hotel_id: description?._id});
          }}
          style={{
            backgroundColor: '#0D2037',
            borderRadius: 12,
            padding: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: '#FFFFFF',
            }}>
            Pay at hotel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF4D',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
  },
  image: {
    width,
    flex: 1,
  },
  wrapper: {},
  container: {
    flex: 1,
  },
});
