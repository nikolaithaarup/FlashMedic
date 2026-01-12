"use strict";

const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

const YEAR = 2026;
const QUESTIONS_PER_WEEK = 15;
const TIME_LIMIT_SEC = 30;

// ---------------- Firebase Admin init ----------------
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "keys", "serviceAccount.json");

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  throw new Error(
    `Missing service account JSON at: ${SERVICE_ACCOUNT_PATH}\n` +
      "Put it in Backend/scripts/keys/serviceAccount.json"
  );
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = admin.firestore();

// ---------------- ISO week helpers ----------------
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function isoWeeksInYear(year) {
  const d = new Date(Date.UTC(year, 11, 28));
  return getISOWeek(d);
}

function weekKey(year, week) {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// ---------------- Utility ----------------
function assertMcqPack(pack) {
  if (!pack || typeof pack !== "object") throw new Error("Pack missing");
  if (!Array.isArray(pack.questions)) throw new Error("Pack.questions must be array");
  if (pack.questions.length !== QUESTIONS_PER_WEEK)
    throw new Error(`Pack must have ${QUESTIONS_PER_WEEK} questions`);
  for (const q of pack.questions) {
    if (!q.id || !q.text) throw new Error("Question missing id/text");
    if (!Array.isArray(q.options) || q.options.length !== 4)
      throw new Error(`Question ${q.id} must have exactly 4 options`);
    const correctCount = q.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) throw new Error(`Question ${q.id} must have exactly 1 correct option`);
  }
}

// ---------------- Week 1: AKS pack (example) ----------------
// Put your real packs in separate files later if you want.
const WEEK1_AKS = {
  topicId: "akut_koronart_syndrom",
  topicTitle: "Akut koronart syndrom – præhospital håndtering",
  questions: [
    {
      id: "q1",
      text: "Akut koronart syndrom (AKS) omfatter:",
      options: [
        { id: "q1a", text: "Kun STEMI", isCorrect: false },
        { id: "q1b", text: "STEMI, non-STEMI og ustabil angina pectoris (UAP)", isCorrect: true },
        { id: "q1c", text: "Kun non-STEMI og stabil angina", isCorrect: false },
        { id: "q1d", text: "Kun hjertestop med ROSC", isCorrect: false },
      ],
    },
    // ... q2..q15 (use the pack I gave you earlier, or swap in your own)
  ],
};

// TEMP: for now, repeat Week 1 pack to prove the pipeline works.
// Replace with real per-week topics later.
function getPackForWeek(week) {
  if (week === 1) return WEEK1_AKS;

  // 🚧 placeholder: repeats AKS so the app works end-to-end
  return WEEK1_AKS;
}

// ---------------- Main ----------------
async function main() {
  const weeks = isoWeeksInYear(YEAR);
  console.log(`Seeding MCQ packs for ${YEAR} with ${weeks} ISO weeks...`);

  for (let week = 1; week <= weeks; week++) {
    const key = weekKey(YEAR, week);
    const pack = getPackForWeek(week);

    const payload = {
      year: YEAR,
      week,
      isoWeek: week, // optional alias
      gameType: "mcq",
      topicId: pack.topicId,
      topicTitle: pack.topicTitle,
      questionVersion: 1,
      questionCount: QUESTIONS_PER_WEEK,
      timeLimitSec: TIME_LIMIT_SEC,
      questions: pack.questions,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    assertMcqPack(payload);

    await db.collection("weeklyChallenges").doc(key).set(payload, { merge: true });
    console.log(`✅ Wrote ${key} (${payload.topicId})`);
  }

  console.log("🎉 Done seeding weeklyChallenges.");
}

main().catch((e) => {
  console.error("❌ seedWeeklyMcq2026 failed:", e);
  process.exit(1);
});
