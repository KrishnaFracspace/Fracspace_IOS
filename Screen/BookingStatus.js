import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { Image } from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function BookingStatus(props) {
  const navigation = useNavigation();
  const imageObj = props?.route?.params?.Image;

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Convert object → array
  const images = useMemo(() => {
    return Object.keys(imageObj || {})
      .filter(key => imageObj[key])
      .map(key => imageObj[key]);
  }, [imageObj]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Carousel sizes
  const ITEM_WIDTH = width * 0.28;
  const SPACING = 12;
  const SIDE_SPACING = (width - ITEM_WIDTH) / 2;

  const handlePress = index => {
    setActiveIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: index * (ITEM_WIDTH + SPACING),
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back-outline" size={28} color="#240c3c" />
        </TouchableOpacity>
      {/* 🔝 MAIN IMAGE */}
      <View style={styles.topContainer}>
        <Image
          key={activeIndex}
          animation="fadeIn"
          duration={400}
          style={styles.mainImage}
          source={{ uri: images[activeIndex] }}
          resizeMode='contain'
        />
      </View>

      {/* 🔽 CAROUSEL */}
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={ITEM_WIDTH + SPACING}
          contentContainerStyle={{
            paddingHorizontal: SIDE_SPACING,
            alignItems: 'center',
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={ev => {
            const index = Math.round(
              ev.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING)
            );
            setActiveIndex(index);
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * (ITEM_WIDTH + SPACING),
              index * (ITEM_WIDTH + SPACING),
              (index + 1) * (ITEM_WIDTH + SPACING),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.15, 0.8],
              extrapolate: 'clamp',
            });

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [20, 0, 20],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePress(index)}
              >
                <Animated.Image
                  source={{ uri: item }}
                  style={[
                    styles.thumbnail,
                    {
                      width: ITEM_WIDTH,
                      height: ITEM_WIDTH,
                      marginHorizontal: SPACING / 2,
                      transform: [{ scale }, { translateY }],
                      borderColor:
                        activeIndex === index ? '#043862' : '#fff',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainImage: {
    width: '100%',
    height: height*0.60,
   // borderBottomLeftRadius: 20,
    //borderBottomRightRadius: 20,
  },

  backButton: {
 //   position: 'absolute',
   // top: 50,
    left: 10,
    marginTop:15
  },

  carouselContainer: {
    flex: 1.5,
    justifyContent: 'center',
  },

  thumbnail: {
    borderRadius: 16,
    borderWidth: 3,
  },
});