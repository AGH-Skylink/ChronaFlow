import { useCallback, useEffect, useRef, useState } from "react";
import { RegularityTest, RegularityPhase } from "@features/RegularityTest";
import { RegularityResult } from "@models/RegularityResult";

/**
 * Regularity test state management hook
 * Manages RegularityTest instance and syncs to React state
 */
export function useRegularityTestState(sessionId: string | null) {
  const testRef = useRef(new RegularityTest(sessionId));
  const [state, setState] = useState(testRef.current.state);
  const [tapCount, setTapCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [avgInterval, setAvgInterval] = useState(0);
  const [stdDevInterval, setStdDevInterval] = useState(0);

  const syncState = useCallback(() => {
    const test = testRef.current;
    setState(test.state);
    setTapCount(test.tapCount);
    setIsComplete(test.isComplete);
    setAvgInterval(test.avgInterval);
    setStdDevInterval(test.stdDevInterval);
  }, []);

  const reset = useCallback(() => {
    testRef.current.reset();
    syncState();
  }, [syncState]);

  const startTest = useCallback(() => {
    try {
      testRef.current.startTest();
      syncState();
      return true;
    } catch (error) {
      console.error("Failed to start regularity test", error);
      return false;
    }
  }, [syncState]);

  const beginTapping = useCallback(() => {
    try {
      testRef.current.beginTapping();
      setState(testRef.current.state);
      return true;
    } catch (error) {
      console.error("Failed to begin tapping", error);
      return false;
    }
  }, []);

  const recordTap = useCallback(() => {
    try {
      testRef.current.recordTap();
      syncState();
      return true;
    } catch (error) {
      console.error("Failed to record tap", error);
      return false;
    }
  }, [syncState]);

  const analyzeResults = useCallback(() => {
    try {
      const result = testRef.current.analyzeResults();
      testRef.current.complete();
      syncState();
      return result;
    } catch (error) {
      console.error("Failed to analyze results", error);
      return null;
    }
  }, [syncState]);

  // Reinitialize test instance when sessionId changes
  useEffect(() => {
    testRef.current = new RegularityTest(sessionId);
    reset();
  }, [sessionId, reset]);

  return {
    test: testRef.current,
    state,
    tapCount,
    isComplete,
    avgInterval,
    stdDevInterval,
    startTest,
    beginTapping,
    recordTap,
    analyzeResults,
    reset,
  };
}
