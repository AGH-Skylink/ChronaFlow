import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { TestStyles } from "@/constants/TestStyles";
import { ExposureBasedPhase } from "@/src/domain/stp-tests/ExposureBasedTest";
import {
  PassiveTestProvider,
  usePassiveTestStateContext,
  usePassiveTestOperations,
} from "@/context/PassiveTestContext";
import { usePassiveTestHandlers } from "@/hooks/usePassiveTestHandlers";
import { useTestPageCleanup } from "@/hooks/useTestPageCleanup";
import { TestStart } from "@/components/exposure-based-test/ExposureBasedTestStart";
import { PassiveTestFlow } from "@/components/passive-test/PassiveTestFlow";

interface PassiveTestProps {
  onComplete?: () => void;
  sessionId?: string | null;
}

function PassiveTestContent({ onComplete }: { onComplete?: () => void }) {
  const { state, testName } = usePassiveTestStateContext();
  const { reset } = usePassiveTestOperations();
  const { dismissKeyboard } = useTestPageCleanup(reset);

  const {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handleSliderChange,
    handleCalculateResults,
    handleNextTest,
  } = usePassiveTestHandlers({ onComplete });

  const testStarted = state !== ExposureBasedPhase.INACTIVE;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={TestStyles.container}>
          {!testStarted ? (
            <TestStart
              onStart={handleStart}
              testName={testName}
              instructions="You will see an emoji for a certain duration. Try to remember how long it appears."
            />
          ) : (
            <PassiveTestFlow
              isCountdownActive={isCountdownActive}
              onCountdownComplete={handleCountdownComplete}
              onSliderChange={handleSliderChange}
              onCalculateResults={handleCalculateResults}
              onNext={handleNextTest}
              nextButtonLabel={onComplete ? "Next Test" : "Try Again"}
            />
          )}
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default function PassiveTest({
  onComplete,
  sessionId = null,
}: PassiveTestProps) {
  return (
    <PassiveTestProvider sessionId={sessionId}>
      <PassiveTestContent onComplete={onComplete} />
    </PassiveTestProvider>
  );
}
