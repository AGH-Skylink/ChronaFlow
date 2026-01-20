import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";
import { WebStorageAdapter } from "./WebStorageAdapter";

const isWeb = Platform.OS === "web";
const webStorage = new WebStorageAdapter();

export class AsyncStorageAdapter implements IKeyValueStore {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return await webStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      await webStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      await webStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }
}
