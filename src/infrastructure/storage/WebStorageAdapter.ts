import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";

const DB_NAME = "chronaflow-storage";
const STORE_NAME = "keyvalue";
const DB_VERSION = 1;

const memoryStore = new Map<string, string>();
let dbPromise: Promise<IDBDatabase> | null = null;

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function canUseLocalStorage(): boolean {
  if (!hasWindow()) {
    return false;
  }

  try {
    if (!window.localStorage) {
      return false;
    }
    const testKey = "__chronaflow_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

function getDb(): Promise<IDBDatabase> {
  if (!hasWindow() || typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB open failed"));
      request.onblocked = () =>
        reject(new Error("IndexedDB open blocked"));
    });
  }

  return dbPromise;
}

async function withStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await getDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    let request: IDBRequest<T>;

    try {
      request = action(store);
    } catch (error) {
      reject(error);
      return;
    }

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB request failed"));
    tx.onabort = () =>
      reject(tx.error ?? new Error("IndexedDB transaction aborted"));
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed"));
  });
}

async function idbGet(key: string): Promise<string | null> {
  const result = await withStore("readonly", (store) => store.get(key));
  if (typeof result === "string") {
    return result;
  }
  return result ? String(result) : null;
}

async function idbSet(key: string, value: string): Promise<void> {
  await withStore("readwrite", (store) => store.put(value, key));
}

async function idbRemove(key: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(key));
}

export class WebStorageAdapter implements IKeyValueStore {
  async getItem(key: string): Promise<string | null> {
    if (hasWindow()) {
      try {
        return await idbGet(key);
      } catch (error) {
        if (canUseLocalStorage()) {
          try {
            return window.localStorage.getItem(key);
          } catch (storageError) {
            // Fall through to memory store.
          }
        }
      }
    }

    return memoryStore.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (hasWindow()) {
      try {
        await idbSet(key, value);
        return;
      } catch (error) {
        if (canUseLocalStorage()) {
          try {
            window.localStorage.setItem(key, value);
            return;
          } catch (storageError) {
            // Fall through to memory store.
          }
        }
      }
    }

    memoryStore.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (hasWindow()) {
      try {
        await idbRemove(key);
        return;
      } catch (error) {
        if (canUseLocalStorage()) {
          try {
            window.localStorage.removeItem(key);
            return;
          } catch (storageError) {
            // Fall through to memory store.
          }
        }
      }
    }

    memoryStore.delete(key);
  }
}
