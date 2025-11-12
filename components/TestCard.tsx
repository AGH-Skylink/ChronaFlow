import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  COLORS,
  SPACING,
  RADIUS,
  ELEVATION,
  typography,
} from "@/constants/Styles";
import { BRAND } from "@/constants/Colors";

type TestCardProps = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
  highlight?: boolean;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function TestCard({
  title,
  description,
  icon,
  onPress,
  highlight = false,
  accentColor = BRAND.primary,
  style,
}: TestCardProps) {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[
          styles.card,
          highlight && styles.highlightCard,
          highlight && { borderColor: accentColor },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.iconContainer,
            highlight && { backgroundColor: `${accentColor}15` },
          ]}
        >
          <FontAwesome
            name={icon}
            size={28}
            color={highlight ? accentColor : BRAND.primaryLight}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <FontAwesome
            name="chevron-right"
            size={18}
            color={COLORS.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ELEVATION.medium,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  highlightCard: {
    borderWidth: 2,
    backgroundColor: COLORS.background.secondary,
    ...ELEVATION.large,
  },
});
