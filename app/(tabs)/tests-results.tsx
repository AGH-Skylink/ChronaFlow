import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { TestCard } from "@/components/TestCard";
import { exportAllResults } from "@/utils/results-utls";
import { FontAwesome } from "@expo/vector-icons";

export default function TestsResultsScreen() {
  const router = useRouter();

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
          onPress={exportAllResults}
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
