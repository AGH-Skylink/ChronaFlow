import React from "react";
import { View, Text } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ActiveTestExposureProps {
  emoji: string;
}

export function ActiveTestExposure({ emoji }: ActiveTestExposureProps) {
  return (
    <View style={TestStyles.testContainer}>
      <Text style={TestStyles.testText}>Watch the exposure...</Text>
      <Text style={TestStyles.emoji}>{emoji}</Text>
    </View>
  );
}
