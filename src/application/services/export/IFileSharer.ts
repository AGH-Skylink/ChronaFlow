import * as XLSX from "xlsx";

export interface IFileSharer {
  shareWorkbook(workbook: XLSX.WorkBook, fileName: string): Promise<void>;
}
