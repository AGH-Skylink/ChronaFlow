import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { resultsCard } from "@/constants/Styles";

interface ResultsCardProps {
  children: ReactNode;
}

export function ResultsCard({ children }: ResultsCardProps) {
  return <View style={styles.resultsCard}>{children}</View>;
}

const styles = StyleSheet.create({
  resultsCard: {
    ...resultsCard.container,
  },
});
