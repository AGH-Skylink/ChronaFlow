import React, { createContext, useContext, ReactNode } from "react";
import { ExposureBasedPhase } from "@features/ExposureBasedTest";
import { useActiveTestState } from "@/hooks/useActiveTestState";
import { ActiveResult } from "@models/ActiveResult";

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

interface ActiveTestContextValue {
  state: ActiveTestState;
  operations: ActiveTestOperations;
}

const ActiveTestContext = createContext<ActiveTestContextValue | null>(null);

interface ActiveTestProviderProps {
  children: ReactNode;
  sessionId: string | null;
}

export function ActiveTestProvider({
  children,
  sessionId,
}: ActiveTestProviderProps) {
  const testState = useActiveTestState(sessionId);

  const contextValue: ActiveTestContextValue = {
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
    <ActiveTestContext.Provider value={contextValue}>
      {children}
    </ActiveTestContext.Provider>
  );
}

export function useActiveTestContext() {
  const context = useContext(ActiveTestContext);
  if (!context) {
    throw new Error(
      "useActiveTestContext must be used within ActiveTestProvider"
    );
  }
  return context;
}

export function useActiveTestStateContext() {
  const { state } = useActiveTestContext();
  return state;
}

export function useActiveTestOperations() {
  const { operations } = useActiveTestContext();
  return operations;
}
