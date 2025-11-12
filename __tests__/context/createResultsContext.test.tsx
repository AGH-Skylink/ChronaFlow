import React, { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { createResultsContext } from "@/context/createResultsContext";
import {
  BaseResultsRepository,
  ExportConfigBase,
  IResult,
} from "@/src/domain/repositories/BaseResultsRepository";
import { InMemoryKeyValueStore } from "../test-utils/InMemoryKeyValueStore";

type FakeResult = IResult & {
  value: number;
  notes: string;
};

class FakeResultsRepository extends BaseResultsRepository<FakeResult> {
  public exportRequests: ExportConfigBase<FakeResult>[] = [];

  constructor(storageKey: string, storage: InMemoryKeyValueStore) {
    super(storageKey, storage);
  }

  protected parseResult(data: any): FakeResult {
    return {
      id: data.id,
      timestamp: data.timestamp,
      value: data.value,
      notes: data.notes ?? "",
      sessionId: data.sessionId ?? null,
    };
  }

  protected createResultWithNote(
    result: FakeResult,
    noteText: string
  ): FakeResult {
    return {
      ...result,
      notes: noteText,
    };
  }

  async exportToCsv(config: ExportConfigBase<FakeResult>): Promise<void> {
    this.exportRequests.push(config);
  }
}

function setup(initialResults: FakeResult[] = []) {
  const storageKey = "fake-results";
  const exportConfig: ExportConfigBase<FakeResult> = {
    storageKey,
    csvHeader: "id,value,notes\n",
    formatRow: (result) => `${result.id},${result.value},${result.notes}\n`,
    fileNamePrefix: "fake_results",
    dialogTitle: "Export Fake Results",
  };

  const store = new InMemoryKeyValueStore({
    [storageKey]: JSON.stringify(initialResults),
  });

  let repositoryInstance: FakeResultsRepository | null = null;

  const contextFactory = createResultsContext<FakeResult>(
    "FakeResults",
    (requestedKey) => {
      repositoryInstance = new FakeResultsRepository(requestedKey, store);
      return repositoryInstance;
    }
  );

  const wrapper = ({ children }: { children: ReactNode }) => (
    <contextFactory.Provider
      storageKey={storageKey}
      exportConfig={exportConfig}
    >
      {children}
    </contextFactory.Provider>
  );

  const hook = renderHook(
    () => ({
      state: contextFactory.useState(),
      operations: contextFactory.useOperations(),
    }),
    { wrapper }
  );

  return { hook, repositoryInstance: repositoryInstance!, store };
}

describe("createResultsContext", () => {
  const baseResults: FakeResult[] = [
    { id: "b", timestamp: 2_000, value: 200, notes: "two", sessionId: null },
    { id: "a", timestamp: 1_000, value: 100, notes: "one", sessionId: null },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads results on mount and exposes them in descending order", async () => {
    const { hook } = setup(baseResults);

    await waitFor(() => expect(hook.result.current.state.loading).toBe(false));

    expect(hook.result.current.state.results.map((r) => r.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("deletes results and updates state", async () => {
    const { hook, repositoryInstance } = setup(baseResults);

    await waitFor(() => expect(hook.result.current.state.loading).toBe(false));

    await act(async () => {
      await hook.result.current.operations.deleteResult("b");
    });

    expect(hook.result.current.state.results.map((r) => r.id)).toEqual(["a"]);
    await expect(repositoryInstance.loadAll()).resolves.toHaveLength(1);
  });

  it("persists note updates", async () => {
    const { hook, repositoryInstance } = setup(baseResults);

    await waitFor(() => expect(hook.result.current.state.loading).toBe(false));

    await act(async () => {
      await hook.result.current.operations.saveNote("a", "updated note");
    });

    expect(
      hook.result.current.state.results.find((r) => r.id === "a")?.notes
    ).toBe("updated note");

    const stored = await repositoryInstance.loadAll();
    expect(stored.find((r) => r.id === "a")?.notes).toBe("updated note");
  });

  it("clears all results", async () => {
    const { hook, repositoryInstance } = setup(baseResults);

    await waitFor(() => expect(hook.result.current.state.loading).toBe(false));

    await act(async () => {
      await hook.result.current.operations.clearAll();
    });

    expect(hook.result.current.state.results).toHaveLength(0);
    await expect(repositoryInstance.loadAll()).resolves.toHaveLength(0);
  });

  it("passes export configuration through to the repository", async () => {
    const { hook, repositoryInstance } = setup(baseResults);

    await waitFor(() => expect(hook.result.current.state.loading).toBe(false));

    await act(async () => {
      await hook.result.current.operations.exportResults();
    });

    expect(repositoryInstance.exportRequests).toHaveLength(1);
    expect(repositoryInstance.exportRequests[0].fileNamePrefix).toBe(
      "fake_results"
    );
  });
});
