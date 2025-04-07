import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
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

interface TestResult {
  id: string;
  timestamp: number;
  targetExposure: number;
  userInput: number;
  notes?: string;
}

// Storage key and event name constants
const STORAGE_KEY = "passiveTestResults";
const RESULTS_CLEARED_EVENT = "passiveResultsCleared";

export const exportPassiveResults = async () => {
  await exportResults({
    storageKey: STORAGE_KEY,
    csvHeader: "Day,Time,Target Duration (ms),Your Duration (ms),Notes\n",
    formatRow: (result: TestResult) => {
      const date = new Date(result.timestamp).toLocaleString();
      const [day, time] = date.split(", ");
      return `"${day}","${time}",${result.targetExposure},${
        result.userInput
      },"${result.notes || ""}"\n`;
    },
    fileNamePrefix: "passive_test_results",
    dialogTitle: "Save Passive Test Results",
    eventName: RESULTS_CLEARED_EVENT,
  });
};

export const clearPassiveResults = () => {
  clearAllResults(STORAGE_KEY, RESULTS_CLEARED_EVENT);
};

export default function PassiveResultsScreen() {
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

  const startEditingNote = (id: string) => {
    setEditingNoteId(id);
  };

  const saveNote = async (id: string, noteText: string) => {
    try {
      const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (resultsJson) {
        const parsedResults = JSON.parse(resultsJson);
        const updatedResults = parsedResults.map((result: TestResult) =>
          result.id === id ? { ...result, notes: noteText } : result
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));

        // Update local state
        setResults(
          results.map((result) =>
            result.id === id ? { ...result, notes: noteText } : result
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
          testName="passive test"
          routePath="/(tabs)/passive-test"
          onTakeTest={() => router.push("/(tabs)/passive-test")}
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
                  <Text style={styles.resultDate}>
                    {formatDate(result.timestamp)}
                  </Text>
                </View>
              </View>

              <ResultRow
                label="Target duration:"
                value={`${result.targetExposure} ms`}
              />

              <ResultRow
                label="Your duration:"
                value={`${result.userInput} ms`}
              />

              <ResultRow
                label="Difference:"
                value={`${Math.abs(
                  result.userInput - result.targetExposure
                )} ms`}
              />

              {/* Show notes editor only if notes exist or if editing */}
              {(editingNoteId === result.id ||
                (result.notes && result.notes.trim() !== "")) && (
                <NotesEditor
                  notes={result.notes}
                  isEditing={editingNoteId === result.id}
                  onEditStart={() => startEditingNote(result.id)}
                  onSave={(noteText) => saveNote(result.id, noteText)}
                  onCancel={cancelEditingNote}
                />
              )}

              {/* Add notes button if no notes exist and not editing */}
              {!result.notes && editingNoteId !== result.id && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => startEditingNote(result.id)}
                >
                  <Text style={styles.addButtonText}>Add Notes</Text>
                </TouchableOpacity>
              )}

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
  addButton: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
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
