import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
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
import { resultCardStyles } from "@/constants/resultStyles";

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

    const listener = EventRegister.addEventListener(
      RESULTS_CLEARED_EVENT,
      () => {
        setResults([]);
      }
    );

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
    <View style={resultCardStyles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="passive test"
          routePath="/(tabs)/passive-test"
          onTakeTest={() => router.push("/pages/passive-test")}
        />
      ) : (
        <ScrollView
          style={resultCardStyles.scrollView}
          contentContainerStyle={resultCardStyles.scrollViewContent}
        >
          {results.map((result, index) => (
            <View key={index} style={resultCardStyles.resultCard}>
              <View style={resultCardStyles.resultHeader}>
                <View style={resultCardStyles.dateEmojiContainer}>
                  <Text style={resultCardStyles.resultDate}>
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

              <NotesEditor
                notes={result.notes}
                isEditing={editingNoteId === result.id}
                onEditStart={() => startEditingNote(result.id)}
                onSave={(noteText) => saveNote(result.id, noteText)}
                onCancel={cancelEditingNote}
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
