import { View, Alert, BackHandler, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { GetLogin, GetOtpForLoginWithNumber, OtpLoginWithEmail, verifyOtpLogin } from '../Services/UserApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/AppContext'
import { trackLogin } from '../utils/analytics';
import useOtpAutofill, { OTP_LENGTH } from '../utils/useOtpAutofill';
import { AuthScreen, BackButton, CountryCode, Field, GoldButton, Heading, OtpBoxes, Pane, Swap } from './Auth/AuthUI';

export default function NewLogin() {
  const navigation = useNavigation();
  const { globalState, setGlobalState } = useContext(AppContext);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India', flag: '🇮🇳' });
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
        // Standard Firebase "login" event; never send the email (GA terms).
        trackLogin('phone_otp');
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
        trackLogin('email_otp');
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
  const goToSignup = () => {
    const redirect = route.params?.redirectAfterLogin;
    if (redirect) {
      navigation.navigate('NewSigin', {
        redirectAfterLogin: redirect,   // Pass deep link data to Sign-up too
      });
    } else {
      navigation.navigate('NewSigin');
    }
  };

  const sendOtp = () =>
    selectedCode.code === '+91' ? handleLogin() : handleLoginWithEmail();

  return (
    <AuthScreen>
      {visible1 &&
        <Pane key="login">
          <Heading eyebrow="WELCOME BACK" title={'Own extraordinary\nplaces, together.'} />
          <Field
            style={styles.firstField}
            leading={<CountryCode flag={selectedCode.flag} code={selectedCode.code} onPress={() => setShowPicker(true)} />}
            placeholder="Phone number"
            accessibilityLabel="Phone number"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            textContentType="telephoneNumber"
            autoComplete="tel"
          />
          {selectedCode.code !== '+91' &&
            <Field
              placeholder="Email address"
              accessibilityLabel="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          }
          <GoldButton
            label="Get OTP"
            off={phone === ''}
            onPress={() => {
              if (phone === '') {
                Alert.alert('Oops! You missed the phone number.');
                return;
              }
              sendOtp();
            }}
          />
          <Swap text="Don’t have an account?" action="Sign up" onPress={goToSignup} />
        </Pane>
      }

      {visible2 &&
        <Pane key="otp">
          <View style={styles.otpHead}>
            <BackButton
              label="Change number"
              onPress={() => {
                resetOtp();
                setVisible1(true);
                setVisible2(false);
              }}
            />
            <Heading
              eyebrow="VERIFY"
              title="Enter the code"
              titleTop={6}
              sub={`Sent to ${selectedCode.code === '+91' ? `${selectedCode.code} ${phone}` : email}`}
            />
          </View>
          <OtpBoxes
            digits={otpDigits}
            inputRefs={inputRefs}
            maxLength={OTP_LENGTH}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <GoldButton
            label={submitting ? 'Verifying…' : 'Verify & continue'}
            busy={submitting}
            off={otpDigits.join('').length < OTP_LENGTH}
            disabled={submitting}
            onPress={submitOtp}
          />
          <Swap
            text="Didn’t get it?"
            action="Resend code"
            onPress={() => {
              resetOtp();
              sendOtp();
            }}
          />
        </Pane>
      }

      <CountryPicker
        show={showPicker}
        pickerButtonOnPress={(item) => {
          setSelectedCode({ code: item.dial_code, name: item.name, flag: item.flag });
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
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  firstField: { marginTop: 6 },
  otpHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
});
