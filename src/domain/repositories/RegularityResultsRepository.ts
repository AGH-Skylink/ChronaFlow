import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegularityResult } from "@/src/domain/models/RegularityResult";

export interface RegularityExportConfig {
  storageKey: string;
  csvHeader: string;
  formatRow: (result: RegularityResult) => string;
  fileNamePrefix: string;
  dialogTitle: string;
}

export class RegularityResultsRepository {
  constructor(private storageKey: string) {}

  async loadAll(): Promise<RegularityResult[]> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.storageKey);
      if (!resultsJson) {
        return [];
      }

      const parsedResults = JSON.parse(resultsJson);
      return parsedResults
        .map((data: any) => {
          // Handle legacy data format where 'date' was used instead of 'timestamp'
          const timestamp = data.timestamp || new Date(data.date).getTime();
          const id = data.id || `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
          
          return new RegularityResult(
            id,
            timestamp,
            data.avgInterval,
            data.stdDevInterval,
            data.tapTimestamps || [],
            data.notes || "",
            data.sessionId || null
          );
        })
        .sort((a: RegularityResult, b: RegularityResult) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error loading results:", error);
      return [];
    }
  }

  async save(result: RegularityResult): Promise<boolean> {
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

  async delete(id: string): Promise<RegularityResult[]> {
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

  async updateNote(id: string, noteText: string): Promise<RegularityResult[]> {
    try {
      const results = await this.loadAll();
      const updatedResults = results.map((result) =>
        result.id === id
          ? new RegularityResult(
              result.id,
              result.timestamp,
              result.avgInterval,
              result.stdDevInterval,
              result.tapTimestamps,
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

  async exportToCsv(config: RegularityExportConfig): Promise<string> {
    const results = await this.loadAll();
    let csvContent = config.csvHeader;
    results.forEach((result) => {
      csvContent += config.formatRow(result);
    });
    return csvContent;
  }
}
