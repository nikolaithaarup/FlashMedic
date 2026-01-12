// src/features/profile/useProfile.ts
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../firebase/firebase";
import { loadStoredProfile, saveStoredProfile, type StoredUserProfile } from "../../services/userService";

export type UserRole = "student" | "ambulancebehandler" | "paramediciner" | "laegeassistent";
export type Gender = "male" | "female" | "not_specified";
export type Region =
  | "hovedstaden"
  | "sjaelland"
  | "syddanmark"
  | "midtjylland"
  | "nordjylland"
  | "oestdanmark";

export type UserProfile = {
  userId: string | null;
  nickname: string;
  role: UserRole | null;
  gender: Gender | null;
  region: Region | null;
  classId: number | null;
  isAnonymous: boolean;
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await loadStoredProfile();

      if (stored) {
        setProfile({
          userId: stored.userId ?? auth.currentUser?.uid ?? null,
          nickname: stored.nickname,
          role: null,
          gender: null,
          region: null,
          classId: stored.classId ?? null,
          isAnonymous: stored.isAnonymous,
        });
        return;
      }

      // create local anon profile
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const anon: UserProfile = {
        userId: auth.currentUser?.uid ?? null,
        nickname: `Bruger${randomId}`,
        role: null,
        gender: null,
        region: null,
        classId: null,
        isAnonymous: true,
      };
      setProfile(anon);

      const toStore: StoredUserProfile = {
        userId: anon.userId,
        nickname: anon.nickname,
        classId: null,
        isAnonymous: true,
      };
      await saveStoredProfile(toStore);
    })();
  }, []);

  const classLabel = useMemo(() => {
    if (!profile?.classId) return "";
    return `Behandler ${profile.classId}`;
  }, [profile]);

  return { profile, setProfile, classLabel };
}
