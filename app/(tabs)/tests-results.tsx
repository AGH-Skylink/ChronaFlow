import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { TestCard } from "@/components/TestCard";

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
        <TestCard
          title="Regularity Test Results"
          description="View your history of rhythm maintenance tests"
          icon="hand-o-up"
          onPress={() => router.push("/pages/regularity-results")}
        />

        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoon}>
            More test results will appear here as you try new tests
          </Text>
        </View>
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
