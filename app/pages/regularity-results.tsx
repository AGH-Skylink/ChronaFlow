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
} from "../../utils/results-utls";
import {
  LoadingState,
  EmptyState,
  DeleteButton,
  ResultRow,
} from "../../components/TestResultComponents";
import { NotesEditor } from "@/components/NotesEditor";

type TestResult = {
  avgInterval: number;
  stdDevInterval: number;
  accuracy: number;
  date: string;
  tapTimestamps: number[];
  notes?: string;
};

const STORAGE_KEY = "regularityTestResults";
const RESULTS_CLEARED_EVENT = "resultsCleared";

export const exportRegularityResults = async () => {
  await exportResults({
    storageKey: STORAGE_KEY,
    csvHeader:
      "Day,Time,Average Interval (ms),Standard Deviation (ms),Notes," +
      Array.from({ length: 25 }, (_, i) => `Timestamp${i + 1}`).join(",") +
      "\n",
    formatRow: (result: TestResult) => {
      const date = new Date(result.date).toLocaleDateString();
      const time = new Date(result.date).toLocaleTimeString();
      const avgInterval = result.avgInterval.toFixed(2);
      const stdDev = result.stdDevInterval.toFixed(2);
      const notes = result.notes || "";
      const timestamps = Array.from({ length: 25 }, (_, i) =>
        result.tapTimestamps[i] !== undefined ? result.tapTimestamps[i] : ""
      );
      return `${date},${time},${avgInterval},${stdDev},"${notes}",${timestamps.join(
        ","
      )}\n`;
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
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

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

  const startEditingNote = (date: string) => {
    setEditingNoteId(date); // Use date as ID
  };

  const saveNote = async (date: string, noteText: string) => {
    try {
      const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (resultsJson) {
        const parsedResults = JSON.parse(resultsJson);
        const updatedResults = parsedResults.map((result: TestResult) =>
          result.date === date ? { ...result, notes: noteText } : result
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));

        // Update local state
        setResults(
          results.map((result) =>
            result.date === date ? { ...result, notes: noteText } : result
          )
        );

        setEditingNoteId(null);
        console.log("Note saved successfully");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
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
              </View>

              <ResultRow
                label="Average interval:"
                value={`${result.avgInterval.toFixed(2)} ms`}
              />

              <ResultRow
                label="Standard deviation:"
                value={`${result.stdDevInterval.toFixed(2)} ms`}
              />

              {/* Show notes editor if editing or if notes exist */}
              {(editingNoteId === result.date ||
                (result.notes && result.notes.trim() !== "")) && (
                <NotesEditor
                  notes={result.notes}
                  isEditing={editingNoteId === result.date}
                  onEditStart={() => startEditingNote(result.date)}
                  onSave={(noteText) => saveNote(result.date, noteText)}
                  onCancel={cancelEditingNote}
                />
              )}

              {/* Add notes button if no notes exist and not editing */}
              {!result.notes && editingNoteId !== result.date && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => startEditingNote(result.date)}
                >
                  <Text style={styles.addButtonText}>Add Notes</Text>
                </TouchableOpacity>
              )}

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
  addButton: {
    marginTop: 12,
    backgroundColor: "#1e40af",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0e0",
  },
});
