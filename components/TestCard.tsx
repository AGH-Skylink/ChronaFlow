import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type TestCardProps = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
  highlight?: boolean; // Add this prop
};

export function TestCard({
  title,
  description,
  icon,
  onPress,
  highlight = false,
}: TestCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, highlight && styles.highlightCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: "#000",
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
  highlightCard: {
    borderColor: "#3498db",
    borderWidth: 2,
    backgroundColor: "rgba(52, 152, 219, 0.1)",
  },
});
