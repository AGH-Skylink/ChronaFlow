import React from "react";
import { View, Text } from "react-native";
import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import { resultCardStyles } from "@/constants/resultStyles";
import { ResultRow } from "@/components/ResultRow";
import { NotesEditor } from "@/components/NotesEditor";
import { DeleteButton } from "@/components/TestResultComponents";
import { DateFormatter } from "@/src/application/utils/DateFormatter";

interface ExposureBasedResultCardProps {
  result: ExposureBasedResult;
  isEditing: boolean;
  onEditStart: () => void;
  onSaveNote: (noteText: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export function ExposureBasedResultCard({
  result,
  isEditing,
  onEditStart,
  onSaveNote,
  onCancelEdit,
  onDelete,
}: ExposureBasedResultCardProps) {
  const difference = Math.abs(result.userDuration - result.targetDuration);

  return (
    <View style={resultCardStyles.resultCard}>
      <View style={resultCardStyles.resultHeader}>
        <View style={resultCardStyles.dateEmojiContainer}>
          <Text style={resultCardStyles.resultDate}>
            {DateFormatter.format(result.timestamp)}
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
