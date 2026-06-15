import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PaymentPlan = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    //const selected = selectedIndex === index && index === 0;
 const isTenLakh = index === 0; 

    return (
      <View
       // onPress={() => setSelectedIndex(index)}
        style={[
          styles.card,
          {
            backgroundColor: isTenLakh ? "rgba(2, 18, 101, 1)" : "#fff",
          },
        ]}
      >
        <Text
          style={[
            styles.timeline,
            { color: isTenLakh ? "#fff" : "rgba(2, 18, 101, 0.6)" },
          ]}
        >
          {item?.timeline}
        </Text>

        <Text
          style={[
            styles.amount,
            { color: isTenLakh ? "#fff" : "rgba(2, 18, 101, 1)" },
          ]}
        >
          {item?.amount}
        </Text>

        <Text
          style={[
            styles.description,
            { color: isTenLakh ? "#fff" : "rgba(2, 18, 101, 0.6)" },
          ]}
        >
          {item?.description}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
    scrollEnabled={false}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(_, index) => index.toString()} // ✅ use index
      renderItem={renderItem}
    />
  );
};

export default PaymentPlan;

const styles = StyleSheet.create({
  card: {
    width: 85,
    padding: 16,
    marginRight: 10,
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,

    // ✅ CLEAN FIGMA SHADOW
    shadowColor: '#02060d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom:15,
    
  },
  timeline: {
    fontSize: 10,
    //fontWeight: "600",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  description: {
    fontSize: 10,
  },
});