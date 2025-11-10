import React from "react";
import { Countdown } from "@/components/Countdown";
import { useActiveTestStateContext } from "@/context/ActiveTestContext";
import { ExposureBasedTestHeader } from "@/components/exposure-based-test/ExposureBasedTestHeader";
import { ActiveTestPhaseContent } from "./ActiveTestPhaseContent";

interface ActiveTestFlowProps {
  testName: string;
  isCountdownActive: boolean;
  onCountdownComplete: () => void;
  onStartTimer: () => void;
  onEndTimer: () => void;
  onNext: () => void;
  nextButtonLabel: string;
}

export function ActiveTestFlow({
  testName,
  isCountdownActive,
  onCountdownComplete,
  onStartTimer,
  onEndTimer,
  onNext,
  nextButtonLabel,
}: ActiveTestFlowProps) {
  const { state: phase } = useActiveTestStateContext();

  return (
    <>
      {isCountdownActive && <Countdown onComplete={onCountdownComplete} />}

      <ExposureBasedTestHeader
        testName={testName}
        phase={phase}
        isCountdownActive={isCountdownActive}
      />

      <ActiveTestPhaseContent
        isCountdownActive={isCountdownActive}
        onStartTimer={onStartTimer}
        onEndTimer={onEndTimer}
        onNext={onNext}
        nextButtonLabel={nextButtonLabel}
      />
    </>
  );
}
