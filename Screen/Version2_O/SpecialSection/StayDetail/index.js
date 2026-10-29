// Stay Detail (StayDetail.dc.html): hero gallery, suites, amenities, good to
// know, nearby map, Reserve bar with the "Room held" sheet, policy sheet.
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fonts, ls} from '../theme';
import {E, LoopGate, Reveal, RevealScope, ViewportGate, cssAngle, useLinger} from '../anim';
import {BackIcon, GlassButton, Grain} from '../HubBits';
import {StarIcon} from '../Stays/icons';
import {CheckIcon, ShareIcon, useLazy, useTo} from './bits';
import Hero from './Hero';
import Suites from './Suites';
import Amenities from './Amenities';
import GoodToKnow from './GoodToKnow';
import Nearby from './Nearby';
import BookingBar from './BookingBar';
import PolicySheet from './PolicySheet';
import {useFirstFrame, useJsFps, useRenderCount} from '../perf';
import {booking, inr, stayFor, suites, totalFor} from './data';

const CARD = cssAngle(160);
const clamp01 = v => {
  'worklet';
  return Math.min(1, Math.max(0, v));
};

/** `.mh`: compact header that fades in between 330 and 400px of scroll. */
function MiniHeader({scrollY, inset, stay, suiteName, totalLabel, onBack, onShare}) {
  useRenderCount('MiniHeader');
  const [on, setOn] = useState(false);
  useAnimatedReaction(
    () => scrollY.value > 330,
    (now, was) => {
      if (now !== was) {
        runOnJS(setOn)(now);
      }
    },
  );
  const a = useAnimatedStyle(() => {
    const p = clamp01((scrollY.value - 330) / 70);
    return {opacity: p, transform: [{translateY: -8 * (1 - p)}]};
  });
  return (
    <Animated.View pointerEvents={on ? 'box-none' : 'none'} style={[styles.mh, {paddingTop: inset, height: 62 + inset}, a]}>
      <GlassButton size={40} label="Back to stays" onPress={onBack}>
        <BackIcon />
      </GlassButton>
      <View style={styles.mhCopy}>
        <Text style={styles.mhTitle} numberOfLines={1}>
          {stay.name}
        </Text>
        <Text style={styles.mhSub} numberOfLines={1}>
          {suiteName} · ₹{totalLabel}/night
        </Text>
      </View>
      <GlassButton size={40} label="Share stay" onPress={onShare}>
        <ShareIcon size={18} />
      </GlassButton>
    </Animated.View>
  );
}

/** `.toast`: drops in (.5s spring) with opacity .25s. */
function Toast({show, top}) {
  const y = useTo(show ? 0 : -20, 500, E.spring);
  const o = useTo(show ? 1 : 0, 250);
  const a = useAnimatedStyle(() => ({opacity: o.value, transform: [{translateY: y.value}]}));
  return (
    <View pointerEvents="none" style={[styles.toastRow, {top}]}>
      <Animated.View accessibilityLiveRegion="polite" style={[styles.toast, a]}>
        <CheckIcon color={colors.ink} />
        <Text style={styles.toastText}>Link copied</Text>
      </Animated.View>
    </View>
  );
}

/**
 * Mounts the sections below the fold one per frame after the first paint, so
 * opening Stay Detail paints the hero, suites and Reserve bar first.
 */
const DEFERRED = 3;
function useStage() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= DEFERRED) {
      return;
    }
    const id = requestAnimationFrame(() => setStage(stage + 1));
    return () => cancelAnimationFrame(id);
  }, [stage]);
  return stage;
}

export default function StayDetail({navigation, route}) {
  const stayId = route?.params?.stayId;
  const stay = stayFor(stayId);
  const {height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  useRenderCount('StayDetail');
  useFirstFrame('StayDetail');
  useJsFps('StayDetail', isFocused);

  const [img, setImg] = useState(0);
  const [suite, setSuite] = useState('lux');
  const [phase, setPhase] = useState('idle');
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [policyMounted, policyShown] = useLazy(policy);
  // The page's loops pause once the policy sheet has slid over it (.6s).
  const uncovered = useLinger(!policy, 600);
  const stage = useStage();
  const t1 = useRef(null);
  const t2 = useRef(null);
  useEffect(
    () => () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
    },
    [],
  );

  const contentRef = useRef(null);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const cur = suites.find(s => s.id === suite);
  const total = totalFor(cur);
  const totalLabel = inr(total);

  const back = useCallback(
    () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Stays')),
    [navigation],
  );
  const share = useCallback(() => {
    clearTimeout(t2.current);
    setToast(true);
    t2.current = setTimeout(() => setToast(false), 1800);
  }, []);
  const pickSuite = useCallback(id => {
    clearTimeout(t1.current);
    setSuite(id);
    setPhase('idle');
    setSheet(false);
  }, []);
  const reserve = useCallback(() => {
    if (phase === 'loading') {
      return;
    }
    if (phase === 'done') {
      setSheet(true);
      return;
    }
    setPhase('loading');
    t1.current = setTimeout(() => {
      setPhase('done');
      setSheet(true);
    }, 1200);
  }, [phase]);
  const closeSheet = useCallback(() => setSheet(false), []);
  const openPolicy = useCallback(() => setPolicy(true), []);
  const closePolicy = useCallback(() => setPolicy(false), []);
  const pay = useCallback(
    () =>
      navigation.navigate('StayReview', {
        stayId,
        suiteId: cur.id,
        suiteName: cur.name,
        price: cur.price,
        total,
        dates: booking.dates,
        guests: booking.guests,
      }),
    [navigation, stayId, cur, total],
  );

  // Android back closes the policy, then the sheet, before leaving the screen.
  useEffect(() => {
    if (!policy && !sheet) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (policy) {
        setPolicy(false);
      } else {
        setSheet(false);
      }
      return true;
    });
    return () => sub.remove();
  }, [policy, sheet]);

  const top = Math.max(20, insets.top + 8);
  const barBottom = Math.max(14, insets.bottom - 18);

  return (
    <View style={styles.page}>
      <LoopGate active={isFocused && uncovered}>
        <RevealScope scrollY={scrollY} contentRef={contentRef} viewportH={height}>
          <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <View ref={contentRef} collapsable={false}>
              <Hero img={img} setImg={setImg} scrollY={scrollY} top={top} onBack={back} onShare={share} />
              <View style={[styles.body, {paddingBottom: 150 + barBottom - 14}]}>
                <Reveal style={styles.titleBlock}>
                  <Text style={styles.h1}>{stay.name}</Text>
                  <View style={styles.rateRow}>
                    <StarIcon size={15} color="#F1A23B" />
                    <Text style={styles.rate}>{stay.rate}</Text>
                    <Text style={styles.addr}>{stay.address}</Text>
                  </View>
                </Reveal>
                <Reveal style={styles.cardWrap}>
                  <LinearGradient colors={['#17161A', '#111114']} start={CARD.start} end={CARD.end} style={styles.card}>
                    <Text style={styles.aboutTitle}>About the {stay.short}</Text>
                    <Text style={styles.about}>{stay.about}</Text>
                  </LinearGradient>
                </Reveal>
                <ViewportGate>
                  <Suites suite={suite} onPick={pickSuite} />
                </ViewportGate>
                {stage >= 1 ? (
                  <ViewportGate>
                    <Amenities />
                  </ViewportGate>
                ) : null}
                {stage >= 2 ? (
                  <ViewportGate>
                    <GoodToKnow onOpenPolicy={openPolicy} />
                  </ViewportGate>
                ) : null}
                {stage >= 3 ? (
                  <ViewportGate>
                    <Nearby stay={stay} />
                  </ViewportGate>
                ) : null}
              </View>
            </View>
          </Animated.ScrollView>
        </RevealScope>
        <MiniHeader
          scrollY={scrollY}
          inset={insets.top}
          stay={stay}
          suiteName={cur.name}
          totalLabel={totalLabel}
          onBack={back}
          onShare={share}
        />
        <BookingBar
          bottom={barBottom}
          phase={phase}
          sheet={sheet}
          suiteName={cur.name}
          stayShort={stay.short}
          totalLabel={totalLabel}
          onReserve={reserve}
          onCloseSheet={closeSheet}
          onPay={pay}
        />
        {policyMounted ? (
          <PolicySheet open={policyShown} onClose={closePolicy} stayName={stay.name} insets={insets} />
        ) : null}
        <Toast show={toast} top={top + 56} />
        <Grain opacity={0.07} />
      </LoopGate>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.ground},
  body: {paddingTop: 22, paddingHorizontal: 20, backgroundColor: colors.ground},
  titleBlock: {gap: 8},
  h1: {fontFamily: fonts.bold, fontSize: 22, letterSpacing: ls(-0.01, 22), color: '#fff'},
  rateRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  rate: {fontFamily: fonts.bold, fontSize: 13, color: '#fff'},
  addr: {fontFamily: fonts.regular, fontSize: 13, color: colors.muted, flexShrink: 1},
  cardWrap: {marginTop: 20},
  card: {padding: 18, borderRadius: 24, borderWidth: 1, borderColor: colors.borderStrong},
  aboutTitle: {fontFamily: fonts.bold, fontSize: 17, color: '#fff', marginBottom: 8},
  about: {fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.65, color: colors.soft},
  mh: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(10,10,12,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    zIndex: 30,
  },
  mhCopy: {flex: 1, minWidth: 0},
  mhTitle: {fontFamily: fonts.bold, fontSize: 14, color: colors.cream},
  mhSub: {fontFamily: fonts.regular, fontSize: 11, color: colors.muted},
  toastRow: {position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 50, elevation: 50},
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
});
