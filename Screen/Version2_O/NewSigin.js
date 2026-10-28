import React, { useContext, useState } from 'react';
import {
  View,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import {
  GetLogin,
  GetOtpForLoginWithNumber,
  GetRegistration,
  OtpLoginWithEmail,
  verifyOtpLogin,
} from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { trackSignUp } from '../utils/analytics';
import useOtpAutofill, { OTP_LENGTH } from '../utils/useOtpAutofill';
import { AuthScreen, BackButton, CountryCode, Field, GoldButton, Heading, OtpBoxes, Pane, Swap } from './Auth/AuthUI';

export default function NewSigin() {
  const navigation = useNavigation();
  const { setGlobalState } = useContext(AppContext);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India', flag: '🇮🇳' });
  const route = useRoute();
  // Fills the code from the SMS (Android) / keyboard suggestion (iOS) and
  // submits as soon as all 6 digits are in.
  const { otpDigits, inputRefs, handleChange, handleKeyPress, resetOtp, submitOtp, submitting } = useOtpAutofill({
    listenForSms: visible2 && selectedCode.code === '+91',
    onComplete: () => handleOTPLogin(),
  });

  const handleRegister = async () => {
    if (!phone || !name || !email) {
      Alert.alert('Oops!', 'You missed some details.');
      return;
    }
    try {
      const payload = {
        userName: name,
        phoneNumber: selectedCode.code + phone,
        email,
        countryCode: selectedCode.code,
      };
      const { data: res } = await GetRegistration(payload);
      if (res?.success) {
        if (selectedCode.code === '+91') {
          await handleLogin();
        } else {
          await handleLoginWithEmail();
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong'
      );
    }
  };

  const handleLogin = async () => {
    try {
      const { data: res } = await GetLogin({
        phoneNumber: phone,
        smsCountry: true,
      });
      if (res?.success) {
        setVisible1(false);
        setVisible2(true);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Network error'
      );
    }
  };

  const handleLoginWithEmail = async () => {
    try {
      const { data: res } = await OtpLoginWithEmail({ email });
      if (res?.success) {
        setVisible1(false);
        setVisible2(true);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Network error'
      );
    }
  };
const handleOTPLogin = async () => {
  const otp = otpDigits.join('');

  if (otp.length !== 6) {
    Alert.alert('Invalid OTP', 'Enter 6 digit OTP');
    return;
  }

  try {
    let response;

    if (selectedCode.code === '+91') {
      response = await GetOtpForLoginWithNumber({
        phoneNumber: phone,
        otp,
        smsCountry: true,
      });
    } else {
      response = await verifyOtpLogin({
        email,
        otp,
      });
    }

    if (response?.data?.success) {
      const token = response.data.data;
      console.log('[OTP Login Success] Token received:', token);

      // Save auth data
      await AsyncStorage.setItem('mytoken', token);
      await AsyncStorage.setItem('Email', email);

      // Standard Firebase "sign_up" event (never the email: GA terms). The
      // helper can't throw, so analytics can't fail a signup.
      trackSignUp(selectedCode.code === '+91' ? 'phone_otp' : 'email_otp');

      setGlobalState(prev => ({
        ...prev,
        token,
        userEmail: email,
        userName: response.data.userName,
      }));

      console.log('[OTP Login Success] Auth data saved', token);

      // ==================== DEEP LINK REDIRECT LOGIC ====================
      let targetRoute = { name: 'BottomNavigations' };

      // Priority 1: route params, forwarded from NewLogin when the user
      // arrived on a deep link and chose to sign up instead.
      const redirectFromParams = route?.params?.redirectAfterLogin;

      // Priority 2: stored pendingDeepLink (deferred links / first launch)
      const pendingJson = await AsyncStorage.getItem('pendingDeepLink');

      if (redirectFromParams?.screen) {
        targetRoute = {
          name: redirectFromParams.screen,
          params: redirectFromParams.params || {},
        };
        console.log('[Signup Success] Using redirect from params:', redirectFromParams.screen);
        await AsyncStorage.removeItem('pendingDeepLink'); // Clean up
      } else if (pendingJson) {
        try {
          const pending = JSON.parse(pendingJson);
          if (pending?.screen) {
            targetRoute = {
              name: pending.screen,
              params: pending.params || {},
            };
            console.log('[Signup Success] Redirecting to pending deep link:', pending.screen);
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
    }
  } catch (error) {
    Alert.alert(
      'Error',
      error?.response?.data?.message || 'Invalid OTP'
    );
  }
};

  const goToLogin = () => {
    const redirect = route.params?.redirectAfterLogin;
    if (redirect) {
      navigation.navigate('NewLogin', {
        redirectAfterLogin: redirect,   // Pass deep link data to Login too
      });
    } else {
      navigation.navigate('NewLogin');
    }
  };

  return (
    <AuthScreen>
      {visible1 && (
        <Pane key="signup" gap={12}>
          <Heading eyebrow="CREATE ACCOUNT" title={'Start your\nco-ownership journey.'} />
          <Field
            style={styles.firstField}
            placeholder="Full name"
            accessibilityLabel="Full name"
            autoComplete="name"
            textContentType="name"
            value={name}
            onChangeText={setName}
          />
          <Field
            leading={
              <CountryCode
                flag={selectedCode.flag}
                code={selectedCode.code}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowPicker(true);
                }}
              />
            }
            placeholder="Phone number"
            accessibilityLabel="Phone number"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            textContentType="telephoneNumber"
            autoComplete="tel"
          />
          <Field
            placeholder="Email address"
            accessibilityLabel="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
          />
          <GoldButton
            label="Register"
            off={!phone || !name || !email}
            onPress={handleRegister}
            style={styles.register}
          />
          <Swap text="Already have an account?" action="Log in" onPress={goToLogin} />
        </Pane>
      )}

      {visible2 && (
        <Pane key="otp">
          <View style={styles.otpHead}>
            <BackButton
              label="Change details"
              onPress={() => {
                resetOtp();
                setVisible2(false);
                setVisible1(true);
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
              if (selectedCode.code === '+91') {
                handleLogin();
              } else {
                handleLoginWithEmail();
              }
            }}
          />
        </Pane>
      )}

      <CountryPicker
        enableModalAvoiding={false}
        disableBackdrop={false}
        style={{
          modal: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
            maxHeight: '70%',
          },
          itemsList: { maxHeight: 400 },
        }}
        show={showPicker}
        pickerButtonOnPress={(item) => {
          setSelectedCode({
            code: item.dial_code,
            name: item.name,
            flag: item.flag,
          });
          setShowPicker(false);
        }}
        onBackdropPress={() => setShowPicker(false)}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  firstField: { marginTop: 6 },
  register: { marginTop: 4 },
  otpHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
});
