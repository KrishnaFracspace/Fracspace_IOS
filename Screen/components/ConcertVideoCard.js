import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONCERT, CONCERT_THEME as T } from '../utils/concertData';

const { width } = Dimensions.get('window');

const CARD_W = Math.min(width * 0.4, 230);
const CARD_H = CARD_W * 1.5;
const TAB_BAR_HEIGHT = 50; // BottomNavi.js bar height
const HIDE_OFFSET = -(CARD_W + 40);
const SCROLL_DELTA = 6;

// Peek tab shown on the left edge while the card is tucked away
const TAB_W = 40;
const TAB_H = 150;
// Ignore auto-hide briefly after a manual re-open so leftover momentum
// scrolling cannot slam the card straight back out.
const MANUAL_SHOW_GRACE_MS = 900;

/**
 * Floating promo video card for the home screen.
 * - Pinned bottom-left, always above the bottom tab bar.
 * - Slides out on scroll down, slides back in on scroll up / at top.
 * - Dismissed with the X for the current session only (no persistence).
 * - Pauses when the screen loses focus or the app is backgrounded.
 */
export default function ConcertVideoCard({ scrollY, concert = CONCERT }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const videoRef = useRef(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const tabX = useRef(new Animated.Value(-TAB_W)).current;
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const graceUntilRef = useRef(0);
  // Playback position, handed to ConcertDetails so the teaser can pick up
  // where the card left off.
  const positionRef = useRef(0);
  // Set when navigation (not the user) paused the card, so focus regain
  // resumes it without overriding a deliberate pause.
  const resumeOnFocusRef = useRef(false);

  const [hidden, setHidden] = useState(false);

  const [dismissed, setDismissed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );

  /* ---------------- pause on blur / background ---------------- */
  useEffect(() => {
    const sub = AppState.addEventListener('change', next =>
      setAppActive(next === 'active'),
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isFocused && resumeOnFocusRef.current) {
      resumeOnFocusRef.current = false;
      setPlaying(true);
    }
  }, [isFocused]);

  /* ---------------- slide away on scroll ---------------- */
  const animateTo = useCallback(
    toValue => {
      Animated.timing(translateX, {
        toValue,
        duration: 260,
        useNativeDriver: true,
      }).start();
    },
    [translateX],
  );

  const animateTab = useCallback(
    toValue => {
      Animated.timing(tabX, {
        toValue,
        duration: 220,
        useNativeDriver: true,
      }).start();
    },
    [tabX],
  );

  const hideCard = useCallback(() => {
    if (hiddenRef.current) return;
    hiddenRef.current = true;
    setHidden(true);
    animateTo(HIDE_OFFSET);
    animateTab(0);
  }, [animateTo, animateTab]);

  const showCard = useCallback(
    (manual = false) => {
      if (manual) graceUntilRef.current = Date.now() + MANUAL_SHOW_GRACE_MS;
      if (!hiddenRef.current) return;
      hiddenRef.current = false;
      setHidden(false);
      animateTo(0);
      animateTab(-TAB_W);
    },
    [animateTo, animateTab],
  );

  useEffect(() => {
    if (!scrollY || typeof scrollY.addListener !== 'function') return;

    const id = scrollY.addListener(({ value }) => {
      const dy = value - lastYRef.current;
      lastYRef.current = value;

      if (value <= 10) {
        showCard();
      } else if (dy > SCROLL_DELTA) {
        if (Date.now() >= graceUntilRef.current) hideCard();
      } else if (dy < -SCROLL_DELTA) {
        showCard();
      }
    });

    return () => scrollY.removeListener(id);
  }, [scrollY, hideCard, showCard]);

  /* ---------------- controls ---------------- */
  const onReplay = useCallback(() => {
    videoRef.current?.seek(0);
    setPlaying(true);
  }, []);

  const onTogglePlay = useCallback(() => setPlaying(p => !p), []);
  const onToggleMute = useCallback(() => setMuted(m => !m), []);

  const openDetails = useCallback(() => {
    // Sound was on here, so keep it going on the details screen: pass the
    // position and the source so the teaser can resume rather than restart.
    const handoff =
      !muted && playing
        ? {
            audioPlaying: true,
            positionSec: positionRef.current,
            sourceUrl: concert?.video?.url,
          }
        : null;

    if (playing) resumeOnFocusRef.current = true;
    setPlaying(false);
    navigation.navigate('ConcertDetails', { concert, handoff });
  }, [navigation, concert, muted, playing]);

  if (dismissed) return null;

  const paused = !playing || !isFocused || !appActive;
  const bottom = TAB_BAR_HEIGHT + insets.bottom ;

  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      {/* peek tab — only reachable while the card is tucked away */}
      <Animated.View
        style={[styles.peekWrap, { transform: [{ translateX: tabX }] }]}
        pointerEvents={hidden ? 'auto' : 'none'}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => showCard(true)}
          style={styles.peekTab}>
          <Image
            source={{ uri: concert?.video?.poster || concert?.posterImage }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.peekDot} />
          <Icon name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.cardWrap, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.92}
          onPress={openDetails}>
          <Video
            ref={videoRef}
            source={{ uri: concert?.video?.url }}
            poster={concert?.video?.poster}
            posterResizeMode="cover"
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            repeat
            muted={muted}
            paused={paused}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
            onProgress={({ currentTime }) => {
              positionRef.current = currentTime;
            }}
            progressUpdateInterval={250}
            onError={e => console.log('ConcertVideoCard video error:', e)}
          />

          {/* top scrim + live pill */}
          <LinearGradient
            colors={['rgba(0,0,0,0.65)', 'transparent']}
            style={styles.topScrim}
            pointerEvents="none"
          />
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{concert?.tag || 'LIVE MUSIC'}</Text>
          </View>

          {/* bottom scrim */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
            style={styles.bottomScrim}
            pointerEvents="none"
          />

          {/* controls */}
          <View style={styles.controlsRow}>
            {/* <CircleButton name="refresh" onPress={onReplay} />
            <CircleButton
              name={playing ? 'pause' : 'play'}
              onPress={onTogglePlay}
              size={38}
              glyph={19}
            /> */}
            <CircleButton
              name={muted ? 'volume-mute' : 'volume-high'}
              onPress={onToggleMute}
            />
          </View>

          {/* footer bar */}
          <TouchableOpacity
            style={styles.footerBar}
            activeOpacity={0.8}
            onPress={openDetails}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText} numberOfLines={1}>
              View Concert Details
            </Text>
            <Icon name="chevron-forward" size={16} color={T.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* dismiss (session only) */}
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.85}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => {
            setPlaying(false);
            setDismissed(true);
          }}>
          <Icon name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function CircleButton({ name, onPress, size = 32, glyph = 16 }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={[
        styles.circleBtn,
        { width: size, height: size, borderRadius: size / 2 },
      ]}>
      <Icon name={name} size={glyph} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    zIndex: 40,
    elevation: 40,
  },
  peekWrap: {
    position: 'absolute',
    left: 0,
    bottom: CARD_H / 2 - TAB_H / 2,
  },
  peekTab: {
    width: TAB_W,
    height: TAB_H,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#100C09',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'rgba(206,143,82,0.45)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 2, height: 3 },
      },
      android: { elevation: 8 },
    }),
  },
  peekDot: {
    position: 'absolute',
    top: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.live,
  },
  cardWrap: {
    paddingTop: 16,
    paddingLeft: 14,
    paddingRight: 14,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#100C09',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 10 },
    }),
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  livePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.live,
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
  },
  controlsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
  },
  circleBtn: {
    borderWidth: 1.4,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.gold,
    marginRight: 7,
  },
  footerText: {
    flex: 1,
    color: '#F2EAE2',
    fontFamily: 'WorkSans-Medium',
    fontSize: 11.5,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(20,16,12,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 12 },
    }),
  },
});
