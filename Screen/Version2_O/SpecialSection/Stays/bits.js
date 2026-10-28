// Small animated pieces shared by the Stays listing views.
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {colors, fonts, ls} from '../theme';
import {E, useLoop, useReducedMotion} from '../anim';

/**
 * One-shot CSS animation clock: runs 0→1 over `duration` whenever `run`
 * changes to a truthy value (like a class that adds `animation:`), and rests
 * at 1 otherwise.
 */
export function useShot(run, duration, delay = 0) {
  const reduced = useReducedMotion();
  const p = useSharedValue(1);
  useEffect(() => {
    if (!run || reduced) {
      p.value = 1;
      return;
    }
    p.value = 0;
    const t = withTiming(1, {duration, easing: E.linear});
    p.value = delay ? withDelay(delay, t) : t;
  }, [run, reduced, duration, delay, p]);
  return p;
}

/** `transition: background/color .3s` between two colours. */
export function useColor(on, off, onColor, duration = 300) {
  const reduced = useReducedMotion();
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    v.value = reduced ? (on ? 1 : 0) : withTiming(on ? 1 : 0, {duration, easing: E.ease});
  }, [on, reduced, duration, v]);
  return useAnimatedStyle(() => ({color: interpolateColor(v.value, [0, 1], [off, onColor])}));
}

/**
 * `@keyframes ripple{from{scale(1);opacity:.8}to{scale(1.7);opacity:0}}` on a
 * ring that covers its parent (inset −`inset`).
 */
export function Ripple({duration, delay = 0, color, width = 1, inset = 0, radius = 999, active = true}) {
  const p = useLoop(duration, {delay, active});
  const a = useAnimatedStyle(() => {
    const t = E.easeOut(p.value);
    return {opacity: 0.8 * (1 - t), transform: [{scale: 1 + 0.7 * t}]};
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        {
          top: -inset,
          left: -inset,
          right: -inset,
          bottom: -inset,
          borderRadius: radius,
          borderWidth: width,
          borderColor: color,
        },
        a,
      ]}
    />
  );
}

/**
 * An infinite CSS animation on a wrapper, e.g. `swipe` or `float3`. `track`
 * is a worklet (p 0..1) → animated style.
 */
export function Loop({duration, delay = 0, track, style, children}) {
  const p = useLoop(duration, {delay});
  const a = useAnimatedStyle(() => track(p.value));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

function Piece({p, angle, style, from, to, spin = 0, scaleTo = 1, easing}) {
  const a = useAnimatedStyle(() => {
    const t = easing(p.value);
    return {
      opacity: 1 - t,
      transform: [
        {rotate: `${angle}deg`},
        {translateY: from + (to - from) * t},
        {rotate: `${spin * t}deg`},
        {scale: 1 + (scaleTo - 1) * t},
      ],
    };
  });
  return <Animated.View style={[styles.piece, style, a]} />;
}

/** `.burst`: 8 dots flying out of the heart (.65s ease-out). */
export function Burst() {
  const p = useShot(true, 650);
  return (
    <View pointerEvents="none" style={styles.origin}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <Piece
          key={a}
          p={p}
          angle={a}
          from={-6}
          to={-28}
          scaleTo={0.3}
          easing={E.easeOut}
          style={[styles.dot, {backgroundColor: i % 2 ? colors.gold : colors.roseLight}]}
        />
      ))}
    </View>
  );
}

const CONF = ['#8FD3A8', colors.gold, colors.roseLight]; // nth-child 3n+1, other, 3n

/** `.conf`: 12 confetti strips around the claim button (.9s soft). */
export function Confetti() {
  const p = useShot(true, 900);
  return (
    <View pointerEvents="none" style={styles.origin}>
      {Array.from({length: 12}, (_, i) => (
        <Piece
          key={i}
          p={p}
          angle={i * 30}
          from={0}
          to={-70}
          spin={220}
          easing={E.soft}
          style={[styles.strip, {backgroundColor: CONF[i % 3]}]}
        />
      ))}
    </View>
  );
}

/** `.tag` pill (Stays variant: 24px tall, no dot). */
export function Tag({children}) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {position: 'absolute'},
  origin: {position: 'absolute', left: '50%', top: '50%', width: 0, height: 0},
  piece: {position: 'absolute'},
  dot: {left: -2.5, top: -2.5, width: 5, height: 5, borderRadius: 2.5},
  strip: {left: -4, top: -2, width: 8, height: 4, borderRadius: 1},
  tag: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.goldA(0.3),
    backgroundColor: colors.goldA(0.08),
    justifyContent: 'center',
  },
  tagText: {fontFamily: fonts.bold, fontSize: 10, letterSpacing: ls(0.1, 10), color: colors.gold},
});
