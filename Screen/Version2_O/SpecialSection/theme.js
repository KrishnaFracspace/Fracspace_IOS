// Special Section (dark) design tokens, taken from Hub.dc.html in the
// "Fracspace Co-own Flow" design artifact. Shared by every Special Section
// screen (Hub, Stays, StayDetail, StayReview, IvaShop).
//
// CSS → RN notes:
// - letter-spacing in the CSS is in em: use `ls(em, fontSize)` to get px.
// - Weights are separate font files, so pick `fonts.*` instead of fontWeight.

export const colors = {
  page: '#050506', // behind the screen (shows around the portal reveal)
  ground: '#0A0A0C', // .app background
  groundAlt: '#0E0D0F', // hero base / photo fade target
  card: '#141418', // rail cards
  cardTop: '#18171B', // category card gradient start
  cardBottom: '#111114', // category card gradient end
  ink: '#1A1611', // dark text on gold
  cream: '#F4EFE6', // body text
  white: '#FFFFFF',
  muted: '#A9A39A',
  soft: '#CFC8BD', // secondary text on images
  softer: '#E2DBD0',
  navText: '#BDB7AE',
  gold: '#F1DDBA',
  goldDeep: '#E9B866',
  goldDark: '#B98A4B',
  highlight: '#FFF1D6',
  coral: '#FF6B5A',
  rose: '#FF5A6E',
  roseLight: '#FF8A9A',
  terracotta: '#C0613E', // centre tab label
  ivaTile: '#F6EEDF',
  ivaText: '#9A7440',
  hairline: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.08)',
  goldA: a => `rgba(241,221,186,${a})`,
  whiteA: a => `rgba(255,255,255,${a})`,
  groundA: a => `rgba(10,10,12,${a})`,
};

export const fonts = {
  regular: 'PlusJakartaSans-Regular', // 400
  medium: 'PlusJakartaSans-Medium', // 500
  semibold: 'PlusJakartaSans-SemiBold', // 600
  bold: 'PlusJakartaSans-Bold', // 700
  extrabold: 'PlusJakartaSans-ExtraBold', // 800
  serif: 'InstrumentSerif-Regular',
  serifItalic: 'InstrumentSerif-Italic',
};

export const radii = {
  pill: 999,
  card: 28, // stay / concert cards
  cat: 24, // category cards
  icard: 22, // iva cards
  tile: 16,
  sheet: 34, // hero bottom corners
};

export const spacing = {
  gutter: 20, // screen side padding
  section: 34, // .sec top padding
  sectionLoose: 38, // rail sections top padding
};

/** CSS em letter-spacing → RN px. */
export const ls = (em, fontSize) => em * fontSize;

// Shared text styles (CSS class names in comments).
export const type = {
  h2: {fontFamily: fonts.bold, fontSize: 20, letterSpacing: ls(-0.01, 20), color: colors.cream}, // .h2
  tag: {fontFamily: fonts.bold, fontSize: 10, letterSpacing: ls(0.1, 10), color: colors.gold}, // .tag
  link: {fontFamily: fonts.semibold, fontSize: 13, color: colors.gold}, // .link
  muted: {fontFamily: fonts.regular, color: colors.muted}, // .muted
};
