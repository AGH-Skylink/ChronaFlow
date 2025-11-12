import { useCallback, useState } from "react";
import { PassiveTest } from "@stp-tests/PassiveTest";
import { useExposureBasedTestState } from "./useExposureBasedTestState";


export function usePassiveTestState(sessionId: string | null) {
  const baseState = useExposureBasedTestState(
    (sid) => new PassiveTest(sid),
    sessionId
  );

  const [sliderValue, setSliderValueState] = useState(1000);

  const setSliderValue = useCallback(
    (value: number) => {
      (baseState.test as PassiveTest).setSliderValue(value);
      setSliderValueState(value);
    },
    [baseState.test]
  );

  const calculateResults = useCallback(() => {
    try {
      const test = baseState.test as PassiveTest;
      const result = test.generateResults();
      baseState.syncState();
      return result;
    } catch (error) {
      console.error("Failed to calculate results", error);
      return null;
    }
  }, [baseState]);

  const reset = useCallback(() => {
    baseState.reset();
    setSliderValueState(1000);
  }, [baseState]);

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
