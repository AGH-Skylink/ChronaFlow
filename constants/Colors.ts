/**
 * Enhanced Color System for ChronaFlow
 * Modern, accessible, and visually appealing color palette
 */

// Primary brand colors with gradient support
export const BRAND = {
  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  gradient: ['#6366f1', '#8b5cf6'], // Indigo to Purple gradient
  
  secondary: '#ec4899', // Pink accent
  secondaryLight: '#f472b6',
  secondaryDark: '#db2777',
};

// Test-specific accent colors
export const TEST_COLORS = {
  regularity: {
    primary: '#10b981', // Emerald
    light: '#34d399',
    gradient: ['#10b981', '#059669'],
  },
  passive: {
    primary: '#f59e0b', // Amber
    light: '#fbbf24',
    gradient: ['#f59e0b', '#d97706'],
  },
  active: {
    primary: '#3b82f6', // Blue
    light: '#60a5fa',
    gradient: ['#3b82f6', '#2563eb'],
  },
};

// Dark theme backgrounds with depth
export const DARK_BACKGROUNDS = {
  primary: '#0a0a0f', // Deep dark blue-black
  secondary: '#12121a', // Card background
  tertiary: '#1a1a27', // Elevated elements
  elevated: '#22223a', // Highest elevation
  glass: 'rgba(26, 26, 39, 0.7)', // Glassmorphism
};

// Text colors with proper hierarchy
export const TEXT = {
  primary: '#f8fafc', // Almost white
  secondary: '#cbd5e1', // Light gray
  tertiary: '#94a3b8', // Muted gray
  disabled: '#64748b', // Disabled state
  inverse: '#0f172a', // For light backgrounds
};

// Semantic colors for states
export const SEMANTIC = {
  success: {
    main: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
    bg: 'rgba(34, 197, 94, 0.1)',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
};

// Border colors
export const BORDERS = {
  subtle: '#1e293b',
  default: '#334155',
  emphasis: '#475569',
  focus: '#6366f1',
};

// Shadow colors
export const SHADOWS = {
  small: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.15)',
  large: 'rgba(0, 0, 0, 0.2)',
  colored: 'rgba(99, 102, 241, 0.3)',
};

// Legacy support (for gradual migration)
const tintColorLight = '#6366f1';
const tintColorDark = '#f8fafc';

export default {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    tint: tintColorLight,
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#f8fafc',
    background: '#0a0a0f',
    tint: tintColorDark,
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
  },
};
