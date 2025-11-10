import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ActiveResult } from "@models/ActiveResult";
import {
  ResultsRepository,
  ExportConfig,
} from "@/src/domain/repositories/ResultsRepository";

interface ResultsState {
  results: ActiveResult[];
  loading: boolean;
}

interface ResultsOperations {
  refresh: () => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  saveNote: (id: string, noteText: string) => Promise<void>;
  clearAll: () => Promise<void>;
  exportResults: () => Promise<void>;
}

interface ResultsContextValue {
  state: ResultsState;
  operations: ResultsOperations;
}

const ResultsContext = createContext<ResultsContextValue | null>(null);

interface ResultsProviderProps {
  children: ReactNode;
  storageKey: string;
  exportConfig: ExportConfig;
}

export function ResultsProvider({
  children,
  storageKey,
  exportConfig,
}: ResultsProviderProps) {
  const [results, setResults] = useState<ActiveResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [repository] = useState(() => new ResultsRepository(storageKey));

  const refresh = async () => {
    try {
      setLoading(true);
      const loadedResults = await repository.loadAll();
      setResults(loadedResults);
    } catch (error) {
      console.error("Error refreshing results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [storageKey]);

  const deleteResult = async (id: string) => {
    try {
      const updatedResults = await repository.delete(id);
      setResults(updatedResults);
    } catch (error) {
      console.error("Error deleting result:", error);
      throw error;
    }
  };

  const saveNote = async (id: string, noteText: string) => {
    try {
      const updatedResults = await repository.updateNote(id, noteText);
      setResults(updatedResults);
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await repository.clearAll();
      setResults([]);
    } catch (error) {
      console.error("Error clearing results:", error);
      throw error;
    }
  };

  const exportResults = async () => {
    try {
      await repository.exportToCsv(exportConfig);
    } catch (error) {
      console.error("Error exporting results:", error);
      throw error;
    }
  };

  const contextValue: ResultsContextValue = {
    state: {
      results,
      loading,
    },
    operations: {
      refresh,
      deleteResult,
      saveNote,
      clearAll,
      exportResults,
    },
  };

  return (
    <ResultsContext.Provider value={contextValue}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResultsContext() {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResultsContext must be used within ResultsProvider");
  }
  return context;
}

export function useResultsState() {
  const { state } = useResultsContext();
  return state;
}

export function useResultsOperations() {
  const { operations } = useResultsContext();
  return operations;
}
