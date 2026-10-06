import { View, Text, TextInput, Image, TouchableOpacity, Alert, BackHandler, Platform } from 'react-native'

// Android TextInput adds its own vertical/font padding on top of ours; strip it
// so inputs match the iOS size.
const androidInputReset = Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' } : null;
import React, { useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import Ico from 'react-native-vector-icons/Ionicons'
import Ic from 'react-native-vector-icons/AntDesign'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { GetLogin, GetOtpForLoginWithNumber, OtpLoginWithEmail, verifyOtpLogin } from '../Services/UserApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/AppContext'
import { SafeAreaView } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';
import useOtpAutofill, { OTP_LENGTH } from '../utils/useOtpAutofill';

export default function NewLogin() {
  const navigation = useNavigation();
  const { globalState, setGlobalState } = useContext(AppContext);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India' });
  const route = useRoute();

  // Indian numbers get the OTP by SMS; other countries by email.
  const verifyOtp = () =>
    selectedCode.code === '+91' ? handleOTPLogin() : handleOtpLoginWithEmail();
  // Fills the code from the SMS (Android) / keyboard suggestion (iOS) and
  // submits as soon as all 6 digits are in; submitOtp sends one request at a time.
  const { otpDigits, inputRefs, handleChange, handleKeyPress, resetOtp, submitOtp, submitting } = useOtpAutofill({
    listenForSms: visible2 && selectedCode.code === '+91',
    onComplete: verifyOtp,
  });

const handleLoginSuccess = async (resData, fallbackPhone) => {
  // console.log("Res dTA: ", resData);
  try {
    // Save auth data
    await AsyncStorage.setItem('mytoken', resData?.data);
    await AsyncStorage.setItem('Email', resData?.email);

    setGlobalState((prevState) => ({
      ...prevState,
      userName: resData?.userName,
      userEmail: resData?.email,
      userPhone: resData?.phoneNumber || fallbackPhone,
      token: resData?.data,
    }));

    console.log('[Login Success] Auth data saved successfully', resData?.data);

    // ==================== DEEP LINK REDIRECT LOGIC ====================
    let targetRoute = { name: 'BottomNavigations' };

    // Priority 1: Check route params (from navigate('NewLogin', { redirectAfterLogin }))
    const redirectFromParams = route?.params?.redirectAfterLogin;

    // Priority 2: Check stored pendingDeepLink (for deferred deep links / first launch)
    const pendingJson = await AsyncStorage.getItem('pendingDeepLink');

    if (redirectFromParams) {
      targetRoute = {
        name: redirectFromParams.screen,
        params: redirectFromParams.params || {},
      };
      console.log('[Login Success] Using redirect from params:', redirectFromParams.screen);
      await AsyncStorage.removeItem('pendingDeepLink'); // Clean up
    } 
    else if (pendingJson) {
      try {
        const pending = JSON.parse(pendingJson);
        if (pending?.screen) {
          targetRoute = {
            name: pending.screen,
            params: pending.params || {},
          };
          console.log('[Login Success] Using pending deep link:', pending.screen);
        }
        await AsyncStorage.removeItem('pendingDeepLink'); // Clean up
      } catch (e) {
        console.warn('Invalid pending deep link JSON', e);
      }
    }

    // Final Navigation Reset (don't stack a second BottomNavigations when there is no deep link)
    const routes =
      targetRoute.name === 'BottomNavigations'
        ? [targetRoute]
        : [{ name: 'BottomNavigations' }, targetRoute];
    navigation.reset({
      index: routes.length - 1,
      routes,
    });
  } catch (error) {
    console.error('Error in handleLoginSuccess:', error);
    // Fallback navigation
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomNavigations' }],
    });
  }
};


  const handleOTPLogin = async () => {
    const otp = otpDigits.join('');
    const payload = JSON.stringify(
      {
        phoneNumber: selectedCode?.code + phone,
        otp: otp,
        smsCountry: true
      }
    );

    try {
      let { data: res } = await GetOtpForLoginWithNumber(payload);
      if (res?.success) {
        analytics().logEvent('user_login_indian', {
          user_id: res?.email
        });
        await handleLoginSuccess(res, selectedCode?.code + phone);
      }
    } catch (error) {
      if (error?.response) {
        console.error('Response Error', `${error?.response?.data?.message}`);
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleLogin = async () => {
    const payload = JSON.stringify({
      phoneNumber: selectedCode?.code + phone,
      smsCountry: true
    });
    try {
      const { data: res } = await GetLogin(payload);
      if (res?.success) {
        setVisible2(true);
        setVisible1(false);
      }
    } catch (error) {
      if (error?.response) {
        if (error.response.status == 401) {
          Alert.alert('User not found!', "You're not registered yet. Sign up now.");
          // You can show this in a toast, alert, etc.
        } else {
          console.error('API error:', error.response.data);
        }
        console.log('like', `${JSON.stringify(error?.response)}`);
      } else if (error?.request) {
        Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleLoginWithEmail = async () => {
    let payload = JSON.stringify(
      {
        email: email
      });
    try {
      let { data: res } = await OtpLoginWithEmail(payload);
      if (res?.success) {
        setVisible2(true);
        setVisible1(false);
      }
    } catch (error) {
      if (error?.response) {
        if (error.response.status == 401) {
          Alert.alert('User not found!', "You're not registered yet. Sign up now.");
        } else {
          console.error('API error:', error.response.data);
        }
        console.log('like', `${JSON.stringify(error?.response)}`);
      } else if (error?.request) {
        Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  }

  const handleOtpLoginWithEmail = async () => {
    const otp = otpDigits.join('');
    let payload = JSON.stringify({
      email: email,
      otp: otp
    });
    try {
      let { data: res } = await verifyOtpLogin(payload);
      //  console.log(res,"========data==67")
      if (res?.success) {
        analytics().logEvent('user_login_international', {
          user_id: res?.email
        });
        await handleLoginSuccess(res, selectedCode?.code + phone);
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
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      // RN 0.77+ removed BackHandler.removeEventListener; remove via the subscription.
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <View style={{ backgroundColor: '#E8E8E8', paddingTop: '20%', flex: 1 }}>
        <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, flex: 1, borderTopRightRadius: 30 }}>
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 23, color: '#160D1F' }}>Sign in</Text>
            <TouchableOpacity
           
              onPress={() => {
    const redirect = route.params?.redirectAfterLogin;
    if (redirect) {
      navigation.navigate('NewSigin', {
        redirectAfterLogin: redirect,   // Pass deep link data to Login too
      });
    } else {
      navigation.navigate('NewSigin');
    }
  }}
               style={{ backgroundColor: '#EFF3F9', padding: 5, borderRadius: 5 }}>
              <Icon name={'cross'} size={20} color={'#160D1F'} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 20 }}>
            {visible1 &&
              <View>
                <View>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Phone Number</Text>
                  <View style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      onPress={() => setShowPicker(true)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>
                        {selectedCode.code}
                      </Text>
                      <Ic name={'caretdown'} size={10} color={'#000000'} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <TextInput
                        placeholder='Enter your Number'
                        placeholderTextColor={'#B2B8BD'}
                        style={[{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#160D1F', paddingVertical: Platform.OS === 'android' ? 12 : 15 }, androidInputReset]}
                        keyboardType='number-pad'
                        maxLength={10}
                        value={phone}
                        onChangeText={setPhone}
                      />
                    </View>
                  </View>
                </View>

                {selectedCode.code !== '+91' &&
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Email</Text>
                    <View style={{ borderColor: '#E1E8EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginTop: 10 }}>
                      <TextInput
                        placeholder='Enter your email'
                        placeholderTextColor={'#B2B8BD'}
                        style={[{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#160D1F', paddingVertical: Platform.OS === 'android' ? 12 : 15 }, androidInputReset]}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>
                }

                <CountryPicker
                  show={showPicker}
                  pickerButtonOnPress={(item) => {
                    setSelectedCode({ code: item.dial_code, name: item.name });
                    setShowPicker(false);
                  }}
                  onBackdropPress={() => setShowPicker(false)}
                  style={{
                    modal: { height: 400 },
                    countryName: { color: '#000000' },
                    dialCode: { color: '#000000' },
                    flag: { color: '#000000' },
                    textInput: { color: '#000000' }
                  }}
                />

                <TouchableOpacity onPress={() => {
                  if (phone === '') {
                    Alert.alert('Oops! You missed the phone number.');
                    return;
                  }

                  if (selectedCode.code === '+91') {
                    handleLogin();
                  } else {
                    handleLoginWithEmail();
                  }
                }} style={{ backgroundColor: '#EFF3F9', padding: 13, borderRadius: 11, alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#160D1F' }}>Get OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  const redirect = route.params?.redirectAfterLogin;
                  console.log(redirect, "=====redi-====")
                  if (redirect) {
                    navigation.navigate('NewSigin', {
                      redirectAfterLogin: route?.params?.redirectAfterLogin,
                    });
                  } else {
                    navigation.navigate('NewSigin');
                  }

                }} style={{ alignSelf: 'center', marginTop: 40 }}>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>
                    Don't have an account yet? <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000000' }}> Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            }

            {visible2 &&
              <>
                <View style={{ alignSelf: 'flex-start' }}>
                  <TouchableOpacity onPress={() => {
                    resetOtp();
                    setVisible1(true);
                    setVisible2(false);
                  }} style={{ backgroundColor: '#EFF3F9', padding: 7, borderRadius: 5 }}>
                    <Ic name={'arrowleft'} size={20} color={'#160D1F'} />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 18, color: '#8E9398' }}>
                      Please enter the code we sent to {' '}
                      <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 18, color: '#272A2B' }}>
                        {selectedCode.code === '+91' ?
                          `${phone}` : `${email}`
                        }
                      </Text>
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 40, width: '100%' }}>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <View
                        key={index}
                        style={[
                          { borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 },
                          // Android: fixed, equal box size (empty and filled boxes otherwise differ in width)
                          Platform.OS === 'android' && { width: 46, paddingHorizontal: 0, alignItems: 'center' },
                        ]}
                      >
                        {/* <TextInput
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#000000', textAlign: 'center', padding: 10 }}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={otpDigits[index]}
                          textContentType="oneTimeCode"
                          autoComplete="sms-otp"
                          importantForAutofill="yes"
                          onChangeText={(text) => handleChange(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        /> */}
                        <TextInput
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          style={[
                            {
                              fontFamily: 'WorkSans-Medium',
                              fontSize: 20,
                              color: '#000000',
                              textAlign: 'center',
                              padding: 10,
                            },
                            Platform.OS === 'android' && { width: 46, height: 44, padding: 0 },
                            androidInputReset,
                          ]}
                          keyboardType="number-pad"
                          maxLength={OTP_LENGTH}
                          value={otpDigits[index]}
                          textContentType="oneTimeCode"
                          autoComplete="sms-otp"
                          onChangeText={(text) => handleChange(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                        <View style={{ borderTopColor: '#8E9398', borderTopWidth: 1, marginBottom: 10 }}></View>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity onPress={submitOtp} disabled={submitting} style={{ backgroundColor: '#0F1130', padding: 12, alignItems: 'center', borderRadius: 10, marginTop: 40, opacity: submitting ? 0.6 : 1 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20, color: '#FFFFFF' }}>Continue</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    resetOtp();
                    if (selectedCode.code === '+91') {
                      handleLogin();
                    } else {
                      handleLoginWithEmail();
                    }
                  }} style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>Didn’t get ?{' '}
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#272A2B', textDecorationLine: 'underline' }}>Send me a new OTP</Text></Text>
                  </TouchableOpacity>
                </View>
              </>
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
