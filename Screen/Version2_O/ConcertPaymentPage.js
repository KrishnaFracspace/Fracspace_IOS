import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONCERT_THEME as T } from '../utils/concertData';
import useBookingStatusBar from '../utils/useBookingStatusBar';
import { VerifyConcertPayment, classifyBookingError } from '../Services/UserApi';
import { classifyVerifyResponse } from '../utils/concertBookingAdapter';
import { clearPendingBooking, savePendingBooking } from '../utils/concertPendingBooking';

/**
 * Markers that mean PayU has handed the browser back.
 *
 * The server sets surl/furl to its own /booking/payu-callback, and may then
 * redirect on to the bunknbeyond marker pages the rest of the app uses. Both
 * are matched, so this works whether or not those env vars are configured.
 *
 * Deliberately NOT matching a bare "success" or "failure": those words turn up
 * inside gateway and bank URLs mid-flow, and settling early would close the
 * sheet while the user is still on the 3-D Secure step.
 */
const RETURN_MARKERS = [
  'payu-callback',
  'payu-webhook',
  'paymentsuccess',
  'payment-success',
  'paymentfailure',
  'payment-failure',
  'bunknbeyond.com',
];

/** Verify is not instant - PayU may still be settling. Poll, then give up. */
const POLL_DELAYS_MS = [0, 2000, 4000, 6000, 8000];

/**
 * Has the user actually reached the gateway?
 *
 * A bare origin does not count. Since the page is injected with the gateway's
 * origin as baseUrl, the very first navigation is already a payu URL - without
 * the path check this would flip true before the form had even posted, and an
 * instant back-out would then be reported as a possible lost payment rather
 * than an abandoned checkout.
 */
const atGateway = url =>
  /payu/i.test(url) && /^https?:\/\/[^/]+\/.+/i.test(url);

export default function ConcertPaymentPage({ route, navigation }) {
  useBookingStatusBar();
  const {
    payuHtml,
    payuAction,
    txnId,
    bookingId,
    referenceCode,
    booking,
    concert,
    priceChanged,
    quotedTotal,
  } = route.params || {};

  const [verifying, setVerifying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // True once the WebView has actually reached PayU. It decides whether an
  // abandoned checkout is reported neutrally or as a lost payment.
  const payuAttempted = useRef(false);
  // verify can be triggered by navigation, by app resume and by the user at
  // the same moment; only the first may run.
  const settling = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (booking) savePendingBooking(booking);
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem('mytoken');
    } catch (e) {
      return null;
    }
  }, []);

  /* ---------------- settle ---------------- */

  const goFailed = useCallback(
    (result, message) => {
      navigation.replace('ConcertBookingFailed', {
        booking: result?.booking || booking,
        outcome: result?.outcome || 'error',
        message: message || result?.displayMessage || null,
        needsSupport: !!result?.needsSupport,
        resumable: !!result?.resumable,
        referenceCode: result?.booking?.referenceCode || referenceCode,
        bookingId: result?.booking?.bookingId || bookingId,
        concert,
      });
    },
    [navigation, booking, referenceCode, bookingId, concert],
  );

  /**
   * Asks the server what actually happened. The WebView URL only says the
   * browser came back - it is never taken as the outcome.
   */
  const settle = useCallback(async () => {
    if (settling.current || !mounted.current) return;
    settling.current = true;
    setVerifying(true);

    const token = await getToken();
    const payload = txnId
      ? { txnID: txnId }
      : bookingId
      ? { bookingId }
      : { referenceCode };

    let last = null;
    for (let i = 0; i < POLL_DELAYS_MS.length; i++) {
      if (!mounted.current) return;
      if (POLL_DELAYS_MS[i] > 0) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, POLL_DELAYS_MS[i]));
      }
      if (!mounted.current) return;
      setAttempt(i + 1);

      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await VerifyConcertPayment(payload, token);
        last = classifyVerifyResponse(res, {
          payuAttempted: payuAttempted.current,
        });

        if (last.paid) {
          await clearPendingBooking();
          if (!mounted.current) return;
          navigation.replace('ConcertBookingSuccess', {
            booking: last.booking || booking,
            concert,
          });
          return;
        }
        // a settled non-payment (failed / expired / cancelled) is final
        if (!last.shouldRetry) break;
      } catch (err) {
        const e = classifyBookingError(err);
        if (e.kind === 'network') continue; // transient, keep polling
        if (e.kind === 'notFound') {
          last = { outcome: 'not_found', resumable: true, displayMessage: e.message };
          break;
        }
        last = { outcome: 'error', displayMessage: e.message };
        break;
      }
    }

    if (!mounted.current) return;
    setVerifying(false);
    settling.current = false;

    // Every attempt failed to reach the server, so we learned nothing: the
    // booking is untouched and still payable. Without this it falls through
    // as a plain error, the failure screen offers no retry, and a user who
    // HAS already paid is pushed towards paying a second time.
    if (!last) {
      last = {
        outcome: 'error',
        resumable: true,
        displayMessage:
          'We could not reach the server to confirm your payment. Your booking is still open.',
      };
    }

    // Still unresolved after polling: the booking stays payable, so it is
    // left in the pending store for the resume flow to pick up.
    goFailed(
      last,
      last && last.shouldRetry
        ? "We're still confirming your payment. If money has left your account, your tickets will be issued automatically."
        : null,
    );
  }, [getToken, txnId, bookingId, referenceCode, navigation, booking, concert, goFailed]);

  /* ---------------- webview plumbing ---------------- */

  const onShouldStartLoadWithRequest = request => {
    const url = request?.url || '';
    // Anything that is not a web page is a handoff to a UPI app (GPay,
    // PhonePe, Paytm, BHIM...). Matching on scheme rather than on app names
    // means a new wallet works without a code change.
    if (!/^(https?|about|data|blob):/i.test(url)) {
      Linking.openURL(url).catch(() =>
        Alert.alert(
          'App not found',
          'That payment app does not seem to be installed. Please pick another method.',
        ),
      );
      return false;
    }
    if (atGateway(url)) payuAttempted.current = true;
    return true;
  };

  const onNavigationStateChange = state => {
    const url = (state?.url || '').toLowerCase();
    if (!url) return;
    if (atGateway(url)) payuAttempted.current = true;
    if (RETURN_MARKERS.some(m => url.indexOf(m) !== -1)) settle();
  };

  // A UPI handoff takes the user out of the app entirely, and PayU's page
  // often does not navigate when they return. Re-checking on resume is what
  // catches a GPay payment that completed outside the WebView.
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active' && payuAttempted.current && !settling.current) {
        settle();
      }
    });
    return () => sub?.remove?.();
  }, [settle]);

  const confirmExit = useCallback(() => {
    if (settling.current) return true;
    if (!payuAttempted.current) {
      navigation.goBack();
      return true;
    }
    Alert.alert(
      'Leave payment?',
      'If you have already paid, we will check and confirm your booking.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'I have paid', onPress: () => settle() },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
    return true;
  }, [navigation, settle]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', confirmExit);
    return () => sub.remove();
  }, [confirmExit]);

  /* ---------------- render ---------------- */

  // Origin of the gateway, e.g. https://test.payu.in - see the WebView below.
  const payuOrigin = (() => {
    const m = /^(https?:\/\/[^/]+)/i.exec(String(payuAction || ''));
    return m ? m[1] : undefined;
  })();

  if (!payuHtml) {
    // normalizeBookResponse only sets canOpenPayU when a usable form exists,
    // so this is a guard against a bad navigation rather than an expected path
    return (
      <SafeAreaView style={styles.fallback}>
        <Icon name="alert-circle-outline" size={28} color={T.textDim} />
        <Text style={styles.fallbackText}>
          We could not open the payment page. Your booking has not been paid for.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.fallbackBtn}>
          <Text style={styles.fallbackBtnText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={confirmExit}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}>
          <Icon name="close" size={22} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Complete payment</Text>
          {referenceCode ? (
            <Text style={styles.headerSub}>{referenceCode}</Text>
          ) : null}
        </View>
        <Icon name="lock-closed" size={15} color={T.textDim} />
      </View>

      {priceChanged ? (
        <View style={styles.priceBanner}>
          <Icon name="information-circle-outline" size={16} color="#E0A85A" />
          <Text style={styles.priceBannerText}>
            The price changed while you were checking out. You are paying the
            amount shown on this page.
          </Text>
        </View>
      ) : null}

      <View style={styles.webWrap}>
        <WebView
          /**
           * baseUrl matters more than it looks.
           *
           * Injected HTML with no baseUrl runs on about:blank, so every cookie
           * PayU sets counts as third-party - and Android's WebView blocks
           * those by default. The gateway then loses its session mid-flow and
           * reports a failed payment, while iOS (which is far more permissive
           * here) sails through. Giving the page the gateway's own origin makes
           * the POST same-origin and the cookies first-party.
           */
          source={{ html: payuHtml, baseUrl: payuOrigin }}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
          startInLoadingState
          setSupportMultipleWindows={false}
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          javaScriptCanOpenWindowsAutomatically
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures={false}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onNavigationStateChange={onNavigationStateChange}
          renderLoading={() => (
            <View style={styles.webLoading}>
              <ActivityIndicator size="large" color={T.gold} />
              <Text style={styles.webLoadingText}>
                Loading secure payment...
              </Text>
            </View>
          )}
          onError={syntheticEvent => {
            const url = syntheticEvent?.nativeEvent?.url || '';
            // the return markers are pages that need not exist; a load error
            // on one of them is the normal end of the flow, not a failure
            if (RETURN_MARKERS.some(m => url.toLowerCase().indexOf(m) !== -1)) {
              settle();
            }
          }}
        />
      </View>

      {verifying ? (
        <View style={styles.veil}>
          <View style={styles.veilCard}>
            <ActivityIndicator size="large" color={T.gold} />
            <Text style={styles.veilTitle}>Confirming your payment</Text>
            <Text style={styles.veilNote}>
              {attempt > 2
                ? 'Still checking with the bank. Please do not close the app.'
                : 'This takes a few seconds.'}
            </Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.border,
  },
  headerBtn: { marginRight: 14 },
  headerTitle: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 16 },
  headerSub: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 2,
  },

  priceBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(224,168,90,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  priceBannerText: {
    flex: 1,
    color: '#E0A85A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },

  webWrap: { flex: 1, backgroundColor: '#FFFFFF' },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.bg,
  },
  webLoadingText: {
    marginTop: 14,
    color: T.textMuted,
    fontFamily: 'WorkSans-Medium',
    fontSize: 13.5,
  },

  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  veilCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 18,
    paddingHorizontal: 30,
    paddingVertical: 28,
    alignItems: 'center',
    maxWidth: 300,
  },
  veilTitle: {
    marginTop: 16,
    color: T.text,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 15.5,
  },
  veilNote: {
    marginTop: 7,
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
  },

  fallback: {
    flex: 1,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  fallbackText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 14,
  },
  fallbackBtn: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  fallbackBtnText: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13.5,
  },
});
