import React from "react";
import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import {
  ResultsRepository,
  ExportConfig,
} from "@/src/domain/repositories/ResultsRepository";
import { createResultsContext } from "./createResultsContext";
import { ExportConfigBase } from "@/src/domain/repositories/BaseResultsRepository";

const resultsContextHelper = createResultsContext<ExposureBasedResult>(
  "Results",
  (storageKey) => new ResultsRepository(storageKey)
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
