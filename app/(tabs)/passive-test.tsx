import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function PassiveTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");

  const startTest = () => {
    const time = Math.floor(Math.random() * 5) + 1; 
    setTestStarted(true);
    setTestCompleted(false);
    setDisplayTime(time);

    setTimeout(() => {
      setTestStarted(false);
    }, time * 1000);
  };

  const calculateResult = () => {
    const difference = Math.abs(Number(userInput) - displayTime);
    setResult(`Diffrence: ${difference} seconds`);
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Passive Test</Text>
        <Text style={styles.instructions}>
          Observe the object and estimate its duration.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.tapArea,
          testStarted ? styles.tapAreaActive : styles.completedArea,
        ]}
        disabled={testStarted}
        onPress={startTest}
        activeOpacity={0.8}
      >
        {testStarted ? (
          <Text style={styles.object}>⏺️ Object is visible</Text>
        ) : testCompleted ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Test Completed!</Text>
            <View style={styles.resultsCard}>
              <ResultRow label="Displayed time" value={`${displayTime} s`} />
              <View style={styles.divider} />
              <ResultRow label="Your guess" value={`${userInput} s`} />
              <View style={styles.divider} />
              <ResultRow label="Difference" value={result} />
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={resetTest}>
              <Text style={styles.resetButtonText}>Start Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Tap to begin</Text>
          </View>
        )}
      </TouchableOpacity>

      {!testStarted && !testCompleted && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your guess in seconds"
            keyboardType="numeric"
            value={userInput}
            onChangeText={setUserInput}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={calculateResult}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 30,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#e0e0e0",
  },
  instructions: {
    fontSize: 17,
    textAlign: "center",
    color: "#a0aec0",
    marginBottom: 5,
  },
  tapArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tapAreaActive: {
    backgroundColor: "#1f2937",
  },
  completedArea: {
    backgroundColor: "#242424",
  },
  counterContainer: {
    alignItems: "center",
    padding: 20,
  },
  counterText: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    color: "#e0e0e0",
  },
  object: {
    fontSize: 48, 
    color: "#60a5fa", 
    fontWeight: "bold", 
    margin: 20, 
    textAlign: "center", 
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginBottom: 10,
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  resultsCard: {
    width: "100%",
    backgroundColor: "#2d3748",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e0e0e0",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: "#a0aec0",
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#3d4852",
  },
  resetButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
