import React from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "@/components/Themed";

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

          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoon}>More tests coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TestCard({
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
    marginTop: 16,
    alignItems: "center",
  },
  comingSoon: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6b7280",
  },
});
