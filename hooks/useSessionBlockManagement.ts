import { useState, useCallback, useMemo, useEffect } from "react";
import { Session, TestType } from "@/types/session";
import { SessionBlockManagementService } from "@/src/application/services/SessionBlockManagementService";

export function useSessionBlockManagement() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const blockManagementService = useMemo(() => new SessionBlockManagementService(), []);

  useEffect(() => {
    if (
      currentSession &&
      (sessionName.trim() !== "" || currentSession.blocks.length > 0)
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [sessionName, currentSession]);

  const initializeSession = useCallback((session: Session) => {
    setCurrentSession(session);
    setSessionName("");
    setHasUnsavedChanges(false);
  }, []);

  const addBlock = useCallback(
    (type: TestType) => {
      if (!currentSession) return;

      try {
        const updatedSession = blockManagementService.addBlockToSession(currentSession, type);
        setCurrentSession(updatedSession);
      } catch (error) {
        console.error("Error adding block:", error);
        throw error;
      }
    },
    [currentSession, blockManagementService]
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      if (!currentSession) return;

      try {
        const updatedSession = blockManagementService.removeBlockFromSession(currentSession, blockId);
        setCurrentSession(updatedSession);
      } catch (error) {
        console.error("Error removing block:", error);
        throw error;
      }
    },
    [currentSession, blockManagementService]
  );

  const moveBlockUp = useCallback(
    (index: number) => {
      if (!currentSession) return;

      try {
        const updatedSession = blockManagementService.moveBlockUp(currentSession, index);
        setCurrentSession(updatedSession);
      } catch (error) {
        console.error("Error moving block up:", error);
      }
    },
    [currentSession, blockManagementService]
  );

  const moveBlockDown = useCallback(
    (index: number) => {
      if (!currentSession) return;

      try {
        const updatedSession = blockManagementService.moveBlockDown(currentSession, index);
        setCurrentSession(updatedSession);
      } catch (error) {
        console.error("Error moving block down:", error);
      }
    },
    [currentSession, blockManagementService]
  );

  const getBlockCount = useCallback(() => {
    if (!currentSession) return 0;
    return blockManagementService.getBlockCount(currentSession);
  }, [currentSession, blockManagementService]);

  const canAddMoreBlocks = useCallback(() => {
    if (!currentSession) return false;
    return blockManagementService.canAddMoreBlocks(currentSession);
  }, [currentSession, blockManagementService]);

  const updateSessionName = useCallback((name: string) => {
    setSessionName(name);
  }, []);

  const reset = useCallback(() => {
    setCurrentSession(null);
    setSessionName("");
    setHasUnsavedChanges(false);
  }, []);

  return {
    currentSession,
    sessionName,
    hasUnsavedChanges,
    initializeSession,
    addBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    getBlockCount,
    canAddMoreBlocks,
    updateSessionName,
    reset,
  };
}
