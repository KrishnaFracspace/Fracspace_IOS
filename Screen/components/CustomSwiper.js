import { useNavigation } from '@react-navigation/native';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CountdownTimer from './CountdownTimer/CountdownTimer';
import FastImage from 'react-native-fast-image';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_HORIZONTAL_MARGIN = 10;
const ITEM_WIDTH = screenWidth - ITEM_HORIZONTAL_MARGIN * 2;

export default function CustomSwiper({
  data = [],
  height = 210,
  autoplay = false,
  autoplayInterval = 3000,
}) {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const canLoop = data.length > 1;


  useEffect(() => {
    if (autoplay && canLoop) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [autoplay, data.length]);

  // const startAutoSlide = () => {
  //   stopAutoSlide();

  const startAutoSlide = () => {
    if (!Array.isArray(data) || data.length <= 1) {
      return;
    }
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      let nextIndex = currentIndexRef.current + 1;

      if (nextIndex >= data.length) {
        nextIndex = 0;
      }
      // flatListRef.current?.scrollToIndex({
      //   index: nextIndex,
      //   animated: true,
      // });
      if (flatListRef.current &&nextIndex >= 0 &&nextIndex < data.length) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, autoplayInterval);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / ITEM_WIDTH
    );
    currentIndexRef.current = index;
    setCurrentIndex(index);

    if (autoplay && canLoop) {
      startAutoSlide();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (!data.length) return null;

  const renderItem = ({ item }) => {
//    console.log(item,"========item====",item?.iosScree)
    // NORMAL BANNER
    if (item.type !== 'COUNTDOWN') {
      return (
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() =>
            item?.screen &&
            navigation.navigate(
              item?.screen === 'IntroAnim'
                ? item?.iosScreen
                : item.screen,
              item.params
            )
          }
          style={styles.slide}>
  <FastImage
  style={[styles.image, { height }]}
  source={{
    uri: item.image,
    priority: FastImage.priority.high,
  }}
  resizeMode={FastImage.resizeMode.stretch}
/>
        </TouchableOpacity>
      );
    }

    // COUNTDOWN BANNER
    const endTimeMs = item?.endTime
      ? new Date(item.endTime).getTime()
      : null;

    const isExpired = endTimeMs ? now >= endTimeMs : true;

    const imageToShow = isExpired
      ? item?.watchLiveStreamImage
      : item?.image;

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          if (isExpired && item?.nav) {
            navigation.navigate(item.screen, {
              liveStreamUrl: item.liveStreamUrl,
            });
          }
        }}
        style={styles.slide}
      >
<FastImage
  style={[
    styles.image,
    {
      height,
      borderRadius: 10,
    },
  ]}
  source={{
    uri: imageToShow,
    priority: FastImage.priority.high,
  }}
  resizeMode={FastImage.resizeMode.stretch}
/>


        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        {/* Countdown Overlay */}
        {!isExpired && endTimeMs && (
          <View style={styles.overlayContent}>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <CountdownTimer endTime={item.endTime} />
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={[styles.container, { height }]}>
      {/* <Animated.FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        onScrollBeginDrag={stopAutoSlide}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      /> */}
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}

        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 300);
        }}

        onScrollBeginDrag={stopAutoSlide}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Pagination */}
      {canLoop && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    alignSelf: 'center',
  },

  slide: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_HORIZONTAL_MARGIN,
    borderRadius: 10,
    backgroundColor: '#000',
    overflow: 'hidden',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },

  image: {
    width: '100%',
  },

gradient: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  borderRadius: 10,
},

overlayContent: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
offerTitle: {
  color: '#FFF',
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 8,
  textAlign: 'center',
},
  pagination: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },

  activeDot: {
    width: 20,
    backgroundColor: '#FFF',
  },
});
