import React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import { TestStyles } from "@/constants/TestStyles";

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
  style,
  textStyle,
}: TestButtonProps) {
  return (
    <TouchableOpacity
      style={[TestStyles.primaryButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[TestStyles.primaryButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
