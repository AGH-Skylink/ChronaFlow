import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ResultRow } from "../../components/ResultRow";
import { TestStyles } from "@/constants/TestStyles";

function randomTime(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

export default function PassiveTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const startTest = () => {
    if (testStarted) return;
    resetTest();
    const time = randomTime(1, 5);
    setTestStarted(true);
    setAwaitingInput(false);
    setDisplayTime(time);

    setTimeout(() => {
      setTestStarted(false);
      setAwaitingInput(true);
    }, time * 1000);
  };

  const calculateResult = () => {
    if (userInput === "") return;
    const processedInput = userInput.replace(",", ".");
    const difference = Math.abs(Number(processedInput) - displayTime).toFixed(
      2
    );
    setResult(difference);
    setAwaitingInput(false);
    setTestCompleted(true);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setUserInput("");
    setResult("");
    setDisplayTime(0);
  };

  return (
    <View style={TestStyles.container}>
      <View style={TestStyles.headerContainer}>
        <Text style={TestStyles.header}>Passive Test</Text>
        {testCompleted ? (
          <Text style={TestStyles.instructions}>
            Observe the object and estimate its duration.
          </Text>
        ) : null}
      </View>

      <View
        style={[
          TestStyles.testArea,
          testStarted ? TestStyles.activeArea : TestStyles.inactiveArea,
        ]}
      >
        {testStarted ? (
          <Text style={styles.object}>👩‍🚀 Neil A. is visible</Text>
        ) : awaitingInput ? (
          <View style={TestStyles.inputContainer}>
            <Text style={TestStyles.inputLabel}>How long was it visible?</Text>

            <View style={styles.timeInputWrapper}>
              <TextInput
                style={[
                  TestStyles.inputField,
                  isFocused && TestStyles.inputFieldFocused,
                ]}
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={userInput}
                onChangeText={setUserInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor="#a0aec0"
                maxLength={4}
              />
              <Text style={styles.unitText}>s</Text>
            </View>

            <TouchableOpacity
              style={TestStyles.primaryButton}
              onPress={calculateResult}
            >
              <Text style={TestStyles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : testCompleted ? (
          <View style={TestStyles.resultsContainer}>
            <Text style={TestStyles.resultsTitle}>Test Completed!</Text>
            <View style={TestStyles.resultsCard}>
              <ResultRow label="Displayed time" value={`${displayTime} s`} />
              <View style={TestStyles.divider} />
              <ResultRow label="Your guess" value={`${userInput} s`} />
              <View style={TestStyles.divider} />
              <ResultRow label="Difference" value={`${result} s`} />
            </View>
            <TouchableOpacity
              style={TestStyles.resetButton}
              onPress={resetTest}
            >
              <Text style={TestStyles.resetButtonText}>Start Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={TestStyles.startButtonContainer}
            onPress={startTest}
            activeOpacity={0.8}
          >
            <Text style={TestStyles.startButtonText}>Tap to begin</Text>
          </TouchableOpacity>
        )}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

// Keep only component-specific styles that aren't shared
const styles = StyleSheet.create({
  timeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  unitText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a0aec0",
    marginLeft: 10,
  },
  object: {
    fontSize: 48,
    color: "#60a5fa",
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
  },
});
