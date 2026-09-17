/**
 * Hardcoded concert data for the "Religious India" live-music feature.
 * TODO: replace with API response (GetCarousel / dedicated concert endpoint).
 * All asset URLs below are dummy placeholders — swap with the real CDN links.
 */

export const CONCERT_THEME = {
  gold: '#CE8F52',
  goldLight: '#E7B87E',
  goldDark: '#A96F3A',
  bg: '#0A0806',
  surface: '#15100C',
  surfaceActive: '#1C1510',
  border: '#2E2318',
  borderActive: '#CE8F52',
  text: '#FFFFFF',
  textMuted: '#B9AFA6',
  textDim: '#8A8078',
  live: '#FF3B30',
  overlay: 'rgba(0, 0, 0, 0.83)',
};

export const CONCERT = {
  id: 'religious-india-2026',
  tag: 'Fracspace Exclusive',
  presents: 'FRACSPACE PRESENTS',
  title: 'Religious India',
  artist: 'Harish Sagane & Band',
  subtitle: 'An evening of devotion, rhythm & soul.',
// https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Concert_header.jpeg
  // Hero / poster artwork
  heroImage:
    'https://duixj37yn5405.cloudfront.net/appImages/Concert_header2.jpeg',
  posterImage:
    'https://duixj37yn5405.cloudfront.net/appImages/Concert_header2.jpeg',

  // Vertical promo video shown on the home screen
  video: {
    url: 'https://duixj37yn5405.cloudfront.net/videos/ConcertVideo.mp4',
    poster:
      'https://duixj37yn5405.cloudfront.net/appImages/homepreview.png',
  },

  // 30s audio teaser on the details screen (audio-only playback)
  teaser: {
    title: 'Listen to 30s Teaser',
    subtitle: 'Harish Sagane & Band',
    audioUrl:
      'https://duixj37yn5405.cloudfront.net/videos/ConcertVideo.mp4',
    durationSec: 30,
  },

  cities: [
    {
      id: 'hyd',
      city: 'Hyderabad',
      venue: 'Hyderabad',
      badge: 'Fast Filling',
      month: 'NOV',
      day: '14',
      weekday: 'SAT',
      dateLabel: 'Saturday, 14 November 2026',
    },
    {
      id: 'blr',
      city: 'Bangalore',
      venue: 'Bangalore',
      badge: 'Early Bird',
      month: 'NOV',
      day: '21',
      weekday: 'SAT',
      dateLabel: 'Saturday, 21 November 2026',
    },
  ],

  defaultCityId: 'hyd',

  about: [
    'Experience an immersive evening of Indian devotional music, powerful vocals, and live instrumentation with **Harish Sagane & Band**.',
    'Journey through timeless spiritual compositions reimagined with contemporary orchestral grandeur, soul-stirring flute melodies, and thundering percussions designed for pure transcendence.',
  ],

  cta: {
    label: "I'm Interested",
    note: 'Be first to know when tickets go live.',
  },

  // TODO: comes from backend
  interestedCount: '4.8k',
  interestedNote: 'people already registered interest',

  // Deep link used by the share sheet (wired later)
  shareUrl: 'https://fracspace.onelink.me/OVdL/tqivtrv3',
};

export default CONCERT;
