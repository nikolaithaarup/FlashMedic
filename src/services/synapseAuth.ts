import { signInAnonymously, signInWithCustomToken, signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { prepareForAccountSwitch } from "../sync/progressSync";

const PORTAL_ORIGIN = process.env.EXPO_PUBLIC_SYNAPSE_PORTAL_ORIGIN ??
  "https://portal.synapsestudio.dk";
const ENDPOINT = `${PORTAL_ORIGIN}/api/auth/flashmedic`;

async function post(body: object) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(result.error ?? "AUTH_FAILED"));
  return result;
}

export async function requestSynapseCode(email: string): Promise<string> {
  const result = await post({ operation: "request", email: email.trim() });
  if (typeof result.challengeToken !== "string") throw new Error("AUTH_FAILED");
  return result.challengeToken;
}

export async function verifySynapseCode(challengeToken: string, code: string) {
  const result = await post({ operation: "verify", challengeToken, code });
  if (typeof result.customToken !== "string") throw new Error("AUTH_FAILED");
  return (await signInWithCustomToken(auth, result.customToken)).user;
}

export async function signOutSynapseAccount() {
  await prepareForAccountSwitch();
  await signOut(auth);
  await signInAnonymously(auth);
}
