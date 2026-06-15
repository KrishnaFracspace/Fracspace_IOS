import { View, Text, ScrollView, Image, Dimensions, ImageBackground, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, AppState, Linking, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/FontAwesome';
import Ic from 'react-native-vector-icons/FontAwesome6';
import Icc from 'react-native-vector-icons/Feather';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { createAgreement, GetInternationalProperties, GetInvestmentDetails, initiatePaymentForEscape, InvestmentDetailsForEscape } from '../../Services/UserApi';
import Pdf from 'react-native-pdf';
import { AppContext } from '../../Context/AppContext';
import WebView from 'react-native-webview';

export default function MembershipHome() {

    const { width, height } = Dimensions.get('window');
    const { globalState, setGlobalState } = useContext(AppContext);
    // console.log("userdata: ", globalState?.userDetails?.email  ,   globalState?.userDetails?.phoneNumber);

    const [infoVisible, setInfoVisible] = useState(false);
    const [agreementVisible, setAgreementVisible] = useState(false);
    const [paymentVisible, setPaymentVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    // console.log("Selected Plan: ", selectedPlan);

    const [agree, setAgree] = useState(false);
    const [agreeToDoc, setAgreeToDoc] = useState(false);
    const [name, setName] = useState('');
    const [parentsName, setParentsName] = useState('');
    const [address, setAddress] = useState('');
    const [accHolName, setAccHolName] = useState('');
    const [accNum, setAccNum] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [pan, setPan] = useState('');
    const [investmentData, setInvestmentData] = useState([]);
    const [userInvestmentDetails, setUserInvestmentDetails] = useState([]);
    const [showRoi, setShowRoi] = useState(false);
    const [showFullAgreement, setShowFullAgreement] = useState(false);
    const [showBreakDown, setShowBreakDown] = useState(false);
    const [HotelDetails, setHotelDetails] = useState(globalState?.HotelDetails);
    const [internationalProperties, setInternationalProperties] = useState([]);
    const [hotelType, setHotelType] = useState('Domestic');
    // console.log("hotels: ", globalState?.HotelDetails);

    const [loading, setLoading] = useState(false);
    const [agreementBase64, setAgreementBase64] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentVerifying, setPaymentVerifying] = useState(false);

    const [paymentReferenceId, setPaymentReferenceId] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);

    const [paymentHtml, setPaymentHtml] = useState('');
    const [showPaymentWebview, setShowPaymentWebview] = useState(false);

    const [paymentTxnId, setPaymentTxnId] = useState(null);
    const [activeInvestment, setActiveInvestment] = useState(null);
    const [inProgressInvestment, setInProgressInvestment] = useState(null);
    const userId = globalState?.userDetails?._id;
    // console.log('userid: ',userId);


    const appState = useRef(AppState.currentState);


    const translateX = useSharedValue(-150);
    const navigation = useNavigation();

    const membershipAmt = selectedPlan ? (selectedPlan?.bookingAmount ?? 0) : (investmentData[0]?.minimumInvestment ?? 0);
    const platform = (membershipAmt * (2.2 / 100));
    const gst = (platform * (18 / 100));
    const platformFeeFromBackend = selectedPlan?.platformFeeAmount;
    const gstFromBackend = selectedPlan?.gstAmount;
    const totalAmt = (membershipAmt + gst + platform);
    const totalAmountFromBackend = membershipAmt + platformFeeFromBackend + gstFromBackend;

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(width, {
                duration: 3000,
            }),
            -1,
            false
        );

        getInvestmentData();
        showInvestmentForEscape();
        fetchInternationalProperties();
    }, []);

    useEffect(() => {
        if (userInvestmentDetails?.length > 0) {
            const activeData = userInvestmentDetails.find(
                item => item.status === 'active'
            );
            setActiveInvestment(activeData || null);

            const inProgressData = userInvestmentDetails.find(
                item => item.status === 'inProgress'
            );
            setInProgressInvestment(inProgressData || null);

            if (activeData) {
                setSelectedPlan(activeData?.investmentPlan);
            } else if (inProgressData) {
                setSelectedPlan(inProgressData?.investmentPlan);
            }
        } else {
            setActiveInvestment(null);
            setInProgressInvestment(null);
        }
    }, [userInvestmentDetails]);

    const getInvestmentData = async () => {
        try {
            let { data: res } = await GetInvestmentDetails();
            // console.log("Response: ", res);
            if (res?.plan && res?.plan?.length > 0) {
                setInvestmentData(res?.plan);
                // setSelectedPlan(res?.plan[0]);
            }
        } catch (error) {
            console.log('Error in getting investment details: ', error?.response?.data || error?.response?.message);
        }
    }

    const showInvestmentForEscape = async () => {
        try {
            let { data: res } = await InvestmentDetailsForEscape(userId);
            // console.log("Data: ", res);
            setUserInvestmentDetails(res?.userInvestment);
        } catch (error) {
            console.log('Error in show investment: ', error?.response?.data);
        }
    }

    const fetchInternationalProperties = async () => {
        let payload = JSON.stringify({
            forPortal: false
        })
        try {
            let { data: res } = await GetInternationalProperties(payload);
            // console.log("International Properties: ", res?.hotels);
            setInternationalProperties(res?.hotels || []);
        } catch (error) {
            console.log("Error in fetching international propeties: ", error?.response?.data || error?.message);
        }
    }


    const validateForm = () => {

        if (!name?.trim()) {
            Alert.alert('Validation Error', 'Please enter full name');
            return false;
        }

        if (!parentsName?.trim()) {
            Alert.alert('Validation Error', 'Please enter parent/guardian name');
            return false;
        }

        if (!address?.trim()) {
            Alert.alert('Validation Error', 'Please enter address');
            return false;
        }

        if (!accHolName?.trim()) {
            Alert.alert('Validation Error', 'Please enter account holder name');
            return false;
        }

        if (!accNum?.trim()) {
            Alert.alert('Validation Error', 'Please enter account number');
            return false;
        }

        if (!ifscCode?.trim()) {
            Alert.alert('Validation Error', 'Please enter IFSC code');
            return false;
        }

        if (!bankName?.trim()) {
            Alert.alert('Validation Error', 'Please enter bank name');
            return false;
        }

        if (!aadhar?.trim() || aadhar?.length < 12) {
            Alert.alert('Validation Error', 'Please enter valid Aadhaar number');
            return false;
        }

        if (!pan?.trim()) {
            Alert.alert('Validation Error', 'Please enter PAN number');
            return false;
        }

        // if (!agree) {
        //     Alert.alert('Terms Required', 'Please accept Terms & Conditions');
        //     return false;
        // }

        return true;
    };

    const CreateAgreement = async () => {
        try {
            const isValid = validateForm();

            if (!isValid) {
                return;
            }

            setLoading(true);
            setErrorMessage('');

            const payload = {
                name: name?.trim(),
                email: globalState?.userDetails?.email,
                phoneNumber: globalState?.userDetails?.phoneNumber,
                ifscCode: ifscCode?.trim()?.toUpperCase(),
                bankName: bankName?.trim(),
                accountNumber: accNum,
                aadharNumber: aadhar?.replace(/\s/g, ''),
                panNumber: pan?.trim()?.toUpperCase(),
                guardianName: parentsName?.trim(),
                address: address?.trim(),
                convertToBase64: true,
                investmentPlanId: selectedPlan?._id || investmentData[0]?._id,
                investmentPlanName: selectedPlan?.name || investmentData[0]?.name
            };

            console.log('Agreement Payload =>', payload);

            const response = await createAgreement(
                JSON.stringify(payload)
            );

            // console.log(
            //     'Agreement Full Response =>',
            //     JSON.stringify(response?.data, null, 2)
            // );

            const result = response?.data;

            // console.log("result: ",result);

            if (result?.success) {

                if (result?.base64) {
                    setAgreementBase64(result?.base64);

                    setInfoVisible(false);
                    setAgreementVisible(true);
                } else {
                    Alert.alert('Error', 'Agreement PDF not received');
                }

            } else {

                Alert.alert(
                    'Error',
                    result?.message || 'Failed to create agreement'
                );
            }

        } catch (error) {
            console.log(
                'Agreement API Error =>',
                error?.response?.data || error
            );
            Alert.alert(
                'Error',
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInitiatePayment = async () => {
        try {
            setPaymentLoading(true);
            const payload = JSON.stringify({
                userId: globalState?.userDetails?._id,
                email: globalState?.userDetails?.email,
                investmentPlanId: selectedPlan?._id || investmentData[0]?._id,
                phoneNumber: globalState?.userDetails?.phoneNumber,
                amount: selectedPlan?.offer ? totalAmountFromBackend : totalAmt,
                // amount: 1,
                // totalAmount: 1,
                gst: selectedPlan?.offer ? gstFromBackend : gst,
                processingFee: selectedPlan?.offer ? platformFeeFromBackend : platform,
                bookingAmount: membershipAmt,
                surl: "https://test.bunknbeyond.com/paymentsuccess",
                furl: "https://test.bunknbeyond.com/paymentfailure",
                memberDetails: {
                    name: name,
                    ifscCode: ifscCode,
                    bankName: bankName,
                    aadharNumber: aadhar,
                    panNumber: pan,
                    guardianName: parentsName,
                    address: address,
                    accountNumber: accNum
                }
            });
            console.log("Payload: ", payload);

            const { data: res } = await initiatePaymentForEscape(payload);
            console.log('PAYMENT RESPONSE =>', JSON.stringify(res, null, 2));

            if (res?.success) {

                const paymentForm = res?.form;

                const txnId = res?.investment?.paymentProof?.txnId;

                if (!paymentForm) {
                    Alert.alert('Payment Error', 'Payment form not received');
                    return;
                }
                setPaymentVisible(false);
                navigation.navigate(
                    'EscapePaymentPage',
                    {
                        Link: paymentForm,
                        TxnID: txnId,
                        investmentData: res?.investment
                    }
                );
            } else {
                Alert.alert(
                    'Payment Failed',
                    res?.message ||
                    'Unable to initiate payment'
                );
            }
        } catch (error) {

            console.log(
                'PAYMENT ERROR =>',
                error?.response?.data || error
            );

            Alert.alert(
                'Payment Info',
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong'
            );

        } finally {

            setPaymentLoading(false);
        }
    };

    const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

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

    const renderHighlightedText = (
        text,
        highlights = [],
        highlightColor = '#AC935C',
        normalColor = '#FFF'
    ) => {
        if (!text) return null;

        const escapedHighlights = highlights.map(word =>
            word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

        return text.split(regex).map((part, index) => {
            const isHighlighted = highlights.some(
                highlight => highlight.toLowerCase() === part.toLowerCase()
            );

            return (
                <Text
                    key={index}
                    style={{
                        color: isHighlighted ? highlightColor : normalColor,
                        fontFamily: isHighlighted
                            ? 'WorkSans-SemiBold'
                            : 'WorkSans-Regular',
                    }}
                >
                    {part}
                </Text>
            );
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ac935ca2' }}>
            <ImageBackground source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/BGHome.png' }} style={{ flex: 1 }}>
                <ScrollView style={{ padding: 20 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('BottomNavigations');
                    }} style={{ backgroundColor: '#00000066', padding: 5, borderRadius: 15, alignItems: 'center', alignSelf: 'flex-start' }}>
                        <Icon name={'chevron-back'} size={16} color={'#FFF'} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <Image resizeMode='contain' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/FSEscapeLogo.png' }} style={{ width: width * 0.45, height: 47 }} />

                        {userInvestmentDetails?.length > 0 &&
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('MembershipProfile', { data: userInvestmentDetails, plan: investmentData });
                            }} style={styles.container}>
                                <LinearGradient
                                    colors={['#AC935C', '#E9C484', '#8F6D36']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.card}
                                >
                                    <Animated.View style={[styles.shineWrapper, animatedStyle]}>
                                        <LinearGradient
                                            colors={[
                                                'rgba(255,255,255,0)',
                                                'rgba(255, 255, 255, 0.51)',
                                                'rgba(255,255,255,0)',
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.shine}
                                        />
                                    </Animated.View>

                                    <Ico name={'user-circle-o'} size={15} color={'#5e390f'} />

                                    <Text style={styles.text}>{globalState?.userDetails?.userName}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        }
                    </View>

                    {activeInvestment ?
                        <View style={{}}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: 'TimesNewRoman-Medium', fontSize: 20, color: '#000' }}>Hello, {globalState?.userDetails?.userName}</Text>
                                {!activeInvestment ?
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000080' }}>Unlock exclusive privileges with Escape Membership</Text>
                                    :
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000080' }}>Welcome back to your membership</Text>
                                }
                            </View>
                            <ImageBackground resizeMode='stretch' source={{ uri: activeInvestment?.investmentPlan?.investmentPlanCard?.cardBackgroundImage }} borderRadius={20} style={{ width: width * 0.89, borderRadius: 20, padding: 20, gap: 12, marginTop: 10 }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'TimesNewRoman-Bold', fontSize: 24, color: '#AC935C' }}>{activeInvestment?.investmentPlan?.name}</Text>
                                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/membershipLogo.png' }} style={{ width: 34, height: 34 }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                        <View>
                                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color:activeInvestment?.investmentPlan?.name === 'Escape Black' ? '#FFFFFF99' : '#00000099' }}>Member ID</Text>
                                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color:activeInvestment?.investmentPlan?.name === 'Escape Black' ? '#FFFFFF99' : '#000000' }}>{activeInvestment?.investmentId}</Text>
                                        </View>
                                        <View style={{ marginLeft: 50 }}>
                                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color:activeInvestment?.investmentPlan?.name === 'Escape Black' ? '#FFFFFF99' : '#00000099' }}>Validity</Text>
                                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color:activeInvestment?.investmentPlan?.name === 'Escape Black' ? '#FFFFFF99' : '#000000' }}>{activeInvestment?.validityInYears || "10"} Years</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('MembershipProfile', { data: userInvestmentDetails, plan: investmentData });
                                    }} style={{ borderColor: '#E1C38499', borderWidth: 0.5, borderRadius: 5, padding: 8, alignItems: 'center', backgroundColor: '#000', marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#AC935C' }}>View Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                            <View style={{ backgroundColor: '#f6f6f6', borderRadius: 10, flexDirection: 'row', alignItems: 'center', padding: 12, justifyContent: 'space-between', marginTop: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#AC935C1A', borderRadius: 40, alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/stack.png' }} style={{ width: 18, height: 18 }} />
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>Invested Amount</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#AC935C' }}>₹{formatIndianAmount(activeInvestment?.investmentPlan?.minimumInvestment)}</Text>
                                    </View>
                                </View>
                                <View style={{ height: '100%', borderLeftWidth: 0.25 }} />
                                {/* <Image source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/interest-rate.png'}} style={{width:43,height:43}}/> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/membershipLogo.png' }} style={{ width: 20, height: 20 }} />
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000099' }}>• Rewards Active</Text>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000099' }}>• Credits issued yearly</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Your Membership Concept</Text>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000080', marginTop: 5 }}>
                                    Once your <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 10, color: '#000000' }}>{activeInvestment?.investmentPlan?.complimentryStays} complimentary</Text> stays are used, you may proceed to book additional stays using your {activeInvestment?.investmentPlan?.annualCredits} annual credits.
                                </Text>
                                <View style={{ padding: 12, backgroundColor: '#F6F6F6', borderRadius: 15, marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 32, color: '#AC935C' }}>{activeInvestment?.investmentPlan?.annualCredits}</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>Available Credits</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, borderLeftWidth: 0.5, borderColor: '#AC935C80' }}>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 32, color: '#AC935C' }}>{activeInvestment?.totalCreditsUsed}</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>Used Credits</Text>
                                        </View>
                                    </View>

                                    <View style={{ backgroundColor: '#AC935C0D', borderRadius: 10, borderWidth: 0.5, borderColor: '#AC935C4D', padding: 10, marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#AC935C1A', padding: 5, borderRadius: 15 }}>
                                                    <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/credit-card-validation.png' }} style={{ width: 15, height: 15 }} />
                                                </View>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>1 Credit</Text>
                                            </View>
                                            <Ic name={'equals'} size={15} color={'#000'} />
                                            <View style={{ alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#AC935C1A', padding: 5, borderRadius: 15 }}>
                                                    <Icon name={'bed-outline'} size={15} color={'#AC935C'} />
                                                </View>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>1 Night Stay</Text>
                                            </View>
                                            <Ic name={'equals'} size={15} color={'#000'} />
                                            <TouchableOpacity onPress={() => {
                                                setShowRoi(true);
                                            }} style={{ alignItems: 'center' }}>
                                                {/* <View style={{backgroundColor:'#AC935C1A',padding:5,borderRadius:15}}>
                                                    <Icon name={'bed-outline'} size={15} color={'#AC935C'}/>
                                                </View> */}
                                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20, color: '#AC935C' }}>2%</Text>
                                                    <View style={{ backgroundColor: '#FFF', borderRadius: 15, width: 15, height: 15, alignItems: 'center', justifyContent: 'center', marginLeft: 3 }}>
                                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000', marginLeft: 1 }}>i</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>ROI Adjustment</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View>
                            {inProgressInvestment ? (
                                <View style={{ gap: 0 }}>
                                    <ImageBackground resizeMode='stretch' source={{ uri: inProgressInvestment?.investmentPlan?.investmentPlanCard?.cardBackgroundImage }} borderRadius={10} style={{ width: width * 0.89, borderRadius: 20, gap: 12, marginTop: 10 }}>
                                        <View style={{ backgroundColor: inProgressInvestment?.investmentPlan?.investmentPlanCard?.overlayColor || '#000', borderRadius: 10, padding: 20 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: inProgressInvestment?.investmentPlan?.investmentPlanCard?.titleTextColor }}>{inProgressInvestment?.investmentPlan?.investmentPlanCard?.title}</Text>
                                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/membershipLogo.png' }} style={{ width: 34, height: 34 }} />
                                            </View>
                                            <View style={{ width: width * 0.7, marginTop: 0 }}>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: inProgressInvestment?.investmentPlan?.investmentPlanCard?.subtitleTextColor || '#AC935C' }}>{inProgressInvestment?.investmentPlan?.investmentPlanCard?.subtitle}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                    <View style={{ backgroundColor: '#AC935C33', padding: 5, borderRadius: 15, marginRight: 10 }}>
                                                        <Icon name={'gift-outline'} size={15} color={'#AC935C'} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'WorkSans-Regular',
                                                                fontSize: 12,
                                                                color: inProgressInvestment?.investmentPlan?.investmentPlanCard?.descriptionColor || '#FFF',
                                                            }}
                                                        >
                                                            {renderHighlightedText(
                                                                inProgressInvestment?.investmentPlan?.investmentPlanCard?.description,
                                                                inProgressInvestment?.investmentPlan?.investmentPlanCard?.hightlights,
                                                                inProgressInvestment?.investmentPlan?.investmentPlanCard?.hightlightsTextColor,
                                                                inProgressInvestment?.investmentPlan?.investmentPlanCard?.descriptionColor || '#FFF'
                                                            )}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>

                                    <View style={{ backgroundColor: '#f6f6f6', borderRadius: 10, borderWidth: 0.5, borderColor: '#AC935C80', padding: 15, marginTop: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <View style={{ backgroundColor: '#15803D33', padding: 6, borderRadius: 20 }}>
                                                <Icon name="checkmark-circle" size={20} color="#15803D" />
                                            </View>
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 13, color: '#15803D', flex: 1 }}>
                                                Booking amount paid successfully
                                            </Text>
                                        </View>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginTop: 8, lineHeight: 18,textAlign:'center' }}>
                                            {/* Booking amount was paid. Now you just have to pay the rest of the amount within 7 days. */}
                                            Your membership booking amount has been received. Please complete the remaining payment within <Text style={{ fontFamily: 'WorkSans-Bold' }}>7 days</Text> to activate your membership.
                                        </Text>

                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("TranHisForEscape", {data: userInvestmentDetails})
                                        }} style={{backgroundColor:'#000', borderRadius:5,padding:10,alignItems:'center',justifyContent:'center',marginTop:10}}>
                                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#FFF'}}>View Transaction</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                investmentData
                                    ?.filter(item => item?.status === 'active')
                                    ?.map((item, index) => (
                                        <ImageBackground key={index} resizeMode='stretch' source={{ uri: item?.investmentPlanCard?.cardBackgroundImage }} borderRadius={10} style={{ width: width * 0.89, borderRadius: 20, gap: 12, marginTop: 10 }}>
                                            <View style={{ backgroundColor: item?.investmentPlanCard?.overlayColor || '#000', borderRadius: 10, padding: 20 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: item?.investmentPlanCard?.titleTextColor }}>{item?.investmentPlanCard?.title}</Text>
                                                    <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/membershipLogo.png' }} style={{ width: 34, height: 34 }} />
                                                </View>
                                                <View style={{ width: width * 0.7, marginTop: 0 }}>
                                                    {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#AC935C'}}><Text style={{fontFamily:'WorkSans-Regular'}}>Investment:</Text> ₹5,00,000</Text> */}
                                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: item?.investmentPlanCard?.subtitleTextColor || '#AC935C' }}>{item?.investmentPlanCard?.subtitle}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                        <View style={{ backgroundColor: '#AC935C33', padding: 5, borderRadius: 15, marginRight: 10 }}>
                                                            <Icon name={'gift-outline'} size={15} color={'#AC935C'} />
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text
                                                                style={{
                                                                    fontFamily: 'WorkSans-Regular',
                                                                    fontSize: 12,
                                                                    color: item?.investmentPlanCard?.descriptionColor || '#FFF',
                                                                }}
                                                            >
                                                                {renderHighlightedText(
                                                                    item?.investmentPlanCard?.description,
                                                                    item?.investmentPlanCard?.hightlights,
                                                                    item?.investmentPlanCard?.hightlightsTextColor,
                                                                    item?.investmentPlanCard?.descriptionColor || '#FFF'
                                                                )}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    setSelectedPlan(item);
                                                    setInfoVisible(true);
                                                }} style={{
                                                    backgroundColor: item?.investmentPlanCard?.ctaBackgroundColor || '#000',
                                                    borderRadius: 5, alignItems: 'center', marginTop: 15,
                                                    borderColor: item?.investmentPlanCard?.ctaBorderColor || '#E1C38499',
                                                    borderWidth: 0.5, padding: 8
                                                }}>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: item?.investmentPlanCard?.ctaTextColor || '#AC935C' }}>{item?.investmentPlanCard?.ctaText}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </ImageBackground>
                                    ))
                            )}

                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Your Membership Concept</Text>
                                <View style={{ padding: 12, backgroundColor: '#F6F6F6', borderRadius: 15, marginTop: 15 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <View style={{ backgroundColor: '#AC935C', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/earn.png' }} style={{ width: 18, height: 18 }} />
                                            </View>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', marginTop: 5 }}>Earn</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>up to</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 28, color: '#AC935C' }}>8%<Text style={{ fontSize: 14 }}> ROI</Text></Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>Annual</Text>
                                        </View>
                                        <View style={{ borderLeftWidth: 0.4, borderLeftColor: '#00000080', height: '115%' }}>
                                            <View style={{ position: 'absolute', top: '40%', backgroundColor: '#FFF', borderColor: '#AC935C', borderWidth: 0.5, borderRadius: 20, padding: 5, alignSelf: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 11, color: '#00000099' }}>OR</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <View style={{ backgroundColor: '#AC935C', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/redeem.png' }} style={{ width: 18, height: 18 }} />
                                            </View>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', marginTop: 5 }}>Redeem</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>up to</Text>
                                            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 28, color: '#AC935C' }}>4<Text style={{ fontSize: 14 }}> Credits</Text></Text>
                                            </View>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099' }}>Annual</Text>
                                        </View>
                                        <View style={{ borderLeftWidth: 0.4, borderLeftColor: '#00000080', height: '115%' }}>
                                            <View style={{ position: 'absolute', top: '40%', backgroundColor: '#FFF', borderColor: '#AC935C', borderWidth: 0.5, borderRadius: 20, padding: 5, alignSelf: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 11, color: '#00000099' }}>OR</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#AC935C', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/combineBoth.png' }} style={{ width: 18, height: 18 }} />
                                            </View>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', textAlign: 'center', marginTop: 5 }}>Combine</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 15, color: '#000', textAlign: 'center' }}>Both</Text>
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000099', textAlign: 'center', marginTop: 20 }}>Rewards and stays your way!</Text>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: '#AC935C1A', borderRadius: 5, borderColor: '#AC935C80', borderWidth: 0.3, padding: 10, flex: 1, marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#AC935C33', padding: 5, borderRadius: 15, marginRight: 10 }}>
                                                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/credit-card-validation.png' }} style={{ width: 15, height: 15 }} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#AC935C' }}>4 Credits = 4 Nights</Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>Use 1 credit to book 1 night stay.</Text>
                                            </View>
                                        </View>
                                        <View style={{ borderTopColor: '#AC935C80', borderTopWidth: 0.5, marginVertical: 10 }}></View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#AC935C33', padding: 5, borderRadius: 15, marginRight: 10 }}>
                                                <Icc name={'trending-up'} size={15} color={'#AC935C'} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>
                                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', color: '#AC935C' }}>ROI</Text> and <Text style={{ fontFamily: 'WorkSans-SemiBold', color: '#AC935C' }}>Annual</Text> Credits remain the same across both membership plans.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    <View style={{ marginVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Luxury Escape Collection</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <TouchableOpacity onPress={() => setHotelType('Domestic')}
                                style={{
                                    backgroundColor: hotelType === 'Domestic' ? '#AC935C' : 'transparent', borderRadius: 5, paddingHorizontal: 15, paddingVertical: 8, alignItems: 'center',
                                    borderColor: hotelType === 'Domestic' ? '#000' : "", borderWidth: hotelType === 'Domestic' ? 0 : 0.5
                                }}>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: hotelType === 'Domestic' ? '#FFF' : '#000' }}>Domestic</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setHotelType('Global')}
                                style={{
                                    backgroundColor: hotelType === 'Global' ? '#AC935C' : 'transparent',
                                    borderWidth: hotelType === 'Global' ? 0 : 0.5,
                                    borderColor: hotelType === 'Global' ? '#000' : "", borderRadius: 5, paddingHorizontal: 20, paddingVertical: 8, alignItems: 'center', marginLeft: 20
                                }}>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: hotelType === 'Global' ? '#FFF' : '#000' }}>Global</Text>
                            </TouchableOpacity>
                        </View>
                        {hotelType === 'Domestic' ?
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
                                {HotelDetails?.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() =>
                                        navigation.navigate('MembershipProprtyDesc', { data: item, status: activeInvestment?.status || inProgressInvestment?.status, membershipType: activeInvestment?.investmentPlan?.name || inProgressInvestment?.investmentPlan?.name, propertyType: 'Domestic' })
                                    } style={{ borderRadius: 15, width: width * 0.8, height: 180, marginRight: 10 }}>
                                        <Image resizeMode='cover' source={{ uri: item?.images[0] }} style={{ width: '100%', height: '100%', borderRadius: 15 }} />
                                        <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: '#FFFFFF88', borderRadius: 10, padding: 5 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000' }}>1 Credit/Night</Text>
                                        </View>
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, }}>
                                            <LinearGradient colors={['#00000022', '#00000053', '#000']} style={{ padding: 10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ flex: 2 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 10, color: '#FFF' }}>{item?.name} </Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 10, color: '#FFFFFFE6' }}>{item?.location?.address}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ backgroundColor: '#AC935C', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#FFF' }}>Book Now</Text>
                                                    </View>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            :
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
                                {internationalProperties?.map((item, index) => (
                                    <TouchableOpacity
                                        disabled={activeInvestment?.investmentPlan?.name === 'Escape Silver'}
                                    key={index} onPress={() =>
                                        navigation.navigate('MembershipProprtyDesc', { data: item, status: activeInvestment?.status || inProgressInvestment?.status, membershipType: activeInvestment?.investmentPlan?.name || inProgressInvestment?.investmentPlan?.name, propertyType: 'International' })
                                    } style={{ borderRadius: 15, width: width * 0.8, height: 180, marginRight: 10 }}>
                                        <Image resizeMode='cover' source={{ uri: item?.images[0] }} style={{ width: '100%', height: '100%', borderRadius: 15 }} />
                                        <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: '#FFFFFF88', borderRadius: 10, padding: 5 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000' }}>1 Credit/Night</Text>
                                        </View>
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, }}>
                                            <LinearGradient colors={['#00000022', '#00000053', '#000']} style={{ padding: 10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ flex: 2 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 10, color: '#FFF' }}>{item?.name} </Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 10, color: '#FFFFFFE6' }}>{item?.location?.address}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ backgroundColor: '#AC935C', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#FFF' }}>Book Now</Text>
                                                    </View>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                        {activeInvestment?.investmentPlan?.name === 'Escape Silver' &&
                                            <View style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'#000000a0',justifyContent:'center',alignItems:'center',borderRadius:15,paddingHorizontal:20}}>
                                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#FFF',textAlign:'center'}}>🔐 Unlock Global Escapes</Text>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#FFF', textAlign: 'center', marginTop:5 }}>Upgrade to Escape Black to explore handpicked global stays</Text>
                                            </View>
                                        }
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        }
                    </View>

                    <View style={{ marginVertical: 15 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000' }}>Support/Concierge</Text>
                        <View style={{ backgroundColor: '#000', borderRadius: 15, padding: 20, alignItems: 'center', gap: 12, marginVertical: 12 }}>
                            {/* <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#FFFFFF99'}}>Tap to view Email ID</Text> */}
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#FFF', textAlign: 'center' }}>Need assistance with membership benefits? Our concierge team is here to help.</Text>
                            <TouchableOpacity onPress={() => {
                                const phone = (activeInvestment || inProgressInvestment)
                                    ? (selectedPlan?.memberContactNumber || investmentData[0]?.memberContactNumber)
                                    : (selectedPlan?.contactNumber || investmentData[0]?.contactNumber);

                                handleCallNow(phone);
                            }} style={{ backgroundColor: '#AC935C', borderRadius: 5, padding: 5, paddingHorizontal: 10, alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#FFF' }}>Call: + 91 {(activeInvestment || inProgressInvestment) ? (selectedPlan?.memberContactNumber || investmentData[0]?.memberContactNumber) : (selectedPlan?.contactNumber || investmentData[0]?.contactNumber)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <Modal visible={infoVisible} transparent animationType='fade'>
                    {/* <View style={{position:'absolute',bottom:0,left:0,right:0,}}></View> */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, width: '100%', }}
                    >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => { setInfoVisible(false) }} style={{ backgroundColor: '#00000080', flex: 1 }} />
                            <ImageBackground
                                resizeMode='cover'
                                borderRadius={20}
                                source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/EscapeBG.png' }}
                                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.6, width: width, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFF' }}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <TouchableOpacity onPress={() => {
                                        setInfoVisible(false);
                                    }}>
                                        <Icon name={'chevron-back'} size={20} color={'#000'} />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', alignSelf: 'center' }}>Personal Information</Text>

                                    <View style={{ marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Full Name</Text>
                                        <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                            <TextInput
                                                placeholder='John Doe'
                                                placeholderTextColor={'#00000066'}
                                                value={name}
                                                onChangeText={setName}
                                                style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>S/O / D/O</Text>
                                        <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                            <TextInput
                                                placeholder='S/O Joseph'
                                                placeholderTextColor={'#00000066'}
                                                value={parentsName}
                                                onChangeText={setParentsName}
                                                style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Address</Text>
                                        <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                            <TextInput
                                                placeholder='13-89, Churchil Street, Bangalore'
                                                placeholderTextColor={'#00000066'}
                                                value={address}
                                                onChangeText={setAddress}
                                                style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                            />
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', alignItems: 'center', marginVertical: 15, alignSelf: 'center' }}>Bank Details</Text>

                                    <View style={{ marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Account Holder Name</Text>
                                        <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                            <TextInput
                                                placeholder='Joe'
                                                placeholderTextColor={'#00000066'}
                                                value={accHolName}
                                                onChangeText={setAccHolName}
                                                style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Account Number</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                                <TextInput
                                                    placeholder='123456789012'
                                                    placeholderTextColor={'#00000066'}
                                                    value={accNum}
                                                    onChangeText={setAccNum}
                                                    keyboardType='number-pad'
                                                    style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>IFSC Code</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                                <TextInput
                                                    placeholder='HDFC4001'
                                                    placeholderTextColor={'#00000066'}
                                                    value={ifscCode}
                                                    onChangeText={setIfscCode}
                                                    style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Bank Name</Text>
                                        <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                            <TextInput
                                                placeholder='HDFC Bank'
                                                placeholderTextColor={'#00000066'}
                                                value={bankName}
                                                onChangeText={setBankName}
                                                style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                            />
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', alignItems: 'center', marginVertical: 15, alignSelf: 'center' }}>Identity Verification</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Aadhaar Card Number</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                                <TextInput
                                                    placeholder='123456789012'
                                                    placeholderTextColor={'#00000066'}
                                                    keyboardType='number-pad'
                                                    value={aadhar}
                                                    onChangeText={setAadhar}
                                                    style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 15 }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>PAN Card Number</Text>
                                            <View style={{ borderColor: '#00000066', borderWidth: 0.5, borderRadius: 5, marginTop: 10, padding: 15 }}>
                                                <TextInput
                                                    placeholder='ABCPKS1232R'
                                                    placeholderTextColor={'#00000066'}
                                                    value={pan}
                                                    onChangeText={setPan}
                                                    style={{ marginVertical: -5, fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        disabled={loading}
                                        onPress={CreateAgreement}
                                        style={{ backgroundColor: loading ? '#17140d99' : '#AC935C', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20, justifyContent: 'center', overflow: 'hidden' }}
                                    >
                                        {loading ? (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <ActivityIndicator size={'small'} color={'#FFF'} />
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#FFF', marginLeft: 10 }}>
                                                    Generating Agreement...
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#FFF' }}>Continue →</Text>
                                        )}
                                    </TouchableOpacity>
                                </ScrollView>
                            </ImageBackground>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal visible={loading} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ width: 230, backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 25, alignItems: 'center' }}>

                            <ActivityIndicator size="large" color="#AC935C" />

                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000', marginTop: 18 }}>
                                Preparing Agreement
                            </Text>
                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#666', marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
                                Please wait while we generate your agreement securely...
                            </Text>
                        </View>

                    </View>
                </Modal>

                <Modal visible={showFullAgreement} transparent animationType='fade'>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 15, paddingVertical: 20, backgroundColor: '#ac935c', }}>
                            <TouchableOpacity onPress={() => { setShowFullAgreement(false) }}>
                                <Icon name="chevron-back" size={20} color="#ffff" />
                            </TouchableOpacity>
                        </View>
                        <Pdf
                            source={{
                                uri: `data:application/pdf;base64,${agreementBase64}`
                            }}
                            style={{ width: width, height: '100%', backgroundColor: '#FFF' }}
                            trustAllCerts={false}
                            horizontal={false}
                            enablePaging={false}
                            showsVerticalScrollIndicator={true}
                            spacing={10}
                            onLoadComplete={(pages) => { console.log('PDF Pages =>', pages); }}
                            onPageChanged={(page, pages) => { console.log(`${page}/${pages}`); }}
                            onError={(error) => { console.log('PDF ERROR =>', error); }}
                        />
                    </View>
                </Modal>

                <Modal visible={agreementVisible} transparent animationType='fade'>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { setAgreementVisible(false); }}
                        style={{ backgroundColor: '#00000075', flex: 1 }}
                    />
                    <ImageBackground
                        resizeMode='cover'
                        source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/EscapeBG.png' }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.78, width: width, paddingHorizontal: 20, paddingTop: 22, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: 'hidden' }}
                    >

                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    setAgreementVisible(false);
                                    setInfoVisible(true);
                                }}>
                                    <Icon name={'chevron-back'} size={24} color={'#000'} />
                                </TouchableOpacity>

                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000' }}>Review Your Agreement</Text>

                                <View style={{ width: 24 }} />
                            </View>

                            <View style={{ alignItems: 'center', marginTop: 5, paddingHorizontal: 15 }}>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000080', textAlign: 'center' }}>
                                    Kindly check your information in the agreement preview and confirm to continue.
                                </Text>
                            </View>

                            <View style={{ marginTop: 24, borderWidth: 1, borderColor: '#D9C394', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFF', alignSelf: 'center', elevation: 4 }}>
                                {agreementBase64 ? (
                                    <Pdf
                                        source={{
                                            uri: `data:application/pdf;base64,${agreementBase64}`
                                        }}
                                        style={{ width: width * 0.82, height: height * 0.52, backgroundColor: '#FFF' }}
                                        trustAllCerts={false}
                                        horizontal={false}
                                        enablePaging={false}
                                        showsVerticalScrollIndicator={true}
                                        spacing={10}
                                        onLoadComplete={(pages) => { console.log('PDF Pages =>', pages); }}
                                        onPageChanged={(page, pages) => { console.log(`${page}/${pages}`); }}
                                        onError={(error) => { console.log('PDF ERROR =>', error); }}
                                    />
                                ) : (
                                    <View style={{ width: width * 0.82, height: height * 0.52, justifyContent: 'center', alignItems: 'center' }} >
                                        <ActivityIndicator size={'large'} color={'#AC935C'} />
                                    </View>
                                )}

                            </View>

                            {/* TERMS */}

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingHorizontal: 5 }}>

                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { setAgreeToDoc(!agreeToDoc); }}
                                    style={{ marginTop: 2 }}
                                >

                                    {agreeToDoc ? (
                                        <Icon name={'checkbox'} size={20} color={'#021265'} />
                                    ) : (
                                        <Icon name={'square-outline'} size={20} color={'#000'} />
                                    )}

                                </TouchableOpacity>

                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginLeft: 5, flex: 1 }}>
                                    I agree to the{' '}
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Terms & Conditions</Text>
                                    {' '}and{' '}
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Privacy Policy</Text>
                                </Text>

                            </View>

                            {/* CONTINUE BUTTON */}

                            <TouchableOpacity
                                activeOpacity={0.85}
                                disabled={!agreeToDoc}
                                onPress={() => {

                                    if (!agreeToDoc) {
                                        Alert.alert('Agreement Required', 'Please accept Terms & Conditions');
                                        return;
                                    }
                                    setAgreementVisible(false);
                                    setPaymentVisible(true);
                                }}
                                style={{
                                    backgroundColor:
                                        agreeToDoc
                                            ? '#AC935C'
                                            : '#AC935C80',
                                    borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 28, marginBottom: 30
                                }}
                            >
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFF' }}>Continue →</Text>
                            </TouchableOpacity>

                        </ScrollView>

                    </ImageBackground>

                </Modal>

                <Modal visible={paymentVisible} transparent animationType='fade'>
                    <TouchableOpacity onPress={() => { setPaymentVisible(false) }} style={{ backgroundColor: '#00000080', flex: 1 }} />
                    <ImageBackground
                        source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/EscapeBG.png' }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: width, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                    >
                        <View style={{}}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => {
                                    setPaymentVisible(false);
                                    setAgreementVisible(true);
                                }}>
                                    <Icon name={'chevron-back'} size={20} color={'#000'} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000' }}>Payment Method</Text>
                                <View style={{ width: 20 }} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000080', textAlign: 'center' }}>Choose your payment method</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                disabled={paymentLoading}
                                // onPress={setShowBreakDown(true)}
                                onPress={() => setShowBreakDown(true)}
                                style={{ backgroundColor: paymentLoading ? '#AC935C80' : '#AC935C1A', borderRadius: 5, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={{ backgroundColor: '#AC935C33', borderRadius: 20, padding: 7, }}>
                                        <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/tag.png' }} style={{ width: 20, height: 20 }} />
                                    </View>
                                    <View style={{ marginLeft: 15, alignItems: 'center' }}>
                                        {paymentLoading ? (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <ActivityIndicator size={'small'} color={'#FFF'} />
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#FFF', marginLeft: 10 }}>Redirecting...</Text>
                                            </View>
                                        ) : (
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Credit / Debit / UPI/ Net Banking</Text>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#00000080' }}>Including GST & Taxes</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={{ borderWidth: 0.5, padding: 1, borderRadius: 3, marginRight: 10 }}>
                                    <Icon name={'chevron-down'} size={12} color={'#000'} />
                                </View>
                            </TouchableOpacity>

                            {/* {showBreakDown &&
                                <View style={{ marginTop: 15 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000', textAlign: 'center' }}>Payment Breakdown</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Membership Amount</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(membershipAmt)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Platform Fees (2.2%)</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(platform)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>GST charges (18%)</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{gst}</Text>
                                    </View>
                                    <View style={{ borderWidth: 0.5, borderColor: '#0000009b', marginVertical: 10, borderStyle: 'dashed' }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Total Amount</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(totalAmt)}</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        handleInitiatePayment();
                                    }} style={{ backgroundColor: '#AC935C', borderRadius: 5, padding: 10, alignItems: 'center', marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#FFF' }}>Continue</Text>
                                    </TouchableOpacity>

                                </View>
                            } */}

                            {showBreakDown &&
                                <View style={{ marginTop: 15 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000', textAlign: 'center' }}>Payment Breakdown</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Membership Amount</Text>
                                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>₹{formatIndianAmount(membershipAmt)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Platform Fees (2.2%)</Text>
                                        {!selectedPlan?.offer ?
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>₹{formatIndianAmount(platform)}</Text>
                                            :
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <View style={{position:'absolute',alignSelf:'center',justifyContent:'center',borderWidth:0.5,borderColor:'#0000009c',left:-2,right:18,top:10.5,}}></View>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(platform)}</Text>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000',marginLeft:10 }}>{platformFeeFromBackend}</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>GST charges (18%)</Text>
                                        {!selectedPlan?.offer ?
                                            <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>₹{formatIndianAmount(gst)}</Text>
                                            :
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <View style={{position:'absolute',alignSelf:'center',justifyContent:'center',borderWidth:0.5,borderColor:'#0000009c',left:-2,right:18,top:10.5,}}></View>
                                                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(gst)}</Text>
                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000',marginLeft:10 }}>{gstFromBackend}</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={{ borderWidth: 0.5, borderColor: '#0000009b', marginVertical: 10, borderStyle: 'dashed' }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Total Amount</Text>
                                        {!selectedPlan?.offer ?
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>₹{formatIndianAmount(totalAmt)}</Text>
                                            :
                                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>₹{formatIndianAmount(totalAmountFromBackend)}</Text>
                                        }
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        handleInitiatePayment();
                                    }} style={{ backgroundColor: '#AC935C', borderRadius: 5, padding: 10, alignItems: 'center', marginTop: 15 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#FFF' }}>Continue</Text>
                                    </TouchableOpacity>

                                </View>
                            }

                        </View>
                    </ImageBackground>
                </Modal>

                <Modal visible={paymentVerifying} transparent animationType='fade'>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#00000060',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >

                        <View
                            style={{
                                width: 250,
                                backgroundColor: '#FFF',
                                borderRadius: 20,
                                padding: 25,
                                alignItems: 'center'
                            }}
                        >

                            <ActivityIndicator
                                size={'large'}
                                color={'#AC935C'}
                            />

                            <Text
                                style={{
                                    fontFamily: 'WorkSans-SemiBold',
                                    fontSize: 16,
                                    color: '#000',
                                    marginTop: 16
                                }}
                            >
                                Verifying Payment
                            </Text>

                            <Text
                                style={{
                                    fontFamily: 'WorkSans-Regular',
                                    fontSize: 13,
                                    color: '#666',
                                    textAlign: 'center',
                                    marginTop: 8,
                                    lineHeight: 22
                                }}
                            >
                                Please wait while we confirm your transaction securely...
                            </Text>

                        </View>

                    </View>

                </Modal>

                <Modal visible={showRoi} transparent animationType="fade">
                    <TouchableOpacity onPress={() => {
                        setShowRoi(false);
                    }} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ width: width * 0.8, backgroundColor: '#f6f6f6', borderRadius: 12, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, }}>
                            {/* <FastImage
                            source={require('../assets/TickAnim.gif')}
                            style={{ width: 115, height: 115, alignSelf: 'center' }}
                            resizeMode={FastImage.resizeMode.cover}
                        /> */}
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, opacity: 0.8, color: '#000000', textAlign: 'center' }}>
                                Each 1 Credit equals 1 Night Stay. Every credit used reduces your annual rewards by 2%. For example, an 8% annual reward becomes 6% after using 1 credit. <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Complimentary stays must be used first.</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 20,
        alignSelf: 'flex-start',
    },

    card: {
        borderRadius: 20,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        overflow: 'hidden',
    },

    text: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 12,
        color: '#5e390f',
    },

    shineWrapper: {
        position: 'absolute',
        left: -100,
        top: 0,
        bottom: 0,
        width: 80,
        transform: [{ rotate: '20deg' }],
    },

    shine: {
        flex: 1,
    },
});