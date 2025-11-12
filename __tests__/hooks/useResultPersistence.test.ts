import { act, renderHook } from "@testing-library/react-native";
import { useResultPersistence } from "@/hooks/useResultPersistence";
import {
	BaseResultsRepository,
	type IResult,
} from "@/src/domain/repositories/BaseResultsRepository";
import { InMemoryKeyValueStore } from "../test-utils/InMemoryKeyValueStore";

class StubRepository<T extends IResult> extends BaseResultsRepository<T> {
	override save = jest.fn<Promise<boolean>, [T]>();

	constructor() {
		super("stub-results", new InMemoryKeyValueStore());
	}

	protected parseResult(data: T): T {
		return data;
	}

	protected createResultWithNote(result: T, noteText: string): T {
		return { ...(result as any), notes: noteText };
	}
}

describe("useResultPersistence", () => {
	it("saves results through the repository", async () => {
		const repository = new StubRepository<IResult>();
		repository.save.mockResolvedValue(true);
		const fakeResult: IResult = { id: "1", timestamp: 0 };

		const { result } = renderHook(() => useResultPersistence(repository));

		await act(async () => {
			await result.current.saveResult(fakeResult);
		});

		expect(repository.save).toHaveBeenCalledWith(fakeResult);
	});

	it("swallows repository errors while logging", async () => {
		const error = new Error("failed");
		const repository = new StubRepository<IResult>();
		repository.save.mockRejectedValue(error);
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const { result } = renderHook(() => useResultPersistence(repository));

		await act(async () => {
			await result.current.saveResult({ id: "2", timestamp: 0 });
		});

		expect(repository.save).toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalledWith("Failed to save result", error);

		consoleSpy.mockRestore();
	});
});
