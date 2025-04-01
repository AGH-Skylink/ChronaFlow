import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Share } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { EventRegister } from "react-native-event-listeners";

/**
 * Save test result to AsyncStorage
 */
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

/**
 * Load test results from AsyncStorage
 */
export const loadTestResults = async <T>(storageKey: string): Promise<T[]> => {
  try {
    const resultsJson = await AsyncStorage.getItem(storageKey);
    
    if (resultsJson) {
      const parsedResults = JSON.parse(resultsJson);
      // Sort results by timestamp (newest first) if it has timestamp property
      if (parsedResults.length > 0 && 'timestamp' in parsedResults[0]) {
        return parsedResults.sort((a: any, b: any) => b.timestamp - a.timestamp);
      }
      return parsedResults;
    }
    return [];
  } catch (error) {
    console.error(`Error loading results from ${storageKey}:`, error);
    return [];
  }
};

/**
 * Clear all test results
 */
export const clearAllResults = (
  storageKey: string, 
  eventName: string,
  confirmationTitle = "Clear All Results"
) => {
  Alert.alert(
    confirmationTitle,
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
            console.log(`All results cleared for ${storageKey}`);

            EventRegister.emit(eventName, true);

            Alert.alert("Success", "All results have been cleared.", [
              { text: "OK" },
            ]);
          } catch (error) {
            console.error(`Error clearing results for ${storageKey}:`, error);
            Alert.alert("Error", "Failed to clear results. Please try again.");
          }
        },
      },
    ]
  );
};

/**
 * Format CSV data from test results
 */
export const formatCSV = <T extends Record<string, any>>(
  results: T[],
  headers: string[],
  rowFormatter: (item: T) => string[]
): string => {
  let csvContent = headers.join(',') + '\n';
  
  results.forEach(item => {
    const rowData = rowFormatter(item);
    csvContent += rowData.join(',') + '\n';
  });
  
  return csvContent;
};

/**
 * Export results to CSV file
 */
export const exportResults = async <T extends Record<string, any>>(
  storageKey: string,
  fileNamePrefix: string,
  headers: string[],
  rowFormatter: (item: T) => string[]
) => {
  try {
    const resultsJson = await AsyncStorage.getItem(storageKey);

    if (resultsJson) {
      const parsedResults: T[] = JSON.parse(resultsJson);
      const csvContent = formatCSV(parsedResults, headers, rowFormatter);

      const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${fileNamePrefix}_${fileDate}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, csvContent);

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: `Save ${fileNamePrefix} Results`,
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

/**
 * Format a timestamp to a localized date string
 */
export const formatDate = (timestamp: number): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (e) {
    return "Invalid date";
  }
};
