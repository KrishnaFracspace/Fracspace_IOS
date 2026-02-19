import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import {
  GetLogin,
  GetOtpForLoginWithNumber,
  GetRegistration,
  OtpLoginWithEmail,
  verifyOtpLogin,
} from '../Services/UserApi';

import { AppContext } from '../Context/AppContext';

export default function NewSigin() {
  const navigation = useNavigation();
  const { setGlobalState } = useContext(AppContext);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
const route = useRoute();

  const handleChange = (text, index) => {
    const updated = [...otpDigits];
    updated[index] = text.replace(/[^0-9]/g, '');
    setOtpDigits(updated);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  await AsyncStorage.setItem('mytoken', token);
  await AsyncStorage.setItem('Email', email);

  setGlobalState(prev => ({
    ...prev,
    token,
    userEmail: email,
    userName: response.data.userName,
  }));

  const pendingJson = await AsyncStorage.getItem('pendingDeepLink');
  const redirect = route?.params?.redirectAfterLogin;

    if (!redirect && pendingJson) {
    redirect = JSON.parse(pendingJson);
    await AsyncStorage.removeItem('pendingDeepLink');
  }

  if (redirect) {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'BottomNavigations' },
        {
          name: redirect.screen,
          params: redirect.params,
        },
      ],
    });
  } else {
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomNavigations' }],
    });
  }
}
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Invalid OTP'
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{paddingTop:70 }}
        >
          <View style={{ backgroundColor: '#E8E8E8', flex: 1 }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                flex: 1,
                paddingBottom: 40,
                
              }}
            >

              {visible1 && (
                <View style={{ padding: 20 }}>

                  <View style={{ paddingTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('NewLogin')}
                      style={{
                        backgroundColor: '#EFF3F9',
                        padding: 7,
                        borderRadius: 5,
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Icon name="arrowleft" size={20} color="#160D1F" />
                    </TouchableOpacity>
                  </View>

                  <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 40,fontFamily: 'Montserrat-SemiBold', }}>
                    Welcome to FRACSPACE
                  </Text>

                  <View style={{ marginTop: 30 }}>
                    <Text style={styles.title}>Your Name</Text>
                    <TextInput
                      placeholder="Enter your name"
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                      placeholderTextColor={'#B2B8BD'}
                    />
                  </View>

                  <View style={{ marginTop: 15 }}>
                    <Text style={styles.title}>Email</Text>
                    <TextInput
                      placeholder="Enter your email"
                        placeholderTextColor={'#B2B8BD'}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      style={styles.input}
                    />
                  </View>

                  <View style={{ marginTop: 15 }}>
                    <Text style={styles.title}>Phone Number</Text>
                    <View style={styles.phoneContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          Keyboard.dismiss();
                          setShowPicker(true);
                        }}
                      >
                        <Text style={styles.title}>{selectedCode.code} ▼</Text>
                      </TouchableOpacity>

                      <TextInput
                        placeholder="Enter number"
                        placeholderTextColor={'#B2B8BD'}
                        keyboardType="numeric"
                        maxLength={10}
                        value={phone}
                        onChangeText={setPhone}
                        style={{ flex: 1, marginLeft: 10,fontFamily: 'Montserrat-SemiBold', }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600',fontFamily: 'Montserrat-SemiBold', }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

                <TouchableOpacity onPress={() => {
                  navigation.navigate('NewLogin');
                }} style={{ alignSelf: 'center', marginTop: 40 }}>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>
                    Already have an account? <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000000' }}> Sign in</Text>
                  </Text>
                </TouchableOpacity>
              {visible2 && (
                <View style={{ padding: 20 }}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      setVisible2(false);
                      setVisible1(true);
                    }}
                  >
                    <Icon name="arrowleft" size={22} />
                  </TouchableOpacity> */}

                  <View style={{ paddingTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setVisible2(false);
                        setVisible1(true);
                      }}
                      style={{
                        backgroundColor: '#EFF3F9',
                        padding: 7,
                        borderRadius: 5,
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Icon name="arrowleft" size={20} color="#160D1F" />
                    </TouchableOpacity>
                  </View>


                  <Text style={{ marginTop: 30 }}>
                    Enter OTP sent to{' '}
                    {selectedCode.code === '+91' ? phone : email}
                  </Text>

                  <View style={styles.otpRow}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <TextInput
                        key={i}
                        ref={(ref) => (inputRefs.current[i] = ref)}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={otpDigits[i]}
                        onChangeText={(text) => handleChange(text, i)}
                        onKeyPress={(e) => handleKeyPress(e, i)}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleOTPLogin}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <CountryPicker
       enableModalAvoiding={false}           // ← disable keyboard avoiding in modal
  disableBackdrop={false}               // keep backdrop so user knows it's modal
  style={{
    modal: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 10,
      maxHeight: '70%',               // ← limit height so it doesn't feel too intrusive
    },
    itemsList: { maxHeight: 400 },
  }}
          show={showPicker}
          pickerButtonOnPress={(item) => {
            setSelectedCode({
              code: item.dial_code,
              name: item.name,
            });
            setShowPicker(false);
          }}
          onBackdropPress={() => setShowPicker(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#E1E6EB',
    borderRadius: 11,
    padding: 15,
    marginTop: 8,
    fontWeight:'600',
    fontFamily: 'Montserrat-SemiBold',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E6EB',
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#0F1130',
    padding: 15,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 25,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#E1E6EB',
    borderRadius: 10,
    width: 45,
    height: 55,
    textAlign: 'center',
    fontSize: 18,
  },
  title:{
    fontWeight:'600',
    fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F'
  }
};
