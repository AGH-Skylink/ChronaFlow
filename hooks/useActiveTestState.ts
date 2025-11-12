import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveTest } from "@/src/domain/stp-tests/ActiveTest";
import { ExposureBasedPhase } from "@/src/domain/stp-tests/ExposureBasedTest";

export function useActiveTestState(sessionId: string | null) {
  const testRef = useRef(new ActiveTest(sessionId));
  const [state, setState] = useState(testRef.current.state);
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [emoji, setEmoji] = useState(testRef.current.emoji);
  const [holdDuration, setHoldDuration] = useState<number | null>(null);

  const syncState = useCallback(() => {
    const test = testRef.current;
    setState(test.state);
    setTargetExposure(test.targetExposure);
    setEmoji(test.emoji);
  }, []);

  const reset = useCallback(() => {
    const test = testRef.current;
    test.reset();
    syncState();
    setHoldDuration(null);
  }, [syncState]);

  useEffect(() => {
    testRef.current = new ActiveTest(sessionId);
    reset();
  }, [sessionId, reset]);

  const startTest = useCallback(() => {
    const test = testRef.current;
    try {
      test.startTest();
      syncState();
      setHoldDuration(null);
      return true;
    } catch (error) {
      console.error("Failed to start active test", error);
      return false;
    }
  }, [syncState]);

  const beginExposure = useCallback(() => {
    const test = testRef.current;
    try {
      test.beginExposure();
      setState(test.state);
      return true;
    } catch (error) {
      console.error("Failed to begin exposure", error);
      return false;
    }
  }, []);

  const completeExposure = useCallback(() => {
    const test = testRef.current;
    try {
      test.completeExposure();
      setState(test.state);
      return true;
    } catch (error) {
      console.error("Failed to complete exposure", error);
      return false;
    }
  }, []);

  const startTimer = useCallback(() => {
    try {
      testRef.current.startTimer();
      return true;
    } catch (error) {
      console.warn("Trying to start timer outside reproduction phase", error);
      return false;
    }
  }, []);

  const endTimer = useCallback(() => {
    try {
      const test = testRef.current;
      const result = test.endTimer();
      setHoldDuration(test.userExposure);
      setState(test.state);
      return result;
    } catch (error) {
      console.error("Failed to finish active test", error);
      return null;
    }
  }, []);

  return {
    test: testRef.current,
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
  };
}
