import { useCallback, useEffect, useRef } from "react";

interface UseExposureTimerProps {
  targetExposure: number;
  onComplete: () => void;
  enabled: boolean;
}

export function useExposureTimer({
  targetExposure,
  onComplete,
  enabled,
}: UseExposureTimerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (enabled && targetExposure > 0) {
      timerRef.current = setTimeout(() => {
        try {
          onComplete();
        } catch (error) {
          console.error("Failed to complete exposure", error);
        } finally {
          timerRef.current = null;
        }
      }, targetExposure);
    }
  }, [targetExposure, onComplete, enabled, clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return { startTimer, clearTimer };
}
