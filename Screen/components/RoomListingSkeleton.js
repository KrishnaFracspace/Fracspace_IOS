import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonBox from '../components/SkeletonBox';

const {width, height} = Dimensions.get('window');

const Divider = () => (
  <View
    style={{
      height: 1,
      backgroundColor: '#EAEAEA',
      marginVertical: 15,
    }}
  />
);

export default function RoomListingSkeleton() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>

      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#0D2038',
          height: height * 0.24,
          paddingTop: 40,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <SkeletonBox width={24} height={24} radius={12} />
          <SkeletonBox width={160} height={16} />
          <SkeletonBox width={24} height={24} radius={12} />
        </View>
      </View>

      {/* SEARCH / FILTER CARD */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: -height * 0.12,
          backgroundColor: '#FFFFFF',
          borderRadius: 15,
          paddingBottom: 20,
          elevation: 5,
        }}>

        {/* LOCATION */}
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <SkeletonBox width={150} height={16} />
          <SkeletonBox width="100%" height={50} radius={25} />
        </View>

        {/* DATE & GUEST */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginTop: 10,
          }}>
          <SkeletonBox
            width="48%"
            height={50}
            radius={25}
            style={{marginRight: '4%'}}
          />
          <SkeletonBox width="48%" height={50} radius={25} />
        </View>

        <Divider />

        {/* FILTER & SORT BUTTONS */}
        <View style={{flexDirection: 'row'}}>
          <SkeletonBox
            width="40%"
            height={45}
            radius={25}
            style={{marginLeft: 15}}
          />
          <SkeletonBox
            width="40%"
            height={45}
            radius={25}
            style={{marginLeft: 15}}
          />
        </View>
      </View>

      {/* HOTEL LIST CARDS */}
      {[1, 2, 3].map(i => (
        <View
          key={i}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            marginHorizontal: 20,
            marginVertical: 15,
            elevation: 4,
            overflow: 'hidden',
          }}>

          {/* IMAGE / SWIPER */}
          <SkeletonBox width="100%" height={height * 0.22} radius={0} />

          {/* TAG & HEART */}
          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 15,
              width: 70,
            }}>
            <SkeletonBox width={60} height={24} radius={12} />
          </View>

          <View
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
            }}>
            <SkeletonBox width={40} height={40} radius={20} />
          </View>

          {/* DETAILS */}
          <View
            style={{
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <SkeletonBox width="70%" height={16} />
              <SkeletonBox width="90%" height={12} />
            </View>

            <View style={{alignItems: 'flex-end'}}>
              <SkeletonBox width={80} height={16} />
              <SkeletonBox width={60} height={10} />
            </View>
          </View>
        </View>
      ))}

      <View style={{height: 40}} />
    </ScrollView>
  );
}
