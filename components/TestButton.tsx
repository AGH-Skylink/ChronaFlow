import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS, buttons } from "@/constants/Styles";

interface TestButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TestButton({
  title,
  onPress,
  type = "primary",
  style,
  textStyle,
}: TestButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "primary" ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.background.tertiary,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
