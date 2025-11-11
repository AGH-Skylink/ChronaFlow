import React from "react";
import { ScrollView, Alert, Platform } from "react-native";
import { RegularityResult } from "@/src/domain/models/RegularityResult";
import { resultCardStyles } from "@/constants/resultStyles";
import { RegularityResultCard } from "./RegularityResultCard";
import { useRegularityResultsOperations } from "@/context/RegularityResultsContext";
import { useNotesEditor } from "@/hooks/useNotesEditor";

interface RegularityResultsListViewProps {
  results: RegularityResult[];
}

export function RegularityResultsListView({
  results,
}: RegularityResultsListViewProps) {
  const { deleteResult, saveNote } = useRegularityResultsOperations();
  const { isEditing, startEditing, cancelEditing } = useNotesEditor();

  const handleDelete = (id: string) => {
    const deleteAction = async () => {
      try {
        await deleteResult(id);
      } catch (error) {
        if (Platform.OS === "web") {
          alert("Failed to delete result. Please try again.");
        } else {
          Alert.alert("Error", "Failed to delete result. Please try again.");
        }
      }
    };

    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to delete this result?")) {
        deleteAction();
      }
    } else {
      Alert.alert(
        "Delete Result",
        "Are you sure you want to delete this result?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: deleteAction },
        ]
      );
    }
  };

  const handleSaveNote = async (id: string, noteText: string) => {
    try {
      await saveNote(id, noteText);
      cancelEditing();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Failed to save note. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save note. Please try again.");
      }
    }
  };

  return (
    <ScrollView
      style={resultCardStyles.scrollView}
      contentContainerStyle={resultCardStyles.scrollViewContent}
    >
      {results.map((result) => (
        <RegularityResultCard
          key={result.id}
          result={result}
          isEditing={isEditing(result.id)}
          onEditStart={() => startEditing(result.id)}
          onSaveNote={(noteText: string) => handleSaveNote(result.id, noteText)}
          onCancelEdit={cancelEditing}
          onDelete={() => handleDelete(result.id)}
        />
      ))}
    </ScrollView>
  );
}
