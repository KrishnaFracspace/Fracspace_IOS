import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AudioWaveform from '../components/AudioWaveform';
import ConcertInterestForm from '../components/ConcertInterestForm';
import ShinyTag from '../components/ShinyTag';
import { CONCERT, CONCERT_THEME as T } from '../utils/concertData';

const { width, height } = Dimensions.get('window');
const HERO_H = Math.round(height * 0.42);
// Status bar colour the rest of the app expects (the navy app header)
const APP_STATUS_BAR_COLOR = '#021265';

export default function ConcertDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const concert = route?.params?.concert || CONCERT;
  const cities = concert?.cities || [];

  // Handed over by the home video card when its sound was on.
  const handoff = route?.params?.handoff;

  // Only resume at the card's timestamp when the teaser is literally the same
  // asset. If the teaser is a separate 30s cut, that offset points somewhere
  // else entirely, so start from the beginning instead.
  const resumeAt = useMemo(() => {
    if (!handoff?.audioPlaying) return 0;
    if (!handoff?.sourceUrl || handoff.sourceUrl !== concert?.teaser?.audioUrl) {
      return 0;
    }
    const duration = concert?.teaser?.durationSec;
    const pos = Number(handoff.positionSec) || 0;
    if (duration && pos >= duration - 0.5) return 0;
    return pos;
  }, [handoff, concert]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const audioRef = useRef(null);
  const pendingSeekRef = useRef(resumeAt);

  const [selectedCityId, setSelectedCityId] = useState(
    concert?.defaultCityId || cities?.[0]?.id,
  );
  const [audioPlaying, setAudioPlaying] = useState(!!handoff?.audioPlaying);
  const [audioProgress, setAudioProgress] = useState(0);
  // Keeps the player silent until it has seeked, so a handoff never blurts
  // out the first half second of the track before jumping.
  const [seekPending, setSeekPending] = useState(resumeAt > 0);
  const [formVisible, setFormVisible] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );

  // Safety net: if onLoad/onSeek never arrive (bad URL, codec issue) release
  // the hold anyway so the teaser is never stuck silently paused.
  useEffect(() => {
    if (!seekPending) return undefined;
    const t = setTimeout(() => setSeekPending(false), 1500);
    return () => clearTimeout(t);
  }, [seekPending]);

  /* ---------------- status bar ---------------- */
  // The translucent/transparent bar is what lets the hero sit under the
  // status bar. On Android those are global flags, so they MUST be put back
  // on blur or every other screen inherits a transparent status bar.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
      return () => {
        if (Platform.OS === 'android') {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor(APP_STATUS_BAR_COLOR);
        }
      };
    }, []),
  );

  /* ---------------- pause audio on blur / background ---------------- */
  useEffect(() => {
    const sub = AppState.addEventListener('change', next =>
      setAppActive(next === 'active'),
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isFocused || !appActive) setAudioPlaying(false);
  }, [isFocused, appActive]);

  /* ---------------- hero: fades out as the sheet covers it ---------------- */
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, HERO_H * 0.75, HERO_H],
    outputRange: [1, 1, 0.25],
    extrapolate: 'clamp',
  });

  const selectedCity = useMemo(
    () => cities.find(c => c.id === selectedCityId) || cities[0],
    [cities, selectedCityId],
  );

  const toggleAudio = useCallback(() => setAudioPlaying(p => !p), []);

  const goHome = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.reset({ index: 0, routes: [{ name: 'BottomNavigations' }] });
  }, [navigation]);

  const onShare = useCallback(() => {
    // TODO: wire real share payload / deep link
    Share.share({
      message: `${concert?.title} — ${concert?.artist}\n${concert?.shareUrl}`,
    }).catch(() => {});
  }, [concert]);

  const bottomBarPad = insets.bottom + 12;

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ---------- fixed hero ---------- */}
      <Animated.View style={[styles.hero, { opacity: heroOpacity }]}>
        <Image
          source={{ uri: concert?.heroImage }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.75)', 'transparent']}
          style={styles.heroTopScrim}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,8,6,0.55)', T.bg]}
          style={styles.heroBottomScrim}
        />
      </Animated.View>

      {/* ---------- scrolling sheet ---------- */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={{ paddingTop: HERO_H - 30  }}>
        <View style={[styles.sheet, { minHeight: height }]}>
          <View style={styles.grabber} />

          <View style={styles.sheetInner}>
            <ShinyTag
              label={concert?.presents || 'FRACSPACE PRESENTS'}
              active={isFocused}
              style={{ marginBottom: 16 }}
            />

            <Text style={styles.title}>{concert?.title}</Text>
            <Text style={styles.title}>{concert?.artist}</Text>
            <Text style={styles.subtitle}>{concert?.subtitle}</Text>

            {/* ---------- teaser audio ---------- */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={toggleAudio}
                 style={styles.teaserCard}
            >
              <View
                style={styles.teaserPlay}>
                <Icon
                  name={audioPlaying ? 'pause' : 'play'}
                  size={20}
                  color="#1A1206"
                  style={{ marginLeft: audioPlaying ? 0 : 2 }}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.teaserTitle}>{concert?.teaser?.title}</Text>
                <Text style={styles.teaserSub}>{concert?.teaser?.subtitle}</Text>
              </View>

              <AudioWaveform playing={audioPlaying} />
            </TouchableOpacity>

            {/* hidden audio player */}
            <Video
              ref={audioRef}
              source={{ uri: concert?.teaser?.audioUrl }}
              paused={
                !audioPlaying || seekPending || !isFocused || !appActive
              }
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
              style={styles.hiddenAudio}
              onLoad={() => {
                if (pendingSeekRef.current > 0) {
                  audioRef.current?.seek(pendingSeekRef.current);
                  pendingSeekRef.current = 0;
                } else {
                  setSeekPending(false);
                }
              }}
              onSeek={() => setSeekPending(false)}
              onProgress={({ currentTime }) => setAudioProgress(currentTime)}
              onEnd={() => {
                setAudioPlaying(false);
                setAudioProgress(0);
                audioRef.current?.seek(0);
              }}
              onError={e => console.log('Teaser audio error:', e)}
            />

            {/* ---------- tour schedule ---------- */}
            <SectionLabel title="TOUR SCHEDULE & CITIES" />

            {cities.map(city => {
              const active = city.id === selectedCityId;
              return (
                <TouchableOpacity
                  key={city.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedCityId(city.id)}
                  style={[styles.cityCard, active && styles.cityCardActive]}>
                  <View style={[styles.dateBox, active && styles.dateBoxActive]}>
                    <Text style={styles.dateMonth}>{city.month}</Text>
                    <Text style={styles.dateDay}>{city.day}</Text>
                    <Text style={styles.dateWeekday}>{city.weekday}</Text>
                  </View>

                  <View style={styles.cityInfo}>
                    <View style={styles.cityTitleRow}>
                      <Text style={styles.cityName}>{city.city}</Text>
                      {!!city.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{city.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cityDate}>{city.dateLabel}</Text>
                    <View style={styles.venueRow}>
                      <Icon name="location-outline" size={13} color={T.gold} />
                      <Text style={styles.venueText}>{city.venue}</Text>
                    </View>
                  </View>

                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <Icon name="checkmark" size={14} color={T.gold} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* ---------- about ---------- */}
            <SectionLabel title="ABOUT THE CONCERT" withRule />

            <View style={styles.aboutCard}>
              {(concert?.about || []).map((para, i) => (
                <Text
                  key={i}
                  style={[styles.aboutText, i > 0 && { marginTop: 14 }]}>
                  {renderRichText(para)}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* spacer so content clears the sticky CTA */}
        <View style={{ height: 150 + bottomBarPad, backgroundColor: T.bg }} />
      </Animated.ScrollView>

      {/* ---------- floating header buttons ---------- */}
      <View style={[styles.headerRow, { top: insets.top + 8 }]} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.85}
          onPress={onShare}>
          <Icon name="share-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ---------- sticky CTA ---------- */}
      <View style={[styles.ctaBar, { paddingBottom: bottomBarPad }]}>
        <LinearGradient
          colors={['transparent', T.bg]}
          style={styles.ctaScrim}
          pointerEvents="none"
        />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setFormVisible(true)}
          style={{ width: '100%' }}>
          <LinearGradient
            colors={
              registered
                ? [T.surfaceActive, T.surface]
                : [T.goldLight, T.gold, T.goldDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.ctaBtn, registered && styles.ctaBtnDone]}>
            <Icon
              name={registered ? 'checkmark-circle' : 'sparkles'}
              size={17}
              color={registered ? T.gold : '#1A1206'}
            />
            <Text
              style={[styles.ctaText, registered && { color: T.gold }]}>
              {registered ? "You're Interested" : concert?.cta?.label}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.ctaNote}>{concert?.cta?.note}</Text>
        <Text style={styles.ctaCount}>
          🔥 {concert?.interestedCount} {concert?.interestedNote}
        </Text>
      </View>

      <ConcertInterestForm
        visible={formVisible}
        concert={concert}
        cities={cities}
        selectedCityId={selectedCity?.id}
        onGoHome={goHome}
        onClose={didSubmit => {
          setFormVisible(false);
          if (didSubmit) setRegistered(true);
        }}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */

function SectionLabel({ title, withRule }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {withRule && <View style={styles.sectionRule} />}
    </View>
  );
}

/** Minimal **bold** support for the hardcoded copy. */
function renderRichText(text = '') {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return (
        <Text key={i} style={styles.aboutBold}>
          {chunk.slice(2, -2)}
        </Text>
      );
    }
    return chunk;
  });
}

/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },

  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H,
    backgroundColor: '#100C09',
  },
  heroTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
  },
  heroBottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },

  headerRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(18,14,10,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#403323',
    marginBottom: 14,
  },
  sheetInner: { paddingHorizontal: 20 },


  title: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
    // lineHeight: 34,
  },
  subtitle: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    marginTop: 10,
  },

  teaserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
  },
  teaserPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserTitle: {
    color: T.text,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14,
  },
  teaserSub: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    marginTop: 3,
  },
  hiddenAudio: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13,
    letterSpacing: 1.1,
  },
  sectionRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginLeft: 14,
  },

  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },
  cityCardActive: {
    borderColor: T.gold,
    backgroundColor: 'rgba(206,143,82,0.08)',
  },
  dateBox: {
    width: 56,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  dateBoxActive: { borderColor: 'rgba(206,143,82,0.55)' },
  dateMonth: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Medium',
    fontSize: 9.5,
    letterSpacing: 0.6,
  },
  dateDay: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
    lineHeight: 25,
  },
  dateWeekday: {
    color: T.textDim,
    fontFamily: 'WorkSans-Medium',
    fontSize: 9.5,
    letterSpacing: 0.6,
  },

  cityInfo: { flex: 1, marginLeft: 14 },
  cityTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cityName: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 17,
  },
  badge: {
    marginLeft: 9,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.6)',
  },
  badgeText: {
    color: T.gold,
    fontFamily: 'WorkSans-Medium',
    fontSize: 10,
  },
  cityDate: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    marginTop: 4,
  },
  venueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  venueText: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    marginLeft: 4,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioActive: { borderColor: T.gold },

  aboutCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 12,
  },
  aboutText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  aboutBold: {
    color: T.text,
    fontFamily: 'WorkSans-SemiBold',
  },

  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: T.bg,
    alignItems: 'center',
  },
  ctaScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -34,
    height: 34,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 8,
  },
  ctaBtnDone: { borderWidth: 1, borderColor: T.gold },
  ctaText: {
    color: '#1A1206',
    fontFamily: 'WorkSans-Bold',
    fontSize: 14,
    marginLeft: 8,
  },
  ctaNote: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 10,
    marginTop: 6,
  },
  ctaCount: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 12,
    marginTop: 5,
  },
});
