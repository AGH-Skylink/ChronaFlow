import { useState, useEffect, useCallback, useMemo } from "react";
import { Session } from "@/src/domain/session/Session";
import { SessionPlayerService } from "@/src/application/services/SessionPlayerService";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { SessionBlock } from "@/types/session";

type SessionStatus = "loading" | "overview" | "playing" | "completed" | "error";

interface UseSessionPlayerProps {
  sessionId: string;
}

export function useSessionPlayer({ sessionId }: UseSessionPlayerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => new SessionPlayerService(new SessionRepository()), []);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setStatus("loading");
      const loadedSession = await service.loadSession(sessionId);
      
      if (loadedSession) {
        setSession(loadedSession);
        setStatus("overview");
      } else {
        setError("Session not found");
        setStatus("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
      setStatus("error");
    }
  };

  const handleStart = useCallback(() => {
    setStatus("playing");
  }, []);

  const handleNext = useCallback(() => {
    if (!session) return;

    const nextAction = service.determineNextAction(session, currentBlockIndex);

    if (nextAction === "advance") {
      setCurrentBlockIndex((prev) => prev + 1);
    } else {
      setStatus("completed");
    }
  }, [session, currentBlockIndex, service]);

  const handleReset = useCallback(() => {
    setCurrentBlockIndex(0);
    setStatus("overview");
  }, []);

  const getCurrentBlock = useCallback((): SessionBlock | null => {
    return session?.getBlockAt(currentBlockIndex) ?? null;
  }, [session, currentBlockIndex]);

  return {
    session,
    currentBlockIndex,
    status,
    error,
    handleStart,
    handleNext,
    handleReset,
    getCurrentBlock,
  };
}
