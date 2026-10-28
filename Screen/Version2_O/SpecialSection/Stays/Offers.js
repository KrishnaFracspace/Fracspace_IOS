// "Exclusive Offers & Perks" coupons (`.coupon`, `.crown`, `.spark`, `.claim`
// in Stays.dc.html).
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {interpolateColor, useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop} from 'react-native-svg';
import {colors, fonts, ls} from '../theme';
import {E, PressScale, RailGate, kf, useToggle} from '../anim';
import {Confetti, Loop} from './bits';
import {BadgeIcon, CheckIcon} from './icons';
import {useRenderCount} from '../perf';

// Colour helpers are plain JS, so resolve them before they reach a worklet.
const CODE_BORDER = colors.goldA(0.4);
const GOLD_0 = colors.goldA(0);
const GOLD_14 = colors.goldA(0.14);

export const COUPON_W = 314;
const COUPON_H = 216;

// Backgrounds: radial glow at 82% 30% over a 150deg linear gradient.
const THEMES = {
  warm: {glow: 'rgb(233,180,76)', glowA: 0.38, stops: [['0', '#3A2A18'], ['0.58', '#1F1810'], ['1', '#151214']]},
  slate: {glow: 'rgb(140,165,230)', glowA: 0.26, stops: [['0', '#1E2335'], ['0.6', '#141625'], ['1', '#111219']]},
};

function CouponBg({theme}) {
  const th = THEMES[theme];
  // 150deg gradient line through the centre, length |w·sin| + |h·cos|.
  const half = (COUPON_W * 0.5 + COUPON_H * 0.866) / 2;
  const [cx, cy] = [COUPON_W / 2, COUPON_H / 2];
  // `circle at 82% 30%` sized to the farthest corner (bottom-left).
  const [gx, gy] = [COUPON_W * 0.82, COUPON_H * 0.3];
  const r = Math.hypot(gx, COUPON_H - gy);
  return (
    <Svg style={StyleSheet.absoluteFill} width={COUPON_W} height={COUPON_H}>
      <Defs>
        <LinearGradient
          id={`lin-${theme}`}
          gradientUnits="userSpaceOnUse"
          x1={cx - 0.5 * half}
          y1={cy - 0.866 * half}
          x2={cx + 0.5 * half}
          y2={cy + 0.866 * half}>
          {th.stops.map(([o, c]) => (
            <Stop key={o} offset={o} stopColor={c} />
          ))}
        </LinearGradient>
        <RadialGradient id={`rad-${theme}`} gradientUnits="userSpaceOnUse" cx={gx} cy={gy} r={r}>
          <Stop offset="0" stopColor={th.glow} stopOpacity={th.glowA} />
          <Stop offset="0.48" stopColor={th.glow} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width={COUPON_W} height={COUPON_H} fill={`url(#lin-${theme})`} />
      <Rect width={COUPON_W} height={COUPON_H} fill={`url(#rad-${theme})`} />
    </Svg>
  );
}

// `.spark` paths (viewBox 0 0 100 80) with their bounding boxes.
const SPARKS = [
  {d: 'M88 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', box: [81, 4, 95, 18], delay: 0},
  {d: 'M8 62l1.5 3.5 3.5 1.5-3.5 1.5L8 72l-1.5-3.5L3 67l3.5-1.5z', box: [3, 62, 13, 72], delay: 700},
  {d: 'M96 60l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4z', box: [91.6, 60, 100.4, 68.8], delay: 1300},
];

/** `@keyframes twinkle` around the spark's own centre (transform-box: fill-box). */
const twinkle = p => {
  'worklet';
  const stops = (a, b) => [[0, a], [0.5, b], [1, a]];
  return {
    opacity: kf(p, stops(0, 1), E.easeInOut),
    transform: [
      {scale: kf(p, stops(0.3, 1), E.easeInOut)},
      {rotate: `${kf(p, stops(0, 45), E.easeInOut)}deg`},
    ],
  };
};

/** `@keyframes hover` on the coupon art. */
const hover = p => {
  'worklet';
  const t = E.easeInOut(p < 0.5 ? p * 2 : 2 - p * 2);
  return {transform: [{translateY: -7 * t}, {rotate: `${-3 + 6 * t}deg`}]};
};

function Art({kind}) {
  const crown = kind === 'crown';
  const [w, h] = crown ? [98, 78] : [92, 72];
  const k = Math.min(w / 100, h / 80);
  const [ox, oy] = [(w - 100 * k) / 2, (h - 80 * k) / 2];
  const sparkFill = crown ? '#FFF4D2' : '#E6ECFF';
  const ink = crown ? '#3A2A18' : '#1E2335';
  const ticket = 'M10 18h80v14a8 8 0 0 0 0 16v14H10V48a8 8 0 0 0 0-16z';
  return (
    <Loop
      duration={3400}
      track={hover}
      style={[styles.art, crown ? styles.crownPos : styles.ticketPos, {width: w, height: h}]}>
      <Svg width={w} height={h} viewBox="0 0 100 80">
        <Defs>
          <LinearGradient id={`art-${kind}`} x1="0" y1="0" x2="1" y2="1">
            {crown ? (
              <>
                <Stop offset="0" stopColor="#FFE9AE" />
                <Stop offset="0.55" stopColor="#E9B44C" />
                <Stop offset="1" stopColor="#A86A22" />
              </>
            ) : (
              <>
                <Stop offset="0" stopColor="#C9D6FF" />
                <Stop offset="1" stopColor="#5D74C8" />
              </>
            )}
          </LinearGradient>
        </Defs>
        <G transform="rotate(-10, 50, 40)">
          <Path d={ticket} fill={`url(#art-${kind})`} />
          <Path d="M38 22v38" stroke={ink} strokeWidth={2} strokeDasharray="4 4" />
          {crown ? (
            <>
              <Circle cx="56" cy="32" r="4" fill="none" stroke={ink} strokeWidth={2.6} />
              <Circle cx="72" cy="48" r="4" fill="none" stroke={ink} strokeWidth={2.6} />
              <Path d="M74 28 54 52" stroke={ink} strokeWidth={2.8} strokeLinecap="round" />
            </>
          ) : null}
        </G>
      </Svg>
      {SPARKS.slice(0, crown ? 3 : 2).map(s => {
        const [x0, y0, x1, y1] = s.box;
        return (
          <Loop
            key={s.d}
            duration={2000}
            delay={s.delay}
            track={twinkle}
            style={{
              ...styles.abs,
              left: ox + x0 * k,
              top: oy + y0 * k,
              width: (x1 - x0) * k,
              height: (y1 - y0) * k,
            }}>
            <Svg width="100%" height="100%" viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}>
              <Path d={s.d} fill={sparkFill} />
            </Svg>
          </Loop>
        );
      })}
    </Loop>
  );
}

function Coupon({offer, got, onClaim}) {
  useRenderCount('Coupon');
  const v = useToggle(got, {duration: 300, easing: E.ease});
  const code = useAnimatedStyle(() => ({
    borderColor: interpolateColor(v.value, [0, 1], [CODE_BORDER, colors.gold]),
    backgroundColor: interpolateColor(v.value, [0, 1], [GOLD_0, GOLD_14]),
  }));
  const codeText = useAnimatedStyle(() => ({color: interpolateColor(v.value, [0, 1], ['#E6E0D6', colors.gold])}));
  const btn = useAnimatedStyle(() => ({backgroundColor: interpolateColor(v.value, [0, 1], [colors.gold, '#E6F4EA'])}));
  const btnText = useAnimatedStyle(() => ({color: interpolateColor(v.value, [0, 1], [colors.ink, '#14532D'])}));

  return (
    <View style={styles.coupon}>
      <CouponBg theme={offer.theme} />
      <View style={styles.copy}>
        <View style={styles.cbadge}>
          <BadgeIcon />
          <Text style={styles.cbadgeText}>{offer.badge}</Text>
        </View>
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.desc}>{offer.desc}</Text>
        {offer.perk ? <Text style={styles.perk}>{offer.perk}</Text> : null}
      </View>
      <Art kind={offer.art} />
      <Svg style={styles.perf} height={2}>
        <Line x1="0" y1="0.75" x2="100%" y2="0.75" stroke={colors.goldA(0.28)} strokeWidth={1.5} strokeDasharray="4 4" />
      </Svg>
      <View style={[styles.notch, styles.notchL]} />
      <View style={[styles.notch, styles.notchR]} />
      <View style={styles.foot}>
        <Animated.View style={[styles.code, got ? styles.solid : styles.dashed, code]}>
          <Animated.Text style={[styles.codeText, codeText]}>
            CODE <Text style={styles.codeValue}>{offer.code}</Text>
          </Animated.Text>
        </Animated.View>
        <PressScale
          to={0.9}
          onPress={got ? undefined : onClaim}
          accessibilityLabel={got ? `Code ${offer.code} copied` : `Claim code ${offer.code}`}>
          <Animated.View style={[styles.claim, btn]}>
            {got ? <CheckIcon color="#14532D" /> : null}
            <Animated.Text style={[styles.claimText, btnText]}>{got ? 'Copied' : 'Claim →'}</Animated.Text>
            {got ? <Confetti /> : null}
          </Animated.View>
        </PressScale>
      </View>
    </View>
  );
}

/** The coupons of the rail; `sx` / `viewportW` gate each coupon's loops to when it is in view. */
export default function Offers({offers, claimed, onClaim, sx, viewportW}) {
  return offers.map((o, i) => (
    <RailGate key={o.id} sx={sx} left={20 + i * (COUPON_W + 12)} width={COUPON_W} viewportW={viewportW}>
      <Coupon offer={o} got={!!claimed[o.id]} onClaim={() => onClaim(o.id)} />
    </RailGate>
  ));
}

const styles = StyleSheet.create({
  coupon: {
    width: COUPON_W,
    height: COUPON_H,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.goldA(0.22),
  },
  copy: {position: 'absolute', left: 18, top: 18, right: 120, gap: 8},
  cbadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingLeft: 6,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: colors.goldA(0.14),
    borderWidth: 1,
    borderColor: colors.goldA(0.4),
  },
  cbadgeText: {fontFamily: fonts.extrabold, fontSize: 10.5, letterSpacing: ls(0.08, 10.5), color: colors.gold},
  title: {fontFamily: fonts.extrabold, fontSize: 23, letterSpacing: ls(-0.01, 23), color: '#fff'},
  desc: {fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 12.5 * 1.45, color: colors.softer},
  perk: {fontFamily: fonts.semibold, fontSize: 10.5, color: '#E9B44C'},
  art: {position: 'absolute'},
  abs: {position: 'absolute'},
  crownPos: {right: 18, top: 38},
  ticketPos: {right: 22, top: 40},
  notchL: {left: -11},
  notchR: {right: -11},
  solid: {borderStyle: 'solid'},
  dashed: {borderStyle: 'dashed'},
  perf: {position: 'absolute', left: 18, right: 18, top: 151.25},
  notch: {
    position: 'absolute',
    top: 142,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.ground,
    borderWidth: 1,
    borderColor: colors.goldA(0.22),
  },
  foot: {
    position: 'absolute',
    left: 18,
    right: 16,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {height: 34, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center'},
  codeText: {fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: ls(0.06, 11.5)},
  codeValue: {fontFamily: fonts.extrabold, color: '#fff'},
  claim: {flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 16, borderRadius: 999},
  claimText: {fontFamily: fonts.extrabold, fontSize: 13},
});
