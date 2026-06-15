import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints } from '../../utils/config/config';

const initialState = {
  newUpdates: [],
  newUpdatesLoading: false,
  newUpdatesError: null,
  PropertyDetailsById:{},
  upComingProjects:[],
  nearByStays:[],
  labelProperties:[],
  referralCode:'',
  shareLink:'',
  referralLinkfront:"",
  referralData:{},
  altairaPromoData:{},
  paymentData:[]
};

export const fetchNewUpdates = createAsyncThunk(
  'home/fetchNewUpdates',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/users/getNewUpdates',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, 
           },
        },
      );
   
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const profileDetailsById = createAsyncThunk(
  "profileDetailsById",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

    const res = await axios.get(`https://apitest.fracspace.com/api/users/getPropertyById/${id}`,
  {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": "Fracspace@2024",
    },
  }
);
      return res.data.property;
     
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const upComingProjectApi = createAsyncThunk(
  'home/upComingProjectApi',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/v1/interiorConstruction/getUpcomingProjects',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, 
           },
        },
      );
   
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const nearByStaysApi = createAsyncThunk(
  'property/nearByStaysApi',
  async (_, { rejectWithValue }) => {
    try {
      // const payload = {
      //   email: email, // no need for JSON.stringify
      // };
      const response = await axios.post(
        'https://apitest.fracspace.com/api/v1/travel/elasticHotelSearch',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || 'Something went wrong'
      );
    }
  }
);

export const labelProperty = createAsyncThunk(
  'property/labelProperty',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/v1/altaira/getAllProperties',
        {
          headers: {
            'content-type': 'application/json',   
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, 
           },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const refrerLink = createAsyncThunk(
  'property/refrerLink',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/referral/me',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, 
           },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const altairaPropertyPromo = createAsyncThunk("altairaPropertyPromo",
  async (_, { rejectWithValue, getState }) => {
    try {
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    const res = await axios.get(`https://apitest.fracspace.com/api/altaira/promo`,
  {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": "Fracspace@2024",
    },
  }
);
    return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const paymentReview = createAsyncThunk(
  'property/paymentReview',
  async ({email,
        propertyName,
        propertyId,
        Price,
        FC_Price,
        fractionValue,
        numberOfFractions,
        totalBookingAmount,
        termsAndConditions}, { rejectWithValue }) => {
    try {
      const payload = {
        email,
        propertyName,
        propertyId,
        Price,
        FC_Price,
        fractionValue,
        numberOfFractions,
        totalBookingAmount,
        termsAndConditions
      };
      const response = await axios.post(
        'https://apitest.fracspace.com/api/users/reviewData',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        }
      );
    //  console.log(response?.data,"=======res====res===")
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || 'Something went wrong'
      );
    }
  }
);

const propertySlice = createSlice({
  name: 'propertySlice',
  initialState,
  reducers: {
      resetProfileState: state => {
      state.PropertyDetailsById = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNewUpdates.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(fetchNewUpdates.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdates = action.payload.updates;
      })
      .addCase(fetchNewUpdates.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
      builder
      .addCase(profileDetailsById.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(profileDetailsById.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.PropertyDetailsById = action.payload
      })
      .addCase(profileDetailsById.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
      builder
      .addCase(upComingProjectApi.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(upComingProjectApi.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.upComingProjects = action.payload?.data
      })
      .addCase(upComingProjectApi.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
       builder
      .addCase(nearByStaysApi.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(nearByStaysApi.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.nearByStays = action.payload?.hotels
      })
      .addCase(nearByStaysApi.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
      builder
      .addCase(labelProperty.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(labelProperty.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.labelProperties = action.payload?.data
      })
      .addCase(labelProperty.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
      builder
      .addCase(refrerLink.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(refrerLink.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.referralCode = action.payload?.data?.referralCode;
        state.shareLink = action.payload?.data?.shareLinkBase;
        state.referralData = action.payload?.data
        state.referralLinkfront = `${action.payload?.data?.shareLinkBase}?code=${ action.payload?.data?.referralCode}`;
      //  console.log( state.shareLink,state.referralCode,"====", state.referralLinkfront)
      })
      .addCase(refrerLink.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
         builder
      .addCase(altairaPropertyPromo.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(altairaPropertyPromo.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.altairaPromoData = action.payload.data;
     // console.log(state.altairaPromoData,"=========promo===")
      }) 
      .addCase(altairaPropertyPromo.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
      builder
      .addCase(paymentReview.pending, state => {
        state.loading = true;
        state.newUpdatesError = null;
      })
      .addCase(paymentReview.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
     // console.log(state.altairaPromoData,"=========promo===")
      }) 
      .addCase(paymentReview.rejected, (state, action) => {
        state.loading = false;
        state.newUpdatesError = action.payload;
      });
  },
});

export const { resetProfileState } = propertySlice.actions;
export default propertySlice.reducer;
