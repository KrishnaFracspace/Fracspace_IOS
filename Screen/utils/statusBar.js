import { Platform, StatusBar } from 'react-native';

/**
 * Status bar icon colour, per screen.
 *
 * On iOS and on Android 15+ (targetSdk 35+ forces edge-to-edge) the status bar
 * has no background of its own: the screen's top shows through it, and
 * StatusBar.setBackgroundColor is ignored. The icons must match each screen's
 * top colour. Before this, HomePage's light-content leaked into every screen,
 * leaving white icons on white screens (Portfolio, Wallet, Property...).
 *
 * Android 14 and older still paint the navy bar (HomePage's <StatusBar>), so
 * white icons are right everywhere there and nothing changes.
 */
export const EDGE_TO_EDGE = Platform.OS === 'ios' || Platform.Version >= 35;

// Screens whose top (behind the status bar) is dark: the navy #021265 header,
// black screens, and the dark concert/booking screens. Everything else has a
// light top and gets dark icons.
const LIGHT_CONTENT_ROUTES = new Set([
  'HomePage',
  'Profile',
  'MyProfile',
  'NotificationsScreen',
  'MonthlyInsight',
  'Aboutus',
  'Privacy',
  'TermsAndCondition',
  'Book',
  'BookingHistory',
  'Review',
  'SiteHistory',
  'Enquirenew',
  'Chat',
  'AltairaExperience',
  'EscapePaymentPage',
  'ConcertDetails',
  'ConcertCheckout',
  'ConcertReviewBooking',
  'ConcertPaymentPage',
  'ConcertBookings',
  'ConcertBookingDetail',
  'ConcertBookingSuccess',
  'ConcertBookingFailed',
]);

// One entry in React Native's StatusBar stack, updated on every screen change.
// Unlike StatusBar.setBarStyle, a stack entry isn't undone when a <StatusBar>
// element elsewhere mounts or unmounts (e.g. LiveStream's `hidden`): the stack
// is re-merged and this entry's barStyle still applies.
let stackEntry = null;

/** Call with the focused route's name whenever navigation changes. */
export function applyStatusBarForRoute(routeName) {
  if (!EDGE_TO_EDGE || !routeName) return;
  const props = {
    barStyle: LIGHT_CONTENT_ROUTES.has(routeName) ? 'light-content' : 'dark-content',
    animated: true,
  };
  if (stackEntry) {
    stackEntry = StatusBar.replaceStackEntry(stackEntry, props);
  } else {
    stackEntry = StatusBar.pushStackEntry(props);
  }
}
