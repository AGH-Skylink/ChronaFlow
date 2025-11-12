import { useCallback, useEffect, useRef, useState } from "react";
import { ExposureBasedTest } from "@stp-tests/ExposureBasedTest";

/**
 * Generic hook for managing any ExposureBasedTest instance
 * Provides shared state management logic for Active, Passive, and Regularity tests
 * 
 * @param testFactory - Factory function to create test instance
 * @param sessionId - Session ID for the test
 * @returns Base test state and operations
 */
type ExposureBasedTestConstructor<T extends ExposureBasedTest> = new (
  sessionId: string | null
) => T;

export function useExposureBasedTestState<T extends ExposureBasedTest>(
  TestConstructor: ExposureBasedTestConstructor<T>,
  sessionId: string | null
) {
  const testRef = useRef(new TestConstructor(sessionId));
  const [state, setState] = useState(testRef.current.state);
  const [targetExposure, setTargetExposure] = useState<number>(0);
  const [emoji, setEmoji] = useState(testRef.current.emoji);

  const syncState = useCallback(() => {
    const test = testRef.current;
    setState(test.state);
    setTargetExposure(test.targetExposure);
    setEmoji(test.emoji);
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
      console.error("Failed to start test", error);
      return false;
    }
  }, [syncState]);

  const beginExposure = useCallback(() => {
    try {
      testRef.current.beginExposure();
      setState(testRef.current.state);
      return true;
    } catch (error) {
      console.error("Failed to begin exposure", error);
      return false;
    }
  }, []);

  const completeExposure = useCallback(() => {
    try {
      testRef.current.completeExposure();
      setState(testRef.current.state);
      return true;
    } catch (error) {
      console.error("Failed to complete exposure", error);
      return false;
    }
  }, []);

  const complete = useCallback(() => {
    try {
      testRef.current.complete();
      setState(testRef.current.state);
      return true;
    } catch (error) {
      console.error("Failed to complete test", error);
      return false;
    }
  }, []);

  useEffect(() => {
    testRef.current = new TestConstructor(sessionId);
    reset();
  }, [sessionId, reset, TestConstructor]);

  return {
    test: testRef.current,
    state,
    targetExposure,
    emoji,
    startTest,
    beginExposure,
    completeExposure,
    complete,
    reset,
    syncState,
  };
}
