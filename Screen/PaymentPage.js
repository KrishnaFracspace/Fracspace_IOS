import { View, Text, Alert, Dimensions } from 'react-native';
import React, { useContext, useState } from 'react';
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
  //const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  //const [Property,setProperty]=useState(props?.route?.params?.property);
  const TxnID = props?.route?.params?.TxnID;
const Property = props?.route?.params?.property;
const Link = props?.route?.params?.Link;
const fractions = props?.route?.params?.numberOfFractions;
const totalAmount = props?.route?.params?.totalAmount;
const location = props?.route?.params?.location;
 const taxAmount = props?.route?.params?.taxAmount;
 const Number = props?.route?.params?.Number;      
 const baseAmount = props?.route?.params?.baseAmount;
        

const HandlePayUPaymentVerify = async (paymentStatus) => {
  try {
    // Step 1: Verify Payment
    const paymentVerification = await PayUPaymentVerify({ txnID: TxnID });
    let verifySuccess = paymentVerification?.success || paymentVerification?.status == 'success';
//console.log(paymentVerification?.data?.payment?._id,"===paymentVerification-----------999")
const bookingId = paymentVerification?.data?.payment?._id
const time =  paymentVerification?.data?.payment?.responseDetails?.addedon

let payload = JSON.stringify({
  propertyName: Property?.name,
  propertyId: Property?._id,
  email: globalState?.userDetails?.email,
  fractionValue: Property?.FC_Price,
  numberOfFractions: Property?.numberOfFractions || 1,
  totalBookingAmount: Property?.BookingAmount,
  Price: Property?.Price,
  FC_Price: Property?.FC_Price,
  termsAndConditions: true,
  payUpayment: [
    {
      txnId: TxnID,
      amount: Property?.BookingAmount,
      username: globalState?.userDetails?.email,
      status: paymentStatus,
      mihpayid: "MHP12345",
    },
  ],
  bookingStatus: paymentStatus,
  statusKey: "BOOK123",
});

    // Step 3: Call Booking API
    let bookingResponse = await CoOwnerBookingverification(payload);
    let bookingSuccess = bookingResponse?.success || bookingResponse?.data?.success;
    const bookingData = bookingResponse?.data;

    // ✅ Final Success Logic
    let finalSuccess =
      paymentStatus === "Success" &&
      verifySuccess &&
      bookingSuccess;

    navigation.replace("PaymentSummary", {
      success: finalSuccess,
      paymentStatus,
      verifySuccess,
      bookingSuccess,
      txnId: TxnID,
      property: Property,
      bookingData: bookingResponse?.data,
        totalAmount:totalAmount,
          taxAmount:taxAmount,
          Number:Number,
          baseAmount:baseAmount,
          location:location,
          bookingId:bookingId,
          time:time,
      message: finalSuccess
        ? "Booking confirmed successfully."
        : bookingResponse?.data?.message ||
          "Booking failed. Please contact support.",
    });

  } catch (error) {
    navigation.replace("PaymentSummary", {
      success: false,
      paymentStatus,
      txnId: TxnID,
      property: Property,
        totalAmount:totalAmount,
          taxAmount:taxAmount,
          Number:Number,
          baseAmount:baseAmount,
          location:location,
          bookingId:bookingId,
          time:time,
      message:
        error?.response?.data?.message ||
        "Something went wrong. Please try again.",
    });
  }
};

const handleNavigationStateChange = (state) => {
  if (state.url.includes("paymentfailure")) {
    HandlePayUPaymentVerify("Failed");
  }
  if (state.url.includes("paymentsuccess")) {
    HandlePayUPaymentVerify("Success");
  }
  setPageUrl(state.url);
};

  const handlePageLoad = () => {
    setLoading(false);
  };
  
  return (
   <SafeAreaView style={{flex: 1,}}>
      {/* <Back title={""}/> */}
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
    </SafeAreaView>
  )
}