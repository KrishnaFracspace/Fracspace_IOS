import React from 'react';
import LoginSignup from './Auth/LoginSignup';

// Login and Sign-up share one screen (see Auth/LoginSignup.js); this route opens it on Sign-up.
export default function NewSigin() {
  return <LoginSignup initialMode="signup" />;
}
