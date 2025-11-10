import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActiveResult } from "@models/ActiveResult";

export interface ExportConfig {
  storageKey: string;
  csvHeader: string;
  formatRow: (result: ActiveResult) => string;
  fileNamePrefix: string;
  dialogTitle: string;
}

export class ResultsRepository {
  constructor(private storageKey: string) {}

  async loadAll(): Promise<ActiveResult[]> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.storageKey);
      if (!resultsJson) {
        return [];
      }

      const parsedResults = JSON.parse(resultsJson);
      return parsedResults
        .map((data: any) =>
          new ActiveResult(
            data.id,
            data.timestamp,
            data.targetDuration,
            data.userDuration,
            data.notes || "",
            data.sessionId || null
          )
        )
        .sort((a: ActiveResult, b: ActiveResult) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error loading results:", error);
      return [];
    }
  }

  async save(result: ActiveResult): Promise<boolean> {
    try {
      const existingResults = await this.loadAll();
      const updatedResults = [result, ...existingResults];
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return true;
    } catch (error) {
      console.error("Error saving result:", error);
      return false;
    }
  }

  async delete(id: string): Promise<ActiveResult[]> {
    try {
      const results = await this.loadAll();
      const updatedResults = results.filter((r) => r.id !== id);
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return updatedResults;
    } catch (error) {
      console.error("Error deleting result:", error);
      throw error;
    }
  }

  async updateNote(id: string, noteText: string): Promise<ActiveResult[]> {
    try {
      const results = await this.loadAll();
      const updatedResults = results.map((result) =>
        result.id === id
          ? new ActiveResult(
              result.id,
              result.timestamp,
              result.targetDuration,
              result.userDuration,
              noteText,
              result.sessionId
            )
          : result
      );
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedResults)
      );
      return updatedResults;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Error clearing results:", error);
      throw error;
    }
  }

  async exportToCsv(config: ExportConfig): Promise<string> {
    const results = await this.loadAll();
    let csvContent = config.csvHeader;
    results.forEach((result) => {
      csvContent += config.formatRow(result);
    });
    return csvContent;
  }
}
