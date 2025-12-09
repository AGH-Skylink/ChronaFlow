import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, ELEVATION, typography } from "./Styles";
import { SEMANTIC, TEST_COLORS } from "./Colors";

/**
 * Enhanced styles for result displays and data visualization
 */
export const resultCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  
  // Modern result card with elevation
  resultCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  
  // Highlighted result card (for good performance)
  resultCardSuccess: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: SEMANTIC.success.main,
    ...ELEVATION.large,
  },
  
  // Warning result card (for concerning results)
  resultCardWarning: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: SEMANTIC.warning.main,
    ...ELEVATION.large,
  },
  
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  resultDate: {
    ...typography.label,
    color: COLORS.text.primary,
  },
  headerRightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  addButtonText: {
    ...typography.labelSmall,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
  dateEmojiContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  
  // Metric display styles
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  metricLabel: {
    ...typography.body,
    color: COLORS.text.secondary,
  },
  metricValue: {
    ...typography.h4,
    color: COLORS.text.primary,
    fontWeight: "700",
  },
  metricValueSuccess: {
    ...typography.h4,
    color: SEMANTIC.success.main,
    fontWeight: "700",
  },
  metricValueWarning: {
    ...typography.h4,
    color: SEMANTIC.warning.main,
    fontWeight: "700",
  },
  
  // Badge styles for test types
  testTypeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    marginBottom: SPACING.sm,
  },
  regularityBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: TEST_COLORS.regularity.primary,
  },
  passiveBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: TEST_COLORS.passive.primary,
  },
  activeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: TEST_COLORS.active.primary,
  },
  badgeText: {
    ...typography.labelSmall,
    fontWeight: "700",
  },
  
  // Stats card for summary views
  statsCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsLabel: {
    ...typography.caption,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsValue: {
    ...typography.h3,
    color: COLORS.text.primary,
    fontWeight: "700",
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xxl,
  },
  emptyStateText: {
    ...typography.bodyLarge,
    color: COLORS.text.tertiary,
    textAlign: "center",
    marginTop: SPACING.md,
  },
});
