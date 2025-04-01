import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResultRow } from "../../components/TestResultComponents";

// Array of space-related emojis
const spaceEmojis = [
  "🌙", // moon
  "🌑", // new moon
  "🌓", // first quarter moon
  "🌕", // full moon
  "🌠", // shooting star
  "⭐", // star
  "🌟", // glowing star
  "🪐", // saturn/ringed planet
  "🚀", // rocket
  "🛸", // flying saucer
  "🌌", // milky way
  "☄️", // comet
];

// Define the structure for a test result
interface TestResult {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
  accuracy: number;
  emoji: string;
}

export default function ActiveTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<"exposure" | "reproduction" | "result">(
    "exposure"
  );
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [holdStart, setHoldStart] = useState<number | null>(null);
  const [holdDuration, setHoldDuration] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>("🌙");

  useEffect(() => {
    if (phase === "exposure") {
      const randomExposure = Math.floor(Math.random() * 2000) + 1000;
      setTargetExposure(randomExposure);

      const randomIndex = Math.floor(Math.random() * spaceEmojis.length);
      setCurrentEmoji(spaceEmojis[randomIndex]);

      const timer = setTimeout(() => {
        setPhase("reproduction");
      }, randomExposure);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handlePressIn = () => {
    if (phase === "reproduction") {
      setHoldStart(Date.now());
    }
  };

  const saveTestResult = async (result: TestResult) => {
    try {
      const existingResultsJSON = await AsyncStorage.getItem("activeTest");
      const existingResults: TestResult[] = existingResultsJSON
        ? JSON.parse(existingResultsJSON)
        : [];

      const updatedResults = [result, ...existingResults];

      await AsyncStorage.setItem("activeTest", JSON.stringify(updatedResults));
      console.log("Test result saved successfully");
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  const handlePressOut = () => {
    if (phase === "reproduction" && holdStart) {
      const duration = Date.now() - holdStart;
      setHoldDuration(duration);
      const error = Math.abs(duration - targetExposure);
      const calcAccuracy = Math.max(100 - (error / targetExposure) * 100, 0);
      const roundedAccuracy = Math.round(calcAccuracy);
      setAccuracy(roundedAccuracy);
      setPhase("result");

      // Save the test result
      const testResult: TestResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        targetDuration: targetExposure,
        userDuration: duration,
        accuracy: roundedAccuracy,
        emoji: currentEmoji,
      };
      saveTestResult(testResult);
    }
  };

  const resetTest = () => {
    setPhase("exposure");
    setTargetExposure(0);
    setHoldStart(null);
    setHoldDuration(null);
    setAccuracy(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Active Test</Text>
        <Text style={styles.instructions}>
          Try to replicate the duration shown by the symbol.
        </Text>
      </View>

      <View
        style={[
          styles.testArea,
          phase === "result" ? styles.completedArea : styles.testAreaActive,
        ]}
      >
        {phase === "exposure" && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Watch the exposure...</Text>
            <Text style={styles.emoji}>{currentEmoji}</Text>
          </View>
        )}
        {phase === "reproduction" && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              Replicate the exposure duration by holding the button.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.resetButtonText}>Hold</Text>
            </TouchableOpacity>
          </View>
        )}
        {phase === "result" && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Test Completed!</Text>

            <View style={styles.resultsCard}>
              <ResultRow
                label="Target Duration"
                value={`${targetExposure} ms`}
              />
              <View style={styles.divider} />

              <ResultRow label="Your Duration" value={`${holdDuration} ms`} />
              <View style={styles.divider} />

              <ResultRow label="Accuracy" value={`${accuracy}%`} />
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetTest}>
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resetButton,
                { backgroundColor: "#475569", marginTop: 8 },
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.resetButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  testArea: {
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
  testAreaActive: {
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
    textAlign: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 32,
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
