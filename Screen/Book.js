import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import IconAntDesign from 'react-native-vector-icons/Entypo';
import {PropertyBook} from './Services/UserApi';
import {AppContext} from './Context/AppContext';
import Back from './Back';
import Icon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Book(props) {
  //console.log(props?.route?.params?.property);
  const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [Number, setNumber] = useState(1);
  const [Terms, setTerms] = useState(false);
  const [Property, setProperty] = useState(props?.route?.params?.property);
  const [Available, setAvailable] = useState(
    props?.route?.params?.property?.AvailableFractions,
  );

  const IncrementCount = () => {
    if (Number < Available) {
      setNumber(Number + 1);
    }
  };

  const DecrementCount = () => {
    if (Number > 1) {
      setNumber(Number - 1);
    }
  };
  const handleBooking = async item => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyName: Property?.name,
      propertyId: Property?._id,
      Price: Property?.Price,
      FC_Price: Property?.FC_Price,
      fractionValue: Property?.FC_Price,
      numberOfFractions: Number,
      totalBookingAmount: Number * Property?.BookingAmount,
      termsAndConditions: Terms,
    });
    // console.log(payload);

    try {
      let {data: res} = await PropertyBook(payload);
      // console.log(res);

      if (res?.success) {
        navigation.navigate('Review', {
          proprtyDetails: res,
          PropertyImage: Property?.image?.Image1,
        });
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Back title={'Book'} />
      <ScrollView style={{padding: 20, backgroundColor: '#FFFFFF'}}>
        <Text
          style={{
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 20,
            color: '#000000',
          }}>
          Hurry ! Book your property now
        </Text>
        <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
          <Image
            resizeMode="cover"
            source={{uri: Property?.image?.Image1}}
            style={{
              width: '100%',
              height: height * 0.34,
              borderRadius: 8,
              marginTop: 20,
            }}
          />
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
              position: 'absolute',
              marginTop: height * 0.3,
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',

                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#DCDCDC',
                // marginHorizontal:50,
                // margin: 20,
                //  flex:1,

                padding: 20,

                // alignItems: 'center',
                // justifyContent: 'flex-end',
                width: '100%',
                //height: 240,
              }}>
              <Text
                style={{
                  fontFamily: 'WorkSans-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Enjoy Complimentary Stay{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  // borderWidth: 1,
                  width: '100%',
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Property Name :
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      // textAlign: 'right',
                    }}>
                    {Property?.name}
                  </Text>
                </View>
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Available Frac :
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      // textAlign: 'left',
                    }}>
                    {Property?.AvailableFractions}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Booking Amount Per Frac :
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {'\u20B9'} {Property?.BookingAmount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // paddingVertical: 10,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Platform Fee :
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {'\u20B9'} {300}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    No of Fractions :
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    borderColor: '#979797',
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                   // width: 80,
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    padding: 3,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      DecrementCount();
                    }}>
                    <Icon name={'minus'} size={20} color={'#188C16'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 16,
                      color: '#188C16',
                    }}>
                    {Number}
                  </Text>

                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      IncrementCount();
                    }}>
                    <Icon name={'plus'} size={20} color={'#188C16'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: height * 0.25,}}>
        <View
          style={{
            borderColor: '#418841',
            borderWidth: 1,
            backgroundColor: '#51AC51',
            borderRadius: 5,
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
           // marginTop: height * 0.38,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 14,
              color: '#FFFFFF',
            }}>
            Total Booking Amount
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 14,
              color: '#FFFFFF',
            }}>
            {'\u20B9'} {Number * Property?.BookingAmount+300*Number}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            padding: 5,
            marginVertical: 10,
            flex:1,
            width:'100%'
          }}>
          <TouchableOpacity
            onPress={() => {
              setTerms(!Terms);
            }}>
            <View style={styles.option}>
              <View style={[styles.checkbox,{backgroundColor:Terms?'#081F62': '#ffff',}]}>
                {Terms && (
                  <IconAntDesign name="check" size={10} color="#FFFFFF" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          {/* <Text  style={{color: '#1E2135',fontWeight:400,fontSize:14}}> I have read</Text> */}
          <Text
            style={{
              color: '#1E2135',
              fontFamily: 'Montserrat-Medium',
              fontSize: 10,
            }}>
            {" "}I agree to the
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsAndCondition');
            }}>
            <Text
              style={{
                color: '#0F1130',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 10,
              }}>
              {' '}
              Terms & conditions
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: '#1E2135',
              fontFamily: 'Montserrat-Medium',
              fontSize: 10,
            }}>
            {' '}
            and
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Privacy');
            }}>
            <Text
              style={{
                color: '#0F1130',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 10,
              }}>
              {' '}
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={!Terms}
          onPress={() => {
            //console.log('submit');
            handleBooking();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: Terms == false ? '#AEAEAE' : '#081F62',
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginHorizontal:30,
            // borderColor: '#043862',
            //borderWidth: 1,
            borderRadius: 8,
            //marginTop: 30,
            marginTop:20,
            marginBottom:60
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Montserrat-SemiBold',
              color: '#FFFFFF',
            }}>
            Review
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

  
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    // overflow: 'hidden',
    //width: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    // top: -(height*0.2),
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',

    // color: 'black'
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    // width: 110,
    // height: 110,
    width: width * 0.3,
    height: height * 0.16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 15,
    width: 15,
    borderRadius:5,
    borderColor: '#043862',
    borderWidth: 2,
    
    borderRadius: 2,
    alignItems: 'center',
  },
});
