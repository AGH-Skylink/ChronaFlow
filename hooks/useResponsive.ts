import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import {
  BREAKPOINTS,
  CONTENT_MAX_WIDTH,
  GUTTERS,
  Breakpoint,
} from "@/constants/responsive";

type ResponsiveInfo = {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  maxContentWidth: number;
  gutter: number;
  columns: number;
};

export const useResponsive = (): ResponsiveInfo => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isDesktop = width >= BREAKPOINTS.desktop;
    const isTablet =
      width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
    const breakpoint: Breakpoint = isDesktop
      ? "desktop"
      : isTablet
      ? "tablet"
      : "phone";

    const maxContentWidth =
      breakpoint === "desktop"
        ? CONTENT_MAX_WIDTH.desktop
        : breakpoint === "tablet"
        ? CONTENT_MAX_WIDTH.tablet
        : CONTENT_MAX_WIDTH.phone;

    const gutter =
      breakpoint === "desktop"
        ? GUTTERS.desktop
        : breakpoint === "tablet"
        ? GUTTERS.tablet
        : GUTTERS.phone;

    const columns = isDesktop ? 3 : isTablet ? 2 : 1;

    return {
      width,
      height,
      breakpoint,
      isMobile: breakpoint === "phone",
      isTablet,
      isDesktop,
      maxContentWidth,
      gutter,
      columns,
    };
  }, [height, width]);
};
