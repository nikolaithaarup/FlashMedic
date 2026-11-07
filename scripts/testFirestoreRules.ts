import { readFileSync } from "node:fs";
import path from "node:path";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

async function main() {
  const projectId = "demo-flashmedic";
  const testEnvironment = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(path.resolve("firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8087,
    },
  });

const event = {
  schemaVersion: 1,
  eventId: "attempt-device-12345678-event-1",
  type: "attempt",
  deviceId: "device-12345678",
  cardId: "card-1",
  subject: "EKG",
  topic: null,
  subtopic: null,
  occurredAt: "2026-11-05T12:00:00.000Z",
  known: true,
  mode: "normal",
  seen: null,
  correct: null,
  incorrect: null,
  lastSeen: null,
  mistakeAddedAt: null,
  mistakeLastReviewedAt: null,
  mistakeIncorrectCount: null,
  mistakeReviewStatus: null,
};

try {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const admin = context.firestore();
    await setDoc(doc(admin, "subjects/ekg/cards/card-1"), {
      question: "Educational card one",
    });
    await setDoc(doc(admin, "subjects/pharmacology/cards/card-2"), {
      question: "Educational card two",
    });
  });

  const alice = testEnvironment.authenticatedContext("alice", {
    synapse_email_verified: true,
    synapse_portal_user_id: "alice",
  }).firestore();
  const bob = testEnvironment.authenticatedContext("bob", {
    synapse_email_verified: true,
    synapse_portal_user_id: "bob",
  }).firestore();
  const anonymousUser = testEnvironment.authenticatedContext("anonymous-user", {
    firebase: { sign_in_provider: "anonymous" },
  }).firestore();
  const guest = testEnvironment.unauthenticatedContext().firestore();
  const eventRef = doc(alice, "flashmedic_users/alice/progressEvents", event.eventId);

  await assertSucceeds(setDoc(eventRef, event));
  await assertSucceeds(setDoc(eventRef, event));
  await assertSucceeds(getDoc(eventRef));
  await assertSucceeds(getDocs(collection(alice, "flashmedic_users/alice/progressEvents")));
  await assertFails(getDoc(doc(bob, "flashmedic_users/alice/progressEvents", event.eventId)));
  await assertFails(getDocs(collection(bob, "flashmedic_users/alice/progressEvents")));
  await assertFails(getDoc(doc(guest, "flashmedic_users/alice/progressEvents", event.eventId)));
  await assertFails(setDoc(
    doc(anonymousUser, "flashmedic_users/anonymous-user/progressEvents", event.eventId),
    event,
  ));
  await assertFails(setDoc(eventRef, { ...event, known: false }));
  await assertFails(setDoc(doc(alice, "flashmedic_users/alice/progressEvents/oversized-event"), {
    ...event,
    eventId: "oversized-event",
    subject: "x".repeat(201),
  }));
  await assertFails(setDoc(doc(alice, "flashmedic_users/alice/progressEvents/unknown-field"), {
    ...event,
    eventId: "unknown-field",
    privileged: true,
  }));
  await assertFails(setDoc(doc(alice, "flashmedic_users/alice/progressEvents/invalid-mode"), {
    ...event,
    eventId: "invalid-mode",
    mode: "admin",
  }));
  await assertFails(setDoc(doc(alice, "flashmedic_users/bob/progressEvents/forged-event"), {
    ...event,
    eventId: "forged-event",
  }));
  await assertFails(setDoc(doc(alice, "flashmedic_users/alice/progressEvents/reset-forged"), {
    ...event,
    eventId: "reset-forged",
    type: "reset",
    cardId: null,
    subject: null,
    known: null,
    mode: null,
    seen: 1,
  }));
  await assertFails(setDoc(doc(alice, "weekly_results/2026-W45/users/alice"), {
    uid: "alice",
    totalScore: 999999999,
  }));
  await assertSucceeds(getDoc(doc(guest, "weekly_index/current")));
  await assertSucceeds(getDoc(doc(anonymousUser, "subjects/ekg/cards/card-1")));
  await assertSucceeds(getDoc(doc(anonymousUser, "cards/card-1")));
  const cardQuery = await getDocs(collectionGroup(anonymousUser, "cards"));
  if (cardQuery.size !== 2 || !cardQuery.docs.every((card) =>
    typeof card.data().question === "string" && card.data().question.startsWith("Educational card")
  )) {
    throw new Error("Existing collectionGroup('cards') query did not return expected educational content.");
  }
  console.log("Validated FlashMedic progress ownership, event immutability, and blocked leaderboard writes.");
} finally {
  await testEnvironment.cleanup();
}
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
