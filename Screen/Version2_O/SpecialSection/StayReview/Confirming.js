// `.sa` "Confirming your stay" overlay from StayReview.dc.html: tickets fly in
// (tkB tkF), icons pop and float (ficIn flt), the passport swings in and opens
// (pwIn cvOpen), the stamp drops (sstDrop pth sring sspk) and the caption
// swaps (c1 c2, dots `sad`). Every one-shot animation reads one 4.2s clock.
import React, {memo, useEffect} from 'react';
import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop, Text as SvgText, TextPath} from 'react-native-svg';
import {colors, fonts, ls} from '../theme';
import {E, kf, useLoop, useReducedMotion} from '../anim';
import {plural} from './data';

export const CONFIRM_MS = 4200;

const TK = Easing.bezierFn(0.2, 0.9, 0.3, 1.2);
const FIC = Easing.bezierFn(0.3, 1.5, 0.5, 1);
const PW = Easing.bezierFn(0.2, 0.9, 0.25, 1.1);
const CV = Easing.bezierFn(0.5, 0, 0.2, 1);
const SST = Easing.bezierFn(0.3, 1.4, 0.5, 1);

/** Progress of a one-shot animation (`delay`, `dur` in ms) on clock `t`. */
function seg(t, delay, dur) {
  'worklet';
  return Math.min(1, Math.max(0, (t - delay) / dur));
}
function mix(a, b, p) {
  'worklet';
  return a + (b - a) * p;
}

// tkB ends at `rotate(-14deg) translate(-6px,-22px)`: that translate rotated
// into the parent frame, so both ends interpolate as translate → rotate.
const R14 = (-14 * Math.PI) / 180;
const TKB_X = -6 * Math.cos(R14) + 22 * Math.sin(R14);
const TKB_Y = -6 * Math.sin(R14) - 22 * Math.cos(R14);

const BARS = Array.from({length: 22}, (_, i) => ((i + 1) % 4 === 0 ? 3 : (i + 1) % 3 === 0 ? 1 : 2));
const RINGS = Array.from({length: 15}, (_, i) => 8 * i + 0.5);
const SPARKS = [
  [-50, -44],
  [54, -36],
  [-44, 48],
  [50, 46],
];
const CHAR = '#0B5A48';

function Ticket({t, back, img, stayName, inShort, outShort, guestLabel}) {
  const a = useAnimatedStyle(() => {
    const p = TK(seg(t.value, back ? 50 : 150, 600));
    return {
      opacity: p <= 0 ? 0 : Math.min(1, p),
      transform: back
        ? [{translateX: mix(0, TKB_X, p)}, {translateY: mix(160, TKB_Y, p)}, {rotate: `${mix(-30, -14, p)}deg`}]
        : [{translateY: mix(160, 0, p)}, {rotate: `${mix(10, -4, p)}deg`}],
    };
  });
  return (
    <Animated.View style={[styles.tkShadow, a]}>
      <View style={[styles.tk, back && styles.tkBack]}>
        <View style={styles.stub}>
          <Image source={img} style={styles.stubImg} />
        </View>
        <Svg width={2} height={120} style={styles.perf}>
          <Path d="M1 0V120" stroke="rgba(26,22,17,0.25)" strokeWidth={2} strokeDasharray="6 6" />
        </Svg>
        {back ? null : (
          <>
            <View style={[styles.nt, styles.ntTop]} />
            <View style={[styles.nt, styles.ntBottom]} />
            <View style={styles.tb}>
              <Text style={styles.k}>STAY PASS · FRACSPACE</Text>
              <Text style={[styles.v, styles.vName]} numberOfLines={1}>
                {stayName}
              </Text>
              <View style={styles.tbRow}>
                <View>
                  <Text style={styles.k}>CHECK-IN</Text>
                  <Text style={styles.v}>{inShort}</Text>
                </View>
                <View>
                  <Text style={styles.k}>CHECK-OUT</Text>
                  <Text style={styles.v}>{outShort}</Text>
                </View>
              </View>
              <View style={[styles.tbRow, styles.tbEnd]}>
                <View>
                  <Text style={styles.k}>GUESTS</Text>
                  <Text style={styles.v}>{guestLabel}</Text>
                </View>
                <View style={styles.bars}>
                  {BARS.map((w, i) => (
                    <View key={i} style={[styles.bar, {width: w}]} />
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const ICONS = {
  i1: (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={6} y={7} width={12} height={12} rx={2} />
      <Path d="M9 7V4h6v3M10 11v4M14 11v4" />
      <Circle cx={9} cy={21} r={1} />
      <Circle cx={15} cy={21} r={1} />
    </Svg>
  ),
  i2: (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 16c3 2 17 2 20 0" />
      <Path d="M6 15.5c0-5 2.5-8 6-8s6 3 6 8" />
      <Path d="M6.5 13c3 1 8 1 11 0" />
    </Svg>
  ),
  i3: (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={1.7} strokeLinecap="round">
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  ),
};

/** `.fic`: ficIn (.5s, delay `pop`) then `flt` (float 6px, `float` ms, from `fl`). */
function Fic({t, id, pop, float, fl, pos}) {
  const f = useLoop(float, {delay: fl});
  const a = useAnimatedStyle(() => {
    const p = FIC(seg(t.value, pop, 500));
    const up = t.value >= fl ? kf(f.value, [[0, 0], [0.5, -6], [1, 0]], E.easeInOut) : 0;
    return {
      opacity: seg(t.value, pop, 500) <= 0 ? 0 : Math.min(1, p),
      transform: [{translateY: up}, {scale: mix(0.3, 1, p)}, {rotate: `${mix(-20, 0, p)}deg`}],
    };
  });
  return <Animated.View style={[styles.fic, pos, a]}>{ICONS[id]}</Animated.View>;
}

function Stamp() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Defs>
        <Path id="saArc" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0" />
      </Defs>
      <G fill="none" stroke={CHAR}>
        <Circle cx={50} cy={50} r={46} strokeWidth={2.6} />
        <Circle cx={50} cy={50} r={41} strokeWidth={1} />
        <Circle cx={50} cy={50} r={26} strokeWidth={1} strokeDasharray="3 2" />
      </G>
      <SvgText fontSize={6.6} fontFamily={fonts.extrabold} letterSpacing={1.3} fill={CHAR}>
        <TextPath href="#saArc">DREAMSCAPE ★ HYDERABAD ★ STAYED ★</TextPath>
      </SvgText>
      <Path d="M38 58V46l12-8 12 8v12M45 58v-6h10v6" fill="none" stroke={CHAR} strokeWidth={1.9} strokeLinejoin="round" />
      <Rect x={30} y={61} width={40} height={10} rx={2} fill={CHAR} />
      <SvgText x={50} y={68.6} textAnchor="middle" fontSize={6.2} fontFamily={fonts.extrabold} letterSpacing={1.2} fill="#F4ECD8">
        BOOKED
      </SvgText>
    </Svg>
  );
}

function Spark({t, x, y}) {
  const a = useAnimatedStyle(() => {
    const e = E.easeOut(seg(t.value, 2800, 800));
    return {
      opacity: 1 - e,
      transform: [{translateX: x * e}, {translateY: y * e}, {scale: mix(1, 0.3, e)}],
    };
  });
  return <Animated.View style={[styles.sspk, a]} />;
}

function Passport({t}) {
  const pw = useAnimatedStyle(() => {
    const p = PW(seg(t.value, 850, 750));
    return {
      opacity: seg(t.value, 850, 750) <= 0 ? 0 : Math.min(1, p),
      transform: [{translateX: mix(220, 0, p)}, {rotate: `${mix(40, 6, p)}deg`}, {scale: mix(0.7, 1, p)}],
    };
  });
  // pth: a 1–2px thud on the page when the stamp lands.
  const page = useAnimatedStyle(() => {
    const p = seg(t.value, 2750, 300);
    return {
      transform: [
        {translateX: kf(p, [[0, 0], [0.35, 1], [0.7, -1], [1, 0]], E.ease)},
        {translateY: kf(p, [[0, 0], [0.35, 2], [0.7, -1], [1, 0]], E.ease)},
      ],
    };
  });
  const ring = useAnimatedStyle(() => {
    const p = E.easeOut(seg(t.value, 2800, 600));
    return {opacity: mix(0.8, 0, p), transform: [{scale: mix(0.9, 1.6, p)}]};
  });
  const stamp = useAnimatedStyle(() => {
    const p = seg(t.value, 2400, 500);
    return {
      opacity: kf(p, [[0, 0], [0.7, 1], [1, 1]], SST),
      transform: [
        {scale: kf(p, [[0, 2.6], [0.7, 0.92], [1, 1]], SST)},
        {rotate: `${kf(p, [[0, -30], [0.7, -8], [1, -10]], SST)}deg`},
        {translateY: kf(p, [[0, -30], [0.7, 0], [1, 0]], SST)},
      ],
    };
  });
  // cvOpen: the cover swings open on its left edge (−176°). Faces swap at 90°
  // instead of relying on backface-visibility, which RN applies per view.
  const front = useAnimatedStyle(() => {
    const deg = -176 * CV(seg(t.value, 1700, 600));
    return {opacity: deg > -90 ? 1 : 0, transform: [{perspective: 1100}, {rotateY: `${deg}deg`}]};
  });
  const inside = useAnimatedStyle(() => {
    const deg = -176 * CV(seg(t.value, 1700, 600));
    return {
      opacity: deg > -90 ? 0 : 1,
      transform: [{perspective: 1100}, {rotateY: `${deg}deg`}, {translateX: 66}, {rotateY: '180deg'}, {translateX: -66}],
    };
  });

  return (
    <Animated.View style={[styles.pw, pw]}>
      <Animated.View style={[styles.pgShadow, page]}>
        <View style={styles.pg}>
          <Svg width={132} height={180} style={StyleSheet.absoluteFill}>
            {RINGS.map(r => (
              <Circle key={r} cx={66} cy={90} r={r} fill="none" stroke="rgba(154,116,64,0.08)" strokeWidth={1} />
            ))}
          </Svg>
          <Text style={styles.pgTitle}>FRACSPACE · STAYS</Text>
          <Animated.View style={[styles.sring, ring]} />
          <Animated.View style={[styles.sst, stamp]}>
            <Stamp />
          </Animated.View>
          {SPARKS.map(([x, y]) => (
            <Spark key={`${x}${y}`} t={t} x={x} y={y} />
          ))}
        </View>
      </Animated.View>
      <Animated.View style={[styles.face, styles.cf, front]}>
        <Svg width={132} height={180} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="cfg" cx={29} cy={21.6} rx={158.4} ry={162} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#1A2152" />
              <Stop offset="0.4" stopColor="#121842" />
              <Stop offset="0.7" stopColor="#0C1033" />
              <Stop offset="1" stopColor="#07091C" />
            </RadialGradient>
          </Defs>
          <Rect width={132} height={180} fill="url(#cfg)" />
        </Svg>
        <View style={styles.cfEdge} />
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <G fill="none" stroke={colors.gold} strokeWidth={1.2}>
            <Circle cx={20} cy={20} r={17} />
            <Ellipse cx={20} cy={20} rx={7.5} ry={17} />
            <Path d="M3 20h34M6 11.5h28M6 28.5h28" />
          </G>
        </Svg>
        <Text style={styles.cfBrand}>FRACSPACE</Text>
        <Text style={styles.cfTitle}>Passport</Text>
      </Animated.View>
      <Animated.View style={[styles.face, styles.ci, inside]} />
    </Animated.View>
  );
}

function Dot({i}) {
  const p = useLoop(1000, {delay: i * 150});
  const a = useAnimatedStyle(() => ({
    opacity: kf(p.value, [[0, 0.25], [0.5, 1], [1, 0.25]], E.easeInOut),
    transform: [{translateY: kf(p.value, [[0, 0], [0.5, -3], [1, 0]], E.easeInOut)}],
  }));
  return <Animated.View style={[styles.dot, a]} />;
}

function Confirming({img, stayName, inShort, outShort, guestLabel, nights, stayShort}) {
  const {width, height} = useWindowDimensions();
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = reduced ? CONFIRM_MS : withTiming(CONFIRM_MS, {duration: CONFIRM_MS, easing: Easing.linear});
  }, [reduced, t]);

  const bg = useAnimatedStyle(() => ({opacity: E.ease(seg(t.value, 0, 300))}));
  const c1 = useAnimatedStyle(() => ({opacity: kf(seg(t.value, 0, 3200), [[0, 1], [0.85, 1], [1, 0]], E.ease)}));
  const c2 = useAnimatedStyle(() => {
    const p = E.out(seg(t.value, 3000, 500));
    return {opacity: p, transform: [{translateY: 10 * (1 - p)}]};
  });

  const cy = height * 0.42;
  const r = Math.sqrt((width / 2) ** 2 + Math.max(cy, height - cy) ** 2);

  return (
    <Animated.View style={[styles.sa, bg]} accessibilityRole="alert" accessibilityLabel="Confirming your stay">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="sag" cx={width / 2} cy={cy} r={r} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors.gold} stopOpacity={0.12} />
            <Stop offset="0.58" stopColor={colors.ground} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#sag)" />
      </Svg>
      <View style={styles.stage} importantForAccessibility="no-hide-descendants">
        <Fic t={t} id="i1" pop={450} float={3000} fl={1000} pos={styles.i1} />
        <Fic t={t} id="i2" pop={600} float={3400} fl={1100} pos={styles.i2} />
        <Fic t={t} id="i3" pop={750} float={3200} fl={1200} pos={styles.i3} />
        <Ticket t={t} back img={img} />
        <Ticket t={t} img={img} stayName={stayName} inShort={inShort} outShort={outShort} guestLabel={guestLabel} />
        <Passport t={t} />
      </View>
      <View style={styles.cap}>
        <Animated.View style={[styles.capIn, c1]}>
          <Text style={styles.capT}>Confirming your stay</Text>
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <Dot key={i} i={i} />
            ))}
          </View>
        </Animated.View>
        <Animated.View style={[styles.capIn, styles.c2, c2]}>
          <Text style={styles.capT}>Stamped in your passport</Text>
          <Text style={styles.capSub}>{`${stayShort} · ${plural(nights, 'night', 'nights')}`}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default memo(Confirming);

const SHADOW = {shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: {width: 0, height: 18}, elevation: 18};

const styles = StyleSheet.create({
  sa: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 90,
    backgroundColor: colors.ground,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    overflow: 'hidden',
  },
  stage: {width: 340, height: 360},
  tkShadow: {position: 'absolute', left: 18, top: 150, width: 250, height: 120, borderRadius: 16, ...SHADOW},
  tk: {flex: 1, flexDirection: 'row', borderRadius: 16, backgroundColor: '#F6EEDF', overflow: 'hidden'},
  tkBack: {backgroundColor: '#E9DCC1'},
  stub: {width: 78},
  stubImg: {width: '100%', height: '100%'},
  perf: {position: 'absolute', top: 0, left: 77},
  nt: {position: 'absolute', left: 70, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.ground},
  ntTop: {top: -8},
  ntBottom: {bottom: -8},
  vName: {fontSize: 12.5},
  tb: {flex: 1, paddingVertical: 10, paddingHorizontal: 12, gap: 5, minWidth: 0},
  tbRow: {flexDirection: 'row', gap: 10},
  tbEnd: {alignItems: 'flex-end', marginTop: 'auto'},
  k: {fontFamily: fonts.extrabold, fontSize: 7.5, letterSpacing: ls(0.12, 7.5), color: colors.ivaText},
  v: {fontFamily: fonts.extrabold, fontSize: 11.5, color: colors.ink},
  bars: {flexDirection: 'row', gap: 2, height: 16, alignItems: 'stretch'},
  bar: {backgroundColor: colors.ink, opacity: 0.75},
  fic: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(241,221,186,0.25)',
  },
  i1: {left: 6, top: 46},
  i2: {left: 110, top: 14},
  i3: {right: 6, top: 300},
  pw: {position: 'absolute', left: 176, top: 70, width: 132, height: 180},
  pgShadow: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    ...SHADOW,
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 22},
  },
  pg: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#F4ECD8',
    overflow: 'hidden',
  },
  pgTitle: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.extrabold,
    fontSize: 6,
    letterSpacing: ls(0.22, 6),
    color: colors.ivaText,
  },
  sring: {
    position: 'absolute',
    left: 16,
    top: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(11,90,72,0.4)',
  },
  sst: {position: 'absolute', left: 16, top: 40, width: 100, height: 100},
  sspk: {position: 'absolute', left: 66, top: 90, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold},
  face: {
    ...StyleSheet.absoluteFillObject,
    transformOrigin: 'left',
    overflow: 'hidden',
  },
  cf: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(241,221,186,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cfEdge: {position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, backgroundColor: 'rgba(0,0,0,0.25)'},
  cfBrand: {fontFamily: fonts.extrabold, fontSize: 7, letterSpacing: ls(0.24, 7), color: colors.gold},
  cfTitle: {fontFamily: fonts.serif, fontSize: 19, color: '#F6EAD2'},
  ci: {
    backgroundColor: '#EFE5CC',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cap: {width: 300, minHeight: 52},
  capIn: {alignItems: 'center'},
  c2: {position: 'absolute', left: 0, right: 0, top: 0},
  capT: {fontFamily: fonts.bold, fontSize: 17, color: colors.white},
  capSub: {fontFamily: fonts.regular, fontSize: 12.5, color: '#ADA597', marginTop: 4},
  dots: {flexDirection: 'row', gap: 5, marginTop: 10},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold},
});
