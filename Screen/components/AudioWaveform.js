import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { CONCERT_THEME as T } from '../utils/concertData';

const BAR_PATTERN = [0.45, 1, 0.65, 0.85, 0.35];

/**
 * Lightweight equaliser bars. Animates while `playing`, settles to a
 * static resting shape when paused.
 */
export default function AudioWaveform({
  playing = false,
  bars = 5,
  height = 26,
  barWidth = 3.5,
  gap = 3.5,
  color = T.gold,
}) {
  const values = useRef(
    Array.from({ length: bars }, (_, i) =>
      new Animated.Value(BAR_PATTERN[i % BAR_PATTERN.length]),
    ),
  ).current;
  const loops = useRef([]);

  useEffect(() => {
    loops.current.forEach(l => l?.stop?.());
    loops.current = [];

    if (playing) {
      values.forEach((v, i) => {
        const seq = Animated.loop(
          Animated.sequence([
            Animated.timing(v, {
              toValue: 1,
              duration: 320 + i * 90,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(v, {
              toValue: 0.28,
              duration: 300 + i * 70,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
          ]),
        );
        loops.current.push(seq);
        seq.start();
      });
    } else {
      values.forEach((v, i) => {
        Animated.timing(v, {
          toValue: BAR_PATTERN[i % BAR_PATTERN.length],
          duration: 220,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => loops.current.forEach(l => l?.stop?.());
  }, [playing, values]);

  return (
    <View style={[styles.row, { height }]}>
      {values.map((v, i) => (
        <Animated.View
          key={i}
          style={{
            width: barWidth,
            marginLeft: i === 0 ? 0 : gap,
            borderRadius: barWidth / 2,
            backgroundColor: color,
            height: v.interpolate({
              inputRange: [0, 1],
              outputRange: [height * 0.18, height],
            }),
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
});
