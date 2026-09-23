import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { CONCERT_THEME as T } from '../utils/concertData';
import { formatMoney } from '../components/ConcertCheckoutSheet';
import { clearPendingBooking } from '../utils/concertPendingBooking';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/** Asia/Kolkata. The venue's clock, not the phone's. */
const VENUE_OFFSET_MIN = 330;

/**
 * Formats the event time in the VENUE's timezone.
 *
 * Two reasons this is not just new Date(iso).getHours(): Hermes ships without
 * full Intl, so a timeZone option cannot be relied on; and a show starting
 * 19:00 in Hyderabad has to read 19:00 to everyone, not shift because the
 * user happens to be abroad. Reading the UTC getters off a shifted timestamp
 * keeps the device's own zone out of it entirely.
 */
export function formatEventDate(iso, offsetMinutes = VENUE_OFFSET_MIN) {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return '';
  const d = new Date(parsed.getTime() + offsetMinutes * 60000);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const mm = m < 10 ? '0' + m : String(m);
  return (
    DAYS[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] +
    ' ' + d.getUTCFullYear() + '  •  ' + h + ':' + mm + ' ' + ampm
  );
}

export default function ConcertBookingSuccess({ route, navigation }) {
  const { booking, concert } = route.params || {};
  const payment = booking?.payment || {};
  const currency = booking?.currency || 'INR';

  useEffect(() => {
    clearPendingBooking();
  }, []);

  const goHome = () => {
    navigation.navigate('BottomNavigations', { screen: 'Home' });
  };

  // There is nothing to go back to: the payment page was replaced, and the
  // booking is already paid for.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goHome();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.tickWrap}>
          <LinearGradient
            colors={[T.goldLight, T.gold, T.goldDark]}
            style={styles.tick}>
            <Icon name="checkmark" size={34} color="#1A1206" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>You're going!</Text>
        <Text style={styles.subtitle}>
          {booking?.tickets || 0} ticket{booking?.tickets === 1 ? '' : 's'} booked
          {booking?.concertTitle || concert?.title
            ? ' for ' + (booking?.concertTitle || concert?.title)
            : ''}
        </Text>

        {booking?.referenceCode ? (
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.refValue}>{booking.referenceCode}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {booking?.city ? (
            <Line icon="location-outline" text={booking.venue ? booking.venue + ', ' + booking.city : booking.city} />
          ) : null}
          {booking?.eventDate ? (
            <Line icon="calendar-outline" text={formatEventDate(booking.eventDate)} />
          ) : null}
          {booking?.email ? <Line icon="mail-outline" text={booking.email} /> : null}
        </View>

        {booking?.items?.length ? (
          <View style={styles.card}>
            {booking.items.map(i => (
              <Row
                key={i.ticketTypeId}
                left={i.label + ' × ' + i.quantity}
                right={formatMoney(i.amount, currency)}
              />
            ))}
            <View style={styles.divider} />
            <Row left="Total" right={formatMoney(booking.totalAmount, currency)} strong />
            {payment.walletAmount > 0 ? (
              <Row
                left="Paid from wallet"
                right={formatMoney(payment.walletAmount, currency)}
                accent
              />
            ) : null}
            {payment.payuAmount > 0 ? (
              <Row
                left={payment.payuMode ? 'Paid online (' + payment.payuMode + ')' : 'Paid online'}
                right={formatMoney(payment.payuAmount, currency)}
              />
            ) : null}
          </View>
        ) : null}

        <Text style={styles.note}>
          Your confirmation is on its way by email and WhatsApp. Keep your
          booking reference handy at the venue.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} onPress={goHome}>
          <LinearGradient
            colors={[T.goldLight, T.gold, T.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}>
            <Text style={styles.ctaText}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Line({ icon, text }) {
  return (
    <View style={styles.line}>
      <Icon name={icon} size={16} color={T.gold} />
      <Text style={styles.lineText}>{text}</Text>
    </View>
  );
}

function Row({ left, right, strong, accent }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLeft, strong && styles.rowStrong, accent && styles.rowAccent]}>
        {left}
      </Text>
      <Text style={[styles.rowRight, strong && styles.rowStrong, accent && styles.rowAccent]}>
        {right}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  body: { paddingHorizontal: 22, paddingTop: 34, paddingBottom: 24 },
  tickWrap: { alignItems: 'center' },
  tick: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  refCard: {
    backgroundColor: 'rgba(206,143,82,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.4)',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  refLabel: {
    color: T.gold,
    fontFamily: 'WorkSans-Regular',
    fontSize: 10.5,
    letterSpacing: 1.2,
  },
  refValue: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 18,
    letterSpacing: 0.6,
    marginTop: 6,
  },
  card: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  lineText: {
    flex: 1,
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    marginLeft: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLeft: { color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 13 },
  rowRight: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  rowStrong: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 14.5 },
  rowAccent: { color: T.gold },
  note: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 22,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
  },
  cta: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
});
