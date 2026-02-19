import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Back from './Back';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Privacy() {
  return (
     <SafeAreaView style={{flex:1}}>
      <Back title={'Privacy'} />
      <ScrollView style={{backgroundColor: '#FFFFFF'}}>
        <View style={{padding: 20}}>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginBottom: 8,
            }}>
            Privacy Policy
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            This Privacy Policy describes how Fracspace (“we,” “us,” or “our”)
            collects, uses, discloses, and protects your personal information
            when you access or use our app and website (collectively referred to
            as the “Service”). We are committed to safeguarding your privacy and
            ensuring your personal information is handled responsibly.
          </Text>

        

         

       
         

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
            }}>
            Information Sharing
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 16,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
            }}>
            Personal Information
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            While using our Service, we may ask you to provide us with certain identifiable information that can be used to contact or identify you. This may include, but is not limited to:
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Contact Information:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             Name, email address, phone
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
             number, and mailing address.
          </Text>




          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
             Account Information:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
            Username, password, and 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
             any other details necessary for account creation.
          </Text>




          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Payment Information:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             Credit card numbers, billing 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            information, and associated details upon purchase.
          </Text>



          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
             Property Information:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
            Information related to 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
             properties you wish to list, buy, sell, or lease.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
            Service Preferences:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             Data related to your 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            preferences for property management and consulting services.
          </Text>


          <Text
            style={{
              color: '#1E2135',
              fontSize: 16,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
            }}>
            Non-Personal Information
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            We may also collect non-personal identification information whenever you interact with our Service, including:
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start',paddingTop:15}}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              Device Information: Device type, operating system, and app version.
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             Log Data: IP addresses, browser type, and access times.
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
            Usage Data: Information about how you use our app and website.
            </Text>
          </View>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop:15
            }}>
            How We Use Your Information
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            We may use the information we collect for various purposes,
            including:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Account Management:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              To create and manage
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            your user account.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Service Facilitation:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              To facilitate fractional 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
           ownership of holiday homes and connect you with property management and
            consulting services.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
             Communication:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              To send you updates,
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
             promotional materials, and other relevant information.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
            Customer Support:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              To respond to your
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
         inquiries and provide assistance.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
            Analytics:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             To analyze usage trends and improve
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
         our services.
          </Text>


          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
            Legal Compliance:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
             To comply with applicable
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
          laws, regulations, and legal requests.
          </Text>












          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop:15
            }}>
            Information Sharing and Disclosure
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties without your consent, except for:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Service Providers:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              We may share your information
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 22,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            with trusted third-party vendors who assist in operating our app or
            website, provided they agree to keep your information confidential.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Legal Compliance:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              We may disclose information
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 25,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            as required by law or to protect our rights or the rights of others.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Business Transfers:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              Personal information may be
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 25,
              marginTop: -5,
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            transferred in connection with a merger, acquisition, or sale of our
            assets.
          </Text>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop: 15,
            }}>
            Data Security
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access,
            disclosure, alteration, or destruction. However, please be aware
            that no method of transmission over the internet is completely
            secure, and we cannot guarantee absolute security.
          </Text>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop: 15,
            }}>
            Third-Party Links
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            Our app and website may contain links to third-party websites or
            services. We do not have control over these external sites and are
            not responsible for their privacy practices. We encourage you to
            review the privacy policies of these third-party websites.
          </Text>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop: 15,
            }}>
            Your Privacy Rights
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            You have certain rights regarding your personal information,
            including:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              The right to access the personal information we hold about you.
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              The right to request correction of any inaccurate information.
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              The right to request deletion of your personal information.
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingBottom: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              The right to withdraw your consent to processing.
            </Text>
          </View>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}>
            To exercise any of these rights, please contact us using the contact
            information provided below.
          </Text>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop: 15,
            }}>
            Changes to This Privacy Policy
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
              // paddingBottom: 50,
            }}>
            We may update this Privacy Policy periodically. Any changes will be
            posted on this page with an updated effective date. We encourage you
            to review this Privacy Policy regularly for any updates.
          </Text>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 18,
              fontFamily: 'OpenSans-Bold',
              marginVertical: 8,
              paddingTop: 15,
            }}>
            Contact Us
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
              // paddingBottom: 50,
            }}>
            If you have any questions or concerns regarding this Privacy Policy
            or wish to exercise your privacy rights, please contact us at:
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Email:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              support@fracspace.com
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingBottom: 15,
            }}>
            <Icon name="dot-single" size={22} color="#1E2135" />
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'OpenSans-Bold',
              }}>
              Phone:
            </Text>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}>
              +91-9880626111
            </Text>
          </View>

          <Text
            style={{
              color: '#1E2135',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
              // paddingBottom: 50,
            }}>
            Thank you for choosing Fracspace. We value your privacy and are
            dedicated to protecting your personal information!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
