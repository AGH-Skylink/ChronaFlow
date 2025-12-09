/**
 * Visual Design Tokens Demo
 * Use this file as a quick reference for all available design tokens
 */

import { COLORS, SPACING, RADIUS, ELEVATION, typography } from './Styles';
import { BRAND, TEST_COLORS, SEMANTIC } from './Colors';

// QUICK REFERENCE GUIDE

/*
═══════════════════════════════════════════════════════════
  COLORS
═══════════════════════════════════════════════════════════
*/

// Brand Colors
const brandColors = {
  primary: BRAND.primary,        // #6366f1 (Indigo)
  primaryLight: BRAND.primaryLight, // #818cf8
  primaryDark: BRAND.primaryDark,  // #4f46e5
  secondary: BRAND.secondary,     // #ec4899 (Pink)
};

// Test-Specific Colors
const testColors = {
  regularity: TEST_COLORS.regularity.primary, // #10b981 (Emerald)
  passive: TEST_COLORS.passive.primary,       // #f59e0b (Amber)
  active: TEST_COLORS.active.primary,         // #3b82f6 (Blue)
};

// Background Hierarchy
const backgrounds = {
  primary: COLORS.background.primary,     // #0a0a0f (Deepest)
  secondary: COLORS.background.secondary, // #12121a (Cards)
  tertiary: COLORS.background.tertiary,   // #1a1a27 (Elevated)
  elevated: COLORS.background.elevated,   // #22223a (Highest)
};

// Text Hierarchy
const textColors = {
  primary: COLORS.text.primary,     // #f8fafc (High emphasis)
  secondary: COLORS.text.secondary, // #cbd5e1 (Medium emphasis)
  tertiary: COLORS.text.tertiary,   // #94a3b8 (Low emphasis)
  disabled: COLORS.text.disabled,   // #64748b (Disabled)
};

// Semantic Colors
const semanticColors = {
  success: SEMANTIC.success.main,  // #22c55e
  warning: SEMANTIC.warning.main,  // #f59e0b
  error: SEMANTIC.error.main,      // #ef4444
  info: SEMANTIC.info.main,        // #3b82f6
};

/*
═══════════════════════════════════════════════════════════
  SPACING (8pt Grid)
═══════════════════════════════════════════════════════════
*/
const spacing = {
  xs: SPACING.xs,       // 4px
  sm: SPACING.sm,       // 8px
  md: SPACING.md,       // 16px
  lg: SPACING.lg,       // 24px
  xl: SPACING.xl,       // 32px
  xxl: SPACING.xxl,     // 48px
  xxxl: SPACING.xxxl,   // 64px
};

/*
═══════════════════════════════════════════════════════════
  BORDER RADIUS
═══════════════════════════════════════════════════════════
*/
const borderRadius = {
  xs: RADIUS.xs,     // 4px
  sm: RADIUS.sm,     // 8px
  md: RADIUS.md,     // 12px
  lg: RADIUS.lg,     // 16px
  xl: RADIUS.xl,     // 24px
  full: RADIUS.full, // 9999px (pill shape)
};

/*
═══════════════════════════════════════════════════════════
  TYPOGRAPHY
═══════════════════════════════════════════════════════════
*/
const textStyles = {
  // Display & Headings
  display: typography.display,  // 48px, weight 800
  h1: typography.h1,            // 36px, weight 700
  h2: typography.h2,            // 30px, weight 700
  h3: typography.h3,            // 24px, weight 600
  h4: typography.h4,            // 20px, weight 600
  
  // Body Text
  bodyLarge: typography.bodyLarge,  // 18px
  body: typography.body,            // 16px
  bodySmall: typography.bodySmall,  // 14px
  
  // Labels & Special
  label: typography.label,          // 16px, weight 500
  labelSmall: typography.labelSmall,// 14px, weight 500
  caption: typography.caption,      // 12px
  overline: typography.overline,    // 12px, uppercase
};

/*
═══════════════════════════════════════════════════════════
  ELEVATION (Shadows)
═══════════════════════════════════════════════════════════
*/
const shadows = {
  small: ELEVATION.small,     // Subtle shadow for cards
  medium: ELEVATION.medium,   // Standard elevation
  large: ELEVATION.large,     // Prominent elevation
  colored: ELEVATION.colored, // Colored shadow (primary)
};

/*
═══════════════════════════════════════════════════════════
  USAGE EXAMPLES
═══════════════════════════════════════════════════════════
*/

// Example: Button Style
const exampleButton = {
  backgroundColor: BRAND.primary,
  paddingVertical: SPACING.md,
  paddingHorizontal: SPACING.xl,
  borderRadius: RADIUS.md,
  ...ELEVATION.colored,
};

// Example: Card Style
const exampleCard = {
  backgroundColor: COLORS.background.secondary,
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  borderWidth: 1,
  borderColor: COLORS.border,
  ...ELEVATION.medium,
};

// Example: Test Area (Regularity Test)
const exampleTestArea = {
  backgroundColor: 'rgba(16, 185, 129, 0.05)',
  borderColor: TEST_COLORS.regularity.primary,
  borderWidth: 2,
  borderRadius: RADIUS.xl,
  padding: SPACING.xl,
  ...ELEVATION.large,
};

// Example: Success Result Card
const exampleSuccessCard = {
  backgroundColor: COLORS.background.tertiary,
  borderColor: SEMANTIC.success.main,
  borderWidth: 2,
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  ...ELEVATION.large,
};

/*
═══════════════════════════════════════════════════════════
  COMPONENT STYLE PATTERNS
═══════════════════════════════════════════════════════════
*/

// Pattern 1: Primary Interactive Element
const primaryInteractive = {
  backgroundColor: BRAND.primary,
  padding: SPACING.md,
  borderRadius: RADIUS.md,
  ...ELEVATION.colored,
};

// Pattern 2: Secondary Container
const secondaryContainer = {
  backgroundColor: COLORS.background.secondary,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  ...ELEVATION.medium,
};

// Pattern 3: Subtle Badge
const badge = {
  backgroundColor: `${BRAND.primary}15`,
  borderWidth: 1,
  borderColor: BRAND.primary,
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.xs,
  borderRadius: RADIUS.full,
};

// Pattern 4: Metric Display
const metricDisplay = {
  container: {
    ...secondaryContainer,
    marginBottom: SPACING.md,
  },
  label: {
    ...typography.labelSmall,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },
  value: {
    ...typography.h3,
    color: COLORS.text.primary,
  },
};

export {
  brandColors,
  testColors,
  backgrounds,
  textColors,
  semanticColors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
  exampleButton,
  exampleCard,
  exampleTestArea,
  exampleSuccessCard,
  primaryInteractive,
  secondaryContainer,
  badge,
  metricDisplay,
};
