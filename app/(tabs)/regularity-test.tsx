import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { saveTestResult } from "@/utils/storageUtils";
import { ResultRow } from "@/components/ResultRow";
import { TestButton } from "@/components/TestButton";
import { ResultsCard } from "@/components/ResultsCard";
import { TestStyles } from "@/constants/TestStyles";
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
import { Countdown } from "@/components/Countdown";

const TAP_COUNT = 25;

export default function RegularityTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [results, setResults] = useState({
    avgInterval: 0,
    stdDevInterval: 0,
  });

  const handleStart = () => {
    setTestStarted(true);
    setIsCountdownActive(true);
  };

  const handleCountdownComplete = () => {
    setIsCountdownActive(false);
  };

  const recordTap = () => {
    if (testCompleted || !testStarted || isCountdownActive) return;

    const timestamp = Date.now();
    setTapCount((prevCount) => {
      const newCount = prevCount + 1;
      setTapTimestamps((prev) => [...prev, timestamp]);

      if (newCount >= TAP_COUNT) {
        setTestCompleted(true);
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (testCompleted && tapTimestamps.length >= 2) {
      analyzeResults();
    }
  }, [testCompleted]);

  const analyzeResults = () => {
    const intervals = [];
    for (let i = 1; i < tapTimestamps.length; i++) {
      intervals.push(tapTimestamps[i] - tapTimestamps[i - 1]);
    }

    const sum = intervals.reduce((prev, curr) => prev + curr, 0);
    const avgInterval = sum / intervals.length / 1000; // in seconds

    const squaredDiffs = intervals.map((interval) => {
      const diff = interval - avgInterval * 1000; // convert avgInterval to milliseconds
      return diff * diff;
    });
    const squaredDiffSum = squaredDiffs.reduce((prev, curr) => prev + curr, 0);
    const stdDevInterval = Math.sqrt(squaredDiffSum / intervals.length) / 1000; // in seconds

    const relativeTapTimestamps = tapTimestamps.map(
      (t) => t - tapTimestamps[0]
    );
    const resultData = {
      id: Date.now().toString(),
      avgInterval,
      stdDevInterval,
      date: new Date().toISOString(),
      tapTimestamps: relativeTapTimestamps, // in milliseconds
      notes: "",
    };

    setResults(resultData);
    saveTestResult("regularityTestResults", resultData);
  };

  const resetTest = () => {
    setTestStarted(false);
    setIsCountdownActive(false);
    setTestCompleted(false);
    setTapCount(0);
    setTapTimestamps([]);
    setResults({
      avgInterval: 0,
      stdDevInterval: 0,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={TestStyles.container}>
          {!testStarted ? (
            <View style={TestStyles.startContainer}>
              <Text style={TestStyles.header}>Regularity Test</Text>
              <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
                Try to tap the screen at regular 1-second intervals. You will
                need to complete {TAP_COUNT} taps to finish the test.
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
                <Text style={TestStyles.header}>Regularity Test</Text>
                {testCompleted ? (
                  <Text style={TestStyles.instructions}>Test completed</Text>
                ) : (
                  <Text style={TestStyles.instructions}>
                    Tap the screen at 1-second intervals.
                  </Text>
                )}
              </View>

              {testCompleted ? (
                <ScrollView
                  style={{ flex: 1, width: "100%" }}
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                >
                  <TouchableOpacity activeOpacity={1}>
                    <View style={TestStyles.resultsContainer}>
                      <Text style={TestStyles.resultsTitle}>
                        Test Completed!
                      </Text>

                      <ResultsCard>
                        <ResultRow
                          label="Average interval"
                          value={`${results.avgInterval.toFixed(3)} s`}
                        />
                        <View style={TestStyles.divider} />

                        <ResultRow
                          label="Standard Deviation"
                          value={`${results.stdDevInterval.toFixed(3)} s`}
                        />
                      </ResultsCard>

                      <TestButton title="Start Again" onPress={resetTest} />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <TouchableOpacity onPress={recordTap} activeOpacity={0.8}>
                  <View style={TestStyles.testContainer}>
                    <Text style={TestStyles.testText}>
                      {tapCount} / {TAP_COUNT}
                    </Text>
                    <View style={TestStyles.progressContainer}>
                      <View
                        style={[
                          TestStyles.progressBar,
                          { width: `${(tapCount / TAP_COUNT) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
