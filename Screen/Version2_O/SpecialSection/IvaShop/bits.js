// Shared pieces of the IVA Shop views (IvaShopV2.dc.html): entrance
// animations, cart button + count badge, quantity box, CTA, feature card,
// bottom bar, toast and spinner.
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Path} from 'react-native-svg';
import {colors, fonts, ls} from '../theme';
import {E, Nudge, PressScale, cssAngle, kf, useLoop} from '../anim';
import {GlassButton} from '../HubBits';
import {useShot, useTo} from '../StayDetail/bits';

export const MUTED = '#ADA597';
export const GREEN = '#6EE7A0';

// Entrances are driven by a shared value that plays once on mount, not by
// Reanimated layout animations (`entering`): swapping whole views that hold
// nested `entering` children crashes natively on Android (New Architecture).

/** Plays a CSS `animation: <name> <duration> <easing> <delay> both` once on mount. */
function Enter({duration, delay = 0, easing = E.out, frame, style, children, ...rest}) {
  const p = useOnce(duration, delay, easing);
  const a = useAnimatedStyle(() => frame(p.value));
  return (
    <Animated.View {...rest} style={[style, a]}>
      {children}
    </Animated.View>
  );
}

const riseFrame = (dy, axis = 'translateY') => v => {
  'worklet';
  return {opacity: Math.min(1, v), transform: [{[axis]: dy * (1 - v)}]};
};
const RISE = riseFrame(14);
const SV_IN = riseFrame(30, 'translateX');
const SV_BACK = riseFrame(-30, 'translateX');
const FADE = v => {
  'worklet';
  return {opacity: v};
};
const VC = v => {
  'worklet';
  return {opacity: Math.min(1, 0.4 + 0.6 * v), transform: [{scale: 0.9 + 0.1 * v}]};
};

/** `.stg > *`: rise (.8s --out, 14px) at 50 / 150 / 250 / 350ms. */
export const Rise = ({i, ...rest}) => <Enter duration={800} delay={50 + 100 * i} frame={RISE} {...rest} />;

/** `up` (.5s --out, 14px) after `delay` ms. */
export const Up = props => <Enter duration={500} frame={RISE} {...props} />;

/** `.sv` (`svin`) / `.sv.back` (`svback`): fade in from 30px right / left, .5s --out. */
export const SlideIn = ({back, ...rest}) => <Enter duration={500} frame={back ? SV_BACK : SV_IN} {...rest} />;

/** `fadeIn` .3s ease. */
export const FadeIn = props => <Enter duration={300} easing={E.ease} frame={FADE} {...props} />;

/** `.vc`: vcIn (scale .9 → 1, opacity .4 → 1, .45s --spring). */
export const PopIn = props => <Enter duration={450} easing={E.spring} frame={VC} {...props} />;

function Icon({size = 18, strokeWidth = 1.8, color = colors.gold, children}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export const CartIcon = ({color = '#fff', size = 20}) => (
  <Icon size={size} color={color}>
    <Path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5Z" />
    <Path d="M9 7a3 3 0 0 1 6 0" />
  </Icon>
);
export const BoxIcon = ({color}) => (
  <Icon color={color}>
    <Path d="M3 8l9-5 9 5v8l-9 5-9-5Z" />
    <Path d="M3 8l9 5 9-5M12 13v8" />
  </Icon>
);
export const LeafIcon = ({color}) => (
  <Icon color={color}>
    <Path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Z" />
    <Path d="M5 19 13 11" />
  </Icon>
);
export const DiyaIcon = ({color}) => (
  <Icon color={color}>
    <Path d="M3 14c2 4 16 4 18 0Z" />
    <Path d="M12 4c2 3 2 5 0 7-2-2-2-4 0-7Z" />
  </Icon>
);
export const TruckIcon = () => (
  <Icon>
    <Path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <Circle cx={7} cy={17.5} r={1.8} />
    <Circle cx={17} cy={17.5} r={1.8} />
  </Icon>
);
export const EditIcon = () => (
  <Icon size={16} strokeWidth={1.9}>
    <Path d="M4 20h4L19 9l-4-4L4 16v4Z" />
  </Icon>
);
export const PinIcon = () => (
  <Icon size={12} strokeWidth={2.2}>
    <Path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <Circle cx={12} cy={9} r={2.5} />
  </Icon>
);
export const CheckIcon = ({size = 18, color}) => (
  <Icon size={size} strokeWidth={3} color={color}>
    <Path d="m5 12 5 5 9-10" />
  </Icon>
);

/** `.cnt` badge: bump (b2 peaks at 1.3) on mount and every add to cart. */
function CountBadge({count, bump}) {
  const p = useShot(bump, 450);
  const peak = bump % 2 ? 1.3 : 1.25;
  const a = useAnimatedStyle(() => ({
    transform: [{scale: kf(p.value, [[0, 0.4], [0.6, peak], [1, 1]], E.spring)}],
  }), [peak]);
  return (
    <Animated.View style={[styles.cnt, a]}>
      <Text style={styles.cntText}>{count}</Text>
    </Animated.View>
  );
}

/** `.gbtn.cartb`: cart button with the item count. */
export function CartButton({count, bump, onPress, style}) {
  return (
    <View style={style}>
      <GlassButton label={`Cart, ${count} items`} onPress={onPress}>
        <CartIcon />
      </GlassButton>
      {count > 0 ? <CountBadge count={count} bump={bump} /> : null}
    </View>
  );
}

/** `.qbox button`: snaps to .85 while pressed (no transition). */
function QBtn({label, onPress, size, children}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 34 ? 4 : 0}
      style={({pressed}) => [styles.qbtn, {width: size, height: size}, pressed && styles.qbtnOn]}>
      <Text style={styles.qbtnText}>{children}</Text>
    </Pressable>
  );
}

/** `.qbox`: − qty +. `small` is the review list's 28px variant. */
export function QtyBox({qty, onDec, onInc, small}) {
  const size = small ? 28 : 34;
  return (
    <View style={[styles.qbox, small && styles.qboxSmall]}>
      <QBtn label="Decrease" onPress={onDec} size={size}>
        −
      </QBtn>
      <Text style={[styles.qval, small && styles.qvalSmall]}>{qty}</Text>
      <QBtn label="Increase" onPress={onInc} size={size}>
        +
      </QBtn>
    </View>
  );
}

/** `.cta`: gold pill (press .94, .45s spring). */
export function Cta({label, onPress, style, textStyle, children, after, accessibilityLabel}) {
  return (
    <PressScale
      to={0.94}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.cta, style]}>
      {children}
      {label ? <Text style={[styles.ctaText, textStyle]}>{label}</Text> : null}
      {after}
    </PressScale>
  );
}

/** "→" that nudges, sized for a CTA label. */
export const CtaNudge = () => <Nudge style={styles.ctaText} />;

/** `.card`: 160deg #17161A → #111114, radius 24. */
const CARD = cssAngle(160);
export function Card({style, children}) {
  return (
    <View style={[styles.card, style]}>
      <LinearGradient colors={['#17161A', '#111114']} start={CARD.start} end={CARD.end} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

const TICON = {
  sun: {bg: 'rgba(242,184,92,0.14)', color: '#F2B85C'},
  green: {bg: 'rgba(74,222,128,0.12)', color: '#4ADE80'},
  moon: {bg: 'rgba(160,170,255,0.12)', color: '#B8C0FF'},
};

/** `.ticon.<tone>`: 36px rounded icon tile. */
export function Ticon({tone, children}) {
  return <View style={[styles.ticon, {backgroundColor: TICON[tone].bg}]}>{children}</View>;
}

/** `.feat` rows inside a `.card`: [{tone, Icon, title, sub}]. */
export function Feats({items, style}) {
  return (
    <Card style={style}>
      {items.map(({tone, Icon: I, title, sub}, i) => (
        <View key={title} style={[styles.feat, i > 0 && styles.rowLine]}>
          <Ticon tone={tone}>
            <I color={TICON[tone].color} />
          </Ticon>
          <View style={styles.flex}>
            <Text style={styles.featTitle}>{title}</Text>
            <Text style={styles.featSub}>{sub}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

/** `.ph`: IVA tile for products without a photo. */
export function Ph({size = 26}) {
  return (
    <View style={styles.ph}>
      <Text style={[styles.phText, {fontSize: size, letterSpacing: ls(0.14, size)}]}>IVA</Text>
    </View>
  );
}

/** `.ibar`: floating bottom bar, `up` .5s --out after .2s. */
export function IBar({bottom, children}) {
  return (
    <Up delay={200} style={[styles.ibar, {bottom}]}>
      {children}
    </Up>
  );
}

/** `.toast` (top 96): drops in (.5s spring) with opacity .25s. */
export function Toast({msg, top}) {
  const show = !!msg;
  const y = useTo(show ? 0 : -20, 500, E.spring);
  const o = useTo(show ? 1 : 0, 250);
  const a = useAnimatedStyle(() => ({opacity: o.value, transform: [{translateY: y.value}]}));
  // Keep the last message while it fades out.
  const last = React.useRef(msg);
  if (msg) {
    last.current = msg;
  }
  return (
    <View pointerEvents="none" style={[styles.toastRow, {top}]}>
      <Animated.View accessibilityLiveRegion="polite" style={[styles.toast, a]}>
        <Text style={styles.toastText}>{last.current}</Text>
      </Animated.View>
    </View>
  );
}

/** Busy ring on Place order (spin .7s linear). */
export function Spinner() {
  const p = useLoop(700);
  const a = useAnimatedStyle(() => ({transform: [{rotate: `${360 * p.value}deg`}]}));
  return <Animated.View style={[styles.spin, a]} />;
}

/**
 * A 0..1 shared value that plays once on mount after `delay` ms over
 * `duration` (CSS `animation: ... <delay> both` with the easing applied).
 */
export function useOnce(duration, delay, easing) {
  const v = useSharedValue(0);
  React.useEffect(() => {
    v.value = withDelay(delay, withTiming(1, {duration, easing}));
  }, [v, duration, delay, easing]);
  return v;
}

export const styles = StyleSheet.create({
  flex: {flex: 1, minWidth: 0},
  cnt: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cntText: {fontFamily: fonts.extrabold, fontSize: 10.5, color: colors.ink},
  qbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  qboxSmall: {padding: 2},
  qbtn: {borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  qbtnOn: {transform: [{scale: 0.85}]},
  qbtnText: {fontFamily: fonts.bold, fontSize: 18, color: colors.gold},
  qval: {minWidth: 26, textAlign: 'center', fontFamily: fonts.bold, fontSize: 15, color: colors.cream},
  qvalSmall: {fontSize: 13},
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.18,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 10},
  },
  ctaText: {fontFamily: fonts.bold, fontSize: 14, color: colors.ink},
  card: {borderRadius: 24, borderWidth: 1, borderColor: colors.borderStrong, overflow: 'hidden'},
  ticon: {width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  feat: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingHorizontal: 16},
  rowLine: {borderTopWidth: 1, borderTopColor: colors.hairline},
  featTitle: {fontFamily: fonts.bold, fontSize: 14, color: colors.cream},
  featSub: {fontFamily: fonts.regular, fontSize: 12, marginTop: 2, color: colors.muted},
  ph: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ivaTile},
  phText: {fontFamily: fonts.serif, color: colors.ivaText},
  ibar: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(22,21,25,0.88)',
    borderWidth: 1,
    borderColor: colors.whiteA(0.09),
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 18},
    elevation: 12,
    zIndex: 40,
  },
  tlabel: {fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: ls(0.08, 10.5), color: MUTED, textTransform: 'uppercase'},
  tval: {fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: ls(-0.01, 20), color: '#fff'},
  muted: {fontFamily: fonts.regular, color: colors.muted},
  tpill: {
    height: 24,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.ground,
    borderWidth: 1,
    borderColor: colors.goldA(0.25),
  },
  tpillText: {fontFamily: fonts.bold, fontSize: 10.5, color: colors.gold},
  h3: {fontFamily: fonts.bold, fontSize: 17, color: colors.cream},
  toastRow: {position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 55, elevation: 55},
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  toastText: {fontFamily: fonts.bold, fontSize: 13, color: colors.ink},
  spin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: 'rgba(26,22,17,0.25)',
    borderTopColor: colors.ink,
  },
});
