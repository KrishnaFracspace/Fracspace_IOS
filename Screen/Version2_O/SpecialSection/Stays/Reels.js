// "See it before you stay": the stacked video-tour deck (`.deck`, `.rc`,
// `.rc-ui`, `.thumb` in Stays.dc.html).
import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {colors, fonts, ls} from '../theme';
import {E, PressScale, enterUp, useReducedMotion, useToggle} from '../anim';
import {Ripple} from './bits';
import {MuteIcon, PlayPauseIcon} from './icons';
import {reels} from './data';

const CARD_W = 300;
const CARD_H = 430;
// .rc.p0 / .p1 / .p2; `dim` stands in for filter: brightness(.5) / (.3)
const POS = [
  {x: 0, s: 1, r: 0, dim: 0},
  {x: 30, s: 0.93, r: 3, dim: 0.5},
  {x: 54, s: 0.86, r: 6, dim: 0.7},
];
const ZOOM_MS = 9000;

/** One card of the deck; transitions between stack positions with the spring. */
function DeckCard({img, pos, hold}) {
  const reduced = useReducedMotion();
  const tx = useSharedValue(POS[pos].x);
  const sc = useSharedValue(POS[pos].s);
  const rot = useSharedValue(POS[pos].r);
  const dim = useSharedValue(POS[pos].dim);
  const zoom = useSharedValue(0); // `zoom 9s ease-out both` progress, p0 only

  useEffect(() => {
    const to = POS[pos];
    const move = v => (reduced ? v : withTiming(v, {duration: 750, easing: E.spring}));
    tx.value = move(to.x);
    sc.value = move(to.s);
    rot.value = move(to.r);
    dim.value = reduced ? to.dim : withTiming(to.dim, {duration: 600, easing: E.ease});
  }, [pos, reduced, tx, sc, rot, dim]);

  useEffect(() => {
    cancelAnimation(zoom);
    if (pos !== 0) {
      zoom.value = 0;
    } else if (!hold && !reduced) {
      // `.hold` pauses the zoom; resuming carries on from where it stopped.
      zoom.value = withTiming(1, {duration: (1 - zoom.value) * ZOOM_MS, easing: E.linear});
    }
  }, [pos, hold, reduced, zoom]);

  const card = useAnimatedStyle(() => ({
    transform: [{translateX: tx.value}, {scale: sc.value}, {rotate: `${rot.value}deg`}],
  }));
  const pic = useAnimatedStyle(() => ({
    transform: [{scale: pos === 0 ? 1.02 + 0.18 * E.easeOut(zoom.value) : 1}],
  }), [pos]);
  const shade = useAnimatedStyle(() => ({opacity: dim.value}));

  return (
    <Animated.View style={[styles.rc, {zIndex: 3 - pos}, card]}>
      <View style={styles.rcClip}>
        <Animated.Image source={img} style={[styles.fill, pic]} resizeMode="cover" />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.26, 0.55, 1]}
        />
        <Animated.View style={[StyleSheet.absoluteFill, styles.dim, shade]} />
      </View>
    </Animated.View>
  );
}

/** `.seg`: progress bar for one reel (width transition .12s linear). */
function Seg({fill}) {
  const v = useSharedValue(fill);
  useEffect(() => {
    v.value = withTiming(fill, {duration: 120, easing: E.linear});
  }, [fill, v]);
  const a = useAnimatedStyle(() => ({transform: [{scaleX: v.value}]}));
  return (
    <View style={styles.seg}>
      <Animated.View style={[styles.segFill, a]} />
    </View>
  );
}

/** `.bigplay`: shown while paused (opacity .3s, transform .45s spring). */
function BigPlay({playing, onPress}) {
  const op = useToggle(!playing, {duration: 300, easing: E.ease});
  const sc = useToggle(!playing, {duration: 450, easing: E.spring});
  const a = useAnimatedStyle(() => ({opacity: op.value, transform: [{scale: 0.6 + 0.4 * sc.value}]}));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause video' : 'Play video'}
      style={styles.bigplayHit}>
      <Animated.View style={[styles.bigplay, a]}>
        <PlayPauseIcon playing={playing} />
        <Ripple duration={2200} color={colors.whiteA(0.6)} inset={1} />
      </Animated.View>
    </Pressable>
  );
}

/** `.thumb` under the deck. */
function Thumb({reel, on, onPress}) {
  const v = useToggle(on, {duration: 300, easing: E.ease});
  const a = useAnimatedStyle(() => ({
    borderColor: interpolateColor(v.value, [0, 1], [colors.borderStrong, colors.gold]),
    backgroundColor: interpolateColor(v.value, [0, 1], [colors.card, '#1C1B20']),
  }));
  return (
    <PressScale to={0.94} duration={400} onPress={onPress} accessibilityLabel={`Play ${reel.title}`} style={styles.thumbWrap}>
      <Animated.View style={[styles.thumb, a]}>
        <Image source={reel.img} style={styles.thumbImg} />
        <View style={styles.thumbText}>
          <Text style={styles.thumbTitle} numberOfLines={1}>
            {reel.title}
          </Text>
          <Text style={styles.thumbDur}>{reel.dur}</Text>
        </View>
      </Animated.View>
    </PressScale>
  );
}

/** The deck + thumbs. Reports the current position ("1 / 3") via onPos. */
export default function Reels({onBook, onPos}) {
  const focused = useIsFocused();
  const [reel, setReel] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [flipN, setFlipN] = useState(0);
  const n = reels.length;

  const goReel = i => {
    setReel(i);
    setT(0);
    setFlipN(f => f + 1);
  };

  // 100ms tick like the design; advances to the next reel at its duration.
  useEffect(() => {
    if (!playing || !focused) {
      return;
    }
    const id = setInterval(() => setT(x => x + 0.1), 100);
    return () => clearInterval(id);
  }, [playing, focused]);
  useEffect(() => {
    if (t >= reels[reel].secs) {
      goReel((reel + 1) % n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);
  useEffect(() => {
    onPos?.(`${reel + 1} / ${n}`);
  }, [reel, n, onPos]);

  const cur = reels[reel];
  const time = `0:${String(Math.floor(t)).padStart(2, '0')} / ${cur.dur}`;
  const cap = i => enterUp(i, {step: 80, duration: 700, dy: 16});

  return (
    <View style={styles.wrap}>
      <View style={styles.deck}>
        {reels.map((v, i) => (
          <DeckCard key={v.id} img={v.img} pos={(i - reel + n) % n} hold={!playing} />
        ))}
        <View style={styles.ui}>
          <View style={styles.segs}>
            {reels.map((v, i) => (
              <Seg key={v.id} fill={i < reel ? 1 : i === reel ? Math.min(1, t / v.secs) : 0} />
            ))}
          </View>
          <View style={styles.head}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>d</Text>
            </View>
            <View style={styles.headText}>
              <Text style={styles.brand}>Dreamscape Stays</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
            <PressScale
              to={0.85}
              duration={350}
              onPress={() => setMuted(m => !m)}
              accessibilityLabel={muted ? 'Unmute' : 'Mute'}
              style={styles.rbtn}>
              <MuteIcon muted={muted} />
            </PressScale>
          </View>
          <Pressable
            style={[styles.tapz, styles.left0]}
            onPress={() => goReel((reel + n - 1) % n)}
            accessibilityLabel="Previous video"
          />
          <Pressable
            style={[styles.tapz, styles.right0]}
            onPress={() => goReel((reel + 1) % n)}
            accessibilityLabel="Next video"
          />
          <BigPlay playing={playing} onPress={() => setPlaying(p => !p)} />
          <View key={flipN} style={styles.cap} pointerEvents="box-none">
            <Animated.Text entering={cap(0)} style={styles.capLoc}>
              {cur.loc.toUpperCase()}
            </Animated.Text>
            <Animated.Text entering={cap(1)} style={styles.capTitle}>
              {cur.title}
            </Animated.Text>
            <Animated.View entering={cap(2)}>
              <PressScale to={0.92} duration={400} onPress={() => onBook(cur)} style={styles.watch}>
                <Text style={styles.watchText}>Book this stay</Text>
                <Text style={styles.watchText}>→</Text>
              </PressScale>
            </Animated.View>
          </View>
        </View>
      </View>
      <View style={styles.thumbs}>
        {reels.map((v, i) => (
          <Thumb key={v.id} reel={v} on={i === reel} onPress={() => goReel(i)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 20},
  deck: {height: 440},
  fill: {width: '100%', height: '100%'},
  rc: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: CARD_W,
    height: CARD_H,
    borderRadius: 30,
    transformOrigin: 'left center',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 25,
    shadowOffset: {width: 0, height: 24},
    backgroundColor: colors.card,
  },
  rcClip: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.whiteA(0.1),
    backgroundColor: colors.card,
  },
  dim: {backgroundColor: '#000'},
  ui: {position: 'absolute', left: 0, top: 0, width: CARD_W, height: CARD_H, zIndex: 4, borderRadius: 30, overflow: 'hidden'},
  segs: {position: 'absolute', top: 12, left: 14, right: 14, flexDirection: 'row', gap: 5, zIndex: 3},
  seg: {flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.whiteA(0.3), overflow: 'hidden'},
  segFill: {height: '100%', width: '100%', backgroundColor: '#fff', transformOrigin: 'left center'},
  head: {position: 'absolute', top: 26, left: 14, right: 10, flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 3},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.goldA(0.16),
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  avatarText: {fontFamily: fonts.serif, fontSize: 18, color: colors.gold},
  headText: {flex: 1},
  brand: {fontFamily: fonts.bold, fontSize: 13, color: '#fff'},
  time: {fontFamily: fonts.regular, fontSize: 11, color: '#E6E0D6'},
  rbtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: colors.whiteA(0.25),
  },
  left0: {left: 0},
  right0: {right: 0},
  tapz: {position: 'absolute', top: 70, bottom: 120, width: '50%', zIndex: 2},
  bigplayHit: {position: 'absolute', left: CARD_W / 2 - 32, top: CARD_H / 2 - 32, width: 64, height: 64, zIndex: 3},
  bigplay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,10,12,0.45)',
    borderWidth: 1,
    borderColor: colors.whiteA(0.4),
  },
  cap: {position: 'absolute', left: 18, right: 18, bottom: 18, alignItems: 'flex-start', gap: 8, zIndex: 3},
  capLoc: {fontFamily: fonts.extrabold, fontSize: 10.5, letterSpacing: ls(0.14, 10.5), color: colors.gold},
  capTitle: {fontFamily: fonts.serif, fontSize: 34, lineHeight: 34, color: '#fff'},
  watch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  watchText: {fontFamily: fonts.extrabold, fontSize: 13, color: colors.ink},
  thumbs: {flexDirection: 'row', gap: 10, marginTop: 14},
  thumbWrap: {flex: 1, minWidth: 0},
  thumb: {flexDirection: 'row', alignItems: 'center', gap: 8, padding: 6, borderRadius: 16, borderWidth: 1.5},
  thumbImg: {width: 34, height: 44, borderRadius: 10},
  thumbText: {flex: 1, minWidth: 0, gap: 2},
  thumbTitle: {fontFamily: fonts.bold, fontSize: 12, color: '#fff'},
  thumbDur: {fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted},
});
