import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ResultRow } from "../../components/ResultRow";
import { saveTestResult } from "@/utils/storageUtils";
import { TestStyles } from "@/constants/TestStyles";
import { randomEmoji, randomTime } from "@/utils/test-utils";
import { Countdown } from "@/components/Countdown";
import { useFocusEffect } from "@react-navigation/native";

// Define the structure for a test result
interface TestResult {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
  notes?: string;
}

export default function ActiveTest() {
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<"exposure" | "reproduction" | "result">(
    "exposure"
  );
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [holdStart, setHoldStart] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState<number | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>("🌙");

  const handleStart = () => {
    setTestStarted(true);
    setIsCountdownActive(true);
  };

  useEffect(() => {
    if (phase === "exposure" && !isCountdownActive && testStarted) {
      const time = randomTime(1, 5) * 1000;
      setTargetExposure(time);

      setCurrentEmoji(randomEmoji());

      const timer = setTimeout(() => {
        setPhase("reproduction");
      }, time);
      return () => clearTimeout(timer);
    }
  }, [phase, isCountdownActive, testStarted]);

  const handleCountdownComplete = () => {
    setIsCountdownActive(false);
  };

  const handlePressIn = () => {
    if (phase === "reproduction") {
      setHoldStart(Date.now());
    }
  };

  const handlePressOut = () => {
    if (phase === "reproduction" && holdStart) {
      const duration = Date.now() - holdStart;
      setHoldDuration(duration);
      setPhase("result");

      const testResult: TestResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        targetDuration: targetExposure,
        userDuration: duration,
        notes: "", // Keep empty notes field for later editing
      };
      saveTestResult("activeTestResults", testResult);
    }
  };

  const resetTest = () => {
    setTestStarted(false);
    setIsCountdownActive(false);
    setPhase("exposure");
    setTargetExposure(0);
    setHoldStart(null);
    setHoldDuration(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (phase === "result") {
          resetTest();
        }
      };
    }, [phase])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={TestStyles.container}>
          {!testStarted ? (
            <View style={TestStyles.startContainer}>
              <Text style={TestStyles.header}>Active Test</Text>
              <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
                You will see an emoji for a certain amount of time. Then you'll
                need to hold a button for the same duration.
              </Text>
              <TouchableOpacity
                style={TestStyles.primaryButton}
                onPress={handleStart}
              >
                <Text style={TestStyles.primaryButtonText}>Tap to Begin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {isCountdownActive && (
                <Countdown onComplete={handleCountdownComplete} />
              )}

              <View style={TestStyles.headerContainer}>
                <Text style={TestStyles.header}>Active Test</Text>
                {phase === "exposure" && !isCountdownActive && (
                  <Text style={TestStyles.instructions}>
                    Try to remember the exposure time.
                  </Text>
                )}
              </View>

              <View
                style={[
                  TestStyles.testArea,
                  phase === "result"
                    ? TestStyles.resultsContainer
                    : TestStyles.testContainer,
                ]}
              >
                {phase === "exposure" && !isCountdownActive && (
                  <View style={TestStyles.testContainer}>
                    <Text style={TestStyles.testText}>
                      Watch the exposure...
                    </Text>
                    <Text style={TestStyles.emoji}>{currentEmoji}</Text>
                  </View>
                )}
                {phase === "reproduction" && (
                  <View style={TestStyles.testContainer}>
                    <Text style={TestStyles.testText}>
                      Replicate the exposure duration by holding the button.
                    </Text>
                    <TouchableOpacity
                      style={TestStyles.resetButton}
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                    >
                      <Text style={TestStyles.resetButtonText}>Hold</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {phase === "result" && (
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
                          value={`${targetExposure} ms`}
                        />
                        <View style={TestStyles.divider} />

                        <ResultRow
                          label="Your Duration"
                          value={`${holdDuration} ms`}
                        />
                      </View>

                      <TouchableOpacity
                        style={TestStyles.resetButton}
                        onPress={resetTest}
                      >
                        <Text style={TestStyles.resetButtonText}>
                          Try Again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>
            </>
          )}
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
