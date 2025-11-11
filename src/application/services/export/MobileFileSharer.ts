import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import { Alert } from "react-native";
import { IFileSharer } from "./IFileSharer";

export class MobileFileSharer implements IFileSharer {
  async shareWorkbook(workbook: XLSX.WorkBook, fileName: string): Promise<void> {
    const wbout = XLSX.write(workbook, {
      type: "base64" as const,
      bookType: "xlsx" as const,
    });

    const filePath = `${FileSystem.Paths.document}${fileName}`;
    const file = new FileSystem.File(filePath);
    await file.write(wbout);

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Save All Test Results",
        UTI: "org.openxmlformats.spreadsheetml.sheet",
      });
    } else {
      Alert.alert("Export Complete", `Results exported to: ${filePath}`);
    }
  }
}
