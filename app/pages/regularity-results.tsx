import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  RegularityResultsProvider,
  useRegularityResultsState,
} from "@/context/RegularityResultsContext";
import {
  LoadingState,
  EmptyState,
} from "../../components/TestResultComponents";
import { RegularityResultsListView } from "@/components/results/RegularityResultsListView";
import { resultCardStyles } from "@/constants/resultStyles";
import { RegularityResult } from "@/src/domain/models/RegularityResult";

const STORAGE_KEY = "regularityTestResults";
const TAP_COUNT = 25;

const EXPORT_CONFIG = {
  storageKey: STORAGE_KEY,
  csvHeader:
    "Day,Time,SessionId,Average Interval (ms),Standard Deviation (ms),Notes," +
    Array.from({ length: TAP_COUNT }, (_, i) => `Timestamp${i + 1}`).join(",") +
    "\n",
  formatRow: (result: RegularityResult) => {
    const date = new Date(result.timestamp).toLocaleDateString();
    const time = new Date(result.timestamp).toLocaleTimeString();
    const avgInterval = result.avgInterval.toFixed(3);
    const stdDev = result.stdDevInterval.toFixed(3);
    const notes = result.notes || "";
    const sessionId = result.sessionId || "";
    const timestamps = Array.from({ length: TAP_COUNT }, (_, i) =>
      result.tapTimestamps[i] !== undefined ? result.tapTimestamps[i] : ""
    );
    return `${date},${time},${sessionId},${avgInterval},${stdDev},"${notes}",${timestamps.join(
      ","
    )}\n`;
  },
  fileNamePrefix: "regularity_test_results",
  dialogTitle: "Save Regularity Test Results",
};

function RegularityResultsContent() {
  const router = useRouter();
  const { results, loading } = useRegularityResultsState();

  return (
    <View style={resultCardStyles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="regularity test"
          routePath="/regularity-test"
          onTakeTest={() => router.push("./pages/regularity-test-page")}
        />
      ) : (
        <RegularityResultsListView results={results} />
      )}
      <StatusBar style="light" />
    </View>
  );
}

export default function RegularityResultsScreen() {
  return (
    <RegularityResultsProvider
      storageKey={STORAGE_KEY}
      exportConfig={EXPORT_CONFIG}
    >
      <RegularityResultsContent />
    </RegularityResultsProvider>
  );
}
