import React from "react";
import { View } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";
import { useActiveTestStateContext } from "@/context/ActiveTestContext";
import { ExposureBasedTestExposure } from "@/components/exposure-based-test/ExposureBasedTestExposure";
import { ActiveTestInput } from "@/components/active-test/ActiveTestInput";
import { ExposureBasedTestResult } from "@/components/exposure-based-test/ExposureBasedTestResults";

interface ActiveTestPhaseContentProps {
  isCountdownActive: boolean;
  onStartTimer: () => void;
  onEndTimer: () => void;
  onNext: () => void;
  nextButtonLabel: string;
}

export function ActiveTestPhaseContent({
  isCountdownActive,
  onStartTimer,
  onEndTimer,
  onNext,
  nextButtonLabel,
}: ActiveTestPhaseContentProps) {
  const {
    state: phase,
    emoji,
    targetExposure,
    holdDuration,
  } = useActiveTestStateContext();
  const isResultPhase = phase === ExposureBasedPhase.RESULTS;

  return (
    <View
      style={[
        TestStyles.testArea,
        isResultPhase ? TestStyles.resultsContainer : TestStyles.testContainer,
      ]}
    >
      {phase === ExposureBasedPhase.EXPOSURE && !isCountdownActive && (
        <ExposureBasedTestExposure emoji={emoji} />
      )}
      {phase === ExposureBasedPhase.REPRODUCTION && (
        <ActiveTestInput onPressIn={onStartTimer} onPressOut={onEndTimer} />
      )}
      {phase === ExposureBasedPhase.RESULTS && (
        <ExposureBasedTestResult
          targetExposure={targetExposure}
          holdDuration={holdDuration}
          onNext={onNext}
          nextButtonLabel={nextButtonLabel}
        />
      )}
    </View>
  );
}
