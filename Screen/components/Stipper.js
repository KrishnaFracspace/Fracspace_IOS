import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const Stepper = ({ updates }) => {

  const currentIndex = updates.findIndex(item => !item.completed);

  const itemWidth = width / updates.length;

  return (
    <View style={styles.container}>
      {updates.map((item, index) => {

        const isCompleted = item.completed;
        const isCurrent = index === currentIndex;

        return (
          <View key={index} style={[styles.item, { width: itemWidth }]}>

            {/* Circle */}
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: isCompleted ? '#1C2C6B' : '#fff',
                  borderColor:
                    isCompleted || isCurrent ? '#1C2C6B' : '#D1D5DB',
                  transform: [{ scale: isCurrent ? 1 : 1 }],
                },
              ]}
            >
              {isCompleted && <Text style={styles.tick}>✓</Text>}

              {!isCompleted && isCurrent && (
                <View style={styles.innerDot} />
              )}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                isCompleted && styles.completedLabel,
                isCurrent && styles.activeLabel,
              ]}
            >
              {item.data}
            </Text>

            {/* Line */}
            {index !== updates.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    left: itemWidth / 2,
                    width: itemWidth,
                    backgroundColor:
                      index < currentIndex ? '#1C2C6B' : '#E5E7EB',
                  },
                ]}
              />
            )}

          </View>
        );
      })}
    </View>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
   marginTop: 5,
  },

  item: {
    alignItems: 'center',
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1C2C6B',
  },

  tick: {
    color: '#fff',
    fontSize: 12,
  },

  label: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    color: '#6B7280',
    width: 70,
  },

  line: {
    position: 'absolute',
    top: 10,
    height: 2,
    zIndex: 1,
  },
  label: {
  fontSize: 9,
  textAlign: 'center',
  marginTop: 10,
  color: '#9CA3AF',
  width: 80,
},

completedLabel: {
  color: '#9CA3AF',
  //fontWeight: '600',
   fontSize: 9,
},

activeLabel: {
  color: '#010101',
 // fontWeight: '600',
 fontFamily:'WorkSans-Medium',
  // transform: [{ scale: 1.1 }],
  // textShadowColor: 'rgba(28,44,107,0.25)',
  // textShadowOffset: { width: 0, height: 2 },
  // textShadowRadius: 4,
   fontSize: 10,
},
});