import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface NotesEditorProps {
  notes?: string;
  onSave: (notes: string) => void;
  onCancel?: () => void;
  isEditing: boolean;
  onEditStart?: () => void;
  emptyNotesMessage?: string;
}

export const NotesEditor = ({
  notes = "",
  onSave,
  onCancel,
  isEditing,
  onEditStart,
  emptyNotesMessage = "No notes added. Tap 'Edit' to add notes.",
}: NotesEditorProps) => {
  const [editedNote, setEditedNote] = useState<string>(notes);

  // This ensures we update the local state when props change
  useEffect(() => {
    if (!isEditing) {
      setEditedNote(notes);
    }
  }, [notes, isEditing]);

  const handleSave = () => {
    onSave(editedNote);
  };

  const handleCancel = () => {
    setEditedNote(notes);
    if (onCancel) onCancel();
  };

  return (
    <View style={styles.notesContainer}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.notesInput}
            multiline={true}
            value={editedNote}
            onChangeText={setEditedNote}
            placeholder="Enter notes here..."
            placeholderTextColor="#a0aec0"
          />
          <View style={styles.noteButtonsContainer}>
            <TouchableOpacity
              style={[styles.noteButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.noteButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.noteButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.noteButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.notesHeaderContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <TouchableOpacity style={styles.editButton} onPress={onEditStart}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.notesText}>
            {notes && notes.trim() !== "" ? notes : emptyNotesMessage}
          </Text>
        </>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  notesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#2d3748",
    borderRadius: 8,
  },
  notesHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  notesText: {
    fontSize: 14,
    color: "#d1d5db",
    fontStyle: "italic",
  },
  notesInput: {
    backgroundColor: "#374151",
    color: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  noteButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  noteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  noteButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#4b5563",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#e0e0e0",
    fontSize: 12,
    fontWeight: "500",
  },
});
