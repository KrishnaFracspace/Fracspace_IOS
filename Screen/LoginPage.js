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
  ActivityIndicator
} from 'react-native';
import {useState, useContext, useRef, useEffect} from 'react';
import {FontFamily, Color, FontSize, Padding, Border} from './GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from './Context/AppContext';
import {
  Login,
  LoginOTPVerification,
  LoginOTPVerificationEamil,
  LoginWithEmail,
  LoginWithPhone,
  Lokk,
} from './Services/UserApi';
const {width, height} = Dimensions.get('window');
//import Octicons from 'react-native-vector-icons/Fontisto';
import Font from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CountryPicker} from 'react-native-country-codes-picker';

export default function LoginPage(props) {
  const {globalState, setGlobalState} = useContext(AppContext);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  const [Phone, setPhone] = useState(props?.route?.params?.phone||'');
  const [countryCode, setCountryCode] = useState(props?.route?.params?.country||"+91");
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''});
  const [PhoneVerification, setPhoneVerification] = useState(false);
  const [show, setShow] = useState(false);
  const firstInput = useRef();
  const secoundInput = useRef();
  const thirdInput = useRef();
  const fourInput = useRef();
  const fiveInput = useRef();
  const sixInput = useRef();
  const [Email, setEmail] = useState(props?.route?.params?.email||'');
  const handleOTP = async () => {
    let payload = JSON.stringify({
      phoneNumber: countryCode+Phone,
      countryCode: countryCode,
    });
    try {
      let {data: res} = await LoginWithPhone(payload);

      if (res?.success) {
        setLoader(false);
        setPhoneVerification(true);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
        setLoader(false);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
       // Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
        setLoader(false);
      }
    }
  };
  const handleOTPEmail = async () => {
    let payload = JSON.stringify({
      email: Email,
      //countryCode: countryCode,
    });
   // console.log(payload);
    try {
      let {data: res} = await LoginWithEmail(payload);

      if (res?.success) {
        setLoader(false);
        setPhoneVerification(true);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
        setLoader(false);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
      Alert.alert('Request error:', 'Please Check Your Internet Connection');
        setLoader(false);
      } else {
        Alert.alert('Error:', `${error?.message}`);
        setLoader(false);
      }
    }
  };
  const handleLoginEmail = async () => {
    setLoader(true);
    let payload = JSON.stringify({
      //phoneNumber: countryCode + Phone,
      email:Email,
      //countryCode: countryCode,
      otp: otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6],
    });
  //  console.log(payload);
    try {
      let {data: res} = await LoginOTPVerificationEamil(payload);
   //console.log(res);
      if (res?.success) {
        //setPhoneVerification(true);
        await AsyncStorage.setItem('mytoken', res?.data);
        await AsyncStorage.setItem('Email', Email );
        setGlobalState(prevState => ({
          ...prevState,
          //userName: res?.userName,
          userEmail: Email,
          token: res?.data,
        }));
        setLoader(false);
        navigation.navigate('HomePage');
      }
    } catch (error) {
      if (error?.response) {
        console.log(error?.response?.data);
        Alert.alert('Response Errorhhhhh', `${error?.response?.data?.message}`);
        setLoader(false);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
       // Alert.alert('Request error:', 'Please Check Your Internet Connection');
        setLoader(false);
      } else {
        Alert.alert('Error:', `${error?.message}`);
        setLoader(false);
      }
    }
  };
  const handleLogin = async () => {
    setLoader(true);
    let payload = JSON.stringify({
      phoneNumber: countryCode+Phone,
      countryCode: countryCode,
      otp: otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6],
    });
    try {
      let {data: res} = await LoginOTPVerification(payload);

      if (res?.success) {
       console.log('login', res);
        //setPhoneVerification(true);
        await AsyncStorage.setItem('mytoken', res?.data);
        await AsyncStorage.setItem('Email', res?.email);
        setGlobalState(prevState => ({
          ...prevState,
          //userName: res?.userName,
          userEmail: res?.email,
          token: res?.data,
        }));
        setLoader(false);
        navigation.navigate('HomePage');
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
       // Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  useEffect(() => {
    setPhoneVerification(false);
    if(props?.route?.params?.country){
      setCountryCode(props?.route?.params?.country)
      }
  }, []);

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
          // borderColor:'red',borderWidth:3
        }}></View>
      <View
        style={{
          alignItems: 'flex-end',
          paddingRight: 10,
          justifyContent: 'center',
          marginTop:10,
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
          marginTop:3,
        }}>
        <View style={{paddingTop: 20, flex: 1, width: '100%'}}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'OpenSans-Regular',
              color: '#1E2135',
            }}>
            Hi!
          </Text>

          <Text
            style={{
              fontSize: 30,
              color: '#1E2135',
              fontFamily: 'OpenSans-Regular',
            }}>
            Welcome To{' '}
          </Text>
        </View>
        {/* <Text style={{fontSize: 40, fontWeight: '400', color: '#000000',fontFamily: 'Poppins_400Regular',}}>
          Welcome To
        </Text> */}

        <Text
          style={{
            color: '#043862',
            fontSize: 30,
            fontFamily: 'OpenSans-ExtraBold',
            letterSpacing: 0.1,
          }}>
          FRACSPACE{' '}
        </Text>

        <View style={{marginTop: 50, paddingRight: 20, flex: 1}}>
          {!PhoneVerification && (
            <View>
              <View style={styles.input}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingLeft: 10,
                    paddingVertical: 8,
                  }}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={{
                      width: '20%',
                      // height: 50,
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
                      width: '66%',
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
                  <View style={{width: '20%'}}>
                    <Text></Text>
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
                    },
                  ]}>
                  Phone Number
                </Text>
              </View>
              {countryCode!='+91' &&  
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
                    paddingVertical: 15,
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
                    fontSize: 16,
                    // color: 'Red' ,
                  },
                ]}>
                Email
              </Text>
            </View>
          </View>}
            </View>
          )}

          {PhoneVerification && (
            <View style={[styles.modal]}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                  color: '#1E2135',
                  //textAlign: 'center',
                  // paddingTop: 10,
                  marginHorizontal: 0,
                }}>
                Enter the code one time password sent to {countryCode=='+91'?Phone:Email}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingVertical: 20,
                  marginBottom: 10,
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
                    txt
                      ? thirdInput.current.focus()
                      : firstInput.current.focus();
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
                    txt
                      ? fourInput.current.focus()
                      : secoundInput.current.focus();
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
                    txt
                      ? fiveInput.current.focus()
                      : thirdInput.current.focus();
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
             <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text></Text>
                <TouchableOpacity
                  onPress={() => {
                    if(countryCode=='+91'){
                      //setLoader(true);
                      handleOTP();
                      }else{
                        //setLoader(true);
                        handleOTPEmail();
                      }
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
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            //handleValidate();
            if (PhoneVerification) {
              if(countryCode=='+91'){
                handleLogin();
                }else{
                  handleLoginEmail();
  
                }
            } else {
              if(countryCode=='+91'){
                setLoader(true);
                handleOTP();
                }else{
                  setLoader(true);
                  handleOTPEmail();
                }
            }
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#043862',
            borderRadius: 12,
            padding: 20,

            marginTop: 30,
            width: '100%',
          }}>
          <Text
            style={{color: 'white', fontSize: 16, fontFamily: 'OpenSans-Bold'}}>
            {PhoneVerification ? 
              loader == true ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) :<Text style={{fontFamily:'Poppins-Bold',fontSize:14,color:'#ffffff'}}>Login</Text>: loader == true ? ( <ActivityIndicator size="small" color="#ffffff" />
            ) :<Text style={{fontFamily:'Poppins-Bold',fontSize:14,color:'#ffffff'}}>Get OTP</Text>}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            width: '100%',
            marginTop: 30,
          }}>
          <View
            style={{
              borderBottomWidth: 2,
              width: '35%',
              borderBottomColor: '#DADADA',
            }}></View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'OpenSans-SemiBold',
              color: '#808080',
            }}>
            Or Sign up with
          </Text>
          <View
            style={{
              borderBottomWidth: 2,
              width: '35%',
              borderBottomColor: '#DADADA',
            }}></View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            marginTop: 10,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'OpenSans-SemiBold',
              color: '#808080',
            }}>
            Don't have an account yet ?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signin');
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'OpenSans-ExtraBold',
                color: '#1E2135',
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CountryPicker
        show={show}
        pickerButtonOnPress={item => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
  },
  labelContainer: {
    position: 'absolute',
    left: 16,
    top: -6,
    paddingHorizontal: 8,
    backgroundColor: '#f5f7fe',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E2135',

    // color: 'black'
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Barlow-Medium',
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
  },
});
