import { SPACING } from "@/constants/Styles";

export const BREAKPOINTS = {
  phone: 0,
  tablet: 1100,
  desktop: 1100,
};

export const CONTENT_MAX_WIDTH = {
  phone: 720,
  tablet: 960,
  desktop: 1280,
};

export const GUTTERS = {
  phone: SPACING.lg,
  tablet: SPACING.xl,
  desktop: SPACING.xxxl,
};

export type Breakpoint = keyof typeof BREAKPOINTS;
