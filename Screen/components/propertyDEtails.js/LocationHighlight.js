import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.50;        // Main card width
const CARD_HEIGHT = 300;
const SPACING = 12;

// Distance between card centers (controls overlap)
const SNAP_INTERVAL = width * 0.49;     // ← This is key

export default function LocationHighlights({ highlights }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const count = highlights?.length || 0;

  // Start at the middle set (hooks must run before any early return)
  useEffect(() => {
    if (!count) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: count * SNAP_INTERVAL, animated: false });
    }, 100);
    return () => clearTimeout(t);
  }, [count]);

  if (!count) return null;

  // Triple data for infinite smooth loop
  const loopData = [...highlights, ...highlights, ...highlights];

  // Infinite loop: once scrolling settles, jump back into the middle copy.
  // Done on scroll *end* with strict bounds. Re-centring inside onScroll with
  // <= / >= ping-ponged forever on iOS (each scrollTo emits a scroll event),
  // which kept the list scrolling and blocked every tap on the Property screen.
  const recentre = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const total = SNAP_INTERVAL * count;
    if (x < total) {
      scrollRef.current?.scrollTo({ x: x + total, animated: false });
    } else if (x >= total * 2) {
      scrollRef.current?.scrollTo({ x: x - total, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: (width - SNAP_INTERVAL) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={recentre}
        scrollEventThrottle={16}
      >
        {loopData.map((item, index) => {
          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1.06, 0.95],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [1.5, 0.8, 1.5],
            extrapolate: 'clamp',
          });

          const zIndex = scrollX.interpolate({
            inputRange,
            outputRange: [1, 100, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.cardWrapper,
                {
                  transform: [{ scale }, { translateY }],
                  opacity,
                  zIndex,
                },
              ]}
            >
              <View style={styles.card}>
                <Image resizeMethod="resize"
                  source={{ uri: item.image }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.location && (
                    <Text style={styles.location} numberOfLines={1}>
                      {item.location}
                    </Text>
                  )}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 340,
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  cardWrapper: {
    width: SNAP_INTERVAL,           // Important: width = snap interval
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  labelContainer: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  location: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 3,
  },
});