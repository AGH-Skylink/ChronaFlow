import React, { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ResultRow } from "../../components/ResultRow";
import { TestStyles } from "@/constants/TestStyles";
import { saveTestResult } from "@/utils/storageUtils";
import { randomEmoji, randomTime } from "@/utils/test-utils";
import { Countdown } from "@/components/Countdown";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";

interface TestResult {
  id: string;
  timestamp: number;
  targetExposure: number;
  userInput: number;
  notes?: string;
}

export default function PassiveTestScreen() {
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<"exposure" | "input" | "result">(
    "exposure"
  );
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [currentEmoji, setCurrentEmoji] = useState<string>("🌙");
  const [sliderValue, setSliderValue] = useState<number>(1000); // Default to 1000ms
  const [isSlidingActive, setIsSlidingActive] = useState(false);
  const [tempSliderValue, setTempSliderValue] = useState<number>(1000);

  const handleStart = () => {
    setTestStarted(true);
    setIsCountdownActive(true);
  };

  const handleCountdownComplete = () => {
    setIsCountdownActive(false);
  };

  const handleSlideValueChange = useCallback((value: number) => {
    setSliderValue(value);
  }, []);

  const handleSlidingStart = useCallback(() => {
    setIsSlidingActive(true);
  }, []);

  const handleSlidingComplete = useCallback((value: number) => {
    setIsSlidingActive(false);
    setSliderValue(value);
  }, []);

  useEffect(() => {
    if (phase === "exposure" && !isCountdownActive && testStarted) {
      const time = randomTime(1, 5) * 1000;
      setTargetExposure(time);
      setCurrentEmoji(randomEmoji());
      setSliderValue(1000);
      setTempSliderValue(1000);

      const timer = setTimeout(() => {
        setPhase("input");
      }, time);
      return () => clearTimeout(timer);
    }
  }, [phase, isCountdownActive, testStarted]);

  const handleCalculateResults = () => {
    const result: TestResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      targetExposure,
      userInput: sliderValue,
      notes: "", // Keep empty notes field for later editing
    };

    saveTestResult("passiveTestResults", result);
    setPhase("result");
  };

  const resetTest = () => {
    setTestStarted(false);
    setIsCountdownActive(false);
    setPhase("exposure");
    setTargetExposure(0);
    setSliderValue(1000);
    setCurrentEmoji(randomEmoji());
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (phase === "result") {
          resetTest();
        }
      };
    }, [phase])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={TestStyles.container}>
          {!testStarted ? (
            <View style={TestStyles.startContainer}>
              <Text style={TestStyles.header}>Passive Test</Text>
              <Text style={[TestStyles.instructions, { marginVertical: 20 }]}>
                You will see an emoji for a certain amount of time. Try to
                remember how long it was displayed.
              </Text>
              <TouchableOpacity
                style={TestStyles.primaryButton}
                onPress={handleStart}
              >
                <Text style={TestStyles.primaryButtonText}>Tap to Begin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {isCountdownActive && (
                <Countdown onComplete={handleCountdownComplete} />
              )}

              <View style={TestStyles.headerContainer}>
                <Text style={TestStyles.header}>Passive Test</Text>
                {phase === "exposure" && !isCountdownActive && (
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
                {phase === "exposure" && !isCountdownActive && (
                  <View style={TestStyles.testContainer}>
                    <Text style={TestStyles.testText}>
                      Watch the exposure...
                    </Text>
                    <Text style={TestStyles.emoji}>{currentEmoji}</Text>
                  </View>
                )}
                {phase === "input" && (
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
                      value={isSlidingActive ? tempSliderValue : sliderValue}
                      onValueChange={handleSlideValueChange}
                      onSlidingStart={handleSlidingStart}
                      onSlidingComplete={handleSlidingComplete}
                      minimumTrackTintColor="#007AFF"
                      maximumTrackTintColor="#d3d3d3"
                      thumbTintColor="#007AFF"
                    />

                    <TouchableOpacity
                      style={TestStyles.primaryButton}
                      onPress={handleCalculateResults}
                    >
                      <Text style={TestStyles.primaryButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {phase === "result" && (
                  <ScrollView
                    style={{ flex: 1, width: "100%" }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                  >
                    <View style={TestStyles.resultsContainer}>
                      <Text style={TestStyles.title}>Test Completed!</Text>

                      <View style={TestStyles.resultsCard}>
                        <ResultRow
                          label="Target Duration"
                          value={`${targetExposure} ms`}
                        />
                        <View style={TestStyles.divider} />

                        <ResultRow
                          label="Your Input"
                          value={`${sliderValue.toFixed(0)} ms`}
                        />
                      </View>

                      <TouchableOpacity
                        style={TestStyles.resetButton}
                        onPress={resetTest}
                      >
                        <Text style={TestStyles.resetButtonText}>
                          Try Again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>
            </>
          )}
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
