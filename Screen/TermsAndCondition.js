import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsAndCondition() {
  const [TermOpen, setTermOpen] = useState('');
  return (
     <SafeAreaView style={{flex: 1,backgroundColor:"#021265"}}>
    <Back title={"Terms and Conditions"}/>
    <ScrollView style={{ backgroundColor: '#FAFAFF',paddingVertical: 20 }}
    showsVerticalScrollIndicator={false}>

      <View style={{flex: 1, paddingBottom: 40,paddingHorizontal:20,paddingRight:35 }}>
        <Text
          style={{
            color: '#1A1A1A',
            fontSize: 17,
            fontFamily: "Montserrat-Bold",
            marginBottom: 5,
            //textAlign: 'center',
          }}>
          Terms & Conditions
        </Text>
        <View style={{ borderBottomColor: '#F6F6F6', borderBottomWidth: 1, marginBottom: 5 }}></View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F6F6F6', }}>
          <TouchableOpacity
            onPress={() => {
              setTermOpen('Co-ownership');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>

            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                textDecorationLine: 'underline',
              }}>
              Co-ownership
            </Text>
            {TermOpen != 'Co-ownership' ? <Icon name="chevron-small-down" size={32} color="#1E2135" /> :
              <Icon name="chevron-small-up" size={32} color="#1E2135" />}


          </TouchableOpacity>

         <View>
            <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular", }}>
              Below are essential points regarding your Fractional Ownership with
              FRACSPACE. Please review each point alongside the detailed Terms &
              Conditions for full comprehension.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />

              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/we comprehend the Terms and Conditions of the selected special
                offer at the time of signing up to purchase FRACSPACE.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,

                // alignItems:'flex-start'
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We acknowledge that I/we have read the Terms and Conditions
                regarding the purchase and usage of FRACSPACE’s Fractional
                Ownership, as well as the Terms and Conditions related to the
                ownership, and agree to comply with them. We have received all
                necessary clarifications and information regarding FRAC Ownership.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We comprehend that any payment I/we make will initially be
                allocated to the Booking Fees, with any remaining balance allocated
                toward the entitlement fees.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We acknowledge that in case of my/our cancellation request,
                Fracspace reserves the right to deduct cancellation charges as
                outlined in the Terms and Conditions. Only the remaining balance
                will be refunded. The booking amount serves as "Earnest Money"; in
                the event of cancellation after payment, Fracspace will forfeit 10%
                of the "Earnest Money". However, there is a seven-day free look
                period from the Onboarding date.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We acknowledge that I/we will become a FRAC Owner of FRACSPACE
                only upon the full realization of the entire amount and the two
                installments of the chosen Payment Plan. This entitles me/us to the
                benefits of FRACSPACE Ownership, including a 6% BROI (Bank Rate of
                Interest) until property possession and a guaranteed rental yield of
                10% per annum.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '100%'
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We acknowledge that I/We the Fractional Owner of FRACSPACE may
                choose to exit this agreement at any time with a 60 day notice
                period.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We comprehend that in the event of any name transfers or gift, it
                may take up to 7 working days to transfer to be reflected.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We affirm that SPV shall be formed consequent to all the units of
                a particular property having been sold out.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We acknowledge that the BROI (Bank Rate of Interest) will be
                applicable only after complete payment is done by the Fractional
                Owner or Shareholder of the property. All documentation will be
                delivered once the entire payment has been completed.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',

              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1E2135', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                I/We comprehend that Fracspace is responsible for property
                maintenance. Hence, I/we recognize that Fracspace will deduct 30%
                from the generated rentals for the property maintenance,
                distributing the remaining 70% among the property shareholders.
                Importantly, this maintenance cost will not impact the guaranteed
                10% return on the investment amount.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F6F6F6', width: '100%' }}>
          {/* <TouchableOpacity onPress={() => {
            setTermOpen('Bluhous');
          }} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F6F6F6', paddingVertical: 10, width: '100%' }}>

            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                textDecorationLine: 'underline',
              }}>
              Bluhous
            </Text>
            {TermOpen != 'Bluhous' ? <Icon name="chevron-small-down" size={32} color="#1E2135" /> :
              <Icon name="chevron-small-up" size={32} color="#1E2135" />}


          </TouchableOpacity> */}


        <View>
            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                // textDecorationLine:'underline',
              }}>
              Fracspace Role And Limitation of Liability
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Fracspace serves as a facilitator, offering users an internet platform to choose and reserve a specific hotel. In this sense, "hotels" refers to all types of lodging, including farm houses, bed and breakfasts, homestays, and any other type of lodging.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                All hotel-related information, such as the hotel's categorization, pictures, room type, and amenities and services, is in accordance with the data that the hotel gave Fracspace. This data should only be used as a guide. If there is a difference between the hotel's actual settings and the photographs on the website or app, the user should bring it up with the hotel directly, and the issue will be settled between the two parties. Fracspace will not be held accountable for any of these discrepancies or be involved in the resolution process.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                We are not a "contractual party," thus when you make (or request) a booking, it is done directly with the service provider.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                After you make your reservation, we verify the information with you and the service provider, including the identities of the guest or guests.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                If you would like, you may be able to modify or cancel your reservation, depending on its terms. For assistance with anything, please use the Help Center, which is open twenty-four hours a day.
              </Text>
            </View>




            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                // textDecorationLine:'underline',
              }}>
              Hotel Information and Reservation Terms
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                The only basis for the hotel booking voucher that Fracspace provides to a user is the
                information that the hotel has updated or supplied about inventory availability.
                Fracspace will never be held responsible for a hotel's inability to fulfill a confirmed
                reservation, inadequate service, or any other problems relating to the hotel's
                services. Fracspace will only be liable for either offering a comparable alternative
                accommodation at its discretion (subject to availability at that time) or returning the
                booking amount (to the extent paid) to the user in the event that a hotel denies
                check-in for any reason, including overbooking, system or technical issues, or
                unavailability of rooms, among other reasons. The user should deal directly with the
                hotel to settle any other service-related concerns.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Hotels retain the only right of entry, and Fracspace has no influence over whether a
                hotel grants or denies admission. Certain hotels may prohibit unmarried or unrelated
                couples from checking in due to their regulations. Similarly, people who are posing
                as a couple may not be allowed accommodations if they do not produce proper
                identification when they check in. Additionally, certain hotels would not accept
                locals as guests. Fracspace will not be held accountable for any check-in that is
                refused by the hotel for the reasons listed above or for any other cause that is
                outside of Fracspace's control. In the event that the hotel refuses check-in in such a
                situation, there will be no return.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                The user's payment for the reservation solely covers their hotel stay. Breakfast
                and/or meals may be included in certain reservations, as stated at the time of
                booking. The user is responsible for paying the hotel directly for any additional
                services they use, such as laundry, room service, internet, phone, extra meals,
                drinks, etc.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                During holidays like Christmas, New Year's Eve, or other festivals, hotels may impose
                an obligatory meal price, as determined by the hotel. You must pay the hotel directly
                for all extra fees, including necessary meal surcharges. The same will not be under
                the authority of Fracspace.
              </Text>
            </View>





            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                // textDecorationLine:'underline',
              }}>
              User Role and Responsibilities
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                1.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                Fill in all your contact details correctly, so we and/or the Service Provider can
                provide you with information about your Booking and, if necessary, contact
                you.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                2.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                Read these Terms and the terms displayed during the booking process
                carefully.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                3.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                The primary guest must be at least 18 years old to be able to check into the
                hotel.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                4.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                At the time of check-in, the user must have a valid form of identification and
                proof of address. If a legitimate form of identification is not provided at the
                time of check-in, the hotel has the authority to refuse the user access.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                5.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                The hotel's terms and policies shall govern the check-in and check-out times
                as well as any modifications to them. Subject to availability, requests for early
                or late check-in or check-out may incur an extra fee from the hotel.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Bold" }}>
                6.</Text>
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular", paddingLeft: 8 }}>
                The user is responsible for paying for any damages to the hotel's property
                that result from their actions or those of their accompanying guests, whether
                deliberate or inadvertent. The hotel in question would decide how much
                damage was done and to what extent. Fracspace would not interfere in the
                same manner.
              </Text>
            </View>





            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                // textDecorationLine:'underline',
              }}>
              Payment for Bookings and Other Charges
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Booking of a hotel can either be “Prepaid”, or “Pay at hotel” as per the options made available by a hotel on the Website/App of Fracspace.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                The "Prepaid" model requires the user to pay the whole booking amount at the time
                of booking. Taxes, service costs that may be assessed by the real service provider,
                the hotel reservation rate, and any additional booking or convenience fees that
                Fracspace may impose are all included in the total booking amount.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                When the merchant location (as specified by the card brand, such as Visa,
                MasterCard, or American Express) and the card issuer are in separate nations,
                certain banks and card issuing businesses charge their account holders a transaction
                fee. A user can get in touch with their bank or the card issuer via which the payment
                was made if they have any queries concerning the fees or any exchange rate that
                was used.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                To cover any extra costs that might arise during their stay, certain lodging providers
                can ask the user and/or the other individuals making the reservation to provide a
                credit card or cash deposit at check-in. Such a deposit is made only at the hotel's
                request and has nothing to do with any money that Fracspace has received.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                When using the "pay at hotel" model, the hotel in question will receive the full
                amount due at check-in. The hotel will determine whether to charge payment in
                local currency or another currency for overseas reservations. Fracspace requires the
                User to supply accurate credit or debit card information for security reasons. If the
                user provides inaccurate bank or credit card information, Fracspace has the right to
                cancel the reservation at its sole discretion.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                You agree to pay the full cost of the travel experience, including any applicable fees
                and taxes, when you make a booking. They may have rounded some of the prices to
                the closest whole number. The price you pay will be determined by the original,
                "non-rounded" price, however there won't be much of a difference. Not binding are
                glaring mistakes and misprints. If you reserve a luxury car or a night in a suite that
                was mistakenly offered for €1, for instance, your reservation may be canceled, and
                you will receive a return of all money paid. A price that has been crossed out
                represents the cost of a similar reservation without the price reduction applied (the
                term "like-for-like" refers to the same dates, policies, and level of lodging,
                automobile, or transport class,etc.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                We will store your Payment Method details for future transactions after collecting
                your consent.
              </Text>
            </View>

























            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontFamily: "Montserrat-Bold",
                // textDecorationLine:'underline',
              }}>
              What else do you need to know?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                There may be links to external websites/app link on the app. Fracspace has no authority over these websites/app and is not liable for their content. Users that visit any third-party websites/app do so at their own risk, and Fracspace won't be held responsible for whatever they do.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Fracspace is not responsible for any errors, omissions or representations on any of its pages, links or any linked website/app pages to the extent such information is updated or provided directly by the Service Providers or the advertisers.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
                width: '100%'
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Fracspace does not in any way recommend any of the advertisements on its app or any of the linked websites/app.Users are asked to confirm that all of the information on the third-party websites/app is accurate.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 5,
              }}>
              <Icon name="dot-single" size={32} color="#1E2135" />
              <Text style={{ color: '#1A1A1A', fontSize: 14, fontFamily: "Poppins-Regular" }}>
                Since Fracspace has no control over the connected websites/app, it cannot be held accountable for the information on any linked website/app, any further links on those websites/app, or any modifications or additions to those websites/app. These links are exclusively offered to users by Fracspace for their convenience.
              </Text>
            </View>


















          </View>



        </View>

        {/* <TouchableOpacity  onPress={() => {
          setTermOpen('Co-ownership');
         }}style={{ flexDirection:'row',alignItems:'center',borderBottomWidth: 1, borderBottomColor: '#F6F6F6', paddingVertical: 10,width:'100%' }}>
          
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
              fontFamily: "Montserrat-Bold",
              textDecorationLine:'underline',
            }}>
            Bluhous
          </Text>
          <Icon name="chevron-small-down" size={32} color="#1E2135" />


        </TouchableOpacity> */}










      </View>

    </ScrollView>
    </SafeAreaView>
  );
}