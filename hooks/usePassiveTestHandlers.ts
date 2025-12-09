import { useState, useCallback, useMemo } from "react";
import { usePassiveTestOperations, usePassiveTestStateContext } from "@/context/PassiveTestContext";
import { useExposureTimer } from "./useExposureTimer";
import { useResultPersistence } from "./useResultPersistence";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

const STORAGE_KEY = "passiveTestResults";

interface UsePassiveTestHandlersProps {
  onComplete?: () => void;
}

export function usePassiveTestHandlers({
  onComplete,
}: UsePassiveTestHandlersProps = {}) {
  const operations = usePassiveTestOperations();
  const stateContext = usePassiveTestStateContext();
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const repository = useMemo(() => {
    const storage = new AsyncStorageAdapter();
    return new ResultsRepository(STORAGE_KEY, storage);
  }, []);
  const { saveResult } = useResultPersistence(repository);

  const { startTimer: startExposureTimer } = useExposureTimer({
    getTargetExposure: () => stateContext.targetExposure,
    onComplete: operations.completeExposure,
    enabled: true,
  });

  const handleStart = useCallback(() => {
    if (operations.startTest()) {
      setIsCountdownActive(true);
      return true;
    }
    return false;
  }, [operations]);

  const handleCountdownComplete = useCallback(() => {
    setIsCountdownActive(false);
    if (operations.beginExposure()) {
      startExposureTimer();
      return true;
    }
    return false;
  }, [operations, startExposureTimer]);

  const handleSliderChange = useCallback(
    (value: number) => {
      operations.setSliderValue(value);
    },
    [operations]
  );

  const handleCalculateResults = useCallback(async () => {
    const result = operations.calculateResults();
    if (result) {
      await saveResult(result);
      return true;
    }
    return false;
  }, [operations, saveResult]);

  const handleNextTest = useCallback(() => {
    operations.reset();
    if (onComplete) {
      onComplete();
    }
  }, [operations, onComplete]);

  return {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handleSliderChange,
    handleCalculateResults,
    handleNextTest,
  };
}
