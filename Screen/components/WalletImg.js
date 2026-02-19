import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { wallet1, wallet2, wallet3, wallet4, wallet5, wallet6, wallet7 } from "../assets";

const frames = [
  // require("./assets/wallet1.png"),
  // require("./assets/wallet2.png"),
  // require("./assets/wallet3.png"),
  // require("./assets/wallet4.png"),
  wallet1,wallet2,wallet3,wallet4,wallet5,wallet6,wallet7
];

export default function WalletAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
    <Image
      source={frames[index]}
      style={{ width: 150, height: 120}}
      resizeMode="contain"
    />
    </View>
  );
}
