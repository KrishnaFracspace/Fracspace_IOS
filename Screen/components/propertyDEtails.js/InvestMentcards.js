import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconMail from 'react-native-vector-icons/Feather';

export default function InvestmentCards({
  leftCard = {},
  rightCard = {},
}) {
  return (
    <View style={styles.container}>
      
      {/* LEFT CARD */}
      <View style={styles.card}>
        <View style={styles.tagRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>{leftCard.icon || '$'}</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {(leftCard?.tag)?.toUpperCase() || 'ANNUAL'}
            </Text>
          </View>
        </View>

        <Text style={styles.value}>
          {leftCard.value || '7'}%
        </Text>

        <Text style={styles.title}>
          {leftCard.title || 'BROI Yield'}
        </Text>

        <Text style={styles.subtitle}>
          {leftCard.subtitle || 'Payout until completion'}
        </Text>
      </View>

      {/* RIGHT CARD */}
      <View style={styles.card}>
        <View style={styles.tagRow}>
          <View style={[styles.iconBox,{backgroundColor:"rgba(2, 18, 101, 0.1)"}]}>
           <IconMail name={'trending-up'} size={13} color={'#021265'}/>
          </View>

          <View style={[styles.tag, styles.blueTag]}>
            <Text style={[styles.tagText, styles.blueTagText]}>
              {rightCard.tag || '3 YRS'}
            </Text>
          </View>
        </View>

        <Text style={styles.value}>
          {rightCard.value || '40–60%'}
        </Text>

        <Text style={styles.title}>
          {rightCard.title || 'Capital Upside'}
        </Text>

        <Text style={styles.subtitle}>
          {rightCard.subtitle || 'Pre-launch entry'}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,

    // ✅ CLEAN FIGMA SHADOW
    shadowColor: '#02060d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#E4F1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 14,
  },

  tag: {
    backgroundColor: '#DFF2E3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  tagText: {
    fontSize: 10,
    fontFamily: 'WorkSans-SemiBold',
    color: '#2E7D32',
  },

  blueTag: {
    backgroundColor: '#E6E9F5',
  },

  blueTagText: {
    color: 'rgba(2, 18, 101, 1)',
  },

  value: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000',
    marginTop: 10,
    fontWeight:700
  },

  title: {
    fontSize: 12,
    fontFamily: 'Work Sans',
    color: '#000',
    marginTop: 2,
  },

  subtitle: {
    fontSize: 10,
    fontFamily: 'WorkSans-Regular',
    color: '#7A7A7A',
    marginTop: 2,
  },
});