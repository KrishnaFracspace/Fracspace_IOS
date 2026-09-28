import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOOKING_THEME as T } from './utils/concertData';
import useBookingStatusBar from './utils/useBookingStatusBar';
import {
  formatCountdown,
  formatEventShort,
  formatMoney,
} from './utils/concertFormat';
import {
  CreateConcertBooking,
  GetConcertCheckoutQuote,
  classifyBookingError,
} from '../../Services/UserApi';
import {
  buildPaymentSummary,
  normalizeBookResponse,
  normalizeCheckoutQuote,
} from './utils/concertBookingAdapter';

/**
 * How long the selection is shown as held.
 *
 * NOTE: this is a UI device, not a reservation. The API reserves nothing
 * until /book, so no seats are actually held while this counts down. When
 * backend adds a real hold, drive this from the value it returns instead of
 * the constant.
 */
const HOLD_SECONDS = 30 * 60;

/**
 * Review Booking - the last screen before money moves.
 *
 * The quote is carried over from checkout so this renders instantly, then
 * re-quoted once on mount: /checkout creates nothing, and paying against a
 * stale price is worse than a moment's flicker.
 *
 * /book is only called when the user taps the button here. Wallet-covered
 * bookings come back already confirmed and never touch PayU.
 */
export default function ConcertReviewBooking({ route, navigation }) {
  useBookingStatusBar();
  const {
    concert,
    concertId,
    cityId,
    items,
    useWallet,
    quote: initialQuote,
    city,
    options,
  } = route.params || {};

  const [quote, setQuote] = useState(initialQuote || null);
  const [rechecking, setRechecking] = useState(false);
  const [changed, setChanged] = useState(false);
  const [paying, setPaying] = useState(false);
  const [notice, setNotice] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  // /book is not idempotent, so a ref is checked synchronously: disabling by
  // state alone lets a second press land before the re-render.
  const payingRef = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const getToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem('mytoken');
    } catch (e) {
      return null;
    }
  }, []);

  /* ---------------- countdown ---------------- */

  // Anchored to the clock rather than counted down tick by tick: JS timers are
  // throttled or suspended while the app is backgrounded (Doze on Android), so
  // a decrementing counter would still read "24:13" after 40 real minutes and
  // let the user pay against a quote that long expired.
  const holdUntil = useRef(Date.now() + HOLD_SECONDS * 1000);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.round((holdUntil.current - Date.now()) / 1000));
      setSecondsLeft(left);
      return left;
    };
    tick();
    const id = setInterval(tick, 1000);
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active') tick();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || paying) return;
    Alert.alert(
      'Time expired',
      'Please pick your tickets again so we can check the latest prices.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  }, [secondsLeft, paying, navigation]);

  /* ---------------- re-quote on entry ---------------- */

  useEffect(() => {
    if (!concertId || !cityId || !items?.length) return;
    let alive = true;
    (async () => {
      setRechecking(true);
      try {
        const token = await getToken();
        const res = await GetConcertCheckoutQuote(
          concertId,
          { cityId, items, useWallet },
          token,
        );
        if (!alive || !mounted.current) return;
        const fresh = normalizeCheckoutQuote(res?.data);
        if (initialQuote && fresh.payuAmount !== initialQuote.payuAmount) {
          setChanged(true);
        }
        setQuote(fresh);
      } catch (err) {
        if (!alive || !mounted.current) return;
        const e = classifyBookingError(err);
        // the carried-over quote still renders; only a hard stop is surfaced
        if (e.kind === 'closed' || e.kind === 'conflict') {
          setNotice(e.message || 'These tickets are no longer available.');
        }
      } finally {
        if (alive && mounted.current) setRechecking(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // /book is in flight: the response is the only thing that knows a booking was
  // created, so leaving now loses it. The header button is already disabled
  // while paying; Android's hardware back is not, so it is swallowed here.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => paying);
    return () => sub.remove();
  }, [paying]);

  /* ---------------- pay ---------------- */

  const onPay = async () => {
    if (payingRef.current || !quote || secondsLeft <= 0) return;
    // Claimed BEFORE the first await. Reading the token is a native round trip
    // (SQLite on Android), and a second tap landing inside it would otherwise
    // pass this same check and create a second booking on a /book that is not
    // idempotent. Every early return below has to hand the claim back.
    payingRef.current = true;
    setPaying(true);
    setNotice(null);

    const token = await getToken();
    if (!mounted.current) return;
    if (!token) {
      payingRef.current = false;
      setPaying(false);
      navigation.navigate('NewLogin', {
        redirectAfterLogin: { screen: 'ConcertDetails', params: { concertId } },
      });
      return;
    }

    try {
      const res = await CreateConcertBooking(
        concertId,
        { cityId, items, useWallet, platform: Platform.OS },
        token,
      );
      if (!mounted.current) return;
      const result = normalizeBookResponse(res?.data);

      // /book re-prices server-side and the quote is not an input, so the
      // booking's total can differ from what was on screen. It already
      // exists by now, so this is reported rather than blocked.
      // The total is not enough on its own: if the wallet covers less than it
      // did at quote time, the total is unchanged while the amount actually
      // charged at the gateway goes up - and the gateway amount is the one the
      // button promised.
      const bookedTotal = result?.booking?.totalAmount;
      const bookedPayu = result?.booking?.payment?.payuAmount;
      const priceChanged =
        (typeof quote.totalAmount === 'number' &&
          typeof bookedTotal === 'number' &&
          quote.totalAmount !== bookedTotal) ||
        (typeof quote.payuAmount === 'number' &&
          typeof bookedPayu === 'number' &&
          quote.payuAmount !== bookedPayu);

      if (result.settledImmediately) {
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
          bookingId: result.booking?.bookingId,
          referenceCode: result.booking?.referenceCode,
          booking: result.booking,
          concert,
          priceChanged,
        });
        return;
      }
      // requiresPayU with no usable form: the booking exists, so hand it on
      // to be resumed rather than dropping it silently.
      navigation.replace('ConcertBookingFailed', {
        outcome: 'error',
        resumable: true,
        bookingId: result.booking?.bookingId,
        referenceCode: result.booking?.referenceCode,
        booking: result.booking,
        concert,
      });
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);
      if (e.kind === 'auth') {
        navigation.navigate('NewLogin', {
          redirectAfterLogin: { screen: 'ConcertDetails', params: { concertId } },
        });
      } else if (e.kind === 'conflict' && e.walletChanged) {
        setNotice(
          (e.errors && e.errors.walletAmount) ||
            'Your wallet balance changed. Please go back and check the amount.',
        );
      } else if (e.kind === 'network') {
        // The booking MAY exist. Never retry blindly - a second call makes a
        // second booking and a second PayU transaction.
        setNotice(
          'We could not confirm that. Check "My bookings" before trying again.',
        );
      } else if (e.kind === 'closed') {
        setNotice(e.message || 'Bookings for this concert are closed.');
      } else {
        setNotice(e.message || 'Could not create your booking.');
      }
    } finally {
      if (mounted.current) {
        setPaying(false);
        payingRef.current = false;
      }
    }
  };

  /* ---------------- render ---------------- */

  const currency = quote?.currency || city?.currency || 'INR';
  const walletApplied = quote?.wallet?.applied || 0;
  const payuAmount = quote?.payuAmount || 0;
  const walletOnly = !!quote && payuAmount === 0;
  const summaryRows = buildPaymentSummary(quote, {
    walletLabel: options?.wallet?.label,
  });

  // The most generous rule is what the reassurance line quotes.
  const bestRule = (options?.refundPolicy?.rules || []).reduce(
    (best, r) => (!best || r.refundPercent > best.refundPercent ? r : best),
    null,
  );

  const venueLine = [city?.venueAddress || city?.venue, city?.city]
    .filter(Boolean)
    .join(', ');
  const dateLine = [formatEventShort(city?.eventDate) || city?.dateLabel, city?.city]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={paying}
          activeOpacity={0.85}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.circleBtn}>
          <Icon name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Booking</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}>
        <View style={styles.holdBar}>
          <Icon name="timer-outline" size={14} color={T.goldLight} />
          <Text style={styles.holdText}>
            Seats held for{' '}
            <Text style={styles.holdTime}>{formatCountdown(secondsLeft)}</Text>
          </Text>
        </View>

        {/* ---------- what ---------- */}
        <View style={styles.card}>
          {venueLine ? <Text style={styles.venue}>{venueLine}</Text> : null}
          {dateLine ? <Text style={styles.when}>{dateLine}</Text> : null}
          {quote?.items?.length ? <View style={styles.cardDivider} /> : null}
          {(quote?.items || []).map(i => (
            <View key={i.ticketTypeId} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {i.label} {'×'} {i.quantity}
              </Text>
              <Text style={styles.itemAmount}>
                {formatMoney(i.amount, currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* ---------- money ---------- */}
        <View style={[styles.card, rechecking && styles.stale]}>
          {summaryRows.map((r, idx) => (
            <React.Fragment key={r.key}>
              {r.key === 'total' ? <View style={styles.cardDivider} /> : null}
              <Row
                icon={r.icon}
                left={r.label}
                right={
                  (r.negative ? '- ' : '') + formatMoney(r.value, currency)
                }
                strong={r.strong}
                accent={r.accent}
              />
            </React.Fragment>
          ))}
        </View>

        {bestRule && options?.refundPolicy?.cancellationAllowed ? (
          <View style={styles.noteRow}>
            <Icon name="alert-circle-outline" size={13} color={T.textDim} />
            <Text style={styles.noteText}>
              Cancel now and get {bestRule.refundPercent}% back
              {bestRule.label ? ' – ' + bestRule.label.toLowerCase() : ''}.
            </Text>
          </View>
        ) : null}

        {changed ? (
          <Text style={styles.warnText}>
            The price was updated just now. Please check the amount before paying.
          </Text>
        ) : null}
        {notice ? <Text style={styles.warnText}>{notice}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!quote || paying || secondsLeft <= 0}
          onPress={() => onPay()}
          style={{ opacity: !quote || paying || secondsLeft <= 0 ? 0.5 : 1 }}>
          {/* sampled: #D29355 -> #E6B47A -> #D2975C, light band in the middle */}
          <LinearGradient
            colors={[T.goldDark, T.goldLight, T.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}>
            {paying ? (
              <ActivityIndicator color="#1A1206" />
            ) : (
              <>
                <Icon
                  name={walletOnly ? 'wallet-outline' : 'lock-closed'}
                  size={15}
                  color="#1A1206"
                />
                <Text style={styles.ctaText}>
                  {walletOnly
                    ? 'Confirm with wallet'
                    : 'Pay ' + formatMoney(payuAmount, currency)}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Row({ left, right, strong, accent, icon }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeftWrap}>
        {icon ? (
          <Icon name={icon} size={13} color={T.textMuted} style={{ marginRight: 7 }} />
        ) : null}
        <Text style={[styles.rowLeft, strong && styles.rowStrong, accent && styles.rowAccent]}>
          {left}
        </Text>
      </View>
      <Text style={[styles.rowRight, strong && styles.rowStrong, accent && styles.rowAccent]}>
        {right}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  // measured 48pt across, flat #212123, no border
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 17 },

  body: { paddingHorizontal: 22, paddingBottom: 24 },

  holdBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.holdBanner,
    borderRadius: 11,
    paddingHorizontal: 14,
    height: 36,
    marginTop: 6,
  },
  holdText: { color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 12.5 },
  holdTime: { color: T.goldLight, fontFamily: 'WorkSans-Bold' },

  // measured 112pt tall with a 12pt gap, borderless
  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 12,
    justifyContent: 'center',
  },
  stale: { opacity: 0.6 },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 12,
  },
  venue: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 15 },
  when: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    marginTop: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  itemName: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 14 },
  itemAmount: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 14 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  rowLeftWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 },
  rowLeft: { color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 13 },
  rowRight: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  rowStrong: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
  rowAccent: { color: T.gold },

  noteRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14 },
  noteText: {
    flex: 1,
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    lineHeight: 18,
    marginLeft: 7,
  },
  warnText: {
    color: '#E0A85A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 14,
  },

  footer: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 50,
    borderRadius: 14,
  },
  ctaText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
});
