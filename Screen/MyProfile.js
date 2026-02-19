import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Feather';
import Icoon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {CallRecord} from './Services/UserApi';
import {AppContext} from './Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');

export default function MyProfile(props) {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(AppContext);
  const handleMail = Email => {
    const mailto = `mailto:${Email}`;
    Linking.openURL(mailto).catch(err =>
      console.error('An error occurred', err),
    );
  };

  const handleCallRecord = async Phone => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      ContactNumberOfFs: Phone,
      enquiryAbout: 'Home Page call',
    });

    try {
      let {data: res} = await CallRecord(payload);
      if (res?.success) {
        handleCallNow(Phone);
      }
    } catch (error) {
      if (error?.response) {
        // Alert.alert('Response Error', ${error?.response?.data?.message});
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      } else {
        // Alert.alert('Error:', ${error});
      }
    }
  };

  const handleCallNow = Phone => {
    const phoneNumber = Phone;
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone number is not supported');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };

  return (
 <SafeAreaView style={{flex: 1,}}>
    <ScrollView style={{backgroundColor: '#FAFAFF'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 25,
          backgroundColor: '#FFFFFF',
        }}>
        <Icon name={'left'} size={20} color={'#000000'} />
        <Text
          style={{
            fontFamily: 'WorkSans-SemiBold',
            fontSize: 15,
            color: '#000000',
          }}>
          Helpline
        </Text>
        {/* <IconI name={'headphones'} size={20} color={'#000000'}/> */}
        <View></View>
      </TouchableOpacity>
      <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
        <Text
          style={{
            fontFamily: 'WorkSans-SemiBold',
            fontSize: 24,
            color: '#1A1A1A',
          }}>
          Let’s Chat, Reach Out to Us
        </Text>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            fontFamily: 'WorkSans-Medium',
            fontSize: 12,
            color: '#000000',
          }}>
          Have Questions or Need Help? We’re here to help. Send us a message,
          and we’ll respond within 24 hours .
        </Text>
      </View>

      {props?.route?.params?.screen == 'home' && (
        <View>
          <TouchableOpacity
            onPress={() => {
              const Email = 'support@fracspace.com';
              handleMail(Email);
            }}
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 20,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#021265',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Icoon name={'mail-outline'} size={20} color={'#FFFFFF'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Email
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#1939E4',
                  textDecorationLine: 'underline',
                }}>
                support@fracspace.com
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const Phone = '+919154867608';
              handleCallRecord(Phone);
            }}
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 0,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#021265',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <IconI name={'phone'} size={20} color={'#FFFFFF'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Phone
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#1939E4',
                  textDecorationLine: 'underline',
                }}>
                +91-9154867608
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {props?.route?.params?.screen == 'bluehouse' && (
        <View>
          <View
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 20,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#E6EDF7',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Icoon name={'mail-outline'} size={20} color={'#0197B2'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Email
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#1939E4',
                  textDecorationLine: 'underline',
                }}>
                Hospitality@fracspace.com
              </Text>
            </View>
          </View>

          <View
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 0,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#E6EDF7',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <IconI name={'phone'} size={20} color={'#0197B2'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Bluhous Support
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#1939E4',
                  textDecorationLine: 'underline',
                }}>
                +91 9063448266
              </Text>
            </View>
          </View>
        </View>
      )}

      {props?.route?.params?.screen == 'Lable' && (
        <View>
          <View
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 20,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#E6EDF7',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Icoon name={'mail-outline'} size={20} color={'#007549'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Email
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#007549',
                  textDecorationLine: 'underline',
                }}>
                support@fracspace.com
              </Text>
            </View>
          </View>

          <View
            style={{
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              marginVertical: 0,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              elevation: 1,
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: '#E6EDF7',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <IconI name={'phone'} size={20} color={'#007549'} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Phone
              </Text>
              <Text
                style={{
                  fontFamily: 'WorkSans-Medium',
                  fontSize: 12,
                  color: '#007549',
                  textDecorationLine: 'underline',
                }}>
                +91 9880626111
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}
