import React from "react";
import { SessionBlock } from "@/types/session";
import ActiveTest from "@/app/pages/active-test-page";
import PassiveTest from "@/app/pages/passive-test-page";
import RegularityTest from "@/app/pages/regularity-test-page";

interface TestRendererProps {
  block: SessionBlock;
  sessionId: string | undefined;
  onComplete: () => void;
}

export function TestRenderer({
  block,
  sessionId,
  onComplete,
}: TestRendererProps) {
  switch (block.type) {
    case "active":
      return (
        <ActiveTest onComplete={onComplete} sessionId={sessionId?.toString()} />
      );
    case "passive":
      return (
        <PassiveTest
          onComplete={onComplete}
          sessionId={sessionId?.toString()}
        />
      );
    case "regularity":
      return (
        <RegularityTest
          onComplete={onComplete}
          sessionId={sessionId?.toString()}
        />
      );
    default:
      return null;
  }
}
