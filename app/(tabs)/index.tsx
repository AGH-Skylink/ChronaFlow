import React from "react";
import { StyleSheet, View as RNView } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { TestCard } from "@/components/TestCard";
import { COLORS, SPACING, typography } from "@/constants/Styles";
import { BRAND } from "@/constants/Colors";
import { ResponsiveScaffold } from "@/components/layout/ResponsiveScaffold";
import { useResponsive } from "@/hooks/useResponsive";

export default function HomeScreen() {
  const router = useRouter();
  const { isTablet, isDesktop } = useResponsive();

  return (
    <ResponsiveScaffold
      scrollable
      contentStyle={[
        styles.contentContainer,
        (isTablet || isDesktop) && styles.contentWide,
      ]}
    >
      <RNView
        style={[
          styles.sectionStack,
          (isTablet || isDesktop) && styles.sectionStackWide,
        ]}
      >
        <View style={[styles.featuredSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessions</Text>
            <Text style={styles.sectionSubtitle}>
              Create premade sessions of tests
            </Text>
          </View>
          <TestCard
            title="Sessions"
            description="Create custom test sequences combining multiple cognitive tests."
            icon="list-ul"
            onPress={() => router.push("/(tabs)/sessions")}
            highlight={true}
            accentColor={BRAND.primary}
            style={styles.cardWrapper}
          />
        </View>

        <View
          style={[
            styles.testsSection,
            (isTablet || isDesktop) && styles.testsSectionWide,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Tests</Text>
            <Text style={styles.sectionSubtitle}>Choose a test to begin</Text>
          </View>

          <RNView
            style={[
              styles.testsGrid,
              (isTablet || isDesktop) && styles.testsGridWide,
            ]}
          >
            <TestCard
              title="Regularity Test"
              description="Maintain a steady rhythm by tapping at 1-second intervals. Tests your internal timing consistency."
              icon="hand-o-up"
              onPress={() => router.push("/pages/regularity-test-page")}
              style={[
                styles.cardWrapper,
                isTablet && styles.cardWrapperTablet,
                isDesktop && styles.cardWrapperDesktop,
              ]}
            />
            <TestCard
              title="Passive Test"
              description="Try measure the time the object is exposed to you. Then using the slider, set the time you think it was exposed."
              icon="play-circle"
              onPress={() => router.push("/pages/passive-test-page")}
              style={[
                styles.cardWrapper,
                isTablet && styles.cardWrapperTablet,
                isDesktop && styles.cardWrapperDesktop,
              ]}
            />
            <TestCard
              title="Active Test"
              description="Try measure the time the object is exposed to you. Then press and hold the button for the same duration."
              icon="eye"
              onPress={() => router.push("/pages/active-test-page")}
              style={[
                styles.cardWrapper,
                isTablet && styles.cardWrapperTablet,
                isDesktop && styles.cardWrapperDesktop,
              ]}
            />
          </RNView>
        </View>
      </RNView>
      <View style={styles.bottomSpacer} />
    </ResponsiveScaffold>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xxl,
  },
  contentWide: {
    paddingHorizontal: 0,
  },

  // Featured Section
  featuredSection: {
    marginBottom: SPACING.xl,
  },
  sectionStack: {
    gap: SPACING.xxl,
  },
  sectionStackWide: {
    flexDirection: "row",
    gap: SPACING.xxl,
    alignItems: "flex-start",
  },

  // Section Headers
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: COLORS.text.tertiary,
  },

  // Tests Section
  testsSection: {
    marginBottom: SPACING.lg,
  },
  testsSectionWide: {
    flex: 1,
  },
  testsGrid: {
    gap: SPACING.md,
  },
  testsGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  cardWrapper: {
    width: "100%",
  },
  cardWrapperTablet: {
    width: "48%",
  },
  cardWrapperDesktop: {
    width: "31%",
    minWidth: 320,
  },

  // Bottom Spacing
  bottomSpacer: {
    height: SPACING.xxl,
  },
});
