import { useState, useCallback, useMemo } from "react";
import { Session } from "@/types/session";
import { SessionManagementService } from "@/src/application/services/SessionManagementService";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { SessionResultCleanupService } from "@/src/domain/services/SessionResultCleanupService";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

export function useSessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sessionManagementService = useMemo(() => {
    const storage = new AsyncStorageAdapter();
    const sessionRepo = new SessionRepository(storage);
    const activeRepo = new ResultsRepository("activeTestResults", storage);
    const passiveRepo = new ResultsRepository("passiveTestResults", storage);
    const regularityRepo = new RegularityResultsRepository("regularityTestResults", storage);
    const cleanupService = new SessionResultCleanupService(activeRepo, passiveRepo, regularityRepo);
    
    return new SessionManagementService(sessionRepo, cleanupService);
  }, []);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedSessions = await sessionManagementService.loadAllSessions();
      setSessions(loadedSessions);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load sessions");
      setError(error);
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionManagementService]);

  const createNewSession = useCallback(() => {
    return sessionManagementService.createNewSession();
  }, [sessionManagementService]);

  const saveSession = useCallback(
    async (session: Session, name: string) => {
      setError(null);
      try {
        await sessionManagementService.saveSession(session, name);
        await loadSessions();
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to save session");
        setError(error);
        throw error;
      }
    },
    [sessionManagementService, loadSessions]
  );

  const deleteSession = useCallback(
    async (sessionId: string, deleteResults: boolean = false) => {
      setError(null);
      try {
        await sessionManagementService.deleteSession(sessionId, deleteResults);
        await loadSessions();
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to delete session");
        setError(error);
        throw error;
      }
    },
    [sessionManagementService, loadSessions]
  );

  const getSessionById = useCallback(
    async (sessionId: string) => {
      return await sessionManagementService.getSessionById(sessionId);
    },
    [sessionManagementService]
  );

  const validateSessionName = useCallback(
    (name: string) => {
      return sessionManagementService.validateSessionName(name);
    },
    [sessionManagementService]
  );

  return {
    sessions,
    loading,
    error,
    loadSessions,
    createNewSession,
    saveSession,
    deleteSession,
    getSessionById,
    validateSessionName,
  };
}
