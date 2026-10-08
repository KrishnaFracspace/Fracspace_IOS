import { View, Text, Alert, Dimensions, Linking, BackHandler, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { CoOwnerBookingverification, PayUPaymentVerify } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

// PayU verification is retried (Android flow): the redirect can land before the
// gateway has settled the transaction.
const VERIFY_ATTEMPTS = 3;
const VERIFY_RETRY_DELAY_MS = 2000;
const API_TIMEOUT_MS = 20000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const withTimeout = (promise, label) => {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${label} timeout after ${API_TIMEOUT_MS}ms`)),
        API_TIMEOUT_MS,
      );
    }),
  ]).finally(() => clearTimeout(timer));
};

// PayU's own "cancel" navigation (e.g. https://secure.payu.in/cancel?status=cancel...).
// It is handled in-app instead of loading another gateway page, so a failed
// load there can't strand the user on an error page.
const isPayUCancel = url =>
  /payu\.in\/cancel/i.test(url) || (/payu/i.test(url) && /[?&](amp;)?status=cancel/i.test(url));

import { trackCheckoutStarted } from './utils/analytics';
// Android intent:// links -> plain upi:// (shared with the concert and Escape pages).
import { toPaymentAppUrl } from './utils/upiLink';

export default function PaymentPage(props) {
  //console.log(props?.route?.params?.property);
    const {globalState, setGlobalState} = useContext(AppContext);
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const paymentHandledRef = useRef(false);
  //const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  //const [Property,setProperty]=useState(props?.route?.params?.property);
  const TxnID = props?.route?.params?.TxnID;
const Property = props?.route?.params?.property;
const Link = props?.route?.params?.Link;
// console.log(Link,"===Link======")
const totalAmount = props?.route?.params?.totalAmount;
const location = props?.route?.params?.location;
 const taxAmount = props?.route?.params?.taxAmount;
 const numberParam = props?.route?.params?.Number;
 const baseAmount = props?.route?.params?.baseAmount;

 // Analytics funnel: property booking reached the payment gateway.
 useEffect(() => {
   trackCheckoutStarted('property', parseFloat(totalAmount));
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // The PayU form is loaded with the gateway's own origin so its POST is
 // same-origin and its cookies first-party (Android WebView blocks
 // third-party cookies and the gateway then reports a failed payment).
 const payuOrigin = (() => {
   const m = /action\s*=\s*["'](https?:\/\/[^/"']+)/i.exec(String(Link || ''));
   return m ? m[1] : undefined;
 })();

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

  /* ---------------- BACK BUTTON (CANCEL PAYMENT) ---------------- */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // Once the gateway has redirected we are verifying/booking: block back.
      if (paymentHandledRef.current) return true;
      Alert.alert(
        'Cancel Payment?',
        'If you go back, payment will be cancelled.',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => navigation.goBack() },
        ],
      );
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  /* ---------------- VERIFY WITH PAYU (3 tries, 2 s apart) ---------------- */
  const verifyWithPayU = async (redirectStatus) => {
    let lastPayment = null;
    for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        await delay(VERIFY_RETRY_DELAY_MS);
      }
      try {
        const response = await withTimeout(
          PayUPaymentVerify({ txnID: TxnID }),
          'PayUPaymentVerify',
        );
        const payment = getApiResult(response)?.payment;
        if (payment) lastPayment = payment;
        const status = payment?.responseDetails?.status?.toString().toLowerCase();
        if (status === 'success') {
          return { payment, success: true };
        }
        // A failure redirect confirmed as failed by PayU is final.
        if (redirectStatus === 'Failed' && status === 'failure') break;
      } catch (error) {
        console.log('PayUPaymentVerify attempt failed', attempt + 1, error?.response?.data || error?.message);
      }
    }
    return { payment: lastPayment, success: false };
  };

const HandlePayUPaymentVerify = async (paymentStatus, { cancelled = false } = {}) => {
  if (paymentHandledRef.current) {
    console.log('Payment verification already handled for this transaction. Ignoring duplicate event.');
    return;
  }
  paymentHandledRef.current = true;
  setLoading(false);
  setVerifying(true);
  navigation.setOptions?.({ gestureEnabled: false });

  const fracCount = globalThis.Number(numberParam) || 1;
  let bookingId = null;
  let time = null;
  let paidAmount = null;

  const summaryParams = {
    paymentStatus,
    txnId: TxnID,
    property: Property,
    taxAmount: taxAmount,
    Number: numberParam,
    baseAmount: baseAmount,
    location: location,
  };

  try {
    // Step 1: Verify payment with PayU
    const { payment, success: verifySuccess } = await verifyWithPayU(paymentStatus);

    bookingId = payment?._id;
    time = payment?.responseDetails?.addedon;
    if (payment?.amount != null) {
      paidAmount = Math.round(parseNumberValue(payment.amount));
    }

    if (!payment) {
      // PayU could not be reached: do not record anything we cannot confirm.
      navigation.replace('PaymentSummary', {
        ...summaryParams,
        success: false,
        verifySuccess: false,
        bookingSuccess: false,
        totalAmount: totalAmount,
        bookingId,
        time,
        message: cancelled
          ? 'Payment was cancelled.'
          : 'We could not confirm your payment. If money was deducted, please contact support with your Transaction ID.',
      });
      return;
    }

    const missingData = [];
    if (!Property) missingData.push('Property');
    if (!globalState?.userDetails) missingData.push('globalState.userDetails');
    if (!TxnID) missingData.push('TxnID');
    if (missingData.length) {
      console.warn('Missing required booking payload data:', missingData.join(', '));
    }

    const normalizedFractionValue = parseNumberValue(Property?.FC_Price);
    const normalizedPrice = parseNumberValue(Property?.Price);
    const recordedAmount = paidAmount ?? 0;
    const bookingStatus = verifySuccess ? 'Success' : 'Failed';

    // Step 2: Record the booking (verified failures are recorded as 'Failed')
    const payload = JSON.stringify({
      propertyName: Property?.name,
      propertyId: Property?._id,
      email: globalState?.userDetails?.email,
      fractionValue: normalizedFractionValue,
      numberOfFractions: fracCount,
      totalBookingAmount: recordedAmount,
      Price: normalizedPrice,
      FC_Price: normalizedFractionValue,
      termsAndConditions: true,
      payUpayment: [
        {
          txnId: TxnID,
          amount: recordedAmount,
          username: globalState?.userDetails?.email,
          status: payment?.responseDetails?.status,
          mihpayid: payment?.responseDetails?.mihpayid,
        },
      ],
      bookingStatus: bookingStatus,
      statusKey: 'BOOK123',
    });

    let bookingResult = null;
    let bookingError = null;
    try {
      const bookingResponse = await withTimeout(
        CoOwnerBookingverification(payload),
        'CoOwnerBookingverification',
      );
      bookingResult = getApiResult(bookingResponse);
    } catch (error) {
      bookingError = error;
      console.error('CoOwnerBookingverification error', error?.response?.data || error?.message);
    }

    const bookingSuccess =
      bookingResult?.success === true || bookingResult?.data?.success === true;
    const bookingData = bookingResult?.data ?? bookingResult;
    const finalSuccess = verifySuccess && bookingSuccess;

    let message;
    if (finalSuccess) {
      message = 'Booking confirmed successfully.';
    } else if (verifySuccess) {
      message =
        'Payment received but the booking could not be confirmed. Please contact support with your Transaction ID.';
    } else {
      message =
        bookingError?.response?.data?.message ||
        bookingData?.message ||
        'Payment failed. Any amount deducted will be refunded to the source account within 5-6 working days.';
    }

    navigation.replace('PaymentSummary', {
      ...summaryParams,
      success: finalSuccess,
      verifySuccess,
      bookingSuccess,
      bookingData: bookingData,
      totalAmount: paidAmount ?? totalAmount,
      bookingId: bookingData?._id || bookingId,
      time: time,
      message,
    });
  } catch (error) {
    console.error('HandlePayUPaymentVerify error', error?.response?.data || error?.message);

    navigation.replace('PaymentSummary', {
      ...summaryParams,
      success: false,
      totalAmount: paidAmount ?? totalAmount,
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
  const url = state?.url || '';
  if (paymentHandledRef.current) {
    return;
  }

  if (url.includes('paymentfailure')) {
    setLoading(false);
    HandlePayUPaymentVerify('Failed');
    return;
  }

  if (isPayUCancel(url)) {
    setLoading(false);
    HandlePayUPaymentVerify('Failed', { cancelled: true });
    return;
  }

  if (url.includes('paymentsuccess')) {
    setLoading(false);
    HandlePayUPaymentVerify('Success');
    return;
  }

  setPageUrl(url);
};

  /* ---------------- HANDLE UPI / INTENT ---------------- */
  const onShouldStartLoadWithRequest = (request) => {
    const url = request?.url || '';

    // User cancelled on the gateway: settle it here rather than loading PayU's
    // cancel page.
    if (isPayUCancel(url)) {
      if (!paymentHandledRef.current) {
        HandlePayUPaymentVerify('Failed', { cancelled: true });
      }
      return false;
    }

    // Web pages stay in the WebView.
    if (/^(https?|about|data|blob|javascript):/i.test(url)) {
      return true;
    }

    // Anything else is a hand-off to a payment app (upi://, phonepe://,
    // tez://, paytmmp://, intent://...). Matching on the scheme means a new
    // wallet works without a code change.
    Linking.openURL(toPaymentAppUrl(url)).catch(() =>
      Alert.alert(
        'UPI App Not Found',
        'Please install a UPI app to continue payment.',
      ),
    );
    return false;
  };

  const handlePageLoad = () => {
    setLoading(false);
  };

  return (
   <SafeAreaView style={{flex: 1,}}>
  <WebView
    source={{html:Link, baseUrl: payuOrigin}}
    style={{ width:'100%'}} scalesPageToFit={false}
    onNavigationStateChange={handleNavigationStateChange}
    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    javaScriptEnabled={true}
    domStorageEnabled={true}
    originWhitelist={['*']}
    setSupportMultipleWindows={false}
    thirdPartyCookiesEnabled
    sharedCookiesEnabled
    javaScriptCanOpenWindowsAutomatically
    mixedContentMode="compatibility"
    onLoad={handlePageLoad}
    renderError={(domain, code, description) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' }}>
        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000', textAlign: 'center' }}>
          Couldn't load the payment page
        </Text>
        <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#00000099', marginTop: 8, textAlign: 'center' }}>
          Please check your internet connection and try again.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, backgroundColor: '#021265', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 }}>
          <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#FFFFFF' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    )}
  />
  {verifying && (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <ActivityIndicator size="large" color="#021265" />
      <Text
        style={{
          fontFamily: 'WorkSans-Medium',
          fontSize: 14,
          color: '#000000',
          marginTop: 15,
          textAlign: 'center',
        }}>
        Confirming your payment...
      </Text>
      <Text
        style={{
          fontFamily: 'WorkSans-Regular',
          fontSize: 12,
          color: '#00000099',
          marginTop: 5,
          textAlign: 'center',
        }}>
        Please don't close the app or press back.
      </Text>
    </View>
  )}
    </SafeAreaView>
  )
}
