import { StyleSheet } from "react-native";
import { COLORS, shadow, typography, layout, buttons, testArea } from "./Styles";

/**
 * Common styles for all cognitive test screens
 */
export const TestStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: 30,
    paddingTop: 50,
  },

  // Text styles
    title: {
    ...typography.title,
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 16,
    },

  // Header styles
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    ...typography.header,
    textAlign: "center",
  },
  instructions: {
    ...typography.subtitle,
    textAlign: "center",
    marginBottom: 5,
  },

  testArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 20,
    ...shadow.large,
  },
  activeArea: {
    backgroundColor: COLORS.background.secondary,
  },
  inactiveArea: {
    backgroundColor: "#242424",
  },

  // Start button container
  testContainer: {
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: "90%",
    borderRadius: 16,
  },
  testText: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    color: COLORS.text.primary,
  },

  // Input styles
  inputContainer: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    overflowY: "scroll",
  },
  inputLabel: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  inputField: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.primary,
    textAlign: "center",
    backgroundColor: "#303030",
    borderRadius: 16,
    padding: 16,
    width: 150,
    ...shadow.medium,
  },
  inputFieldFocused: {
    backgroundColor: "#3b3b3b",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  // Results section
  resultsContainer: {
    width: "100%",
    height: "90%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
  },
  resultsTitle: {
    ...typography.title,
    textAlign: "center",
    fontSize: 26,
    color: COLORS.text.primary,
  },
  resultsCard: {
    width: "100%",
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    ...shadow.small,
  },
  
  // Common elements
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#3d4852",
  },
  emoji: {
    fontSize: 48,
    color: COLORS.text.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
    ...shadow.medium,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },


  // Progress tracking
  progressContainer: {
    height: 8,
    width: 200,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
});
