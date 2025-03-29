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

type TestResult = {
  avgInterval: number;
  stdDevInterval: number;
  accuracy: number;
  date: string;
};

export default function RegularityResultsScreen() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();

    // Register event listener for results cleared
    const listener = EventRegister.addEventListener("resultsCleared", () => {
      // When results are cleared, update the UI by setting empty results
      setResults([]);
    });

    // Clean up listener when component unmounts
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const resultsJson = await AsyncStorage.getItem("regularityTestResults");

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
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
            Complete the regularity test to see your results here
          </Text>
          <TouchableOpacity
            style={styles.takeTestButton}
            onPress={() => router.push("/regularity-test")}
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
                <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
                <View style={styles.accuracyBadge}>
                  <Text style={styles.accuracyText}>
                    {result.accuracy.toFixed(1)}% accuracy
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Average interval:</Text>
                <Text style={styles.resultValue}>
                  {result.avgInterval.toFixed(2)} ms
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Standard deviation:</Text>
                <Text style={styles.resultValue}>
                  {result.stdDevInterval.toFixed(2)} ms
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
  resultDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e0e0e0",
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
