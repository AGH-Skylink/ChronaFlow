import React from "react";
import { View } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";
import { usePassiveTestStateContext } from "@/context/PassiveTestContext";
import { ActiveTestExposure } from "@/components/exposure-based-test/ExposureBasedTestExposure";
import { PassiveTestInput } from "./PassiveTestInput";
import { ActiveTestResults } from "@/components/exposure-based-test/ExposureBasedTestResults";

interface PassiveTestPhaseContentProps {
  isCountdownActive: boolean;
  onSliderChange: (value: number) => void;
  onCalculateResults: () => void;
  onNext: () => void;
  nextButtonLabel: string;
}

/**
 * Routes to the appropriate phase component for Passive Test
 * Reuses ExposureBasedTestExposure and ExposureBasedTestResults components
 * Only PassiveTestInput is unique to this test type
 */
export function PassiveTestPhaseContent({
  isCountdownActive,
  onSliderChange,
  onCalculateResults,
  onNext,
  nextButtonLabel,
}: PassiveTestPhaseContentProps) {
  const {
    state: phase,
    emoji,
    targetExposure,
    sliderValue,
  } = usePassiveTestStateContext();

  const isResultPhase = phase === ExposureBasedPhase.RESULTS;

  return (
    <View
      style={[
        TestStyles.testArea,
        isResultPhase ? TestStyles.resultsContainer : TestStyles.testContainer,
      ]}
    >
      {phase === ExposureBasedPhase.EXPOSURE && !isCountdownActive && (
        <ActiveTestExposure emoji={emoji} />
      )}
      {phase === ExposureBasedPhase.REPRODUCTION && (
        <PassiveTestInput
          sliderValue={sliderValue}
          onSliderChange={onSliderChange}
          onSubmit={onCalculateResults}
        />
      )}
      {phase === ExposureBasedPhase.RESULTS && (
        <ActiveTestResults
          targetExposure={targetExposure}
          holdDuration={sliderValue}
          onNext={onNext}
          nextButtonLabel={nextButtonLabel}
        />
      )}
    </View>
  );
}
