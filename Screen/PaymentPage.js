import { View, Text, Alert, Dimensions, Linking } from 'react-native';
import React, { useContext, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Back from './Back';
import { CoOwnerBookingverification, PayUPaymentVerify } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentPage(props) {
  //console.log(props?.route?.params?.property);
    const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentHandledRef = useRef(false);
  //const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  //const [Property,setProperty]=useState(props?.route?.params?.property);
  const TxnID = props?.route?.params?.TxnID;
const Property = props?.route?.params?.property;
const Link = props?.route?.params?.Link;
// console.log(Link,"===Link======")
const fractions = props?.route?.params?.numberOfFractions;
const totalAmount = props?.route?.params?.totalAmount;
const location = props?.route?.params?.location;
 const taxAmount = props?.route?.params?.taxAmount;
 const numberParam = props?.route?.params?.Number;      
 const baseAmount = props?.route?.params?.baseAmount;

 const parseNumberValue = value => {
   if (typeof value === 'number') return value;
   if (typeof value === 'string') {
     const cleaned = value.replace(/,/g, '').trim();
     const parsed = globalThis.Number(cleaned);
     return Number.isNaN(parsed) ? 0 : parsed;
   }
   return 0;
 };
        
 const getApiResult = response => {
   if (!response) return null;
   return response?.data ?? response;
 };

const HandlePayUPaymentVerify = async (paymentStatus) => {
  if (paymentHandledRef.current) {
    console.log('Payment verification already handled for this transaction. Ignoring duplicate event.');
    return;
  }
  paymentHandledRef.current = true;
  setLoading(false);
  console.log('STEP 1');

  let bookingId = null;
  let time = null;
  let paymentVerification = null;
  let bookingResponse = null;

  try {
    // Step 1: Verify Payment
    console.log('Before PayUPaymentVerify', { TxnID });

    const timeoutMs = 20000;
    let paymentVerifyTimer;
    paymentVerification = await Promise.race([
      PayUPaymentVerify({ txnID: TxnID }),
      new Promise((_, reject) => {
        paymentVerifyTimer = setTimeout(
          () => reject(new Error(`PayUPaymentVerify timeout after ${timeoutMs}ms`)),
          timeoutMs,
        );
      }),
    ]);
    clearTimeout(paymentVerifyTimer);

    console.log('After PayUPaymentVerify', { paymentVerification });

    const paymentResult = getApiResult(paymentVerification);
    const verifySuccess =
      paymentResult?.success === true ||
      paymentResult?.success?.toString().toLowerCase() === 'success' ||
      paymentResult?.status?.toString().toLowerCase() === 'success' ||
      paymentResult?.payment?.status?.toString().toLowerCase() === 'success';

    bookingId = paymentResult?.payment?._id;
    time = paymentResult?.payment?.responseDetails?.addedon;

    const missingData = [];
    if (!Property) missingData.push('Property');
    if (!globalState?.userDetails) missingData.push('globalState.userDetails');
    if (!TxnID) missingData.push('TxnID');
    if (missingData.length) {
      console.warn('Missing required booking payload data:', missingData.join(', '), {
        Property,
        userDetails: globalState?.userDetails,
        TxnID,
      });
    }

    const normalizedFractionValue = parseNumberValue(Property?.FC_Price);
    const normalizedBookingAmount = parseNumberValue(Property?.BookingAmount);
    const normalizedPrice = parseNumberValue(Property?.Price);

    const payload = JSON.stringify({
      propertyName: Property?.name,
      propertyId: Property?._id,
      email: globalState?.userDetails?.email,
      fractionValue: normalizedFractionValue,
      numberOfFractions: Property?.numberOfFractions || 1,
      totalBookingAmount: normalizedBookingAmount,
      Price: normalizedPrice,
      FC_Price: normalizedFractionValue,
      termsAndConditions: true,
      payUpayment: [
        {
          txnId: TxnID,
          amount: normalizedBookingAmount,
          username: globalState?.userDetails?.email,
          status: paymentStatus,
          mihpayid: 'MHP12345',
        },
      ],
      bookingStatus: paymentStatus,
      statusKey: 'BOOK123',
    });

    // Step 3: Call Booking API
    console.log('Before CoOwnerBookingverification', { payload });
    let bookingVerifyTimer;
    bookingResponse = await Promise.race([
      CoOwnerBookingverification(payload),
      new Promise((_, reject) => {
        bookingVerifyTimer = setTimeout(
          () => reject(new Error(`CoOwnerBookingverification timeout after ${timeoutMs}ms`)),
          timeoutMs,
        );
      }),
    ]);
    clearTimeout(bookingVerifyTimer);
    console.log('After CoOwnerBookingverification', { bookingResponse });

    const bookingResult = getApiResult(bookingResponse);
    const bookingSuccess =
      bookingResult?.success === true || bookingResult?.data?.success === true;
    const bookingData = bookingResult?.data ?? bookingResult;
    const finalSuccess =
      paymentStatus?.toString().toLowerCase() === 'success' &&
      verifySuccess &&
      bookingSuccess;

    console.log('Before navigation.replace', {
      finalSuccess,
      paymentStatus,
      verifySuccess,
      bookingSuccess,
      txnId: TxnID,
      property: Property,
    });

    navigation.replace('PaymentSummary', {
      success: finalSuccess,
      paymentStatus,
      verifySuccess,
      bookingSuccess,
      txnId: TxnID,
      property: Property,
      bookingData: bookingData,
      totalAmount: totalAmount,
      taxAmount: taxAmount,
      Number: numberParam,
      baseAmount: baseAmount,
      location: location,
      bookingId: bookingId,
      time: time,
      message: finalSuccess
        ? 'Booking confirmed successfully.'
        : bookingData?.message ||
          'Booking failed. Please contact support.',
    });

    console.log('STEP 5');
  } catch (error) {
    console.error('HandlePayUPaymentVerify error', error);
    console.error('HandlePayUPaymentVerify error response data', error?.response?.data);
    console.error('HandlePayUPaymentVerify error message', error?.message);

    if (error?.message?.includes('timeout')) {
      console.warn('Payment verification timeout triggered. Navigating to PaymentSummary with failure state.');
    }

    console.log('Before navigation.replace on error', {
      paymentStatus,
      txnId: TxnID,
      property: Property,
      bookingId,
      time,
    });

    navigation.replace('PaymentSummary', {
      success: false,
      paymentStatus,
      txnId: TxnID,
      property: Property,
      totalAmount: totalAmount,
      taxAmount: taxAmount,
      Number: numberParam,
      baseAmount: baseAmount,
      location: location,
      bookingId: bookingId,
      time: time,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.',
    });
  }
};

const handleNavigationStateChange = (state) => {
  console.log('WEBVIEW URL =>', state.url);
  if (paymentHandledRef.current) {
    console.log('WebView navigation ignored because payment has already been handled.');
    return;
  }

  if (state.url.includes('paymentfailure')) {
    console.log('Detected paymentfailure URL, triggering verification and stopping loader.');
    setLoading(false);
    HandlePayUPaymentVerify('Failed');
    return;
  }

  if (state.url.includes('paymentsuccess')) {
    console.log('Detected paymentsuccess URL, triggering verification and stopping loader.');
    setLoading(false);
    HandlePayUPaymentVerify('Success');
    return;
  }

  setPageUrl(state.url);
};


  const handlePageLoad = () => {
    setLoading(false);
  };
  
  return (
   <SafeAreaView style={{flex: 1,}}>
      {/* <Back title={""}/> */}
  <WebView 
    source={{html:Link}} 
    style={{ width:'100%'}} scalesPageToFit={false} 
    onNavigationStateChange={handleNavigationStateChange}
    onShouldStartLoadWithRequest={(request) => {
      const url = request.url;

      if (
        url.startsWith('upi://') ||
        url.startsWith('intent://')
      ) {
        Linking.openURL(url);
        return false;
      }

      return true;
    }}
    javaScriptEnabled={true}
    domStorageEnabled={true}
    originWhitelist={['*']}
    onLoad={handlePageLoad}
  />
    </SafeAreaView>
  )
}