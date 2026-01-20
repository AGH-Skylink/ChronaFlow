import * as XLSX from "xlsx-js-style";
import { Result } from "@/src/domain/types/Result";
import {
  SharingUnavailableError,
  ExportFailedError,
} from "@/src/application/errors/ExportErrors";

export type FileShareMode = "share" | "save";

export interface IFileSharer {
  shareWorkbook(
    workbook: XLSX.WorkBook,
    fileName: string,
    mode?: FileShareMode
  ): Promise<Result<void, SharingUnavailableError | ExportFailedError>>;
}
