import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ResultRow } from "../../components/ResultRow";
import { TestStyles } from "@/constants/TestStyles";
import { useRouter } from "expo-router";
import { saveTestResult } from "@/utils/storageUtils";
import { randomEmoji, randomTime } from "@/utils/test-utils";

interface TestResult {
  id: string;
  timestamp: number;
  targetExposure: number;
  userInput: number;
}

export default function PassiveTestScreen() {
  const [phase, setPhase] = useState<"exposure" | "input" | "result">(
    "exposure"
  );
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [currentEmoji, setCurrentEmoji] = useState<string>("🌙");
  const [userInput, setUserInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (phase === "exposure") {
      const time = randomTime(1, 5) * 1000;
      setTargetExposure(time);

      setCurrentEmoji(randomEmoji());

      const timer = setTimeout(() => {
        setPhase("input");
      }, time);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleCalculateResults = () => {
    const userDuration = parseFloat(userInput) * 1000;

    const result: TestResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      targetExposure,
      userInput: userDuration,
    };

    saveTestResult("passiveTestResults", result);

    setPhase("result");
  };

  const resetTest = () => {
    setPhase("exposure");
    setTargetExposure(0);
    setUserInput("");
    setCurrentEmoji(randomEmoji());
  };

  return (
    <View style={TestStyles.container}>
      <View style={TestStyles.headerContainer}>
        <Text style={TestStyles.header}>Passive Test</Text>
        {phase === "exposure" && (
          <Text style={TestStyles.instructions}>
            Try to remember the exposure time.
          </Text>
        )}
      </View>

      <View
        style={[
          TestStyles.testArea,
          phase === "result"
            ? TestStyles.resultsContainer
            : TestStyles.testContainer,
        ]}
      >
        {phase === "exposure" && (
          <View style={TestStyles.testContainer}>
            <Text style={TestStyles.testText}>Watch the exposure...</Text>
            <Text style={TestStyles.emoji}>{currentEmoji}</Text>
          </View>
        )}
        {phase === "input" && (
          <View style={TestStyles.inputContainer}>
            <Text style={TestStyles.inputLabel}>
              How many milliseconds was it visible?
            </Text>

            <TextInput
              style={[
                TestStyles.inputField,
                isFocused && TestStyles.inputFieldFocused,
                { marginBottom: 20 },
              ]}
              placeholder="0.0ms"
              keyboardType="decimal-pad"
              value={userInput}
              onChangeText={(text) => {
                const sanitizedText = text.replace(/[^0-9.]/g, "").trim();
                setUserInput(sanitizedText);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholderTextColor="#a0aec0"
              maxLength={4}
            />
            <TouchableOpacity
              style={TestStyles.primaryButton}
              onPress={handleCalculateResults}
              disabled={!userInput.trim()}
            >
              {userInput.trim() ? (
                <Text style={TestStyles.primaryButtonText}>Submit</Text>
              ) : (
                <Text style={TestStyles.primaryButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        {phase === "result" && (
          <View style={TestStyles.resultsContainer}>
            <Text style={TestStyles.title}>Test Completed!</Text>

            <View style={TestStyles.resultsCard}>
              <ResultRow
                label="Target Duration"
                value={`${targetExposure} ms`}
              />
              <View style={TestStyles.divider} />

              <ResultRow label="Your Input" value={`${userInput} ms`} />
            </View>

            <TouchableOpacity
              style={TestStyles.resetButton}
              onPress={resetTest}
            >
              <Text style={TestStyles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}
