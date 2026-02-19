import React from 'react';
import { View, Text } from 'react-native';
import AnimatedDigit from './AnimatedDigit';

const splitDigits = (value, length = 2) => {
  return value.toString().padStart(length, '0').split('');
};

// const TimeUnit = ({ value, label }) => {
//   const digits = splitDigits(value);

//   return (
//     <View style={{ alignItems: 'center' }}>
//       <View style={{ flexDirection: 'row' }}>
//         {digits.map((digit, index) => (
//           <AnimatedDigit
//             key={`${index}-${digit}`} // ⭐ MAGIC LINE
//             digit={digit}
//           />
//         ))}
//       </View>

//       <Text style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// const TimeUnit = ({ value, label }) => {
//   const digits = splitDigits(value);

//   return (
//     <View style={{ alignItems: 'center' }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           minWidth: 52,
//           justifyContent: 'center',
//         }}
//       >
//         {digits.map((digit, index) => (
//           <AnimatedDigit
//             key={`${index}-${digit}`}
//             digit={digit}
//           />
//         ))}
//       </View>

//       <Text style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };


const TimeUnit = ({ value, label }) => {
  const digits = splitDigits(value);

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', minWidth: 52 }}>
        {digits.map((digit, index) => (
          <AnimatedDigit
            key={`${index}-${digit}`}
            digit={digit}
          />
        ))}
      </View>

      <Text style={{fontFamily:'Montserrat-Regular', fontSize: 12, color: '#ffffff89', marginTop: 6 }}>
        {label}
      </Text>
    </View>
  );
};


export default TimeUnit;
