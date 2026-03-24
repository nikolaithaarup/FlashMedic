// src/services/ensureAuth.ts
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/firebase";

export async function ensureAuthUid(): Promise<string> {
  const existing = auth.currentUser?.uid;
  if (existing) return existing;

  const hydrated = await new Promise<string | null>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u?.uid ?? null);
    });
  });
  if (hydrated) return hydrated;

  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}
