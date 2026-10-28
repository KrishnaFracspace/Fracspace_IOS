// IVA Shop · product view: photo hero (pkb), staggered title/price/qty,
// delivery row (`drive`), about, "In the box" and the feature card.
import React from 'react';
import {ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {colors, fonts, ls} from '../theme';
import {E, kf, useLoop} from '../anim';
import {BackIcon, GlassButton} from '../HubBits';
import {KenBurns} from './List';
import {BoxIcon, CartButton, Feats, GREEN, LeafIcon, Ph, QtyBox, TruckIcon, rise, styles as s} from './bits';
import {DAYS, inr} from './data';

const PROD_FEATS = [
  {tone: 'sun', Icon: BoxIcon, title: 'Nothing missing', sub: 'Everything in its place, ready for your ritual.'},
  {tone: 'green', Icon: LeafIcon, title: 'Authentic & pure', sub: 'Carefully sourced ingredients.'},
];

/** `.dic svg`: drive ±2px, 2.4s ease-in-out. */
function DriveIcon() {
  const p = useLoop(2400);
  const a = useAnimatedStyle(() => ({
    transform: [{translateX: kf(p.value, [[0, -2], [0.5, 2], [1, -2]], E.easeInOut)}],
  }));
  return (
    <View style={styles.dic}>
      <Animated.View style={a}>
        <TruckIcon />
      </Animated.View>
    </View>
  );
}

/** `.it` / `.it.big`: one numbered item in the box. */
function InsideItem({item, k, width}) {
  const big = k === 0;
  return (
    <View style={[styles.it, big ? styles.itBig : {width}]}>
      <View style={big ? styles.itImgBig : styles.itImg}>
        <Ph size={big ? 15 : 12} />
      </View>
      <Text style={[styles.itText, big && styles.itTextBig]}>{item.name}</Text>
      <Text style={styles.itNo}>{(k < 9 ? '0' : '') + (k + 1)}</Text>
    </View>
  );
}

export default function Product({p, qty, top, eta, city, count, bump, onBack, onCart, onDec, onInc}) {
  const {width} = useWindowDimensions();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        {p.img ? <KenBurns source={p.img} /> : <Ph size={52} />}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(10,8,6,0.45)', 'rgba(10,8,6,0)', 'rgba(10,8,6,0)', 'rgba(10,10,12,0.9)']}
          locations={[0, 0.28, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
        <GlassButton label="Back to products" onPress={onBack} style={[styles.hbtnL, {top}]}>
          <BackIcon />
        </GlassButton>
        <CartButton count={count} bump={bump} onPress={onCart} style={[styles.hbtnR, {top}]} />
      </View>

      <View style={styles.stg}>
        <Animated.Text entering={rise(0)} style={styles.cat}>
          IVA ESSENTIALS · {p.cat}
        </Animated.Text>
        <Animated.Text entering={rise(1)} style={styles.h1}>
          {p.name}
        </Animated.Text>
        <Animated.Text entering={rise(2)} style={[s.muted, styles.tag]}>
          {p.tag}
        </Animated.Text>
        <Animated.View entering={rise(3)} style={styles.priceRow}>
          <Text style={[s.tval, styles.price]}>
            {inr(p.price)}
            <Text style={[s.muted, styles.incl]}> incl. taxes</Text>
          </Text>
          {p.soldOut ? (
            <View style={s.tpill}>
              <Text style={s.tpillText}>SOLD OUT</Text>
            </View>
          ) : (
            <QtyBox qty={qty} onDec={onDec} onInc={onInc} />
          )}
        </Animated.View>
      </View>

      <View style={styles.secDlv}>
        <View style={styles.dlv}>
          <DriveIcon />
          <View style={s.flex}>
            <Text style={styles.dlvTitle}>Delivery by {eta}</Text>
            <Text style={[s.muted, styles.dlvSub]}>
              To {city} · in {DAYS} days
            </Text>
          </View>
          <View style={styles.dtag}>
            <Text style={styles.dtagText}>FREE</Text>
          </View>
        </View>
      </View>

      <View style={styles.sec}>
        <Text style={[s.h3, styles.aboutH]}>About this kit</Text>
        <Text style={styles.desc}>{p.desc}</Text>
      </View>

      {p.inside.length ? (
        <View style={styles.sec}>
          <View style={styles.boxHead}>
            <Text style={s.h3}>In the box</Text>
            <View style={s.tpill}>
              <Text style={s.tpillText}>{p.inside.length} ESSENTIALS</Text>
            </View>
          </View>
          <View style={styles.ibox}>
            {p.inside.map((item, k) => (
              <InsideItem key={item.name} item={item} k={k} width={(width - 40 - 8) / 2} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={[styles.sec, styles.last]}>
        <Feats items={PROD_FEATS} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 360,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: colors.ivaTile,
  },
  hbtnL: {position: 'absolute', left: 16, zIndex: 3},
  hbtnR: {position: 'absolute', right: 16, zIndex: 3},
  stg: {paddingTop: 18, paddingHorizontal: 20, gap: 6},
  cat: {fontFamily: fonts.extrabold, fontSize: 10.5, letterSpacing: ls(0.14, 10.5), color: colors.gold},
  h1: {fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 26 * 1.15, letterSpacing: ls(-0.02, 26), color: '#fff'},
  tag: {fontSize: 13},
  priceRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  price: {fontSize: 24, letterSpacing: ls(-0.01, 24)},
  incl: {fontFamily: fonts.medium, fontSize: 11, letterSpacing: 0},
  secDlv: {paddingTop: 20, paddingHorizontal: 20},
  dlv: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dic: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.goldA(0.08),
  },
  dlvTitle: {fontFamily: fonts.bold, fontSize: 14, color: '#fff'},
  dlvSub: {fontSize: 12, marginTop: 2},
  dtag: {height: 24, paddingHorizontal: 9, justifyContent: 'center', borderRadius: 8, backgroundColor: 'rgba(110,231,160,0.1)'},
  dtagText: {fontFamily: fonts.extrabold, fontSize: 10.5, letterSpacing: ls(0.08, 10.5), color: GREEN},
  sec: {paddingTop: 30, paddingHorizontal: 20},
  last: {paddingBottom: 130},
  aboutH: {marginBottom: 8},
  desc: {fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 13.5 * 1.6, color: colors.soft},
  boxHead: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12},
  ibox: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  it: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  itBig: {width: '100%', paddingVertical: 10, paddingLeft: 10, paddingRight: 12},
  itImg: {width: 44, height: 44, borderRadius: 12, overflow: 'hidden'},
  itImgBig: {width: 60, height: 60, borderRadius: 14, overflow: 'hidden'},
  itText: {flex: 1, fontFamily: fonts.semibold, fontSize: 12, lineHeight: 12 * 1.3, color: '#E6E0D6'},
  itTextBig: {fontFamily: fonts.bold, fontSize: 13.5, lineHeight: 13.5 * 1.3, color: '#fff'},
  itNo: {position: 'absolute', top: 6, right: 8, fontFamily: fonts.extrabold, fontSize: 9, color: '#6F6A63'},
});
