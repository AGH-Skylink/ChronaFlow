import React, { ReactNode } from "react";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";
import { useActiveTestState } from "@/hooks/useActiveTestState";
import { ActiveResult } from "@models/ActiveResult";
import { createTestContext, TestContextValue } from "./TestContext";

interface ActiveTestState {
  state: ExposureBasedPhase;
  targetExposure: number;
  emoji: string;
  holdDuration: number | null;
}

interface ActiveTestOperations {
  startTest: () => boolean;
  beginExposure: () => boolean;
  completeExposure: () => boolean;
  startTimer: () => boolean;
  endTimer: () => ActiveResult | null;
  reset: () => void;
}

const ActiveTestContextHelper = createTestContext<
  ActiveTestState,
  ActiveTestOperations
>("ActiveTest");

interface ActiveTestProviderProps {
  children: ReactNode;
  sessionId: string | null;
}

export function ActiveTestProvider({
  children,
  sessionId,
}: ActiveTestProviderProps) {
  const testState = useActiveTestState(sessionId);

  const contextValue: TestContextValue<ActiveTestState, ActiveTestOperations> =
    {
      state: {
        state: testState.state,
        targetExposure: testState.targetExposure,
        emoji: testState.emoji,
        holdDuration: testState.holdDuration,
      },
      operations: {
        startTest: testState.startTest,
        beginExposure: testState.beginExposure,
        completeExposure: testState.completeExposure,
        startTimer: testState.startTimer,
        endTimer: testState.endTimer,
        reset: testState.reset,
      },
    };

  return (
    <ActiveTestContextHelper.Context.Provider value={contextValue}>
      {children}
    </ActiveTestContextHelper.Context.Provider>
  );
}

export function useActiveTestContext() {
  return ActiveTestContextHelper.useContext();
}

export function useActiveTestStateContext() {
  return ActiveTestContextHelper.useStateContext();
}

export function useActiveTestOperations() {
  return ActiveTestContextHelper.useOperations();
}
