import * as XLSX from "xlsx";
import { IFileSharer } from "./IFileSharer";

export class WebFileSharer implements IFileSharer {
  async shareWorkbook(workbook: XLSX.WorkBook, fileName: string): Promise<void> {
    XLSX.writeFile(workbook, fileName);
  }
}
