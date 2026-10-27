import React from 'react';
import Placeholder from '../Placeholder';

// Placeholder — Section 2 (Stays.dc.html) replaces this file.
export default function Stays({navigation}) {
  return (
    <Placeholder
      title="Stays"
      note="Stays listing — explore / bookings."
      navigation={navigation}
      links={[{label: 'Open a stay', onPress: () => navigation.navigate('StayDetail')}]}
    />
  );
}
