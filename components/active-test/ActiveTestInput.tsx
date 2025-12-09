import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ActiveTestReproductionInput {
  onPressIn: () => void;
  onPressOut: () => void;
}

export function ActiveTestInput({
  onPressIn,
  onPressOut,
}: ActiveTestReproductionInput) {
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
