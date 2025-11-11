import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { RegularityResult } from "@/src/domain/models/RegularityResult";
import {
  RegularityResultsRepository,
  RegularityExportConfig,
} from "@/src/domain/repositories/RegularityResultsRepository";

interface RegularityResultsState {
  results: RegularityResult[];
  loading: boolean;
}

interface RegularityResultsOperations {
  refresh: () => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  saveNote: (id: string, noteText: string) => Promise<void>;
  clearAll: () => Promise<void>;
  exportResults: () => Promise<void>;
}

interface RegularityResultsContextValue {
  state: RegularityResultsState;
  operations: RegularityResultsOperations;
}

const RegularityResultsContext =
  createContext<RegularityResultsContextValue | null>(null);

interface RegularityResultsProviderProps {
  children: ReactNode;
  storageKey: string;
  exportConfig: RegularityExportConfig;
}

export function RegularityResultsProvider({
  children,
  storageKey,
  exportConfig,
}: RegularityResultsProviderProps) {
  const [results, setResults] = useState<RegularityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [repository] = useState(
    () => new RegularityResultsRepository(storageKey)
  );

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

  const contextValue: RegularityResultsContextValue = {
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
    <RegularityResultsContext.Provider value={contextValue}>
      {children}
    </RegularityResultsContext.Provider>
  );
}

export function useRegularityResultsContext() {
  const context = useContext(RegularityResultsContext);
  if (!context) {
    throw new Error(
      "useRegularityResultsContext must be used within RegularityResultsProvider"
    );
  }
  return context;
}

export function useRegularityResultsState() {
  const { state } = useRegularityResultsContext();
  return state;
}

export function useRegularityResultsOperations() {
  const { operations } = useRegularityResultsContext();
  return operations;
}
