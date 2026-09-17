import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { CONCERT_THEME as T } from '../utils/concertData';

/**
 * Confirmation state shown in place of the interest form once the
 * registration succeeds. Rendered inside the form's own Modal so there is
 * never a modal-over-modal transition.
 */
export default function ConcertSuccessSheet({
  concert,
  submission,
  copy,
  onClose,
  onGoHome,
}) {
  const tickets = submission?.ticketsNeeded ?? 1;
  const ticketsLabel = `${tickets} ${tickets === 1 ? 'TICKET' : 'TICKETS'}`;

  const eventLabel =
    submission?.eventLabel ||
    [concert?.title, concert?.artist].filter(Boolean).join(' • ');

  return (
    <View>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.closeBtn}>
        <Icon name="close" size={19} color={T.text} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingTop: 20 }}>
        <View style={styles.center}>
          <LinearGradient
            colors={[T.goldLight, T.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkCircle}>
            <Icon name="checkmark" size={52} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.title}>
            {copy?.title || "You're on the list!"}
          </Text>
          <Text style={styles.message}>
            {copy?.message ||
              "Interest Registered. We'll notify you when tickets go live!"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryLabel}>
              {copy?.summaryLabel || 'EVENT & TOUR'}
            </Text>
            <View style={styles.ticketBadge}>
              <Text style={styles.ticketBadgeText}>{ticketsLabel}</Text>
            </View>
          </View>

          <Text style={styles.eventName}>{eventLabel}</Text>
          {!!submission?.city && (
            <Text style={styles.cityName}>{submission.city}</Text>
          )}

          <View style={styles.divider} />

          <View style={styles.phoneRow}>
            <Text style={styles.phoneLabel}>
              {copy?.phoneLabel || 'Registered Phone'}
            </Text>
            <Text style={styles.phoneValue}>
              {submission?.registeredPhone || '-'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onGoHome}
          style={{ marginTop: 22 }}>
          <LinearGradient
            colors={[T.goldLight, T.gold, T.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>
              {copy?.primaryCta?.label || 'Go to Home'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    alignSelf: 'flex-end',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: { alignItems: 'center' },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 22,
  },
  message: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 6,
  },

  summaryCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 26,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 11.5,
    letterSpacing: 1,
  },
  ticketBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.55)',
    backgroundColor: 'rgba(206,143,82,0.12)',
  },
  ticketBadgeText: {
    color: T.gold,
    fontFamily: 'WorkSans-Bold',
    fontSize: 11.5,
    letterSpacing: 0.6,
  },
  eventName: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 16.5,
    lineHeight: 24,
    marginTop: 10,
  },
  cityName: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 14,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneLabel: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
  },
  phoneValue: {
    color: T.gold,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14.5,
  },

  homeBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: '#1A1206',
    fontFamily: 'WorkSans-Bold',
    fontSize: 16,
  },
});
