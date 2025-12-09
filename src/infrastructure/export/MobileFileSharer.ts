import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import { IFileSharer } from "@/src/application/ports/IFileSharer";
import { Result, success, failure } from "@/src/domain/types/Result";
import { SharingUnavailableError, ExportFailedError } from "@/src/application/errors/ExportErrors";

export class MobileFileSharer implements IFileSharer {
  async shareWorkbook(
    workbook: XLSX.WorkBook,
    fileName: string
  ): Promise<Result<void, SharingUnavailableError | ExportFailedError>> {
    try {
      const wbout = XLSX.write(workbook, {
        type: "buffer" as const,
        bookType: "xlsx" as const,
      });

      const filePath = `${FileSystem.Paths.cache.uri}${fileName}`;
      const file = new FileSystem.File(filePath);
      file.write(new Uint8Array(wbout as ArrayBuffer));

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Save All Test Results",
          UTI: "org.openxmlformats.spreadsheetml.sheet",
        });
        return success(undefined);
      } else {
        return failure(new SharingUnavailableError(filePath));
      }
    } catch (error) {
      return failure(new ExportFailedError(error));
    }
  }
}
