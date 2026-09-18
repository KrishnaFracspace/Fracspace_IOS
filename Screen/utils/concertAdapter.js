/**
 * Maps the /api/v1/concerts/section response (contract 1.2) onto the flat
 * shape the concert components already read, so wiring the API needs no
 * component rewrite.
 *
 * Every field falls back to the bundled defaults in concertData.js. That is
 * deliberate: as of the first live response the backend has seeded all the
 * copy but none of the media (heroImage / posterImage are null, video is {},
 * teaser.audioUrl is absent). Falling back per field means the surface keeps
 * working and silently upgrades as the dashboard fills those in.
 */
import { CONCERT as DEFAULTS, CONCERT_THEME } from './concertData';

/** First value that is actually present (null / undefined / '' all skip). */
const pick = (...vals) =>
  vals.find(v => v !== undefined && v !== null && v !== '');

/** An object with at least one key, else null. */
const filled = o =>
  o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length
    ? o
    : null;

/** Booleans default to ON: `{}` from the API means "defaults", not "all off". */
const onUnlessFalse = v => v !== false;

/** `shine` arrives as a boolean today, an object per the contract. */
function normalizeShine(shine) {
  if (shine === true) return { enabled: true };
  if (shine === false) return { enabled: false };
  const o = filled(shine);
  return o ? { enabled: o.enabled !== false, ...o } : { enabled: true };
}

export function normalizeTheme(apiTheme) {
  return { ...CONCERT_THEME, ...(filled(apiTheme) || {}) };
}

function normalizeCities(apiCities) {
  const list = Array.isArray(apiCities) ? apiCities : [];
  const mapped = list
    .filter(c => c && c.id)
    // the server already drops hidden cities; selectable:false means
    // "show but not pickable", so keep it and let the UI disable it
    .map(c => ({
      id: c.id,
      city: pick(c.city, c.venue, ''),
      venue: pick(c.venue, c.city, ''),
      badge: pick(c.status && c.status.label, null),
      statusCode: pick(c.status && c.status.code, null),
      month: pick(c.display && c.display.month, ''),
      day: pick(c.display && c.display.day, ''),
      weekday: pick(c.display && c.display.weekday, ''),
      dateLabel: pick(c.display && c.display.dateLabel, ''),
      startsAt: pick(c.startsAt, null),
      selectable: c.selectable !== false,
      soldOut: !!c.soldOut,
    }));
  return mapped.length ? mapped : DEFAULTS.cities;
}

function normalizeFields(apiFields) {
  const list = Array.isArray(apiFields) ? apiFields : [];
  const byKey = {};
  list.forEach(f => {
    if (f && f.key) byKey[f.key] = f;
  });
  return byKey;
}

export function normalizeConcert(api) {
  if (!api) return null;

  const media = api.media || {};
  const video = filled(media.video) || {};
  const teaser = filled(media.teaser) || {};
  const handoff = filled(media.audioHandoff) || {};
  const branding = api.branding || {};
  const liveTag = branding.liveTag || {};
  const presentsTag = branding.presentsTag || {};
  const card = api.homeCard || {};
  const controls = card.controls || {};
  const details = api.details || {};
  const schedule = details.schedule || {};
  const about = details.about || {};
  const cta = details.cta || {};
  const form = api.interestForm || {};

  const cities = normalizeCities(schedule.cities);

  // The server says defaultCityId always points at a pickable city, but a
  // stale dashboard value would otherwise leave the form holding a cityId
  // that is not in the list, so validate it against what we actually got.
  const configuredDefault = pick(schedule.defaultCityId, DEFAULTS.defaultCityId);
  const defaultIsUsable = cities.some(
    c => c.id === configuredDefault && c.selectable !== false,
  );
  const defaultCityId = defaultIsUsable
    ? configuredDefault
    : (cities.find(c => c.selectable !== false) || cities[0] || {}).id;

  const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length
    ? about.paragraphs
    : DEFAULTS.about;

  return {
    id: pick(api.id, DEFAULTS.id),
    slug: pick(api.slug, null),
    interestRegistered: !!api.interestRegistered,
    shareUrl: pick(api.shareUrl, DEFAULTS.shareUrl),
    deepLinkSub1: pick(api.deepLink && api.deepLink.sub1, api.id),

    // ---- copy ----
    title: pick(api.title, DEFAULTS.title),
    artist: pick(api.artist, DEFAULTS.artist),
    subtitle: pick(api.subtitle, DEFAULTS.subtitle),

    // ---- branding ----
    tag: pick(liveTag.text, DEFAULTS.tag),
    showLiveDot: onUnlessFalse(liveTag.showDot),
    presents: pick(presentsTag.text, DEFAULTS.presents),
    showSparkle: onUnlessFalse(presentsTag.showSparkle),
    shine: normalizeShine(presentsTag.shine),

    // ---- media (backend has not seeded these yet — defaults carry it) ----
    heroImage: pick(media.heroImage, DEFAULTS.heroImage),
    posterImage: pick(media.posterImage, DEFAULTS.posterImage, DEFAULTS.heroImage),
    gallery: Array.isArray(media.gallery) ? media.gallery : [],
    video: {
      url: pick(video.url, DEFAULTS.video.url),
      // backend sends `thumbnail`; the contract calls it `poster`
      poster: pick(video.poster, video.thumbnail, DEFAULTS.video.poster),
      autoPlay: onUnlessFalse(video.autoPlay),
      muted: onUnlessFalse(video.muted),
      loop: onUnlessFalse(video.loop),
    },
    teaser: {
      enabled: onUnlessFalse(teaser.enabled),
      title: pick(teaser.title, DEFAULTS.teaser.title),
      subtitle: pick(teaser.subtitle, DEFAULTS.teaser.subtitle),
      // backend sends `url`; the contract calls it `audioUrl`
      audioUrl: pick(teaser.audioUrl, teaser.url, DEFAULTS.teaser.audioUrl),
      durationSec: pick(teaser.durationSec, DEFAULTS.teaser.durationSec),
    },
    audioHandoff: {
      enabled: onUnlessFalse(handoff.enabled),
      resumeAtCardPosition: onUnlessFalse(handoff.resumeAtCardPosition),
    },

    // ---- home card ----
    homeCard: {
      enabled: onUnlessFalse(card.enabled),
      dismissible: onUnlessFalse(card.dismissible),
      hideOnScroll: onUnlessFalse(card.hideOnScroll),
      peekTab: onUnlessFalse(card.peekTab && card.peekTab.enabled),
      footerLabel: pick(card.footerLabel, 'View Concert Details'),
      controls: {
        replay: onUnlessFalse(controls.replay),
        playPause: onUnlessFalse(controls.playPause),
        mute: onUnlessFalse(controls.mute),
      },
    },

    // ---- details ----
    scheduleTitle: pick(schedule.sectionTitle, 'TOUR SCHEDULE & CITIES'),
    aboutTitle: pick(about.sectionTitle, 'ABOUT THE CONCERT'),
    cities,
    defaultCityId,
    about: paragraphs,

    cta: {
      label: pick(cta.label, DEFAULTS.cta.label),
      registeredLabel: pick(cta.registeredLabel, "You're Interested"),
      note: pick(cta.note, DEFAULTS.cta.note),
    },
    showInterestedCount: onUnlessFalse(cta.showInterestedCount),
    // the label is the display string; the raw number is kept for analytics
    interestedCount: pick(cta.interestedCountLabel, DEFAULTS.interestedCount),
    interestedCountRaw: pick(cta.interestedCount, null),
    interestedNote: pick(cta.interestedNote, DEFAULTS.interestedNote),

    // ---- interest form ----
    interestForm: {
      title: pick(form.title, 'Register your Interest'),
      submitLabel: pick(form.submitLabel, 'Submit'),
      // New flag names; the API still emits the legacy pair derived from
      // these, so prefer the new ones and fall back for older servers.
      // Both now default to OFF.
      requireLogin:
        form.requireLogin !== undefined && form.requireLogin !== null
          ? form.requireLogin === true
          : form.requiresAuth === true,
      allowEdit:
        form.allowEdit !== undefined && form.allowEdit !== null
          ? form.allowEdit === true
          : form.allowReRegister === true,
      fieldsByKey: normalizeFields(form.fields),
      tickets: {
        enabled: onUnlessFalse(form.tickets && form.tickets.enabled),
        title: pick(form.tickets && form.tickets.title, 'Estimated Tickets Needed'),
        note: pick(
          form.tickets && form.tickets.note,
          "You'll get priority window booking link for these tickets.",
        ),
        min: pick(form.tickets && form.tickets.min, 1),
        max: pick(form.tickets && form.tickets.max, 10),
        default: pick(form.tickets && form.tickets.default, 2),
      },
      banner: {
        enabled: onUnlessFalse(form.banner && form.banner.enabled),
        icon: pick(form.banner && form.banner.icon, 'flash'),
        text: pick(
          form.banner && form.banner.text,
          'You will receive instant **WhatsApp & SMS** alerts the minute ticket booking opens.',
        ),
      },
      successSheet: filled(form.successSheet) || {},
      errorToast: filled(form.errorToast) || {},
      prefill: filled(form.prefill) || {},
    },
  };
}

/**
 * Normalizes the whole payload.
 * Returns { enabled, theme, concerts, concert } — `concert` is the one the app
 * should show (deep-linked id if given, else the highest-priority active one).
 */
export function normalizeSection(payload, wantedId) {
  const data = (payload && payload.data) || payload || {};
  const section = data.section || {};

  if (section.enabled === false) {
    return { enabled: false, theme: normalizeTheme(section.theme), concerts: [], concert: null };
  }

  const raw = Array.isArray(data.concerts) ? data.concerts : [];
  const concerts = raw
    .filter(c => c && c.isActive !== false)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    .map(normalizeConcert)
    .filter(Boolean);

  const concert =
    (wantedId && concerts.find(c => c.id === wantedId || c.deepLinkSub1 === wantedId)) ||
    concerts[0] ||
    null;

  return {
    enabled: true,
    theme: normalizeTheme(section.theme),
    contractVersion: data.contractVersion || null,
    concerts,
    concert,
  };
}

export default normalizeSection;
