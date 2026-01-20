import React from "react";
import { ExtraOptionsMenu } from "./ExtraOptionsMenu";
interface ResultsMenuProps {
  onShare: () => Promise<void>;
  onSave: () => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function ResultsMenu({
  onShare,
  onSave,
  onClearAll,
}: ResultsMenuProps) {
  return (
    <ExtraOptionsMenu
      onShare={onShare}
      onSave={onSave}
      onClearAll={onClearAll}
    />
  );
}
