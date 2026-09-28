import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const SHINE_W = 46;
const SWEEP_MS = 1000;
const DEFAULT_INTERVAL = 1500;

/**
 * Gold gradient pill with a sparkle glyph and a shine band that sweeps
 * across it on an interval.
 */
export default function ShinyTag({
  label = 'FRACSPACE PRESENTS',
  interval = DEFAULT_INTERVAL,
  active = true,
  style,
}) {
  const [pillWidth, setPillWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    loopRef.current?.stop?.();
    progress.setValue(0);

    if (!active || pillWidth <= 0) return undefined;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(interval),
        Animated.timing(progress, {
          toValue: 1,
          duration: SWEEP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    loopRef.current = loop;
    loop.start();

    return () => loop.stop();
  }, [active, interval, pillWidth, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHINE_W * 1.6, pillWidth + SHINE_W],
  });

  return (
    <View
      style={[styles.wrap, style]}
      onLayout={e => setPillWidth(e.nativeEvent.layout.width)}>
      <LinearGradient
        colors={['#6B4720', '#9C6C34', '#CE8F52', '#8C5F2D', '#6B4720']}
        locations={[0, 0.3, 0.55, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* shine sweep */}
      <Animated.View
        pointerEvents="none"
        style={[styles.shine, { transform: [{ translateX }, { rotate: '18deg' }] }]}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.35)',
            'rgba(255,255,255,0.75)',
            'rgba(255,255,255,0.35)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Sparkle />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function Sparkle({ size = 13, color = '#FBEEDD' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.5c.7 5.4 4.6 9.3 10 10-5.4.7-9.3 4.6-10 10-.7-5.4-4.6-9.3-10-10 5.4-.7 9.3-4.6 10-10z"
        fill={color}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 22,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: -14,
    bottom: -14,
    left: 0,
    width: SHINE_W,
  },
  label: {
    color: '#FBF2E7',
    fontFamily: 'WorkSans-Bold',
    fontSize: 11.5,
    letterSpacing: 1.3,
    marginLeft: 9,
  },
});
