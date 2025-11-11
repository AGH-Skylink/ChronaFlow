import React from "react";
import { View, Text } from "react-native";
import { RegularityResult } from "@/src/domain/models/RegularityResult";
import { resultCardStyles } from "@/constants/resultStyles";
import { ResultRow } from "@/components/ResultRow";
import { NotesEditor } from "@/components/NotesEditor";
import { DeleteButton } from "@/components/TestResultComponents";
import { formatDate } from "@/utils/results-utls";

interface RegularityResultCardProps {
  result: RegularityResult;
  isEditing: boolean;
  onEditStart: () => void;
  onSaveNote: (noteText: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export function RegularityResultCard({
  result,
  isEditing,
  onEditStart,
  onSaveNote,
  onCancelEdit,
  onDelete,
}: RegularityResultCardProps) {
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
        label="Average interval:"
        value={`${result.avgInterval.toFixed(3)} s`}
      />

      <ResultRow
        label="Standard deviation:"
        value={`${result.stdDevInterval.toFixed(3)} s`}
      />

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
