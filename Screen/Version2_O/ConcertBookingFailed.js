import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONCERT_THEME as T } from '../utils/concertData';
import { ResumeConcertPayment, classifyBookingError } from '../Services/UserApi';
import { normalizeBookResponse } from '../utils/concertBookingAdapter';
import { clearPendingBooking } from '../utils/concertPendingBooking';

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

export default function ConcertBookingFailed({ route, navigation }) {
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

  const copy = COPY[outcome] || COPY.default;
  const canRetry = !needsSupport && !!bookingId && (resumable || outcome === 'not_found');

  const goHome = () => {
    clearPendingBooking();
    navigation.navigate('BottomNavigations', { screen: 'Home' });
  };

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
          txnId: result.txnId,
          bookingId: result.booking?.bookingId || bookingId,
          referenceCode: result.booking?.referenceCode || referenceCode,
          booking: result.booking,
          concert,
        });
        return;
      }
      setRetrying(false);
      retryingRef.current = false;
    } catch (err) {
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
