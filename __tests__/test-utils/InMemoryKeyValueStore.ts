import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";

/**
 * Minimal in-memory storage implementation for repository tests.
 */
export class InMemoryKeyValueStore implements IKeyValueStore {
  private readonly data = new Map<string, string>();

  constructor(initialData: Record<string, string> = {}) {
    Object.entries(initialData).forEach(([key, value]) => {
      this.data.set(key, value);
    });
  }

  async getItem(key: string): Promise<string | null> {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }
}
