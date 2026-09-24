/**
 * Money and date formatting for the concert booking screens.
 *
 * Both are hand-rolled because Hermes ships without full Intl: neither
 * toLocaleString('en-IN') nor a timeZone option can be relied on.
 */

/** Asia/Kolkata. The venue's clock, never the phone's. */
export const VENUE_OFFSET_MIN = 330;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/** 1234567 -> "₹12,34,567" (Indian grouping, not thousands). */
export function formatMoney(value, currency = 'INR') {
  const v = Math.round(Number(value) || 0);
  const s = String(Math.abs(v));
  let grouped;
  if (s.length <= 3) {
    grouped = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  return (v < 0 ? '-' : '') + symbol + grouped;
}

/**
 * Shifts a UTC instant into the venue's zone and reads the UTC getters off
 * it, so the device's own timezone can never leak into the result. A 7pm
 * Hyderabad show reads 7pm to someone checking their booking from abroad.
 */
function venueParts(iso, offsetMinutes = VENUE_OFFSET_MIN) {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return null;
  const d = new Date(parsed.getTime() + offsetMinutes * 60000);
  let h = d.getUTCHours();
  const min = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return {
    weekday: WEEKDAYS[d.getUTCDay()],
    day: d.getUTCDate(),
    month: MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
    time: h + ':' + (min < 10 ? '0' + min : min) + ' ' + ampm,
  };
}

/** "Saturday, 14 Nov 2026, 7:00 PM" */
export function formatEventDateTime(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  if (!p) return '';
  return p.weekday + ', ' + p.day + ' ' + p.month + ' ' + p.year + ', ' + p.time;
}

/** "Saturday, 14 Nov, 7:00 PM" - the year dropped for the compact header. */
export function formatEventShort(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  if (!p) return '';
  return p.weekday + ', ' + p.day + ' ' + p.month + ', ' + p.time;
}

/** "7 Nov" - for refund deadlines. */
export function formatShortDate(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  if (!p) return '';
  return p.day + ' ' + p.month;
}

/** Seconds -> "29:03". Never negative. */
export function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m + ':' + (rem < 10 ? '0' + rem : rem);
}
