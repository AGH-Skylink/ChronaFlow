import { useCallback, useState } from "react";
import { PassiveTest } from "@stp-tests/PassiveTest";
import { useExposureBasedTestState } from "./useExposureBasedTestState";

export function usePassiveTestState(sessionId: string | null) {
  const {
    test,
    state,
    targetExposure,
    emoji,
    startTest,
    beginExposure,
    completeExposure,
    complete,
    reset: baseReset,
    syncState,
  } = useExposureBasedTestState(PassiveTest, sessionId);

  const [sliderValue, setSliderValueState] = useState(
    (test as PassiveTest).sliderValue
  );

  const setSliderValue = useCallback(
    (value: number) => {
      (test as PassiveTest).setSliderValue(value);
      setSliderValueState(value);
    },
    [test]
  );

  const calculateResults = useCallback(() => {
    try {
      const passiveTest = test as PassiveTest;
      const result = passiveTest.generateResults();
      syncState();
      return result;
    } catch (error) {
      console.error("Failed to calculate results", error);
      return null;
    }
  }, [test, syncState]);

  const reset = useCallback(() => {
    baseReset();
    setSliderValueState((test as PassiveTest).sliderValue);
  }, [baseReset, test]);

  return {
    test: test as PassiveTest,
    state,
    targetExposure,
    emoji,
    sliderValue,
    startTest,
    beginExposure,
    completeExposure,
    complete,
    setSliderValue,
    calculateResults,
    reset,
    syncState,
  };
}
