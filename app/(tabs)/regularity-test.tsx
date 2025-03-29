import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function TapTestScreen() {
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

    setResults({
      avgInterval,
      stdDevInterval,
      accuracy,
    });
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

            <View style={styles.resultsCard}>
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
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetTest}>
              <Text style={styles.resetButtonText}>Start Again</Text>
            </TouchableOpacity>
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

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 30,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#e0e0e0",
  },
  instructions: {
    fontSize: 17,
    textAlign: "center",
    color: "#a0aec0",
    marginBottom: 5,
  },
  tapArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tapAreaActive: {
    backgroundColor: "#1f2937",
  },
  completedArea: {
    backgroundColor: "#242424",
  },
  counterContainer: {
    alignItems: "center",
    padding: 20,
  },
  counterText: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    color: "#e0e0e0",
  },
  tapCountText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#e0e0e0",
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
    backgroundColor: "#60a5fa",
  },
  resultsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  resultsCard: {
    width: "100%",
    backgroundColor: "#2d3748",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e0e0e0",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: "#a0aec0",
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#3d4852",
  },
  resetButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
