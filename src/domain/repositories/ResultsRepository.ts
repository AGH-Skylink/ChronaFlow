import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import {
  BaseResultsRepository,
  ExportConfigBase,
} from "./BaseResultsRepository";

export type ExportConfig = ExportConfigBase;

export class ResultsRepository extends BaseResultsRepository<ExposureBasedResult> {
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
