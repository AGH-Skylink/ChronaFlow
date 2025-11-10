import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ActiveTestStartProps {
  onStart: () => void;
}

export function ActiveTestStart({ onStart }: ActiveTestStartProps) {
  return (
    <View style={TestStyles.startContainer}>
      <Text style={TestStyles.header}>Active Test</Text>
      <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
        You will see an emoji for a certain amount of time. Then you'll need to
        hold a button for the same duration.
      </Text>
      <TouchableOpacity style={TestStyles.primaryButton} onPress={onStart}>
        <Text style={TestStyles.primaryButtonText}>Tap to Begin</Text>
      </TouchableOpacity>
    </View>
  );
}
