import React from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";

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
        <TestResultCard
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

function TestResultCard({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={24} color="#60a5fa" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <FontAwesome
        name="chevron-right"
        size={16}
        color="#6b7280"
        style={styles.cardArrow}
      />
    </TouchableOpacity>
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
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2d3748",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#e0e0e0",
  },
  cardDescription: {
    fontSize: 14,
    color: "#a0aec0",
    lineHeight: 20,
  },
  cardArrow: {
    marginLeft: 8,
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
