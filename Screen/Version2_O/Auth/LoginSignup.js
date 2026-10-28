// One screen for Login and Sign-up: the intro video stays mounted and only
// the panel changes, so switching doesn't restart the video. Both panels stay
// mounted (PanelSlot hides the other one), so a switch creates no views and
// what was typed is still there on the way back.
import React, { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import { AuthScreen, PanelSlot, Toast, useToast } from './AuthUI';
import LoginPanel from './LoginPanel';
import SignupPanel from './SignupPanel';

export default function LoginSignup({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [toast, showToast] = useToast();
  const switchTo = useCallback(next => {
    // The focused field is about to be hidden.
    Keyboard.dismiss();
    setMode(next);
  }, []);
  return (
    <AuthScreen overlay={<Toast message={toast} />}>
      <PanelSlot active={mode === 'login'}>
        <LoginPanel active={mode === 'login'} onSwitch={switchTo} showToast={showToast} />
      </PanelSlot>
      <PanelSlot active={mode === 'signup'}>
        <SignupPanel active={mode === 'signup'} onSwitch={switchTo} showToast={showToast} />
      </PanelSlot>
    </AuthScreen>
  );
}
