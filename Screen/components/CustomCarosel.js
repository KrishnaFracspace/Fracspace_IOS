import React, { useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Animated,
  StyleSheet,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);   // ← This fixes the error

const CustomCarousel = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        keyExtractor={(item, index) => `carousel-${index}`}
        contentContainerStyle={styles.contentContainer}
        
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [2, 0.9, 2],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.card}
                imageStyle={styles.image}
                resizeMode="cover"
              >
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              </ImageBackground>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  cardContainer: {
    width: 10,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  card: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  textContainer: {
    padding: 18,
    paddingBottom: 22,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default CustomCarousel;