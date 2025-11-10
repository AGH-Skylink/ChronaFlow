import React, { createContext, useContext, ReactNode } from "react";

export interface ExposureBasedTestContextValue<TState, TOperations> {
  state: TState;
  operations: TOperations;
}

/**
 * Factory function to create a typed context for exposure-based tests
 * This enables reuse of the context pattern across Active, Passive, and Regularity tests
 *
 * @param displayName - Name for debugging (e.g., "ActiveTest", "PassiveTest")
 * @returns Context, Provider, and hooks for the test type
 */
export function createExposureBasedTestContext<TState, TOperations>(
  displayName: string
) {
  const Context = createContext<ExposureBasedTestContextValue<
    TState,
    TOperations
  > | null>(null);

  Context.displayName = `${displayName}Context`;

  function useContextInternal() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(
        `use${displayName}Context must be used within ${displayName}Provider`
      );
    }
    return context;
  }

  function useStateContext() {
    return useContextInternal().state;
  }

  function useOperations() {
    return useContextInternal().operations;
  }

  return {
    Context,
    useContext: useContextInternal,
    useStateContext,
    useOperations,
  };
}
