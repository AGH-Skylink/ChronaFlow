import React from "react";
import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import {
  ResultsRepository,
  ExportConfig,
} from "@/src/domain/repositories/ResultsRepository";
import { createResultsContext } from "./createResultsContext";
import { ExportConfigBase } from "@/src/domain/repositories/BaseResultsRepository";
import { AsyncStorageAdapter } from "@/src/infrastructure/storage/AsyncStorageAdapter";

const resultsContextHelper = createResultsContext<ExposureBasedResult>(
  "Results",
  (storageKey) => {
    const storage = new AsyncStorageAdapter();
    return new ResultsRepository(storageKey, storage);
  }
);

export const ResultsProvider = resultsContextHelper.Provider;

export function useResultsContext() {
  return resultsContextHelper.useContext();
}

export function useResultsState() {
  return resultsContextHelper.useState();
}

export function useResultsOperations() {
  return resultsContextHelper.useOperations();
}

export type { ExportConfig, ExportConfigBase };
