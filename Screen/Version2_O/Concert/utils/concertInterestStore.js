/**
 * Remembers which concerts this device has already registered interest for.
 *
 * Needed because "Go to Home" pops ConcertDetails off the stack, so the
 * screen's own `registered` state dies with it, and the concert object the
 * home card passes down still carries the pre-registration
 * `interestRegistered: false`. Without a local marker the CTA comes back
 * enabled on re-entry, and tapping it can only produce a 409.
 *
 * The server remains the source of truth; this only fills the window between
 * registering and the next successful /concerts/section fetch. It also
 * survives an app restart, which the in-memory state does not.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'concertInterestRegistered';

const readIds = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // corrupt or unreadable storage must never break the screen
    return [];
  }
};

export const markConcertRegistered = async concertId => {
  if (!concertId) return;
  try {
    const ids = await readIds();
    if (ids.includes(concertId)) return;
    ids.push(concertId);
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  } catch (e) {
    console.log('markConcertRegistered failed:', e?.message);
  }
};

export const hasRegisteredConcert = async concertId => {
  if (!concertId) return false;
  const ids = await readIds();
  return ids.includes(concertId);
};

export default { markConcertRegistered, hasRegisteredConcert };
