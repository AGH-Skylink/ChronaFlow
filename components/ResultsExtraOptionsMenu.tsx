import React from "react";
import { ExtraOptionsMenu } from "./ExtraOptionsMenu";
import { useResultsOperations } from "@/context/ResultsContext";
import { useRegularityResultsOperations } from "@/context/RegularityResultsContext";

export function ExposureBasedResultsMenu() {
  const operations = useResultsOperations();

  return (
    <ExtraOptionsMenu
      onExport={operations.exportResults}
      onClearAll={operations.clearAll}
    />
  );
}

export function RegularityResultsMenu() {
  const operations = useRegularityResultsOperations();

  return (
    <ExtraOptionsMenu
      onExport={operations.exportResults}
      onClearAll={operations.clearAll}
    />
  );
}
