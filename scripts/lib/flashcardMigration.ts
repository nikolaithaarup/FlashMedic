export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type CanonicalFirestoreCard = {
  subjectSlug: string;
  id: string;
  data: JsonObject;
  source: string;
};

export type ExistingFirestoreCard = {
  subjectSlug: string;
  id: string;
  data: Record<string, unknown>;
  path: string;
};

export type IdRename = {
  subjectSlug: string;
  oldId: string;
  newId: string;
};

export const FLASHCARD_ID_RENAMES: readonly IdRename[] = Array.from(
  { length: 20 },
  (_, index) => {
    const suffix = String(index + 1).padStart(3, "0");
    return {
      subjectSlug: "sygdomslaere",
      oldId: `neuro_${suffix}`,
      newId: `syg_neuro_${suffix}`,
    };
  },
);

export type RenameCandidate = IdRename & {
  oldPath: string;
  newPath: string;
  status: "verified" | "ambiguous";
  reason: string;
};

export type FlashcardMigrationPlan = {
  additions: CanonicalFirestoreCard[];
  updates: Array<{
    canonical: CanonicalFirestoreCard;
    existing: ExistingFirestoreCard;
    changedFields: string[];
  }>;
  unchanged: CanonicalFirestoreCard[];
  stale: ExistingFirestoreCard[];
  renameCandidates: RenameCandidate[];
  malformedFirestoreCards: ExistingFirestoreCard[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function assertJsonValue(value: unknown, path = "value"): asserts value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`${path} contains a non-finite number.`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonValue(item, `${path}[${index}]`));
    return;
  }
  if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (item === undefined) throw new Error(`${path}.${key} is undefined.`);
      assertJsonValue(item, `${path}.${key}`);
    }
    return;
  }
  throw new Error(`${path} contains unserializable ${typeof value}.`);
}

function equivalent(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => equivalent(item, right[index]));
  }
  if (isRecord(left) && isRecord(right)) {
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    return leftKeys.length === rightKeys.length && leftKeys.every((key, index) =>
      key === rightKeys[index] && equivalent(left[key], right[key])
    );
  }
  return false;
}

function changedCanonicalFields(canonical: JsonObject, existing: Record<string, unknown>): string[] {
  return Object.keys(canonical).filter((key) => !equivalent(canonical[key], existing[key]));
}

function cardKey(subjectSlug: string, id: string): string {
  return `${subjectSlug}/${id}`;
}

function semanticFingerprint(data: Record<string, unknown>): string | undefined {
  const question = typeof data.question === "string" ? data.question.trim() : "";
  const answer = typeof data.answer === "string" ? data.answer.trim() : "";
  return question && answer ? `${question}\n${answer}` : undefined;
}

export function createFlashcardMigrationPlan(
  canonicalCards: readonly CanonicalFirestoreCard[],
  firestoreCards: readonly ExistingFirestoreCard[],
  renames: readonly IdRename[] = FLASHCARD_ID_RENAMES,
): FlashcardMigrationPlan {
  const canonicalByKey = new Map(canonicalCards.map((card) => [cardKey(card.subjectSlug, card.id), card]));
  const firestoreByKey = new Map(firestoreCards.map((card) => [cardKey(card.subjectSlug, card.id), card]));
  const additions: CanonicalFirestoreCard[] = [];
  const updates: FlashcardMigrationPlan["updates"] = [];
  const unchanged: CanonicalFirestoreCard[] = [];

  for (const canonical of canonicalCards) {
    const existing = firestoreByKey.get(cardKey(canonical.subjectSlug, canonical.id));
    if (!existing) {
      additions.push(canonical);
      continue;
    }
    const changedFields = changedCanonicalFields(canonical.data, existing.data);
    if (changedFields.length) updates.push({ canonical, existing, changedFields });
    else unchanged.push(canonical);
  }

  const stale = firestoreCards.filter((card) => !canonicalByKey.has(cardKey(card.subjectSlug, card.id)));
  const malformedFirestoreCards = firestoreCards.filter((card) =>
    typeof card.data.question !== "string" || !card.data.question.trim() ||
    typeof card.data.answer !== "string" || !card.data.answer.trim()
  );
  const renameCandidates = renames.flatMap((rename): RenameCandidate[] => {
    const oldCard = firestoreByKey.get(cardKey(rename.subjectSlug, rename.oldId));
    const canonicalNew = canonicalByKey.get(cardKey(rename.subjectSlug, rename.newId));
    if (!oldCard || !canonicalNew) return [];
    const oldFingerprint = semanticFingerprint(oldCard.data);
    const newFingerprint = semanticFingerprint(canonicalNew.data);
    const verified = !!oldFingerprint && oldFingerprint === newFingerprint;
    return [{
      ...rename,
      oldPath: oldCard.path,
      newPath: `subjects/${rename.subjectSlug}/cards/${rename.newId}`,
      status: verified ? "verified" : "ambiguous",
      reason: verified
        ? "Question and answer match the corrected canonical card."
        : "Question/answer do not match exactly; manual review is required.",
    }];
  });

  return { additions, updates, unchanged, stale, renameCandidates, malformedFirestoreCards };
}
