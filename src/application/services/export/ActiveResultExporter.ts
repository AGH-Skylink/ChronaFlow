import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";
import { IResultExporter } from "./IResultExporter";

export class ActiveResultExporter implements IResultExporter<ExposureBasedResult> {
  getSheetName(): string {
    return "Active Tests";
  }

  toWorksheetData(results: ExposureBasedResult[]): any[] {
    return results.map((result) => ({
      Day: new Date(result.timestamp).toLocaleDateString(),
      Time: new Date(result.timestamp).toLocaleTimeString(),
      "Session Id": result.sessionId || "",
      "Target Duration (ms)": result.targetDuration,
      "Your Duration (ms)": result.userDuration,
      Notes: result.notes || "",
    }));
  }
}
