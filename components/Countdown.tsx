import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface CountdownProps {
  initialCount?: number;
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({
  initialCount = 3,
  onComplete,
}) => {
  const [count, setCount] = useState(initialCount);
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (count > 0) {
      // Animate the number scaling
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();

      // Decrease count after 1 second
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // When count reaches 0, call the onComplete callback
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.getReadyText}>Get Ready</Text>
      <Animated.Text
        style={[styles.countText, { transform: [{ scale: animation }] }]}
      >
        {count}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a202c",
    zIndex: 10,
  },
  getReadyText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  countText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#4299e1",
  },
});
