import { useCallback, useState } from "react";
import { PassiveTest } from "@features/PassiveTest";
import { useExposureBasedTestState } from "./useExposureBasedTestState";
import { ExposureBasedResult } from "@models/ExposureBasedResult";

/**
 * Passive test state management hook
 * Wraps the generic useExposureBasedTestState and adds slider-specific state
 */
export function usePassiveTestState(sessionId: string | null) {
  // Get base state from generic hook
  const baseState = useExposureBasedTestState(
    (sid) => new PassiveTest(sid),
    sessionId
  );

  // Add Passive-specific state: slider value
  const [sliderValue, setSliderValueState] = useState(1000);

  // Passive-specific operation: set slider value
  const setSliderValue = useCallback(
    (value: number) => {
      (baseState.test as PassiveTest).setSliderValue(value);
      setSliderValueState(value);
    },
    [baseState.test]
  );

  // Passive-specific operation: calculate results
  const calculateResults = useCallback(() => {
    try {
      const test = baseState.test as PassiveTest;
      test.calculateUserExposure();
      const result = test.generateResults();
      baseState.syncState();
      return result;
    } catch (error) {
      console.error("Failed to calculate results", error);
      return null;
    }
  }, [baseState]);

  // Override reset to also reset slider value
  const reset = useCallback(() => {
    baseState.reset();
    setSliderValueState(1000);
  }, [baseState]);

  // Return combined state
  return {
    test: baseState.test as PassiveTest,
    state: baseState.state,
    targetExposure: baseState.targetExposure,
    emoji: baseState.emoji,
    sliderValue,
    startTest: baseState.startTest,
    beginExposure: baseState.beginExposure,
    completeExposure: baseState.completeExposure,
    complete: baseState.complete,
    setSliderValue,
    calculateResults,
    reset,
  };
}
