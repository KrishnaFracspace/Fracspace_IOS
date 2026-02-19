import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';

const SkeletonBox = ({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const bg = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E6EBF0', '#F2F5F8'],
  });

  return (
    <Animated.View
      style={[
        styles.box,
        {width, height, borderRadius: radius, backgroundColor: bg},
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  box: {
    marginVertical: 6,
  },
});

export default SkeletonBox;
