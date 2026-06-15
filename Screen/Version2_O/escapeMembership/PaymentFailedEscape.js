import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const PaymentFailedEscape = (props) => {
    const [paymentData, setPaymentData] = useState(props?.route?.params?.paymentData?.investment || props?.route?.params?.paymentData);
    console.log("Payment Data: ", props?.route?.params?.paymentData?.investment || props?.route?.params?.paymentData);
    const navigation = useNavigation();

    const paidAmount = paymentData?.paymentProof?.bookingAmount || 0;
    const gst = paymentData?.paymentProof?.gst;
    const serviceFee = paymentData?.paymentProof?.serviceFee;
    console.log("Paid Amount: ", paidAmount, "GST: ", gst, "Service Fee: ", serviceFee);
    const totalCharges = (gst || 0) + (serviceFee || 0);
    const totalAmount = paidAmount + (gst || 0) + (serviceFee || 0);

    const formatDateTime = isoDate => {
        const date = new Date(isoDate);

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return `${formattedDate} | ${formattedTime}`;
    };

    // Usage
    const date = formatDateTime(paymentData?.updatedAt || paymentData?.createdAt);

    // console.log(date);
    const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
    };

    // const gst = paymentData?.paymentProof?.paidAmount - paymentData?.principalAmount

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4EE" />
      <ImageBackground source={{uri:'https://duixj37yn5405.cloudfront.net/appImages/BGHome.png'}} style={{flex:1}}>
        <ScrollView
            contentContainerStyle={{paddingBottom: 30}}
            showsVerticalScrollIndicator={false}>

            {/* Top Section */}
            <View style={styles.topContainer}>
                <View style={styles.checkOuter}>
                    {/* <View style={styles.checkInner}> */}
                    {/* <Text style={styles.check}>✓</Text> */}
                    <Icon name={'triangle-exclamation'} size={20} color={'#DB0004'}/>
                    {/* </View> */}
                </View>

                <Text style={styles.successText}>Payment Failed</Text>

                <Text style={styles.desc}>
                    Your transaction was not successful. 
                </Text>

                <Text style={styles.desc}>
                    Please try again to activate your Escape Membership.
                </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>

            {/* Golden Top Line */}
            <View style={styles.topLine} />

            <Text style={styles.summaryTitle}>PAYMENT SUMMARY</Text>

            <Text style={styles.date}>
                {date}
            </Text>

            {/* Row 1 */}
            <View style={styles.row}>
                <Text style={styles.label}>Booking Amount</Text>
                <Text style={styles.value}>₹{formatIndianAmount(paidAmount)}</Text>
            </View>

            <View style={styles.divider} />

            {/* Row 2 */}
            <View style={styles.row}>
                <Text style={styles.label}>Tax & GST Charges</Text>
                <Text style={styles.value}>₹{formatIndianAmount(totalCharges)}</Text>
            </View>

            <View style={styles.divider} />

            {/* Total Amount Box */}
            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>

                <Text style={styles.totalAmount}>
                    ₹ {formatIndianAmount(totalAmount)}
                </Text>
            </View>

            {/* Transaction */}
            <View style={styles.transactionContainer}>
                <Text style={styles.transactionLabel}>
                TRANSACTION ID
                </Text>

                <Text style={styles.transactionId}>
                    {paymentData?.paymentProof?.txnId}
                </Text>
            </View>
            </View>

            {/* Buttons */}
            {/* <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadText}>
                Download Receipt
            </Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => {navigation.replace('MembershipHome')}} style={styles.homeBtn}>
            <Text style={styles.homeText}>
                Back to Home
            </Text>
            </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default PaymentFailedEscape;

const GOLD = '#AC935C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4EE',
  },

  topContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },

  checkOuter: {
    height: 55,
    width: 55,
    borderRadius: 37,
    borderWidth: 1,
    borderColor: '#F012121A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F012120D',
  },

  checkInner: {
    // height: 30,
    // width: 30,
    padding:5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    fontSize: 20,
    color: GOLD,
    fontWeight: '700',
  },

  successText: {
    fontFamily:'WorkSans-SemiBold',
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 15,
  },

  desc: {
    fontFamily:'WorkSans-Regular',
    fontSize: 12,
    color: '#00000080',
    marginTop: 5,
    textAlign: 'center',
    // lineHeight: 20,
  },

  card: {
    marginTop: 36,
    marginHorizontal: 20,
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingBottom: 32,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  topLine: {
    height: 10,
    backgroundColor: GOLD,
    marginHorizontal: -22,
    marginBottom: 15,
  },

  summaryTitle: {
    fontFamily:'WorkSans-SemiBold',
    fontSize: 14,
    color: GOLD,
    textAlign: 'center',
    letterSpacing: 2,
  },

  date: {
    fontFamily:'WorkSans-Medium',
    fontSize: 12,
    color: '#00000080',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    fontWeight: '500',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontFamily:'WorkSans-Regular',
    fontSize: 12,
    color: '#00000080',
  },

  value: {
    fontFamily:'WorkSans-Medium',
    fontSize: 14,
    // fontWeight: '700',
    color: '#000000',
  },

  divider: {
    height: 1,
    backgroundColor: '#E6DDCB',
    marginVertical: 10,
  },

  totalBox: {
    backgroundColor: '#F4F1EC',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },

  totalLabel: {
    fontFamily:'WorkSans-Medium',
    fontSize: 14,
    color: '#00000080',
    // fontWeight: '600',
    marginBottom: 5,
  },

  totalAmount: {
    fontFamily:'WorkSans-SemiBold',
    fontSize: 32,
    // fontWeight: '700',
    color: '#DB0004',
  },

  transactionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  transactionLabel: {
    fontFamily:'WorkSans-Regular',
    fontSize: 12,
    color: '#00000080',
    // letterSpacing: 1,
    marginBottom: 10,
  },

  transactionId: {
    fontFamily:'WorkSans-Medium',
    fontSize: 16,
    // fontWeight: '700',
    color: '#000',
  },

  downloadBtn: {
    marginTop: 36,
    marginHorizontal: 22,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },

  downloadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  homeBtn: {
    marginTop: 18,
    marginHorizontal: 22,
    // height: 56,
    padding:14,
    borderRadius: 10,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeText: {
    fontFamily:'WorkSans-Medium',
    fontSize: 14,
    // fontWeight: '600',
    color: '#FFF',
  },
});