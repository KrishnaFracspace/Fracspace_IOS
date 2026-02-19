import React, { useContext } from 'react';
import WalletStack from './WalletStack';
import { AppContext } from '../Context/AppContext';
import ProfileVerification from '../Version2_O/ProfileVerification';

export default function VerificationOrWallet({ navigation }) {
  const {globalState} = useContext(AppContext); 

  if (globalState?.userDetails?.verification) {
    return <WalletStack />;
  }

  return <ProfileVerification />;
}