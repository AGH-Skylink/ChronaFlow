import { useCallback } from "react";
import { saveTestResult } from "@/utils/results-utls";
import { ExposureBasedResult } from "@models/ExposureBasedResult";

/**
 * Generic hook for persisting test results
 * Works with any ExposureBasedResult (Active, Passive, Regularity)
 */
export function useResultPersistence(storageKey: string = "activeTestResults") {
  const saveResult = useCallback(async (result: ExposureBasedResult) => {
    try {
      await saveTestResult(storageKey, result);
      return true;
    } catch (error) {
      console.error("Failed to save test result", error);
      return false;
    }
  }, [storageKey]);

  return { saveResult };
}
