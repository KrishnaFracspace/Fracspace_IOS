import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/config/api";
import { endpoints } from "../../utils/config/config";
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

const initialState = {
  user: null,
  loading: false,
  token: null,
  error: null,
};

const handleUserType = async (userType) => {
  if(userType) {
    await messaging().subscribeToTopic('owners');
  }else {
    await messaging().unsubscribeFromTopic('owners');
  }
}

export const profileDetails = createAsyncThunk(
  "profile/profileDetails",
  async ({ email }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

      const res = await api.post(endpoints.PROFILE_DETAILS,
        { email },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "Fracspace@2024",
          },
        }
      );
      // console.log("Profile res: ", res?.data);
      if(res?.data?.success){
        const userType = res?.data?.data?.verification || res?.data?.data?.ownedProperties?.length > 0;
        // console.log('UserType: ',userType);
        if(userType){
          analytics().setUserProperty('user_type', 'owners');
        }else{
          analytics().setUserProperty('user_type', 'normal');
        }

        handleUserType(userType);
      }
      
      return res.data;  
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const AltairaInterest = createAsyncThunk(
  "AltairaInterest",
  async ({ email, name, phoneNumber, message }, { rejectWithValue }) => {
    try {
      const storedToken = await AsyncStorage.getItem("mytoken");
      const token = storedToken?.replace(/^['"]+|['"]+$/g, "");

      const data = {
        email,
        name,
        phoneNumber,
        message,
      };

      const res = await axios.post(`https://apitest.fracspace.com/api/users/profile`,
  data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "Fracspace@2024",
          },
    })
      // const res = await api.post(
      //   endpoints.INTERESTAPI,
      //   data,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //       "x-api-key": "Fracspace@2024",
      //     },
      //   })
      
    //  console.log("INTEREST API SUCCESS ===>", res.data);

      return res.data;

    } catch (err) {
      console.log("INTEREST API ERROR ===>", err);

      return rejectWithValue(
        err?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data;
      })
      .addCase(profileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

       builder
      .addCase(AltairaInterest.pending, (state) => {
        state.loading = true;
      })
      .addCase(AltairaInterest.fulfilled, (state, action) => {
        state.loading = false;
       // state.user = action.payload?.data;
      })
      .addCase(AltairaInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = profileSlice.actions;
export default profileSlice.reducer;
