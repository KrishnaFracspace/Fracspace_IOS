// Small animated pieces and icons shared by the Stay Detail parts.
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Path} from 'react-native-svg';
import {E, cssAngle, kf, useLoop, useReducedMotion} from '../anim';

export {useShot, useColor} from '../Stays/bits';

/** A shared value that transitions to `value` (CSS `transition` on a number). */
export function useTo(value, duration, easing = E.ease, delay = 0) {
  const reduced = useReducedMotion();
  const v = useSharedValue(value);
  useEffect(() => {
    if (reduced) {
      v.value = value;
      return;
    }
    const t = withTiming(value, {duration, easing});
    v.value = delay ? withDelay(delay, t) : t;
  }, [value, reduced, duration, easing, delay, v]);
  return v;
}

/**
 * For a sheet that is mounted on its first open and kept afterwards: returns
 * [mounted, shown], where `shown` turns true a frame after mounting so the
 * sheet starts closed and animates open like it always does.
 */
export function useLazy(open) {
  const [mounted, setMounted] = useState(open);
  const [ready, setReady] = useState(false);
  if (open && !mounted) {
    setMounted(true);
  }
  useEffect(() => {
    if (!mounted || ready) {
      return;
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [mounted, ready]);
  return [mounted, open && ready];
}

/**
 * `::after` shimmer with `@keyframes sheen{0%,55%{-140%}85%,100%{140%}}`
 * (the `.gc` badge and the Reserve button). Parent needs overflow hidden.
 */
export function Sweep({duration, alpha, angle = 110, band = [0.35, 0.5, 0.65], hold = 0.55, from = -1.4, to = 1.4}) {
  const w = useSharedValue(0);
  const p = useLoop(duration);
  const a = useAnimatedStyle(() => ({
    opacity: w.value ? 1 : 0,
    transform: [{translateX: kf(p.value, [[0, from], [hold, from], [0.85, to], [1, to]], E.easeInOut) * w.value}],
  }));
  const dir = cssAngle(angle);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={e => {
        w.value = e.nativeEvent.layout.width;
      }}>
      <Animated.View style={[StyleSheet.absoluteFill, a]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={['rgba(255,255,255,0)', `rgba(255,255,255,${alpha})`, 'rgba(255,255,255,0)']}
          locations={band}
          start={dir.start}
          end={dir.end}
        />
      </Animated.View>
    </View>
  );
}

/**
 * Odometer column (`.odo .strip` / `.num .col .strip`): a vertical strip of
 * `items`, `h` px each, sliding to `index` with the spring easing.
 */
export function Odo({index, h, items, duration, textStyle}) {
  const y = useTo(-h * index, duration, E.spring);
  const a = useAnimatedStyle(() => ({transform: [{translateY: y.value}]}));
  return (
    <View style={[styles.odo, {height: h}]}>
      <Animated.View style={a}>
        {items.map(c => (
          <Text key={c} style={[textStyle, {height: h, lineHeight: h}]}>
            {c}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

/**
 * `box-shadow: 0 0 0 4px rgba(...)` focus ring around a rounded box; `v` is a
 * 0..1 shared value that fades it in.
 */
export function FocusRing({v, radius, color}) {
  const a = useAnimatedStyle(() => ({opacity: v.value}));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.ring, {borderRadius: radius + 4, borderColor: color}, a]}
    />
  );
}

export function ShareIcon({size = 19}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round">
      <Circle cx="17.5" cy="5.5" r="2.5" />
      <Circle cx="6.5" cy="12" r="2.5" />
      <Circle cx="17.5" cy="18.5" r="2.5" />
      <Path d="m8.7 10.8 6.6-4M8.7 13.2l6.6 4" />
    </Svg>
  );
}

export const CHECK_D = 'm5 12.5 4.5 4.5L19 7.5';

export function CheckIcon({size = 16, color, strokeWidth = 2.4}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d={CHECK_D} />
    </Svg>
  );
}

export function CloseIcon({size = 18, color, strokeWidth = 2}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function ArrowRight({size = 18, color, strokeWidth = 2.2}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  odo: {overflow: 'hidden'},
  ring: {position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderWidth: 4},
});
