import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
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
  avgInterval: number;
  stdDevInterval: number;
  accuracy: number;
  date: string;
};

// Storage key and event name constants
const STORAGE_KEY = "regularityTestResults";
const RESULTS_CLEARED_EVENT = "resultsCleared";

export const exportRegularityResults = async () => {
  await exportResults({
    storageKey: STORAGE_KEY,
    csvHeader:
      "Date,Average Interval (ms),Standard Deviation (ms),Accuracy (%)\n",
    formatRow: (result: TestResult) => {
      const date = new Date(result.date).toLocaleString();
      const avgInterval = result.avgInterval.toFixed(2);
      const stdDev = result.stdDevInterval.toFixed(2);
      const accuracy = result.accuracy.toFixed(1);
      return `${date},${avgInterval},${stdDev},${accuracy}\n`;
    },
    fileNamePrefix: "regularity_test_results",
    dialogTitle: "Save Regularity Test Results",
    eventName: RESULTS_CLEARED_EVENT,
  });
};

export const clearRegularityResults = () => {
  clearAllResults(STORAGE_KEY, RESULTS_CLEARED_EVENT);
};

export default function RegularityResultsScreen() {
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
        // Sort results by date (newest first)
        const sortedResults = parsedResults.sort(
          (a: TestResult, b: TestResult) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setResults(sortedResults);
      }
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = (dateToDelete: string) => {
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
                  (result: TestResult) => result.date !== dateToDelete
                );

                // Save updated results
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
          testName="regularity test"
          routePath="/regularity-test"
          onTakeTest={() => router.push("/regularity-test")}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
                <View style={styles.accuracyBadge}>
                  <Text style={styles.accuracyText}>
                    {result.accuracy.toFixed(1)}% accuracy
                  </Text>
                </View>
              </View>

              <ResultRow
                label="Average interval:"
                value={`${result.avgInterval.toFixed(2)} ms`}
              />

              <ResultRow
                label="Standard deviation:"
                value={`${result.stdDevInterval.toFixed(2)} ms`}
              />

              <DeleteButton onPress={() => deleteResult(result.date)} />
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
  resultDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e0e0e0",
  },
  headerRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  accuracyBadge: {
    backgroundColor: "#1e40af",
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
