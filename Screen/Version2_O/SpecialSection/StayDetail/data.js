// Mock data for Stay Detail (StayDetail.dc.html) until the APIs are wired.
import {images} from '../data';
import {retreats} from '../Stays/data';

// The design's copy is Dreamscape; the other listing cards reuse it with their
// own name / place / rating.
const dreamscape = {
  name: 'Dreamscape Resort & Private Villas',
  short: 'Dreamscape',
  rate: '4.8',
  address: 'Road No. 12, Banjara Hills',
  about:
    'Perched along the Banjara Hills, Dreamscape pairs modernist fractional architecture with private rooms and panoramic city views.',
};

export function stayFor(stayId) {
  const r = retreats.find(s => s.id === stayId);
  if (!r || r.id === 'ds') {
    return dreamscape;
  }
  return {...dreamscape, name: r.name, short: r.name.split(' by ')[0], rate: r.rate, address: r.loc};
}

export const gallery = [
  {img: images.balcony, alt: 'Balcony with city view'},
  {img: images.luxury, alt: 'Deluxe room'},
  {img: images.hilltop, alt: 'Luxury room'},
  {img: images.hero, alt: 'Suite room'},
  {img: images.luxury, alt: 'Interior walkway'},
  {img: images.balcony, alt: 'Hotel exterior at night'},
];

export const suites = [
  {id: 'dlx', name: 'Deluxe Room', spec: '450 sq ft · King Bed', price: 4999, img: images.luxury},
  {id: 'lux', name: 'Luxury Room', spec: '580 sq ft · King', price: 5999, img: images.balcony, badge: 'GUEST CHOICE'},
  {id: 'ste', name: 'Suite Room', spec: '700 sq ft · 2 King', price: 11499, img: images.hilltop},
];

/** Nightly total incl. 5% taxes, as the design computes it. */
export const totalFor = suite => Math.round(suite.price * 1.05);

/** `toLocaleString('en-IN')` grouping (12,074 / 1,20,740) without relying on Intl. */
export function inr(n) {
  const s = String(n);
  if (s.length <= 3) {
    return s;
  }
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
}

// Map pins: (x, y) in the 350×320 map; `c` are the cubic control points of the
// route from the stay at (205, 160).
export const HOME = [205, 160];
export const places = [
  {id: 'gol', name: 'Golconda Fort', short: '4.2 km', dist: '4.2 km · 12m', x: 50, y: 70, c: [170, 160, 120, 120], img: images.hilltop},
  {id: 'kbr', name: 'KBR Park', short: '1.8 km', dist: '1.8 km · 5m', x: 118, y: 240, c: [195, 200, 160, 232], img: images.hero},
  {id: 'jub', name: 'Jubilee Hills', short: '2.1 km', dist: '2.1 km', x: 150, y: 62, c: [205, 120, 185, 85], img: images.balcony},
];

export const booking = {dates: '15–16 Oct', guests: 1};
