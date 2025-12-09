import { useCallback, useState } from "react";
import { ActiveTest } from "@stp-tests/ActiveTest";
import { useExposureBasedTestState } from "./useExposureBasedTestState";

export function useActiveTestState(sessionId: string | null) {
  const {
    test,
    state,
    targetExposure,
    emoji,
    startTest: baseStartTest,
    beginExposure,
    completeExposure,
    complete,
    reset: baseReset,
    syncState,
  } = useExposureBasedTestState(ActiveTest, sessionId);

  const [holdDuration, setHoldDuration] = useState<number | null>(null);

  const startTest = useCallback(() => {
    const started = baseStartTest();
    if (started) {
      setHoldDuration(null);
    }
    return started;
  }, [baseStartTest]);

  const startTimer = useCallback(() => {
    try {
      (test as ActiveTest).startTimer();
      return true;
    } catch (error) {
      console.warn("Trying to start timer outside reproduction phase", error);
      return false;
    }
  }, [test]);

  const endTimer = useCallback(() => {
    try {
      const activeTest = test as ActiveTest;
      const result = activeTest.endTimer();
      setHoldDuration(activeTest.userExposure);
      syncState();
      return result;
    } catch (error) {
      console.error("Failed to finish active test", error);
      return null;
    }
  }, [test, syncState]);

  const reset = useCallback(() => {
    baseReset();
    setHoldDuration(null);
  }, [baseReset]);

  return {
    test: test as ActiveTest,
    state,
    targetExposure,
    emoji,
    holdDuration,
    startTest,
    beginExposure,
    completeExposure,
    startTimer,
    endTimer,
    reset,
    complete,
    syncState,
  };
}
