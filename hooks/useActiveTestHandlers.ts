import { useState, useCallback, useMemo } from "react";
import { ExposureBasedPhase } from "@/src/domain/stp-tests/ExposureBasedTest";
import { useActiveTestOperations } from "@/context/ActiveTestContext";
import { useExposureTimer } from "./useExposureTimer";
import { useResultPersistence } from "./useResultPersistence";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

const STORAGE_KEY = "activeTestResults";

interface UseActiveTestHandlersProps {
  onComplete?: () => void;
}

export function useActiveTestHandlers({
  onComplete,
}: UseActiveTestHandlersProps = {}) {
  const operations = useActiveTestOperations();
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const repository = useMemo(() => {
    const storage = new AsyncStorageAdapter();
    return new ResultsRepository(STORAGE_KEY, storage);
  }, []);
  const { saveResult } = useResultPersistence(repository);

  const { startTimer: startExposureTimer } = useExposureTimer({
    targetExposure: 0,
    onComplete: operations.completeExposure,
    enabled: false,
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

  const handlePressOut = useCallback(async () => {
    const result = operations.endTimer();
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
    handlePressOut,
    handleNextTest,
  };
}
