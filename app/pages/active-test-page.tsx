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
import { ActiveTestStart } from "@/components/exposure-based-test/ExposureBasedTestStart";
import { ActiveTestFlow } from "@/components/active-test/ActiveTestFlow";

interface ActiveTestProps {
  onComplete?: () => void;
  sessionId?: string | null;
}

function ActiveTestContent({ onComplete }: { onComplete?: () => void }) {
  const { state } = useActiveTestStateContext();
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
            <ActiveTestStart onStart={handleStart} />
          ) : (
            <ActiveTestFlow
              testName="Active Test"
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
