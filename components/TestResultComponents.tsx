import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading results...</Text>
  </View>
);

export const EmptyState = ({
  onTakeTest,
  testName,
  routePath,
}: {
  onTakeTest: () => void;
  testName: string;
  routePath: string;
}) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No test results found</Text>
    <Text style={styles.emptySubtext}>
      Complete the {testName} to see your results here
    </Text>
    <TouchableOpacity style={styles.takeTestButton} onPress={onTakeTest}>
      <Text style={styles.takeTestButtonText}>Take Test Now</Text>
    </TouchableOpacity>
  </View>
);

export const DeleteButton = ({ handlePress }: { handlePress: () => void }) => (
  <View style={styles.deleteButtonContainer}>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        handlePress();
      }}
    >
      <FontAwesome name="trash" size={18} color="#f87171" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

export const ResultRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.resultRow}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#a0aec0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#a0aec0",
    textAlign: "center",
    marginBottom: 24,
  },
  takeTestButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  takeTestButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2d3748",
    paddingTop: 12,
    alignItems: "flex-end",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  deleteButtonText: {
    color: "#f87171",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 15,
    color: "#a0aec0",
  },
  resultValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e0e0e0",
  },
});
