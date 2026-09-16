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

const CARD_W = Math.min(width * 0.56, 230);
const CARD_H = CARD_W * 1.62;
const TAB_BAR_HEIGHT = 70; // BottomNavi.js bar height
const HIDE_OFFSET = -(CARD_W + 40);
const SCROLL_DELTA = 6;

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
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

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

  const hideCard = useCallback(() => {
    if (hiddenRef.current) return;
    hiddenRef.current = true;
    animateTo(HIDE_OFFSET);
  }, [animateTo]);

  const showCard = useCallback(() => {
    if (!hiddenRef.current) return;
    hiddenRef.current = false;
    animateTo(0);
  }, [animateTo]);

  useEffect(() => {
    if (!scrollY || typeof scrollY.addListener !== 'function') return;

    const id = scrollY.addListener(({ value }) => {
      const dy = value - lastYRef.current;
      lastYRef.current = value;

      if (value <= 10) {
        showCard();
      } else if (dy > SCROLL_DELTA) {
        hideCard();
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
    setPlaying(false);
    navigation.navigate('ConcertDetails', { concert });
  }, [navigation, concert]);

  if (dismissed) return null;

  const paused = !playing || !isFocused || !appActive;
  const bottom = TAB_BAR_HEIGHT + insets.bottom + 12;

  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
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
            <CircleButton name="refresh" onPress={onReplay} />
            <CircleButton
              name={playing ? 'pause' : 'play'}
              onPress={onTogglePlay}
              size={38}
              glyph={19}
            />
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
    justifyContent: 'space-evenly',
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
