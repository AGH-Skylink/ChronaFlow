import React, { ReactNode } from "react";
import { ExposureBasedPhase } from "@/src/domain/stp-tests/ExposureBasedTest";
import { usePassiveTestState } from "@/hooks/usePassiveTestState";
import { ExposureBasedResult } from "@models/ExposureBasedResult";
import { createTestContext, TestContextValue } from "./TestContext";

interface PassiveTestState {
  state: ExposureBasedPhase;
  targetExposure: number;
  emoji: string;
  sliderValue: number;
  testName: string;
}

interface PassiveTestOperations {
  startTest: () => boolean;
  beginExposure: () => boolean;
  completeExposure: () => boolean;
  setSliderValue: (value: number) => void;
  calculateResults: () => ExposureBasedResult | null;
  reset: () => void;
}

const PassiveTestContextHelper = createTestContext<
  PassiveTestState,
  PassiveTestOperations
>("PassiveTest");

interface PassiveTestProviderProps {
  children: ReactNode;
  sessionId: string | null;
}

export function PassiveTestProvider({
  children,
  sessionId,
}: PassiveTestProviderProps) {
  const testState = usePassiveTestState(sessionId);

  const contextValue: TestContextValue<
    PassiveTestState,
    PassiveTestOperations
  > = {
    state: {
      state: testState.state,
      targetExposure: testState.targetExposure,
      emoji: testState.emoji,
      sliderValue: testState.sliderValue,
      testName: "Passive Test",
    },
    operations: {
      startTest: testState.startTest,
      beginExposure: testState.beginExposure,
      completeExposure: testState.completeExposure,
      setSliderValue: testState.setSliderValue,
      calculateResults: testState.calculateResults,
      reset: testState.reset,
    },
  };

  return (
    <PassiveTestContextHelper.Context.Provider value={contextValue}>
      {children}
    </PassiveTestContextHelper.Context.Provider>
  );
}

export function usePassiveTestContext() {
  return PassiveTestContextHelper.useContext();
}

export function usePassiveTestStateContext() {
  return PassiveTestContextHelper.useStateContext();
}

export function usePassiveTestOperations() {
  return PassiveTestContextHelper.useOperations();
}
