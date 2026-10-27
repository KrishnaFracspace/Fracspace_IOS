import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fonts, ls} from './theme';

// Stand-in for Special Section screens that a later build session fills in.
// `links` is [{label, onPress}].
export default function Placeholder({title, note, navigation, links = []}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {paddingTop: insets.top + 12}]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>
      <Text style={styles.tag}>COMING SOON</Text>
      <Text style={styles.title}>{title}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {links.map(l => (
        <Pressable key={l.label} onPress={l.onPress} style={styles.cta}>
          <Text style={styles.ctaText}>{l.label} →</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.ground, paddingHorizontal: 20, gap: 14},
  back: {alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center'},
  backText: {fontFamily: fonts.semibold, fontSize: 15, color: colors.gold},
  tag: {fontFamily: fonts.bold, fontSize: 10, letterSpacing: ls(0.1, 10), color: colors.gold, marginTop: 24},
  title: {fontFamily: fonts.extrabold, fontSize: 31, letterSpacing: ls(-0.025, 31), color: colors.white},
  note: {fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 21, color: colors.soft},
  cta: {
    alignSelf: 'flex-start',
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    marginTop: 8,
  },
  ctaText: {fontFamily: fonts.bold, fontSize: 14, color: colors.ink},
});
