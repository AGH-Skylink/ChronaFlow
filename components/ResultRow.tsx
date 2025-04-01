import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 12,
      },
      resultLabel: {
        fontSize: 16,
        color: "#a0aec0",
      },
      resultValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#e0e0e0",
      },
});