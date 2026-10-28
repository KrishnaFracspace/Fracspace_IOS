// Bottom navigation pieces from Hub.dc.html, used by Screen/Navigation/BottomNavi.js:
//   NavCore     the raised centre button (spinning gold ring, rotating words)
//   DarkNavBar  the floating glass pill shown while the Special Section tab is open
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Circle, Defs, LinearGradient as SvgLinear, Path, RadialGradient, Rect, Stop} from 'react-native-svg';
import {colors, fonts} from './theme';
import {E, PressScale, kf, useLoop, useReducedMotion} from './anim';

// conic-gradient(from 0deg,#F1DDBA,#7A5A2E,#1A1611,#D9B26F,#F1DDBA) as 5° wedges
const CONIC = ['#F1DDBA', '#7A5A2E', '#1A1611', '#D9B26F', '#F1DDBA'];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function conicColor(t) {
  const seg = Math.min(3, Math.floor(t * 4));
  const f = t * 4 - seg;
  const a = hex(CONIC[seg]);
  const b = hex(CONIC[seg + 1]);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(',')})`;
}
const RING = 70;
const WEDGES = Array.from({length: 72}, (_, i) => {
  const r = RING / 2;
  const a0 = ((i * 5 - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * 5 - 90 + 0.6) * Math.PI) / 180; // slight overlap hides seams
  const p = a => `${r + r * Math.cos(a)} ${r + r * Math.sin(a)}`;
  return {d: `M${r} ${r}L${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}Z`, fill: conicColor((i + 0.5) / 72)};
});

function Word({children, delay}) {
  // rotw 7.5s cubic-bezier(.4,0,.2,1) infinite (blur not available in RN)
  const p = useLoop(7500, {delay});
  const a = useAnimatedStyle(() => ({
    opacity: kf(p.value, [[0, 0], [0.06, 1], [0.28, 1], [0.34, 0], [1, 0]], E.material),
    transform: [
      {scale: kf(p.value, [[0, 0.86], [0.06, 1], [0.28, 1], [0.34, 1.08], [1, 1.08]], E.material)},
      {translateY: kf(p.value, [[0, 3], [0.06, 0], [0.28, 0], [0.34, -3], [1, -3]], E.material)},
    ],
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.center, a]}>
      <Text style={styles.word}>{children}</Text>
    </Animated.View>
  );
}

/** `.ncore`: 64px centre button. Press scale .9. */
export function NavCore({onPress, style}) {
  const reduced = useReducedMotion();
  const spin = useLoop(3200);
  const ring = useAnimatedStyle(() => ({transform: [{rotate: `${spin.value * 360}deg`}]}));
  return (
    <PressScale
      to={0.9}
      duration={400}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Stays, Music and Shop"
      style={[styles.core, style]}>
      {/* The 72-wedge ring never changes, only rotates: cache it as a texture
          so each frame just turns the bitmap instead of redrawing the SVG. */}
      <Animated.View style={[styles.ring, ring]} renderToHardwareTextureAndroid shouldRasterizeIOS>
        <Svg width={RING} height={RING}>
          {WEDGES.map(w => (
            <Path key={w.d} d={w.d} fill={w.fill} />
          ))}
        </Svg>
      </Animated.View>
      <View style={styles.disc}>
        <Svg width={58} height={58} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="ncore" cx={29} cy={17.4} r={49.9} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFF7EA" />
              <Stop offset="0.7" stopColor={colors.gold} />
              <Stop offset="1" stopColor={colors.gold} />
            </RadialGradient>
            <SvgLinear id="ncoreInset" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.6" stopColor="rgb(160,110,50)" stopOpacity={0} />
              <Stop offset="1" stopColor="rgb(160,110,50)" stopOpacity={0.25} />
            </SvgLinear>
          </Defs>
          <Circle cx={29} cy={29} r={29} fill="url(#ncore)" />
          <Circle cx={29} cy={29} r={29} fill="url(#ncoreInset)" />
        </Svg>
        <View style={styles.rot}>
          {reduced ? (
            <View style={[StyleSheet.absoluteFill, styles.center]}>
              <Text style={styles.word}>Stays</Text>
            </View>
          ) : (
            <>
              <Word delay={0}>Stays</Word>
              <Word delay={2500}>Music</Word>
              <Word delay={5000}>Shop</Word>
            </>
          )}
        </View>
      </View>
    </PressScale>
  );
}

const stroke = {fill: 'none', stroke: 'currentColor', strokeWidth: 1.7};
const ICONS = {
  Home: c => (
    <Path {...stroke} stroke={c} strokeLinejoin="round" d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  ),
  Wallet: c => (
    <>
      <Rect {...stroke} stroke={c} x={3.5} y={6} width={17} height={14} rx={2.5} />
      <Path {...stroke} stroke={c} strokeLinecap="round" d="M3.5 10h17M16 15h1.5M6.5 6l8.5-2.5 1 2.5" />
    </>
  ),
  Verification: c => (
    <>
      <Path {...stroke} stroke={c} strokeLinejoin="round" d="M12 3.5l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9v-5z" />
      <Path {...stroke} stroke={c} strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </>
  ),
  Portfolio: c => (
    <>
      <Rect {...stroke} stroke={c} x={5} y={3.5} width={14} height={17} rx={2.5} />
      <Path {...stroke} stroke={c} strokeLinecap="round" d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  Profile: c => (
    <>
      <Circle {...stroke} stroke={c} cx={12} cy={8.5} r={3.8} />
      <Path {...stroke} stroke={c} strokeLinecap="round" d="M4.5 20c1.3-3.6 4.1-5.4 7.5-5.4s6.2 1.8 7.5 5.4" />
    </>
  ),
};

function NavItem({label, onPress}) {
  const icon = ICONS[label] || ICONS.Home;
  return (
    <PressScale to={0.88} duration={400} onPress={onPress} style={styles.ni} accessibilityRole="button" accessibilityLabel={label}>
      <Svg width={24} height={24} viewBox="0 0 24 24">
        {icon(colors.navText)}
      </Svg>
      <Text style={styles.niText} numberOfLines={1}>
        {label}
      </Text>
    </PressScale>
  );
}

/**
 * `.nav`: floating dark pill with 5 columns. `tabs` are BottomNavi's tab
 * entries (the centre one has `centre: true`); `onPress(index)` switches tab.
 */
export function DarkNavBar({tabs, onPress, bottom}) {
  return (
    <View style={[styles.nav, {bottom}]}>
      {tabs.map((tab, i) => (
        <View key={tab.navi} style={styles.col}>
          {tab.centre ? (
            <NavCore onPress={() => onPress(i)} style={styles.coreRaised} />
          ) : (
            <NavItem label={tab.label} onPress={() => onPress(i)} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {alignItems: 'center', justifyContent: 'center'},
  core: {width: 64, height: 64, alignItems: 'center', justifyContent: 'center'},
  ring: {position: 'absolute', left: -3, top: -3, width: RING, height: RING, borderRadius: RING / 2, overflow: 'hidden'},
  disc: {width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  rot: {width: 56, height: 18},
  word: {fontFamily: fonts.extrabold, fontSize: 13, color: colors.terracotta},
  nav: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 74,
    borderRadius: 37,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,21,25,0.94)',
    borderWidth: 1,
    borderColor: colors.whiteA(0.09),
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 18},
    elevation: 20,
  },
  col: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  // grid align-items:center + margin-top:-22px → top edge 6px above the pill
  coreRaised: {marginTop: -22},
  ni: {alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 56},
  niText: {fontFamily: fonts.semibold, fontSize: 11, color: colors.navText},
});

/** Distance of the dark pill from the screen bottom (`.nav{bottom:16px}`, clear of the home indicator). */
export function navBottom(insets) {
  return Math.max(16, insets.bottom - 18);
}
