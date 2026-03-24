// src/features/weekly/useWeeklyLock.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const DEV_IGNORE_KEY = "weekly_dev_ignoreLocks";

export function useWeeklyLock(storageKey: string) {
  const [rawLocked, setRawLocked] = useState(false);
  const [ignoreLocks, setIgnoreLocks] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [v, ig] = await Promise.all([
          AsyncStorage.getItem(storageKey),
          AsyncStorage.getItem(DEV_IGNORE_KEY),
        ]);
        setRawLocked(v === "1");
        setIgnoreLocks(ig === "1");
      } finally {
        setLoaded(true);
      }
    })();
  }, [storageKey]);

  // ✅ In dev mode, locking is a no-op
  const lock = async () => {
    if (ignoreLocks) return;
    setRawLocked(true);
    await AsyncStorage.setItem(storageKey, "1");
  };

  // ✅ Allow unlock always (useful for debugging)
  const unlock = async () => {
    setRawLocked(false);
    await AsyncStorage.removeItem(storageKey);
  };

  const setIgnore = async (on: boolean) => {
    setIgnoreLocks(on);
    if (on) await AsyncStorage.setItem(DEV_IGNORE_KEY, "1");
    else await AsyncStorage.removeItem(DEV_IGNORE_KEY);
  };

  const locked = ignoreLocks ? false : rawLocked;

  return { locked, rawLocked, ignoreLocks, loaded, lock, unlock, setIgnore };
}
