import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Footer from './Footer';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconD from 'react-native-vector-icons/Octicons';
import {DisLike, LikeData} from './Services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from './Context/AppContext';
import Back from './Back';
import Contact from './Contact';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Like() {
  const {globalState, setGlobalState} = useContext(AppContext);

  const navigation = useNavigation();
  const [IsLike, setIsLike] = useState([]);
  const [EventStatus, setEventStatus] = useState(0);
  const [Massage, setMassage] = useState('');
  const handleAllLike = async () => {
    const email = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: email,
    });
    try {
      let {data: res} = await LikeData(payload);
      if (res?.success) {
        if (res?.properties.length != 0) {
          setGlobalState(prevState => ({
            ...prevState,
            LikeData: res?.pIds,
          }));
          setIsLike(res?.properties);
        } else {
          setMassage(
            'Great news! The properties you liked have been wishlisted for your convenience. Happy browsing!',
          );
        }
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
      setMassage(
        'Great news! The properties you liked have been wishlisted for your convenience. Happy browsing!',
      );
    }
  };

  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
  
    try {
      let {data: res} = await DisLike(payload);
    
      if (res?.success) {
        const filteredNumbers = IsLike.filter(
          number => number?._id !== Productid,
        );
        setIsLike(filteredNumbers);
        setEventStatus(EventStatus + 1);
        if (IsLike.length == 1) {
          setIsLike([]);
        }
      }
    } catch (error) {
     //console.log();
      if (error?.response) {
        // console.log();
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {
    handleAllLike();
  }, [EventStatus]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Back title={'Wishlist'} />
        <ScrollView style={{padding: 15, backgroundColor: '#FAFAFF'}}>
          {IsLike.length !== 0 ? (
            <View style={{marginBottom: 150}}>
              {IsLike.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    borderColor: '#E2E2E2',
                    borderWidth: 1,
                    // padding: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    //alignItems: 'center',
                    backgroundColor: '#E9F2FF',
                    marginBottom: 8,
                  }}
                  onPress={() => {
                    //  const name = item?.name;
                    navigation.navigate('Property', {details: item});
                  }}>
                  <Image
                    style={{
                      width: width * 0.35,
                      height: 120,
                      borderRadius: 5,
                      opacity: item?.AvailableFractions == 0 ? 0.5 : null,
                    }}
                    source={{uri: item?.image?.Image1}}
                  />
                  {/* <TouchableOpacity
                style={{
                  position: 'absolute',
                 // padding:10,
                 margin:10,
                 alignItems: 'center',
                  justifyContent:'center',
                  backgroundColor: 'white',
                  height: 25,
                  width: 25,
                  borderRadius: 25,
                 
                }}
                onPress={()=>{
                 
                }}>
               
               <Icon
                name={'cards-heart' }
                size={20}
                color={'#FF3659'}
              />
              </TouchableOpacity> */}
                  {item?.AvailableFractions == 0 && (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        position: 'absolute',
                        // justifyContent: 'center',
                        // alignItems:'center',
                        opacity: 0.7,

                        left: width * 0.21,
                        // top: height*0.10,
                        //right: -100,
                      }}
                      source={require('./assets/SoldOut2.png')}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      alignItems: 'flex-start',
                      paddingVertical: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingHorizontal: 8,
                      }}>
                      <View style={{flex: 9}}>
                        <Text
                          style={{
                            color: '#1E2135',
                            fontSize: 12,
                            fontFamily: 'Montserrat-SemiBold',
                            // paddingVertical: 2,
                          }}>
                          {item?.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{flex: 1,paddingHorizontal:10}}
                        onPress={() => {
                          handleDisLike(item?._id);
                        }} >
                        <IconD name={'trash'} size={19} color={'#E73131'} />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: 8,
                        // borderWidth:3
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Montserrat-Medium',
                            color: '#1E2135',
                          }}>
                          Frac value
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Montserrat-Medium',
                            color: '#1E2135',
                          }}>
                          {'\u20B9'}
                          {item?.FC_Price}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        flex: 1,
                        paddingHorizontal: 8,
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Montserrat-Medium',
                            color: '#236C1C',
                          }}>
                          Available Fraction
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Montserrat-Medium',
                            color: '#236C1C',
                          }}>
                          {' '}
                          {item?.AvailableFractions}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        // margin:5
                        // paddingTop:5,
                        paddingHorizontal: 8,
                      }}>
                      <View></View>
                      <View
                        style={{
                          backgroundColor: '#FFFFFF',
                          paddingHorizontal: 12,
                          borderRadius: 20,
                          paddingVertical: 8,
                          elevation: 5,
                          shadowColor: '#000',
                          shadowRadius: 2,
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.1,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-SemiBold',
                            color: '#043862',
                          }}>
                          View Details
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text
              style={{
                color: '#043862',
                fontSize: 16,
                fontFamily: 'OpenSans-SemiBold',
                textAlign: 'center',
              }}>
              {Massage}
            </Text>
          )}
        </ScrollView>
        {/* <Contact /> */}
        {/* <Footer navigation={navigation} activeFooterTab={'like'} /> */}
      </View>
    </SafeAreaView>
  );
}
