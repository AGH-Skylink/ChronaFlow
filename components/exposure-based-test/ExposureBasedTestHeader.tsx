import React from "react";
import { View, Text } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";

interface ExposureBasedTestHeaderProps {
  testName: string;
  phase: ExposureBasedPhase;
  isCountdownActive: boolean;
}

export function ExposureBasedTestHeader({
  testName,
  phase,
  isCountdownActive,
}: ExposureBasedTestHeaderProps) {
  const showInstructions =
    phase === ExposureBasedPhase.EXPOSURE && !isCountdownActive;

  return (
    <View style={TestStyles.headerContainer}>
      <Text style={TestStyles.header}>{testName}</Text>
      {showInstructions && (
        <Text style={TestStyles.instructions}>
          Try to remember the exposure time.
        </Text>
      )}
    </View>
  );
}
