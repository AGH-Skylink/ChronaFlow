import { RegularityResult } from "@/src/domain/models/RegularityResult";
import { IResultExporter } from "./IResultExporter";

export class RegularityResultExporter implements IResultExporter<RegularityResult> {
  getSheetName(): string {
    return "Regularity Tests";
  }

  toWorksheetData(results: RegularityResult[]): any[] {
    return results.map((result) => {
      const baseData: { [key: string]: any } = {
        Day: new Date(result.timestamp).toLocaleDateString(),
        Time: new Date(result.timestamp).toLocaleTimeString(),
        "Session Id": result.sessionId || "",
        "Average Interval (s)": parseFloat(result.avgInterval.toFixed(3)),
        "Standard Deviation (s)": parseFloat(result.stdDevInterval.toFixed(3)),
        Notes: result.notes || "",
      };

      if (result.tapTimestamps && Array.isArray(result.tapTimestamps)) {
        result.tapTimestamps.forEach((timestamp, index) => {
          baseData[`Timestamp ${index + 1}`] = timestamp;
        });
      }

      return baseData;
    });
  }
}
