// `.cal` date sheet + `.scrim` from StayReview.dc.html.
import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {colors, fonts} from '../theme';
import {E, PressScale} from '../anim';
import {useShot, useTo} from '../StayDetail/bits';
import {MONL, monthDays, plural, short} from './data';
import {useRenderCount} from '../perf';

const SLIDE = Easing.bezierFn(0.32, 0.72, 0, 1);
const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function Chevron({d}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  );
}

/** `.mnav`: press .85, disabled opacity .25 (.2s). */
function MonthNav({onPress, disabled, label, d}) {
  const o = useTo(disabled ? 0.25 : 1, 200);
  const a = useAnimatedStyle(() => ({opacity: o.value}));
  return (
    <Animated.View style={a}>
      <PressScale to={0.85} duration={300} onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} style={styles.mnav}>
        <Chevron d={d} />
      </PressScale>
    </Animated.View>
  );
}

/** `.day`: band behind ranges, `.sel` gold disc with `dsel` (.7 → 1, .4s spring). */
const Day = memo(function Day({day, onPick}) {
  useRenderCount('Day');
  const on = useTo(day.sel ? 1 : 0, 250);
  const pop = useShot(day.sel, 400);
  const a = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.value, [0, 1], ['rgba(241,221,186,0)', colors.gold]),
    transform: [{scale: 0.7 + 0.3 * E.spring(pop.value)}],
  }));
  if (day.blank) {
    return <View style={styles.day} />;
  }
  return (
    <Pressable
      style={styles.day}
      disabled={day.off}
      onPress={() => onPick(day.d)}
      accessibilityRole="button"
      accessibilityLabel={day.label}
      accessibilityState={{disabled: day.off, selected: day.sel}}>
      {day.band ? <View style={[styles.band, day.rs && styles.bandRs, day.re && styles.bandRe]} /> : null}
      <Animated.View style={[styles.disc, day.today && styles.today, a]}>
        <Text style={[styles.dayN, day.off && styles.dayOff, day.sel && styles.daySel]}>{day.n}</Text>
      </Animated.View>
    </Pressable>
  );
});

function Calendar({open, view, pin, pout, today, bottom, onClose, onPick, onPrev, onNext, onApply}) {
  useRenderCount('Calendar');
  const v = useTo(open ? 1 : 0, 550, SLIDE);
  const scrim = useTo(open ? 1 : 0, 350);
  const h = useSharedValue(800);
  const sheet = useAnimatedStyle(() => ({transform: [{translateY: 1.05 * h.value * (1 - v.value)}]}));
  const fade = useAnimatedStyle(() => ({opacity: scrim.value}));
  const applyO = useTo(pin && pout ? 1 : 0.4, 200);
  const applyA = useAnimatedStyle(() => ({opacity: applyO.value}));

  const days = monthDays(view, pin, pout, today);
  const atFirst = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  const calN = pin && pout ? Math.round((pout - pin) / 864e5) : 0;
  const hint = !pin ? 'Select check-in date' : !pout ? 'Now select check-out date' : `${short(pin)} → ${short(pout)}`;

  return (
    <>
      <Animated.View pointerEvents={open ? 'auto' : 'none'} style={[styles.scrim, fade]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close date picker" />
      </Animated.View>
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        accessibilityViewIsModal={open}
        importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
        onLayout={e => {
          h.value = e.nativeEvent.layout.height;
        }}
        style={[styles.cal, {paddingBottom: 18 + bottom}, sheet]}>
        <View style={styles.handle} />
        <View style={styles.head}>
          <MonthNav onPress={onPrev} disabled={atFirst} label="Previous month" d="m15 6-6 6 6 6" />
          <Text style={styles.month}>{`${MONL[view.getMonth()]} ${view.getFullYear()}`}</Text>
          <MonthNav onPress={onNext} label="Next month" d="m9 6 6 6-6 6" />
        </View>
        <Text style={styles.hint}>{hint}</Text>
        <View style={styles.wk}>
          {WEEK.map((w, i) => (
            <Text key={i} style={styles.wkD}>
              {w}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {days.map(d => (
            <View key={d.key} style={styles.cell}>
              <Day day={d} onPick={onPick} />
            </View>
          ))}
        </View>
        <Animated.View style={applyA}>
          <PressScale to={0.96} duration={400} onPress={onApply} disabled={!calN} accessibilityRole="button" style={styles.apply}>
            <Text style={styles.applyT}>{calN ? `Apply · ${plural(calN, 'night', 'nights')}` : 'Select dates'}</Text>
          </PressScale>
        </Animated.View>
      </Animated.View>
    </>
  );
}

export default memo(Calendar);

const styles = StyleSheet.create({
  scrim: {...StyleSheet.absoluteFillObject, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.55)'},
  cal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 61,
    paddingTop: 10,
    paddingHorizontal: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.borderStrong,
  },
  handle: {alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12},
  head: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  mnav: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)'},
  month: {fontFamily: fonts.extrabold, fontSize: 16, color: colors.white},
  hint: {fontFamily: fonts.regular, fontSize: 12, color: '#ADA597', textAlign: 'center', marginTop: 6},
  wk: {flexDirection: 'row', marginTop: 12, marginBottom: 6},
  wkD: {flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 10.5, color: '#8E887F'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', rowGap: 4},
  cell: {width: `${100 / 7}%`},
  day: {height: 44, alignItems: 'center', justifyContent: 'center'},
  band: {position: 'absolute', top: 4, bottom: 4, left: 0, right: 0, backgroundColor: 'rgba(241,221,186,0.12)'},
  bandRs: {left: '50%'},
  bandRe: {right: '50%'},
  disc: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'},
  today: {borderWidth: 1, borderColor: 'rgba(241,221,186,0.4)'},
  dayN: {fontFamily: fonts.semibold, fontSize: 13.5, color: '#E6E0D6'},
  dayOff: {color: '#4A4740'},
  daySel: {fontFamily: fonts.extrabold, color: colors.ink},
  apply: {height: 54, marginTop: 14, borderRadius: 16, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center'},
  applyT: {fontFamily: fonts.extrabold, fontSize: 15, color: colors.ink},
});
