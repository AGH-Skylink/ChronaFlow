import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import {
  BaseResultsRepository,
  ExportConfigBase,
} from "./BaseResultsRepository";

import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";

export type ExportConfig = ExportConfigBase<ExposureBasedResult>;

export class ResultsRepository extends BaseResultsRepository<ExposureBasedResult> {
  constructor(storageKey: string, storage: IKeyValueStore) {
    super(storageKey, storage);
  }

  protected parseResult(data: any): ExposureBasedResult {
    return new ExposureBasedResult(
      data.id,
      data.timestamp,
      data.targetDuration,
      data.userDuration,
      data.notes || "",
      data.sessionId || null
    );
  }

  protected createResultWithNote(
    result: ExposureBasedResult,
    noteText: string
  ): ExposureBasedResult {
    return new ExposureBasedResult(
      result.id,
      result.timestamp,
      result.targetDuration,
      result.userDuration,
      noteText,
      result.sessionId
    );
  }
}
