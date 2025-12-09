import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

interface ExposureBasedTestStartProps {
  onStart: () => void;
  testName: string;
  instructions?: string;
}

export function TestStart({
  onStart,
  testName,
  instructions,
}: ExposureBasedTestStartProps) {
  return (
    <View style={TestStyles.startContainer}>
      <Text style={TestStyles.header}>{testName}</Text>
      {instructions && (
        <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
          {instructions}
        </Text>
      )}
      <TouchableOpacity style={TestStyles.primaryButton} onPress={onStart}>
        <Text style={TestStyles.primaryButtonText}>Tap to Begin</Text>
      </TouchableOpacity>
    </View>
  );
}
