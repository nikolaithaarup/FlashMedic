import { appStorage } from "./appStorage";

const BACKUP_SCHEMA_VERSION = 1;
const ALLOWED_EXACT_KEYS = new Set([
  "flashmedic_profile",
  "flashmedic:userProfile:v2",
  "flashmedic_card_stats",
  "flashmedic_mistakes_v1",
  "flashmedic_weekly_pending_results_v1",
]);
const ALLOWED_PREFIXES = ["weekly_lock_"];

export type ProgressBackup = {
  app: "FlashMedic";
  schemaVersion: 1;
  exportedAt: string;
  values: Record<string, string>;
};

export type ProgressBackupImportIdentity = {
  generation: string;
  occurredAt: string;
};

export function createProgressBackupImportIdentity(
  backup: ProgressBackup,
): ProgressBackupImportIdentity {
  const canonical = JSON.stringify({
    app: backup.app,
    schemaVersion: backup.schemaVersion,
    exportedAt: backup.exportedAt,
    values: Object.entries(backup.values).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  });
  let hash = 0x811c9dc5;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return {
    generation: `import-${backup.exportedAt}-${(hash >>> 0).toString(16).padStart(8, "0")}`,
    occurredAt: backup.exportedAt,
  };
}

function isAllowedKey(key: string) {
  return ALLOWED_EXACT_KEYS.has(key) ||
    ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function isNullableNumber(value: unknown) {
  return value === null ||
    (typeof value === "number" && Number.isFinite(value));
}

function isValidProfile(value: unknown) {
  if (!isRecord(value)) return false;
  return isNullableString(value.userId) &&
    typeof value.nickname === "string" &&
    (value.classId === undefined || isNullableNumber(value.classId)) &&
    typeof value.isAnonymous === "boolean" &&
    (value.pin === undefined || isNullableString(value.pin));
}

function isValidStats(value: unknown) {
  if (!isRecord(value)) return false;
  return Object.values(value).every((item) => {
    if (!isRecord(item)) return false;
    return [item.seen, item.correct, item.incorrect].every(
      (count) => typeof count === "number" && Number.isFinite(count) && count >= 0,
    ) && (item.lastSeen === null || typeof item.lastSeen === "string");
  });
}

function isValidMistakes(value: unknown) {
  const items = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.items)
      ? value.items
      : null;
  if (!items) return false;
  return items.every((item) =>
    isRecord(item) &&
    typeof item.cardId === "string" &&
    typeof item.subject === "string" &&
    typeof item.addedAt === "string" &&
    typeof item.incorrectCount === "number" &&
    Number.isFinite(item.incorrectCount) &&
    item.incorrectCount >= 1 &&
    ["pending", "learning", "understood"].includes(String(item.reviewStatus)),
  );
}

function isValidPendingResults(value: unknown) {
  if (!Array.isArray(value)) return false;
  return value.every((item) =>
    isRecord(item) &&
    ["id", "attemptId", "uid", "nickname", "canonicalWeekKey", "resultKey", "completedAt"]
      .every((key) => typeof item[key] === "string") &&
    ["mcq", "match", "word"].includes(String(item.game)) &&
    typeof item.score === "number" &&
    Number.isFinite(item.score) &&
    item.score >= 0 &&
    ["pending", "failed"].includes(String(item.status)),
  );
}

function isValidStoredValue(key: string, rawValue: string) {
  const value: unknown = JSON.parse(rawValue);
  if (key.startsWith("weekly_lock_")) return value === 1;
  if (key === "flashmedic_profile" || key === "flashmedic:userProfile:v2") {
    return isValidProfile(value);
  }
  if (key === "flashmedic_card_stats") return isValidStats(value);
  if (key === "flashmedic_mistakes_v1") return isValidMistakes(value);
  if (key === "flashmedic_weekly_pending_results_v1") {
    return isValidPendingResults(value);
  }
  return false;
}

export async function createProgressBackup(): Promise<ProgressBackup> {
  const keys = (await appStorage.getAllKeys()).filter(isAllowedKey);
  const entries = await Promise.all(
    keys.map(async (key) => [key, await appStorage.getItem(key)] as const),
  );
  return {
    app: "FlashMedic",
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    values: Object.fromEntries(
      entries.filter((entry): entry is readonly [string, string] => entry[1] !== null),
    ),
  };
}

export function parseProgressBackup(raw: string): ProgressBackup {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Backupfilen har et ugyldigt format.");
  }
  const candidate = parsed as Partial<ProgressBackup>;
  if (
    candidate.app !== "FlashMedic" ||
    candidate.schemaVersion !== BACKUP_SCHEMA_VERSION ||
    !candidate.values ||
    typeof candidate.values !== "object" ||
    Array.isArray(candidate.values) ||
    typeof candidate.exportedAt !== "string" ||
    Number.isNaN(Date.parse(candidate.exportedAt))
  ) {
    throw new Error("Backupfilen understøttes ikke af denne version af FlashMedic.");
  }
  for (const [key, value] of Object.entries(candidate.values)) {
    if (!isAllowedKey(key) || typeof value !== "string") {
      throw new Error("Backupfilen indeholder ukendte eller ugyldige data.");
    }
    if (!isValidStoredValue(key, value)) {
      throw new Error("Backupfilen indeholder beskadigede fremskridtsdata.");
    }
  }
  return candidate as ProgressBackup;
}

export function rebindProgressBackupUser(
  backup: ProgressBackup,
  userId: string,
): ProgressBackup {
  const values = { ...backup.values };
  for (const key of ["flashmedic_profile", "flashmedic:userProfile:v2"]) {
    const rawProfile = values[key];
    if (!rawProfile) continue;
    const profile = JSON.parse(rawProfile) as Record<string, unknown>;
    values[key] = JSON.stringify({ ...profile, userId });
  }

  const rawPending = values.flashmedic_weekly_pending_results_v1;
  if (rawPending) {
    const pending = JSON.parse(rawPending) as Record<string, unknown>[];
    values.flashmedic_weekly_pending_results_v1 = JSON.stringify(
      pending.map((item) => {
        const id = `${String(item.resultKey)}:${userId}:${String(item.game)}`;
        return { ...item, id, attemptId: id, uid: userId };
      }),
    );
  }

  return { ...backup, values };
}

export async function restoreProgressBackup(backup: ProgressBackup) {
  await appStorage.setItems(Object.entries(backup.values));
}
