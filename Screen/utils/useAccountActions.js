import { useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { AppContext } from '../Context/AppContext';
import { DeleteAccount } from '../Services/UserApi';
import { logout as resetHomeState } from '../redux/reducer/homeReducer';
import { logout as resetProfileState } from '../redux/reducer/profileReducer';
import { clearAnalyticsUser } from './analytics';

/**
 * Logout and Delete Account, shared by the Home side menu and the Profile tab
 * so both behave the same.
 */
export default function useAccountActions() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { setGlobalState } = useContext(AppContext);
  const [deleting, setDeleting] = useState(false);

  // Clears the signed-in user from memory as well as storage, so the next login
  // (possibly another account) never sees the previous user's profile.
  const clearSession = useCallback(async () => {
    await AsyncStorage.setItem('mytoken', '');
    await AsyncStorage.setItem('Email', '');
    setGlobalState(prev => ({
      ...prev,
      token: '',
      userEmail: '',
      userName: '',
      userPhone: '',
      userDetails: undefined,
      userProfile: undefined,
    }));
    dispatch(resetProfileState());
    dispatch(resetHomeState());
    // The next person to log in on this phone is a different analytics user.
    clearAnalyticsUser();
  }, [dispatch, setGlobalState]);

  const logOut = useCallback(async () => {
    await clearSession();
    navigation.navigate('NewLogin');
  }, [clearSession, navigation]);

  /** Returns true when the account was deleted (the caller closes its dialog). */
  const deleteAccount = useCallback(async () => {
    if (deleting) return false;
    setDeleting(true);
    try {
      const emailId = await AsyncStorage.getItem('Email');
      const { data: res } = await DeleteAccount(JSON.stringify({ email: emailId }));
      if (res?.success) {
        await clearSession();
        Toast.show({ type: 'success', text1: `${res?.message}`, position: 'top' });
        navigation.navigate('NewSigin');
        return true;
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error', 'Please check your internet connection');
      } else {
        Alert.alert('Error', `${error}`);
      }
    } finally {
      setDeleting(false);
    }
    return false;
  }, [clearSession, deleting, navigation]);

  return { clearSession, logOut, deleteAccount, deleting };
}
