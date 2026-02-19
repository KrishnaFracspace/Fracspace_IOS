import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useState, useRef, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  LoginOTPVerification,
  LoginWithPhone,
  Registration,
  SendOTP,
  VerifyOTP,
} from './Services/UserApi';
import {CountryPicker} from 'react-native-country-codes-picker';
const {width, height} = Dimensions.get('window');
import Octicons from 'react-native-vector-icons/Octicons';
import Font from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomModal from './CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from './Context/AppContext';

export default function Signin() {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(AppContext);

  const [Email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [Name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''});
  const [PhoneVerification, setPhoneVerification] = useState(false);
  const firstInput = useRef();
  const secoundInput = useRef();
  const thirdInput = useRef();
  const fourInput = useRef();
  const fiveInput = useRef();
  const sixInput = useRef();

  const handleRegistration = async () => {
    let payload = JSON.stringify({
      userName: Name,
      phoneNumber: countryCode + Phone,
      email: Email,
    });
    try {
      let {data: res} = await Registration(payload);

      if (res?.success) {
        // if (countryCode == +1) {
        //   setModalVisible(true);
        // } else {
        //   handleOTP();
        // }
        navigation.navigate('LoginPage',{country:countryCode,phone:Phone,email:Email});
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Response errorstd:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('ErrorReg:', `${error?.message}`);
      }
    }
  };
  // const handleOTP = async () => {
  //   let payload = JSON.stringify({
  //     phoneNumber: Phone,
  //     countryCode: countryCode,
  //   });
  //   try {
  //     let {data: res} = await LoginWithPhone(payload);

  //     if (res?.success) {
  //       setModalVisible(true);
  //       //setPhoneVerification(true);
  //     }
  //   } catch (error) {
  //     if (error?.response) {
  //       Alert.alert('Response Error', `${error?.response?.data?.message}`);
  //     } else if (error?.request) {
  //       //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
  //       Alert.alert('Request error:', 'Please Check Your Internet Connection');
  //     } else {
  //       Alert.alert('Errorotp:', `${error?.message}`);
  //     }
  //   }
  // };

  // const handleLogin = async code => {
  //   let payload = JSON.stringify({
  //     phoneNumber: Phone,
  //     countryCode: countryCode,
  //     otp: code,
  //   });
  //   try {
  //     let {data: res} = await LoginOTPVerification(payload);

  //     if (res?.success) {
  //       setPhoneVerification(true);
  //       setModalVisible(false);
  //       await AsyncStorage.setItem('mytoken', res?.data);
  //       await AsyncStorage.setItem('Email', res?.email);
  //       setGlobalState(prevState => ({
  //         ...prevState,
  //         //userName: res?.userName,
  //         userEmail: res?.email,
  //         token: res?.data,
  //       }));
  //     }
  //   } catch (error) {
  //     if (error?.response) {
  //       Alert.alert('Response Error', `${error?.response?.data?.message}`);
  //     } else if (error?.request) {
  //       //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
  //       Alert.alert('Request error:', 'Please Check Your Internet Connection');
  //     } else {
  //       Alert.alert('Error:', `${error?.message}`);
  //     }
  //   }
  // };

  const handleValidate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (Name == '') {
      Alert.alert('Invalid Name', 'Please Enter Your Name.');
    } else if (!emailPattern.test(Email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    } else if (Phone == '') {
      Alert.alert('Invalid Phone', 'Please Enter Your Phone Number.');
    }
    // else if (PhoneVerification != true) {
    //   Alert.alert(
    //     'Phone Verify',
    //     'Your phone number is not verified.Please Verify your Phone number',
    //   );
    // }
    else {
      handleRegistration();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={[styles.iphone13Mini9]}>
      <View
        style={{
          height: height * 0.4,
          width: width * 0.78,
          borderRadius: (height * 0.4 + width * 0.8) / 2,
          backgroundColor: '#043862',
          opacity: 0.15,
          position: 'absolute',
          // alignItems:'stretch',
          right: -(width * 0.3),
          top: -(height * 0.2),
        }}></View>
      <View
        style={{
          alignItems: 'flex-end',
          paddingRight: 10,
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Image
          style={styles.maskGroupIconLayout}
          resizeMode="cover"
          source={require('./assets/logo_FS.png')}
        />
      </View>

      <View
        style={{
          padding: 18,
          position: 'absolute',
          marginRight: 30,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginTop: 3,
        }}>
        <View style={{paddingTop: 20}}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'OpenSans-Regular',
              color: '#1E2135',
            }}>
            Hi!
          </Text>
        </View>
        <Text
          style={{
            fontSize: 30,
            color: '#1E2135',
            fontFamily: 'OpenSans-Regular',
          }}>
          Welcome To{' '}
        </Text>

        <Text
          style={{
            color: '#043862',
            fontSize: 30,
            fontFamily: 'OpenSans-ExtraBold',
            letterSpacing: 0.1,
          }}>
          FRACSPACE{' '}
        </Text>
      </View>
      <View style={{padding: 20, paddingTop: 60}}>
        <View style={{marginVertical: 20}}>
          <View style={styles.input}>
            <View
              style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                paddingLeft: 10,
                paddingVertical: 8,
              }}>
              <Octicons name="person" size={22} color="black" />
              <TextInput
                style={{
                  width: '100%',
                  paddingLeft: 10,
                  color: '#1E2135',
                  fontFamily: 'Poppins-Regular',
                }}
                placeholder=""
                value={Name}
                onChangeText={txt => {
                  setName(txt);
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 14,
                },
              ]}>
              Your Name
            </Text>
          </View>

          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                    paddingVertical: 8,
                  }}>
                  <Font name="email" size={22} color="black" />
                  <TextInput
                    style={{
                      width: '90%',
                      paddingLeft: 10,
                      color: '#1E2135',
                      fontFamily: 'Poppins-Regular',
                    }}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    value={Email}
                    onChangeText={txt => {
                      setEmail(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 14,
                    // color: 'Red' ,
                  },
                ]}>
                Email
              </Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={styles.input}>
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    //paddingLeft: 10,
                    // paddingVertical: 8,
                  }}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={{
                      width: '25%',
                      height: 50,
                      //backgroundColor: '#C0C0C0',
                      //backgroundColor: '#043862',
                      padding: 10,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      // borderWidth:1
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        // color: '#ffff',
                        color: '#1E2135',
                        fontSize: 14,
                      }}>
                      {countryCode}
                    </Text>
                    <Icon name="caret-down" size={20} color="#1E2135" />
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      width: '64%',
                      color: '#1E2135',
                      fontFamily: 'Poppins-Regular',
                    }}
                    placeholder=""
                    value={Phone}
                    keyboardType={'numeric'}
                    maxLength={10}
                    placeholderTextColor={'#000'}
                    onChangeText={txt => {
                      setPhone(txt);
                    }}
                  />
                  {/* <TouchableOpacity
                    onPress={() => {
                      handleValidate();

                      //handlephone();
                      //setModalVisible(true);
                    }}
                    style={{
                      width: '26%',
                      height: 50,

                      padding: 10,
                      borderRadius: 10,
                      marginRight: 12,
                    }}>
                    <Text
                      style={{
                        // color: '#ffff',
                        fontFamily: 'Poppins-Medium',
                        color: PhoneVerification == true ? 'green' : 'red',
                        fontSize: 14,
                      }}>
                      {PhoneVerification == true ? 'verified' : 'verify'}
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 14,
                    // color: 'Red' ,
                  },
                ]}>
                Phone Number
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          //disabled={!PhoneVerification}
          onPress={() => {
            handleValidate();
            // navigation.navigate('Home')
            ///navigation.navigate('Home');
          }}
          style={{
            alignItems: 'center',
            // backgroundColor: '#0B0B45',
            backgroundColor: '#043862' ,
            borderRadius: 10,
            padding: 20,
            marginVertical: 8,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Register
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'OpenSans-SemiBold',
              color: '#979797',
            }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoginPage');
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'OpenSans-ExtraBold',
                color: '#1E2135',
              }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CountryPicker
        show={show}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          setCountryCode(item.dial_code);
          // console.log(item.dial_code==+1);
          setShow(false);
        }}
      />
      {/* <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalStyle={styles.customModal}>
        <View style={[styles.modal]}>
          {countryCode == +1 ? (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-SemiBold',
                color: '#043862',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {'  '}Enter Captcha Code
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-SemiBold',
                color: '#043862',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {'  '}Enter Code
            </Text>
          )}
          {countryCode == +1 ? (
            <></>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
                color: '#1E2135',
                textAlign: 'center',
                paddingTop: 10,
                marginHorizontal: 20,
              }}>
              Enter the code one time password sent to {Phone}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 20,
              //marginBottom: 10,
            }}>
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              // value={otp.charAt(0)}
              ref={firstInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                txt && secoundInput.current.focus();
                setOtp({...otp, 1: txt});
                //  setPhone(txt);
              }}
            />
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              //value={otp.charAt(1)}
              ref={secoundInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                txt ? thirdInput.current.focus() : firstInput.current.focus();
                setOtp({...otp, 2: txt});
                // setPhone(txt);
              }}
            />
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              //value={otp.charAt(2)}
              ref={thirdInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                // setPhone(txt);
                txt ? fourInput.current.focus() : secoundInput.current.focus();
                setOtp({...otp, 3: txt});
              }}
            />
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              // value={otp.charAt(3)}
              ref={fourInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                // setPhone(txt);\
                txt ? fiveInput.current.focus() : thirdInput.current.focus();
                setOtp({...otp, 4: txt});
                //setOtp(otp + txt);
              }}
            />
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              // value={otp.charAt(4)}
              ref={fiveInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                txt ? sixInput.current.focus() : fourInput.current.focus();
                setOtp({...otp, 5: txt});
              }}
            />
            <TextInput
              style={{
                height: 35,
                color: '#1E2135',
                borderWidth: 2,
                borderColor: '#043862',
                borderRadius: 5,
                alignItems: 'center',
                padding: 10,
              }}
              placeholder=""
              ref={sixInput}
              maxLength={1}
              keyboardType={'numeric'}
              placeholderTextColor={'#000'}
              onChangeText={txt => {
                !txt && fiveInput.current.focus();
                setOtp({...otp, 6: txt});
              }}
            />
          </View>
          {countryCode == +1 ? (
            <Image
              style={{width: width, height: 50, marginBottom: 30}}
              resizeMode="cover"
              source={require('./assets/988907.png')}
            />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}>
              <Text></Text>
              <TouchableOpacity
                onPress={() => {
                  handleOTP();
                }}>
                <Text
                  style={{
                    color: '#043862',
                    fontSize: 12,
                    fontFamily: 'OpenSans-SemiBold',
                  }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              const code =
                otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6];
              //handleVerifyOtp(code);
              handleLogin(code);
            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#043862',
              borderRadius: 12,
              marginHorizontal: 20,
              padding: 20,
              marginBottom: 50,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'OpenSans-SemiBold',
              }}>
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </CustomModal> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    // overflow: 'hidden',
    //width: '100%',
    // borderColor:'red',
    // borderWidth:3
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    paddingHorizontal: 8,
    backgroundColor: '#f5f7fe',
  },
  label: {
    fontSize: 12,

    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    flex: 1,
    width: width * 0.3,
    height: height * 0.16,
    overflow: 'visible',
  },
  modal: {
    width: '100%',
    alignSelf: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: 'white',
  },
});
