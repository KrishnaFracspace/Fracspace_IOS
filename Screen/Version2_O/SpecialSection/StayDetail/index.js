import React from 'react';
import Placeholder from '../Placeholder';

// Placeholder — Section 3 (StayDetail.dc.html) replaces this file.
export default function StayDetail({navigation}) {
  return (
    <Placeholder
      title="Stay Detail"
      note="Stay detail and booking sheet."
      navigation={navigation}
      links={[{label: 'Review booking', onPress: () => navigation.navigate('StayReview')}]}
    />
  );
}
