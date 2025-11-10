import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ActiveTestStartProps {
  onStart: () => void;
  testName?: string;
  instructions?: string;
}

const DEFAULT_INSTRUCTIONS = {
  active:
    "You will see an emoji for a certain amount of time. Then you'll need to hold a button for the same duration.",
  passive:
    "You will see an emoji for a certain amount of time. Try to remember how long it was displayed.",
  default: "You will see an emoji for a certain amount of time.",
};

export function ActiveTestStart({
  onStart,
  testName = "Active Test",
  instructions,
}: ActiveTestStartProps) {
  // Determine default instructions based on test name if not provided
  const defaultInstructions = testName.toLowerCase().includes("passive")
    ? DEFAULT_INSTRUCTIONS.passive
    : testName.toLowerCase().includes("active")
    ? DEFAULT_INSTRUCTIONS.active
    : DEFAULT_INSTRUCTIONS.default;

  return (
    <View style={TestStyles.startContainer}>
      <Text style={TestStyles.header}>{testName}</Text>
      <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
        {instructions || defaultInstructions}
      </Text>
      <TouchableOpacity style={TestStyles.primaryButton} onPress={onStart}>
        <Text style={TestStyles.primaryButtonText}>Tap to Begin</Text>
      </TouchableOpacity>
    </View>
  );
}
