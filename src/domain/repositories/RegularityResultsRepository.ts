import { RegularityResult } from "@/src/domain/models/RegularityResult";
import {
  BaseResultsRepository,
  ExportConfigBase,
} from "./BaseResultsRepository";
import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";

export type RegularityExportConfig = ExportConfigBase<RegularityResult>;

export class RegularityResultsRepository extends BaseResultsRepository<RegularityResult> {
  constructor(storageKey: string, storage: IKeyValueStore) {
    super(storageKey, storage);
  }

  protected parseResult(data: any): RegularityResult {
    const timestamp = data.timestamp || new Date(data.date).getTime();
    const id = data.id || `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;

    return new RegularityResult(
      id,
      timestamp,
      data.avgInterval,
      data.stdDevInterval,
      data.tapTimestamps || [],
      data.notes || "",
      data.sessionId || null
    );
  }

  protected createResultWithNote(
    result: RegularityResult,
    noteText: string
  ): RegularityResult {
    return new RegularityResult(
      result.id,
      result.timestamp,
      result.avgInterval,
      result.stdDevInterval,
      result.tapTimestamps,
      noteText,
      result.sessionId
    );
  }
}
