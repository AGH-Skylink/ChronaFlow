import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SessionBlock } from "@/types/session";
import { COLORS } from "@/constants/Styles";

interface BlockListItemProps {
  block: SessionBlock;
  index: number;
  isActive: boolean;
}

export function BlockListItem({ block, index, isActive }: BlockListItemProps) {
  const getTestTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      active: "Active Test",
      passive: "Passive Test",
      regularity: "Regularity Test",
    };
    return typeMap[type] || "Unknown Test";
  };

  return (
    <View style={[styles.blockItem, isActive && styles.currentBlockItem]}>
      <Text style={styles.blockNumber}>{index + 1}</Text>
      <Text style={styles.blockName}>{getTestTypeName(block.type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentBlockItem: {
    backgroundColor: COLORS.background.tertiary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  blockNumber: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    textAlign: "center",
    lineHeight: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginRight: 12,
  },
  blockName: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
});
