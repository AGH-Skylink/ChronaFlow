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
  deleteResult,
} from "../../utils/results-utls";
import {
  LoadingState,
  EmptyState,
  DeleteButton,
  ResultRow,
} from "../../components/TestResultComponents";
import { NotesEditor } from "@/components/NotesEditor";
import { resultCardStyles } from "@/constants/resultStyles";

type TestResult = {
  avgInterval: number;
  stdDevInterval: number;
  date: string;
  tapTimestamps: number[] | null;
  notes?: string;
  sessionId?: string | null;
};

const STORAGE_KEY = "regularityTestResults";
const RESULTS_CLEARED_EVENT = "resultsCleared";

const TAP_COUNT = 25;

export const exportRegularityResults = async () => {
  await exportResults({
    storageKey: STORAGE_KEY,
    csvHeader:
      "Day,Time,SessionId,Average Interval (ms),Standard Deviation (ms),Notes," +
      Array.from({ length: TAP_COUNT }, (_, i) => `Timestamp${i + 1}`).join(
        ","
      ) +
      "\n",
    formatRow: (result: TestResult) => {
      const date = new Date(result.date).toLocaleDateString();
      const time = new Date(result.date).toLocaleTimeString();
      const avgInterval = result.avgInterval.toFixed(3);
      const stdDev = result.stdDevInterval.toFixed(3);
      const notes = result.notes || "";
      const sessionId = result.sessionId || "";
      const timestamps =
        result.tapTimestamps != null
          ? Array.from({ length: TAP_COUNT }, (_, i) =>
              result.tapTimestamps![i] !== undefined
                ? result.tapTimestamps![i]
                : ""
            )
          : [];
      return `${date},${time},${sessionId},${avgInterval},${stdDev},"${notes}",${timestamps.join(
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

  const handleDeleteResult = (dateToDelete: string) => {
    deleteResult(STORAGE_KEY, dateToDelete, "date", (updatedResults) => {
      setResults(updatedResults);
    });
  };

  const startEditingNote = (date: string) => {
    setEditingNoteId(date);
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
    <View style={resultCardStyles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="regularity test"
          routePath="/regularity-test"
          onTakeTest={() => router.push("/pages/regularity-test")}
        />
      ) : (
        <ScrollView
          style={resultCardStyles.scrollView}
          contentContainerStyle={resultCardStyles.scrollViewContent}
        >
          {results.map((result, index) => (
            <View key={index} style={resultCardStyles.resultCard}>
              <View style={resultCardStyles.resultHeader}>
                <Text style={resultCardStyles.resultDate}>
                  {formatDate(result.date)}
                </Text>
              </View>

              <ResultRow
                label="Average interval:"
                value={`${result.avgInterval.toFixed(3)} s`}
              />

              <ResultRow
                label="Standard deviation:"
                value={`${result.stdDevInterval.toFixed(3)} s`}
              />

              <NotesEditor
                notes={result.notes}
                isEditing={editingNoteId === result.date}
                onEditStart={() => startEditingNote(result.date)}
                onSave={(noteText) => saveNote(result.date, noteText)}
                onCancel={cancelEditingNote}
              />
              <DeleteButton
                handlePress={() => handleDeleteResult(result.date)}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <StatusBar style="light" />
    </View>
  );
}
