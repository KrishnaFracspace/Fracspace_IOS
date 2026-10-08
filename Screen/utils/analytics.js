import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

/**
 * Firebase Analytics helpers. One place for how users and events are tracked.
 *
 * Rules (Google Analytics terms): never send email, phone, name or anything else
 * that identifies a person directly. Users are identified by their account _id
 * (setUserId); look the id up in the user database to get their contact details.
 * See docs/DEVELOPER-GUIDE.md "Analytics".
 *
 * Every call is fire-and-forget: analytics must never break or slow a screen.
 */
const safe = promiseFn => {
  try {
    const p = promiseFn();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (e) {
    // ignore
  }
};

/** After login / on app start, once the profile is loaded. */
export const identifyUser = profile => {
  const id = profile?._id ? String(profile._id) : null;
  if (!id) return;
  const owner = !!(profile?.verification || profile?.ownedProperties?.length > 0);
  safe(() => analytics().setUserId(id));
  safe(() =>
    analytics().setUserProperties({
      user_type: owner ? 'owners' : 'normal', // same values as before
      verified: profile?.verification ? 'yes' : 'no',
    }),
  );
  // Crashes are linked to the same account id.
  safe(() => crashlytics().setUserId(id));
};

/** Logout / delete account: the next person on this phone is a new user. */
export const clearAnalyticsUser = () => {
  safe(() => analytics().setUserId(null));
  safe(() => analytics().resetAnalyticsData());
  safe(() => crashlytics().setUserId(''));
};

/** method: 'phone_otp' (India, SMS) or 'email_otp' (other countries). */
export const trackLogin = method => safe(() => analytics().logLogin({ method }));
export const trackSignUp = method => safe(() => analytics().logSignUp({ method }));

export const trackScreen = screenName => {
  if (!screenName) return;
  safe(() =>
    analytics().logScreenView({ screen_name: screenName, screen_class: screenName }),
  );
};

export const trackEvent = (name, params) => safe(() => analytics().logEvent(name, params));

/**
 * Booking funnel. flow: 'property' | 'concert' | 'membership'.
 * value is the amount in INR when known.
 */
export const trackCheckoutStarted = (flow, value) =>
  safe(() =>
    analytics().logBeginCheckout({
      currency: 'INR',
      ...(Number.isFinite(value) ? { value } : {}),
      items: [{ item_category: flow }],
    }),
  );

export const trackPurchase = (flow, { value, transactionId } = {}) =>
  safe(() =>
    analytics().logPurchase({
      currency: 'INR',
      ...(Number.isFinite(value) ? { value } : {}),
      ...(transactionId ? { transaction_id: String(transactionId) } : {}),
      items: [{ item_category: flow }],
    }),
  );

export const trackPaymentFailed = (flow, reason) =>
  trackEvent('payment_failed', { flow, reason: String(reason || 'unknown').slice(0, 100) });

/** Any enquiry / interest form sent successfully. */
export const trackLead = leadType => trackEvent('generate_lead', { lead_type: leadType });
