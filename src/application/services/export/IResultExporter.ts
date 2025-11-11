export interface IResultExporter<T> {
  getSheetName(): string;
  toWorksheetData(results: T[]): any[];
}
