import { useCallback } from "react";
import { saveTestResult } from "@/utils/results-utls";
import { ActiveResult } from "@models/ActiveResult";

export function useResultPersistence() {
  const saveResult = useCallback(async (result: ActiveResult) => {
    try {
      await saveTestResult("activeTestResults", result);
      return true;
    } catch (error) {
      console.error("Failed to save test result", error);
      return false;
    }
  }, []);

  return { saveResult };
}
