import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONCERT_THEME as T } from '../utils/concertData';
import {
  GetConcertBookingOptions,
  GetConcertCheckoutQuote,
  CreateConcertBooking,
  classifyBookingError,
} from '../Services/UserApi';
import {
  normalizeBookingOptions,
  normalizeCheckoutQuote,
  normalizeBookResponse,
} from '../utils/concertBookingAdapter';

/** Re-quote this long after the last tap, so a stepper held down fires once. */
const QUOTE_DEBOUNCE_MS = 350;

/**
 * Indian digit grouping. Written by hand rather than with toLocaleString
 * because Hermes ships without full Intl, so en-IN grouping is not reliable.
 */
export function formatMoney(value, currency = 'INR') {
  const v = Math.round(Number(value) || 0);
  const s = String(Math.abs(v));
  let grouped;
  if (s.length <= 3) {
    grouped = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return (v < 0 ? '-' : '') + symbol + grouped;
}

/**
 * Ticket checkout.
 *
 * Every figure on this screen comes from the server. The client sends
 * quantities and a wallet flag and renders whatever comes back - it never
 * adds up a total, never splits wallet against gateway, and never decides
 * how much wallet is usable. /checkout is free to call (it creates nothing),
 * so it is re-run on every change and its answer is the only source of truth.
 *
 * Ends at a created booking, which is handed to the caller through
 * onBookingCreated. Opening PayU is the caller's job.
 */
export default function ConcertCheckoutSheet({
  visible,
  onClose,
  concert,
  initialCityId,
  onBookingCreated,
  onRequireLogin,
}) {
  const insets = useSafeAreaInsets();

  const concertId = concert?.id;
  const concertTitle = concert?.title || '';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [options, setOptions] = useState(null);

  const [cityId, setCityId] = useState(initialCityId || null);
  const [qty, setQty] = useState({});
  const [useWallet, setUseWallet] = useState(true);

  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const [paying, setPaying] = useState(false);

  // /book is not idempotent, so state alone is not enough to stop a double
  // tap: a second press can land before React has re-rendered the disabled
  // button. A ref is checked synchronously.
  const payingRef = useRef(false);
  // Guards against out-of-order quote responses overwriting a newer one.
  const quoteSeq = useRef(0);
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

  /* ---------------- options ---------------- */

  const loadOptions = useCallback(async () => {
    if (!concertId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const token = await getToken();
      const res = await GetConcertBookingOptions({ concertId, cityId, token });
      if (!mounted.current) return;
      const next = normalizeBookingOptions(res?.data);
      setOptions(next);
      setCityId(prev => prev || next.selectedCityId);
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);
      setLoadError(
        e.message ||
          (e.kind === 'network'
            ? 'Could not reach the server. Check your connection.'
            : 'Ticket booking is not available right now.'),
      );
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [concertId, cityId, getToken]);

  useEffect(() => {
    if (visible) loadOptions();
    // deliberately not depending on loadOptions: cityId is in its deps and a
    // city change must not re-fetch options, only re-quote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, concertId]);

  // reset per-open state
  useEffect(() => {
    if (!visible) {
      setQty({});
      setQuote(null);
      setFieldErrors({});
      setNotice(null);
      setPaying(false);
      payingRef.current = false;
    }
  }, [visible]);

  /* ---------------- derived ---------------- */

  const city = useMemo(
    () => (options?.cities || []).find(c => c.id === cityId) || null,
    [options, cityId],
  );
  const tiers = city?.ticketTypes || [];
  const currency = city?.currency || 'INR';

  const items = useMemo(
    () =>
      tiers
        .map(t => ({ ticketTypeId: t.id, quantity: qty[t.id] || 0 }))
        .filter(i => i.quantity > 0),
    [tiers, qty],
  );
  const totalQty = items.reduce((n, i) => n + i.quantity, 0);

  const maxPerBooking = options?.booking?.maxTicketsPerBooking;
  const remainingForUser = options?.booking?.ticketsRemainingForUser;
  const alreadyHeld = options?.booking?.ticketsAlreadyHeld || 0;

  const wallet = quote?.wallet || options?.wallet || null;
  const walletUsable = !!wallet && wallet.enabled && wallet.available;

  /** Why the + button is capped, so the limit is explained rather than dead. */
  const capReason = useCallback(
    tier => {
      const q = qty[tier.id] || 0;
      if (tier.remaining !== null && q >= tier.remaining) {
        return 'Only ' + tier.remaining + ' left';
      }
      if (tier.maxPerBooking !== null && q >= tier.maxPerBooking) {
        return 'Max ' + tier.maxPerBooking + ' per booking';
      }
      if (typeof remainingForUser === 'number' && totalQty >= remainingForUser) {
        return alreadyHeld > 0
          ? 'You already hold ' + alreadyHeld
          : 'Limit reached';
      }
      if (typeof maxPerBooking === 'number' && totalQty >= maxPerBooking) {
        return 'Max ' + maxPerBooking + ' per booking';
      }
      return null;
    },
    [qty, totalQty, remainingForUser, maxPerBooking, alreadyHeld],
  );

  const step = (tier, delta) => {
    if (delta > 0 && capReason(tier)) return;
    setQty(prev => {
      const q = prev[tier.id] || 0;
      const min = tier.minPerBooking;
      let next = q + delta;
      if (next < 0) next = 0;
      // a tier with a minimum jumps straight to it rather than sitting at an
      // invalid 1 that the server would reject
      if (delta > 0 && typeof min === 'number' && next < min) next = min;
      if (delta < 0 && typeof min === 'number' && next > 0 && next < min) next = 0;
      return { ...prev, [tier.id]: next };
    });
    setFieldErrors({});
  };

  /* ---------------- quote ---------------- */

  const basketKey = JSON.stringify(items);

  useEffect(() => {
    if (!visible || !concertId || !cityId) return;
    if (!items.length) {
      setQuote(null);
      setQuoting(false);
      return;
    }
    const seq = ++quoteSeq.current;
    setQuoting(true);
    const timer = setTimeout(async () => {
      try {
        const token = await getToken();
        const res = await GetConcertCheckoutQuote(
          concertId,
          { cityId, items, useWallet },
          token,
        );
        if (!mounted.current || seq !== quoteSeq.current) return;
        setQuote(normalizeCheckoutQuote(res?.data));
        setFieldErrors({});
        setNotice(null);
      } catch (err) {
        if (!mounted.current || seq !== quoteSeq.current) return;
        const e = classifyBookingError(err);
        setQuote(null);
        if (e.kind === 'fieldErrors' || e.kind === 'conflict') {
          setFieldErrors(e.errors || {});
          setNotice(e.message || null);
        } else if (e.kind === 'auth') {
          setNotice('Please log in to continue.');
        } else if (e.kind === 'closed') {
          setNotice(e.message || 'Bookings for this concert are closed.');
        } else if (e.kind === 'network') {
          setNotice('Could not reach the server. Check your connection.');
        } else {
          setNotice(e.message || 'Could not price these tickets.');
        }
      } finally {
        if (mounted.current && seq === quoteSeq.current) setQuoting(false);
      }
    }, QUOTE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, concertId, cityId, basketKey, useWallet]);

  /* ---------------- pay ---------------- */

  const onPay = async () => {
    if (payingRef.current) return;
    if (!quote || quoting || !items.length) return;

    const token = await getToken();
    if (!token) {
      onRequireLogin?.();
      return;
    }

    payingRef.current = true;
    setPaying(true);
    setFieldErrors({});
    try {
      const res = await CreateConcertBooking(
        concertId,
        { cityId, items, useWallet, platform: Platform.OS },
        token,
      );
      if (!mounted.current) return;
      const result = normalizeBookResponse(res?.data);

      // /book re-prices server-side and the quote is not an input, so the
      // amount can move between the two calls. The booking already exists at
      // this point, so this is reported, not blocked.
      const quotedTotal = quote?.totalAmount;
      const bookedTotal = result?.booking?.totalAmount;
      const priceChanged =
        typeof quotedTotal === 'number' &&
        typeof bookedTotal === 'number' &&
        quotedTotal !== bookedTotal;

      onBookingCreated?.({ ...result, priceChanged, quotedTotal });
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);

      if (e.kind === 'auth') {
        onRequireLogin?.();
      } else if (e.kind === 'fieldErrors') {
        setFieldErrors(e.errors || {});
        setNotice(e.message || null);
      } else if (e.kind === 'conflict' && e.walletChanged) {
        // the balance moved since the quote; nothing was debited
        setUseWallet(false);
        setNotice(
          e.errors?.walletAmount ||
            'Your wallet balance changed. The amount has been updated.',
        );
        loadOptions();
      } else if (e.kind === 'conflict') {
        setFieldErrors(e.errors || {});
        setNotice(e.message || 'Those tickets are no longer available.');
        loadOptions();
      } else if (e.kind === 'closed') {
        Toast.show({
          type: 'error',
          text1: e.message || 'Bookings for this concert are closed.',
        });
        onClose?.();
      } else if (e.kind === 'network') {
        // The booking MAY have been created. Never retry blindly - a second
        // call would make a second booking and a second PayU transaction.
        setNotice(
          'We could not confirm that. Check "My bookings" before trying again.',
        );
      } else {
        setNotice(e.message || 'Could not create the booking.');
      }
    } finally {
      if (mounted.current) {
        setPaying(false);
        payingRef.current = false;
      }
    }
  };

  /* ---------------- render helpers ---------------- */

  const bookableCities = (options?.cities || []).filter(c => c.bookable);
  const payLabel = quote
    ? quote.requiresPayU
      ? 'Pay ' + formatMoney(quote.payuAmount, quote.currency)
      : 'Confirm booking'
    : 'Select tickets';
  const canPay = !!quote && !quoting && !paying && items.length > 0;

  const dismiss = () => {
    if (paying) return; // never close mid-booking
    onClose?.();
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centre}>
          <ActivityIndicator color={T.gold} />
        </View>
      );
    }
    if (loadError) {
      return (
        <View style={styles.centre}>
          <Icon name="alert-circle-outline" size={26} color={T.textDim} />
          <Text style={styles.emptyText}>{loadError}</Text>
          <TouchableOpacity onPress={loadOptions} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!options?.booking?.enabled || !bookableCities.length) {
      return (
        <View style={styles.centre}>
          <Icon name="time-outline" size={26} color={T.textDim} />
          <Text style={styles.emptyText}>
            Ticket booking is not open yet. We will let you know the moment it is.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 18 }}>
        {/* ---------- city ---------- */}
        {bookableCities.length > 1 ? (
          <>
            <Text style={styles.label}>SELECT CITY</Text>
            <View style={styles.chipRow}>
              {bookableCities.map(c => {
                const active = c.id === cityId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      setCityId(c.id);
                      setQty({});
                      setQuote(null);
                      setFieldErrors({});
                    }}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}>
                      {c.city}
                    </Text>
                    {c.fromPrice !== null ? (
                      <Text
                        style={[styles.chipSub, active && styles.chipSubActive]}>
                        from {formatMoney(c.fromPrice, c.currency)}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : null}
        {fieldErrors.cityId ? (
          <Text style={styles.errorText}>{fieldErrors.cityId}</Text>
        ) : null}

        {/* ---------- tiers ---------- */}
        <Text style={styles.label}>TICKETS</Text>
        {tiers.length === 0 ? (
          <Text style={styles.emptyInline}>
            No tickets on sale for this city yet.
          </Text>
        ) : null}
        {tiers.map(tier => {
          const q = qty[tier.id] || 0;
          const err = fieldErrors['items.' + tier.id];
          const cap = capReason(tier);
          const disabled = !tier.purchasable;
          return (
            <View
              key={tier.id}
              style={[styles.tierRow, err ? styles.tierRowError : null]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text
                  style={[styles.tierName, disabled && styles.tierNameOff]}>
                  {tier.label}
                </Text>
                <Text style={styles.tierPrice}>
                  {formatMoney(tier.price, currency)}
                </Text>
                {disabled ? (
                  <Text style={styles.tierMeta}>
                    {tier.soldOut ? 'Sold out' : 'Not on sale'}
                  </Text>
                ) : q > 0 && cap ? (
                  <Text style={styles.tierMeta}>{cap}</Text>
                ) : tier.remaining !== null && tier.remaining <= 10 ? (
                  <Text style={styles.tierMetaWarn}>
                    Only {tier.remaining} left
                  </Text>
                ) : null}
                {err ? <Text style={styles.errorText}>{err}</Text> : null}
              </View>

              {disabled ? null : (
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    disabled={q === 0}
                    onPress={() => step(tier, -1)}>
                    <Icon
                      name="remove"
                      size={17}
                      color={q === 0 ? T.textDim : T.text}
                    />
                  </TouchableOpacity>
                  <View style={styles.stepValueBox}>
                    <Text style={styles.stepValue}>{q}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    disabled={!!cap}
                    onPress={() => step(tier, 1)}>
                    <Icon
                      name="add"
                      size={17}
                      color={cap ? T.textDim : T.gold}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
        {fieldErrors.tickets ? (
          <Text style={styles.errorText}>{fieldErrors.tickets}</Text>
        ) : null}
        {alreadyHeld > 0 ? (
          <Text style={styles.heldNote}>
            You already hold {alreadyHeld} ticket{alreadyHeld === 1 ? '' : 's'}{' '}
            for this concert.
          </Text>
        ) : null}

        {/* ---------- wallet ---------- */}
        {wallet && wallet.enabled ? (
          <TouchableOpacity
            activeOpacity={walletUsable ? 0.85 : 1}
            onPress={() => walletUsable && setUseWallet(v => !v)}
            style={[
              styles.walletCard,
              useWallet && walletUsable && styles.walletCardOn,
            ]}>
            <Icon
              name="wallet-outline"
              size={19}
              color={useWallet && walletUsable ? T.gold : T.textDim}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.walletTitle}>{wallet.label}</Text>
              <Text style={styles.walletSub}>
                {wallet.requiresLogin
                  ? 'Log in to use your wallet balance'
                  : walletUsable
                  ? 'Balance ' + formatMoney(wallet.balance, currency)
                  : 'No wallet balance available'}
              </Text>
            </View>
            {walletUsable ? (
              <View
                style={[styles.toggle, useWallet && styles.toggleOn]}>
                <View
                  style={[styles.knob, useWallet && styles.knobOn]}
                />
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {fieldErrors.walletAmount ? (
          <Text style={styles.errorText}>{fieldErrors.walletAmount}</Text>
        ) : null}

        {/* ---------- summary ---------- */}
        {items.length > 0 ? (
          <View style={[styles.summary, quoting && styles.summaryStale]}>
            {quote ? (
              <>
                {quote.items.map(i => (
                  <Row
                    key={i.ticketTypeId}
                    left={i.label + ' x ' + i.quantity}
                    right={formatMoney(i.amount, quote.currency)}
                  />
                ))}
                {quote.discount > 0 ? (
                  <Row
                    left="Discount"
                    right={'-' + formatMoney(quote.discount, quote.currency)}
                    accent
                  />
                ) : null}
                {quote.fees > 0 ? (
                  <Row
                    left="Fees"
                    right={formatMoney(quote.fees, quote.currency)}
                  />
                ) : null}
                <View style={styles.summaryDivider} />
                <Row
                  left="Total"
                  right={formatMoney(quote.totalAmount, quote.currency)}
                  strong
                />
                {quote.wallet.applied > 0 ? (
                  <Row
                    left="Paid from wallet"
                    right={'-' + formatMoney(quote.wallet.applied, quote.currency)}
                    accent
                  />
                ) : null}
                {quote.requiresPayU ? (
                  <Row
                    left="To pay now"
                    right={formatMoney(quote.payuAmount, quote.currency)}
                    strong
                  />
                ) : null}
              </>
            ) : (
              <View style={styles.summaryLoading}>
                <ActivityIndicator color={T.gold} size="small" />
              </View>
            )}
          </View>
        ) : null}

        {quote?.notice ? (
          <Text style={styles.noticeText}>{quote.notice}</Text>
        ) : null}
        {notice ? <Text style={styles.warnText}>{notice}</Text> : null}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={dismiss}>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.heading}>
                {options?.booking?.enabled
                  ? concert?.booking?.title || 'Book your tickets'
                  : 'Tickets'}
              </Text>
              <Text style={styles.subHeading}>
                {concertTitle}
                {city ? ' • ' + city.city : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={dismiss}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}>
              <Icon name="close" size={19} color={T.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {renderBody()}

          {options?.booking?.enabled && bookableCities.length ? (
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!canPay}
              onPress={onPay}
              style={{ marginTop: 14, opacity: canPay ? 1 : 0.45 }}>
              <LinearGradient
                colors={[T.goldLight, T.gold, T.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.payBtn}>
                {paying ? (
                  <ActivityIndicator color="#1A1206" />
                ) : (
                  <Text style={styles.payText}>{payLabel}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function Row({ left, right, strong, accent }) {
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.rowLeft,
          strong && styles.rowStrong,
          accent && styles.rowAccent,
        ]}>
        {left}
      </Text>
      <Text
        style={[
          styles.rowRight,
          strong && styles.rowStrong,
          accent && styles.rowAccent,
        ]}>
        {right}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    maxHeight: '90%',
  },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heading: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 20 },
  subHeading: {
    color: T.gold,
    fontFamily: 'WorkSans-Medium',
    fontSize: 12.5,
    marginTop: 5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginTop: 16,
    marginBottom: 4,
  },

  centre: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: 10 },
  emptyText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyInline: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    paddingVertical: 10,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  retryText: { color: T.gold, fontFamily: 'WorkSans-SemiBold', fontSize: 13 },

  label: {
    color: '#E3DCD5',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    letterSpacing: 0.9,
    marginBottom: 8,
    marginTop: 16,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: { borderColor: T.gold, backgroundColor: 'rgba(206,143,82,0.12)' },
  chipText: { color: T.textMuted, fontFamily: 'WorkSans-SemiBold', fontSize: 13.5 },
  chipTextActive: { color: T.text },
  chipSub: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  chipSubActive: { color: T.gold },

  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },
  tierRowError: { borderColor: '#B3453B' },
  tierName: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 14.5 },
  tierNameOff: { color: T.textDim },
  tierPrice: {
    color: T.gold,
    fontFamily: 'WorkSans-Bold',
    fontSize: 15,
    marginTop: 3,
  },
  tierMeta: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 4,
  },
  tierMetaWarn: {
    color: '#E0A85A',
    fontFamily: 'WorkSans-Medium',
    fontSize: 11.5,
    marginTop: 4,
  },
  heldNote: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    marginTop: 2,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 10,
    backgroundColor: T.surfaceActive,
    overflow: 'hidden',
  },
  stepBtn: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center' },
  stepValueBox: {
    minWidth: 34,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.border,
  },
  stepValue: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 15.5 },

  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
  },
  walletCardOn: {
    borderColor: 'rgba(206,143,82,0.55)',
    backgroundColor: 'rgba(206,143,82,0.07)',
  },
  walletTitle: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 14 },
  walletSub: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    marginTop: 3,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.surfaceActive,
    borderWidth: 1,
    borderColor: T.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: 'rgba(206,143,82,0.28)', borderColor: T.gold },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: T.textDim,
  },
  knobOn: { backgroundColor: T.gold, alignSelf: 'flex-end' },

  summary: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  summaryStale: { opacity: 0.55 },
  summaryLoading: { paddingVertical: 18, alignItems: 'center' },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLeft: { color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 13 },
  rowRight: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  rowStrong: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 14.5 },
  rowAccent: { color: T.gold },

  noticeText: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    lineHeight: 18,
    marginTop: 12,
  },
  warnText: {
    color: '#E0A85A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 12,
  },
  errorText: {
    color: '#E0736A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 5,
  },

  payBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
});
