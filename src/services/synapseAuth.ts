import { signInAnonymously, signInWithCustomToken, signOut } from "firebase/auth";
import { Platform } from "react-native";

import { auth } from "../firebase/firebase";
import { prepareForAccountSwitch } from "../sync/progressSync";

const PORTAL_ORIGIN = process.env.EXPO_PUBLIC_SYNAPSE_PORTAL_ORIGIN ??
  "https://portal.synapsestudio.dk";
const DIRECT_ENDPOINT = PORTAL_ORIGIN.replace(/\/+$/, "") + "/api/auth/flashmedic";

// Browser PWAs use the local Vercel function: no cross-origin preflight or
// third-party browser restrictions. Native and custom preview targets use Portal.
const ENDPOINT =
  Platform.OS === "web" &&
  process.env.NODE_ENV === "production" &&
  PORTAL_ORIGIN.replace(/\/+$/, "") === "https://portal.synapsestudio.dk"
    ? "/api/synapse-email"
    : DIRECT_ENDPOINT;

type AuthFailure =
  | "network"
  | "disabled"
  | "forbidden"
  | "rate-limited"
  | "invalid-code"
  | "service"
  | "invalid-response";

export class SynapseAuthRequestError extends Error {
  readonly reason: AuthFailure;

  constructor(reason: AuthFailure) {
    super(reason);
    this.name = "SynapseAuthRequestError";
    this.reason = reason;
  }
}

export function describeSynapseAuthError(
  error: unknown,
  operation: "request" | "verify",
): string {
  if (error instanceof SynapseAuthRequestError) {
    switch (error.reason) {
      case "network":
        return "Kunne ikke kontakte loginserveren. Tjek forbindelsen og prøv igen.";
      case "disabled":
        return "E-mail-login er midlertidigt utilgængeligt. Prøv igen senere.";
      case "forbidden":
        return "Login blev afvist af serveren. Prøv igen fra flashmedic.synapsestudio.dk.";
      case "rate-limited":
        return "For mange forsøg. Vent lidt, før du prøver igen.";
      case "invalid-code":
        return operation === "verify"
          ? "Koden er ugyldig eller udløbet."
          : "Kunne ikke sende koden. Kontrollér e-mailadressen.";
      case "invalid-response":
        return "Loginserveren returnerede et ugyldigt svar. Prøv igen senere.";
      case "service":
        return "Loginserveren er midlertidigt utilgængelig. Prøv igen senere.";
    }
  }
  return operation === "verify"
    ? "Kunne ikke bekræfte login. Prøv igen."
    : "Kunne ikke sende koden. Prøv igen.";
}

async function post(body: object): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      cache: "no-store",
      body: JSON.stringify(body),
    });
  } catch {
    throw new SynapseAuthRequestError("network");
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  const data = result && typeof result === "object" && !Array.isArray(result)
    ? result as Record<string, unknown>
    : null;

  if (!response.ok) {
    const code = data?.error;
    if (response.status === 404 || code === "OTP_DISABLED") {
      throw new SynapseAuthRequestError("disabled");
    }
    if (response.status === 403 || code === "INVALID_ORIGIN") {
      throw new SynapseAuthRequestError("forbidden");
    }
    if (response.status === 429) {
      throw new SynapseAuthRequestError("rate-limited");
    }
    if (response.status === 400 && code === "OTP_INVALID") {
      throw new SynapseAuthRequestError("invalid-code");
    }
    throw new SynapseAuthRequestError("service");
  }
  if (!data) throw new SynapseAuthRequestError("invalid-response");
  return data;
}

export async function requestSynapseCode(email: string): Promise<string> {
  const result = await post({ operation: "request", email: email.trim() });
  if (typeof result.challengeToken !== "string" || result.challengeToken.length < 10) {
    throw new SynapseAuthRequestError("invalid-response");
  }
  return result.challengeToken;
}

export async function verifySynapseCode(challengeToken: string, code: string) {
  const result = await post({ operation: "verify", challengeToken, code });
  if (typeof result.customToken !== "string" || !result.customToken) {
    throw new SynapseAuthRequestError("invalid-response");
  }
  return (await signInWithCustomToken(auth, result.customToken)).user;
}

export async function signOutSynapseAccount() {
  await prepareForAccountSwitch();
  await signOut(auth);
  await signInAnonymously(auth);
}
