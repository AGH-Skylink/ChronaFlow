import React from "react";
import { Countdown } from "@/components/Countdown";
import { usePassiveTestStateContext } from "@/context/PassiveTestContext";
import { ExposureBasedTestHeader } from "@/components/exposure-based-test/ExposureBasedTestHeader";
import { PassiveTestPhaseContent } from "./PassiveTestPhaseContent";

interface PassiveTestFlowProps {
  isCountdownActive: boolean;
  onCountdownComplete: () => void;
  onSliderChange: (value: number) => void;
  onCalculateResults: () => void;
  onNext: () => void;
  nextButtonLabel: string;
}

export function PassiveTestFlow({
  isCountdownActive,
  onCountdownComplete,
  onSliderChange,
  onCalculateResults,
  onNext,
  nextButtonLabel,
}: PassiveTestFlowProps) {
  const { state: phase, testName } = usePassiveTestStateContext();

  return (
    <>
      {isCountdownActive && <Countdown onComplete={onCountdownComplete} />}

      <ExposureBasedTestHeader
        testName={testName}
        phase={phase}
        isCountdownActive={isCountdownActive}
      />

      <PassiveTestPhaseContent
        isCountdownActive={isCountdownActive}
        onSliderChange={onSliderChange}
        onCalculateResults={onCalculateResults}
        onNext={onNext}
        nextButtonLabel={nextButtonLabel}
      />
    </>
  );
}
