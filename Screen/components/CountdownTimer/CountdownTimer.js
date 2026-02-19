import React from 'react';
import { Text, View } from 'react-native';
// import useCountdown from '../../hooks/useCountdown';
import TimeUnit from './TimeUnit';
import useCountdown from './useCountDown';

// const CountdownTimer = () => {
//   const targetDate = Date.now() + 1000 * 60 * 60 * 5; // 5 hrs from now
//   const { days, hours, minutes, seconds } = useCountdown(targetDate);

//   if (seconds === undefined) return null;

//   return (
//     <View style={{ flexDirection: 'row', gap: 16 }}>
//       <TimeUnit value={days} label="Days" />
//       <TimeUnit value={hours} label="Hours" />
//       <TimeUnit value={minutes} label="Min" />
//       <TimeUnit value={seconds} label="Sec" />
//     </View>
//   );
// };

const CountdownTimer = ({ endTime }) => {
  const targetDate = new Date(endTime).getTime();
//   console.log("endtime: ",endTime)
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  if (seconds === undefined) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{backgroundColor:'#00000040',paddingBottom:8,paddingHorizontal:5,borderRadius:5}}>
        <TimeUnit value={days} label="Days" />
      </View>
      {/* <Text style={{fontSize:45,color:'#FFF',marginTop:-7}}>:</Text> */}
      <View style={{backgroundColor:'#00000040',paddingBottom:8,paddingHorizontal:5,borderRadius:5}}>
        <TimeUnit value={hours} label="Hours" />
      </View>
      {/* <Text style={{fontSize:45,color:'#FFF',marginTop:-7}}>:</Text> */}
      <View style={{backgroundColor:'#00000040',paddingBottom:8,paddingHorizontal:5,borderRadius:5}}>
        <TimeUnit value={minutes} label="Min" />
      </View>
      {/* <Text style={{fontSize:45,color:'#FFF',marginTop:-7}}>:</Text> */}
      <View style={{backgroundColor:'#00000040',paddingBottom:8,paddingHorizontal:5,borderRadius:5}}>
        <TimeUnit value={seconds} label="Sec" />
      </View>
    </View>
  );
};


export default CountdownTimer;
