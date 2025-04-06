import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { typography } from "@/constants/Styles";

interface ResultRowProps {
  label: string;
  value: string;
}

export function ResultRow({ label, value }: ResultRowProps) {
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
    ...typography.label,
  },
  resultValue: {
    ...typography.value,
  },
});
