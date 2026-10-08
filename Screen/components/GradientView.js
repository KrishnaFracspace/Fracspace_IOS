import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const RADIUS_KEYS = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
];

/**
 * A View with a gradient background. Use it instead of putting content inside
 * <LinearGradient>.
 *
 * react-native-linear-gradient is a legacy native view; on iOS with the New
 * Architecture it doesn't lay out its children reliably (content shifted right
 * and clipped on Portfolio and Profile verification, the availability pill
 * clipped to "5 Fr"). Here a plain View does all sizing and layout - padding,
 * centring, borders, shadow - and the gradient is only drawn behind it, with the
 * same rounded corners.
 *
 * Takes LinearGradient's props (colors, start, end, locations, useAngle,
 * angle, angleCenter) plus normal View props and style.
 */
export default function GradientView({
  colors,
  start,
  end,
  locations,
  useAngle,
  angle,
  angleCenter,
  style,
  children,
  ...viewProps
}) {
  const flat = StyleSheet.flatten(style) || {};
  const radius = {};
  RADIUS_KEYS.forEach(key => {
    if (flat[key] != null) radius[key] = flat[key];
  });
  // Only pass what was set, so LinearGradient's own defaults still apply.
  const gradientProps = { colors };
  if (start !== undefined) gradientProps.start = start;
  if (end !== undefined) gradientProps.end = end;
  if (locations !== undefined) gradientProps.locations = locations;
  if (useAngle !== undefined) gradientProps.useAngle = useAngle;
  if (angle !== undefined) gradientProps.angle = angle;
  if (angleCenter !== undefined) gradientProps.angleCenter = angleCenter;
  return (
    <View style={style} {...viewProps}>
      <LinearGradient
        {...gradientProps}
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, radius]}
      />
      {children}
    </View>
  );
}
