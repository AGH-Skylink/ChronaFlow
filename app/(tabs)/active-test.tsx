import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ResultRow } from "../../components/ResultRow";
import { saveTestResult } from "@/utils/storageUtils";
import { TestStyles } from "@/constants/TestStyles";
import { randomEmoji, randomTime } from "@/utils/test-utils";

// Define the structure for a test result
interface TestResult {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
}

export default function ActiveTest() {
  const [phase, setPhase] = useState<"exposure" | "reproduction" | "result">(
    "exposure"
  );
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [holdStart, setHoldStart] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState<number | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>("🌙");

  useEffect(() => {
    if (phase === "exposure") {
      const time = randomTime(1, 5) * 1000;
      setTargetExposure(time);

      setCurrentEmoji(randomEmoji());

      const timer = setTimeout(() => {
        setPhase("reproduction");
      }, time);
      return () => clearTimeout(timer);
    }
  }, [phase]);

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
      };
      saveTestResult("activeTestResults", testResult);
    }
  };

  const resetTest = () => {
    setPhase("exposure");
    setTargetExposure(0);
    setHoldStart(null);
    setHoldDuration(null);
  };

  return (
    <View style={TestStyles.container}>
      <View style={TestStyles.headerContainer}>
        <Text style={TestStyles.header}>Active Test</Text>
        {phase === "exposure" && (
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
        {phase === "exposure" && (
          <View style={TestStyles.testContainer}>
            <Text style={TestStyles.testText}>Watch the exposure...</Text>
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
          <View style={TestStyles.resultsContainer}>
            <Text style={TestStyles.title}>Test Completed!</Text>

            <View style={TestStyles.resultsCard}>
              <ResultRow
                label="Target Duration"
                value={`${targetExposure} ms`}
              />
              <View style={TestStyles.divider} />

              <ResultRow label="Your Duration" value={`${holdDuration} ms`} />
            </View>

            <TouchableOpacity
              style={TestStyles.resetButton}
              onPress={resetTest}
            >
              <Text style={TestStyles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}
