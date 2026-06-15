import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = React.createContext();
const AppProvider = ({children}) => {
  const [globalState, setGlobalState] = useState({
    userName: '',
    userEmail:'',
    ProDetails: [],
    LableProDetails: [],
    userPhone:'',
    token: '',
    Login:false,
    activeFooterTab:'home',
    LikeData:[],
    userDetails:[],
    userProfile:'',
    offer:[],
    userEvent:'',
    ConstructionFData:[],
    PropertyBuyAnsRent:[],
    currentLocation:[],
    ProprtyListingForm1:[],
    HotelUserDetails:{},
    userType: '',
    AuditData: [], 
    HotelDetails: [],
    ourStays: [],
    liveVersion: "",
  }); 
  
  return (
    <AppContext.Provider value={{globalState, setGlobalState}}>
      {children}
    </AppContext.Provider>
  );
};
export {AppContext, AppProvider};