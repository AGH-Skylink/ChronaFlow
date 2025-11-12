import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export interface IResult {
  id: string;
  timestamp: number;
  notes?: string;
  sessionId?: string | null;
}

export interface ExportConfigBase<T extends IResult> {
  storageKey: string;
  csvHeader: string;
  formatRow: (result: T) => string;
  fileNamePrefix: string;
  dialogTitle: string;
}
export abstract class BaseResultsRepository<T extends IResult> {
  constructor(
    protected storageKey: string,
    protected storage: IKeyValueStore
  ) {}

  protected abstract parseResult(data: any): T;

  async loadAll(): Promise<T[]> {
    try {
      const resultsJson = await this.storage.getItem(this.storageKey);
      if (!resultsJson) {
        return [];
      }

      const parsedResults = JSON.parse(resultsJson);
      return parsedResults
        .map((data: any) => this.parseResult(data))
        .sort((a: T, b: T) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error loading results:", error);
      return [];
    }
  }

  async save(result: T): Promise<boolean> {
    try {
      const existingResults = await this.loadAll();
      const updatedResults = [result, ...existingResults];
      await this.storage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return true;
    } catch (error) {
      console.error("Error saving result:", error);
      return false;
    }
  }

  async delete(id: string): Promise<T[]> {
    try {
      const results = await this.loadAll();
      const updatedResults = results.filter((r) => r.id !== id);
      await this.storage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return updatedResults;
    } catch (error) {
      console.error("Error deleting result:", error);
      throw error;
    }
  }

  async updateNote(id: string, noteText: string): Promise<T[]> {
    try {
      const results = await this.loadAll();
      const updatedResults = results.map((result) =>
        result.id === id
          ? this.createResultWithNote(result, noteText)
          : result
      );
      await this.storage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return updatedResults;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  }

  protected abstract createResultWithNote(result: T, noteText: string): T;

  async clearAll(): Promise<void> {
    try {
      await this.storage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Error clearing results:", error);
      throw error;
    }
  }


  async generateCsv(config: ExportConfigBase<T>): Promise<string> {
    try {
      const results = await this.loadAll();
      
      if (results.length === 0) {
        throw new Error("No results to export");
      }

      let csvContent = config.csvHeader;
      results.forEach((result) => {
        csvContent += config.formatRow(result);
      });

      return csvContent;
    } catch (error) {
      console.error("Error generating CSV:", error);
      throw error;
    }
  }

  async exportToCsv(config: ExportConfigBase<T>): Promise<void> {
    try {
      console.log("Starting CSV export...");
      const csvContent = await this.generateCsv(config);
      console.log("CSV content generated, length:", csvContent.length);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${config.fileNamePrefix}_${timestamp}.csv`;
      
      const file = new FileSystem.File(FileSystem.Paths.document.uri, fileName);
      console.log("Will save to:", file.uri);

      await file.write(csvContent);
      console.log("File written successfully");

      const isSharingAvailable = await Sharing.isAvailableAsync();
      console.log("Sharing available:", isSharingAvailable);
      
      if (isSharingAvailable) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/csv",
          dialogTitle: config.dialogTitle,
          UTI: "public.comma-separated-values-text",
        });
        console.log("Sharing completed");
      } else {
        console.log("File saved to:", file.uri);
        console.log("Sharing not available on this platform");
      }
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      throw error;
    }
  }
}
