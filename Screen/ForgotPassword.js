import { View, Text ,ScrollView} from 'react-native';
import React from 'react';
import Back from './Back';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ForgotPassword() {
  return (
    <SafeAreaView style={{flex: 1}}>
     <Back title={'Cancellation & Refund Policy'} />
     <ScrollView  style={{padding:20}}>
       <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily:'OpenSans-Bold',
              marginVertical: 8,
            }}>
            Cancellation & Refund Policy
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 12,
              fontFamily:'Poppins-Regular',
              paddingBottom: 10,
            }}>
            1. Users must provide accurate payment information and use only
            legally owned cards/accounts. Fracspace does not store users'
            payment details. Failed transactions due to lack of authorization or
            interruptions will not be processed, and erroneous charges will be
            refunded. Users are responsible for fraudulent card use and must
            provide evidence to dispute it; Fracspace is not liable for such
            incidents.
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 12,
              fontFamily:'Poppins-Regular',
              paddingBottom: 10,
            }}>
            2. In the event of a transaction failure due to bank authorization
            issues or any interruption, it will be deemed unsuccessful, and no
            orders will proceed. Erroneous charges during failed transactions
            will be refunded. Users are solely responsible for any fraudulent
            card use and must provide evidence to refute it. Fracspace cannot be
            held responsible for such matters.
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 12,
              fontFamily:'Poppins-Regular',
              paddingBottom: 50,
            }}>
            3.We acknowledge that in case of my/our cancellation request,
            Fracspace reserves the right to deduct cancellation charges as
            outlined in the Terms and Conditions. Only the remaining balance
            will be refunded. The booking amount serves as "Earnest Money"; in
            the event of cancellation after payment, Fracspace will forfeit 10%
            of the "Earnest Money". However, there is a seven-day free look
            period from the Onboarding date. When cancellation request raised in
            free look period then deposite amount will be refunded with in 48
            hours.
          </Text>
    </ScrollView>
    </SafeAreaView>
  )
}