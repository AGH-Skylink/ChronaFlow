import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import * as XLSX from 'xlsx';

export interface ExportConfig {
  storageKey: string;
  csvHeader: string;
  formatRow: (result: any) => string;
  fileNamePrefix: string;
  dialogTitle: string;
  eventName: string;
}

type ActiveResults = {
  id: string;
  timestamp: number;
  targetDuration: number;
  userDuration: number;
  notes?: string;
  sessionId?: string | null;
}

type PassiveResults = {
  id: string;
  timestamp: number;
  targetExposure: number;
  userInput: number;
  notes?: string;
  sessionId?: string | null;
}

type RegularityResults = {
  avgInterval: number;
  stdDevInterval: number;
  date: string;
  tapTimestamps: number[];
  notes?: string;
  sessionId?: string | null;
}

type Session = {
  id: string;
  name: string;
  createdAt: string;
  blocks: SessionBlock[];
}
type SessionBlock = {
  id: string;
  type: string;
  order: number;
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

const clearAllResultsWeb = (storageKey: string, eventName: string) => {
  if (confirm("Are you sure you want to delete all test results? This action cannot be undone.")) {
    try {
      AsyncStorage.removeItem(storageKey).then(() => {
        console.log("All results cleared");
        EventRegister.emit(eventName, true);
        alert("All results have been cleared.");
      });
    } catch (error) {
      console.error("Error clearing results:", error);
      alert("Failed to clear results. Please try again.");
    }
  }
};

const clearAllResultsMobile = (storageKey: string, eventName: string) => {
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
            Alert.alert("Success", "All results have been cleared.", [{ text: "OK" }]);
          } catch (error) {
            console.error("Error clearing results:", error);
            Alert.alert("Error", "Failed to clear results. Please try again.");
          }
        },
      },
    ]
  );
};

export const clearAllResults = (storageKey: string, eventName: string) => {
  console.log("Clearing all results for key:", storageKey);
  if (Platform.OS === "web") {
    clearAllResultsWeb(storageKey, eventName);
  } else {
    clearAllResultsMobile(storageKey, eventName);
  }
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

export const exportAllResults = async () => {
  try {
    // Get all results from AsyncStorage
    const activeResultsJson = await AsyncStorage.getItem("activeTestResults");
    const passiveResultsJson = await AsyncStorage.getItem("passiveTestResults");
    const regularityResultsJson = await AsyncStorage.getItem("regularityTestResults");
    const sessionsJson = await AsyncStorage.getItem("savedSessions");
    
    // Check if we have any results to export
    if (!activeResultsJson && !passiveResultsJson && !regularityResultsJson && !sessionsJson) {
      Alert.alert("No Results", "There are no test results to export.");
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Process Active Test Results
    if (activeResultsJson) {
      const activeResults = JSON.parse(activeResultsJson) as ActiveResults[];
      if (activeResults.length > 0) {
        // Convert data to format expected by xlsx
        const activeData = activeResults.map((result: ActiveResults) => ({
          Day: new Date(result.timestamp).toLocaleDateString(),
          Time: new Date(result.timestamp).toLocaleTimeString(),
          'Session Id': result.sessionId || "",
          'Target Duration (ms)': result.targetDuration,
          'Your Duration (ms)': result.userDuration,
          Notes: result.notes || ""
        }));
        
        // Create worksheet and add to workbook
        const activeWs = XLSX.utils.json_to_sheet(activeData);
        XLSX.utils.book_append_sheet(wb, activeWs, "Active Tests");
      }
    }
    
    // Process Passive Test Results
    if (passiveResultsJson) {
      const passiveResults = JSON.parse(passiveResultsJson) as PassiveResults[];
      if (passiveResults.length > 0) {
        // Convert data to format expected by xlsx
        const passiveData = passiveResults.map((result: PassiveResults) => ({
          Day: new Date(result.timestamp).toLocaleDateString(),
          Time: new Date(result.timestamp).toLocaleTimeString(),
          'Session Id': result.sessionId || "",
          'Target Duration (ms)': result.targetExposure,
          'Your Duration (ms)': result.userInput,
          Notes: result.notes || ""
        }));
        
        // Create worksheet and add to workbook
        const passiveWs = XLSX.utils.json_to_sheet(passiveData);
        XLSX.utils.book_append_sheet(wb, passiveWs, "Passive Tests");
      }
    }
    
    // Process Regularity Test Results
    if (regularityResultsJson) {
      const regularityResults = JSON.parse(regularityResultsJson) as RegularityResults[];
      if (regularityResults.length > 0) {
        const regularityData = regularityResults.map((result: RegularityResults) => {
          const baseData: { [key: string]: any } = {
            Day: new Date(result.date).toLocaleDateString(),
            Time: new Date(result.date).toLocaleTimeString(),
            'Session Id': result.sessionId || "",
            'Average Interval (s)': parseFloat(result.avgInterval.toFixed(3)),
            'Standard Deviation (s)': parseFloat(result.stdDevInterval.toFixed(3)),
            'Notes': result.notes || "",
          };

          if (result.tapTimestamps && Array.isArray(result.tapTimestamps)) {
            result.tapTimestamps.forEach((timestamp, index) => {
              baseData[`Timestamp ${index + 1}`] = timestamp;
            });
          }
          
          return baseData;
        });
        
        // Create worksheet and add to workbook
        const regularityWs = XLSX.utils.json_to_sheet(regularityData);
        XLSX.utils.book_append_sheet(wb, regularityWs, "Regularity Tests");
      }
    }
    
    // Process Sessions
    if (sessionsJson) {
      const sessions = JSON.parse(sessionsJson) as Session[];
      if (sessions.length > 0) {
        // Convert data to format expected by xlsx
        const sessionsData = sessions.map((session: Session) => ({
          'Session ID': session.id,
          'Name': session.name,
          'Created At': new Date(session.createdAt).toLocaleString(),
          'Test Blocks': session.blocks.map((block: SessionBlock) => block.type).join(", ")
        }));
        
        // Create worksheet and add to workbook
        const sessionsWs = XLSX.utils.json_to_sheet(sessionsData);
        XLSX.utils.book_append_sheet(wb, sessionsWs, "Sessions");
      }
    }

    const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `all_test_results_${fileDate}.xlsx`;
    
    if (Platform.OS === "web") {
      XLSX.writeFile(wb, fileName);
    } else {
      const wbout = XLSX.write(wb, { 
        type: 'base64' as const, 
        bookType: 'xlsx' as const 
      });
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Save All Test Results",
          UTI: "org.openxmlformats.spreadsheetml.sheet"
        });
      } else {
        Alert.alert("Export Complete", `Results exported to: ${filePath}`);
      }
    }
  } catch (error) {
    console.error("Error exporting all results:", error);
    Alert.alert("Error", `Failed to export results. Please try again. ${error}`);
  }
};

const deleteResultWeb = async (
  storageKey: string, 
  identifier: string, 
  identifierField: string,
  onSuccess?: (updatedResults: any[]) => void
): Promise<boolean> => {
  if (confirm("Are you sure you want to delete this result? This action cannot be undone.")) {
    try {
      const resultsJson = await AsyncStorage.getItem(storageKey);
      if (!resultsJson) {
        alert("No results found to delete.");
        return false;
      }
      const parsedResults = JSON.parse(resultsJson);
      const updatedResults = parsedResults.filter(
        (result: any) => result[identifierField] !== identifier
      );

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updatedResults)
      );

      if (onSuccess) {
        onSuccess(updatedResults);
      }
      
      console.log("Result deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("Failed to delete result. Please try again.");
    }
  }
  return false;
};

const deleteResultMobile = async (
  storageKey: string, 
  identifier: string, 
  identifierField: string = 'id',
  onSuccess?: (updatedResults: any[]) => void
): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      "Delete Result",
      "Are you sure you want to delete this result?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const resultsJson = await AsyncStorage.getItem(storageKey);

              if (resultsJson) {
                const parsedResults = JSON.parse(resultsJson);
                const updatedResults = parsedResults.filter(
                  (result: any) => result[identifierField] !== identifier
                );

                await AsyncStorage.setItem(
                  storageKey,
                  JSON.stringify(updatedResults)
                );

                if (onSuccess) {
                  onSuccess(updatedResults);
                }
                
                console.log("Result deleted successfully");
                resolve(true);
              } else {
                resolve(false);
              }
            } catch (error) {
              console.error("Error deleting result:", error);
              Alert.alert(
                "Error",
                "Failed to delete result. Please try again."
              );
              resolve(false);
            }
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
};

export const deleteResult = async (
  storageKey: string, 
  identifier: string, 
  identifierField: string = 'id', 
  onSuccess?: (updatedResults: any[]) => void
): Promise<boolean> => {
  console.log("Deleting result with identifier:", identifier);
  if (Platform.OS === "web") {
    return deleteResultWeb(storageKey, identifier, identifierField, onSuccess);
  } else {
    return deleteResultMobile(storageKey, identifier, identifierField, onSuccess);
  }
};

