import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonBox from '../components/SkeletonBox';

const {width} = Dimensions.get('window');

const Divider = () => (
  <View
    style={{
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: 16,
    }}
  />
);

export default function DreamScapeHomeSkeleton() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>

      {/* IMAGE / GALLERY */}
      <SkeletonBox width="100%" height={260} radius={0} />

      {/* CONTENT */}
      <View style={{padding: 16}}>

        {/* TITLE */}
        <SkeletonBox width="80%" height={20} />

        {/* LOCATION */}
        <SkeletonBox width="60%" height={14} />

        {/* PRICE */}
        <SkeletonBox width="40%" height={18} />

        <Divider />

        {/* FEATURES (ICONS ROW) */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{alignItems: 'center', width: '22%'}}>
              <SkeletonBox width={40} height={40} radius={20} />
              <SkeletonBox width={40} height={10} />
            </View>
          ))}
        </View>

        <Divider />

        {/* DESCRIPTION */}
        <SkeletonBox width="100%" height={14} />
        <SkeletonBox width="95%" height={14} />
        <SkeletonBox width="90%" height={14} />
        <SkeletonBox width="85%" height={14} />

        <Divider />

        {/* MAP / ADDRESS */}
        <SkeletonBox width="100%" height={160} radius={12} />

        <Divider />

        {/* CTA BUTTON */}
        <SkeletonBox
          width="100%"
          height={50}
          radius={10}
          style={{marginTop: 10}}
        />
      </View>
    </ScrollView>
  );
}
