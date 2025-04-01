import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { EventRegister } from "react-native-event-listeners";
import {
  exportResults,
  clearAllResults,
  formatDate,
} from "../../utils/test-results-utils";
import {
  LoadingState,
  EmptyState,
  DeleteButton,
  ResultRow,
} from "../../components/TestResultComponents";

type TestResult = {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
  accuracy: number;
  emoji: string;
};

// Storage key and event name constants
const STORAGE_KEY = "activeTest";
const RESULTS_CLEARED_EVENT = "activeResultsCleared";

export const exportActiveResults = async () => {
  await exportResults({
    storageKey: STORAGE_KEY,
    csvHeader:
      "Date,Emoji,Target Duration (ms),Your Duration (ms),Accuracy (%)\n",
    formatRow: (result: TestResult) => {
      const date = new Date(result.timestamp).toLocaleString();
      return `"${date}","${result.emoji}",${result.targetDuration},${result.userDuration},${result.accuracy}\n`;
    },
    fileNamePrefix: "active_test_results",
    dialogTitle: "Save Active Test Results",
    eventName: RESULTS_CLEARED_EVENT,
  });
};

export const clearActiveResults = () => {
  clearAllResults(STORAGE_KEY, RESULTS_CLEARED_EVENT);
};

export default function ActiveResultsScreen() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();

    // Register event listener for results cleared
    const listener = EventRegister.addEventListener(
      RESULTS_CLEARED_EVENT,
      () => {
        // When results are cleared, update the UI by setting empty results
        setResults([]);
      }
    );

    // Clean up listener when component unmounts
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);

      if (resultsJson) {
        const parsedResults = JSON.parse(resultsJson);
        // Sort results by timestamp (newest first)
        const sortedResults = parsedResults.sort(
          (a: TestResult, b: TestResult) => b.timestamp - a.timestamp
        );
        setResults(sortedResults);
      }
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 90) return "#15803d"; // Green for high accuracy
    if (accuracy >= 70) return "#1e40af"; // Blue for good accuracy
    if (accuracy >= 50) return "#a16207"; // Amber for moderate accuracy
    return "#b91c1c"; // Red for low accuracy
  };

  const deleteResult = (idToDelete: string) => {
    Alert.alert(
      "Delete Result",
      "Are you sure you want to delete this result?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);

              if (resultsJson) {
                const parsedResults = JSON.parse(resultsJson);
                const updatedResults = parsedResults.filter(
                  (result: TestResult) => result.id !== idToDelete
                );

                await AsyncStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify(updatedResults)
                );

                setResults(updatedResults);
                console.log("Result deleted successfully");
              }
            } catch (error) {
              console.error("Error deleting result:", error);
              Alert.alert(
                "Error",
                "Failed to delete result. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="active test"
          routePath="/(tabs)/active-test"
          onTakeTest={() => router.push("/(tabs)/active-test")}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.dateEmojiContainer}>
                  <Text style={styles.emoji}>{result.emoji}</Text>
                  <Text style={styles.resultDate}>
                    {formatDate(result.timestamp)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.accuracyBadge,
                    {
                      backgroundColor: getAccuracyBadgeColor(result.accuracy),
                    },
                  ]}
                >
                  <Text style={styles.accuracyText}>
                    {result.accuracy}% accuracy
                  </Text>
                </View>
              </View>

              <ResultRow
                label="Target duration:"
                value={`${result.targetDuration} ms`}
              />

              <ResultRow
                label="Your duration:"
                value={`${result.userDuration} ms`}
              />

              <ResultRow
                label="Difference:"
                value={`${Math.abs(
                  result.userDuration - result.targetDuration
                )} ms`}
              />

              <DeleteButton onPress={() => deleteResult(result.id)} />
            </View>
          ))}
        </ScrollView>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3748",
  },
  dateEmojiContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
  resultDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e0e0e0",
  },
  accuracyBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0e0",
  },
});
