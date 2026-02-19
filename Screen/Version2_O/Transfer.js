import { View, Text, Image, Dimensions,ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../CustomModal';
import { useNavigation } from '@react-navigation/native';
import { PropertyDetails, TransferProperty, TransferPropertyOTP, TransferPropertyOTPVerify } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchProperties } from '../redux/reducer/homeReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function Transfer(props) {
    const { globalState, setGlobalState } = useContext(AppContext);
    const [OwnedPropertyDetails, setOwnedPropertyDetails] = useState(
        props?.route?.params?.OwnedPropertyDetails || [],
    );
    const [loader, setLoader] = useState(false);
   //console.log(OwnedPropertyDetails?.propertyDetails?._id);
    const [visible2, setVisible2] = useState(false);
    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    const [notselected, setNotSelected] = useState(false);
    const [select, setSelect] = useState('');
    const [transfer, setTransfer] = useState(false);
    const [Recommended, setRecommended] = useState([]);
    const firstInput = useRef();
    const secoundInput = useRef();
    const thirdInput = useRef();
    const fourInput = useRef();
    const fiveInput = useRef();
    const sixInput = useRef();
    const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const dispatch = useDispatch();
 
  const Properties = useSelector(state => state.home.ProDetails);

  const loading = useSelector(state => state.home.loading);
  useEffect(() => {
    dispatch(fetchProperties());

  }, []);
    useEffect(() => {
        const filteredNumbers = Properties?.filter(number => number.H_property == true);
        setRecommended(filteredNumbers);
    }, []);

console.log(OwnedPropertyDetails,'OwnedPropertyDetails=====')
//console.log(Properties,'Properties=====')

    const handleTransfer = async () => {
        setLoader(true);
        let payload = JSON.stringify({
            email: globalState?.userEmail,
            fromPropertyId: OwnedPropertyDetails?.propertyDetails?._id,
            fromPropertyName: OwnedPropertyDetails?.propertyDetails?.name,
            toPropertyId: select?._id,
            toPropertyName: select?.name,
            action  : 'transfer'
        });
      // console.log(payload);
        try {
           let { data: res } = await TransferProperty(payload);
         // console.log(res);

            if (res?.success) {
                setTransfer(!transfer);
                setLoader(false);


            }
        } catch (error) {
           // console.log(error);

            if (error?.response) {
                Alert.alert('Response Error', `${error?.response?.data?.message}`);
                //setLoader(false);
            } else if (error?.request) {
                // console.log('property', `${JSON.stringify(error?.request)}`);
                //  Alert.alert('Request error:', 'Please Check Your Internet Connection');
                //setLoader(false);
            } else {
                Alert.alert('Error:', `${error?.message}`);
                //setLoader(false);
            }
        }
    };

    const handleTransferOtp = async () => {
        let payload = JSON.stringify({
            phoneNumber: globalState?.userDetails?.phoneNumber.replace('+', '')
        });
     
        try {
            let { data: res } = await TransferPropertyOTP(payload);
      

            if (res?.success) {
                setVisible2(true);

            }
        } catch (error) {
           console.log(error);

            if (error?.response) {
                Alert.alert('Response Error', `${error?.response?.data?.message}`);
                //setLoader(false);
            } else if (error?.request) {
                 console.log('property', `${JSON.stringify(error?.request)}`);
                //  Alert.alert('Request error:', 'Please Check Your Internet Connection');
                //setLoader(false);
            } else {
                Alert.alert('Error:', `${error?.message}`);
                //setLoader(false);
            }
        }
    };


    const handleTransferOtpVerify = async (code) => {
        let payload = JSON.stringify({
            phoneNumber: globalState?.userDetails?.phoneNumber.replace('+', ''),
            otp: code
        });
       // console.log(payload);
        
        try {
            let { data: res } = await TransferPropertyOTPVerify(payload);
           //console.log(res);

            if (res?.success) {
                handleTransfer();
                setVisible2(false);

            }
        } catch (error) {
            console.log(error);

            if (error?.response) {
                Alert.alert('Response Error', `${error?.response?.data?.message}`);
                //setLoader(false);
            } else if (error?.request) {
                 console.log('property', `${JSON.stringify(error?.request)}`);
                //  Alert.alert('Request error:', 'Please Check Your Internet Connection');
                //setLoader(false);
            } else {
                Alert.alert('Error:', `${error?.message}`);
                //setLoader(false);
            }
        }
    };














    return (
        <SafeAreaView style={{flex:1}}>
        <View style={{ backgroundColor: '#F6F6F6', flex: 1 }}>
            <View style={{ padding: 20, flexDirection: 'row', backgroundColor: '#F6F6F6', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    //handleTransfer();
                    navigation.goBack();
                }}>
                    <Icon name={'chevron-left'} size={20} color={'#000000'} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 24, color: '#021265' }}>Transfer</Text>
                <View></View>
            </View>

            <ScrollView style={{ marginBottom: 150 }}>
                {Recommended.map((item, index) => (<TouchableOpacity key={index} onPress={() => {
                    setSelect(item);
                }} style={{ backgroundColor: '#FFFFFF', borderColor: select?._id === item?._id ? '#386BF6' : '#EAEAEC', borderWidth: 1, padding: 10, borderRadius: 15, marginHorizontal: 20, marginVertical: 10, flexDirection: 'row', }}>
                    <View>
                        <Image resizeMode='cover' source={{ uri: item?.image?.Image1 }} style={{ width: 135, height: 160, borderRadius: 15 }} />
                    </View>
                    <View style={{ marginHorizontal: 5, flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#5C5CB1' }}>{item?.name}</Text>
                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7E7A7A', marginTop: 5 }}>{item?.Location}</Text>
                        <View style={{ borderTopWidth: 1, borderTopColor: '#EFE8E8', marginVertical: 5 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000000' }}>Frac Value</Text>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088' }}>{item?.FC_Price}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000000' }}>Available Fracs</Text>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088' }}>{item?.AvailableFractions}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000000' }}>{item?.TotalFractions} Fracs</Text>
                            <View style={{ flexDirection: 'row', }}>
                                <Image source={require('../assets/NewProfileimage.jpg')} style={{ width: 35, height: 35, borderRadius: 35 }} />
                                <Image source={require('../assets/NewProfileimage.jpg')} style={{ width: 35, height: 35, borderRadius: 35, marginLeft: -18 }} />
                                <Image source={require('../assets/NewProfileimage.jpg')} style={{ width: 35, height: 35, borderRadius: 35, marginLeft: -18 }} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                ))}

                {/* <TouchableOpacity onPress={() => {
                setSelect(prev => prev === "Prop2" ? "" : "Prop2");
            }} style={{backgroundColor:'#FFFFFF',borderColor:select=== "Prop2"?'#386BF6':'#EAEAEC',borderWidth:1,padding:10,borderRadius:15,marginHorizontal:20,flexDirection:'row'}}>
                <View>

                </View>
                <View style={{marginHorizontal:10, flex:1}}>
                    <Text style={{fontFamily:'Montserrat-Bold',fontSize:15,color:'#5C5CB1'}}>DREAMSCAPE OU COL....</Text>
                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:13,color:'#7E7A7A',marginTop:5}}>Hyderabad, Banjara Hills</Text>
                    <View style={{borderTopWidth:1,borderTopColor:'#EFE8E8',marginVertical:10}}></View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:13,color:'#000000'}}>Frac Value</Text>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:13,color:'#000088'}}>10,00,000</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:13,color:'#000000'}}>Available Fracs</Text>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:13,color:'#000088'}}>4</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:13,color:'#000000'}}>1 Investor</Text>
                        <View style={{flexDirection:'row',}}>
   
                        </View>
                    </View>
                </View>
            </TouchableOpacity> */}
            </ScrollView>

            <View style={{ padding: 20, position: 'absolute', bottom: 0, backgroundColor: '#F6F6F6' }}>
                <TouchableOpacity onPress={() => {
                    select != '' ? handleTransfer()
                        : setNotSelected(!select);
                }}>
                    <LinearGradient colors={['#021265', '#2D44B8']} style={{ padding: 15, alignItems: 'center', borderRadius: 10 }}>
                       { loader == true ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : ( <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Transfer</Text>)}
                    </LinearGradient>
                </TouchableOpacity>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000000' }}>
                        By clicking 'Transfer', your fractional share will be moved to the selected property, and
                        ownership rights will be updated accordingly.
                    </Text>
                </View>
            </View>

            {notselected === true &&
                <CustomModal visible={true} modalStyle={{ width }}>
                    <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#C12525' }}>Select Property</Text>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080' }}>Choose a property to proceed with the ownership transfer.</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setNotSelected(!notselected);
                        }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', padding: 15, alignItems: 'center', borderRadius: 10, marginVertical: 30 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
            }




            {transfer === true &&
                // <CustomModal visible={true} modalStyle={{ width }}>
                //     <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
                //         <View>
                //             <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#0F1130' }}>OTP Verification</Text>
                //             <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080', marginLeft: 10 }}>
                //                 Please verify the OTP sent to your registered mobile number to proceed with the exit.
                //             </Text>
                //         </View>
                //         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30 }}>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //             <View style={{ borderColor: '#0F113021', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}>
                //                 <TextInput
                //                     keyboardType="numeric"
                //                     maxLength={1}
                //                     style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#0F3110' }}
                //                 />
                //             </View>
                //         </View>
                //         <TouchableOpacity onPress={() => {
                //             navigation.navigate("Dashboard");
                //             setTransfer(!transfer);
                //         }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, borderRadius: 10, padding: 15, alignItems: 'center' }}>
                //             <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Verify</Text>
                //         </TouchableOpacity>
                //     </View>
                // </CustomModal>
                <CustomModal visible={true} modalStyle={{ width }}>
                    <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#C12525' }}>Transfer Request Submitted!</Text>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080' }}>We’ve also updated our support team regarding your request They’ll be reaching out to you shortly for any assistance you may need.</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setNotSelected(!notselected);
                            navigation.navigate('Owned');
                        }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', padding: 15, alignItems: 'center', borderRadius: 10, marginVertical: 30 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Submitted</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
            }


            {visible2 === true &&
                <CustomModal visible={true} modalStyle={{ width: width }}>
                    <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#0F1130' }}>OTP Verification</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVisible2(false);
                                    }}
                                    style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Icon1 name={'close'} size={20} color={'#000000'} />

                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080', marginTop: 10 }}>Please verify the OTP sent to your registered mobile number to proceed with the exit.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30 }}>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    marginBottom: 10,
                                }}>
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        textAlign: 'center',
                                    }}
                                    placeholder=""
                                    // value={otp.charAt(0)}
                                    ref={firstInput}
                                    maxLength={1}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={'#000'}
                                    onChangeText={txt => {
                                        txt && secoundInput.current.focus();
                                        setOtp({ ...otp, 1: txt });
                                        //  setPhone(txt);
                                    }}
                                />
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        textAlign: 'center',
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
                                        setOtp({ ...otp, 2: txt });
                                        // setPhone(txt);
                                    }}
                                />
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        textAlign: 'center',
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
                                        setOtp({ ...otp, 3: txt });
                                    }}
                                />
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        textAlign: 'center',
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
                                        setOtp({ ...otp, 4: txt });
                                        //setOtp(otp + txt);
                                    }}
                                />
                                <TextInput
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        textAlign: 'center',
                                        //padding: 10,
                                    }}
                                    placeholder=""
                                    // value={otp.charAt(4)}
                                    ref={fiveInput}
                                    maxLength={1}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={'#000'}
                                    onChangeText={txt => {
                                        txt ? sixInput.current.focus() : fourInput.current.focus();
                                        setOtp({ ...otp, 5: txt });
                                    }}
                                />
                                <TextInput
                                    style={{
                                        //height: 35,
                                        color: '#000000',
                                        borderWidth: 2,
                                        borderColor: '#0F113021',
                                        borderRadius: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        textAlign: 'center',
                                    }}
                                    placeholder=""
                                    ref={sixInput}
                                    maxLength={1}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={'#000'}
                                    onChangeText={txt => {
                                        !txt && fiveInput.current.focus();
                                        setOtp({ ...otp, 6: txt });
                                    }}
                                />
                            </View>

                        </View>
                        <TouchableOpacity onPress={() => {
                            let code = otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6];
                            //let mssg = 'Exit';
                            handleTransferOtpVerify(code);


                        }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, borderRadius: 10, padding: 15, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
            }
        </View>
        </SafeAreaView>
    )
}








