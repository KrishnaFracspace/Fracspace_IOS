// Mock catalogue, address and helpers for the IVA Shop (IvaShopV2.dc.html)
// until the shop has an API. Products without a photo show the IVA tile.
import {images} from '../data';

// "In the box" for the kits. The design's item photos are artifact blobs, so
// these show the IVA tile until real photos exist.
const INSIDE = [
  {name: 'Pure Kashi Vibhuti & Sandalwood paste'},
  {name: 'Sacred Kumkum & Pasupu'},
  {name: 'Natural Cotton Wicks & Pure Camphor'},
  {name: 'Premium Fragrant Agarbatti'},
  {name: 'Sealed Holy Gangajal'},
];

export const products = [
  {
    id: 'blessed',
    name: 'Blessed Kit',
    price: 1499,
    img: images.blessedKit,
    cat: 'SIGNATURE KIT',
    tag: 'Bring home the divine grace of Kashi',
    desc: 'A premium all-in-one pooja kit for modern Indian homes — thoughtfully crafted with intention to bring calm, clarity and devotion to your everyday rituals.',
    inside: INSIDE,
  },
  {
    id: 'yatra',
    name: 'Yatra Kit',
    price: 199,
    img: images.yatraKit,
    cat: 'TRAVEL KIT',
    tag: 'Your ritual, wherever you go',
    desc: 'A compact kit with the essentials for a quick pooja on the move — light enough for every bag and every journey.',
    inside: [],
  },
  {
    id: 'lakshmi',
    name: 'Shree Mahalakshmi Pooja Samagri',
    price: 699,
    img: null,
    soldOut: true,
    cat: 'POOJA SAMAGRI',
    tag: 'Complete samagri for Lakshmi pooja',
    desc: 'Everything you need for Lakshmi pooja, sourced and packed with care.',
    inside: [],
  },
  {
    id: 'shiva',
    name: 'Shree Shiva Pooja Samagri',
    price: 699,
    img: images.shivaKit,
    soldOut: true,
    cat: 'POOJA SAMAGRI',
    tag: 'Do your daily abhishekam with love & devotion',
    desc: 'Everything you need for Shiva abhishekam, sourced and packed with care.',
    inside: INSIDE,
  },
  {
    id: 'vinayaka',
    name: 'Shree Vinayaka Pooja Samagri',
    price: 699,
    img: null,
    soldOut: true,
    cat: 'POOJA SAMAGRI',
    tag: 'Complete samagri for Vinayaka pooja',
    desc: 'Everything you need for Vinayaka pooja, sourced and packed with care.',
    inside: [],
  },
  {
    id: 'vishnu',
    name: 'Shree Vishnu Pooja Samagri',
    price: 699,
    img: null,
    soldOut: true,
    cat: 'POOJA SAMAGRI',
    tag: 'Complete samagri for Vishnu pooja',
    desc: 'Everything you need for Vishnu pooja, sourced and packed with care.',
    inside: [],
  },
];

export const byId = Object.fromEntries(products.map(p => [p.id, p]));

export const address = {
  name: 'FS_App_Demo',
  line: 'Road No. 12, beside Tiamoz Spa, MLA Colony, Banjara Hills, Hyderabad, Telangana 500034',
  phone: '+91 91548 67608',
  city: 'Hyderabad',
};

export const DAYS = 5;

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Sun, 2 Nov": today + DAYS. */
export function etaLabel() {
  const d = new Date();
  d.setDate(d.getDate() + DAYS);
  return `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
}

/** ₹1,499 (Indian grouping). */
export function inr(v) {
  const s = String(Math.round(v));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return '₹' + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3);
}
