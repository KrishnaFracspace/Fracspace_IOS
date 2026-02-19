import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';

export default function CalenderAcc({visible,handleDayPress,selectedDates}) {
    // const [selectedDates, setSelectedDates] = useState({});
    const [isVisible, setIsVisible] = useState(visible);
 

    useEffect(() => {
        // When the visible prop changes, trigger the appropriate animation
        if (visible) {
            setIsVisible(true);
            //   slideIn();
        }else{
            setIsVisible(false);
        }
    }, [visible]);

    if (!isVisible) return null;
    return (
        <View>

            <Calendar
                // Date marked as selected
                markedDates={selectedDates}
                // Handler for day press event
                onDayPress={handleDayPress}
                markingType={'simple'} // or 'period'
            />
        </View>
    )
}

