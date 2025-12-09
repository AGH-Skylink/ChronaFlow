import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { typography, COLORS } from "@/constants/Styles";

interface SessionLoadingProps {
  message?: string;
}

export function SessionLoading({
  message = "Loading session...",
}: SessionLoadingProps) {
  return (
    <View style={TestStyles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={[typography.subtitle, { marginTop: 20 }]}>{message}</Text>
    </View>
  );
}
