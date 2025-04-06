import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { saveTestResult } from "@/utils/storageUtils";
import { ResultRow } from "@/components/ResultRow";
import { TestButton } from "@/components/TestButton";
import { ResultsCard } from "@/components/ResultsCard";
import { TestStyles } from "@/constants/TestStyles";
import { View, Text, TouchableOpacity } from "react-native";

export default function RegularityTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [results, setResults] = useState({
    avgInterval: 0,
    stdDevInterval: 0,
  });

  const recordTap = () => {
    if (testCompleted) return;

    const timestamp = Date.now();

    if (!testStarted) {
      setTestStarted(true);
    }

    setTapCount((prevCount) => {
      const newCount = prevCount + 1;
      setTapTimestamps((prev) => [...prev, timestamp]);

      if (newCount >= 25) {
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

    const squaredDiffSum = intervals.reduce(
      (prev, curr) => prev + Math.pow(curr - avgInterval, 2),
      0
    );
    const stdDevInterval = Math.sqrt(squaredDiffSum / intervals.length) / 1000; // in seconds

    const targetInterval = 1000; // 1 second in ms

    const resultData = {
      id: Date.now().toString(),
      avgInterval,
      stdDevInterval,
      date: new Date().toISOString(),
    };

    setResults(resultData);
    saveTestResult("regularityTestResults", resultData);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setTapCount(0);
    setTapTimestamps([]);
    setResults({
      avgInterval: 0,
      stdDevInterval: 0,
    });
  };

  return (
    <View style={TestStyles.container}>
      <View style={TestStyles.headerContainer}>
        <Text style={TestStyles.header}>Tap Test</Text>
        {testCompleted ? (
          <Text style={TestStyles.instructions}>Test completed</Text>
        ) : (
          <Text style={TestStyles.instructions}>
            Tap the screen at 1-second intervals.
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={recordTap} activeOpacity={0.8}>
        {testCompleted ? (
          <View style={TestStyles.resultsContainer}>
            <Text style={TestStyles.resultsTitle}>Test Completed!</Text>

            <ResultsCard>
              <ResultRow
                label="Average interval"
                value={`${results.avgInterval.toFixed(2)} s`}
              />
              <View style={TestStyles.divider} />

              <ResultRow
                label="Standard Deviation"
                value={`${results.stdDevInterval.toFixed(2)} s`}
              />
            </ResultsCard>

            <TestButton title="Start Again" onPress={resetTest} />
          </View>
        ) : (
          <View style={TestStyles.testContainer}>
            {testStarted ? null : (
              <Text style={TestStyles.testText}>Tap to begin</Text>
            )}
            {testStarted && (
              <View>
                <Text style={TestStyles.testText}>{tapCount} / 25</Text>
                <View style={TestStyles.progressContainer}>
                  <View
                    style={[
                      TestStyles.progressBar,
                      { width: `${(tapCount / 25) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
      <StatusBar style="light" />
    </View>
  );
}
