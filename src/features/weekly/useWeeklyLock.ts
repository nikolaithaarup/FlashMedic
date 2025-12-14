// src/features/weekly/useWeeklyLock.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useWeeklyLock(storageKey: string) {
  const [locked, setLocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(storageKey);
        setLocked(v === "1");
      } finally {
        setLoaded(true);
      }
    })();
  }, [storageKey]);

  const lock = async () => {
    setLocked(true);
    await AsyncStorage.setItem(storageKey, "1");
  };

  const unlock = async () => {
    setLocked(false);
    await AsyncStorage.removeItem(storageKey);
  };

  return { locked, loaded, lock, unlock };
}
