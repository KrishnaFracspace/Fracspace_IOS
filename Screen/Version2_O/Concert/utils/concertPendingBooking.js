/**
 * Remembers the booking the user is part-way through paying for.
 *
 * Mirrors ESCAPE_PENDING_TXN, but keeps the booking id as well as the txn id
 * because /bookings/:id/pay needs the booking id to resume, and the reference
 * code is what support will ask for.
 *
 * Every read is wrapped: a corrupt value must return null rather than throw
 * on a screen the user is already anxious on.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'concertPendingBooking';

export async function savePendingBooking(booking) {
  if (!booking || !booking.bookingId) return;
  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({
        bookingId: booking.bookingId,
        referenceCode: booking.referenceCode || null,
        txnId: (booking.payment && booking.payment.payuTxnId) || null,
        concertId: booking.concertId || null,
        totalAmount: booking.totalAmount || 0,
        currency: booking.currency || 'INR',
        savedAt: Date.now(),
      }),
    );
  } catch (e) {}
}

export async function getPendingBooking() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.bookingId ? parsed : null;
  } catch (e) {
    return null;
  }
}

export async function clearPendingBooking() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {}
}
