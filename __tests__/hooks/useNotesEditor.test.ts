import { renderHook, act } from "@testing-library/react-native";
import { useNotesEditor } from "@/hooks/useNotesEditor";

describe("useNotesEditor", () => {
	it("tracks editing state for a given note", () => {
		const { result } = renderHook(() => useNotesEditor());

		expect(result.current.editingNoteId).toBeNull();
		expect(result.current.isEditing("note-1")).toBe(false);

		act(() => {
			result.current.startEditing("note-1");
		});

		expect(result.current.editingNoteId).toBe("note-1");
		expect(result.current.isEditing("note-1")).toBe(true);
		expect(result.current.isEditing("other")).toBe(false);

		act(() => {
			result.current.cancelEditing();
		});

		expect(result.current.editingNoteId).toBeNull();
		expect(result.current.isEditing("note-1")).toBe(false);
	});
});
