import { Platform } from 'react-native';

/**
 * Payment gateways (PayU) hand off to UPI apps with either a plain link
 * (upi://pay?..., phonepe://..., tez://...) or, on Android, an "intent" link:
 *   intent://pay?pa=...#Intent;scheme=upi;package=com.phonepe.app;end
 * Chrome unwraps the latter, but React Native's Linking.openURL can't: Android
 * finds no app for "intent" and the UPI app never opens. This turns it back
 * into the plain scheme link (upi://pay?...).
 */
export const intentToSchemeUrl = url => {
  const match = /#Intent;.*?scheme=([^;]+);/i.exec(url);
  if (!match) return url;
  const body = url.slice('intent://'.length).split('#Intent')[0];
  return `${match[1]}://${body}`;
};

/** The URL to give Linking.openURL for a payment-app handoff. */
export const toPaymentAppUrl = url =>
  Platform.OS === 'android' && /^intent:\/\//i.test(url) ? intentToSchemeUrl(url) : url;
