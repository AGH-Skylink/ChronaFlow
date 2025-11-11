import { useState, useCallback, useMemo } from "react";
import { useRegularityTestOperations } from "@/context/RegularityTestContext";
import { useResultPersistence } from "./useResultPersistence";
import { RegularityResult } from "@models/RegularityResult";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";

const STORAGE_KEY = "regularityTestResults";

interface UseRegularityTestHandlersProps {
  onComplete?: () => void;
}

export function useRegularityTestHandlers({
  onComplete,
}: UseRegularityTestHandlersProps = {}) {
  const operations = useRegularityTestOperations();
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const repository = useMemo(() => new RegularityResultsRepository(STORAGE_KEY), []);
  const { saveResult } = useResultPersistence(repository);

  const handleStart = useCallback(() => {
    if (operations.startTest()) {
      setIsCountdownActive(true);
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
    operations.recordTap();
  }, [operations]);

  const handleAnalyzeAndNext = useCallback(async () => {
    const result = operations.analyzeResults();
    if (result) {
      await saveResult(result);
      if (onComplete) {
        operations.reset();
        onComplete();
      }
      return true;
    }
    return false;
  }, [operations, saveResult, onComplete]);

  return {
    isCountdownActive,
    handleStart,
    handleCountdownComplete,
    handleTap,
    handleAnalyzeAndNext,
  };
}
