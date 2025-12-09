import { useState, useCallback } from "react";

export function useNotesEditor() {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const startEditing = useCallback((id: string) => {
    setEditingNoteId(id);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingNoteId(null);
  }, []);

  const isEditing = useCallback(
    (id: string) => editingNoteId === id,
    [editingNoteId]
  );

  return {
    editingNoteId,
    startEditing,
    cancelEditing,
    isEditing,
  };
}
