import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { RegularityPhase } from "@features/RegularityTest";
import { useRegularityTestStateContext } from "@/context/RegularityTestContext";
import { RegularityTestTappingArea } from "./RegularityTestTappingArea";
import { ResultsCard } from "@/components/ResultsCard";
import { ResultRow } from "@/components/ResultRow";

interface RegularityTestPhaseContentProps {
  isCountdownActive: boolean;
  onTap: () => void;
  onAnalyzeAndNext: () => void;
  nextButtonLabel: string;
  avgInterval: number;
  stdDevInterval: number;
}

/**
 * Routes to the appropriate phase component for Regularity Test
 * Reuses ResultsCard and ResultRow components
 * Only RegularityTestTappingArea is unique to this test type
 */
export function RegularityTestPhaseContent({
  isCountdownActive,
  onTap,
  onAnalyzeAndNext,
  nextButtonLabel,
  avgInterval,
  stdDevInterval,
}: RegularityTestPhaseContentProps) {
  const {
    state: phase,
    tapCount,
    isComplete,
  } = useRegularityTestStateContext();

  return (
    <View style={TestStyles.testArea}>
      {!isComplete && (
        <RegularityTestTappingArea
          tapCount={tapCount}
          onTap={onTap}
          isActive={phase === RegularityPhase.TAPPING}
        />
      )}

      {isComplete && (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={TestStyles.resultsContainer}>
              <Text style={TestStyles.resultsTitle}>Test Completed!</Text>

              <ResultsCard>
                <ResultRow
                  label="Average interval"
                  value={`${avgInterval.toFixed(3)} s`}
                />
                <View style={TestStyles.divider} />

                <ResultRow
                  label="Standard Deviation"
                  value={`${stdDevInterval.toFixed(3)} s`}
                />
              </ResultsCard>

              <TouchableOpacity
                style={TestStyles.resetButton}
                onPress={onAnalyzeAndNext}
              >
                <Text style={TestStyles.resetButtonText}>
                  {nextButtonLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
