import React from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import SkeletonBox from './SkeletonBox';


const {width} = Dimensions.get('window');

const PropertySkeleton = () => {
  return (
    <ScrollView style={{backgroundColor: '#f5f7fe'}}>
      
      {/* Image Swiper */}
      <SkeletonBox
        width={width}
        height={240}
        radius={0}
      />

      {/* Title + Location */}
      <View style={styles.section}>
        <SkeletonBox width="70%" height={22} />
        <SkeletonBox width="50%" height={14} />
      </View>

      {/* New Event Card */}
      <View style={styles.eventCard}>
        <SkeletonBox width={60} height={20} />
        <SkeletonBox width="90%" height={16} />
        <SkeletonBox width="80%" height={14} />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <SkeletonBox width="40%" height={18} />
        <SkeletonBox height={14} />
        <SkeletonBox height={14} />
        <SkeletonBox width="60%" height={14} />
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <SkeletonBox width="50%" height={16} />
        <SkeletonBox width="100%" height={6} radius={4} />
      </View>

      {/* Property Details Card */}
      <View style={styles.card}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.row}>
            <SkeletonBox width="40%" height={14} />
            <SkeletonBox width="30%" height={14} />
          </View>
        ))}
      </View>

      {/* Benefits */}
      <View style={styles.rowCenter}>
        {[1, 2, 3].map(i => (
          <SkeletonBox
            key={i}
            width={90}
            height={90}
            radius={12}
            style={{marginHorizontal: 6}}
          />
        ))}
      </View>

      {/* Map */}
      <SkeletonBox width={width} height={260} radius={0} />

      {/* Buttons */}
      <View style={styles.bottomRow}>
        <SkeletonBox width="48%" height={55} radius={10} />
        <SkeletonBox width="48%" height={55} radius={10} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default PropertySkeleton;
