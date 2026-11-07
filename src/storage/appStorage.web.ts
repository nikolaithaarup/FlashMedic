const DATABASE_NAME = "flashmedic";
const DATABASE_VERSION = 1;
const STORE_NAME = "key-value";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("FlashMedic storage upgrade was blocked."));
  });
}

async function runRequest<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();
  return await new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? request.error ?? new Error("FlashMedic storage transaction failed."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? request.error ?? new Error("FlashMedic storage transaction was aborted."));
    };
  });
}

async function setItems(entries: readonly (readonly [string, string])[]) {
  if (entries.length === 0) return;
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    for (const [key, value] of entries) store.put(value, key);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("FlashMedic storage transaction failed."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("FlashMedic storage transaction was aborted."));
    };
  });
}

export const appStorage = {
  async getItem(key: string): Promise<string | null> {
    const stored = await runRequest<IDBValidKey | string | undefined>(
      "readonly",
      (store) => store.get(key),
    );
    if (typeof stored === "string") return stored;

    // AsyncStorage for web historically used localStorage. Migrate lazily so
    // existing web users keep their progress when moving to IndexedDB.
    const legacyValue = window.localStorage.getItem(key);
    if (legacyValue !== null) {
      await this.setItem(key, legacyValue);
      window.localStorage.removeItem(key);
    }
    return legacyValue;
  },

  async setItem(key: string, value: string) {
    await runRequest("readwrite", (store) => store.put(value, key));
  },

  setItems,

  async removeItem(key: string) {
    await runRequest("readwrite", (store) => store.delete(key));
    window.localStorage.removeItem(key);
  },

  async getAllKeys(): Promise<readonly string[]> {
    const keys = await runRequest<IDBValidKey[]>("readonly", (store) => store.getAllKeys());
    return keys.filter((key): key is string => typeof key === "string");
  },
};
