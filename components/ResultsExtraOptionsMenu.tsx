import React from "react";
import { ExtraOptionsMenu } from "./ExtraOptionsMenu";
interface ResultsMenuProps {
  onExport: () => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function ResultsMenu({ onExport, onClearAll }: ResultsMenuProps) {
  return <ExtraOptionsMenu onExport={onExport} onClearAll={onClearAll} />;
}
