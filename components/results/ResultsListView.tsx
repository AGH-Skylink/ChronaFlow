import React from "react";
import { ScrollView, Alert, Platform } from "react-native";
import { ActiveResult } from "@models/ActiveResult";
import { resultCardStyles } from "@/constants/resultStyles";
import { ResultCard } from "./ResultCard";
import { useResultsOperations } from "@/context/ResultsContext";
import { useNotesEditor } from "@/hooks/useNotesEditor";

interface ResultsListViewProps {
  results: ActiveResult[];
}

export function ResultsListView({ results }: ResultsListViewProps) {
  const { deleteResult, saveNote } = useResultsOperations();
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
        <ResultCard
          key={result.id}
          result={result}
          isEditing={isEditing(result.id)}
          onEditStart={() => startEditing(result.id)}
          onSaveNote={(noteText) => handleSaveNote(result.id, noteText)}
          onCancelEdit={cancelEditing}
          onDelete={() => handleDelete(result.id)}
        />
      ))}
    </ScrollView>
  );
}
