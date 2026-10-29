// IVA Shop · list view: hero (pkb Ken Burns, swinging marigold garland,
// flickering diya glow, staggered copy), product grid and the feature card.
import React, {useRef} from 'react';
import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Animated, {useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Defs, Line, Path, RadialGradient, Stop} from 'react-native-svg';
import {useFirstFrame, useRenderCount} from '../perf';
import {colors, fonts, ls} from '../theme';
import {E, PressScale, Reveal, RevealScope, ViewportGate, kf, useLoop} from '../anim';
import {BackIcon, GlassButton} from '../HubBits';
import {images} from '../data';
import {BoxIcon, CartButton, Cta, CtaNudge, DiyaIcon, Feats, LeafIcon, Ph, Rise, styles as s, useOnce} from './bits';
import {inr, products} from './data';

const LIST_FEATS = [
  {tone: 'sun', Icon: BoxIcon, title: 'Complete pooja kits', sub: 'Nothing missing. Everything in its place.'},
  {tone: 'green', Icon: LeafIcon, title: 'Authentic & pure ingredients', sub: 'Carefully sourced to preserve tradition and quality.'},
  {tone: 'moon', Icon: DiyaIcon, title: 'For daily & festive use', sub: 'Ideal for everyday devotion and special occasions.'},
];

// Garland flowers: x, string length, petal colour (the design's 15 `<g class="f">`).
const PETALS = ['#F2A93B', '#E8762B', '#F6C445'];
const FLOWERS = Array.from({length: 15}, (_, k) => ({x: 14 + 26 * k, len: [12, 18, 24][k % 3], fill: PETALS[k % 3], n: k + 2}));

/** One `.f`: swing ±4deg (3.6s ease-in-out) from the top of its string. */
function Flower({x, len, fill, sx, p}) {
  const a = useAnimatedStyle(() => ({
    transform: [{rotate: `${kf(p.value, [[0, -4], [0.5, 4], [1, -4]], E.easeInOut)}deg`}],
  }));
  return (
    <Animated.View renderToHardwareTextureAndroid style={[styles.flower, {left: x * sx - 5, height: len + 9}, a]}>
      <Svg width={10} height={len + 9}>
        <Line x1={5} y1={0} x2={5} y2={len} stroke="#7A9A3A" strokeWidth={1} />
        <Circle cx={5} cy={len + 4} r={5} fill={fill} />
        <Circle cx={5} cy={len + 4} r={2} fill="#B5531B" />
      </Svg>
    </Animated.View>
  );
}

/** `.garland`: the string plus flowers; nth-child(2n) at -1.2s, (3n) at -2.1s. */
function Garland({width}) {
  const p0 = useLoop(3600);
  const p2 = useLoop(3600, {delay: -1200});
  const p3 = useLoop(3600, {delay: -2100});
  const sx = width / 390;
  return (
    <View pointerEvents="none" style={styles.garland}>
      <Svg width={width} height={46} viewBox="0 0 390 46" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d="M0 2 Q195 18 390 2" fill="none" stroke="#7A9A3A" strokeWidth={1.2} />
      </Svg>
      {FLOWERS.map(f => (
        <Flower key={f.x} {...f} sx={sx} p={f.n % 3 === 0 ? p3 : f.n % 2 === 0 ? p2 : p0} />
      ))}
    </View>
  );
}

/** `.glow`: warm diya glow, flick 2.2s ease-in-out. */
function Glow() {
  const p = useLoop(2200);
  const a = useAnimatedStyle(() => ({
    opacity: kf(p.value, [[0, 0.7], [0.4, 1], [0.7, 0.8], [1, 0.7]], E.easeInOut),
    transform: [{scale: kf(p.value, [[0, 1], [0.4, 1.08], [0.7, 0.96], [1, 1]], E.easeInOut)}],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.glow, a]}>
      <Svg width={120} height={120}>
        <Defs>
          <RadialGradient id="ivglow" cx={60} cy={60} r={60} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="rgb(255,180,90)" stopOpacity={0.45} />
            <Stop offset="0.7" stopColor="rgb(255,180,90)" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={60} cy={60} r={60} fill="url(#ivglow)" />
      </Svg>
    </Animated.View>
  );
}

/** `.ihero > img`: pkb (scale 1.15 → 1, 12s ease-out) once on mount. */
export function KenBurns({source}) {
  const p = useOnce(12000, 0, E.easeOut);
  const a = useAnimatedStyle(() => ({transform: [{scale: 1.15 - 0.15 * p.value}]}));
  return <Animated.Image source={source} resizeMode="cover" style={[StyleSheet.absoluteFill, styles.fill, a]} />;
}

function Hero({width, top, count, bump, onBack, onCart, onBlessed}) {
  return (
    <View style={styles.hero}>
      <KenBurns source={images.blessedKit} />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(10,8,6,0.55)', 'rgba(10,8,6,0.1)', 'rgba(10,8,6,0.35)', 'rgba(10,10,12,0.96)']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Garland width={width} />
      <Glow />
      <GlassButton label="Back to Special Section" onPress={onBack} style={[styles.hbtnL, {top}]}>
        <BackIcon />
      </GlassButton>
      <CartButton count={count} bump={bump} onPress={onCart} style={[styles.hbtnR, {top}]} />
      <View style={styles.heroCopy}>
        <Rise i={0}>
          <Text style={styles.ivamark}>IVA</Text>
          <Text style={styles.essentials}>ESSENTIALS</Text>
        </Rise>
        <Rise i={1}>
          <Text style={styles.h1}>{'Rituals. Designed for\neveryday devotion.'}</Text>
        </Rise>
        <Rise i={2}>
          <Text style={styles.lede}>Premium all-in-one pooja kits for modern Indian homes</Text>
        </Rise>
        <Rise i={3} style={styles.heroCta}>
          <Cta label="Claim your Blessed Kit" onPress={onBlessed} style={styles.h44} after={<CtaNudge />} />
        </Rise>
      </View>
    </View>
  );
}

/** `.pc`: product card (press .96, .45s spring). */
function ProductCard({p, width, onOpen}) {
  return (
    <PressScale
      onPress={() => onOpen(p.id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${p.name}`}
      style={[styles.pc, {width}]}>
      <View style={styles.pimg}>
        {p.img ? <Image source={p.img} resizeMode="cover" style={styles.fill} /> : <Ph />}
        {p.soldOut ? (
          <View style={styles.so}>
            <View style={styles.soPill}>
              <Text style={styles.soText}>SOLD OUT</Text>
            </View>
          </View>
        ) : null}
      </View>
      <Text style={styles.pname}>{p.name}</Text>
      <View style={styles.prow}>
        <Text style={styles.pprice}>{inr(p.price)}</Text>
        {p.soldOut ? null : (
          <View style={styles.addp}>
            <Text style={styles.addpText}>+</Text>
          </View>
        )}
      </View>
    </PressScale>
  );
}

export default function List({top, bottom, count, bump, onBack, onCart, onOpen}) {
  useRenderCount('IvaList');
  useFirstFrame('IvaList');
  const {width, height} = useWindowDimensions();
  const contentRef = useRef(null);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });
  const cardW = (width - 40 - 12) / 2;

  return (
    <RevealScope scrollY={scrollY} contentRef={contentRef} viewportH={height}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <View ref={contentRef} collapsable={false}>
          <ViewportGate>
            <Hero
              width={width}
              top={top}
              count={count}
              bump={bump}
              onBack={onBack}
              onCart={onCart}
              onBlessed={() => onOpen('blessed')}
            />
          </ViewportGate>
          <View style={styles.sec}>
            <Reveal style={styles.shead}>
              <Text style={styles.h2}>Handpicked for your sacred space</Text>
              <Text style={[s.muted, styles.count]}>{products.length} products</Text>
            </Reveal>
            <View style={styles.pgrid}>
              {products.map(p => (
                <ProductCard key={p.id} p={p} width={cardW} onOpen={onOpen} />
              ))}
            </View>
          </View>
          <View style={[styles.sec, {paddingBottom: 60 + bottom}]}>
            <Reveal style={styles.shead}>
              <Text style={styles.h2}>A modern way to experience tradition</Text>
            </Reveal>
            <Reveal>
              <Feats items={LIST_FEATS} />
            </Reveal>
          </View>
        </View>
      </Animated.ScrollView>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  fill: {width: '100%', height: '100%'},
  hero: {
    height: 400,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#120C08',
  },
  garland: {position: 'absolute', left: 0, right: 0, top: 0, height: 46, zIndex: 2},
  flower: {position: 'absolute', top: 0, width: 10, transformOrigin: 'top'},
  glow: {position: 'absolute', left: 150, top: 120, width: 120, height: 120},
  hbtnL: {position: 'absolute', left: 16, zIndex: 3},
  hbtnR: {position: 'absolute', right: 16, zIndex: 3},
  heroCopy: {position: 'absolute', left: 20, right: 20, bottom: 24, gap: 8},
  ivamark: {fontFamily: fonts.serif, fontSize: 44, lineHeight: 44, letterSpacing: ls(0.18, 44), color: '#F6EAD2'},
  essentials: {fontFamily: fonts.extrabold, fontSize: 9.5, letterSpacing: ls(0.5, 9.5), color: colors.gold, marginTop: 4},
  h1: {fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 24 * 1.15, color: '#fff', marginTop: 8},
  lede: {fontFamily: fonts.regular, fontSize: 12.5, color: colors.softer},
  heroCta: {alignSelf: 'flex-start', marginTop: 6},
  h44: {height: 44},
  sec: {paddingTop: 30, paddingHorizontal: 20},
  shead: {gap: 4, marginBottom: 14},
  h2: {fontFamily: fonts.bold, fontSize: 19, letterSpacing: ls(-0.01, 19), color: colors.cream},
  count: {fontSize: 12.5},
  pgrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  pc: {
    gap: 6,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pimg: {height: 150, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.ivaTile},
  so: {...StyleSheet.absoluteFillObject, backgroundColor: colors.groundA(0.5), alignItems: 'center', justifyContent: 'center'},
  soPill: {
    height: 26,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.groundA(0.7),
    borderWidth: 1,
    borderColor: colors.whiteA(0.2),
  },
  soText: {fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: ls(0.06, 10.5), color: '#E6E0D6'},
  pname: {fontFamily: fonts.bold, fontSize: 13.5, lineHeight: 13.5 * 1.3, minHeight: 35, paddingTop: 2, paddingHorizontal: 4, color: colors.cream},
  prow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4},
  pprice: {fontFamily: fonts.extrabold, fontSize: 15, color: colors.cream},
  addp: {width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold},
  addpText: {fontFamily: fonts.extrabold, fontSize: 18, color: colors.ink},
});
