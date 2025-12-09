import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useNavigation } from "expo-router";
import {
  ResultsProvider,
  useResultsState,
  useResultsOperations,
} from "@/context/ResultsContext";
import {
  LoadingState,
  EmptyState,
} from "../../components/TestResultComponents";
import { ExposureBasedResultsListView } from "@/components/results/ExposureBasedResultsListView";
import { resultCardStyles } from "@/constants/resultStyles";
import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import { ResultsMenu } from "@/components/ResultsExtraOptionsMenu";

const STORAGE_KEY = "passiveTestResults";
const EXPORT_CONFIG = {
  storageKey: STORAGE_KEY,
  csvHeader:
    "Day,Time,Session Id,Target Duration (ms),Your Duration (ms),Notes\n",
  formatRow: (result: ExposureBasedResult) => {
    const date = new Date(result.timestamp).toLocaleString();
    const [day, time] = date.split(", ");
    return `"${day}","${time}",${result.sessionId || ""},${
      result.targetDuration
    },${result.userDuration},"${result.notes || ""}"\n`;
  },
  fileNamePrefix: "passive_test_results",
  dialogTitle: "Save Passive Test Results",
};

function PassiveResultsContent() {
  const router = useRouter();
  const navigation = useNavigation();
  const { results, loading } = useResultsState();
  const operations = useResultsOperations();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ResultsMenu
          onExport={operations.exportResults}
          onClearAll={operations.clearAll}
        />
      ),
    });
  }, [navigation, operations]);

  return (
    <View style={resultCardStyles.container}>
      {loading ? (
        <LoadingState />
      ) : results.length === 0 ? (
        <EmptyState
          testName="passive test"
          routePath="/pages/passive-test-page"
          onTakeTest={() => router.push("/pages/passive-test-page")}
        />
      ) : (
        <ExposureBasedResultsListView results={results} />
      )}
      <StatusBar style="light" />
    </View>
  );
}

export default function PassiveResultsScreen() {
  return (
    <ResultsProvider storageKey={STORAGE_KEY} exportConfig={EXPORT_CONFIG}>
      <PassiveResultsContent />
    </ResultsProvider>
  );
}
