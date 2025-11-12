import { useState, useCallback, useMemo } from "react";
import { useRegularityTestOperations } from "@/context/RegularityTestContext";
import { useResultPersistence } from "./useResultPersistence";
import { RegularityResult } from "@models/RegularityResult";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

const STORAGE_KEY = "regularityTestResults";

interface UseRegularityTestHandlersProps {
  onComplete?: () => void;
}

export function useRegularityTestHandlers({
  onComplete,
}: UseRegularityTestHandlersProps = {}) {
  const operations = useRegularityTestOperations();
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [cachedResult, setCachedResult] = useState<RegularityResult | null>(null);
  const repository = useMemo(() => {
    const storage = new AsyncStorageAdapter();
    return new RegularityResultsRepository(STORAGE_KEY, storage);
  }, []);
  const { saveResult } = useResultPersistence(repository);

  const handleStart = useCallback(() => {
    if (operations.startTest()) {
      setIsCountdownActive(true);
      setCachedResult(null);
      return true;
    }
    return false;
  }, [operations]);

  const handleCountdownComplete = useCallback(() => {
    setIsCountdownActive(false);
    if (operations.beginTapping()) {
      return true;
    }
    return false;
  }, [operations]);

  const handleTap = useCallback(() => {
    const wasComplete = operations.recordTap();
    if (wasComplete) {
      const result = operations.analyzeResults();
      setCachedResult(result);
    }
  }, [operations]);

  const handleAnalyzeAndNext = useCallback(async () => {
    const result = cachedResult || operations.analyzeResults();
    if (result) {
      await saveResult(result);
      operations.complete();
      operations.reset();
      setCachedResult(null);
      if (onComplete) {
        onComplete();
      }
      return true;
    }
    return false;
  }, [operations, saveResult, onComplete, cachedResult]);

  return {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handleTap,
    handleAnalyzeAndNext,
  };
}
