import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Image, Dimensions, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home';
import Property from '../Property';
import Enquire from '../Enquire';
import Contact from '../Contact';
import Profile from '../Profile';
import Like from '../Like';
import Owned from '../Owned';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDetails } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import Privacy from '../Privacy';
import Aboutus from '../Aboutus';
import Dashboard from '../Dashboard';
import Chat from '../Chat';
import BookNow from '../BookNow';
import Enquirenew from '../Enquirenew';
import Book from '../Book';
import Review from '../Review';
import Documents from '../Documents';
import MyProfile from '../MyProfile';
import TermsAndCondition from '../TermsAndCondition';
import SiteHistory from '../SiteHistory';
import BookingHistory from '../BookingHistory';
import DisplayDoc from '../DisplayDoc';
import GuestBookingDetails from '../GuestBookingDetails';
import BookingStatus from '../BookingStatus';
import Payment from '../Payment';
import ForgotPassword from '../ForgotPassword';
import VideoDisplay from '../VideoDisplay';
import PaymentPage from '../PaymentPage';
import NewLogin from '../Version2_O/NewLogin';
import NewSigin from '../Version2_O/NewSigin';
import HomePage from '../Version2_O/HomePage';
import PopularDestination from '../Version2_O/PopularDestination';
import InteriorForm from '../Version2_O/InteriorForm';
import InteriorFormSec from '../Version2_O/InteriorFormSec';
import InteriorFSec from '../Version2_O/InteriorFSec';
import InteriorFormThird from '../Version2_O/InteriorFormThird';
import PropertyListing from '../Version2_O/PropertyListing';
import Filter from '../Version2_O/Filter';
import PropertyDetailsNew from '../Version2_O/PropertyDetailsNew';
import Locationview from '../Version2_O/Locationview';
import PayUPaymentgateway from '../Version2_O/PayUPaymentgateway';
import SelectRoom from '../Version2_O/SelectRoom';
import CustomersReview from '../Version2_O/CustomersReview';
import DreamscapeHome from '../Version2_O/DreamscapeHome';
import RoomListing from '../Version2_O/RoomListing';
import VideoTour from '../Version2_O/VideoTour';
import RoomDescription from '../Version2_O/RoomDescription';
import Ourstay from '../Version2_O/Ourstay';
import FeedbackForm from '../Version2_O/FeedbackForm';
import MonthlyInsight from '../Version2_O/MonthlyInsight';
import CumulativeEarning from '../Version2_O/CumulativeEarning';
import Transfer from '../Version2_O/Transfer';
import NotificationsScreen from '../Version2_O/NotificationsScreen';
import Blogs from '../Version2_O/Blogs';
import Label from '../Version2_O/Label';
import Wallet from '../Version2_O/Wallet';
import LableProperty from '../Version2_O/LableProperty';
import LablePropertyDis from '../Version2_O/LablePropertyDis'
import Policy from '../Policy';
import WalletAmount from '../Version2_O/WalletAmount';
import PaidSuccessfully from '../Version2_O/PaidSuccessfully';
import Packages from '../Version2_O/Packages';
import PdfViewerScreen from '../Version2_O/PdfScreen';
import AltairaExperience from '../Version2_O/altaira/AltairaExperience';
import EdgeFab from '../Version2_O/altaira/FloatingButton';
import BottomNavigations from './BottomNavigation';
import LiveStream from '../Version2_O/altaira/LiveStream';
import EnquirtyFS from '../Version2_O/EnquirtyFS';
import VerificationOrWallet from './VerificationOrWallet';
import CameraScreen from '../components/CCTVView';
import PaymentSummaryScreen from '../Version2_O/PaymentSummaryScreen';
import ChatBoat from '../Version2_O/chatboat/ChatBoat'
import AISearchScreen from '../Version2_O/chatboat/APIChatBoat';
import MembershipProfile from '../Version2_O/escapeMembership/MembershipProfile';
import MembershipProprtyDesc from '../Version2_O/escapeMembership/MembershipProprtyDesc';
import PaymentSuccessEscape from '../Version2_O/escapeMembership/PaymentSuccessEscape';
import PaymentFailedEscape from '../Version2_O/escapeMembership/PaymentFailedEscape';
import EscapePaymentPage from '../Version2_O/escapeMembership/EscapePaymentPage';
import TranHisForEscape from '../Version2_O/escapeMembership/TranHisForEscape';
import ViewAgreement from '../Version2_O/escapeMembership/ViewAgreement';
import MembershipHome from '../Version2_O/escapeMembership/MembershipHome';
import PackageDescription from '../Version2_O/PackageDescription';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [Email, setEmail] = useState('');
  const [LoadingS, setLoadingS] = useState(true);
  const [token, setToken] = useState('');

  const handleProfle1 = async (emailId, tokenid) => {
    let payload = JSON.stringify({
      email: emailId,
    });
    try {
      let { data: res } = await ProfileDetails(payload, tokenid);
      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.data?.userName,
          userEmail: emailId,
          token: tokenid,
          userPhone: res?.data?.phoneNumber,
          userDetails: res?.data,
          userProfile: res?.data?.profilePicture,
        }));
      }
      setLoadingS(false);
    } catch (error) {
      // console.log(error?.response?.data?.message );
      if (error?.response) {
        if (error?.response?.data?.message == 'Invalid token.') {
          //  navigation.navigate('LoginPage');
          setToken('');
          setLoadingS(false);
        } else {
          Alert.alert(
            'Response ErrorProfile',
            `${error?.response?.data?.message}`,
          );
        }
      } else if (error?.request) {
        //Alert.alert('Request error:', ${JSON.stringify(error?.request)});
        //console.log('profilr',${JSON.stringify(error?.request)});
        //Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        // Alert.alert('Error:', `${error}`);
      }
    }
  };

  const handleAuth1 = async () => {
    try {
      const token = await AsyncStorage.getItem('mytoken');
      const email = await AsyncStorage.getItem('Email');
      if (token) {
       handleProfle(email, token);

        setToken(token);
      } else {
        setToken('');
        setLoadingS(false);
      }
    } catch (error) {
      console.log('Error checking authentication:', error);
      setToken('');
      setLoadingS(false);
    }
  };

// Updated handleProfile - More robust for deep linking
const handleProfile = async (emailId, tokenid) => {
  if (!emailId || !tokenid) {
    console.warn('Missing email or token for profile fetch');
    setToken('');
    setLoadingS(false);
    return;
  }

  // console.log('Fetching profile →', { email: emailId, token: tokenid });

  const payload = JSON.stringify({ email: emailId });

  try {
    const { data: res } = await ProfileDetails(payload, tokenid);

    if (res?.success) {
      setGlobalState(prev => ({
        ...prev,
        userName: res?.data?.userName,
        userEmail: emailId,
        token: tokenid,
        userPhone: res?.data?.phoneNumber,
        userDetails: res?.data,
        userProfile: res?.data?.profilePicture,
      }));

      setToken(tokenid);
      // console.log('Profile fetched successfully');
    } else {
      throw new Error(res?.message || 'Profile fetch failed');
    }
  } catch (error) {
    console.error('Profile fetch error:', error);

    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';

    if (errorMessage.toLowerCase().includes('invalid token') || 
        error?.response?.status === 401) {
      
      console.log('Invalid/expired token detected → logging out');
      setToken('');
      await AsyncStorage.multiRemove(['mytoken', 'Email']);
      
      // Do NOT clear pendingDeepLink here - we want to keep it for after re-login
    } else {
      // Non-critical error - show alert but keep token and pending deep link
      Alert.alert(
        'Profile Error',
        errorMessage || 'Failed to load profile. Some features may be limited.',
      );
      // Keep the token so deep link flow can still work after login
      setToken(tokenid);
    }
  } finally {
    setLoadingS(false);
  }
};

// Improved handleAuth
const handleAuth = async () => {
  try {
    const [[, storedToken], [, storedEmail]] = await AsyncStorage.multiGet(['mytoken', 'Email']);

    if (storedToken && storedEmail) {
      // console.log('Stored token found, fetching profile...');
      await handleProfile(storedEmail, storedToken);
    } else {
      console.log('No stored token found');
      setToken('');
      setLoadingS(false);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    setToken('');
    setLoadingS(false);
  }
};

// Keep your useLayoutEffect as is
useLayoutEffect(() => {
  handleAuth();
}, []);


  if (LoadingS) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size={'large'} color={'#043862'}/> */}
        <Image
          source={require('../assets/logo_FS.png')}
          style={{ width: width * 0.6, height: height * 0.3 }}
        />
      </View>
    );
  } else {
    return (
      <Stack.Navigator initialRouteName={token != '' ? 'BottomNavigations' : 'NewLogin'}>
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="BottomNavigations"
          component={BottomNavigations}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MembershipHome" component={MembershipHome} options={{headerShown:false}}/>
        <Stack.Screen name="MembershipProfile" component={MembershipProfile} options={{headerShown:false}}/>
        <Stack.Screen name="MembershipProprtyDesc" component={MembershipProprtyDesc} options={{headerShown:false}}/>
        <Stack.Screen name="PaymentSuccessEscape" component={PaymentSuccessEscape} options={{headerShown:false}}/>
        <Stack.Screen name="PaymentFailedEscape" component={PaymentFailedEscape} options={{headerShown:false}}/>
        <Stack.Screen name="EscapePaymentPage" component={EscapePaymentPage} options={{headerShown:false}}/>
        <Stack.Screen name="TranHisForEscape" component={TranHisForEscape} options={{headerShown:false}}/>
        <Stack.Screen name="ViewAgreement" component={ViewAgreement} options={{headerShown:false}}/>
        <Stack.Screen name="PackageDescription" component={PackageDescription} options={{headerShown:false}}/>
        <Stack.Screen
          name="trails"
          component={EdgeFab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LiveStream"
          component={LiveStream}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="AltairaExperience"
          component={AltairaExperience}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PdfViewer"
          component={PdfViewerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
     
        <Stack.Screen
          name="Property"
          component={Property}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Enquire"
          component={Enquire}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Contact"
          component={Contact}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Like"
          component={Like}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Owned"
          component={Owned}
          options={{ headerShown: false }}
        />
        {/* 2nd Phase */}
        <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Aboutus"
          component={Aboutus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookNow"
          component={BookNow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Book"
          component={Book}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Enquirenew"
          component={Enquirenew}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Review"
          component={Review}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Documents"
          component={Documents}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsAndCondition"
          component={TermsAndCondition}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SiteHistory"
          component={SiteHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingHistory"
          component={BookingHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DisplayDoc"
          component={DisplayDoc}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GuestBookingDetails"
          component={GuestBookingDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingStatus"
          component={BookingStatus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoDisplay"
          component={VideoDisplay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentPage"
          component={PaymentPage}
          options={{ headerShown: false }}
        />

        {/* version2.0 */}
        <Stack.Screen
          name="NewLogin"
          component={NewLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewSigin"
          component={NewSigin}
          options={{ headerShown: false }}
        />

     
        <Stack.Screen
          name="PopularDestination"
          component={PopularDestination}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InteriorForm"
          component={InteriorForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InteriorFormSec"
          component={InteriorFormSec}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InteriorFSec"
          component={InteriorFSec}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InteriorFormThird"
          component={InteriorFormThird}
          options={{ headerShown: false }}
        />
       
        <Stack.Screen
          name="PropertyListing"
          component={PropertyListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Filter"
          component={Filter}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PropertyDetailsNew"
          component={PropertyDetailsNew}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Locationview"
          component={Locationview}
          options={{ headerShown: false }}
        />    
    <Stack.Screen
          name="PayUPaymentgateway"
          component={PayUPaymentgateway}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="EnquirtyFS"
          component={EnquirtyFS}
          options={{ headerShown: false }}
        />
 <Stack.Screen
          name="CustomersReview"
          component={CustomersReview}
          options={{ headerShown: false }}
        />   
        <Stack.Screen
          name="DreamscapeHome"
          component={DreamscapeHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomListing"
          component={RoomListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoTour"
          component={VideoTour}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomDescription"
          component={RoomDescription}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectRoom"
          component={SelectRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Ourstay"
          component={Ourstay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FeedbackForm"
          component={FeedbackForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MonthlyInsight"
          component={MonthlyInsight}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CumulativeEarning"
          component={CumulativeEarning}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transfer"
          component={Transfer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Blogs"
          component={Blogs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WalletAmount"
          component={WalletAmount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaidSuccessfully"
          component={PaidSuccessfully}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Label"
          component={Label}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LableProperty"
          component={LableProperty}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LablePropertyDis"
          component={LablePropertyDis}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Packages"
          component={Packages}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerShown: false }}
        />

          <Stack.Screen
          name="PaymentSummary"
          component={PaymentSummaryScreen}
          options={{ headerShown: false }}
        />
        
          <Stack.Screen
          name="ChatBoat"
          component={ChatBoat}
          options={{ headerShown: false }}
        />
       
            <Stack.Screen
          name="AISearchScreen"
          component={AISearchScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}
