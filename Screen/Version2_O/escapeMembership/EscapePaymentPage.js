import React, {
    useEffect,
    useState
} from 'react';

import {
    View,
    Alert,
    BackHandler,
    Linking,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from 'react-native';

import { WebView } from 'react-native-webview';

import AsyncStorage
from '@react-native-async-storage/async-storage';

import Icon
from 'react-native-vector-icons/Ionicons';
import { verifyPaymentForEscape } from '../../Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const EscapePaymentPage = ({
    route,
    navigation
}) => {

    const {
        Link,
        TxnID,
        investmentData
    } = route.params;

    const [loading, setLoading] =
        useState(true);

    const [verifying, setVerifying] =
        useState(false);

    // ========================================
    // STORE PENDING TXN
    // ========================================

    useEffect(() => {

        AsyncStorage.setItem(
            'ESCAPE_PENDING_TXN',
            TxnID
        );

    }, []);

    // ========================================
    // HANDLE BACK
    // ========================================

    useEffect(() => {

        const backHandler =
            BackHandler.addEventListener(
                'hardwareBackPress',
                () => {

                    Alert.alert(
                        'Cancel Payment?',
                        'If you go back, payment may remain incomplete.',
                        [
                            {
                                text: 'Stay',
                                style: 'cancel'
                            },
                            {
                                text: 'Exit',
                                onPress: async () => {

                                    // await verifyPaymentStatus();
                                    navigation.goBack();
                                }
                            }
                        ]
                    );

                    return true;
                }
            );

        return () => backHandler.remove();

    }, []);

    const verifyPaymentStatus = async () => {

        // prevent multiple calls

        // if (paymentHandled) {
        //     return;
        // }

        // setPaymentHandled(true);

        try {

            setVerifying(true);

            const { data: res } =
                await verifyPaymentForEscape({
                    txnID: TxnID
                });

            console.log(
                'VERIFY RESPONSE =>',
                JSON.stringify(res, null, 2)
            );

            const isPaymentSuccess =
                res?.success === true &&
                (res?.investment?.status === 'active' || res?.investment?.status === 'inProgress') &&
                res?.investment?.paymentProof?.paymentStatus === 'paid';

            // setShowPaymentWebview(false);

            if (isPaymentSuccess) {

                navigation.replace(
                    'PaymentSuccessEscape',
                    {
                        paymentData: res,
                        investmentData
                    }
                );

            } else {

                navigation.replace(
                    'PaymentFailedEscape',
                    {
                        paymentData: res,
                        investmentData
                    }
                );
            }

        } catch (error) {

            console.log(
                'VERIFY ERROR =>',
                error?.response?.data || error
            );

            // setShowPaymentWebview(false);

            navigation.replace(
                'PaymentFailedEscape',
                {
                    investmentData
                }
            );

        } finally {

            setVerifying(false);
        }
    };

    const onShouldStartLoadWithRequest = (request) => {
        const url = request.url;
        console.log(
            'WEBVIEW REQUEST =>',
            url
        );

        // allow normal urls

        if ( url.startsWith('http://') || url.startsWith('https://')) {
            return true;
        }

        // handle UPI apps

        if (
            url.startsWith('upi://') ||
            url.startsWith('intent://') ||
            url.includes('phonepe') ||
            url.includes('paytm') ||
            url.includes('tez') ||
            url.includes('gpay') ||
            url.includes('bhim')
        ) {

            Linking.openURL(url)
                .catch(() => {

                    Alert.alert(
                        'UPI App Not Found',
                        'Please install a UPI app to continue.'
                    );
                });

            return false;
        }

        return true;
    };

    // ========================================
    // NAVIGATION CHANGE
    // ========================================

    const onNavigationStateChange = async (state) => {
        const url = state?.url?.toLowerCase() || '';
        console.log('CURRENT URL =>', url);
        if (
            url.includes('paymentsuccess') ||
            url.includes('payment-success') ||
            url.includes('success')
        ) {

            await verifyPaymentStatus();
        }
        else if (
            url.includes('paymentfailure') ||
            url.includes('payment-failure') ||
            url.includes('failure')
        ) {

            await verifyPaymentStatus();
        }
    };

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#000'}}>

            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFF'
                }}
            >

                {/* HEADER */}

                {/* <View
                    style={{
                        paddingTop: 55,
                        paddingHorizontal: 20,
                        paddingBottom: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderColor: '#EEE'
                    }}
                >

                    <TouchableOpacity
                        onPress={() => {

                            Alert.alert(
                                'Exit Payment?',
                                'Did you complete the payment?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel',
                                        onPress: () => {
                                            navigation.goBack();
                                        }
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {

                                            await verifyPaymentStatus();
                                        }
                                    }
                                ]
                            );
                        }}
                    >

                        <Icon
                            name={'close'}
                            size={24}
                            color={'#000'}
                        />

                    </TouchableOpacity>

                    <Text
                        style={{
                            fontFamily: 'WorkSans-SemiBold',
                            fontSize: 16,
                            color: '#000'
                        }}
                    >
                        Complete Payment
                    </Text>

                    <View style={{ width: 24 }} />

                </View> */}

                {/* WEBVIEW */}

                <WebView
                    source={{html: Link }}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                    startInLoadingState
                    onShouldStartLoadWithRequest={
                        onShouldStartLoadWithRequest
                    }
                    onNavigationStateChange={
                        onNavigationStateChange
                    }
                    renderLoading={() => (
                        <View style={{flex: 1,justifyContent: 'center',alignItems: 'center' }}>
                            <ActivityIndicator size={'large'} color={'#AC935C'}/>
                            <Text style={{marginTop: 15,fontFamily: 'WorkSans-Medium',fontSize: 14,color: '#000' }}>
                                Loading Payment Gateway...
                            </Text>
                        </View>
                    )}

                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.log('WEBVIEW ERROR URL =>',nativeEvent?.url);
                        console.log('WEBVIEW ERROR DESC =>',nativeEvent?.description);
                        // Ignore dummy success/failure URL errors

                        if (nativeEvent?.url?.includes('paymentsuccess') ||nativeEvent?.url?.includes('paymentfailure')
                        ) {
                            return;
                        }
                        // Alert.alert('Payment Error','Unable to load payment page');
                    }}
                />

                {/* VERIFY LOADER */}

                {verifying && (

                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#00000060',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >

                        <View
                            style={{
                                backgroundColor: '#FFF',
                                padding: 25,
                                borderRadius: 16,
                                alignItems: 'center'
                            }}
                        >

                            <ActivityIndicator
                                size={'large'}
                                color={'#AC935C'}
                            />

                            <Text
                                style={{
                                    marginTop: 15,
                                    fontFamily: 'WorkSans-SemiBold',
                                    fontSize: 15,
                                    color: '#000'
                                }}
                            >
                                Verifying Payment...
                            </Text>

                        </View>

                    </View>

                )}

            </View>
        </SafeAreaView>
    );
};

export default EscapePaymentPage;