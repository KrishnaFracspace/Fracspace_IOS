import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import SkeletonBox from './SkeletonBox';


const {width, height} = Dimensions.get('window');

export default function HomeSkeleton() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>

      {/* HEADER */}
      <View style={{backgroundColor: 'rgba(239, 237, 237, 0.95)', paddingTop: 70,padding:10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <SkeletonBox width={30} height={20} />
          <SkeletonBox width={100} height={40} />
          <SkeletonBox width={90} height={20} />
        </View>
      </View>

      {/* SWIPER */}
      <View style={{marginTop: 15}}>
        <SkeletonBox
          width={width - 30}
          height={210}
          radius={12}
          style={{alignSelf: 'center'}}
        />
      </View>

      {/* AVAILABLE PROPERTIES TITLE */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          marginTop: 20,
        }}>
        <SkeletonBox width={180} height={18} />
        <SkeletonBox width={80} height={14} />
      </View>

      {/* HORIZONTAL PROPERTY CARDS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((_, i) => (
          <View
            key={i}
            style={{
              width: width * 0.65,
              marginLeft: 15,
              marginTop: 15,
            }}>
            <SkeletonBox width="100%" height={150} radius={10} />
            <SkeletonBox width="70%" height={14} style={{marginTop: 10}} />
            <SkeletonBox width="50%" height={12} style={{marginTop: 8}} />
            <SkeletonBox width="60%" height={12} style={{marginTop: 8}} />
          </View>
        ))}
      </ScrollView>

      {/* ALTARIA BANNER */}
      <View style={{paddingHorizontal: 20, marginTop: 25}}>
        <SkeletonBox width="100%" height={70} radius={40} />
      </View>

      {/* MORE THAN CO-OWNERSHIP */}
      <View style={{backgroundColor: '#EBE9F6', marginTop: 30}}>
        <SkeletonBox
          width={220}
          height={18}
          style={{margin: 15}}
        />
        <ScrollView horizontal>
          {[1, 2, 3].map((_, i) => (
            <SkeletonBox
              key={i}
              width={120}
              height={100}
              radius={10}
              style={{marginLeft: 15}}
            />
          ))}
        </ScrollView>
      </View>

      {/* POSTCARDS */}
      <View style={{marginTop: 25, paddingLeft: 15}}>
        <SkeletonBox width={140} height={20} />
        <SkeletonBox
          width={width * 0.9}
          height={height * 0.35}
          radius={15}
          style={{marginTop: 15}}
        />
      </View>

      {/* WHEREVER YOU GO */}
      <View style={{marginTop: 30, paddingLeft: 15}}>
        <SkeletonBox width={260} height={18} />
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={{marginRight: 18}}>
              <SkeletonBox width={90} height={90} radius={45} />
              <SkeletonBox
                width={60}
                height={10}
                style={{marginTop: 10, alignSelf: 'center'}}
              />
            </View>
          ))}
        </View>
      </View>

      {/* TESTIMONIALS */}
      <View style={{marginTop: 30, paddingLeft: 15}}>
        <SkeletonBox width={140} height={18} />
        <ScrollView horizontal>
          {[1, 2].map((_, i) => (
            <SkeletonBox
              key={i}
              width={230}
              height={300}
              radius={12}
              style={{marginTop: 20, marginRight: 50}}
            />
          ))}
        </ScrollView>
      </View>

      {/* MEDIA */}
      <View style={{marginTop: 30}}>
        <SkeletonBox width={120} height={18} style={{marginLeft: 15}} />
        <ScrollView horizontal>
          {[1, 2, 3].map((_, i) => (
            <SkeletonBox
              key={i}
              width={120}
              height={80}
              style={{marginLeft: 15}}
            />
          ))}
        </ScrollView>
      </View>

      {/* CALL TO ACTION */}
      <View style={{padding: 20, marginBottom: 60}}>
        <SkeletonBox width="100%" height={50} radius={8} />
      </View>
    </ScrollView>
  );
}
