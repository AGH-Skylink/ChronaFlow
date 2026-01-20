import React, { useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  View as RNView,
} from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { TestCard } from "@/components/TestCard";
import { ExportService } from "@/src/application/services/ExportService";
import { Ionicons } from "@expo/vector-icons";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { WebFileSharer } from "@/src/infrastructure/export/WebFileSharer";
import { MobileFileSharer } from "@/src/infrastructure/export/MobileFileSharer";
import {
  NoResultsError,
} from "@/src/application/errors/ExportErrors";
import { SPACING, RADIUS, buttons } from "@/constants/Styles";
import { ResponsiveScaffold } from "@/components/layout/ResponsiveScaffold";
import { useResponsive } from "@/hooks/useResponsive";

export default function TestsResultsScreen() {
  const router = useRouter();
  const { isTablet, isDesktop } = useResponsive();
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

  const handleAllAction = async (mode: "save") => {
    if (!exportService.current) {
      return;
    }

    const result = await exportService.current.exportAllResults(mode);
    if (result.success) {
      const actionLabel = mode === "share" ? "shared" : "saved";
      Alert.alert("Success", `Results ${actionLabel} successfully!`);
      return;
    }

    if (result.error instanceof NoResultsError) {
      Alert.alert("No Results", result.error.message);
      return;
    }

    Alert.alert("Error", result.error.message);
  };

  return (
    <ResponsiveScaffold
      scrollable
      contentStyle={[
        styles.contentContainer,
        (isTablet || isDesktop) && styles.contentWide,
      ]}
    >
      <View
        style={[styles.header, (isTablet || isDesktop) && styles.headerWide]}
      >
        <Text style={styles.headerTitle}>Tests Results</Text>
        <Text style={styles.headerSubtitle}>
          View your performance history for each test
        </Text>
      </View>

      <View
        style={[
          styles.actionsRow,
          (isTablet || isDesktop) && styles.actionsRowWide,
        ]}
      >
        <TouchableOpacity
          style={[buttons.secondary, styles.actionButton]}
          activeOpacity={0.9}
          onPress={() => handleAllAction("save")}
        >
          <RNView style={styles.actionButtonContent}>
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={[buttons.buttonText, styles.actionButtonText]}>
              Save All
            </Text>
          </RNView>
        </TouchableOpacity>
      </View>

      <RNView
        style={[
          styles.cardsGrid,
          (isTablet || isDesktop) && styles.cardsGridWide,
        ]}
      >
        <TestCard
          title="Regularity Test Results"
          description="View your history of rhythm maintenance tests"
          icon="hand-o-up"
          onPress={() => router.push("/pages/regularity-results")}
          style={[
            styles.cardWrapper,
            isTablet && styles.cardWrapperTablet,
            isDesktop && styles.cardWrapperDesktop,
          ]}
        />
        <TestCard
          title="Passive Test Results"
          description="View your history of passive exposure tests"
          icon="play-circle"
          onPress={() => router.push("/pages/passive-results")}
          style={[
            styles.cardWrapper,
            isTablet && styles.cardWrapperTablet,
            isDesktop && styles.cardWrapperDesktop,
          ]}
        />
        <TestCard
          title="Active Test Results"
          description="View your history of reaction time tests"
          icon="eye"
          onPress={() => router.push("/pages/active-results")}
          style={[
            styles.cardWrapper,
            isTablet && styles.cardWrapperTablet,
            isDesktop && styles.cardWrapperDesktop,
          ]}
        />
      </RNView>
      <StatusBar style="light" />
    </ResponsiveScaffold>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerWide: {
    paddingHorizontal: 0,
    paddingTop: SPACING.xxxl,
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
  contentContainer: {
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
  },
  contentWide: {
    paddingHorizontal: 0,
  },
  actionButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  actionsRow: {
    width: "100%",
    flexDirection: "column",
    gap: SPACING.sm,
  },
  actionsRowWide: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: SPACING.xs,
  },
  cardsGrid: {
    gap: SPACING.md,
  },
  cardsGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  cardWrapper: {
    width: "100%",
  },
  cardWrapperTablet: {
    width: "48%",
  },
  cardWrapperDesktop: {
    width: "32%",
    minWidth: 320,
  },
});
