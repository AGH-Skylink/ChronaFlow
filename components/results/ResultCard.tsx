import React from "react";
import { View, Text } from "react-native";
import { ActiveResult } from "@models/ActiveResult";
import { resultCardStyles } from "@/constants/resultStyles";
import { ResultRow } from "@/components/ResultRow";
import { NotesEditor } from "@/components/NotesEditor";
import { DeleteButton } from "@/components/TestResultComponents";
import { formatDate } from "@/utils/results-utls";

interface ResultCardProps {
  result: ActiveResult;
  isEditing: boolean;
  onEditStart: () => void;
  onSaveNote: (noteText: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export function ResultCard({
  result,
  isEditing,
  onEditStart,
  onSaveNote,
  onCancelEdit,
  onDelete,
}: ResultCardProps) {
  const difference = Math.abs(result.userDuration - result.targetDuration);

  return (
    <View style={resultCardStyles.resultCard}>
      <View style={resultCardStyles.resultHeader}>
        <View style={resultCardStyles.dateEmojiContainer}>
          <Text style={resultCardStyles.resultDate}>
            {formatDate(result.timestamp)}
          </Text>
        </View>
      </View>

      <ResultRow
        label="Target duration:"
        value={`${result.targetDuration} ms`}
      />

      <ResultRow label="Your duration:" value={`${result.userDuration} ms`} />

      <ResultRow label="Difference:" value={`${difference} ms`} />

      <NotesEditor
        notes={result.notes}
        isEditing={isEditing}
        onEditStart={onEditStart}
        onSave={onSaveNote}
        onCancel={onCancelEdit}
      />

      <DeleteButton handlePress={onDelete} />
    </View>
  );
}
