import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { TestStyles } from "@/constants/TestStyles";
import { RegularityPhase } from "@features/RegularityTest";
import {
  RegularityTestProvider,
  useRegularityTestStateContext,
  useRegularityTestOperations,
} from "@/context/RegularityTestContext";
import { useRegularityTestHandlers } from "@/hooks/useRegularityTestHandlers";
import { useTestPageCleanup } from "@/hooks/useTestPageCleanup";
import { ActiveTestStart } from "@/components/exposure-based-test/ExposureBasedTestStart";
import { RegularityTestFlow } from "@/components/regularity-test/RegularityTestFlow";

interface RegularityTestProps {
  onComplete?: () => void;
  sessionId?: string | null;
}

function RegularityTestContent({ onComplete }: { onComplete?: () => void }) {
  const { state, avgInterval, stdDevInterval } =
    useRegularityTestStateContext();
  const { reset } = useRegularityTestOperations();
  const { dismissKeyboard } = useTestPageCleanup(reset);

  const {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handleTap,
    handleAnalyzeAndNext,
  } = useRegularityTestHandlers({ onComplete });

  const testStarted = state !== RegularityPhase.INACTIVE;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={TestStyles.container}>
          {!testStarted ? (
            <ActiveTestStart
              onStart={handleStart}
              testName="Regularity Test"
              instructions="Try to tap the screen at regular 1-second intervals. You will need to complete 25 taps to finish the test."
            />
          ) : (
            <RegularityTestFlow
              testName="Regularity Test"
              isCountdownActive={isCountdownActive}
              onCountdownComplete={handleCountdownComplete}
              onTap={handleTap}
              onAnalyzeAndNext={handleAnalyzeAndNext}
              nextButtonLabel={onComplete ? "Next Test" : "Try Again"}
              avgInterval={avgInterval}
              stdDevInterval={stdDevInterval}
            />
          )}
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default function RegularityTest({
  onComplete,
  sessionId = null,
}: RegularityTestProps) {
  return (
    <RegularityTestProvider sessionId={sessionId}>
      <RegularityTestContent onComplete={onComplete} />
    </RegularityTestProvider>
  );
}
