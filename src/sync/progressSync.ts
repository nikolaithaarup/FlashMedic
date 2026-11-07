import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { loadMistakes, saveMistakes } from "../storage/mistakes";
import { appStorage } from "../storage/appStorage";
import { loadStats, saveStats } from "../storage/stats";
import type { Flashcard } from "../types/Flashcard";
import type { FlashcardTrainingMode } from "../types/Learning";
import {
  foldProgressEvents,
  parseProgressQueue,
  type ProgressEvent,
  type SyncedProgress,
} from "./progressEvents";

export { foldProgressEvents } from "./progressEvents";
export type { ProgressEvent, SyncedProgress } from "./progressEvents";

const DEVICE_ID_KEY = "flashmedic_sync_device_id_v1";
const GUEST_GENERATION_KEY = "flashmedic_sync_guest_generation_v1";
const GUEST_GENERATION_AT_KEY = "flashmedic_sync_guest_generation_at_v1";
const LINKED_UID_KEY = "flashmedic_sync_linked_uid_v1";
const QUEUE_PREFIX = "flashmedic_sync_queue_v1:";

type Listener = (progress: SyncedProgress) => void;

export type ProgressSyncState = {
  status: "guest" | "pending" | "syncing" | "synced" | "offline" | "error";
  pendingCount: number;
  lastSyncedAt: string | null;
};

type SyncStateListener = (state: ProgressSyncState) => void;

const listeners = new Set<Listener>();
const syncStateListeners = new Set<SyncStateListener>();
let lastSnapshot: SyncedProgress | null = null;
let lastSyncState: ProgressSyncState = {
  status: "guest",
  pendingCount: 0,
  lastSyncedAt: null,
};
let started = false;
let syncInFlight: Promise<void> | null = null;
let syncRequested = false;
let activeAuthenticatedUid: string | null = null;
let authTransition: Promise<void> = Promise.resolve();

function updateSyncState(next: Partial<ProgressSyncState>) {
  lastSyncState = { ...lastSyncState, ...next };
  for (const listener of syncStateListeners) listener(lastSyncState);
}

function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function newId(): string {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${Date.now()}-${random}`;
}

async function getOrCreate(key: string): Promise<string> {
  const existing = await appStorage.getItem(key);
  if (existing) return existing;
  const created = newId();
  await appStorage.setItem(key, created);
  return created;
}

function queueKey(uid: string) {
  return `${QUEUE_PREFIX}${uid}`;
}

async function loadQueue(uid: string): Promise<ProgressEvent[]> {
  return parseProgressQueue(await appStorage.getItem(queueKey(uid)));
}

async function getOrCreateGuestGeneration(): Promise<{
  generation: string;
  occurredAt: string;
}> {
  const [storedGeneration, storedOccurredAt] = await Promise.all([
    appStorage.getItem(GUEST_GENERATION_KEY),
    appStorage.getItem(GUEST_GENERATION_AT_KEY),
  ]);
  const generation = storedGeneration ?? newId();
  const occurredAt = storedOccurredAt && !Number.isNaN(Date.parse(storedOccurredAt))
    ? storedOccurredAt
    : new Date().toISOString();
  if (!storedGeneration || storedOccurredAt !== occurredAt) {
    await appStorage.setItems([
      [GUEST_GENERATION_KEY, generation],
      [GUEST_GENERATION_AT_KEY, occurredAt],
    ]);
  }
  return { generation, occurredAt };
}

async function appendEvents(uid: string, events: readonly ProgressEvent[]) {
  if (events.length === 0) return;
  const current = await loadQueue(uid);
  const byId = new Map(current.map((event) => [event.eventId, event]));
  for (const event of events) byId.set(event.eventId, event);
  await appStorage.setItem(queueKey(uid), JSON.stringify([...byId.values()]));
}

function eventBase(
  type: ProgressEvent["type"],
  deviceId: string,
  card?: Pick<Flashcard, "id" | "subject" | "topic" | "subtopic">,
): ProgressEvent {
  return {
    schemaVersion: 1,
    eventId: `${type}-${deviceId}-${newId()}`,
    type,
    deviceId,
    cardId: card?.id ?? null,
    subject: card?.subject ?? null,
    topic: card?.topic ?? null,
    subtopic: card?.subtopic ?? null,
    occurredAt: new Date().toISOString(),
    known: null,
    mode: null,
    seen: null,
    correct: null,
    incorrect: null,
    lastSeen: null,
    mistakeAddedAt: null,
    mistakeLastReviewedAt: null,
    mistakeIncorrectCount: null,
    mistakeReviewStatus: null,
  };
}

async function ensureGuestBaseline(uid: string) {
  if ((await appStorage.getItem(LINKED_UID_KEY)) === uid) return;
  const [deviceId, guestGeneration, stats, mistakes] = await Promise.all([
    getOrCreate(DEVICE_ID_KEY),
    getOrCreateGuestGeneration(),
    loadStats(),
    loadMistakes(),
  ]);
  const mistakeByCard = new Map(mistakes.map((item) => [item.cardId, item]));
  const cardIds = new Set([...Object.keys(stats), ...mistakeByCard.keys()]);
  const events: ProgressEvent[] = [];
  for (const cardId of cardIds) {
    const cardStats = stats[cardId];
    const mistake = mistakeByCard.get(cardId);
    events.push({
      ...eventBase("baseline", deviceId, {
        id: cardId,
        subject: mistake?.subject ?? "Ukendt",
        topic: mistake?.topic,
        subtopic: mistake?.subtopic,
      }),
      eventId: `baseline-${deviceId}-${guestGeneration.generation}-${encodeURIComponent(cardId)}`,
      occurredAt: cardStats?.lastSeen ?? mistake?.lastReviewedAt ?? mistake?.addedAt ?? guestGeneration.occurredAt,
      seen: cardStats?.seen ?? 0,
      correct: cardStats?.correct ?? 0,
      incorrect: cardStats?.incorrect ?? 0,
      lastSeen: cardStats?.lastSeen ?? null,
      mistakeAddedAt: mistake?.addedAt ?? null,
      mistakeLastReviewedAt: mistake?.lastReviewedAt ?? null,
      mistakeIncorrectCount: mistake?.incorrectCount ?? null,
      mistakeReviewStatus: mistake?.reviewStatus ?? null,
    });
  }
  await appendEvents(uid, events);
  await appStorage.setItem(LINKED_UID_KEY, uid);
}

async function flushQueue(uid: string) {
  let queue = await loadQueue(uid);
  while (queue.length > 0) {
    const chunk = queue.slice(0, 200);
    const batch = writeBatch(db);
    for (const event of chunk) {
      batch.set(doc(db, "flashmedic_users", uid, "progressEvents", event.eventId), event);
    }
    await batch.commit();
    const uploaded = new Set(chunk.map((event) => event.eventId));
    queue = (await loadQueue(uid)).filter((event) => !uploaded.has(event.eventId));
    await appStorage.setItem(queueKey(uid), JSON.stringify(queue));
  }
}

async function pullProgress(uid: string) {
  const snapshot = await getDocs(collection(db, "flashmedic_users", uid, "progressEvents"));
  const pending = await loadQueue(uid);
  const events = [
    ...snapshot.docs.map((item) => item.data() as ProgressEvent),
    ...pending,
  ];
  const merged = foldProgressEvents(events);
  if (auth.currentUser?.uid !== uid) return;
  await Promise.all([saveStats(merged.stats), saveMistakes(merged.mistakes)]);
  lastSnapshot = merged;
  for (const listener of listeners) listener(merged);
}

export async function synchronizeProgress(): Promise<void> {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) {
    updateSyncState({ status: "guest", pendingCount: 0, lastSyncedAt: null });
    return;
  }
  if (syncInFlight) {
    syncRequested = true;
    return syncInFlight;
  }
  syncRequested = false;
  syncInFlight = (async () => {
    updateSyncState({
      status: isOffline() ? "offline" : "syncing",
      pendingCount: (await loadQueue(user.uid)).length,
    });
    await ensureGuestBaseline(user.uid);
    await flushQueue(user.uid);
    await pullProgress(user.uid);
  })();
  try {
    await syncInFlight;
  } catch (error) {
    updateSyncState({
      status: isOffline() ? "offline" : "error",
      pendingCount: (await loadQueue(user.uid)).length,
    });
    throw error;
  } finally {
    syncInFlight = null;
  }
  if (syncRequested) {
    syncRequested = false;
    await synchronizeProgress();
    return;
  }
  if (auth.currentUser?.uid === user.uid && !auth.currentUser.isAnonymous) {
    updateSyncState({
      status: "synced",
      pendingCount: (await loadQueue(user.uid)).length,
      lastSyncedAt: new Date().toISOString(),
    });
  }
}

export async function queueProgressAttempt(
  card: Flashcard,
  known: boolean,
  mode: FlashcardTrainingMode,
) {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) return;
  const deviceId = await getOrCreate(DEVICE_ID_KEY);
  await appendEvents(user.uid, [{
    ...eventBase("attempt", deviceId, card),
    known,
    mode,
  }]);
  updateSyncState({
    status: isOffline() ? "offline" : "pending",
    pendingCount: (await loadQueue(user.uid)).length,
  });
  void synchronizeProgress().catch(() => undefined);
}

export async function queueProgressReset() {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) return;
  const deviceId = await getOrCreate(DEVICE_ID_KEY);
  await appendEvents(user.uid, [eventBase("reset", deviceId)]);
  updateSyncState({
    status: isOffline() ? "offline" : "pending",
    pendingCount: (await loadQueue(user.uid)).length,
  });
  void synchronizeProgress().catch(() => undefined);
}

export async function queueMistakeClear(cardIds: readonly string[]) {
  const user = auth.currentUser;
  if (!user || user.isAnonymous || cardIds.length === 0) return;
  const deviceId = await getOrCreate(DEVICE_ID_KEY);
  await appendEvents(
    user.uid,
    cardIds.map((cardId) => eventBase("mistake_clear", deviceId, {
      id: cardId,
      subject: "Ukendt",
    })),
  );
  updateSyncState({
    status: isOffline() ? "offline" : "pending",
    pendingCount: (await loadQueue(user.uid)).length,
  });
  void synchronizeProgress().catch(() => undefined);
}

export function subscribeSyncedProgress(listener: Listener) {
  listeners.add(listener);
  if (lastSnapshot) listener(lastSnapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeProgressSyncState(listener: SyncStateListener) {
  syncStateListeners.add(listener);
  listener(lastSyncState);
  return () => {
    syncStateListeners.delete(listener);
  };
}

export function startProgressSync() {
  if (started) return;
  started = true;
  onAuthStateChanged(auth, (user) => {
    const previousUid = activeAuthenticatedUid;
    const nextUid = user && !user.isAnonymous ? user.uid : null;
    activeAuthenticatedUid = nextUid;
    if (!nextUid) {
      updateSyncState({ status: "guest", pendingCount: 0, lastSyncedAt: null });
    }
    authTransition = authTransition
      .catch(() => undefined)
      .then(async () => {
        if (previousUid && previousUid !== nextUid) {
          await syncInFlight?.catch(() => undefined);
          await prepareForAccountSwitch();
        }
        if (nextUid) await synchronizeProgress();
      })
      .catch(() => undefined);
  });
  const retry = () => void synchronizeProgress().catch(() => undefined);
  if (typeof window !== "undefined") window.addEventListener("online", retry);
  setInterval(retry, 30_000);
}

export async function prepareForAccountSwitch() {
  const generation = newId();
  const occurredAt = new Date().toISOString();
  await Promise.all([
    appStorage.removeItem("flashmedic_card_stats"),
    appStorage.removeItem("flashmedic_mistakes_v1"),
    appStorage.removeItem("flashmedic_profile"),
    appStorage.removeItem("flashmedic:userProfile:v2"),
    appStorage.removeItem(LINKED_UID_KEY),
    appStorage.setItems([
      [GUEST_GENERATION_KEY, generation],
      [GUEST_GENERATION_AT_KEY, occurredAt],
    ]),
  ]);
  lastSnapshot = { stats: {}, mistakes: [] };
  for (const listener of listeners) listener(lastSnapshot);
}

export async function prepareImportedProgressForSync(identity: {
  generation: string;
  occurredAt: string;
}) {
  await Promise.all([
    appStorage.removeItem(LINKED_UID_KEY),
    appStorage.setItems([
      [GUEST_GENERATION_KEY, identity.generation],
      [GUEST_GENERATION_AT_KEY, identity.occurredAt],
    ]),
  ]);
}
