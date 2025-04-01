import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { EventRegister } from "react-native-event-listeners";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type TestResult = {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
  accuracy: number;
  emoji: string;
};

export const exportResults = async () => {
  try {
    const resultsJson = await AsyncStorage.getItem("activeTest");

    if (resultsJson) {
      const parsedResults = JSON.parse(resultsJson);

      let csvContent =
        "Date,Emoji,Target Duration (ms),Your Duration (ms),Accuracy (%)\n";

      parsedResults.forEach((result: TestResult) => {
        const date = new Date(result.timestamp).toLocaleString();
        const targetDuration = result.targetDuration;
        const userDuration = result.userDuration;
        const accuracy = result.accuracy;
        const emoji = result.emoji;

        csvContent += `"${date}","${emoji}",${targetDuration},${userDuration},${accuracy}\n`;
      });

      const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `active_test_results_${fileDate}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, csvContent);

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: "Save Active Test Results",
          UTI: "public.comma-separated-values-text",
        });

        console.log(`File exported: ${filePath}`);
      } else {
        Alert.alert("Export Complete", `Results exported to: ${filePath}`, [
          { text: "OK" },
        ]);
      }
    } else {
      Alert.alert("No results found", "There are no test results to export.");
    }
  } catch (error) {
    console.error("Error exporting results:", error);
    Alert.alert("Error", "Failed to export results. Please try again.");
  }
};

export const clearAllResults = () => {
  Alert.alert(
    "Clear All Results",
    "Are you sure you want to delete all test results? This action cannot be undone.",
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
            await AsyncStorage.removeItem("activeTest");
            console.log("All results cleared");

            EventRegister.emit("activeResultsCleared", true);

            Alert.alert("Success", "All results have been cleared.", [
              { text: "OK" },
            ]);
          } catch (error) {
            console.error("Error clearing results:", error);
            Alert.alert("Error", "Failed to clear results. Please try again.");
          }
        },
      },
    ]
  );
};

export default function ActiveResultsScreen() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();

    // Register event listener for results cleared
    const listener = EventRegister.addEventListener(
      "activeResultsCleared",
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
      const resultsJson = await AsyncStorage.getItem("activeTest");

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

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // Function to determine the background color for the accuracy badge
  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 90) return "#15803d"; // Green for high accuracy
    if (accuracy >= 70) return "#1e40af"; // Blue for good accuracy
    if (accuracy >= 50) return "#a16207"; // Amber for moderate accuracy
    return "#b91c1c"; // Red for low accuracy
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No test results found</Text>
          <Text style={styles.emptySubtext}>
            Complete the active test to see your results here
          </Text>
          <TouchableOpacity
            style={styles.takeTestButton}
            onPress={() => router.push("/(tabs)/active-test")}
          >
            <Text style={styles.takeTestButtonText}>Take Test Now</Text>
          </TouchableOpacity>
        </View>
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
                    { backgroundColor: getAccuracyBadgeColor(result.accuracy) },
                  ]}
                >
                  <Text style={styles.accuracyText}>
                    {result.accuracy}% accuracy
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Target duration:</Text>
                <Text style={styles.resultValue}>
                  {result.targetDuration} ms
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Your duration:</Text>
                <Text style={styles.resultValue}>{result.userDuration} ms</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Difference:</Text>
                <Text style={styles.resultValue}>
                  {Math.abs(result.userDuration - result.targetDuration)} ms
                </Text>
              </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#a0aec0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#a0aec0",
    textAlign: "center",
    marginBottom: 24,
  },
  takeTestButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  takeTestButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 15,
    color: "#a0aec0",
  },
  resultValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e0e0e0",
  },
});
