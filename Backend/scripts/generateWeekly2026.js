/* Backend/scripts/generateWeekly2026.js */
"use strict";

const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

const YEAR = 2026;

// ---------------- Firebase Admin init ----------------
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "keys", "serviceAccount.json");

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  throw new Error(
    `Missing service account JSON at: ${SERVICE_ACCOUNT_PATH}\n` +
    "Put it in Backend/scripts/keys/serviceAccount.json (same as importSubjectsToFirestore.js)."
  );
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // keeps “detect project id” away
  });
}

const db = admin.firestore();


// ---------------- ISO week helpers ----------------
function getISOWeek(date) {
  // ISO week date weeks start on Monday, and week 1 is the week with Jan 4 in it.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7; // Mon=1 ... Sun=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // shift to Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

function isoWeeksInYear(year) {
  // ISO week of Dec 28 is always the last ISO week number of the year
  const d = new Date(Date.UTC(year, 11, 28));
  return getISOWeek(d);
}

function getISOWeekStart(year, week) {
  // Monday of ISO week `week` in `year`
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay() || 7; // Mon=1..Sun=7
  if (dow <= 4) simple.setUTCDate(simple.getUTCDate() - dow + 1);
  else simple.setUTCDate(simple.getUTCDate() + 8 - dow);
  // ensure time is 00:00:00 UTC
  simple.setUTCHours(0, 0, 0, 0);
  return simple;
}

// ---------------- Random helpers ----------------
function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(0, Math.min(n, copy.length)));
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

// ---------------- Game builders ----------------

// Turn flashcard into an MCQ question by making distractors from other cards’ answers
function buildMcqFromCards(cards, count = 10) {
  const usable = cards.filter((c) => c && c.question && c.answer);
  const chosen = pickRandom(usable, count);

  return chosen.map((c, idx) => {
    const correct = String(c.answer).trim();

    const distractorPool = usable
      .filter((x) => x.id !== c.id)
      .map((x) => String(x.answer).trim())
      .filter((a) => a && a !== correct);

    const distractors = pickRandom(uniq(distractorPool), 3);

    const optionsRaw = pickRandom(
      [
        { text: correct, isCorrect: true },
        ...distractors.map((d) => ({ text: d, isCorrect: false })),
      ],
      4
    );

    const options = optionsRaw.map((o, k) => ({
      id: `opt_${idx}_${k}`,
      text: o.text,
      isCorrect: o.isCorrect,
    }));

    return {
      id: `q_${idx + 1}`,
      text: String(c.question).trim(),
      options,
      // optional metadata
      subject: c.subject ?? null,
      topic: c.topic ?? null,
      difficulty: c.difficulty ?? null,
      imageKey: c.imageKey ?? null,
      sourceCardId: c.id ?? null,
    };
  });
}

// Match game: pair question -> answer
function buildMatchFromCards(cards, pairs = 10) {
  const usable = cards.filter((c) => c && c.question && c.answer);
  const chosen = pickRandom(usable, pairs);

  return chosen.map((c, idx) => ({
    id: `p_${idx + 1}`,
    left: String(c.question).trim(),
    right: String(c.answer).trim(),
    sourceCardId: c.id ?? null,
  }));
}

// Word game: try to pick a "term" from tags first; fallback to topic/subtopic; fallback to first 1–3 words of question
function buildWordFromCards(cards, count = 5) {
  const usable = cards.filter((c) => c && c.answer && (c.tags?.length || c.topic || c.subtopic || c.question));
  const chosen = pickRandom(usable, count);

  return chosen.map((c, idx) => {
    const tagWord = c.tags?.find((t) => normalize(t).length >= 3) ?? null;
    const fallbackFromTopic = c.subtopic || c.topic || null;

    const fallbackFromQuestion = (() => {
      const q = String(c.question ?? "").trim();
      if (!q) return null;
      // naive term extraction: take first 1-3 words without punctuation
      const cleaned = q.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
      const parts = cleaned.split(/\s+/).filter(Boolean);
      return parts.slice(0, Math.min(3, parts.length)).join(" ");
    })();

    const word = String(tagWord || fallbackFromTopic || fallbackFromQuestion || "Begreb").trim();

    return {
      id: `w_${idx + 1}`,
      word,
      prompt: "Forklar begrebet kort",
      accepted: [normalize(c.answer)],
      explanation: String(c.answer).trim(),
      subject: c.subject ?? null,
      topic: c.topic ?? null,
      sourceCardId: c.id ?? null,
    };
  });
}

// ---------------- Load subject JSON ----------------
function loadAllSubjectJson() {
  const dir = path.join(__dirname, "..", "data", "subjects");
  if (!fs.existsSync(dir)) {
    throw new Error(`Subjects dir not found: ${dir}`);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files.map((f) => {
    const slug = f.replace(/\.json$/i, "");
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));

    // Some of your subject files are plain arrays. If you ever wrap them, this keeps it robust:
    const cards = Array.isArray(raw) ? raw : raw.cards ?? [];
    return { slug, cards };
  });
}

// ---------------- Firestore upsert ----------------
async function upsertWeeklyGame(docId, payload) {
  await db.collection("weeklyGames").doc(docId).set(payload, { merge: true });
}

// ---------------- Main ----------------
async function main() {
  const subjects = loadAllSubjectJson();
  const isoWeeks = isoWeeksInYear(YEAR);

  console.log(`Year ${YEAR} has ${isoWeeks} ISO weeks`);
  if (!subjects.length) throw new Error("No subject JSON files found.");

  const subjectCycle = subjects.map((s) => s.slug);

  for (let week = 1; week <= isoWeeks; week++) {
    const weekStart = getISOWeekStart(YEAR, week);

    const subjectSlug = subjectCycle[(week - 1) % subjectCycle.length];
    const subject = subjects.find((s) => s.slug === subjectSlug);
    const cards = subject?.cards ?? [];

    // --- 1) MCQ: 10 questions
    const mcqDocId = `${YEAR}_W${String(week).padStart(2, "0")}_mcq_1`;
    const mcq = {
      year: YEAR,
      isoWeek: week,
      weekStart: admin.firestore.Timestamp.fromDate(weekStart),
      kind: "mcq",
      slot: 1,
      title: "Ugens MCQ (10)",
      subjectSlug,
      items: buildMcqFromCards(cards, 10),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await upsertWeeklyGame(mcqDocId, mcq);

    // --- 2) Match: 2 games
    for (let slot = 1; slot <= 2; slot++) {
      const matchDocId = `${YEAR}_W${String(week).padStart(2, "0")}_match_${slot}`;
      const match = {
        year: YEAR,
        isoWeek: week,
        weekStart: admin.firestore.Timestamp.fromDate(weekStart),
        kind: "match",
        slot,
        title: `Ugens Match ${slot}`,
        subjectSlug,
        items: buildMatchFromCards(cards, 10),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await upsertWeeklyGame(matchDocId, match);
    }

    // --- 3) Word: 3 games (5 words each)
    for (let slot = 1; slot <= 3; slot++) {
      const wordDocId = `${YEAR}_W${String(week).padStart(2, "0")}_word_${slot}`;
      const word = {
        year: YEAR,
        isoWeek: week,
        weekStart: admin.firestore.Timestamp.fromDate(weekStart),
        kind: "word",
        slot,
        title: `Ugens ord ${slot}`,
        subjectSlug,
        items: buildWordFromCards(cards, 5),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await upsertWeeklyGame(wordDocId, word);
    }

    console.log(`✅ Week ${week}/${isoWeeks} done (${subjectSlug})`);
  }

  console.log("🎉 All weekly games generated.");
}

main().catch((e) => {
  console.error("❌ generateWeekly2026 failed:", e);
  process.exit(1);
});
