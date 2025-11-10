import React, { ReactNode } from "react";
import { RegularityPhase } from "@features/RegularityTest";
import { useRegularityTestState } from "@/hooks/useRegularityTestState";
import { RegularityResult } from "@models/RegularityResult";
import { createTestContext, TestContextValue } from "./TestContext";

interface RegularityTestState {
  state: RegularityPhase;
  tapCount: number;
  isComplete: boolean;
  avgInterval: number;
  stdDevInterval: number;
}

interface RegularityTestOperations {
  startTest: () => boolean;
  beginTapping: () => boolean;
  recordTap: () => boolean;
  analyzeResults: () => RegularityResult | null;
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
    },
    operations: {
      startTest: testState.startTest,
      beginTapping: testState.beginTapping,
      recordTap: testState.recordTap,
      analyzeResults: testState.analyzeResults,
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
