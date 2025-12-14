import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUserProfile = {
  userId: string | null;
  nickname: string;
  classId: number | null;
  isAnonymous: boolean;
};

const PROFILE_KEY = "flashmedic_profile";
const API_BASE_URL = "https://flashmedic-backend.onrender.com";

export async function loadStoredProfile(): Promise<StoredUserProfile | null> {
  const json = await AsyncStorage.getItem(PROFILE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function saveStoredProfile(p: StoredUserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export async function registerProfileOnBackend(nickname: string, classId: number | null) {
  const classLabel = classId ? `Behandler ${classId}` : undefined;

  const res = await fetch(`${API_BASE_URL}/profiles/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, classLabel }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Failed to register profile");

  const data = JSON.parse(text);
  return { userId: data.userId as string };
}
