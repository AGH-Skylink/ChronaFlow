import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { COLORS, SPACING } from "@/constants/Styles";
import { BRAND, TEXT } from "@/constants/Colors";

// Enhanced tab bar icon with better sizing
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused?: boolean;
}) {
  return (
    <FontAwesome
      size={props.focused ? 26 : 24}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND.primary,
        tabBarInactiveTintColor: TEXT.tertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background.secondary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 100 : 78,
          paddingTop: SPACING.sm,
          paddingBottom: Platform.OS === "ios" ? SPACING.xxl : SPACING.xl,
          paddingHorizontal: SPACING.sm,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: SPACING.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="list-ul" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tests-results"
        options={{
          title: "Results",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bar-chart" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
