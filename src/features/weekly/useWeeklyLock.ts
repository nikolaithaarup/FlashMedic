// src/features/weekly/useWeeklyLock.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const DEV_IGNORE_KEY = "weekly_dev_ignoreLocks";

type WeeklyLockOptions = {
  allowDevOverride?: boolean;
  refreshToken?: number;
};

export type WeeklyLockStorage = Pick<
  typeof AsyncStorage,
  "getItem" | "setItem"
>;

export type WeeklyLockKind = "mcq" | "match" | "word";
export type WeeklyAttemptEvent = "view" | "start" | "complete" | "abandon";

export function getWeeklyLockKey(kind: WeeklyLockKind, weekKey: string) {
  return `weekly_lock_${kind}_${weekKey}`;
}

export function applyWeeklyAttemptEvent(
  locked: boolean,
  event: WeeklyAttemptEvent,
) {
  return locked || event !== "view";
}

export function shouldIgnoreWeeklyLocks(
  allowDevOverride: boolean,
  storedDevOverride: boolean,
) {
  return allowDevOverride && storedDevOverride;
}

export async function readWeeklyAttemptLock(
  storage: WeeklyLockStorage,
  storageKey: string,
) {
  return (await storage.getItem(storageKey)) === "1";
}

export async function persistWeeklyAttemptLock(
  storage: WeeklyLockStorage,
  storageKey: string,
) {
  await storage.setItem(storageKey, "1");
}

export function useWeeklyLock(
  storageKey: string,
  { allowDevOverride = false, refreshToken = 0 }: WeeklyLockOptions = {},
) {
  const [rawLocked, setRawLocked] = useState(false);
  const [ignoreLocks, setIgnoreLocks] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoaded(false);
    (async () => {
      try {
        const [v, ig] = await Promise.all([
          readWeeklyAttemptLock(AsyncStorage, storageKey),
          AsyncStorage.getItem(DEV_IGNORE_KEY),
        ]);
        if (!active) return;
        setRawLocked(v);
        setIgnoreLocks(ig === "1");
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshToken, storageKey]);

  const effectiveIgnoreLocks = shouldIgnoreWeeklyLocks(
    allowDevOverride,
    ignoreLocks,
  );

  // ✅ In dev mode, locking is a no-op
  const lock = async () => {
    if (effectiveIgnoreLocks) return;
    setRawLocked(true);
    await persistWeeklyAttemptLock(AsyncStorage, storageKey);
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

  const locked = effectiveIgnoreLocks ? false : rawLocked;

  return {
    locked,
    rawLocked,
    ignoreLocks: effectiveIgnoreLocks,
    loaded,
    lock,
    unlock,
    setIgnore,
  };
}
