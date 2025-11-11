import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { ResultRow } from "@/components/ResultRow";

interface ExposureBasedTestResultsProps {
  targetExposure: number;
  holdDuration: number | null;
  onNext: () => void;
  nextButtonLabel?: string;
}

export function ExposureBasedTestResult({
  targetExposure,
  holdDuration,
  onNext,
  nextButtonLabel = "Try Again",
}: ExposureBasedTestResultsProps) {
  const difference =
    holdDuration === null ? null : Math.abs(holdDuration - targetExposure);

  return (
    <ScrollView
      style={{ flex: 1, width: "100%" }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <View style={TestStyles.resultsContainer}>
        <Text style={TestStyles.title}>Test Completed!</Text>

        <View style={TestStyles.resultsCard}>
          <ResultRow
            label="Target Duration"
            value={targetExposure ? `${targetExposure} ms` : "--"}
          />
          <View style={TestStyles.divider} />

          <ResultRow
            label="Your Duration"
            value={holdDuration !== null ? `${holdDuration} ms` : "--"}
          />
          {difference !== null && (
            <>
              <View style={TestStyles.divider} />
              <ResultRow label="Difference" value={`${difference} ms`} />
            </>
          )}
        </View>

        <TouchableOpacity style={TestStyles.resetButton} onPress={onNext}>
          <Text style={TestStyles.resetButtonText}>{nextButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
