import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Entypo';
import Ic from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
//import { GetWalletInfo, GetWalletTransaction, RequestForWithdrawal, SendOtpForVerification, UploadBankData, VerifyOtp } from './PortfolioApi';
import {Dropdown} from 'react-native-element-dropdown';
import {AppContext} from '../Context/AppContext';
import {
  GetWalletInfo,
  GetWalletTransaction,
  RequestForWithdrawal,
  SendOtpForVerification,
  UploadBankData,
  VerifyOtp,
} from '../Services/UserApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomModal from '../CustomModal';
import WalletAnimation from '../components/WalletImg';
export default function WalletAmount() {
  const {globalState, setGlobalState} = useContext(AppContext);
  // console.log(globalState?.userPhone);
  const [email, setEmail] = useState(globalState?.userEmail);
  const [walletInfo, setWalletInfo] = useState([]);
  const [payment, setPayment] = useState('Upcoming Payouts');
  const [choosePayment, setChoosePayment] = useState(false);
  const [chooseAmount, setChooseAmount] = useState(false);
  const [amount, setAmount] = useState('');
  const [otpScreen, setOtpScreen] = useState(false);
  const [bankDetails, setBankDetails] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const navigation = useNavigation();
  const {width} = Dimensions.get('window');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [otpError, setOtpError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [amountGreater, setAmountGreater] = useState(false);
  const [negativeAmount, setNegativeAmount] = useState(false);
  const [transactionType, setTransactionType] = useState('Withdrawal History');
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [showAllMap, setShowAllMap] = useState({});

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const [originalBankData, setOriginalBankData] = useState(null);

  useEffect(() => {
    if (walletInfo?.bankDetails) {
      setBankData(walletInfo.bankDetails);
      setOriginalBankData(walletInfo.bankDetails); // store original for comparison
    }
  }, [walletInfo]);

  const fetchWalletInfo = async () => {
    let payload = JSON.stringify({
      email: email,
    });
    try {
      let {data: res} = await GetWalletInfo(payload);

      setWalletInfo(res?.data);
    } catch (error) {
      console.error('Error in fetching wallet info: ', error);
    }
  };

  const FetchWalletTransaction = async () => {
    let payload = JSON.stringify({
      email: email,
    });

    try {
      let {data: res} = await GetWalletTransaction(payload);

      setHistory(res?.transactions);
    } catch (error) {
      console.error('Error in Fetching Transcation history: ', error);
    }
  };

  // Refetch when screen focuses
  // useFocusEffect(useCallback(() => {
  //     console.log('callback');
  //     fetchWalletInfo();
  //     FetchWalletTransaction();
  // }, []));

  // Refetch again just after modal closes
  useEffect(() => {
    if (visible2 == false) {
      fetchWalletInfo();
      FetchWalletTransaction();
    }
  }, [visible2]);

  const uploadBankDetails = async () => {
    let payload = JSON.stringify({
      email: email,
      bankDetails: {
        accountHolderName: bankData?.accountHolderName,
        accountNumber: bankData?.accountNumber,
        ifscCode: bankData?.ifscCode,
        bankName: bankData?.bankName,
        branch: '',
        upiId: '',
      },
    });
    try {
      let {data: res} = await UploadBankData(payload);
    } catch (error) {
      console.error('Error in Uploading Bank Data: ', error);
    }
  };

  const handleBankUpdate = async () => {
    const {accountNumber, ifscCode, accountHolderName, bankName} = bankData;

    if (!accountHolderName || !bankName) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required bank details.',
      );
      return;
    }

    const isSame =
      accountNumber === originalBankData?.accountNumber &&
      ifscCode === originalBankData?.ifscCode &&
      accountHolderName === originalBankData?.accountHolderName &&
      bankName === originalBankData?.bankName;

    setIsUploading(true);
    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    try {
      if (!isSame) {
        await uploadBankDetails();
        setOtpScreen(true);
        setBankDetails(false);
        SendOtpForVerifi();
      } else {
        await handleRequestForWithdrawal();
        setBankDetails(false);
        setVisible2(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        animatedWidth.setValue(0); // reset
      }, 300);
    }
  };

  const handleRequestForWithdrawal = async () => {
    let payload = JSON.stringify({
      email: email,
      amount: amount,
    });
    try {
      let {data: res} = await RequestForWithdrawal(payload);
    } catch (error) {
      console.error('Error in Requesting for Withdrawal: ', error);
    }
  };

  const SendOtpForVerifi = async () => {
    let payload = JSON.stringify({
      phoneNumber: globalState?.userPhone,
    });
    try {
      let {data: res} = await SendOtpForVerification(payload);
    } catch (error) {
      console.error('Error in Sending OTP: ', error);
    }
  };

  const handleOtpVerification = async () => {
    const otpString = otpDigits.join('');
    const payload = JSON.stringify({
      phoneNumber: globalState?.userPhone,
      otp: otpString,
    });
    setIsUploading(true);
    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    try {
      const {data: res} = await VerifyOtp(payload);
      if (res?.success) {
        await handleRequestForWithdrawal();
        setOtpScreen(false);
        setVisible2(true);
      } else {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect.');
        setOtpError('The OTP you entered is incorrect.');
      }
    } catch (error) {
      console.error('Error in Verifying OTP:', error);
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        animatedWidth.setValue(0); // reset animation
      }, 300);
    }
  };

  const groupedTransaction = {};
  history.forEach(item => {
    const date = moment(item.completedAt);
    const today = moment();
    const yesterday = moment().subtract(1, 'days');
    let sectionTitle;
    if (date.isSame(today, 'day')) {
      sectionTitle = 'Today';
    } else if (date.isSame(yesterday, 'day')) {
      sectionTitle = 'Yesterday';
    } else {
      sectionTitle = date.format('MMMM D, YYYY');
    }
    if (!groupedTransaction[sectionTitle]) {
      groupedTransaction[sectionTitle] = [];
    }
    groupedTransaction[sectionTitle].push(item);
  });

  const handleChange = (text, index) => {
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = text;
    setOtpDigits(updatedOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otpDigits[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleChanges = (field, value) => {
    setBankData(prev => ({...prev, [field]: value}));
  };

  const renderInput = (label, field, placeholder) => (
    <View style={{marginVertical: 12}}>
      <Text
        style={{
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 14,
          color: '#000000',
        }}>
        {label}
      </Text>
      <View
        style={{
          borderColor: '#00000033',
          borderWidth: 0.6,
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#000000E5"
          style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 12,
            color: '#000000E5',
            paddingVertical: 10,
          }}
          value={bankData[field]}
          onChangeText={value => handleChanges(field, value)}
        />
      </View>
    </View>
  );

  const transactionMode = [
    {
      label: 'Withdrawal History',
      value: 'Withdrawal History',
    },
    {
      label: 'Deposit History',
      value: 'Deposit History',
    },
  ];

  const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
  };


  return (
    <>
      {walletInfo != null ? (
        <SafeAreaView style={{flex: 1, backgroundColor: '#C7E5FD'}}>
          <ScrollView style={{backgroundColor: '#FFFFFF'}}>
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
              <View style={{flex: 1}}>
                <LinearGradient
                  colors={['#C7E5FD', '#FFFFFF']}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 20,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.goBack();
                      }}>
                      <Ico name={'chevron-left'} size={23} color={'#000000'} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 18,
                        color: '#000000',
                      }}>
                      Your Wallet
                    </Text>
                    <View></View>
                  </View>

                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/appImages/Wave.png',
                      }}
                      style={{width: 40, height: 20}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        color: '#000000B0',
                        marginTop: 5,
                      }}>
                      Wallet Balance
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'WorkSans-SemiBold',
                        fontSize: 35,
                        color: '#000000',
                      }}>
                      ₹{formatIndianAmount(walletInfo?.balance)}
                      <Text
                        style={{
                          fontFamily: 'WorkSans-SemiBold',
                          fontSize: 22,
                          color: '#000000',
                        }}></Text>
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setChooseAmount(!chooseAmount);
                      }}
                      style={{
                        backgroundColor: '#021265',
                        borderRadius: 50,
                        paddingHorizontal: 20,
                        marginVertical: 10,
                        paddingVertical: 10,
                        borderColor: '#FFFFFF',
                        borderWidth: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                          color: '#FFFFFF',
                        }}>
                        Withdraw{' '}
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 20,
                          padding: 5,
                          marginLeft: 5,
                        }}>
                        <Icon
                          name={'arrow-up-right'}
                          size={15}
                          color={'#000000'}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              <View style={{flex: 2, paddingTop: 40}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 20,
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPayment('Upcoming Payouts');
                    }}
                    style={{
                      borderBottomColor: '#000000',
                      borderBottomWidth:
                        payment === 'Upcoming Payouts' ? 1.5 : 0,
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          payment === 'Upcoming Payouts'
                            ? 'WorkSans-Bold'
                            : 'WorkSans-Medium',
                        fontSize: payment === 'Upcoming Payouts' ? 16 : 14,
                        color:
                          payment === 'Upcoming Payouts'
                            ? '#000000'
                            : '#000000B2',
                      }}>
                      Payouts
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setPayment('History');
                    }}
                    style={{
                      borderBottomColor: '#000000',
                      borderBottomWidth: payment === 'History' ? 1.5 : 0,
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          payment === 'History'
                            ? 'WorkSans-Bold'
                            : 'WorkSans-Medium',
                        fontSize: payment === 'History' ? 16 : 14,
                        color: payment === 'History' ? '#000000' : '#000000B2',
                      }}>
                      History of Payments
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* {payment === 'Upcoming Payouts' && (
                  <ScrollView style={{padding: 20}}>
                    {walletInfo?.quarterlyPayouts?.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#FFFFFF',
                          elevation: 2,
                          borderRadius: 11,
                          borderColor: '#6262621A',
                          borderWidth: 1,
                          padding: 10,
                          marginBottom: 20,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flex: 1,
                          }}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              Quarter {index + 1}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-Medium',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              Period: {item?.quarterName}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'flex-end',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'flex-end',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 16,
                                color: '#000000',
                              }}>
                              Total Earnings -
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 16,
                                color: '#218F00',
                              }}>
                              ₹{item?.amount}/-
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            borderTopColor: '#F6F6F6',
                            borderTopWidth: 1,
                            marginVertical: 10,
                          }}
                        />

                        {item?.properties.map((detail, i) => (
                          <View key={i}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={{uri: detail?.propertyImage}}
                                  style={{
                                    width: 50,
                                    height: 45,
                                    borderRadius: 7,
                                  }}
                                />
                                <View style={{marginLeft: 10, flex: 1}}>
                                  <Text
                                    style={{
                                      fontFamily: 'WorkSans-Medium',
                                      fontSize: 14,
                                      color: '#000000',
                                    }}>
                                    {detail?.propertyName}
                                  </Text>
                                  {item?.debited === true ? (
                                    <Text
                                      style={{
                                        fontFamily: 'WorkSans-Regular',
                                        fontSize: 12,
                                        color: '#000000',
                                      }}>
                                      Status: Withdrawn
                                    </Text>
                                  ) : (
                                    <Text
                                      style={{
                                        fontFamily: 'WorkSans-Regular',
                                        fontSize: 12,
                                        color: '#000000',
                                      }}>
                                      Status: Yet to withdraw
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                borderTopColor: '#F6F6F6',
                                borderTopWidth: 1,
                                marginVertical: 5,
                              }}
                            />
                          </View>
                        ))}

                        {walletInfo?.propertyDetails?.length > 2 && (
                          <TouchableOpacity
                            onPress={() => setShowAll(!showAll)}
                            style={{paddingVertical: 5}}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: '#007AFF',
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 14,
                              }}>
                              {showAll ? 'View Less' : 'View More'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    <View
                      style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        paddingBottom: 40,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Home',{details:globalState?.ProDetails});
                        }}
                        style={{
                          backgroundColor: '#021265',
                          borderRadius: 50,
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderColor: '#FFFFFF',
                          borderWidth: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 14,
                            color: '#FFFFFF',
                          }}>
                          Invest in Fractions
                        </Text>
                        <View
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 5,
                            marginLeft: 5,
                          }}>
                          <Icon
                            name={'arrow-up-right'}
                            size={15}
                            color={'#000000'}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )} */}

                {payment === 'Upcoming Payouts' &&
                            <ScrollView style={{ padding: 20 }}>
                                {walletInfo?.quarterlyPayouts?.map((item, index) => {

                                const isShowAll = showAllMap[index] || false;

                                const baseProperties =
                                    Array.isArray(item?.properties) && item.properties.length > 0
                                    ? item.properties
                                    : Array.isArray(walletInfo?.propertyDetails)
                                        ? walletInfo?.propertyDetails
                                        : [];

                                const propertiesToRender = isShowAll
                                    ? baseProperties
                                    : baseProperties.slice(0, 2);

                                return (
                                    <View
                                        key={index}
                                        style={{backgroundColor: '#FFFFFF',elevation: 2,borderRadius: 11,borderColor: '#6262621A',borderWidth: 1,padding: 10,marginBottom: 20,}}
                                    >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000000' }}>
                                                Quarter {index + 1}
                                            </Text>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>
                                                Period: {item?.quarterName}
                                            </Text>
                                        </View>

                                        <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>
                                            Total Earnings -
                                        </Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#218F00' }}>
                                            ₹{item?.amount}/-
                                        </Text>
                                        </View>
                                    </View>

                                    <View style={{ borderTopColor: '#F6F6F6', borderTopWidth: 1, marginVertical: 10 }} />

                                    {propertiesToRender.length > 0 && (
                                        propertiesToRender.map((detail, i) => (
                                        <View key={i}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                source={{ uri: detail?.propertyImage }}
                                                style={{ width: 50, height: 45, borderRadius: 7 }}
                                                />

                                                <View style={{ marginLeft: 10, flex: 1 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>
                                                    {detail?.propertyName}
                                                </Text>

                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000000' }}>
                                                    Status: {item?.debited ? 'Withdrawn' : 'Yet to withdraw'}
                                                </Text>
                                                </View>
                                            </View>
                                            </View>

                                            <View style={{ borderTopColor: '#F6F6F6', borderTopWidth: 1, marginVertical: 5 }} />
                                        </View>
                                        ))
                                    )}

                                    {baseProperties.length > 2 && (
                                        <TouchableOpacity
                                        onPress={() =>
                                            setShowAllMap(prev => ({
                                            ...prev,
                                            [index]: !isShowAll,
                                            }))
                                        }
                                        style={{ paddingVertical: 5 }}
                                        >
                                        <Text style={{ textAlign: 'center', color: '#007AFF', fontFamily: 'WorkSans-SemiBold', fontSize: 14 }}>
                                            {isShowAll ? 'View Less' : 'View More'}
                                        </Text>
                                        </TouchableOpacity>
                                    )}
                                    </View>
                                );
                                })}

                                <View style={{ alignSelf: 'center', marginTop: 10, paddingBottom: 40 }}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Home')}
                                    style={{
                                    backgroundColor: '#021265',
                                    borderRadius: 50,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderColor: '#FFFFFF',
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#FFFFFF' }}>
                                    Invest in Fractions
                                    </Text>
                                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 5, marginLeft: 5 }}>
                                    <Icon name="arrow-up-right" size={15} color="#000000" />
                                    </View>
                                </TouchableOpacity>
                                </View>
                            </ScrollView>
                        }

                {payment === 'History' && (
                  <ScrollView style={{padding: 20}}>
                    <View style={{marginBottom: 15}}>
                      <View
                        style={{
                          borderColor: '#000000',
                          borderWidth: 0.7,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 8,
                          padding: 10,
                        }}>
                        <Dropdown
                          style={{flex: 1}}
                          selectedTextStyle={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 14,
                            color: '#0D1E36',
                          }}
                          data={transactionMode}
                          maxHeight={150}
                          labelField="label"
                          valueField="value"
                          itemTextStyle={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 12,
                            color: '#0D1E36',
                          }}
                          value={transactionType}
                          onChange={item => {
                            setTransactionType(item.value);
                          }}
                        />
                      </View>
                    </View>

                    {Object.entries(groupedTransaction).map(
                      ([sectionTitle, sectionItems]) => {
                        const filteredItems = sectionItems.filter(tran => {
                          if (transactionType === 'Withdrawal History') {
                            return tran?.transactionType === 'withdrawal';
                          } else {
                            return tran?.transactionType === 'deposit';
                          }
                        });

                        // ✅ Skip rendering if no matching transactions
                        if (filteredItems.length === 0) return null;
                        return (
                          <View key={sectionTitle} style={{paddingBottom: 20}}>
                            <View style={{marginBottom: 20}}>
                              <Text
                                style={{
                                  fontFamily: 'WorkSans-SemiBold',
                                  fontSize: 14,
                                  color: '#000000',
                                }}>
                                Payouts: {sectionTitle}
                              </Text>
                            </View>

                            {filteredItems.map((item, index) => {
                              const date = new Date(
                                item?.completedAt,
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              });

                              const istTime = new Date(
                                item?.completedAt,
                              ).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                                timeZone: 'Asia/Kolkata',
                              });

                              return (
                                <View key={index}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      if (
                                        item?.transactionType === 'withdrawal'
                                      ) {
                                        navigation.navigate(
                                          'PaidSuccessfully',
                                          {tranDetail: item, email: email},
                                        );
                                      }
                                    }}
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    }}>
                                    <View style={{marginLeft: 10}}>
                                      <Text
                                        style={{
                                          fontFamily: 'WorkSans-Medium',
                                          fontSize: 14,
                                          color: '#000000',
                                        }}>
                                        Transaction Type:{' '}
                                        {item?.transactionType}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: 'WorkSans-Medium',
                                          fontSize: 12,
                                          color: '#000000',
                                          marginVertical: 3,
                                        }}>
                                        Status:{' '}
                                        <Text
                                          style={{
                                            fontFamily: 'WorkSans-Medium',
                                            fontSize: 15,
                                            color: '#218F00',
                                          }}>
                                          {item?.status}
                                        </Text>
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: 'WorkSans-Medium',
                                          fontSize: 14,
                                          color: '#000000',
                                        }}>
                                        Date: {date}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                      }}>
                                      <Text
                                        style={{
                                          fontFamily: 'WorkSans-SemiBold',
                                          fontSize: 14,
                                          color: '#218F00',
                                        }}>
                                        : ₹{item?.amount}/-
                                      </Text>
                                      {item?.transactionType ===
                                        'withdrawal' && (
                                        <Text
                                          style={{
                                            fontFamily: 'WorkSans-Medium',
                                            fontSize: 12,
                                            color: '#000000',
                                          }}>
                                          Stage:{' '}
                                          <Text
                                            style={{
                                              fontFamily: 'WorkSans-SemiBold',
                                              fontSize: 14,
                                              color: '#218F00',
                                            }}>
                                            {item?.stage}
                                          </Text>
                                        </Text>
                                      )}
                                      <View style={{alignItems: 'flex-end'}}>
                                        <Text
                                          style={{
                                            fontFamily: 'WorkSans-SemiBold',
                                            fontSize: 14,
                                            color: '#00000082',
                                          }}>
                                          {istTime}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                  <View
                                    style={{
                                      borderTopColor: '#62626233',
                                      borderTopWidth: 1,
                                      marginVertical: 10,
                                    }}
                                  />
                                </View>
                              );
                            })}
                          </View>
                        );
                      },
                    )}
                  </ScrollView>
                )}

                {chooseAmount && (
                  <Modal
                    modalStyle={{width}}
                    visible={true}
                    transparent
                    animationType="fade">
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' is generally preferred for iOS
                      style={{
                        flex: 1,
                        width:'100%',
                        //justifyContent: 'center',
                        //alignItems: 'center',
                      }}>
                      <View style={{flex: 1, backgroundColor: '#000000B3'}}>
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            width: width,
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: 20,
                            borderColor: '#00000021',
                            elevation: 5,
                            borderWidth: 1,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flex: 1,
                            }}>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  fontFamily: 'Montserrat-SemiBold',
                                  fontSize: 14,
                                  color: '#000000',
                                }}>
                                Enter the Amount you wish to withdraw
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                setChooseAmount(!chooseAmount);
                              }}
                              style={{
                                backgroundColor: '#6262624D',
                                borderRadius: 5,
                                padding: 2,
                              }}>
                              <Icon name={'x'} size={20} color={'#000000'} />
                            </TouchableOpacity>
                          </View>

                          <View
                            style={{
                              borderColor: '#00000033',
                              borderWidth: 0.65,
                              borderRadius: 8,
                              marginTop: 20,
                              paddingHorizontal: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 14,
                                color: '#000000E5',
                              }}>
                              ₹
                            </Text>
                            <TextInput
                              style={{
                                padding: 15,
                                marginVertical: -1,
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 14,
                                color: '#000000E5',
                                marginLeft: 5,
                              }}
                              placeholder="Enter amount"
                              placeholderTextColor={'#000000A1'}
                              value={amount}
                              keyboardType={'numeric'}
                              onChangeText={setAmount}
                            />
                          </View>

                          {amountGreater && (
                            <View style={{marginTop: 5, marginLeft: 5}}>
                              <Text
                                style={{
                                  fontFamily: 'Montserrat-Medium',
                                  fontSize: 12,
                                  color: 'red',
                                }}>
                                Insufficent Balance
                              </Text>
                            </View>
                          )}

                          {negativeAmount && (
                            <View style={{marginTop: 5, marginLeft: 5}}>
                              <Text
                                style={{
                                  fontFamily: 'Montserrat-Medium',
                                  fontSize: 12,
                                  color: 'red',
                                }}>
                                Amount should be greater then 0
                              </Text>
                            </View>
                          )}

                          <TouchableOpacity
                            onPress={() => {
                              const numericAmount = Number(amount);
                              if (isNaN(numericAmount) || numericAmount <= 0) {
                                setNegativeAmount(true);
                                setAmountGreater(false);
                                return;
                              }
                              if (numericAmount > walletInfo?.balance) {
                                setAmountGreater(true);
                                setNegativeAmount(false);
                                return;
                              }

                              setNegativeAmount(false);
                              setAmountGreater(false);
                              setChooseAmount(false);
                              setChoosePayment(true);
                            }}
                            style={{
                              backgroundColor: '#021265',
                              borderRadius: 12,
                              padding: 10,
                              alignItems: 'center',
                              marginHorizontal: 20,
                              marginTop: 25,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 16,
                                color: '#FFFFFF',
                              }}>
                              Proceed
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </KeyboardAvoidingView>
                  </Modal>
                )}

                {choosePayment && (
                  <Modal
                    modalStyle={{width}}
                    visible={true}
                    transparent
                    animationType="fade">
                    <View style={{flex: 1, backgroundColor: '#000000B3'}}>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: width,
                          backgroundColor: '#FFFFFF',
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                          padding: 20,
                          borderColor: '#00000021',
                          elevation: 5,
                          borderWidth: 1,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Bold',
                                fontSize: 18,
                                color: '#000000',
                              }}>
                              Withdraw ₹{amount}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setChoosePayment(!choosePayment);
                            }}
                            style={{
                              backgroundColor: '#6262624D',
                              borderRadius: 5,
                              padding: 2,
                            }}>
                            <Icon name={'x'} size={20} color={'#000000'} />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            borderTopColor: '#F6F6F6',
                            borderTopWidth: 1,
                            marginVertical: 10,
                          }}></View>

                        <View style={{}}>
                          <TouchableOpacity
                            onPress={() => {}}
                            style={{
                              borderColor: '#3742FA',
                              borderWidth: 1,
                              backgroundColor: '#3742FA33',
                              borderRadius: 12,
                              padding: 30,
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}>
                            <Ic name={'bank'} size={35} color={'#0424CB'} />
                            <Text
                              style={{
                                fontFamily: 'WorkSans-SemiBold',
                                fontSize: 12,
                                color: '#0424CB',
                                marginTop: 10,
                              }}>
                              Bank Transfer
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            borderTopColor: '#F6F6F6',
                            borderTopWidth: 1,
                            marginVertical: 15,
                          }}></View>

                        <TouchableOpacity
                          onPress={() => {
                            setChoosePayment(!choosePayment);

                            setBankDetails(!bankDetails);
                          }}
                          style={{
                            backgroundColor: '#021265',
                            borderRadius: 12,
                            padding: 15,
                            alignItems: 'center',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Medium',
                              fontSize: 16,
                              color: '#FFFFFF',
                            }}>
                            Continue
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}

                {bankDetails && (
                  <Modal
                    modalStyle={{width}}
                    visible={true}
                    transparent
                    animationType="fade">
                          <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' is generally preferred for iOS
                      style={{
                        flex: 1,
                        width:'100%',
                        //justifyContent: 'center',
                        //alignItems: 'center',
                      }}>
                    <View style={{flex: 1, backgroundColor: '#000000B3'}}>
                      <View style={{backgroundColor: '#00000066', flex: 1}}>
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            width: width,
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: 20,
                            borderColor: '#00000021',
                            elevation: 5,
                            borderWidth: 1,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  fontFamily: 'Montserrat-Bold',
                                  fontSize: 18,
                                  color: '#000000',
                                }}>
                                Withdraw via bank transfer
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'WorkSans-Regular',
                                  fontSize: 14,
                                  color: '#000000',
                                }}>
                                We’ll transfer to your bank account on weekdays
                                (Mon–Fri) between 9 AM and 5 PM.
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                setBankDetails(!bankDetails);
                              }}
                              style={{
                                backgroundColor: '#6262624D',
                                borderRadius: 5,
                                padding: 2,
                              }}>
                              <Icon name={'x'} size={20} color={'#000000'} />
                            </TouchableOpacity>
                          </View>

                          {renderInput(
                            'Account Holder Name',
                            'accountHolderName',
                            'Enter name',
                          )}
                          {renderInput(
                            'Account Number',
                            'accountNumber',
                            'Enter account number',
                          )}
                          {renderInput('IFSC Code', 'ifscCode', 'Enter IFSC')}
                          {renderInput(
                            'Bank Name',
                            'bankName',
                            'Enter bank name',
                          )}

                          <TouchableOpacity
                            onPress={handleBankUpdate}
                            style={{
                              backgroundColor: '#021265',
                              borderRadius: 8,
                              marginHorizontal: 20,
                              marginTop: 30,
                              alignItems: 'center',
                              padding: 13,
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}
                            disabled={isUploading}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Meidum',
                                fontSize: 16,
                                color: '#FFFFFF',
                              }}>
                              Continue
                            </Text>

                            {isUploading && (
                              <Animated.View
                                style={[
                                  styles.overlay,
                                  {width: interpolatedWidth},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    </KeyboardAvoidingView>
                  </Modal>
                )}

                {otpScreen && (
                  <Modal
                    modalStyle={{width}}
                    visible={true}
                    transparent
                    animationType="fade">
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' is generally preferred for iOS
                      style={{
                        flex: 1,
                        width:'100%',
                        //justifyContent: 'center',
                        //alignItems: 'center',
                      }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#000000B3',
                        width: width,
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: width,
                          backgroundColor: '#FFFFFF',
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                          padding: 20,
                          borderColor: '#00000021',
                          elevation: 5,
                          borderWidth: 1,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Bold',
                                fontSize: 18,
                                color: '#000000',
                              }}>
                              OTP Verification
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 12,
                                color: '#00000082',
                              }}>
                              Please verify the OTP sent to your registered
                              mobile number to proceed with the exit.
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setOtpScreen(!otpScreen);
                            }}
                            style={{
                              backgroundColor: '#6262624D',
                              borderRadius: 5,
                              padding: 2,
                            }}>
                            <Icon name={'x'} size={20} color={'#000000'} />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            gap: 10,
                            marginTop: 30,
                          }}>
                          {[0, 1, 2, 3, 4, 5].map(index => (
                            <View
                              key={index}
                              style={{
                                borderColor: '#E1E6EB',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 5,
                              }}>
                              <TextInput
                                ref={ref => (inputRefs.current[index] = ref)}
                                style={{
                                  fontFamily: 'WorkSans-Medium',
                                  fontSize: 20,
                                  color: '#000000',
                                  textAlign: 'center',
                                  //width: 30,
                                  padding:10
                                }}
                                keyboardType={'numeric'}
                                maxLength={1}
                                value={otpDigits[index]}
                                onChangeText={text => handleChange(text, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                              />
                              <View
                                style={{
                                  borderTopColor: '#8E9398',
                                  borderTopWidth: 1,
                                  marginBottom: 10,
                                }}></View>
                            </View>
                          ))}
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            handleOtpVerification();
                          }}
                          style={{
                            backgroundColor: '#021265',
                            borderRadius: 8,
                            marginHorizontal: 20,
                            marginTop: 30,
                            alignItems: 'center',
                            padding: 13,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Meidum',
                              fontSize: 16,
                              color: '#FFFFFF',
                            }}>
                            Continue
                          </Text>
                          {isUploading && (
                            <Animated.View
                              style={[
                                styles.overlay,
                                {width: interpolatedWidth},
                              ]}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    </KeyboardAvoidingView>
                  </Modal>
                )}

                {otpError !== '' && (
                  <Text
                    style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                    {otpError}
                  </Text>
                )}

                <Modal visible={visible2} transparent animationType="fade">
                  <TouchableOpacity
                    onPress={() => {
                      setVisible2(false);
                      // navigation.navigate('ProfileScreen');
                      // fetchWalletInfo();
                      // FetchWalletTransaction();
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#00000066',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: width * 0.65,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 20,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        shadowOffset: {width: 0, height: 2},
                      }}>
                      <FastImage
                        source={require('./assets/TickAnim.gif')}
                        style={{width: 115, height: 115, alignSelf: 'center'}}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      <Text
                        style={{
                          fontFamily: 'WorkSans-Medium',
                          fontSize: 14,
                          opacity: 0.8,
                          color: '#000000',
                          textAlign: 'center',
                        }}>
                        Your withdrawal request of Rs {amount} is successfully
                        submitted and will be credited into your registered bank
                        account within 2 business days.
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          setVisible2(false);
                          // navigation.navigate('ProfileScreen');
                        }}
                        style={{
                          backgroundColor: '#021265',
                          borderRadius: 13,
                          padding: 7,
                          alignItems: 'center',
                          marginTop: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 16,
                            color: '#FFFFFF',
                          }}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: '#C7E5FD'}}>
          <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <LinearGradient colors={['#C7E5FD', '#FFFFFF']} style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                 // marginBottom:10
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name={'chevron-left'} size={20} color={'#000000'} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 18,
                    color: '#000000',
                  }}>
                  Your Wallet
                </Text>
                <View></View>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: 'https://duixj37yn5405.cloudfront.net/appImages/Wave.png',
                  }}
                  style={{width: 40, height: 20}}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14,
                    color: '#000000B0',
                    marginTop: 5,
                  }}>
                  Wallet Balance
                </Text>
                <Text
                  style={{
                    fontFamily: 'WorkSans-SemiBold',
                    fontSize: 35,
                    color: '#000000',
                  }}>
                  ₹0
                  <Text
                    style={{
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 22,
                      color: '#000000',
                    }}></Text>
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 14,
                      color: '#2AA804',
                    }}>
                    ---
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 16,
                      color: '#000000E5',
                      marginLeft: 10,
                    }}>
                    Last Payout
                  </Text>
                </View>
                {/* <View style={{backgroundColor:'#021265',borderRadius:50,paddingHorizontal:20,paddingVertical:10,borderColor:'#FFFFFF',borderWidth:1,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#FFFFFF'}}>Withdraw </Text>
                        <View style={{backgroundColor:'#FFFFFF',borderRadius:20,padding:5,marginLeft:5}}>
                            <Icon name={'arrow-up-right'} size={15} color={'#000000'}/>
                        </View>
                    </View> */}
                    <View style={{padding:10}}>
 <WalletAnimation/>
                    </View>
                             
                {/* <FastImage
                  source={require('./assets/WalletAnim.gif')}
                  style={{width: 160, height: 80}}
                  resizeMode={FastImage.resizeMode.cover}
                /> */}
              </View>
            </LinearGradient>

            <View style={{flex: 1.5, alignItems: 'center', marginTop:-100,}}>
              <View style={{marginTop: 110}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 18,
                    color: '#000000',
                    textAlign: 'center',
                  }}>
                  Oops! No earnings history yet.
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: '#000000',
                    textAlign: 'center',
                    marginHorizontal: 10,
                    textAlign: 'center',
                  }}>
                  {' '}
                  No earnings yet. Real estate investments can unlock consistent
                  rental returns over time.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Home',{details:globalState?.ProDetails});
                }}
                style={{
                  backgroundColor: '#021265',
                  borderRadius: 50,
                  paddingHorizontal: 15,
                  paddingVertical: 7,
                  marginTop: 20,
                  borderColor: '#FFFFFF',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Meidum',
                    fontSize: 14,
                    color: '#FFFFFF',
                  }}>
                  Invest Now
                </Text>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: 5,
                    marginLeft: 5,
                  }}>
                  <Icon name={'arrow-up-right'} size={15} color={'#000000'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>

    // <View></View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1,
  },
});
