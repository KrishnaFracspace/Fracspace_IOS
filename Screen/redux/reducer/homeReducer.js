import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import LableProperty from '../../Version2_O/LableProperty';

const initialState = {
  userName: '',
  userEmail: '',
  userPhone: '',
  token: '',
  Login: false,
  activeFooterTab: 'home',
  LikeData: [],
  userDetails: [],
  userProfile: '',
  userEvent: '',
  ConstructionFData: [],
  PropertyBuyAnsRent: [],
  currentLocation: [],
  ProprtyListingForm1: [],
  HotelUserDetails: {},
  userType: '',
  Properties: [],
  AuditData: [],
  ProDetails: [],
  LableProDetails: [],
  offer: [],
  recommended: [],
  indianProperties: [],
  srilankaProperties: [],
  loading: false,
  error: null,
  reducerHit: false,
  popularHotels: [],
  popular: [],
  prior: '',
Get_Packages:[],
notifications:[],
AllProperties:[],
isDepplinkNav: false,
isPopupVisible: false,
hasShownHomePopup: false,
InterNational:[]

};

export const fetchProperties = createAsyncThunk(
  'home/fetchProperties',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/users/getPropertyDetails',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        },
      );
      return data;
    } catch (error) {
      console.log('API ERROR:', error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const fetchPopularHotels = createAsyncThunk(
  'popular/fetchPopularHotels',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/v1/travel/allListedHotelDetails',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const fetchAllNotifications = createAsyncThunk(
  'notification/fetchAllNotifications',
  async (email, { rejectWithValue }) => {
    try {
      const payload = {
        email: email, // no need for JSON.stringify
      };

      const response = await axios.post(
        'https://apitest.fracspace.com/api/v1/notifications/showAllNotificationsEnhanced',
        email,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log('API ERROR:', error?.response?.data || error.message);
      return rejectWithValue(
        error?.response?.data || 'Something went wrong'
      );
    }
  }
);

export const sendPaymentUPI = createAsyncThunk(
  'payment/sendPaymentUPI',
  async ({link, phoneNumber}, {rejectWithValue}) => {
    try {
      const payload = JSON.stringify({
        message: `Enguire Via whatsapp ${link}`,
        phoneNumber: phoneNumber,
      });
      const {data} = await axios.post(
        'https://apitest.fracspace.com/api/users/sendPaymentLinkToUser',
        payload,
        {
          headers: {
            'x-api-key': 'Fracspace@2024',
            'Content-Type': 'application/json',
            apiKey: 'Fracspace@202',
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const getPackages = createAsyncThunk(
  'home/getPackages',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/users/getAllPackages',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        },
      );
      return data;
    } catch (error) {
      console.log('API ERROR:', error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    resetPaymentState: () => initialState,
    setActiveFooterTab(state, action) {
      state.activeFooterTab = action.payload;
    },
    logout(state) {
      return initialState;
    },

showPopup(state) {
  if (!state.isDepplinkNav && !state.hasShownHomePopup) {
    state.isPopupVisible = true;
    state.hasShownHomePopup = true; // mark as shown
  }
},
hidePopup(state) {
    state.isPopupVisible = false;
  },

setDeepLinkNav(state, action) {
  if (action.payload === true) {
    state.isDepplinkNav = true;
    state.isPopupVisible = false;
  }
},
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProperties.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        if (!res?.success) return;
        state.offer = res.offers;
        state.prior = res.priority;
        state.AllProperties= res.properties
        // const allProp = 
     const domastic = res.properties
  .filter(item =>
    item.PropertyType === 'International-Villa' ||
    item.PropertyType === 'Domastic'
  )
  .sort((a, b) => (a.num > b.num ? 1 : -1))
  // .sort((a, b) => {
  //   if (a.PropertyType === 'International-Villa' && b.PropertyType !== 'International-Villa') {
  //     return -1;
  //   }
  //   if (b.PropertyType === 'International-Villa' && a.PropertyType !== 'International-Villa') {
  //     return 1;
  //   }
  //   return a.num - b.num;
  // });
        const label = res.properties
          .filter(item => item.PropertyType === 'Label')
          .sort((a, b) => (a.num > b.num ? 1 : -1));
        state.ProDetails = domastic;
        state.LableProDetails = label;
        state.Properties = domastic;
       
        international =res.properties
          .filter(item => item.PropertyType === 'International-Villa')
          .sort((a, b) => (a.num > b.num ? 1 : -1));
        state.InterNational = international 
        
        state.indianProperties = res.properties
          .filter(item => !item.country && item.PropertyType === 'Domastic')
          .sort((a, b) => (a.num > b.num ? 1 : -1));
      })

      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchPopularHotels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularHotels.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        if (!res?.success) return;
        // SAME AS: setPopular(res?.hotels)
        state.popularHotels = res.hotels;
      })
      .addCase(fetchPopularHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchAllNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload?.data;
         state.notifications = res;
      })
      .addCase(
        fetchAllNotifications.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },

        builder
          .addCase(sendPaymentUPI.pending, state => {
            state.loading = true;
            state.error = null;
            state.success = false;
          })
          .addCase(sendPaymentUPI.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload?.success;
          })
          .addCase(sendPaymentUPI.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }),

          builder
          .addCase(getPackages.pending, state => {
            state.loading = true;
            state.error = null;
            state.success = false;
          })
          .addCase(getPackages.fulfilled, (state, action) => {
            state.loading = false;
            state.Get_Packages = action.payload?.data;
          })
          .addCase(getPackages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }),      
      );
  },
});

export const {
  setActiveFooterTab,
  logout,
  resetPaymentState,
  showPopup,
  hidePopup,
  setDeepLinkNav,
} = homeSlice.actions;
export default homeSlice.reducer;

