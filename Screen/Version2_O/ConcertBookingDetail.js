import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOOKING_THEME as T } from '../utils/concertData';
import useBookingStatusBar from '../utils/useBookingStatusBar';
import { formatEventDateTime, formatMoney } from '../utils/concertFormat';
import {
  CancelConcertBooking,
  GetConcertBooking,
  ResumeConcertPayment,
  classifyBookingError,
} from '../Services/UserApi';
import {
  bookingStatusMeta,
  normalizeBookResponse,
  normalizeBookingRecord,
  normalizeCancelResponse,
} from '../utils/concertBookingAdapter';
import { clearPendingBooking } from '../utils/concertPendingBooking';

const TONE = {
  good: { fg: '#5FBE89', bg: 'rgba(95,190,137,0.14)' },
  warn: { fg: '#E0A85A', bg: 'rgba(224,168,90,0.14)' },
  bad: { fg: '#E0736A', bg: 'rgba(224,115,106,0.14)' },
  muted: { fg: T.textDim, bg: 'rgba(255,255,255,0.06)' },
};

/**
 * One booking, and the two things that can still be done to it: finish paying
 * for it, or cancel it.
 *
 * The row from the list renders immediately and the full record is fetched
 * behind it. That matters for more than speed - the list response omits
 * nothing important, but a pending row is re-checked against PayU when the
 * server serves this endpoint, so the fetch can legitimately change the
 * status under the user.
 */
export default function ConcertBookingDetail({ route, navigation }) {
  useBookingStatusBar();
  const { bookingId, booking: seed } = route.params || {};

  const [booking, setBooking] = useState(seed || null);
  const [loading, setLoading] = useState(!seed);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refund, setRefund] = useState(null);

  // Cancel and resume both move money; neither may run twice.
  const busyRef = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const getToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem('mytoken');
    } catch (e) {
      return null;
    }
  }, []);

  const load = useCallback(async () => {
    const id = bookingId || seed?.bookingId;
    if (!id) {
      setError('This booking could not be found.');
      setLoading(false);
      return;
    }
    try {
      const token = await getToken();
      const res = await GetConcertBooking(id, token);
      if (!mounted.current) return;
      const next = normalizeBookingRecord(res?.data?.data || res?.data);
      if (next) setBooking(next);
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);
      // the seeded row is still worth showing; only a cold load is fatal
      if (!seed) {
        setError(
          e.kind === 'notFound'
            ? 'This booking could not be found.'
            : e.message || 'Could not load this booking.',
        );
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [bookingId, seed, getToken]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------- resume an unfinished payment ---------------- */

  const onResume = async () => {
    if (busyRef.current || !booking?.bookingId) return;
    busyRef.current = true;
    setBusy(true);
    setNotice(null);
    try {
      const token = await getToken();
      const res = await ResumeConcertPayment(booking.bookingId, token);
      const result = normalizeBookResponse(res?.data);

      // /pay checks PayU first, so this means the earlier attempt succeeded
      if (!result.requiresPayU && result.booking?.isConfirmed) {
        await clearPendingBooking();
        if (!mounted.current) return;
        setBooking(result.booking);
        setNotice('That payment had already gone through. Your booking is confirmed.');
        return;
      }
      if (result.canOpenPayU) {
        if (!mounted.current) return;
        navigation.navigate('ConcertPaymentPage', {
          payuHtml: result.payuHtml,
          payuAction: result.payuAction,
          txnId: result.txnId,
          bookingId: result.booking?.bookingId || booking.bookingId,
          referenceCode: result.booking?.referenceCode || booking.referenceCode,
          booking: result.booking,
        });
        return;
      }
      setNotice('We could not reopen the payment. Please try again in a moment.');
    } catch (err) {
      const e = classifyBookingError(err);
      setNotice(
        e.kind === 'network'
          ? 'Could not reach the server. Check your connection.'
          : e.message || 'This booking can no longer be paid for.',
      );
      load();
    } finally {
      if (mounted.current) {
        setBusy(false);
        busyRef.current = false;
      }
    }
  };

  /* ---------------- cancel ---------------- */

  const onCancel = async () => {
    if (busyRef.current || !booking?.bookingId) return;
    busyRef.current = true;
    setBusy(true);
    setNotice(null);
    try {
      const token = await getToken();
      const res = await CancelConcertBooking(booking.bookingId, null, token);
      if (!mounted.current) return;
      const result = normalizeCancelResponse(res?.data);
      setConfirmOpen(false);
      if (result.booking) setBooking(result.booking);
      setRefund(result.refund);
    } catch (err) {
      if (!mounted.current) return;
      const e = classifyBookingError(err);
      setConfirmOpen(false);
      setNotice(e.message || 'This booking could not be cancelled.');
      // a 409 means our copy is stale - the server knows the real state
      if (e.kind === 'conflict' || e.kind === 'notFound') load();
    } finally {
      if (mounted.current) {
        setBusy(false);
        busyRef.current = false;
      }
    }
  };

  /* ---------------- render ---------------- */

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centre]}>
        <ActivityIndicator color={T.gold} size="large" />
      </SafeAreaView>
    );
  }
  if (error || !booking) {
    return (
      <SafeAreaView style={[styles.safe, styles.centre]}>
        <Icon name="alert-circle-outline" size={28} color={T.textDim} />
        <Text style={styles.emptyText}>{error || 'Booking not found.'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const meta = bookingStatusMeta(booking.status);
  const tone = TONE[meta.tone] || TONE.muted;
  const p = booking.payment || {};
  const cur = booking.currency || 'INR';
  const c = booking.cancellation;
  const shownRefund = refund || booking.refund;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.circleBtn}>
          <Icon name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
          <Text style={[styles.statusText, { color: tone.fg }]}>{meta.label}</Text>
        </View>

        {booking.referenceCode ? (
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.refValue}>{booking.referenceCode}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.concert}>{booking.concertTitle || 'Concert'}</Text>
          {booking.city ? (
            <Line icon="location-outline" text={[booking.venue, booking.city].filter(Boolean).join(', ')} />
          ) : null}
          {booking.eventDate ? (
            <Line icon="calendar-outline" text={formatEventDateTime(booking.eventDate)} />
          ) : null}
          {booking.email ? <Line icon="mail-outline" text={booking.email} /> : null}
        </View>

        <View style={styles.card}>
          {booking.items.map(i => (
            <Row
              key={i.ticketTypeId}
              left={i.label + ' × ' + i.quantity}
              right={formatMoney(i.amount, cur)}
            />
          ))}
          <View style={styles.divider} />
          <Row left="Total" right={formatMoney(booking.totalAmount, cur)} strong />
          {p.walletAmount > 0 ? (
            <Row
              left={p.walletApplied ? 'Paid from wallet' : 'Wallet (not yet debited)'}
              right={formatMoney(p.walletAmount, cur)}
              accent
            />
          ) : null}
          {p.payuAmount > 0 ? (
            <Row
              left={p.payuMode ? 'Paid online (' + p.payuMode + ')' : 'Paid online'}
              right={formatMoney(p.payuAmount, cur)}
            />
          ) : null}
          {p.payuTxnId ? (
            <Text style={styles.txn}>Transaction {p.payuTxnId}</Text>
          ) : null}
        </View>

        {shownRefund ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Refund</Text>
            {shownRefund.policyLabel ? (
              <Text style={styles.sub}>{shownRefund.policyLabel}</Text>
            ) : null}
            <View style={styles.divider} />
            <Row
              left="Refund amount"
              right={formatMoney(shownRefund.refundableAmount, cur)}
              strong
            />
            {shownRefund.walletRefundAmount > 0 ? (
              <Row
                left={shownRefund.walletCreditedImmediately ? 'To your wallet (done)' : 'To your wallet'}
                right={formatMoney(shownRefund.walletRefundAmount, cur)}
                accent
              />
            ) : null}
            {shownRefund.payuRefundAmount > 0 ? (
              <Row
                left="Back to your bank"
                right={formatMoney(shownRefund.payuRefundAmount, cur)}
              />
            ) : null}
            {shownRefund.processingFee > 0 ? (
              <Row
                left="Processing fee"
                right={'- ' + formatMoney(shownRefund.processingFee, cur)}
              />
            ) : null}
            {shownRefund.payuRefundEta ? (
              <Text style={styles.sub}>
                Bank refunds usually take {shownRefund.payuRefundEta}.
              </Text>
            ) : null}
          </View>
        ) : null}

        {booking.canCancel && c ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>If you cancel now</Text>
            {c.policyLabel ? <Text style={styles.sub}>{c.policyLabel}</Text> : null}
            <View style={styles.divider} />
            <Row left="You get back" right={formatMoney(c.refundableAmount, cur)} strong />
            <Row left="Refund rate" right={c.refundPercent + '%'} />
            {c.note ? <Text style={styles.sub}>{c.note}</Text> : null}
          </View>
        ) : null}

        {notice ? <Text style={styles.warnText}>{notice}</Text> : null}
      </ScrollView>

      {booking.canResumePayment || booking.canCancel ? (
        <View style={styles.footer}>
          {booking.canResumePayment ? (
            <TouchableOpacity activeOpacity={0.9} disabled={busy} onPress={onResume}>
              <LinearGradient
                colors={[T.goldDark, T.goldLight, T.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.cta, busy && { opacity: 0.6 }]}>
                {busy ? (
                  <ActivityIndicator color="#1A1206" />
                ) : (
                  <Text style={styles.ctaText}>Complete payment</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : null}

          {booking.canCancel ? (
            <TouchableOpacity
              disabled={busy}
              onPress={() => setConfirmOpen(true)}
              style={styles.cancelBtn}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel booking</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* The exact refund, shown before anything is cancelled - these figures
          come from the server's own cancellation block, not from arithmetic
          done here. */}
      <Modal visible={confirmOpen} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Cancel this booking?</Text>
            <Text style={styles.sheetBody}>
              {c?.policyLabel
                ? c.policyLabel + ' — you get ' + (c.refundPercent || 0) + '% back.'
                : 'This cannot be undone.'}
            </Text>

            {c ? (
              <View style={styles.sheetCard}>
                <Row left="Refund amount" right={formatMoney(c.refundableAmount, cur)} strong />
                {c.walletRefundAmount > 0 ? (
                  <Row
                    left="To your wallet"
                    right={formatMoney(c.walletRefundAmount, cur)}
                    accent
                  />
                ) : null}
                {c.payuRefundAmount > 0 ? (
                  <Row left="Back to your bank" right={formatMoney(c.payuRefundAmount, cur)} />
                ) : null}
                {c.processingFee > 0 ? (
                  <Row left="Processing fee" right={'- ' + formatMoney(c.processingFee, cur)} />
                ) : null}
              </View>
            ) : null}

            <TouchableOpacity
              disabled={busy}
              onPress={onCancel}
              style={[styles.destructive, busy && { opacity: 0.6 }]}
              activeOpacity={0.85}>
              {busy ? (
                <ActivityIndicator color="#E0736A" />
              ) : (
                <Text style={styles.destructiveText}>Yes, cancel booking</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              disabled={busy}
              onPress={() => setConfirmOpen(false)}
              style={styles.keepBtn}
              activeOpacity={0.8}>
              <Text style={styles.keepText}>Keep my booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Line({ icon, text }) {
  return (
    <View style={styles.line}>
      <Icon name={icon} size={15} color={T.gold} />
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
  centre: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 17 },
  body: { paddingHorizontal: 22, paddingBottom: 28 },

  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  statusText: { fontFamily: 'WorkSans-SemiBold', fontSize: 12 },

  refCard: {
    backgroundColor: 'rgba(206,143,82,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.4)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  refLabel: {
    color: T.gold,
    fontFamily: 'WorkSans-Regular',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  refValue: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 5,
  },

  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 12,
  },
  cardTitle: { color: T.text, fontFamily: 'WorkSans-SemiBold', fontSize: 14.5 },
  concert: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 17, marginBottom: 6 },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  lineText: {
    flex: 1,
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    marginLeft: 9,
  },
  sub: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 5,
  },
  txn: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    marginTop: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 11,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  rowLeft: { flex: 1, color: T.textMuted, fontFamily: 'WorkSans-Regular', fontSize: 13 },
  rowRight: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 13 },
  rowStrong: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 15 },
  rowAccent: { color: T.gold },

  warnText: {
    color: '#E0A85A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 14,
  },
  emptyText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 14,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  retryText: { color: T.gold, fontFamily: 'WorkSans-SemiBold', fontSize: 13.5 },

  footer: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16 },
  cta: { height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#1A1206', fontFamily: 'WorkSans-Bold', fontSize: 15.5 },
  cancelBtn: { paddingVertical: 15, alignItems: 'center' },
  cancelText: { color: '#E0736A', fontFamily: 'WorkSans-Medium', fontSize: 14 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  sheetTitle: { color: T.text, fontFamily: 'WorkSans-Bold', fontSize: 19 },
  sheetBody: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13.5,
    lineHeight: 21,
    marginTop: 8,
  },
  sheetCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  destructive: {
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(224,115,106,0.5)',
    backgroundColor: 'rgba(224,115,106,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveText: { color: '#E0736A', fontFamily: 'WorkSans-SemiBold', fontSize: 15 },
  keepBtn: { paddingVertical: 14, alignItems: 'center' },
  keepText: { color: T.textMuted, fontFamily: 'WorkSans-Medium', fontSize: 14 },
});
