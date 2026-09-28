import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BOOKING_THEME as T } from '../utils/concertData';

const ADVANCE_MS = 3200;
/** How long a manual swipe holds the auto-advance off. */
const RESUME_AFTER_TOUCH_MS = 6000;

/**
 * The venue photo strip, with the maps link sitting on top of it.
 *
 * Auto-advances, but only while the screen is focused - a timer left running
 * behind a navigated-away screen scrolls a list nobody is looking at and
 * keeps the component mounted in memory. It also yields to the user: a swipe
 * stops the rotation for a few seconds rather than fighting the thumb.
 */
export default function VenueCarousel({ images = [], onOpenMaps, height = 105 }) {
  const scroller = useRef(null);
  const [width, setWidth] = useState(0);
  const index = useRef(0);
  const touchedAt = useRef(0);
  const focused = useRef(false);

  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  const canScroll = list.length > 1;

  const advance = useCallback(() => {
    if (!canScroll || !width) return;
    if (Date.now() - touchedAt.current < RESUME_AFTER_TOUCH_MS) return;
    index.current = (index.current + 1) % list.length;
    scroller.current?.scrollTo({ x: index.current * width, animated: true });
  }, [canScroll, width, list.length]);

  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!canScroll || !width) return undefined;
    const id = setInterval(() => {
      if (focused.current) advance();
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [canScroll, width, advance]);

  return (
    <View
      style={[styles.wrap, { height }]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {list.length ? (
        <ScrollView
          ref={scroller}
          horizontal
          pagingEnabled
          scrollEnabled={canScroll}
          showsHorizontalScrollIndicator={false}
          onTouchStart={() => {
            touchedAt.current = Date.now();
          }}
          onMomentumScrollEnd={e => {
            if (!width) return;
            index.current = Math.round(e.nativeEvent.contentOffset.x / width);
          }}>
          {list.map((uri, i) => (
            <Image
              key={uri + i}
              source={{ uri }}
              style={{ width, height }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Icon name="image-outline" size={20} color={T.textDim} />
        </View>
      )}

      {onOpenMaps ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenMaps}
          style={styles.mapsPill}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="map-outline" size={12} color={T.goldLight} />
          <Text style={styles.mapsText}>Open In Maps</Text>
          <Icon name="chevron-forward" size={11} color={T.goldLight} />
        </TouchableOpacity>
      ) : null}

      {canScroll ? (
        <View style={styles.dots} pointerEvents="none">
          {list.map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#171B24',
  },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mapsPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(8,8,10,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.4)',
  },
  mapsText: {
    color: T.goldLight,
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
  },
  dots: {
    position: 'absolute',
    bottom: 7,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
