import * as XLSX from "xlsx";
import { Result } from "@/src/domain/types/Result";
import { SharingUnavailableError, ExportFailedError } from "@/src/application/errors/ExportErrors";

export interface IFileSharer {
  shareWorkbook(
    workbook: XLSX.WorkBook,
    fileName: string
  ): Promise<Result<void, SharingUnavailableError | ExportFailedError>>;
}
