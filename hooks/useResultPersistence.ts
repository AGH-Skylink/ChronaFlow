import { useCallback } from "react";
import { saveTestResult } from "@/utils/results-utls";

/**
 * Generic hook for result persistence across test types
 * Accepts storage key as parameter for reusability
 * Generic type T represents any result type (ExposureBasedResult, RegularityResult, etc.)
 * All result types must have an 'id' property for storage
 */
export function useResultPersistence<T extends { id: string }>(storageKey: string) {
  const saveResult = useCallback(
    async (result: T) => {
      try {
        await saveTestResult(storageKey, result);
      } catch (error) {
        console.error("Failed to save result", error);
      }
    },
    [storageKey]
  );

  return { saveResult };
}
