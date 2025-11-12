import React, { ReactNode } from "react";
import { RegularityPhase } from "@/src/domain/stp-tests/RegularityTest";
import { useRegularityTestState } from "@/hooks/useRegularityTestState";
import { RegularityResult } from "@models/RegularityResult";
import { createTestContext, TestContextValue } from "./TestContext";

interface RegularityTestState {
  state: RegularityPhase;
  tapCount: number;
  isComplete: boolean;
  avgInterval: number;
  stdDevInterval: number;
  testName: string;
}

interface RegularityTestOperations {
  startTest: () => boolean;
  beginTapping: () => boolean;
  recordTap: () => boolean;
  analyzeResults: () => RegularityResult | null;
  complete: () => boolean;
  reset: () => void;
}

const RegularityTestContextHelper = createTestContext<
  RegularityTestState,
  RegularityTestOperations
>("RegularityTest");

interface RegularityTestProviderProps {
  children: ReactNode;
  sessionId: string | null;
}

export function RegularityTestProvider({
  children,
  sessionId,
}: RegularityTestProviderProps) {
  const testState = useRegularityTestState(sessionId);

  const contextValue: TestContextValue<
    RegularityTestState,
    RegularityTestOperations
  > = {
    state: {
      state: testState.state,
      tapCount: testState.tapCount,
      isComplete: testState.isComplete,
      avgInterval: testState.avgInterval,
      stdDevInterval: testState.stdDevInterval,
      testName: "Regularity Test",
    },
    operations: {
      startTest: testState.startTest,
      beginTapping: testState.beginTapping,
      recordTap: testState.recordTap,
      analyzeResults: testState.analyzeResults,
      complete: testState.complete,
      reset: testState.reset,
    },
  };

  return (
    <RegularityTestContextHelper.Context.Provider value={contextValue}>
      {children}
    </RegularityTestContextHelper.Context.Provider>
  );
}

export function useRegularityTestContext() {
  return RegularityTestContextHelper.useContext();
}

export function useRegularityTestStateContext() {
  return RegularityTestContextHelper.useStateContext();
}

export function useRegularityTestOperations() {
  return RegularityTestContextHelper.useOperations();
}
