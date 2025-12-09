import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import {
  resultsCard,
  COLORS,
  SPACING,
  RADIUS,
  ELEVATION,
} from "@/constants/Styles";

interface ResultsCardProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "elevated";
}

export function ResultsCard({
  children,
  variant = "default",
}: ResultsCardProps) {
  const cardStyle = [
    styles.resultsCard,
    variant === "success" && styles.successCard,
    variant === "warning" && styles.warningCard,
    variant === "elevated" && styles.elevatedCard,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  resultsCard: {
    ...resultsCard.container,
  },
  successCard: {
    borderWidth: 2,
    borderColor: "#22c55e",
    backgroundColor: COLORS.background.tertiary,
  },
  warningCard: {
    borderWidth: 2,
    borderColor: "#f59e0b",
    backgroundColor: COLORS.background.tertiary,
  },
  elevatedCard: {
    ...ELEVATION.large,
    backgroundColor: COLORS.background.elevated,
  },
});
