import React, { useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { TestCard } from "@/components/TestCard";
import { ExportService } from "@/src/application/services/ExportService";
import { FontAwesome } from "@expo/vector-icons";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { WebFileSharer } from "@/src/infrastructure/export/WebFileSharer";
import { MobileFileSharer } from "@/src/infrastructure/export/MobileFileSharer";
import {
  NoResultsError,
  SharingUnavailableError,
} from "@/src/application/errors/ExportErrors";

export default function TestsResultsScreen() {
  const router = useRouter();
  const exportService = useRef<ExportService | null>(null);

  if (!exportService.current) {
    const storage = new AsyncStorageAdapter();
    const activeRepo = new ResultsRepository("activeTestResults", storage);
    const passiveRepo = new ResultsRepository("passiveTestResults", storage);
    const regularityRepo = new RegularityResultsRepository(
      "regularityTestResults",
      storage
    );
    const sessionRepo = new SessionRepository(storage);
    const fileSharer =
      Platform.OS === "web" ? new WebFileSharer() : new MobileFileSharer();

    exportService.current = new ExportService(
      activeRepo,
      passiveRepo,
      regularityRepo,
      sessionRepo,
      fileSharer
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tests Results</Text>
        <Text style={styles.headerSubtitle}>
          View your performance history for each test
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.exportAllButton}
          onPress={async () => {
            if (!exportService.current) return;

            const result = await exportService.current.exportAllResults();
            if (result.success) {
              Alert.alert("Success", "Results exported successfully!");
            } else {
              if (result.error instanceof NoResultsError) {
                Alert.alert("No Results", result.error.message);
              } else if (result.error instanceof SharingUnavailableError) {
                Alert.alert("Export Complete", result.error.message);
              } else {
                Alert.alert("Error", result.error.message);
              }
            }
          }}
        >
          <FontAwesome
            name="file-excel-o"
            size={18}
            color="white"
            style={styles.exportIcon}
          />
          <Text style={styles.exportAllButtonText}>EXPORT ALL (EXCEL)</Text>
        </TouchableOpacity>

        <TestCard
          title="Regularity Test Results"
          description="View your history of rhythm maintenance tests"
          icon="hand-o-up"
          onPress={() => router.push("/pages/regularity-results")}
        />
        <TestCard
          title="Passive Test Results"
          description="View your history of passive exposure tests"
          icon="play-circle"
          onPress={() => router.push("/pages/passive-results")}
        />
        <TestCard
          title="Active Exposure Test Results"
          description="View your history of reaction time tests"
          icon="eye"
          onPress={() => router.push("/pages/active-results")}
        />
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#e0e0e0",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#a0aec0",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  exportAllButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  exportIcon: {
    marginRight: 10,
  },
  exportAllButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  comingSoonContainer: {
    marginTop: 24,
    alignItems: "center",
    padding: 16,
  },
  comingSoon: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6b7280",
    textAlign: "center",
  },
});
