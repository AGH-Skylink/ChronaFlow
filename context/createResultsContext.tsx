import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  BaseResultsRepository,
  IResult,
  ExportConfigBase,
} from "@/src/domain/repositories/BaseResultsRepository";

export interface ResultsState<T extends IResult> {
  results: T[];
  loading: boolean;
}

export interface ResultsOperations {
  refresh: () => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  saveNote: (id: string, noteText: string) => Promise<void>;
  clearAll: () => Promise<void>;
  exportResults: () => Promise<void>;
}

export interface ResultsContextValue<T extends IResult> {
  state: ResultsState<T>;
  operations: ResultsOperations;
}

export function createResultsContext<T extends IResult>(
  displayName: string,
  repositoryFactory: (storageKey: string) => BaseResultsRepository<T>
) {
  const Context = createContext<ResultsContextValue<T> | null>(null);
  Context.displayName = `${displayName}Context`;

  interface ResultsProviderProps {
    children: ReactNode;
    storageKey: string;
    exportConfig: ExportConfigBase;
  }

  function ResultsProvider({
    children,
    storageKey,
    exportConfig,
  }: ResultsProviderProps) {
    const [results, setResults] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [repository] = useState(() => repositoryFactory(storageKey));

    const refresh = useCallback(async () => {
      try {
        setLoading(true);
        const loadedResults = await repository.loadAll();
        setResults(loadedResults);
      } catch (error) {
        console.error("Error refreshing results:", error);
      } finally {
        setLoading(false);
      }
    }, [repository]);

    useEffect(() => {
      refresh();
    }, [storageKey, refresh]);

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

    const contextValue: ResultsContextValue<T> = {
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

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  }

  function useResultsContext() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(
        `use${displayName}Context must be used within ${displayName}Provider`
      );
    }
    return context;
  }

  function useResultsState() {
    const { state } = useResultsContext();
    return state;
  }

  function useResultsOperations() {
    const { operations } = useResultsContext();
    return operations;
  }

  return {
    Context,
    Provider: ResultsProvider,
    useContext: useResultsContext,
    useState: useResultsState,
    useOperations: useResultsOperations,
  };
}
