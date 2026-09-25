import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BOOKING_THEME as T } from '../utils/concertData';

const { height } = Dimensions.get('window');
const HIDDEN_X = 120;

/**
 * The edge tab that opens a user's tickets from the concert screen.
 *
 * Deliberately not in the profile menu: this section is its own world inside
 * the app, and the concert screen is where someone who booked will think to
 * look. It slides out of the way while scrolling, the same way the home
 * card's peek tab does, so it never fights the sticky CTA for attention.
 */
export default function ConcertTicketsTab({ scrollY, onPress }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!scrollY || !scrollY.addListener) return undefined;
    const slide = to =>
      Animated.timing(translateX, {
        toValue: to,
        duration: 220,
        useNativeDriver: true,
      }).start();

    const id = scrollY.addListener(({ value }) => {
      // the gap between the two thresholds stops a jitter loop when the user
      // rests a finger right on the boundary
      setHidden(prev => {
        if (value > 24 && !prev) {
          slide(HIDDEN_X);
          return true;
        }
        if (value < 12 && prev) {
          slide(0);
          return false;
        }
        return prev;
      });
    });
    return () => scrollY.removeListener(id);
  }, [scrollY, translateX]);

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ translateX }] }]}
      pointerEvents={hidden ? 'none' : 'box-none'}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.tab}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 0 }}>
        <Icon name="ticket-outline" size={16} color={T.gold} />
        <Text style={styles.label}>My tickets</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 0,
    top: height * 0.4,
    zIndex: 25,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 13,
    paddingRight: 14,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: 'rgba(18,14,10,0.92)',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: 'rgba(206,143,82,0.45)',
  },
  label: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 12.5,
  },
});
