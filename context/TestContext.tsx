import React, { createContext, useContext, ReactNode } from "react";

export interface TestContextValue<TState, TOperations> {
  state: TState;
  operations: TOperations;
}

/**
 * Factory function to create a typed context for any test type
 * This enables reuse of the context pattern across Active, Passive, and Regularity tests
 *
 * @param displayName - Name for debugging (e.g., "ActiveTest", "PassiveTest", "RegularityTest")
 * @returns Context, Provider, and hooks for the test type
 */
export function createTestContext<TState, TOperations>(displayName: string) {
  const Context = createContext<TestContextValue<TState, TOperations> | null>(
    null
  );
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
