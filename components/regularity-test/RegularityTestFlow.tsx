import React from "react";
import { View, Text } from "react-native";
import { Countdown } from "@/components/Countdown";
import { useRegularityTestStateContext } from "@/context/RegularityTestContext";
import { RegularityTestPhaseContent } from "./RegularityTestPhaseContent";
import { TestStyles } from "@/constants/TestStyles";

interface RegularityTestFlowProps {
  isCountdownActive: boolean;
  onCountdownComplete: () => void;
  onTap: () => void;
  onAnalyzeAndNext: () => void;
  nextButtonLabel: string;
  avgInterval: number;
  stdDevInterval: number;
}

export function RegularityTestFlow({
  isCountdownActive,
  onCountdownComplete,
  onTap,
  onAnalyzeAndNext,
  nextButtonLabel,
  avgInterval,
  stdDevInterval,
}: RegularityTestFlowProps) {
  const {
    state: phase,
    isComplete,
    testName,
  } = useRegularityTestStateContext();

  return (
    <>
      {isCountdownActive && <Countdown onComplete={onCountdownComplete} />}

      <View style={TestStyles.headerContainer}>
        <Text style={TestStyles.header}>{testName}</Text>
        {!isCountdownActive && (
          <Text style={TestStyles.instructions}>
            {isComplete
              ? "Test completed"
              : "Tap the box below at 1-second intervals."}
          </Text>
        )}
      </View>

      <RegularityTestPhaseContent
        isCountdownActive={isCountdownActive}
        onTap={onTap}
        onAnalyzeAndNext={onAnalyzeAndNext}
        nextButtonLabel={nextButtonLabel}
        avgInterval={avgInterval}
        stdDevInterval={stdDevInterval}
      />
    </>
  );
}
