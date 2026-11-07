import { appStorage } from "../../storage/appStorage";

export type StoredUserProfile = {
  userId: string; // Firebase uid (anonymous or not)
  nickname: string; // Display name in leaderboards
  classId: number | null; // optional
  isAnonymous: boolean; // true if user never “claimed” a name (or chose anon)
  // Optional local-only PIN (NOT a real login system across devices)
  pin?: string | null;
};

const KEY = "flashmedic:userProfile:v2";

export async function loadStoredProfile(): Promise<StoredUserProfile | null> {
  try {
    const raw = await appStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUserProfile;
  } catch (e) {
    console.warn("loadStoredProfile failed", e);
    return null;
  }
}

export async function saveStoredProfile(p: StoredUserProfile): Promise<void> {
  try {
    await appStorage.setItem(KEY, JSON.stringify(p));
  } catch (e) {
    console.warn("saveStoredProfile failed", e);
  }
}

export async function clearStoredProfile(): Promise<void> {
  try {
    await appStorage.removeItem(KEY);
  } catch (e) {
    console.warn("clearStoredProfile failed", e);
  }
}
