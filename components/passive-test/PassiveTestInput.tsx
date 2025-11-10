import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { TestStyles } from "@/constants/TestStyles";

interface PassiveTestInputProps {
  sliderValue: number;
  onSliderChange: (value: number) => void;
  onSubmit: () => void;
}

/**
 * Slider-based input component for Passive Test
 * This is the ONLY unique UI component specific to Passive Test
 */
export function PassiveTestInput({
  sliderValue,
  onSliderChange,
  onSubmit,
}: PassiveTestInputProps) {
  return (
    <View style={TestStyles.inputContainer}>
      <Text style={TestStyles.inputLabel}>
        How many milliseconds was it visible?
      </Text>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#007AFF",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        {`${sliderValue.toFixed(0)} ms`}
      </Text>

      <Slider
        style={{ width: "100%", height: 40, marginVertical: 20 }}
        minimumValue={1000}
        maximumValue={5000}
        step={100}
        value={sliderValue}
        onValueChange={onSliderChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#007AFF"
      />

      <TouchableOpacity style={TestStyles.primaryButton} onPress={onSubmit}>
        <Text style={TestStyles.primaryButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
