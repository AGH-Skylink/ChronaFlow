import { StyleSheet } from "react-native";
import { COLORS, typography, layout, buttons, testArea, SPACING, RADIUS, ELEVATION } from "./Styles";
import { TEST_COLORS } from "./Colors";

/**
 * Enhanced styles for all cognitive test screens
 * Modern, consistent, and visually appealing
 */
export const TestStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  regularityContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },

  // Text styles
  title: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: SPACING.md,
  },

  // Header styles
  headerContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  header: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  instructions: {
    ...typography.bodyLarge,
    textAlign: "center",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    lineHeight: 28,
  },

  // Enhanced test area
  testArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
    borderWidth: 2,
  },
  testAreaFull: {
    width: "100%",
    alignSelf: "stretch",
    padding: SPACING.sm,
    marginBottom: 0,
    borderWidth: 0,
  },
  activeArea: {
    backgroundColor: COLORS.background.secondary,
    borderColor: COLORS.primary,
    ...ELEVATION.large,
  },
  inactiveArea: {
    backgroundColor: COLORS.background.secondary,
    borderColor: COLORS.borderSubtle,
    opacity: 0.7,
  },

  // Start button container
  testContainer: {
    backgroundColor: COLORS.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
    height: "90%",
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  regularityTapTouchable: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
  },
  regularityTapContainer: {
    flex: 1,
    width: "100%",
    padding: SPACING.md,
    margin: 0,
    height: "100%",
  },
  testText: {
    ...typography.h3,
    textAlign: "center",
    marginBottom: SPACING.md,
  },

  // Enhanced input styles
  inputContainer: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  inputLabel: {
    ...typography.h4,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  inputField: {
    ...typography.h3,
    textAlign: "center",
    backgroundColor: COLORS.background.elevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: 150,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
  },
  inputFieldFocused: {
    backgroundColor: COLORS.background.elevated,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...ELEVATION.colored,
  },

  // Enhanced results section
  resultsContainer: {
    width: "100%",
    height: "90%",
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  resultsTitle: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  resultsCard: {
    width: "100%",
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.small,
  },
  
  // Common elements
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: COLORS.borderSubtle,
    marginVertical: SPACING.sm,
  },
  emoji: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  // Enhanced buttons
  primaryButton: {
    ...buttons.primary,
    width: "80%",
    paddingVertical: SPACING.md,
  },
  secondaryButton: {
    ...buttons.secondary,
    width: "80%",
    paddingVertical: SPACING.md,
  },
  outlineButton: {
    ...buttons.primaryOutline,
    width: "80%",
    paddingVertical: SPACING.md,
  },
  disabledButton: {
    ...buttons.disabled,
    width: "80%",
  },
  primaryButtonText: {
    ...buttons.buttonText,
    fontSize: 17,
    fontWeight: "700",
  },
  resetButton: {
    ...buttons.large,
  },
  resetButtonText: {
    ...buttons.buttonTextLarge,
  },

  // Enhanced progress bar
  progressContainer: {
    height: 12,
    width: 240,
    backgroundColor: COLORS.background.elevated,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  progressBarRegularity: {
    height: "100%",
    backgroundColor: TEST_COLORS.regularity.primary,
    borderRadius: RADIUS.full,
  },
  progressBarPassive: {
    height: "100%",
    backgroundColor: TEST_COLORS.passive.primary,
    borderRadius: RADIUS.full,
  },
  progressBarActive: {
    height: "100%",
    backgroundColor: TEST_COLORS.active.primary,
    borderRadius: RADIUS.full,
  },

  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  // Enhanced slider value
  sliderValue: {
    ...typography.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontWeight: '700',
  },
  
  // Countdown styles
  countdownText: {
    ...typography.display,
    color: COLORS.primary,
    fontWeight: '800',
  },
  
  // Phase indicator
  phaseIndicator: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background.elevated,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  phaseText: {
    ...typography.labelSmall,
    color: COLORS.text.secondary,
  },
});
