import { StyleSheet } from 'react-native';
import { BRAND, DARK_BACKGROUNDS, TEXT, SEMANTIC, BORDERS, SHADOWS, TEST_COLORS } from './Colors';

/**
 * Enhanced Design System for ChronaFlow
 * Modern, consistent, and scalable styling
 */

// Color palette (enhanced with new system)
export const COLORS = {
  primary: BRAND.primary,
  primaryLight: BRAND.primaryLight,
  primaryDark: BRAND.primaryDark,
  secondary: BRAND.secondary,
  background: {
    primary: DARK_BACKGROUNDS.primary,
    secondary: DARK_BACKGROUNDS.secondary,
    tertiary: DARK_BACKGROUNDS.tertiary,
    elevated: DARK_BACKGROUNDS.elevated,
    glass: DARK_BACKGROUNDS.glass,
  },
  text: {
    primary: TEXT.primary,
    secondary: TEXT.secondary,
    tertiary: TEXT.tertiary,
    disabled: TEXT.disabled,
  },
  border: BORDERS.default,
  borderSubtle: BORDERS.subtle,
  borderEmphasis: BORDERS.emphasis,
  success: SEMANTIC.success.main,
  warning: SEMANTIC.warning.main,
  error: SEMANTIC.error.main,
  info: SEMANTIC.info.main,
};

// Spacing system (8pt grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius system
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Elevation (shadow) system
export const ELEVATION = {
  small: {
    shadowColor: SHADOWS.small,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: SHADOWS.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: SHADOWS.large,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    shadowColor: SHADOWS.colored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
};



// Enhanced typography system (8pt scale)
export const typography = StyleSheet.create({
  // Display styles
  display: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -1,
    lineHeight: 56,
  },
  
  // Heading styles
  h1: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  h2: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 28,
  },
  
  // Body text styles
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
  
  // Label styles
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.secondary,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.tertiary,
    letterSpacing: 0.1,
  },
  
  // Special styles
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.text.tertiary,
    fontWeight: '400',
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.text.tertiary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Legacy support
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.text.secondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

// Enhanced layout styles
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  headerContainer: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  
  // Modern card with glassmorphism
  card: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...ELEVATION.medium,
  },
  
  // Elevated card for emphasis
  cardElevated: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...ELEVATION.large,
  },
  
  // Glass card effect
  cardGlass: {
    backgroundColor: COLORS.background.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    backdropFilter: 'blur(10px)',
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  
  rowStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderSubtle,
  },
  
  dividerThick: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.border,
  },
  
  // Spacing utilities
  spacerXS: { height: SPACING.xs },
  spacerSM: { height: SPACING.sm },
  spacerMD: { height: SPACING.md },
  spacerLG: { height: SPACING.lg },
  spacerXL: { height: SPACING.xl },
});

// Enhanced button styles
export const buttons = StyleSheet.create({
  // Primary button with gradient effect
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.colored,
  },
  
  // Primary outline
  primaryOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Secondary button
  secondary: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.small,
  },
  
  // Ghost button
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Large button
  large: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...ELEVATION.colored,
  },
  
  // Small button
  small: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Disabled state
  disabled: {
    backgroundColor: COLORS.background.tertiary,
    opacity: 0.5,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Button text styles
  buttonText: {
    color: TEXT.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonTextLarge: {
    color: TEXT.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonTextSmall: {
    color: TEXT.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

// Enhanced test area styles
export const testArea = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  active: {
    backgroundColor: COLORS.background.secondary,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  inactive: {
    backgroundColor: COLORS.background.secondary,
    borderColor: COLORS.borderSubtle,
    opacity: 0.6,
  },
  completed: {
    backgroundColor: COLORS.background.tertiary,
    borderColor: COLORS.success,
    borderWidth: 2,
  },
  // Test-specific themed areas
  regularityActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: TEST_COLORS.regularity.primary,
    borderWidth: 2,
    ...ELEVATION.medium,
  },
  passiveActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: TEST_COLORS.passive.primary,
    borderWidth: 2,
    ...ELEVATION.medium,
  },
  activeTestActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderColor: TEST_COLORS.active.primary,
    borderWidth: 2,
    ...ELEVATION.medium,
  },
});

// Enhanced results card styles
export const resultsCard = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  metric: {
    marginVertical: SPACING.sm,
  },
  metricLabel: {
    ...typography.labelSmall,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    ...typography.h3,
    color: COLORS.primary,
  },
});
