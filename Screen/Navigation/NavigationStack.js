import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Image, Dimensions, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home';
import LoginPage from '../LoginPage';
import Signin from '../Signin';
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

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [Email, setEmail] = useState('');
  const [LoadingS, setLoadingS] = useState(true);
  const [token, setToken] = useState('');

  const handleProfle = async (emailId, tokenid) => {
    console.log(emailId,"===em======",tokenid,"=====tok==")
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

  const handleAuth = async () => {
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
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigations"
          component={BottomNavigations}
          options={{ headerShown: false }}
        />
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
          name="Signin"
          component={Signin}
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
      </Stack.Navigator>
    );
  }
}
