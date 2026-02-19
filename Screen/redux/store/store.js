import { configureStore } from "@reduxjs/toolkit";
import  authReducer from "../reducer/authReducer";
import profileDetails from "../reducer/profileReducer";
import homeSlice from '../reducer/homeReducer';
import propertySlice from '../reducer/propertyReducer'
const store = configureStore({
  reducer: {
    auth:authReducer,
    profile:profileDetails,
    home:homeSlice,
    property:propertySlice,
  },
});

export default store;
