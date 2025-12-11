import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_PROFILE_KEY = "flashmedic_profile";
const API_BASE_URL = "https://flashmedic-backend.onrender.com";

export type StoredUserProfile = {
  userId: string | null; // null before registering
  nickname: string;
  classId: number | null;
  isAnonymous: boolean;
};

export async function loadStoredProfile(): Promise<StoredUserProfile | null> {
  const json = await AsyncStorage.getItem(USER_PROFILE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as StoredUserProfile;
  } catch {
    return null;
  }
}

export async function saveStoredProfile(profile: StoredUserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

// Call this when the user chooses nickname/class and we want a real backend id
export async function registerUserOnBackend(
  nickname: string,
  classId: number | null,
): Promise<{ userId: string }> {
  const classLabel = classId ? `Behandler ${classId}` : undefined;

  const res = await fetch(`${API_BASE_URL}/profiles/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, classLabel }),
  });

  if (!res.ok) {
    throw new Error("Failed to register user on backend");
  }

  const data = await res.json();
  return { userId: data.userId as string };
}
