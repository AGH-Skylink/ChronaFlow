import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { EventRegister } from "react-native-event-listeners";

export interface ExportConfig {
  storageKey: string;
  csvHeader: string;
  formatRow: (result: any) => string;
  fileNamePrefix: string;
  dialogTitle: string;
  eventName: string;
}

const exportResultsWeb = async (config: ExportConfig) => {
  try {
    const resultsJson = await AsyncStorage.getItem(config.storageKey);
    if (resultsJson) {
      const parsedResults = JSON.parse(resultsJson);
      let csvContent = config.csvHeader;
      parsedResults.forEach((result: any) => {
        csvContent += config.formatRow(result);
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.setAttribute("download", `${config.fileNamePrefix}_${fileDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No results found to export.");
    }
  } catch (error) {
    console.error("Error exporting results:", error);
    alert("Error exporting results. Please try again.");
  }
}

export const exportResults = async (config: ExportConfig) => {
  if (Platform.OS === "web") {
    exportResultsWeb(config);
  } else if (Platform.OS === "android" || Platform.OS === "ios") {
    exportResultsMobile(config);
  }
} 

const exportResultsMobile = async (config: ExportConfig) => {
  try {
    const resultsJson = await AsyncStorage.getItem(config.storageKey);

    if (resultsJson) {
      const parsedResults = JSON.parse(resultsJson);

      let csvContent = config.csvHeader;

      parsedResults.forEach((result: any) => {
        csvContent += config.formatRow(result);
      });

      const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${config.fileNamePrefix}_${fileDate}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, csvContent);

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: config.dialogTitle,
          UTI: "public.comma-separated-values-text",
        });

        console.log(`File exported: ${filePath}`);
      } else {
        Alert.alert("Export Complete", `Results exported to: ${filePath}`, [
          { text: "OK" },
        ]);
      }
    } else {
      Alert.alert("No results found", "There are no test results to export.");
    }
  } catch (error) {
    console.error("Error exporting results:", error);
    Alert.alert("Error", "Failed to export results. Please try again.");
  }
};

export const clearAllResults = (storageKey: string, eventName: string) => {
  Alert.alert(
    "Clear All Results",
    "Are you sure you want to delete all test results? This action cannot be undone.",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(storageKey);
            console.log("All results cleared");

            EventRegister.emit(eventName, true);

            Alert.alert("Success", "All results have been cleared.", [
              { text: "OK" },
            ]);
          } catch (error) {
            console.error("Error clearing results:", error);
            Alert.alert("Error", "Failed to clear results. Please try again.");
          }
        },
      },
    ]
  );
};

export const formatDate = (dateValue: string | number) => {
  try {
    const date = typeof dateValue === "string" 
      ? new Date(dateValue) 
      : new Date(dateValue);
    return date.toLocaleString();
  } catch (e) {
    return "Invalid date";
  }
};

export const saveTestResult = async <T extends { id: string }>(
  storageKey: string,
  result: T
) => {
  try {
    const existingResultsJSON = await AsyncStorage.getItem(storageKey);
    const existingResults: T[] = existingResultsJSON
      ? JSON.parse(existingResultsJSON)
      : [];

    const updatedResults = [result, ...existingResults];

    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedResults));
    console.log("Test result saved successfully");
    return true;
  } catch (error) {
    console.error(`Error saving test result to ${storageKey}:`, error);
    return false;
  }
};

