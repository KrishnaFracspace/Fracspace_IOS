import React from 'react';
import Placeholder from '../Placeholder';

// Placeholder — Section 4 (StayReview.dc.html) replaces this file.
export default function StayReview({navigation}) {
  return (
    <Placeholder
      title="Review Booking"
      note="Price breakdown, confirm and success."
      navigation={navigation}
      links={[{label: 'Done', onPress: () => navigation.navigate('HomeStack', {screen: 'HomePage'})}]}
    />
  );
}
