import React from "react";
import { RegularityResult } from "@/src/domain/models/RegularityResult";
import {
  RegularityResultsRepository,
  RegularityExportConfig,
} from "@/src/domain/repositories/RegularityResultsRepository";
import { createResultsContext } from "./createResultsContext";

const regularityResultsContextHelper = createResultsContext<RegularityResult>(
  "RegularityResults",
  (storageKey) => new RegularityResultsRepository(storageKey)
);

export const RegularityResultsProvider =
  regularityResultsContextHelper.Provider;

export function useRegularityResultsContext() {
  return regularityResultsContextHelper.useContext();
}

export function useRegularityResultsState() {
  return regularityResultsContextHelper.useState();
}

export function useRegularityResultsOperations() {
  return regularityResultsContextHelper.useOperations();
}

export type { RegularityExportConfig };
