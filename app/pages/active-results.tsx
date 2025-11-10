import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ResultsProvider, useResultsState } from "@/context/ResultsContext";
import {
  LoadingState,
  EmptyState,
} from "../../components/TestResultComponents";
import { ResultsListView } from "@/components/results/ResultsListView";
import { resultCardStyles } from "@/constants/resultStyles";
import { ActiveResult } from "@models/ActiveResult";

const STORAGE_KEY = "activeTestResults";
const EXPORT_CONFIG = {
  storageKey: STORAGE_KEY,
  csvHeader:
    "Day,Time,Session Id,Target Duration (ms),Your Duration (ms),Notes\n",
  formatRow: (result: ActiveResult) => {
    const date = new Date(result.timestamp).toLocaleString();
    const [day, time] = date.split(", ");
    return `"${day}","${time}",${result.sessionId || ""},${
      result.targetDuration
    },${result.userDuration},"${result.notes || ""}"\n`;
  },
  fileNamePrefix: "active_test_results",
  dialogTitle: "Save Active Test Results",
};

function ActiveResultsContent() {
  const router = useRouter();
  const { results, loading } = useResultsState();

  return (
    <View style={resultCardStyles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="active test"
          routePath="/(tabs)/active-test"
          onTakeTest={() => router.push("./pages/active-test-page")}
        />
      ) : (
        <ResultsListView results={results} />
      )}
      <StatusBar style="light" />
    </View>
  );
}

export default function ActiveResultsScreen() {
  return (
    <ResultsProvider storageKey={STORAGE_KEY} exportConfig={EXPORT_CONFIG}>
      <ActiveResultsContent />
    </ResultsProvider>
  );
}
