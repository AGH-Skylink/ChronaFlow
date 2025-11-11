import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TestStyles } from "@/constants/TestStyles";
import { typography, COLORS } from "@/constants/Styles";

interface SessionErrorProps {
  error: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function SessionError({ error, onRetry, onBack }: SessionErrorProps) {
  return (
    <View style={TestStyles.container}>
      <Ionicons name="alert-circle" size={64} color={COLORS.error} />
      <Text style={[TestStyles.title, { marginTop: 20 }]}>Error</Text>
      <Text
        style={[typography.subtitle, { textAlign: "center", marginTop: 10 }]}
      >
        {error}
      </Text>

      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity
            style={[TestStyles.primaryButton, styles.button]}
            onPress={onRetry}
          >
            <Text style={TestStyles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}

        {onBack && (
          <TouchableOpacity
            style={[TestStyles.resetButton, styles.button]}
            onPress={onBack}
          >
            <Text style={TestStyles.resetButtonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 30,
    gap: 12,
    width: "100%",
    alignItems: "center",
  },
  button: {
    minWidth: 200,
  },
});
