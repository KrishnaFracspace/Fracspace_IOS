// IVA Shop · order placed: fades in (.3s), the parcel draws itself (bxd),
// tape and tick pop (okpop), then title, tracker (tl), ETA and buttons rise (up).
import React from 'react';
import {Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Animated, {Easing, useAnimatedProps, useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Defs, Path, RadialGradient, Rect, Stop} from 'react-native-svg';
import {colors, fonts} from '../theme';
import {E, useLoop} from '../anim';
import {CheckIcon, Cta, GREEN, fadeIn, up, styles as s, useOnce} from './bits';
import {DAYS} from './data';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const BXD = Easing.bezierFn(0.6, 0, 0.2, 1);

/** A stroke that draws in: dashoffset `len` → 0. */
function Draw({d, len, duration, delay, easing, ...rest}) {
  const p = useOnce(duration, delay, easing);
  const props = useAnimatedProps(() => ({strokeDashoffset: len * (1 - p.value)}));
  return <AnimatedPath d={d} strokeDasharray={len} animatedProps={props} {...rest} />;
}

/** `okpop`: scale 0 → 1 with the spring easing. */
function Pop({duration, delay, style, children}) {
  const p = useOnce(duration, delay, E.spring);
  const a = useAnimatedStyle(() => ({transform: [{scale: p.value}]}));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** `.pbox`: box outline (.1s), lid lines (.35s), tape (.85s), tick (1.1s). */
function Parcel() {
  const box = {fill: 'none', stroke: colors.gold, strokeWidth: 2.4, strokeLinejoin: 'round'};
  return (
    <View style={styles.pbox}>
      <Svg width={120} height={110} viewBox="0 0 120 110">
        <Draw d="M20 38 60 20l40 18v44L60 100 20 82Z" len={260} duration={900} delay={100} easing={BXD} {...box} />
        <Draw d="M20 38 60 56l40-18M60 56v44" len={260} duration={900} delay={350} easing={BXD} {...box} />
        <Draw d="M40 29 80 47" len={44} duration={350} delay={850} easing={E.ease} stroke="#B98A4B" strokeWidth={6} strokeLinecap="round" />
      </Svg>
      <Pop duration={500} delay={1100} style={styles.pokRing}>
        <View style={styles.pok}>
          <CheckIcon color="#0A2A18" />
        </View>
      </Pop>
    </View>
  );
}

/** `.ts.snext .tsd b`: gold dot with a gpulse ring (1.6s ease-out, from 2s). */
function NextDot() {
  const p = useLoop(1600, {delay: 2000});
  const ring = useAnimatedStyle(() => {
    const t = E.easeOut(p.value);
    return {opacity: 0.6 * (1 - t), transform: [{scale: 1 + t * 2}]};
  });
  return (
    <View style={styles.nextDot}>
      <Animated.View style={[styles.nextDot, styles.abs, ring]} />
    </View>
  );
}

/** `.tline2 i`: progress to "Packed", tl (scaleX 0 → 1, 1s --out, 1.6s). */
function TrackFill() {
  const p = useOnce(1000, 1600, E.out);
  const a = useAnimatedStyle(() => ({transform: [{scaleX: p.value}]}));
  return <Animated.View style={[styles.tfill, a]} />;
}

const STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

export default function Done({orderId, totalLabel, city, eta, insets, onMore, onHome}) {
  const {width, height} = useWindowDimensions();
  const cx = width / 2;
  const cy = height * 0.38;
  const r = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
  return (
    <Animated.View
      entering={fadeIn}
      accessibilityViewIsModal
      accessibilityLabel="Order placed"
      style={[styles.done, {paddingTop: insets.top + 46, paddingBottom: 26 + insets.bottom}]}>
      <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="ivdone" cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="rgb(241,221,186)" stopOpacity={0.1} />
            <Stop offset="0.55" stopColor="rgb(10,10,12)" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#ivdone)" />
      </Svg>

      <Parcel />
      <Animated.Text entering={up(900)} style={styles.h2}>
        Order placed
      </Animated.Text>
      <Animated.Text entering={up(1000)} style={[s.muted, styles.sub]}>
        Order #{orderId} · {totalLabel}
      </Animated.Text>

      <Animated.View entering={up(1250)} style={styles.trk}>
        <View style={styles.tline}>
          <TrackFill />
        </View>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.ts}>
            <View style={[styles.tsd, i === 0 && styles.tsdDone, i === 1 && styles.tsdNext]}>
              {i === 0 ? <CheckIcon size={12} color={colors.ink} /> : null}
              {i === 1 ? <NextDot /> : null}
            </View>
            <Text style={[styles.tsText, i === 0 && styles.tsTextDone, i === 1 && styles.tsTextNext]}>{label}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={up(1500)} style={styles.eta}>
        <Text style={s.tlabel}>Arriving at {city}</Text>
        <Text style={styles.etaDate}>{eta}</Text>
        <Text style={[s.muted, styles.etaSub]}>in {DAYS} days · we’ll keep you posted</Text>
      </Animated.View>

      <Animated.View entering={up(1900)} style={styles.dbtn}>
        <Pressable onPress={onMore} accessibilityRole="button" style={styles.ghost}>
          <Text style={styles.ghostText}>Continue shopping</Text>
        </Pressable>
        <Cta label="Back to home" onPress={onHome} style={styles.h52} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  abs: {position: 'absolute', left: 0, top: 0},
  done: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 60,
    elevation: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.ground,
  },
  pbox: {width: 120, height: 110},
  pokRing: {
    position: 'absolute',
    right: -2,
    top: 0,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,231,160,0.14)',
  },
  pok: {width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN},
  h2: {fontFamily: fonts.extrabold, fontSize: 22, color: '#fff', marginTop: 18, textAlign: 'center'},
  sub: {fontSize: 13, marginTop: 6, textAlign: 'center'},
  trk: {flexDirection: 'row', width: '100%', maxWidth: 320, marginTop: 28},
  tline: {position: 'absolute', left: '12.5%', right: '12.5%', top: 11, height: 2, backgroundColor: colors.whiteA(0.1)},
  tfill: {height: '100%', width: '33.3%', backgroundColor: colors.gold, transformOrigin: 'left'},
  ts: {flex: 1, alignItems: 'center', gap: 8},
  tsd: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.whiteA(0.16),
  },
  tsdDone: {backgroundColor: colors.gold, borderColor: colors.gold},
  tsdNext: {borderColor: colors.gold},
  nextDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold},
  tsText: {fontFamily: fonts.semibold, fontSize: 11, color: '#7E7870'},
  tsTextDone: {color: '#fff'},
  tsTextNext: {color: colors.soft},
  eta: {
    marginTop: 26,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  etaDate: {fontFamily: fonts.extrabold, fontSize: 20, color: '#fff', marginTop: 4},
  etaSub: {fontSize: 12},
  dbtn: {width: '100%', marginTop: 'auto', gap: 10},
  ghost: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.whiteA(0.16),
    backgroundColor: colors.whiteA(0.04),
  },
  ghostText: {fontFamily: fonts.semibold, fontSize: 13, color: colors.cream},
  h52: {height: 52},
});
