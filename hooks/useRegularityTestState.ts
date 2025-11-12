import { useCallback, useEffect, useRef, useState } from "react";
import { RegularityTest, RegularityPhase } from "@stp-tests/RegularityTest";

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
      const wasIncomplete = !testRef.current.isComplete;
      testRef.current.recordTap();
      const isNowComplete = testRef.current.isComplete;
      syncState();
      // Return true if the test just completed with this tap
      return wasIncomplete && isNowComplete;
    } catch (error) {
      console.error("Failed to record tap", error);
      return false;
    }
  }, [syncState]);

  const analyzeResults = useCallback(() => {
    try {
      const result = testRef.current.analyzeResults();
      syncState();
      return result;
    } catch (error) {
      console.error("Failed to analyze results", error);
      return null;
    }
  }, [syncState]);

  const complete = useCallback(() => {
    try {
      testRef.current.complete();
      syncState();
      return true;
    } catch (error) {
      console.error("Failed to complete test", error);
      return false;
    }
  }, [syncState]);

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
    complete,
    reset,
  };
}
