import * as XLSX from "xlsx-js-style";
import { FileShareMode, IFileSharer } from "@/src/application/ports/IFileSharer";
import { Result, success, failure } from "@/src/domain/types/Result";
import { ExportFailedError } from "@/src/application/errors/ExportErrors";

export class WebFileSharer implements IFileSharer {
  async shareWorkbook(
    workbook: XLSX.WorkBook,
    fileName: string,
    mode: FileShareMode = "share"
  ): Promise<Result<void, ExportFailedError>> {
    try {
      if (typeof window === "undefined") {
        throw new Error("File export is only available in the browser.");
      }

      const mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([buffer], { type: mimeType });

      if (
        mode === "share" &&
        typeof navigator !== "undefined" &&
        typeof File === "function"
      ) {
        const shareFile = new File([blob], fileName, { type: mimeType });
        if (
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [shareFile] })
        ) {
          try {
            await navigator.share({
              files: [shareFile],
              title: fileName,
            });
            return success(undefined);
          } catch (error) {
            const name = error instanceof Error ? error.name : "";
            if (name === "AbortError" || name === "NotAllowedError") {
              return success(undefined);
            }
          }
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
      return success(undefined);
    } catch (error) {
      return failure(new ExportFailedError(error));
    }
  }
}
