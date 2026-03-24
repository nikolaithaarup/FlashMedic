import { signInAnonymously } from "firebase/auth";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../../firebase/firebase";
import {
  loadStoredProfile,
  saveStoredProfile,
  type StoredUserProfile,
} from "./profileStorage";

export type UserProfile = {
  userId: string;
  nickname: string;
  classId: number | null;
  isAnonymous: boolean;
  pin?: string | null; // local-only
};

type ProfileContextValue = {
  ready: boolean;
  profile: UserProfile | null;

  // Used by AuthScreen & ProfileScreen
  setProfileAndPersist: (
    next: Omit<UserProfile, "userId"> & { userId?: string },
  ) => Promise<void>;
  refreshFromDisk: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function randomAnonNickname() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

async function ensureFirebaseUser(): Promise<string> {
  // If already signed in on device, keep it
  if (auth.currentUser?.uid) return auth.currentUser.uid;

  // Otherwise create an anonymous Firebase user
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshFromDisk = async () => {
    const uid = await ensureFirebaseUser();

    const stored = await loadStoredProfile();
    if (stored) {
      setProfile({
        userId: stored.userId || uid,
        nickname: stored.nickname,
        classId: stored.classId ?? null,
        isAnonymous: stored.isAnonymous,
        pin: stored.pin ?? null,
      });
      return;
    }

    // (We still have a Firebase uid ready in auth.currentUser)
    setProfile(null);
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshFromDisk();
      } finally {
        setReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setProfileAndPersist: ProfileContextValue["setProfileAndPersist"] =
    async (next) => {
      const uid =
        next.userId ?? auth.currentUser?.uid ?? (await ensureFirebaseUser());

      const normalized: UserProfile = {
        userId: uid,
        nickname: (next.nickname || "").trim() || randomAnonNickname(),
        classId: next.classId ?? null,
        isAnonymous: next.isAnonymous,
        pin: next.pin ?? null,
      };

      setProfile(normalized);

      const toStore: StoredUserProfile = {
        userId: uid,
        nickname: normalized.nickname,
        classId: normalized.classId,
        isAnonymous: normalized.isAnonymous,
        pin: normalized.pin ?? null,
      };

      await saveStoredProfile(toStore);
    };

  const value = useMemo(
    () => ({ ready, profile, setProfileAndPersist, refreshFromDisk }),
    [ready, profile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
