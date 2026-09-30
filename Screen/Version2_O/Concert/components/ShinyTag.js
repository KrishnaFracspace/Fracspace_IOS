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
const GOLD = ['#6B4720', '#9C6C34', '#CE8F52', '#8C5F2D', '#6B4720'];
const GOLD_STOPS = [0, 0.3, 0.55, 0.78, 1];

/**
 * Gold gradient pill with a sparkle glyph and a shine band that sweeps
 * across it on an interval.
 *
 * Everything past `style` is optional and defaults to the hero tag on the
 * details screen, so the same shine can dress a much smaller chip without a
 * second copy of the animation: pass `icon` to swap the sparkle (null for
 * none), `labelStyle` to resize the text, and `shineWidth` to narrow the band
 * so it does not wash a short pill out in one frame.
 */
export default function ShinyTag({
  label = 'FRACSPACE PRESENTS',
  interval = DEFAULT_INTERVAL,
  active = true,
  style,
  labelStyle,
  icon,
  colors = GOLD,
  locations = GOLD_STOPS,
  shineWidth = SHINE_W,
  sweepMs = SWEEP_MS,
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
          duration: sweepMs,
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
  }, [active, interval, pillWidth, progress, sweepMs]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-shineWidth * 1.6, pillWidth + shineWidth],
  });

  return (
    <View
      style={[styles.wrap, style]}
      onLayout={e => setPillWidth(e.nativeEvent.layout.width)}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* shine sweep */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shine,
          { width: shineWidth, transform: [{ translateX }, { rotate: '18deg' }] },
        ]}>
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

      {icon === undefined ? <Sparkle /> : icon}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
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
