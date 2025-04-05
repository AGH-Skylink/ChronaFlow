import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { saveTestResult } from "@/utils/storageUtils";
import { COLORS, typography, layout, testArea } from "@/constants/Styles";
import { ResultRow } from "@/components/ResultRow";
import { TestButton } from "@/components/TestButton";
import { ResultsCard } from "@/components/ResultsCard";

export default function RegularityTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [results, setResults] = useState({
    avgInterval: 0,
    stdDevInterval: 0,
    accuracy: 0,
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
    const avgInterval = sum / intervals.length;

    const squaredDiffSum = intervals.reduce(
      (prev, curr) => prev + Math.pow(curr - avgInterval, 2),
      0
    );
    const stdDevInterval = Math.sqrt(squaredDiffSum / intervals.length);

    const targetInterval = 1000; // 1 second in ms
    let accuracy =
      100 - (100 * Math.abs(avgInterval - targetInterval)) / targetInterval;
    accuracy = Math.max(0, Math.min(100, accuracy));

    const resultData = {
      id: Date.now().toString(),
      avgInterval,
      stdDevInterval,
      accuracy,
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
      accuracy: 0,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Tap Test</Text>
        <Text style={styles.instructions}>
          Tap at 1-second intervals for 25 taps.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.tapArea,
          testCompleted ? styles.completedArea : styles.tapAreaActive,
        ]}
        onPress={recordTap}
        activeOpacity={0.8}
      >
        {testCompleted ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Test Completed!</Text>

            <ResultsCard>
              <ResultRow
                label="Average interval"
                value={`${results.avgInterval.toFixed(2)} ms`}
              />
              <View style={styles.divider} />

              <ResultRow
                label="Standard Deviation"
                value={`${results.stdDevInterval.toFixed(2)} ms`}
              />
              <View style={styles.divider} />

              <ResultRow
                label="Timing accuracy"
                value={`${results.accuracy.toFixed(1)}%`}
              />
            </ResultsCard>

            <TestButton title="Start Again" onPress={resetTest} />
          </View>
        ) : (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {testStarted ? "Keep tapping!" : "Tap to begin"}
            </Text>
            {testStarted && (
              <View>
                <Text style={styles.tapCountText}>{tapCount} / 25</Text>
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
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

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    ...typography.header,
    textAlign: "center",
  },
  instructions: {
    ...typography.subtitle,
    textAlign: "center",
  },
  tapArea: {
    ...testArea.container,
  },
  tapAreaActive: {
    ...testArea.active,
  },
  completedArea: {
    ...testArea.completed,
  },
  // Rest of the styles remain the same
  counterContainer: {
    alignItems: "center",
    padding: 20,
  },
  counterText: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  tapCountText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  progressContainer: {
    height: 8,
    width: 200,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  resultsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  divider: {
    ...layout.divider,
  },
});
