import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShinyTag from './components/ShinyTag';
import { BOOKING_THEME as T } from './utils/concertData';
import {
  formatEventDateTime,
  formatMoney,
  formatShortDate,
} from './utils/concertFormat';
import {
  GetConcertBookingOptions,
  GetConcertCheckoutQuote,
  classifyBookingError,
} from '../../Services/UserApi';
import {
  normalizeBookingOptions,
  normalizeCheckoutQuote,
} from './utils/concertBookingAdapter';

/** Re-quote this long after the last tap, so a held stepper fires once. */
const QUOTE_DEBOUNCE_MS = 350;
const APP_STATUS_BAR_COLOR = '#021265';

/**
 * Ticket checkout.
 *
 * Every figure comes from the server. The client sends quantities and a
 * wallet flag to /checkout - which creates nothing, so it is safe to call on
 * every change - and renders the answer. It never adds up a total, never
 * splits wallet against gateway, and never works out how much wallet is
 * usable.
 *
 * Ends by handing the basket and its quote to ConcertReviewBooking. Nothing
 * is booked here.
 */
export default function ConcertCheckout({ route, navigation }) {
  const { concert, concertId: idParam, initialCityId } = route.params || {};
  const concertId = concert?.id || idParam;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [options, setOptions] = useState(null);

  const [cityId, setCityId] = useState(initialCityId || null);
  const [qty, setQty] = useState({});
  const [useWallet, setUseWallet] = useState(true);
  const [showRefunds, setShowRefunds] = useState(true);

  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(null);

  // Guards against a slow earlier quote landing after a newer one.
  const quoteSeq = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Android's translucent/colour flags are global, so they have to be put
  // back on blur or every other screen inherits them.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent');
      }
      return () => {
        if (Platform.OS === 'android') {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor(APP_STATUS_BAR_COLOR);
        }
      };
    }, []),
  );

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
    loadOptions();
    // cityId is in loadOptions' deps but must not re-fetch options; a city
    // change only re-quotes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concertId]);

  /* ---------------- derived ---------------- */

  const city = useMemo(
    () => (options?.cities || []).find(c => c.id === cityId) || null,
    [options, cityId],
  );
  const bookableCities = (options?.cities || []).filter(c => c.bookable);
  const tiers = city?.ticketTypes || [];
  const currency = city?.currency || options?.booking?.currency || 'INR';

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

  /**
   * The INSTANT chip wears the same shine as the FRACSPACE PRESENTS tag on the
   * details screen, so the wallet row is noticed on a screen the eye otherwise
   * runs straight down to the total.
   *
   * It keeps sweeping for as long as the wallet is usable, including across a
   * toggle - the row is the thing being advertised, not the switch. The only
   * thing that stops it is the OS asking for reduced motion.
   */
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(on => {
        if (alive) setReduceMotion(!!on);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      on => setReduceMotion(!!on),
    );
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);

  const shineOn = walletUsable && !reduceMotion;

  /** Why + is capped, so the limit explains itself instead of going dead. */
  const capReason = useCallback(
    tier => {
      const q = qty[tier.id] || 0;
      if (tier.remaining !== null && q >= tier.remaining) {
        return 'Only ' + tier.remaining + ' left';
      }
      if (tier.maxPerBooking !== null && q >= tier.maxPerBooking) {
        return 'Max ' + tier.maxPerBooking + ' of this ticket';
      }
      if (typeof remainingForUser === 'number' && totalQty >= remainingForUser) {
        return alreadyHeld > 0 ? 'You already hold ' + alreadyHeld : 'Limit reached';
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
      // a tier with a minimum jumps to it rather than sitting at an invalid 1
      if (delta > 0 && typeof min === 'number' && next < min) next = min;
      if (delta < 0 && typeof min === 'number' && next > 0 && next < min) next = 0;
      return { ...prev, [tier.id]: next };
    });
    setFieldErrors({});
  };

  /* ---------------- quote ---------------- */

  const basketKey = JSON.stringify(items);

  useEffect(() => {
    if (!concertId || !cityId) return undefined;
    if (!items.length) {
      setQuote(null);
      setQuoting(false);
      return undefined;
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
        } else if (e.kind === 'closed') {
          setNotice(e.message || 'Bookings for this concert are closed.');
        } else if (e.kind === 'network') {
          setNotice('Could not reach the server. Check your connection.');
        } else if (e.kind !== 'auth') {
          setNotice(e.message || 'Could not price these tickets.');
        }
      } finally {
        if (mounted.current && seq === quoteSeq.current) setQuoting(false);
      }
    }, QUOTE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concertId, cityId, basketKey, useWallet]);

  /* ---------------- proceed ---------------- */

  const onProceed = async () => {
    if (!quote || quoting || !items.length) return;
    if (options?.booking?.requireLogin) {
      const token = await getToken();
      if (!token) {
        navigation.navigate('NewLogin', {
          redirectAfterLogin: {
            screen: 'ConcertDetails',
            params: { concertId },
          },
        });
        return;
      }
    }
    navigation.navigate('ConcertReviewBooking', {
      concert,
      concertId,
      cityId,
      items,
      useWallet,
      quote,
      city,
      options,
    });
  };

  /* ---------------- render ---------------- */

  const hero = concert?.heroImage || concert?.posterImage || null;
  const canProceed = !!quote && !quoting && items.length > 0;

  if (loading) {
    return (
      <View style={styles.centreScreen}>
        <ActivityIndicator color={T.gold} size="large" />
      </View>
    );
  }

  if (loadError || !options?.booking?.enabled || !bookableCities.length) {
    return (
      <View style={styles.centreScreen}>
        <Icon
          name={loadError ? 'alert-circle-outline' : 'time-outline'}
          size={28}
          color={T.textDim}
        />
        <Text style={styles.emptyText}>
          {loadError ||
            'Ticket booking is not open yet. We will let you know the moment it is.'}
        </Text>
        <TouchableOpacity
          onPress={() => (loadError ? loadOptions() : navigation.goBack())}
          style={styles.retryBtn}>
          <Text style={styles.retryText}>
            {loadError ? 'Try again' : 'Go back'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}>
        {/* ---------- hero ---------- */}
        <View style={styles.heroWrap}>
          {hero ? (
            <Image source={{ uri: hero }} style={styles.hero} resizeMode="cover" />
          ) : (
            <View style={[styles.hero, { backgroundColor: T.surface }]} />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent', T.bg]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={[styles.heroBar, { top: insets.top + 8 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.circleBtn}>
              <Icon name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.securePill}>
              <Icon name="lock-closed" size={11} color={T.goldLight} />
              <Text style={styles.securePillText}>Secure Checkout</Text>
            </View>
          </View>
        </View>

        <View style={styles.pad}>
          {/* ---------- city ---------- */}
          {bookableCities.length > 1 ? (
            <View style={styles.chipRow}>
              {bookableCities.map(c => {
                const active = c.id === cityId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (c.id === cityId) return;
                      setCityId(c.id);
                      setQty({});
                      setQuote(null);
                      setFieldErrors({});
                    }}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {c.city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {/* ---------- when / where ---------- */}
          {city ? (
            <View style={styles.metaBlock}>
              <View style={styles.metaRow}>
                <Icon name="calendar-outline" size={14} color={T.textMuted} />
                <Text style={styles.metaText}>
                  {formatEventDateTime(city.eventDate) || city.dateLabel || ''}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Icon name="location-outline" size={14} color={T.textMuted} />
                <Text style={styles.metaText}>
                  {[city.venueAddress || city.venue, city.city]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            </View>
          ) : null}

          {/* ---------- tiers ---------- */}
          <Text style={styles.sectionTitle}>
            {options?.booking?.ticketSectionTitle || 'SELECT TICKETS'}
          </Text>

          {tiers.length === 0 ? (
            <Text style={styles.emptyInline}>
              No tickets on sale for this city yet.
            </Text>
          ) : null}

          {tiers.map(tier => {
            const q = qty[tier.id] || 0;
            const chosen = q > 0;
            const err = fieldErrors['items.' + tier.id];
            const cap = capReason(tier);
            const off = !tier.purchasable;
            return (
              <View
                key={tier.id}
                style={[
                  styles.tierCard,
                  chosen && styles.tierCardOn,
                  err ? styles.tierCardError : null,
                ]}>
                <View style={styles.tierHead}>
                  <View style={styles.tierTitleRow}>
                    <Text style={[styles.tierName, off && styles.dim]}>
                      {tier.label}
                    </Text>
                    {tier.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {tier.badge.toUpperCase()}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={[styles.radio, chosen && styles.radioOn]}>
                    {chosen ? <View style={styles.radioDot} /> : null}
                  </View>
                </View>

                {tier.description ? (
                  <Text style={styles.tierDesc}>{tier.description}</Text>
                ) : null}
                {tier.perks?.length ? (
                  <Text style={styles.tierPerks}>
                    {tier.perks.join('  •  ')}
                  </Text>
                ) : null}

                <View style={styles.tierFoot}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Price</Text>
                      {tier.compareAtPrice ? (
                        <>
                          <Text style={styles.strike}>
                            {formatMoney(tier.compareAtPrice, currency)}
                          </Text>
                          <View style={styles.offPill}>
                            <Text style={styles.offText}>
                              {tier.discountPercent}% OFF
                            </Text>
                          </View>
                        </>
                      ) : null}
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={[styles.price, off && styles.dim]}>
                        {formatMoney(tier.price, currency)}
                      </Text>
                      <Text style={styles.perTicket}>/ ticket</Text>
                    </View>
                  </View>

                  {off ? (
                    <Text style={styles.soldOut}>
                      {tier.soldOut ? 'Sold out' : 'Not on sale'}
                    </Text>
                  ) : (
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        activeOpacity={0.7}
                        disabled={q === 0}
                        onPress={() => step(tier, -1)}>
                        <Icon name="remove" size={16} color={q === 0 ? T.textDim : T.text} />
                      </TouchableOpacity>
                      <View style={styles.stepValueBox}>
                        <Text style={styles.stepValue}>{q}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.stepBtn, !cap && styles.stepBtnAdd]}
                        activeOpacity={0.7}
                        disabled={!!cap}
                        onPress={() => step(tier, 1)}>
                        <Icon name="add" size={16} color={cap ? T.textDim : '#1A1206'} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {err ? <Text style={styles.errorText}>{err}</Text> : null}
                {!err && chosen && cap ? (
                  <Text style={styles.capText}>{cap}</Text>
                ) : null}
              </View>
            );
          })}

          {fieldErrors.tickets ? (
            <Text style={styles.errorText}>{fieldErrors.tickets}</Text>
          ) : null}
          {maxPerBooking ? (
            <Text style={styles.limitNote}>
              Max {maxPerBooking} tickets per booking
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
              <View style={styles.walletIcon}>
                <Icon
                  name="wallet-outline"
                  size={17}
                  color={useWallet && walletUsable ? '#1A1206' : '#1A1206'}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <View style={styles.walletTitleRow}>
                  <Text style={styles.walletTitle}>
                    {wallet.label || 'Pay through FS Wallet'}
                  </Text>
                  {walletUsable ? (
                    <ShinyTag
                      label="INSTANT"
                      active={shineOn}
                      interval={2200}
                      sweepMs={900}
                      shineWidth={20}
                      style={styles.instantPill}
                      labelStyle={styles.instantText}
                      icon={<Icon name="flash" size={9} color="#FBEEDD" />}
                    />
                  ) : null}
                </View>
                <Text style={styles.walletSub}>
                  {wallet.requiresLogin
                    ? 'Log in to use your wallet balance'
                    : walletUsable ? (
                      <>
                        {'Available: '}
                        <Text style={styles.walletBalance}>
                          {formatMoney(wallet.balance, currency)}
                        </Text>
                      </>
                    ) : (
                      wallet.unavailableNote || 'No wallet balance available'
                    )}
                </Text>
              </View>
              {walletUsable ? (
                <View style={[styles.toggle, useWallet && styles.toggleOn]}>
                  <View style={[styles.knob, useWallet && styles.knobOn]} />
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}
          {fieldErrors.walletAmount ? (
            <Text style={styles.errorText}>{fieldErrors.walletAmount}</Text>
          ) : null}

          {/* ---------- running summary ---------- */}
          {items.length > 0 ? (
            <View style={[styles.summary, quoting && styles.stale]}>
              {quote ? (
                <>
                  {quote.items.map(i => (
                    <Row
                      key={i.ticketTypeId}
                      left={i.label + ' Ticket (' + i.quantity + 'x)'}
                      right={formatMoney(i.amount, quote.currency)}
                    />
                  ))}
                  {quote.wallet.applied > 0 ? (
                    <Row
                      left="Wallet"
                      right={'- ' + formatMoney(quote.wallet.applied, quote.currency)}
                      accent
                    />
                  ) : null}
                  {quote.fees > 0 ? (
                    <Row
                      left="GST & Convenience Fee"
                      right={formatMoney(quote.fees, quote.currency)}
                    />
                  ) : null}
                  <Row
                    left="To Pay"
                    right={formatMoney(quote.payuAmount, quote.currency)}
                    strong
                  />
                </>
              ) : (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={T.gold} />
                </View>
              )}
            </View>
          ) : null}

          {notice ? <Text style={styles.warnText}>{notice}</Text> : null}

          {/* ---------- proceed ---------- */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canProceed}
            onPress={onProceed}
            style={{ marginTop: 16, opacity: canProceed ? 1 : 0.45 }}>
            {/* sampled off the frame: #CF9053 -> #E6B379 -> #D29355, so the
                light band sits in the MIDDLE rather than at one end */}
            <LinearGradient
              colors={[T.goldDark, T.goldLight, T.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}>
              <Text style={styles.ctaText}>
                {items.length
                  ? options?.booking?.checkoutLabel || 'Proceed to pay'
                  : 'Select tickets'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ---------- refunds ---------- */}
          {options?.refundPolicy?.showInApp && options.refundPolicy.rules.length ? (
            <View style={styles.refundCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowRefunds(v => !v)}
                style={styles.refundHead}>
                <Icon name="alert-circle-outline" size={15} color={T.gold} />
                <Text style={styles.refundTitle}>CANCELLATION & REFUNDS</Text>
                <Icon
                  name={showRefunds ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={T.textDim}
                />
              </TouchableOpacity>
              {showRefunds
                ? options.refundPolicy.rules.map((r, idx) => {
                    // the frame emphasises only the top rule: white label and
                    // a gold percentage, everything below it muted
                    const lead = idx === 0;
                    return (
                      <View key={r.id || r.label} style={styles.refundRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text
                            style={[
                              styles.refundLabel,
                              !lead && styles.refundLabelMuted,
                            ]}>
                            {r.label}
                          </Text>
                          {r.deadline ? (
                            <Text style={styles.refundDeadline}>
                              until {formatShortDate(r.deadline)}
                            </Text>
                          ) : null}
                        </View>
                        <Text
                          style={[
                            styles.refundPct,
                            !lead && styles.refundPctMuted,
                          ]}>
                          {r.refundPercent}%
                        </Text>
                      </View>
                    );
                  })
                : null}
            </View>
          ) : null}

          {/* <Text style={styles.footNote}>
            {options?.booking?.requireLogin ? 'Login required  ·  ' : ''}
            confirmed instantly on payment
          </Text> */}
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ left, right, strong, accent }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLeft, strong && styles.rowStrong, accent && styles.rowAccent]}>
        {left}
      </Text>
      <Text style={[styles.rowRight, strong && styles.rowStrong, accent && styles.rowAccent]}>
        {right}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  centreScreen: {
    flex: 1,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  pad: { paddingHorizontal: 22, marginTop: -14 },
  dim: { color: T.textDim },

  heroWrap: { height: 225, backgroundColor: T.surface },
  hero: { width: '100%', height: '100%' },
  heroBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.45)',
  },
  securePillText: {
    color: T.goldLight,
    fontFamily: 'WorkSans-Medium',
    fontSize: 11.5,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: { borderColor: T.gold, backgroundColor: 'rgba(206,143,82,0.14)' },
  chipText: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  chipTextActive: { color: T.goldLight },

  metaBlock: { marginBottom: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  metaText: {
    flex: 1,
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    marginLeft: 9,
  },

  sectionTitle: {
    color: T.gold,
    fontFamily: 'WorkSans-Bold',
    fontSize: 17,
    marginBottom: 12,
  },
  emptyInline: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    paddingVertical: 10,
  },
  emptyText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 14,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  retryText: { color: T.gold, fontFamily: 'WorkSans-SemiBold', fontSize: 13.5 },

  // measured 138pt tall with a 12pt gap; the frame shows no border on an
  // unselected card, the fill alone separates it from the page
  tierCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // minHeight: 138,
    justifyContent: 'center',
  },
  tierCardOn: { borderColor: T.borderActive },
  tierCardError: { borderColor: '#B3453B' },
  tierHead: { flexDirection: 'row', alignItems: 'flex-start' },
  tierTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  tierName: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 14 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(206,143,82,0.18)',
  },
  badgeText: {
    color: T.goldLight,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 8.5,
    letterSpacing: 0.7,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioOn: { borderColor: T.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: T.gold },
  tierDesc: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    lineHeight: 19,
    marginTop: 7,
  },
  tierPerks: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 5,
  },
  tierFoot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceLabel: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
  },
  strike: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    textDecorationLine: 'line-through',
  },
  offPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(206,143,82,0.18)',
  },
  offText: {
    color: T.goldLight,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 9,
  },
  price: { color: T.gold, fontFamily: 'WorkSans-Bold', fontSize: 16, marginTop: 2 },
  perTicket: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
  },
  soldOut: {
    color: T.textDim,
    fontFamily: 'WorkSans-Medium',
    fontSize: 12.5,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 9,
    backgroundColor: T.surfaceActive,
    overflow: 'hidden',
  },
  stepBtn: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepBtnAdd: { backgroundColor: T.gold },
  stepValueBox: {
    minWidth: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.border,
  },
  stepValue: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 14.5 },
  capText: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    marginTop: 8,
  },
  limitNote: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 14,
  },

  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 60,
  },
  walletCardOn: {
    borderColor: 'rgba(206,143,82,0.55)',
    backgroundColor: 'rgba(206,143,82,0.07)',
  },
  walletIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(206,143,82,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  walletTitle: { color: T.text, fontFamily: 'WorkSans-Medium', fontSize: 12 },
  instantPill: {
    // ShinyTag paints the gradient, so no backgroundColor here. Its own
    // overflow:'hidden' is what clips the sweep - do not override it.
    // alignSelf has to come back to center: ShinyTag's wrap sets flex-start
    // for the hero tag, which would top-align this chip against the title.
    alignSelf: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  instantText: {
    color: '#FBF2E7',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 8,
    letterSpacing: 0.5,
    marginLeft: 3,
  },
  walletSub: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 3,
  },
  walletBalance: { color: T.balance, fontFamily: 'WorkSans-SemiBold' },
  toggle: {
    width: 36,
    height: 22,
    borderRadius: 13,
    backgroundColor: T.surfaceActive,
    borderWidth: 1,
    borderColor: T.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: T.gold, borderColor: T.gold },
  knob: { width: 15, height: 15, borderRadius: 10, backgroundColor: T.textDim },
  knobOn: { backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },

  summary: { marginTop: 18 },
  stale: { opacity: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLeft: { color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 13 },
  rowRight: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  rowStrong: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 15 },
  rowAccent: { color: T.gold },

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
    marginTop: 7,
  },

  cta: { height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },

  refundCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginTop: 20,
  },
  refundHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
  },
  refundTitle: {
    flex: 1,
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 11.5,
    letterSpacing: 0.6,
  },
  refundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
  },
  refundLabel: { color: T.text, fontFamily: 'WorkSans-Medium', fontSize: 12.5 },
  refundLabelMuted: { color: T.textMuted, fontFamily: 'WorkSans-Regular' },
  refundDeadline: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  refundPct: { color: T.gold, fontFamily: 'WorkSans-SemiBold', fontSize: 13 },
  refundPctMuted: { color: T.textMuted },

  footNote: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
  },
});
