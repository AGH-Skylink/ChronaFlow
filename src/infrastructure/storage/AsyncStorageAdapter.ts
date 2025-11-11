import AsyncStorage from "@react-native-async-storage/async-storage";
import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";

export class AsyncStorageAdapter implements IKeyValueStore {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
