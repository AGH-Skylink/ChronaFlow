import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { TestCard } from "@/components/TestCard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Cognitive Assessment</Text>
          <Text style={styles.subtitle}>
            Simple tools to measure cognitive function
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>
            This application provides a suite of cognitive assessment tools
            designed to measure various aspects of neurological function,
            reaction time, and coordination.
          </Text>
          <Text style={styles.paragraph}>
            All tests are designed to be simple to administer and provide
            instant feedback. Results can be used to track changes in cognitive
            function over time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tests</Text>

          <TestCard
            title="Regularity Test"
            description="Test your ability to maintain a regular rhythm by tapping at 1-second intervals."
            icon="hand-o-up"
            onPress={() => router.push("/regularity-test")}
          />
          <TestCard
            title="Passive Test"
            description="Press the button as soon as the object appears to measure your reaction time."
            icon="play-circle"
            onPress={() => router.push("/passive-test")}
          />
          <TestCard
            title="Active Test"
            description="Press the button as soon as the object appears to measure your reaction time."
            icon="eye"
            onPress={() => router.push("/active-test")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  headerSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#e0e0e0",
  },
  subtitle: {
    fontSize: 18,
    color: "#a0aec0",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#e0e0e0",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#a0aec0",
    marginBottom: 16,
  },
  comingSoonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  comingSoon: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6b7280",
  },
});
