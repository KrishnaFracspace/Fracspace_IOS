// IVA Shop · review order: cart lines with quantity boxes, delivery address
// (view / edit), totals and the "Arrives" road with the IVA van (ride2, bob).
import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Circle, Line, Path, Text as SvgText} from 'react-native-svg';
import {colors, fonts} from '../theme';
import {E, kf, useLoop} from '../anim';
import {BackIcon, GlassButton} from '../HubBits';
import {Card, Cta, EditIcon, GREEN, Ph, PinIcon, QtyBox, Ticon, rise, styles as s} from './bits';
import {DAYS, byId, inr} from './data';

const RIDE = Easing.bezierFn(0.45, 0, 0.4, 1);

/** `.van`: ride2 across the road (3.2s), bobbing (.35s alternate). */
function Van({w}) {
  const p = useLoop(3200);
  const b = useLoop(350, {alternate: true});
  const ride = useAnimatedStyle(() => ({
    opacity: kf(p.value, [[0, 0], [0.1, 1], [0.85, 1], [1, 0]], RIDE),
    transform: [{translateX: (w - 30) * RIDE(p.value)}],
  }), [w]);
  const bob = useAnimatedStyle(() => ({transform: [{translateY: -1.5 * E.easeInOut(b.value)}]}));
  return (
    <Animated.View style={[styles.van, ride]}>
      <Animated.View style={bob}>
        <Svg width={30} height={20} viewBox="0 0 30 20">
          <Path d="M2 4h16v10H2z" fill="#F1DDBA" />
          <Path d="M18 7h6l4 4v3H18z" fill="#E6CFA0" />
          <Path d="M20 8.5h3.4l2.2 2.3H20z" fill="#1A1611" opacity={0.6} />
          <Circle cx={7} cy={15.5} r={2.6} fill="#1A1611" stroke="#F1DDBA" strokeWidth={1.2} />
          <Circle cx={22.5} cy={15.5} r={2.6} fill="#1A1611" stroke="#F1DDBA" strokeWidth={1.2} />
          <SvgText x={10} y={11.4} textAnchor="middle" fontSize={5} fontWeight="800" fill="#1A1611" fontFamily={fonts.extrabold}>
            IVA
          </SvgText>
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/** `.rmid`: dashed road between two dots. */
function Road() {
  const [w, setW] = useState(0);
  return (
    <View style={styles.rmid} onLayout={e => setW(e.nativeEvent.layout.width)}>
      <Svg width={w} height={2} style={styles.rline}>
        <Line x1={6} y1={1} x2={w - 6} y2={1} stroke="rgba(241,221,186,.3)" strokeWidth={2} strokeDasharray="6 4" />
      </Svg>
      <View style={[styles.rdot, styles.rdotL]} />
      <View style={[styles.rdot, styles.rdotR]} />
      {w ? <Van w={w} /> : null}
    </View>
  );
}

/** `.field`: label + input, gold border while focused. */
function Field({label, value, onChangeText, multiline, keyboardType}) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={s.tlabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        selectionColor={colors.gold}
        style={[styles.input, multiline && styles.textarea, focus && styles.inputOn]}
      />
    </View>
  );
}

function CartLine({id, qty, first, onDec, onInc}) {
  const p = byId[id];
  return (
    <View style={[styles.citem, !first && s.rowLine]}>
      <View style={styles.mini}>{p.img ? <Image source={p.img} resizeMode="cover" style={styles.fill} /> : <Ph size={16} />}</View>
      <View style={s.flex}>
        <Text style={styles.cname}>{p.name}</Text>
        <Text style={[s.muted, styles.each]}>{inr(p.price)} each</Text>
      </View>
      <View style={styles.cright}>
        <Text style={styles.line}>{inr(qty * p.price)}</Text>
        <QtyBox small qty={qty} onDec={() => onDec(id)} onInc={() => onInc(id)} />
      </View>
    </View>
  );
}

export default function Review(props) {
  const {top, lines, count, subLabel, addr, editing, draft, setDraft, eta} = props;
  const {onBack, onDec, onInc, onToggleAddr, onSaveAddr, onBrowse} = props;
  const set = k => v => setDraft(d => ({...d, [k]: v}));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[styles.wrap, {paddingTop: top}]}>
      <Animated.View entering={rise(0)} style={styles.top}>
        <GlassButton label="Back" onPress={onBack} style={styles.gbtn}>
          <BackIcon />
        </GlassButton>
        <View>
          <Text style={styles.h1}>Review order</Text>
          <Text style={[s.muted, styles.items]}>{count} item(s)</Text>
        </View>
      </Animated.View>

      {count > 0 ? (
        <>
          <Card>
            {lines.map(([id, qty], i) => (
              <CartLine key={id} id={id} qty={qty} first={i === 0} onDec={onDec} onInc={onInc} />
            ))}
          </Card>

          <Card>
            <View style={styles.addrHead}>
              <Text style={s.tlabel}>Deliver to</Text>
              <Pressable onPress={onToggleAddr} accessibilityRole="button" hitSlop={6} style={styles.edit}>
                <EditIcon />
                <Text style={styles.editText}>{editing ? 'Cancel' : 'Edit'}</Text>
              </Pressable>
            </View>
            {editing ? (
              <View style={styles.addrEdit}>
                <Field label="Full name" value={draft.name} onChangeText={set('name')} />
                <Field label="Address" value={draft.line} onChangeText={set('line')} multiline />
                <Field label="Phone" value={draft.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
                <Cta label="Save address" onPress={onSaveAddr} style={styles.h44} />
              </View>
            ) : (
              <View style={styles.addrView}>
                <Ticon tone="sun">
                  <PinIcon />
                </Ticon>
                <View style={s.flex}>
                  <Text style={styles.cname}>{addr.name}</Text>
                  <Text style={[s.muted, styles.addrLine]}>
                    {addr.line}
                    {'\n'}
                    {addr.phone}
                  </Text>
                </View>
              </View>
            )}
          </Card>

          <Card style={styles.totals}>
            <View style={styles.trow}>
              <Text style={styles.tkey}>Subtotal</Text>
              <Text style={styles.tsub}>{subLabel}</Text>
            </View>
            <View style={styles.trow}>
              <Text style={styles.tkey}>Delivery</Text>
              <Text style={[styles.tsub, {color: GREEN}]}>FREE</Text>
            </View>
            <View style={styles.rule} />
            <View style={[styles.trow, styles.baseline]}>
              <Text style={styles.total}>Total</Text>
              <Text style={s.tval}>{subLabel}</Text>
            </View>
          </Card>

          <View style={styles.road}>
            <View style={styles.rcol}>
              <Text style={s.tlabel}>Arrives</Text>
              <Text style={[s.tval, styles.r16]}>In {DAYS} days</Text>
              <Text style={[s.muted, styles.r11]}>by {eta}</Text>
            </View>
            <Road />
            <View style={[styles.rcol, styles.rcolEnd]}>
              <Text style={s.tlabel}>To</Text>
              <Text style={[s.tval, styles.r16]}>{addr.city}</Text>
              <Text style={[s.muted, styles.r11]}>Free delivery</Text>
            </View>
          </View>
        </>
      ) : (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={[s.muted, styles.emptySub]}>Add a kit to begin your ritual.</Text>
          <Cta label="Browse products" onPress={onBrowse} style={styles.browse} />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {width: '100%', height: '100%'},
  wrap: {paddingHorizontal: 20, paddingBottom: 140, gap: 16},
  top: {flexDirection: 'row', alignItems: 'center', gap: 12},
  gbtn: {backgroundColor: colors.card, borderColor: colors.whiteA(0.1)},
  h1: {fontFamily: fonts.extrabold, fontSize: 19, color: colors.cream},
  items: {fontSize: 11.5},
  citem: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12},
  mini: {width: 64, height: 64, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.ivaTile},
  cname: {fontFamily: fonts.bold, fontSize: 14, color: colors.cream},
  each: {fontSize: 12, marginTop: 3},
  cright: {alignItems: 'flex-end', gap: 6},
  line: {fontFamily: fonts.bold, fontSize: 15, color: colors.cream},
  addrHead: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingHorizontal: 16},
  edit: {flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32},
  editText: {fontFamily: fonts.bold, fontSize: 12, color: colors.gold},
  addrView: {flexDirection: 'row', gap: 12, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 16},
  addrLine: {fontSize: 12, lineHeight: 18, marginTop: 3},
  addrEdit: {gap: 10, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 16},
  field: {gap: 5},
  input: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.cream,
    backgroundColor: colors.whiteA(0.04),
    borderWidth: 1,
    borderColor: colors.whiteA(0.12),
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  textarea: {minHeight: 14 * 1.4 * 3 + 24, textAlignVertical: 'top'},
  inputOn: {borderColor: colors.gold, backgroundColor: colors.goldA(0.06)},
  h44: {height: 44},
  totals: {padding: 16, gap: 10},
  trow: {flexDirection: 'row', justifyContent: 'space-between'},
  baseline: {alignItems: 'baseline'},
  tkey: {fontFamily: fonts.regular, fontSize: 13.5, color: colors.soft},
  tsub: {fontFamily: fonts.bold, fontSize: 13.5, color: '#fff'},
  rule: {height: 1, backgroundColor: colors.borderStrong},
  total: {fontFamily: fonts.bold, fontSize: 15, color: colors.cream},
  road: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rcol: {gap: 3, flexShrink: 0},
  rcolEnd: {alignItems: 'flex-end'},
  r16: {fontSize: 16, letterSpacing: -0.16},
  r11: {fontSize: 11},
  rmid: {flex: 1, alignSelf: 'center', height: 34, marginTop: 6},
  rline: {position: 'absolute', left: 0, bottom: 6},
  rdot: {
    position: 'absolute',
    bottom: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.card,
  },
  rdotL: {left: 0},
  rdotR: {right: 0, backgroundColor: colors.gold},
  van: {position: 'absolute', bottom: 7, left: 0},
  empty: {padding: 28, alignItems: 'center'},
  emptyTitle: {fontFamily: fonts.bold, fontSize: 14, color: colors.cream},
  emptySub: {fontSize: 12.5, marginTop: 6},
  browse: {height: 42, marginTop: 14},
});
