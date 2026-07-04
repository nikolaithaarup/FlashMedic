import fs from "fs";
import path from "path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { validateContentCard } from "../src/services/contentValidation";
import { parseFlashcardDocument } from "../src/services/flashcardValidation";
import type { Flashcard } from "../src/types/Flashcard";
import {
  assertJsonValue,
  createFlashcardMigrationPlan,
  type CanonicalFirestoreCard,
  type ExistingFirestoreCard,
  type JsonObject,
} from "./lib/flashcardMigration";

const APPLY_CONFIRMATION = "FLASHMEDIC_CONFIRM_FIRESTORE_WRITE";
const APPLY_RENAMES = "FLASHMEDIC_APPLY_VERIFIED_ID_RENAMES";
const PROJECT_ID_ENV = "FLASHMEDIC_FIREBASE_PROJECT_ID";
const CREDENTIAL_ENV = "FLASHMEDIC_FIREBASE_SERVICE_ACCOUNT";
const DEFAULT_CREDENTIAL_PATH = path.join(process.cwd(), "Backend", "scripts", "keys", "serviceAccount.json");
const BATCH_LIMIT = 400;

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function help(): string {
  return `FlashMedic Firestore flashcard migration

Dry run: npm run migrate:flashcards:dry-run
Apply:   FLASHMEDIC_FIREBASE_PROJECT_ID=<project> FLASHMEDIC_CONFIRM_FIRESTORE_WRITE=true npm run migrate:flashcards:apply

Credentials: set ${CREDENTIAL_ENV} to a service-account JSON path, or place the ignored file at:
${DEFAULT_CREDENTIAL_PATH}

No stale document is deleted by default. To delete only verified neuro_* rename sources during apply,
also set ${APPLY_RENAMES}=true. Ambiguous candidates are never deleted.`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function loadServiceAccount(): { account: ServiceAccountFile; credentialPath: string } {
  const credentialPath = path.resolve(process.env[CREDENTIAL_ENV] || DEFAULT_CREDENTIAL_PATH);
  if (!fs.existsSync(credentialPath)) {
    throw new Error(`Missing Firestore credentials.\n${help()}`);
  }
  const parsed: unknown = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
  if (!isRecord(parsed) || typeof parsed.project_id !== "string" || typeof parsed.client_email !== "string" || typeof parsed.private_key !== "string") {
    throw new Error(`Credential file is not a valid service-account JSON: ${credentialPath}`);
  }
  return { account: parsed as ServiceAccountFile, credentialPath };
}

async function loadCanonicalCards(): Promise<CanonicalFirestoreCard[]> {
  require.extensions[".jpg"] = () => undefined;
  require.extensions[".jpeg"] = () => undefined;
  require.extensions[".png"] = () => undefined;
  const { ekgImageLookup } = await import("../src/data/ekg/imageLookup");
  const mediaKeys = new Set(Object.keys(ekgImageLookup));
  const directory = path.join(process.cwd(), "Backend", "data", "subjects");
  const cards: CanonicalFirestoreCard[] = [];
  const seenIds = new Map<string, string>();
  const errors: string[] = [];

  for (const filename of fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()) {
    const subjectSlug = filename.replace(/\.json$/i, "");
    const filePath = path.join(directory, filename);
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(parsed)) throw new Error(`${filePath} is not an array.`);
    parsed.forEach((raw, index) => {
      const source = `${filePath}[${index}]`;
      if (!isRecord(raw)) {
        errors.push(`${source}: card is not an object`);
        return;
      }
      try {
        assertJsonValue(raw, source);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : `${source}: unserializable value`);
        return;
      }
      const result = parseFlashcardDocument(raw);
      if (!result.ok) {
        errors.push(`${source}: ${result.errors.join(", ")}`);
        return;
      }
      const strictIssues = validateContentCard(result.card, { mediaKeys }).filter(({ severity }) => severity === "error");
      if (strictIssues.length) {
        errors.push(...strictIssues.map(({ code, message }) => `${source} (${result.card.id}) [${code}] ${message}`));
      }
      if (result.warnings.some((warning) => warning.startsWith("invalid"))) {
        errors.push(`${source} (${result.card.id}): ${result.warnings.join(", ")}`);
      }
      const priorSource = seenIds.get(result.card.id);
      if (priorSource) errors.push(`Duplicate ID ${result.card.id}: ${priorSource} and ${source}`);
      else seenIds.set(result.card.id, source);
      cards.push({ subjectSlug, id: result.card.id, data: raw as JsonObject, source });
    });
  }
  if (errors.length) throw new Error(`Canonical content validation failed:\n${errors.join("\n")}`);
  return cards;
}

function parseFirestoreCard(subjectSlug: string, id: string, data: Record<string, unknown>, pathValue: string): ExistingFirestoreCard {
  return { subjectSlug, id, data, path: pathValue };
}

function printPlan(canonicalTotal: number, firestoreTotal: number, plan: ReturnType<typeof createFlashcardMigrationPlan>): void {
  console.log("\nMigration summary");
  console.table({
    canonicalCards: canonicalTotal,
    firestoreCards: firestoreTotal,
    additions: plan.additions.length,
    updates: plan.updates.length,
    unchanged: plan.unchanged.length,
    possibleStale: plan.stale.length,
    renameCandidates: plan.renameCandidates.length,
    malformedFirestoreCards: plan.malformedFirestoreCards.length,
  });
  if (plan.updates.length) console.log("Updates:", plan.updates.map(({ canonical, changedFields }) => `${canonical.subjectSlug}/${canonical.id} [${changedFields.join(", ")}]`).join("\n"));
  if (plan.stale.length) console.log("Possible stale documents (not deleted by default):", plan.stale.map(({ path: value }) => value).join("\n"));
  if (plan.renameCandidates.length) console.log("ID rename candidates:", plan.renameCandidates.map((candidate) => `${candidate.status.toUpperCase()}: ${candidate.oldPath} -> ${candidate.newPath} (${candidate.reason})`).join("\n"));
  if (plan.malformedFirestoreCards.length) console.log("Malformed Firestore documents:", plan.malformedFirestoreCards.map(({ path: value }) => value).join("\n"));
}

async function main(): Promise<void> {
  const mode = process.argv.includes("--apply") ? "apply" : process.argv.includes("--dry-run") ? "dry-run" : undefined;
  if (process.argv.includes("--help") || !mode) {
    console.log(help());
    if (!mode) process.exitCode = 1;
    return;
  }
  if (mode === "apply" && process.env[APPLY_CONFIRMATION] !== "true") {
    throw new Error(`Refusing Firestore writes: set ${APPLY_CONFIRMATION}=true explicitly.\n${help()}`);
  }

  const canonicalCards = await loadCanonicalCards();
  const { account, credentialPath } = loadServiceAccount();
  const expectedProject = process.env[PROJECT_ID_ENV];
  if (mode === "apply" && !expectedProject) throw new Error(`Apply requires ${PROJECT_ID_ENV}=<expected-project-id>.`);
  if (expectedProject && expectedProject !== account.project_id) {
    throw new Error(`Project mismatch: ${PROJECT_ID_ENV}=${expectedProject}, credential project=${account.project_id}.`);
  }
  console.log(`Mode: ${mode}`);
  console.log(`Target Firebase project: ${account.project_id}`);
  console.log(`Credentials: ${credentialPath}`);

  const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId: account.project_id, clientEmail: account.client_email, privateKey: account.private_key }), projectId: account.project_id });
  const db = getFirestore(app);
  const [cardsGroupSnapshot, topLevelCards, topLevelFlashcards, deckSnapshot] = await Promise.all([
    db.collectionGroup("cards").get(),
    db.collection("cards").get(),
    db.collection("flashcards").get(),
    db.collection("decks").get(),
  ]);
  const firestoreCards: ExistingFirestoreCard[] = [];
  const unexpectedCardsPaths: string[] = [];
  cardsGroupSnapshot.docs.forEach((document) => {
    const segments = document.ref.path.split("/");
    if (segments.length === 4 && segments[0] === "subjects" && segments[2] === "cards") {
      firestoreCards.push(parseFirestoreCard(segments[1], document.id, document.data(), document.ref.path));
    } else {
      unexpectedCardsPaths.push(document.ref.path);
    }
  });
  console.log("\nRuntime Firestore source inspection");
  console.table({
    collectionGroupCards: cardsGroupSnapshot.size,
    canonicalSubjectCards: firestoreCards.length,
    unexpectedCardsSubcollections: unexpectedCardsPaths.length,
    topLevelCards: topLevelCards.size,
    topLevelFlashcards: topLevelFlashcards.size,
    deckDocuments: deckSnapshot.size,
  });
  console.log("Runtime priority: collectionGroup('cards'), then top-level 'cards', then 'flashcards', then decks[].cards.");
  console.log("This migration writes only subjects/{subjectSlug}/cards/{cardId}.");
  if (unexpectedCardsPaths.length) console.warn("Unexpected collectionGroup('cards') paths may also be loaded by the app:\n" + unexpectedCardsPaths.join("\n"));
  if (topLevelCards.size || topLevelFlashcards.size || deckSnapshot.size) console.warn("Legacy fallback collections exist. Once subject card subcollections are populated, the runtime loader uses collectionGroup('cards') first.");
  const plan = createFlashcardMigrationPlan(canonicalCards, firestoreCards);
  printPlan(canonicalCards.length, firestoreCards.length, plan);
  if (mode === "dry-run") {
    console.log("\nDry run complete. No writes were performed.");
    return;
  }

  const writes: Array<{ kind: "set"; path: string; data: JsonObject } | { kind: "delete"; path: string }> = [
    ...plan.additions.map((card) => ({ kind: "set" as const, path: `subjects/${card.subjectSlug}/cards/${card.id}`, data: card.data })),
    ...plan.updates.map(({ canonical }) => ({ kind: "set" as const, path: `subjects/${canonical.subjectSlug}/cards/${canonical.id}`, data: canonical.data })),
  ];
  if (process.env[APPLY_RENAMES] === "true") {
    writes.push(...plan.renameCandidates.filter(({ status }) => status === "verified").map(({ oldPath }) => ({ kind: "delete" as const, path: oldPath })));
  }
  const affectedSubjects = new Set([
    ...plan.additions.map(({ subjectSlug }) => subjectSlug),
    ...plan.updates.map(({ canonical }) => canonical.subjectSlug),
    ...(process.env[APPLY_RENAMES] === "true"
      ? plan.renameCandidates.filter(({ status }) => status === "verified").map(({ subjectSlug }) => subjectSlug)
      : []),
  ]);
  const cardsBySubject = new Map<string, CanonicalFirestoreCard[]>();
  canonicalCards.forEach((card) => cardsBySubject.set(card.subjectSlug, [...(cardsBySubject.get(card.subjectSlug) ?? []), card]));
  for (const [subjectSlug, cards] of cardsBySubject) {
    if (!affectedSubjects.has(subjectSlug)) continue;
    const name = cards[0]?.data.subject;
    if (typeof name !== "string" || !name.trim()) throw new Error(`Cannot update subject ${subjectSlug}: canonical subject name is missing.`);
    writes.push({
      kind: "set",
      path: `subjects/${subjectSlug}`,
      data: { slug: subjectSlug, name, cardCount: cards.length },
    });
  }
  for (let index = 0; index < writes.length; index += BATCH_LIMIT) {
    const batch = db.batch();
    for (const write of writes.slice(index, index + BATCH_LIMIT)) {
      const ref = db.doc(write.path);
      if (write.kind === "delete") batch.delete(ref);
      else batch.set(ref, { ...write.data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    }
    await batch.commit();
    console.log(`Committed batch ${Math.floor(index / BATCH_LIMIT) + 1}/${Math.ceil(writes.length / BATCH_LIMIT)}.`);
  }
  console.log(`Apply complete: ${plan.additions.length} added, ${plan.updates.length} updated, ${writes.filter(({ kind }) => kind === "delete").length} verified rename sources deleted.`);
  console.log(`${plan.stale.length - writes.filter(({ kind }) => kind === "delete").length} stale documents remain untouched.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
