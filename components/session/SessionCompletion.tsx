import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TestStyles } from "@/constants/TestStyles";
import { COLORS, typography } from "@/constants/Styles";

interface SessionCompletionProps {
  sessionName: string;
  onExit: () => void;
}

export function SessionCompletion({
  sessionName,
  onExit,
}: SessionCompletionProps) {
  return (
    <View style={styles.container}>
      <View style={TestStyles.resultsContainer}>
        <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
        <Text style={TestStyles.title}>Session Completed!</Text>
        <Text style={typography.subtitle}>
          You've completed all tests in "{sessionName}".
        </Text>

        <TouchableOpacity style={TestStyles.primaryButton} onPress={onExit}>
          <Text style={TestStyles.primaryButtonText}>Return to Sessions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 50,
    height: "100%",
    paddingBottom: 0,
  },
});
