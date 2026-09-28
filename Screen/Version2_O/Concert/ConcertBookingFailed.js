import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONCERT_THEME as T } from './utils/concertData';
import useBookingStatusBar from './utils/useBookingStatusBar';
import { ResumeConcertPayment, classifyBookingError } from '../../Services/UserApi';
import { normalizeBookResponse } from './utils/concertBookingAdapter';
import { clearPendingBooking } from './utils/concertPendingBooking';

/**
 * Shown whenever the payment did not end in a confirmed booking.
 *
 * Three different situations land here and they must not read the same:
 *  - the payment failed outright: nothing was charged, book again
 *  - still settling: money may have left; the booking confirms on its own
 *  - amount mismatch: a human has to look at it, so no retry is offered
 */
const COPY = {
  payment_failed: {
    icon: 'close-circle-outline',
    title: 'Payment did not go through',
    body: 'Nothing was charged, and no money was taken from your wallet. You can try booking again.',
  },
  expired: {
    icon: 'time-outline',
    title: 'Your booking expired',
    body: 'Tickets are only held for a short while. Nothing was charged - please book again.',
  },
  pending: {
    icon: 'hourglass-outline',
    title: "We're still confirming",
    body: 'If money has left your account, your tickets will be issued automatically and your confirmation will arrive shortly.',
  },
  amount_mismatch: {
    icon: 'alert-circle-outline',
    title: 'This needs checking',
    body: 'Our team needs to look at this payment before it can go through. Please contact support with your booking reference.',
  },
  not_found: {
    icon: 'card-outline',
    title: 'Payment not completed',
    body: 'Your booking is still open. You can pick up where you left off.',
  },
  default: {
    icon: 'alert-circle-outline',
    title: "We couldn't confirm your payment",
    body: 'If money has left your account, please check again in a moment before trying to pay twice.',
  },
};

/**
 * Back to the home tab.
 *
 * Two things had to be right here and neither was obvious:
 * the bottom tab is called "HomeStack", not "Home" - navigating to a screen
 * name that does not exist resolves to nothing and the button silently does
 * nothing; and simply switching tabs would leave ConcertDetails -> Checkout
 * -> Review -> Payment -> this screen still stacked underneath, so the user
 * would not move. Resetting the ROOT navigator clears all of it.
 */
function goToHome(navigation) {
  let root = navigation;
  while (root.getParent && root.getParent()) root = root.getParent();
  try {
    root.reset({ index: 0, routes: [{ name: 'BottomNavigations' }] });
  } catch (e) {
    navigation.navigate('BottomNavigations', { screen: 'HomeStack' });
  }
}

export default function ConcertBookingFailed({ route, navigation }) {
  useBookingStatusBar();
  const {
    outcome,
    message,
    needsSupport,
    resumable,
    referenceCode,
    bookingId,
    booking,
    concert,
  } = route.params || {};

  const [retrying, setRetrying] = useState(false);
  const retryingRef = useRef(false);
  // retry replaces this screen on success, but every other branch comes back
  // to it after an await - and the user may have left by then
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const copy = COPY[outcome] || COPY.default;
  // Offer retry whenever a booking exists and nothing says it is finished.
  // 'payment_failed' and the cancelled/expired family are final - /pay would
  // answer 409 - and an amount mismatch needs a human, not another attempt.
  const FINAL = ['payment_failed', 'expired', 'cancelled', 'refunded', 'confirmed'];
  // `resumable` is the server's own verdict, reached by checking the booking's
  // status - it is stricter than the outcome list. An 'error' outcome from a
  // verify that threw is not in FINAL, so without this the screen offers
  // "try again" in exactly the states where it could not establish whether the
  // first attempt took the money.
  const canRetry =
    !!bookingId &&
    !needsSupport &&
    FINAL.indexOf(outcome) === -1 &&
    (resumable || outcome === 'pending' || outcome === 'unknown');

  const goHome = () => {
    clearPendingBooking();
    goToHome(navigation);
  };

  // Android back from here lands on the review screen with its old quote and
  // an uncleared pending entry, with nothing saying a booking is outstanding.
  // Back means the same thing the button means.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (retryingRef.current) return true;
      goHome();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onRetry = useCallback(async () => {
    if (retryingRef.current || !bookingId) return;
    retryingRef.current = true;
    setRetrying(true);
    try {
      const token = await AsyncStorage.getItem('mytoken');
      const res = await ResumeConcertPayment(bookingId, token);
      const result = normalizeBookResponse(res?.data);

      // The server checks PayU before issuing a new form. requiresPayU:false
      // means the earlier attempt actually succeeded - opening PayU again here
      // would charge the user twice.
      if (!result.requiresPayU && result.booking?.isConfirmed) {
        await clearPendingBooking();
        navigation.replace('ConcertBookingSuccess', {
          booking: result.booking,
          concert,
        });
        return;
      }
      if (result.canOpenPayU) {
        navigation.replace('ConcertPaymentPage', {
          payuHtml: result.payuHtml,
          payuAction: result.payuAction,
          txnId: result.txnId,
          bookingId: result.booking?.bookingId || bookingId,
          referenceCode: result.booking?.referenceCode || referenceCode,
          booking: result.booking,
          concert,
        });
        return;
      }
      // neither a confirmed booking nor a usable form came back: say so
      // rather than letting the button spin and stop
      if (!mounted.current) return;
      setRetrying(false);
      retryingRef.current = false;
      navigation.setParams({
        message: 'We could not reopen the payment. Please try again in a moment.',
      });
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);
      setRetrying(false);
      retryingRef.current = false;
      // 409 with errors.status means the previous attempt definitively failed
      // and this booking can never be paid for - a new booking is needed.
      navigation.setParams({
        outcome: e.retryBlocked ? 'payment_failed' : outcome,
        message:
          e.message ||
          (e.kind === 'network'
            ? 'Could not reach the server. Check your connection.'
            : null),
        resumable: false,
      });
    }
  }, [bookingId, referenceCode, navigation, concert, outcome]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name={copy.icon} size={38} color={T.gold} />
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.text}>{message || copy.body}</Text>

        {referenceCode ? (
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.refValue}>{referenceCode}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        {canRetry ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onRetry} disabled={retrying}>
            <LinearGradient
              colors={[T.goldLight, T.gold, T.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.cta, retrying && { opacity: 0.6 }]}>
              {retrying ? (
                <ActivityIndicator color="#1A1206" />
              ) : (
                <Text style={styles.ctaText}>Try payment again</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={goHome} style={styles.secondary} activeOpacity={0.8}>
          <Text style={styles.secondaryText}>
            {canRetry ? 'Not now' : 'Back to home'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 21,
    textAlign: 'center',
    marginTop: 22,
  },
  text: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  refCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 26,
  },
  refLabel: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  refValue: {
    color: T.text,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginTop: 5,
  },
  footer: { paddingHorizontal: 22, paddingBottom: 20 },
  cta: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
  secondary: { paddingVertical: 16, alignItems: 'center' },
  secondaryText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
});
