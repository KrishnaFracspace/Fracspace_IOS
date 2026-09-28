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
/*
 * Paise are shown ONLY when there are any: a price stays clean at 3,999 but a
 * 90% refund of 2 is 1.80 and must not round to 2. Percentage-based refunds
 * make fractional amounts routine, and rounding them up quietly overstates
 * what the user got back.
 *
 * Works in integer paise internally so 0.1 + 0.2 drift never reaches the
 * screen, and non-finite input degrades to zero rather than printing
 * "Infin,ity".
 */
export function formatMoney(value, currency = 'INR') {
  const raw = Number(value);
  const safe = isFinite(raw) ? raw : 0;
  // Math.round(x * 100) alone is wrong at the edges: 1.005 * 100 is
  // 100.49999999999999 in binary floating point and would round down to a
  // rupee. Trimming the noise first makes the half-rupee round up.
  const paise = Math.round(Number((Math.abs(safe) * 100).toFixed(4)));
  const whole = Math.floor(paise / 100);
  const frac = paise % 100;
  const s = String(whole);
  let grouped;
  if (s.length <= 3) {
    grouped = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  if (frac) grouped += '.' + (frac < 10 ? '0' + frac : String(frac));
  const symbol = currency === 'INR' ? '₹' : currency + ' ';
  // a value that rounds to nothing must not print as "-0"
  const sign = paise > 0 && safe < 0 ? '-' : '';
  return sign + symbol + grouped;
}

/**
 * Shifts a UTC instant into the venue's zone and reads the UTC getters off
 * it, so the device's own timezone can never leak into the result. A 7pm
 * Hyderabad show reads 7pm to someone checking their booking from abroad.
 */
function venueParts(iso, offsetMinutes = VENUE_OFFSET_MIN) {
  if (!iso) return null;

  // Only a string can be a bare wall-clock timestamp. Anything else (a Date, an
  // epoch number) keeps the behaviour it always had.
  const raw = typeof iso === 'string' ? iso : null;
  // "2026-11-14T19:00:00" with no Z and no +05:30 is a legal ISO string that
  // Date() reads as DEVICE-local. Adding the venue offset on top of that gives
  // a different day to someone abroad - the exact leak this function exists to
  // prevent. A timestamp with no zone is the venue's own wall clock, so it is
  // read component by component instead of handed to Date().
  const bare = raw === null ? null : /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/.exec(raw);
  if (bare) {
    const y = Number(bare[1]);
    const mo = Number(bare[2]);
    const day = Number(bare[3]);
    const hh = Number(bare[4]);
    const mm = Number(bare[5]);
    const ss = Number(bare[6] || 0);
    // Date.UTC rolls out-of-range components over instead of rejecting them,
    // so month 13 would quietly become January of the next year. new Date()
    // would have returned Invalid Date for the same string, and an obviously
    // broken timestamp should render as nothing, not as a plausible wrong day.
    if (mo < 1 || mo > 12 || day < 1 || day > 31 || hh > 23 || mm > 59 || ss > 59) {
      return null;
    }
    const ms = Date.UTC(y, mo - 1, day, hh, mm, ss);
    if (isNaN(ms) || new Date(ms).getUTCMonth() !== mo - 1) return null;
    return partsFromUtcMs(ms);
  }

  const parsed = new Date(raw === null ? iso : raw);
  if (isNaN(parsed.getTime())) return null;
  return partsFromUtcMs(parsed.getTime() + offsetMinutes * 60000);
}

/** Reads the UTC getters off an already-shifted instant. */
function partsFromUtcMs(ms) {
  const d = new Date(ms);
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

/** "Saturday, Nov 14 2026" - the concert card's date line. */
export function formatEventDayLong(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  if (!p) return '';
  return p.weekday + ', ' + p.month + ' ' + p.day + ' ' + p.year;
}

/** "7:00 PM" on its own. */
export function formatEventTime(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  return p ? p.time : '';
}

/**
 * "25 Sep 2026, 3:05 PM" - when a payment happened.
 *
 * Unlike the event time this is a moment in the user's own life, so it is
 * shown in the venue zone too only because every other timestamp on the
 * screen is: mixing zones on one card is worse than picking the wrong one.
 */
export function formatStamp(iso, offsetMinutes) {
  const p = venueParts(iso, offsetMinutes);
  if (!p) return '';
  return p.day + ' ' + p.month + ' ' + p.year + ', ' + p.time;
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
