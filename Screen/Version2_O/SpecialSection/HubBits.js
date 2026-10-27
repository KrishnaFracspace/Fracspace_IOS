// Small pieces of the Hub (Hub.dc.html): pills, dots, glass buttons, icons.
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {colors, fonts, ls} from './theme';
import {E, PressScale, useLoop} from './anim';

const grain = require('./assets/grain.png');

/**
 * `.grain` overlay over the whole screen. Android's Image ignores
 * `pointerEvents`, so the wrapper View is what lets taps through.
 */
export function Grain({opacity = 0.05}) {
  return (
    <View pointerEvents="none" renderToHardwareTextureAndroid shouldRasterizeIOS style={[StyleSheet.absoluteFill, styles.grain]}>
      <Image source={grain} resizeMode="repeat" style={[styles.grainImg, {opacity}]} />
    </View>
  );
}

/** `.gdot`: gold dot with a fading pulse ring (gpulse 1.8s ease-out). */
export function GlowDot() {
  const p = useLoop(1800);
  const ring = useAnimatedStyle(() => {
    const t = E.easeOut(p.value);
    return {opacity: 0.6 * (1 - t), transform: [{scale: 1 + t * (16 / 6)}]};
  });
  return (
    <View style={styles.dotBox}>
      <Animated.View style={[styles.dot, styles.dotRing, ring]} />
      <View style={styles.dot} />
    </View>
  );
}

/** `.ldot`: coral live dot with a ping ring (1.5s ease-out). */
export function LiveDot() {
  const p = useLoop(1500);
  const ring = useAnimatedStyle(() => {
    const t = E.easeOut(p.value);
    return {opacity: 1 - t, transform: [{scale: 0.4 + t * 1.3}]};
  });
  return (
    <View style={styles.ldot}>
      <Animated.View style={[styles.lring, ring]} />
    </View>
  );
}

/** `.eyebrow`: glass pill with a leading dot. */
export function Eyebrow({children, dot = <GlowDot />, style}) {
  return (
    <View style={[styles.eyebrow, style]}>
      {dot}
      <Text style={styles.eyebrowText}>{children}</Text>
    </View>
  );
}

/** `.tag`: small gold outline pill. */
export function Tag({children, dot, style}) {
  return (
    <View style={[styles.tag, style]}>
      {dot ? <GlowDot /> : null}
      <Text style={styles.tagText}>{children}</Text>
    </View>
  );
}

/** `.mtag`: category meta pill. */
export function MTag({children}) {
  return (
    <View style={styles.mtag}>
      <Text style={styles.mtagText}>{children}</Text>
    </View>
  );
}

/** `.gbtn`: round glass button (press scale .88). */
export function GlassButton({size = 44, onPress, label, children, style}) {
  return (
    <PressScale
      to={0.88}
      duration={400}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      style={[styles.gbtn, {width: size, height: size, borderRadius: size / 2}, style]}>
      {children}
    </PressScale>
  );
}

export function BackIcon({color = '#fff'}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14.5 5.5 8 12l6.5 6.5" />
    </Svg>
  );
}

export function ArrowIcon({size = 16, color = colors.gold}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

/** `.arrc`: outlined circle with an arrow. */
export function ArrowCircle() {
  return (
    <View style={styles.arrc}>
      <ArrowIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  grain: {zIndex: 40},
  grainImg: {width: '100%', height: '100%'},
  dotBox: {width: 6, height: 6},
  dot: {position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold},
  dotRing: {backgroundColor: colors.gold},
  ldot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.coral},
  lring: {
    position: 'absolute',
    left: -4,
    top: -4,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1.5,
    borderColor: colors.coral,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.groundA(0.5),
    borderWidth: 1,
    borderColor: colors.goldA(0.32),
  },
  eyebrowText: {fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: ls(0.12, 10.5), color: colors.cream},
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.goldA(0.3),
    backgroundColor: colors.goldA(0.08),
  },
  tagText: {fontFamily: fonts.bold, fontSize: 10, letterSpacing: ls(0.1, 10), color: colors.gold},
  mtag: {
    alignSelf: 'flex-start',
    height: 22,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.goldA(0.35),
  },
  mtagText: {fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: ls(0.08, 9.5), color: colors.gold},
  gbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.groundA(0.42),
    borderWidth: 1,
    borderColor: colors.whiteA(0.18),
  },
  arrc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.whiteA(0.12),
  },
});
