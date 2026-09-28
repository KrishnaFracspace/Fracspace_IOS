import { useCallback } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BOOKING_THEME } from './concertData';

/** What the rest of the app expects the bar to be. */
const APP_STATUS_BAR_COLOR = '#021265';

/**
 * Keeps the status bar dark for the duration of a booking screen.
 *
 * On Android setBarStyle/setBackgroundColor are GLOBAL, not per screen, so
 * anything set here leaks into every other screen unless it is put back on
 * blur - which is exactly how the concert details screen broke once before.
 * Hence the cleanup, and hence this living in one place rather than being
 * copied into four screens.
 *
 * Without it the booking screens show the app's navy bar above a near-black
 * UI, because ConcertCheckout restores navy when it loses focus.
 */
export default function useBookingStatusBar(color = BOOKING_THEME.bg) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(color);
      }
      return () => {
        if (Platform.OS === 'android') {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor(APP_STATUS_BAR_COLOR);
        }
      };
    }, [color]),
  );
}
