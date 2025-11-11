import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSessionPlayer } from "@/hooks/useSessionPlayer";
import { SessionLoading } from "@/components/session/SessionLoading";
import { SessionError } from "@/components/session/SessionError";
import { SessionOverview } from "@/components/session/SessionOverview";
import { SessionCompletion } from "@/components/session/SessionCompletion";
import { TestRenderer } from "@/components/session/TestRenderer";

export default function SessionPlayer() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();

  const {
    session,
    currentBlockIndex,
    status,
    error,
    handleStart,
    handleNext,
    getCurrentBlock,
  } = useSessionPlayer({
    sessionId: sessionId?.toString() || "",
  });

  const handleExit = () => router.back();

  if (status === "loading") {
    return <SessionLoading />;
  }

  if (status === "error" || !session) {
    return (
      <SessionError error={error || "Session not found"} onBack={handleExit} />
    );
  }

  if (status === "completed") {
    return <SessionCompletion sessionName={session.name} onExit={handleExit} />;
  }

  if (status === "overview") {
    return (
      <SessionOverview
        session={session}
        currentBlockIndex={currentBlockIndex}
        onBack={handleExit}
        onBegin={handleStart}
      />
    );
  }

  const currentBlock = getCurrentBlock();

  return currentBlock ? (
    <TestRenderer
      block={currentBlock}
      sessionId={sessionId?.toString()}
      onComplete={handleNext}
    />
  ) : null;
}
