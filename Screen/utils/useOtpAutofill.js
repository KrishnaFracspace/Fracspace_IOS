import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, NativeModules, Platform } from 'react-native';

export const OTP_LENGTH = 6;
const EMPTY = Array(OTP_LENGTH).fill('');
const { SmsConsent } = NativeModules;

// First standalone 6-digit number in the SMS text.
export const extractOtp = text => (text?.match(/(?:^|\D)(\d{6})(?!\d)/) || [])[1];

/**
 * State and handlers for the 6-box OTP input, with autofill and auto-submit.
 *
 * - iOS: the boxes use textContentType="oneTimeCode", so the code from the SMS
 *   shows above the keyboard; one tap inserts all 6 digits (Apple doesn't let
 *   apps read SMS, so that tap can't be skipped).
 * - Android: while `listenForSms` is true, the SMS User Consent API shows a
 *   one-tap "Allow" sheet when the OTP SMS arrives and fills the boxes.
 * - A full code (autofill, paste or typing the 6th digit) calls `onComplete`
 *   once per code, so the user never has to press Continue.
 * - Use the returned `submitOtp` for the Continue button too: it ignores taps
 *   while a request is running (`submitting`), so the OTP isn't sent twice.
 *   `onComplete` should return its request's promise.
 *
 * Give every box `maxLength={OTP_LENGTH}`: with 1 the 6-digit autofill is
 * truncated to its first digit.
 */
export default function useOtpAutofill({ listenForSms, onComplete }) {
  const [otpDigits, setOtpDigits] = useState(EMPTY);
  const inputRefs = useRef([]);
  const submittedCode = useRef('');
  const inFlight = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [listenKey, setListenKey] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fillCode = useCallback(code => {
    setOtpDigits(code.split(''));
    Keyboard.dismiss();
  }, []);

  const handleChange = useCallback((text, index) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length >= OTP_LENGTH) {
      // The whole code arrived at once (keyboard suggestion or paste).
      fillCode(digits.slice(0, OTP_LENGTH));
      return;
    }
    // Typing: one digit per box. Typing over a filled box keeps the new digit.
    const digit = digits.slice(-1);
    setOtpDigits(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [fillCode]);

  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otpDigits]);

  // One request at a time, whether it came from auto-submit or Continue.
  const submitOtp = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    submittedCode.current = otpDigits.join('');
    Keyboard.dismiss();
    try {
      await onCompleteRef.current?.(submittedCode.current);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }, [otpDigits]);

  // Auto-submit once per complete code. Editing a digit and completing again
  // submits again (e.g. after the server rejected a mistyped code).
  useEffect(() => {
    const code = otpDigits.join('');
    if (code.length < OTP_LENGTH) {
      submittedCode.current = '';
      return;
    }
    if (submittedCode.current === code) return;
    submitOtp();
  }, [otpDigits, submitOtp]);

  // Android: listen for the OTP SMS while the OTP step is shown.
  useEffect(() => {
    if (Platform.OS !== 'android' || !listenForSms || !SmsConsent) return;
    const onMessage = DeviceEventEmitter.addListener('SmsConsentMessage', sms => {
      const code = extractOtp(sms);
      if (code) fillCode(code);
    });
    SmsConsent.start();
    return () => {
      onMessage.remove();
      SmsConsent.stop();
    };
  }, [listenForSms, listenKey, fillCode]);

  // For "Send me a new OTP" and going back to change the number: clear the
  // boxes (so an old code can't be submitted) and listen for the new SMS.
  const resetOtp = useCallback(() => {
    setOtpDigits(EMPTY);
    submittedCode.current = '';
    setListenKey(k => k + 1);
  }, []);

  return { otpDigits, inputRefs, handleChange, handleKeyPress, resetOtp, submitOtp, submitting };
}
