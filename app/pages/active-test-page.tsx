import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { TestStyles } from "@/constants/TestStyles";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";
import {
  ActiveTestProvider,
  useActiveTestStateContext,
  useActiveTestOperations,
} from "@/context/ActiveTestContext";
import { useActiveTestHandlers } from "@/hooks/useActiveTestHandlers";
import { useTestPageCleanup } from "@/hooks/useTestPageCleanup";
import { TestStart } from "@/components/exposure-based-test/ExposureBasedTestStart";
import { ActiveTestFlow } from "@/components/active-test/ActiveTestFlow";

interface ActiveTestProps {
  onComplete?: () => void;
  sessionId?: string | null;
}

function ActiveTestContent({ onComplete }: { onComplete?: () => void }) {
  const { state, testName } = useActiveTestStateContext();
  const { reset } = useActiveTestOperations();
  const { dismissKeyboard } = useTestPageCleanup(reset);

  const {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handlePressOut,
    handleNextTest,
  } = useActiveTestHandlers({ onComplete });

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
              instructions="You will see an emoji for a certain duration. Press and hold the screen to match the time you remember."
            />
          ) : (
            <ActiveTestFlow
              isCountdownActive={isCountdownActive}
              onCountdownComplete={handleCountdownComplete}
              onStartTimer={handleStart}
              onEndTimer={handlePressOut}
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

export default function ActiveTestPage({
  onComplete,
  sessionId = null,
}: ActiveTestProps) {
  return (
    <ActiveTestProvider sessionId={sessionId}>
      <ActiveTestContent onComplete={onComplete} />
    </ActiveTestProvider>
  );
}
