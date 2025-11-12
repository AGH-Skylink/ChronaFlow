import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestStyles } from "@/constants/TestStyles";
import { TAP_COUNT } from "@stp-tests/RegularityTest";

interface RegularityTestTappingAreaProps {
  tapCount: number;
  onTap: () => void;
  isActive: boolean;
}

export function RegularityTestTappingArea({
  tapCount,
  onTap,
  isActive,
}: RegularityTestTappingAreaProps) {
  return (
    <TouchableOpacity
      onPress={isActive ? onTap : undefined}
      activeOpacity={isActive ? 0.8 : 1}
      disabled={!isActive}
    >
      <View style={TestStyles.testContainer}>
        <Text style={TestStyles.testText}>
          {tapCount} / {TAP_COUNT}
        </Text>
        <View style={TestStyles.progressContainer}>
          <View
            style={[
              TestStyles.progressBar,
              { width: `${(tapCount / TAP_COUNT) * 100}%` },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
