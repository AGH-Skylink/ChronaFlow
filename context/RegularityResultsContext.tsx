import React from "react";
import { RegularityResult } from "@/src/domain/models/RegularityResult";
import {
  RegularityResultsRepository,
  RegularityExportConfig,
} from "@/src/domain/repositories/RegularityResultsRepository";
import { createResultsContext } from "./createResultsContext";
import { ExportConfigBase } from "@/src/domain/repositories/BaseResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

const regularityResultsContextHelper = createResultsContext<RegularityResult>(
  "RegularityResults",
  (storageKey) => {
    const storage = new AsyncStorageAdapter();
    return new RegularityResultsRepository(storageKey, storage);
  }
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

export type { RegularityExportConfig, ExportConfigBase };
