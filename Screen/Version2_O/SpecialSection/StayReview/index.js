// Section 4 · Review Booking + success (StayReview.dc.html). Opened from Stay
// Detail's "Proceed to pay"; back returns there, "Back to Home" opens the Home
// tab. Payment is mocked (Proceed → 1.2s processing → confirm animation →
// success) until stays have a booking API; see `mockReceipt`.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fonts, ls} from '../theme';
import {E, LoopGate, PressScale, useLoop, useReducedMotion} from '../anim';
import {BackIcon, GlassButton, Grain} from '../HubBits';
import {StarIcon} from '../Stays/icons';
import {Odo, Sweep, useShot, useTo} from '../StayDetail/bits';
import Calendar from './Calendar';
import Confirming, {CONFIRM_MS} from './Confirming';
import Success from './Success';
import {
  CHECK_IN,
  CHECK_OUT,
  MAX_ADULTS,
  MAX_KIDS,
  TAX,
  cancellation,
  defaultDates,
  inr,
  mockReceipt,
  nightsBetween,
  paidLabel,
  plural,
  reviewFor,
  short,
  today as todayDate,
} from './data';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const COUNTS = ['0', '1', '2', '3', '4'];
const MUTED = '#ADA597';

/** `.stg > *`: rise (.7s --out) staggered 40 / 120 / 200 / 280 / 360ms. */
function Stage({t, i, style, children}) {
  const delay = 40 + 80 * i;
  const a = useAnimatedStyle(() => {
    const p = E.out(Math.min(1, Math.max(0, (t.value - delay) / 700)));
    return {opacity: p, transform: [{translateY: 16 * (1 - p)}]};
  });
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

function EditIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 20h4L19 9l-4-4L4 16z" />
    </Svg>
  );
}

function GoIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

/** `.dval`: dpop / dpop2 (rise 6px, .45s spring) every time dates are applied. */
function DateVal({flip, children}) {
  const p = useShot(flip + 1, 450);
  const a = useAnimatedStyle(() => {
    const e = E.spring(p.value);
    return {opacity: Math.min(1, e), transform: [{translateY: 6 * (1 - e)}]};
  });
  return <Animated.Text style={[styles.dval, a]}>{children}</Animated.Text>;
}

/** `.sb`: press .8 (.3s spring), disabled opacity .3 (.2s). */
function StepBtn({label, onPress, disabled, children}) {
  const o = useTo(disabled ? 0.3 : 1, 200);
  const a = useAnimatedStyle(() => ({opacity: o.value}));
  return (
    <Animated.View style={a}>
      <PressScale to={0.8} duration={300} onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} style={styles.sb}>
        <Text style={styles.sbT}>{children}</Text>
      </PressScale>
    </Animated.View>
  );
}

function Stepper({title, sub, value, min, max, onDec, onInc, noun}) {
  return (
    <View style={styles.grow}>
      <View style={styles.growCopy}>
        <Text style={styles.growT}>{title}</Text>
        <Text style={styles.small}>{sub}</Text>
      </View>
      <View style={styles.step}>
        <StepBtn label={`Fewer ${noun}`} onPress={onDec} disabled={value <= min}>
          −
        </StepBtn>
        <View style={styles.sn} accessibilityLiveRegion="polite" accessibilityLabel={String(value)}>
          <Odo index={value} h={22} items={COUNTS.slice(0, max + 1)} duration={500} textStyle={styles.snT} />
        </View>
        <StepBtn label={`More ${noun}`} onPress={onInc} disabled={value >= max}>
          +
        </StepBtn>
      </View>
    </View>
  );
}

/** `.num`: the total as odometer digit columns (.5s spring), commas static. */
function Total({label}) {
  const chars = label.split('');
  return (
    <View style={styles.num} accessibilityLabel={`₹${label}`}>
      <Text style={styles.numT}>₹</Text>
      {chars.map((ch, i) => {
        const key = chars.length - i;
        return ch === ',' ? (
          <Text key={`c${key}`} style={styles.numT}>
            ,
          </Text>
        ) : (
          <Odo key={`d${key}`} index={Number(ch)} h={28} items={DIGITS} duration={500} textStyle={styles.numT} />
        );
      })}
    </View>
  );
}

function Spinner() {
  const p = useLoop(700);
  const a = useAnimatedStyle(() => ({transform: [{rotate: `${360 * p.value}deg`}]}));
  return <Animated.View style={[styles.spin, a]} />;
}

export default function StayReview({navigation, route}) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const reduced = useReducedMotion();
  const params = route?.params;
  const review = useMemo(() => reviewFor(params), [params]);
  const today = useMemo(todayDate, []);
  const first = useMemo(defaultDates, []);

  const [cin, setCin] = useState(first.cin);
  const [cout, setCout] = useState(first.cout);
  const [adults, setAdults] = useState(review.adults);
  const [kids, setKids] = useState(0);
  const [flip, setFlip] = useState(0);
  const [cal, setCal] = useState(false);
  const [view, setView] = useState(new Date(first.cin.getFullYear(), first.cin.getMonth(), 1));
  const [pin, setPin] = useState(null);
  const [pout, setPout] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | busy | anim | done
  const [paid, setPaid] = useState(null);
  const t1 = useRef(null);
  const t2 = useRef(null);
  useEffect(() => () => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
  }, []);

  // Mount clock for the `.stg` stagger.
  const t = useSharedValue(reduced ? 1100 : 0);
  useEffect(() => {
    if (!reduced) {
      t.value = withTiming(1100, {duration: 1100, easing: Easing.linear});
    }
  }, [reduced, t]);

  const nights = Math.max(1, nightsBetween(cin, cout));
  const room = review.price * nights;
  const tax = Math.round(room * TAX);
  const totalLabel = inr(room + tax);
  const nightsLabel = plural(nights, 'night', 'nights');
  const guestLabel = plural(adults + kids, 'guest', 'guests');
  const guestFull = plural(adults, 'adult', 'adults') + (kids ? ` · ${plural(kids, 'child', 'children')}` : '');
  const cxl = cancellation(cin);

  const back = useCallback(() => navigation.goBack(), [navigation]);
  const home = useCallback(() => {
    navigation.popToTop();
    navigation.navigate('HomeStack', {screen: 'HomePage'});
  }, [navigation]);

  const openCal = useCallback(() => {
    setPin(cin);
    setPout(cout);
    setView(new Date(cin.getFullYear(), cin.getMonth(), 1));
    setCal(true);
  }, [cin, cout]);
  const closeCal = useCallback(() => setCal(false), []);
  const pick = useCallback(
    d => {
      if (!pin || pout || d <= pin) {
        setPin(d);
        setPout(null);
      } else {
        setPout(d);
      }
    },
    [pin, pout],
  );
  const prevMonth = useCallback(() => setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1)), []);
  const nextMonth = useCallback(() => setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1)), []);
  const apply = useCallback(() => {
    if (pin && pout) {
      setCin(pin);
      setCout(pout);
      setCal(false);
      setFlip(f => f + 1);
    }
  }, [pin, pout]);

  const pay = useCallback(() => {
    if (phase !== 'idle') {
      return;
    }
    setPhase('busy');
    t1.current = setTimeout(() => {
      setPaid({at: paidLabel(new Date()), ...mockReceipt()});
      setPhase('anim');
      t2.current = setTimeout(() => setPhase('done'), CONFIRM_MS);
    }, 1200);
  }, [phase]);

  // Android back: closes the calendar, waits out the payment, leaves success for Home.
  useEffect(() => {
    if (!cal && phase === 'idle') {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (cal) {
        setCal(false);
      } else if (phase === 'done') {
        home();
      }
      return true;
    });
    return () => sub.remove();
  }, [cal, phase, home]);

  const busy = phase === 'busy';
  const bottom = Math.max(16, insets.bottom);

  return (
    <View style={styles.page}>
      <LoopGate active={isFocused}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.stg, {paddingTop: 16 + insets.top, paddingBottom: 130 + bottom - 16}]}>
          <Stage t={t} i={0} style={styles.top}>
            <GlassButton label="Back to stay details" onPress={back} style={styles.gbtn}>
              <BackIcon />
            </GlassButton>
            <Text style={styles.h1}>Review booking</Text>
          </Stage>

          <Stage t={t} i={1} style={[styles.card, styles.stay]}>
            <Image source={review.img} style={styles.stayImg} accessibilityLabel={`${review.room} at ${review.short}`} />
            <View style={styles.stayCopy}>
              <Text style={styles.stayName}>{review.name}</Text>
              <Text style={styles.small12}>{review.room}</Text>
              <View style={styles.rateRow}>
                <StarIcon size={12} color="#F1A23B" />
                <Text style={styles.rateT}>
                  <Text style={styles.rateB}>{review.rate}</Text>
                  {` · ${review.place}`}
                </Text>
              </View>
            </View>
          </Stage>

          <Stage t={t} i={2} style={[styles.card, styles.clip]}>
            <View style={styles.tripHead}>
              <Text style={styles.cap}>YOUR TRIP</Text>
              <PressScale to={0.96} onPress={openCal} accessibilityRole="button" style={styles.edit}>
                <Text style={styles.editT}>Edit dates</Text>
                <EditIcon />
              </PressScale>
            </View>
            <Pressable
              onPress={openCal}
              accessibilityRole="button"
              accessibilityLabel={`Change dates, ${short(cin)} to ${short(cout)}`}
              style={styles.drow}>
              <View style={styles.dcol}>
                <Text style={styles.small}>Check-in</Text>
                <DateVal flip={flip}>{short(cin)}</DateVal>
                <Text style={styles.small}>{`from ${CHECK_IN}`}</Text>
              </View>
              <View style={styles.nights}>
                <Text style={styles.nightsT}>{nightsLabel}</Text>
              </View>
              <View style={[styles.dcol, styles.dcolR]}>
                <Text style={styles.small}>Check-out</Text>
                <DateVal flip={flip}>{short(cout)}</DateVal>
                <Text style={styles.small}>{`by ${CHECK_OUT}`}</Text>
              </View>
            </Pressable>
            <Stepper
              title="Adults"
              sub="Age 13+"
              noun="adults"
              value={adults}
              min={1}
              max={MAX_ADULTS}
              onDec={() => setAdults(a => Math.max(1, a - 1))}
              onInc={() => setAdults(a => Math.min(MAX_ADULTS, a + 1))}
            />
            <Stepper
              title="Children"
              sub="Age 2–12"
              noun="children"
              value={kids}
              min={0}
              max={MAX_KIDS}
              onDec={() => setKids(k => Math.max(0, k - 1))}
              onInc={() => setKids(k => Math.min(MAX_KIDS, k + 1))}
            />
          </Stage>

          <Stage t={t} i={3} style={[styles.card, styles.price]}>
            <Text style={styles.cap}>PRICE BREAKDOWN</Text>
            <View style={styles.prow}>
              <Text style={styles.prowK}>{`₹${inr(review.price)} × ${nightsLabel}`}</Text>
              <Text style={styles.prowV}>{`₹${inr(room)}`}</Text>
            </View>
            <View style={styles.prow}>
              <Text style={styles.prowK}>Taxes & fees (5%)</Text>
              <Text style={styles.prowV}>{`₹${inr(tax)}`}</Text>
            </View>
            <View style={styles.rule} />
            <View style={styles.totalRow}>
              <Text style={styles.totalK}>Total</Text>
              <Total label={totalLabel} />
            </View>
            <Text style={styles.small115}>{`${guestLabel} · ${nightsLabel}`}</Text>
          </Stage>

          <Stage t={t} i={4} style={[styles.cxl, cxl.free ? styles.cxlOk : styles.cxlNo]}>
            <View style={[styles.cdot, {backgroundColor: cxl.color}]} />
            <Text style={[styles.cxlT, cxl.free ? styles.cxlTOk : styles.cxlTNo]}>{cxl.text}</Text>
          </Stage>
        </ScrollView>

        <LinearGradient
          pointerEvents="box-none"
          colors={[colors.groundA(0), colors.ground]}
          locations={[0, 0.32]}
          style={[styles.dock, {paddingBottom: bottom}]}>
          <PressScale to={0.97} duration={450} onPress={pay} accessibilityRole="button" accessibilityState={{busy}} style={styles.pay}>
            {busy ? null : <Sweep duration={3400} alpha={0.6} />}
            <View>
              <Text style={styles.payK}>Total payable</Text>
              <Text style={styles.payV}>{`₹${totalLabel}`}</Text>
            </View>
            <View style={styles.pgo}>
              {busy ? <Spinner /> : null}
              <Text style={styles.pgoT}>{busy ? 'Processing…' : 'Proceed to pay'}</Text>
              {busy ? null : <GoIcon />}
            </View>
          </PressScale>
        </LinearGradient>

        <Calendar
          open={cal}
          view={view}
          pin={pin}
          pout={pout}
          today={today}
          bottom={insets.bottom}
          onClose={closeCal}
          onPick={pick}
          onPrev={prevMonth}
          onNext={nextMonth}
          onApply={apply}
        />

        {phase === 'anim' ? (
          <Confirming
            img={review.img}
            stayName={review.name}
            stayShort={review.short}
            inShort={short(cin)}
            outShort={short(cout)}
            guestLabel={guestLabel}
            nights={nights}
          />
        ) : null}
        {phase === 'done' ? (
          <Success
            review={review}
            receipt={paid}
            inShort={short(cin)}
            outShort={short(cout)}
            nightsLabel={nightsLabel}
            guestFull={guestFull}
            totalLabel={totalLabel}
            paidAt={paid.at}
            insets={insets}
            onHome={home}
          />
        ) : null}

        <Grain opacity={0.07} />
      </LoopGate>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.ground},
  stg: {gap: 14, paddingHorizontal: 20},
  top: {flexDirection: 'row', alignItems: 'center', gap: 12},
  gbtn: {backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'},
  h1: {fontFamily: fonts.extrabold, fontSize: 19, color: colors.white},
  card: {borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border},
  clip: {overflow: 'hidden'},
  cap: {fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: ls(0.14, 10.5), color: '#8E887F'},
  small: {fontFamily: fonts.regular, fontSize: 11, color: MUTED},
  small12: {fontFamily: fonts.regular, fontSize: 12, color: MUTED},
  small115: {fontFamily: fonts.regular, fontSize: 11.5, color: MUTED},

  stay: {flexDirection: 'row', gap: 12, padding: 10},
  stayImg: {width: 92, height: 92, borderRadius: 16},
  stayCopy: {flex: 1, minWidth: 0, justifyContent: 'center', gap: 4},
  stayName: {fontFamily: fonts.bold, fontSize: 15, color: colors.white},
  rateRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  rateT: {fontFamily: fonts.regular, fontSize: 12, color: colors.soft},
  rateB: {fontFamily: fonts.bold, color: colors.white},

  tripHead: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, paddingHorizontal: 16},
  edit: {flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32},
  editT: {fontFamily: fonts.bold, fontSize: 12, color: colors.gold},
  drow: {flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16},
  dcol: {flex: 1, gap: 3},
  dcolR: {alignItems: 'flex-end'},
  dval: {fontFamily: fonts.extrabold, fontSize: 16, color: colors.white},
  nights: {height: 26, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.goldA(0.3), justifyContent: 'center'},
  nightsT: {fontFamily: fonts.bold, fontSize: 11, color: colors.gold},
  grow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.hairline,
  },
  growCopy: {gap: 2},
  growT: {fontFamily: fonts.bold, fontSize: 14, color: colors.white},
  step: {flexDirection: 'row', alignItems: 'center', gap: 4, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.goldA(0.22)},
  sb: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  sbT: {fontFamily: fonts.bold, fontSize: 18, color: colors.gold},
  sn: {width: 18, height: 22, overflow: 'hidden', alignItems: 'center'},
  snT: {fontFamily: fonts.extrabold, fontSize: 15, color: colors.white, textAlign: 'center'},

  price: {padding: 16, gap: 12},
  prow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  prowK: {fontFamily: fonts.regular, fontSize: 13.5, color: colors.soft},
  prowV: {fontFamily: fonts.bold, fontSize: 13.5, color: colors.white},
  rule: {height: 1, backgroundColor: colors.borderStrong},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  totalK: {fontFamily: fonts.bold, fontSize: 15, color: colors.white},
  num: {flexDirection: 'row', alignItems: 'flex-start', height: 28},
  numT: {fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.white},

  cxl: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1},
  cxlOk: {backgroundColor: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)'},
  cxlNo: {backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.22)'},
  cxlTOk: {color: '#C9F5DA'},
  cxlTNo: {color: '#FFD0D0'},
  cdot: {width: 8, height: 8, borderRadius: 4},
  cxlT: {flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17.5},

  dock: {position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingTop: 22, paddingHorizontal: 16},
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 20,
    backgroundColor: colors.gold,
    overflow: 'hidden',
  },
  payK: {fontFamily: fonts.semibold, fontSize: 11, color: colors.ink, opacity: 0.7},
  payV: {fontFamily: fonts.extrabold, fontSize: 18, color: colors.ink},
  pgo: {flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.ink},
  pgoT: {fontFamily: fonts.extrabold, fontSize: 14, color: colors.gold},
  spin: {width: 16, height: 16, borderRadius: 8, borderWidth: 2.5, borderColor: colors.goldA(0.3), borderTopColor: colors.gold},
});
