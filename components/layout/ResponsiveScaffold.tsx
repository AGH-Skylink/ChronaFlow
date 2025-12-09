import type { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
} from "react-native";

import { useResponsive } from "@/hooks/useResponsive";
import { COLORS, SPACING } from "@/constants/Styles";

type ResponsiveScaffoldProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
};

export function ResponsiveScaffold({
  children,
  header,
  footer,
  contentStyle,
  scrollable = false,
}: ResponsiveScaffoldProps) {
  const { maxContentWidth, gutter } = useResponsive();
  const flattenedContentStyle = StyleSheet.flatten(contentStyle);

  const sharedContentStyle = [
    styles.content,
    { maxWidth: maxContentWidth },
    flattenedContentStyle,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.surface, { paddingHorizontal: gutter }]}>
        {header}
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[...sharedContentStyle, styles.scrollBody]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[...sharedContentStyle, styles.nonScrollBody]}>
            {children}
          </View>
        )}
        {footer}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  surface: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background.primary,
  },
  scroll: {
    flex: 1,
    alignSelf: "stretch",
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  scrollBody: {
    paddingBottom: SPACING.xxl,
    width: "100%",
    alignSelf: "center",
  },
  nonScrollBody: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
});
