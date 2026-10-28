// One screen for Login and Sign-up: the intro video stays mounted and only
// the panel changes, so switching doesn't restart the video.
import React, { useState } from 'react';
import { AuthScreen, Toast, useToast } from './AuthUI';
import LoginPanel from './LoginPanel';
import SignupPanel from './SignupPanel';

export default function LoginSignup({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [toast, showToast] = useToast();
  const Panel = mode === 'signup' ? SignupPanel : LoginPanel;
  return (
    <AuthScreen overlay={<Toast message={toast} />}>
      {/* key: a fresh panel (state and paneIn) on every switch */}
      <Panel key={mode} onSwitch={setMode} showToast={showToast} />
    </AuthScreen>
  );
}
