import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ActiveTestReproductionProps {
  onPressIn: () => void;
  onPressOut: () => void;
}

export function ActiveTestReproduction({
  onPressIn,
  onPressOut,
}: ActiveTestReproductionProps) {
  return (
    <View style={TestStyles.testContainer}>
      <Text style={TestStyles.testText}>
        Replicate the exposure duration by holding the button.
      </Text>
      <TouchableOpacity
        style={TestStyles.resetButton}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text style={TestStyles.resetButtonText}>Hold</Text>
      </TouchableOpacity>
    </View>
  );
}
