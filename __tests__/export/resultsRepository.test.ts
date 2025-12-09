import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { ExportConfigBase } from "@/src/domain/repositories/BaseResultsRepository";
import { ExposureBasedResult } from "@models/ExposureBasedResult";
import { InMemoryKeyValueStore } from "../test-utils/InMemoryKeyValueStore";

const mockWrite = jest.fn<Promise<void>, [string]>();

jest.mock("expo-file-system", () => {
  const mockFileCtor = jest.fn((baseUri: string, fileName: string) => ({
    write: mockWrite,
    uri: `${baseUri}${fileName}`,
  }));
  
  return {
    __esModule: true,
    Paths: { cache: { uri: "file://cache/" } },
    File: mockFileCtor,
  };
});

const mockShareAsync = jest.fn<Promise<void>, [string, any]>();
const mockIsAvailableAsync = jest.fn<Promise<boolean>, []>();

jest.mock("expo-sharing", () => ({
  __esModule: true,
  shareAsync: jest.fn((uri: string, options?: any) => mockShareAsync(uri, options)),
  isAvailableAsync: jest.fn(() => mockIsAvailableAsync()),
}));

describe("ResultsRepository CSV export", () => {
  const storageKey = "test-results";
  const exportConfig: ExportConfigBase<ExposureBasedResult> = {
    storageKey,
    csvHeader: "ID,Target,User,Notes\n",
    formatRow: (result) =>
      `${result.id},${result.targetDuration},${result.userDuration},"${(
        result.notes || ""
      ).replace(/"/g, '""')}"\n`,
    fileNamePrefix: "test_results",
    dialogTitle: "Export Test Results",
  };

  const sampleResults = [
    {
      id: "b",
      timestamp: 2_000,
      targetDuration: 2800,
      userDuration: 2750,
      notes: "Late session",
      sessionId: "sess-2",
    },
    {
      id: "a",
      timestamp: 1_000,
      targetDuration: 3000,
      userDuration: 3200,
      notes: "Lead-in, with comma",
      sessionId: "sess-1",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockWrite.mockResolvedValue();
    mockShareAsync.mockResolvedValue();
    mockIsAvailableAsync.mockResolvedValue(true);
  });

  it("generates CSV content with header and formatted rows", async () => {
    const store = new InMemoryKeyValueStore({
      [storageKey]: JSON.stringify(sampleResults),
    });
    const repository = new ResultsRepository(storageKey, store);

    const csv = await repository.generateCsv(exportConfig);

    expect(csv).toBe(
      "ID,Target,User,Notes\n" +
        "b,2800,2750,\"Late session\"\n" +
        "a,3000,3200,\"Lead-in, with comma\"\n"
    );
  });

  it("writes CSV to cache and shares when available", async () => {
    const store = new InMemoryKeyValueStore({
      [storageKey]: JSON.stringify(sampleResults),
    });
    const repository = new ResultsRepository(storageKey, store);

    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2025-11-12T10:15:30.000Z");

    await repository.exportToCsv(exportConfig);

    const FileSystem = require("expo-file-system");
    expect(FileSystem.File).toHaveBeenCalledWith(
      "file://cache/",
      "test_results_2025-11-12T10-15-30-000Z.csv"
    );
    expect(mockWrite).toHaveBeenCalledWith(
      "ID,Target,User,Notes\n" +
        "b,2800,2750,\"Late session\"\n" +
        "a,3000,3200,\"Lead-in, with comma\"\n"
    );
    expect(mockIsAvailableAsync).toHaveBeenCalled();
    expect(mockShareAsync).toHaveBeenCalledWith(
      "file://cache/test_results_2025-11-12T10-15-30-000Z.csv",
      {
        UTI: "public.comma-separated-values-text",
        dialogTitle: "Export Test Results",
        mimeType: "text/csv",
      }
    );
  });

  it("skips sharing when the platform does not support it", async () => {
    mockIsAvailableAsync.mockResolvedValue(false);

    const store = new InMemoryKeyValueStore({
      [storageKey]: JSON.stringify(sampleResults),
    });
    const repository = new ResultsRepository(storageKey, store);

    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2025-11-12T10:15:30.000Z");

    await repository.exportToCsv(exportConfig);

    expect(mockShareAsync).not.toHaveBeenCalled();
  });
});
