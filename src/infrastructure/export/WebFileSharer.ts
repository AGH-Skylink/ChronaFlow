import * as XLSX from "xlsx";
import { IFileSharer } from "@/src/application/ports/IFileSharer";
import { Result, success, failure } from "@/src/domain/types/Result";
import { ExportFailedError } from "@/src/application/errors/ExportErrors";

export class WebFileSharer implements IFileSharer {
  async shareWorkbook(
    workbook: XLSX.WorkBook,
    fileName: string
  ): Promise<Result<void, ExportFailedError>> {
    try {
      XLSX.writeFile(workbook, fileName);
      return success(undefined);
    } catch (error) {
      return failure(new ExportFailedError(error));
    }
  }
}
