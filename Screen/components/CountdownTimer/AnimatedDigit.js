import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const digitAnimations = {
  enter: {
    from: { opacity: 0, translateY: 8 },
    to: { opacity: 1, translateY: 0 },
  },
  exit: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: -8 },
  },
};


const AnimatedDigit = ({ digit }) => {
  return (
    <View
      style={{
        width: 26,
        height: 48,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Incoming digit */}
      <Animatable.Text
        key={`in-${digit}`}
        animation={{
          from: { opacity: 0, translateY: 8 },
          to: { opacity: 1, translateY: 0 },
        }}
        duration={300}
        easing="ease-out-cubic"
        useNativeDriver
        style={{
          position: 'absolute',
          fontSize: 38,
          fontFamily:"Montserrat-SemiBold",
        //   fontWeight: '700',
          color: '#FFF',
        }}
      >
        {digit}
      </Animatable.Text>
    </View>
  );
};




export default AnimatedDigit;
