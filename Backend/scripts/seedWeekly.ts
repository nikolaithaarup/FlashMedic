/**
 * Seeds Firestore weekly packs from seed/weeklyPlan_2026.ts
 *
 * Writes:
 * - weekly_word_packs/{weekKey}
 * - weekly_match_packs/{weekKey}
 * - weekly_mcq_packs/{weekKey}
 * - weekly_index/{weekKey}
 * - weekly_index/current   <-- important for app runtime
 *
 * CLI:
 *  - --week 2026-W10       (seed only one week)
 *  - --active 2026-W08     (set this week active; deactivates others + writes weekly_index/current)
 *  - --dry                 (print what would be written)
 */

import crypto from "crypto";
import admin from "firebase-admin";
import { weeklyPlan2026 } from "../content/weeklyPlan_2026";

type WeekKey = keyof typeof weeklyPlan2026;

type Args = {
  week?: WeekKey;
  active?: WeekKey;
  dry?: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry") args.dry = true;
    if (a === "--week" && argv[i + 1]) args.week = argv[i + 1] as WeekKey;
    if (a === "--active" && argv[i + 1]) args.active = argv[i + 1] as WeekKey;
  }
  return args;
}

function stableId(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function wordRound(
  round: number,
  label: string,
  words: string[],
): {
  round: number;
  topic: string;
  minLength: number;
  maxLength: number;
  words: string[];
} {
  const clean = (words ?? []).map((w) => String(w).trim()).filter(Boolean);
  const lengths = clean.map((w) => w.length);
  const min = lengths.length ? Math.min(...lengths) : 1;
  const max = lengths.length ? Math.max(...lengths) : 50;

  const minLength = Math.max(1, min - 1);
  const maxLength = Math.min(50, max + 2);

  return { round, topic: label, minLength, maxLength, words: clean };
}

async function ensureAdmin() {
  if (admin.apps.length) return;

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

async function setActiveForCollection(
  colName: string,
  activeWeek: string,
  dry?: boolean,
) {
  const db = admin.firestore();
  const snap = await db.collection(colName).get();

  const batch = db.batch();
  let touched = 0;

  snap.docs.forEach((d) => {
    if (d.id === "current") return; // don't touch weekly_index/current here
    const isActive = d.id === activeWeek;
    batch.set(d.ref, { isActive }, { merge: true });
    touched++;
  });

  if (dry) {
    console.log(
      `[dry] would set active in ${colName}: active=${activeWeek}, docs=${touched}`,
    );
    return;
  }

  await batch.commit();
  console.log(
    `Set active in ${colName}: active=${activeWeek}, docs=${touched}`,
  );
}

async function writeCurrentWeek(activeWeek: WeekKey, dry?: boolean) {
  const db = admin.firestore();
  const currentRef = db.collection("weekly_index").doc("current");

  const payload = {
    weekId: activeWeek,
    weekKey: activeWeek,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (dry) {
    console.log("[dry] would write weekly_index/current ->", payload);
    return;
  }

  await currentRef.set(payload, { merge: true });
  console.log(`Wrote weekly_index/current -> ${activeWeek}`);
}

async function upsertWeek(
  weekKey: WeekKey,
  activeOverride?: WeekKey,
  dry?: boolean,
) {
  const db = admin.firestore();
  const plan = weeklyPlan2026[weekKey];

  if (!plan) throw new Error(`No plan entry for ${weekKey}`);

  const isActive = activeOverride ? weekKey === activeOverride : false;

  // --- Word pack ---
  const wordPack = {
    weekKey,
    isActive,
    topicTitle: plan.word.topicTitle,
    rounds: [
      wordRound(1, "Easy", plan.word.easy),
      wordRound(2, "Medium", plan.word.medium),
      wordRound(3, "Hard", plan.word.hard),
    ],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // --- Match pack ---
  const matchRounds = plan.match.rounds.map((topic, idx) => {
    const round = idx + 1;
    const pairsRaw = plan.match.pairsByRound?.[round] ?? [];

    const pairs = pairsRaw.map((p) => ({
      id: stableId(`${weekKey}|match|r${round}|${p.left}|${p.right}`),
      left: p.left,
      right: p.right,
    }));

    return { round, topic, pairs };
  });

  const matchPack = {
    weekKey,
    isActive,
    topicTitle: plan.title,
    rounds: matchRounds,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // --- MCQ pack ---
  const mcqTimeLimit = plan.mcq.timeLimitSec ?? 30;
  const categories = plan.mcq.rounds;
  const questions = Array.isArray(plan.mcq.questions) ? plan.mcq.questions : [];

  const mcqPack = {
    weekKey,
    isActive,
    topicTitle: plan.title,
    timeLimitSec: mcqTimeLimit,
    categories,
    questions,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // --- Weekly index entry per week ---
  const weeklyIndex = {
    weekKey,
    isActive,
    title: plan.title,
    topics: {
      mcq: plan.title,
      match: plan.title,
      word: plan.word.topicTitle,
    },
    categoryBullets: {
      mcq: categories,
      match: plan.match.rounds,
      word: ["Easy", "Medium", "Hard"],
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (dry) {
    console.log(`[dry] upsert ${weekKey}`);
    console.log(
      `  word rounds: ${wordPack.rounds.map((r) => `${r.round}:${r.words.length}`).join(", ")}`,
    );
    console.log(`  match rounds: ${matchPack.rounds.length}`);
    console.log(`  mcq questions: ${mcqPack.questions.length}`);
    return;
  }

  await db.collection("weekly_word_packs").doc(weekKey).set(wordPack, {
    merge: true,
  });
  await db.collection("weekly_match_packs").doc(weekKey).set(matchPack, {
    merge: true,
  });
  await db.collection("weekly_mcq_packs").doc(weekKey).set(mcqPack, {
    merge: true,
  });
  await db.collection("weekly_index").doc(weekKey).set(weeklyIndex, {
    merge: true,
  });

  console.log(`Upserted week ${weekKey}`);
}

async function main() {
  const args = parseArgs(process.argv);
  await ensureAdmin();

  const allWeeks = Object.keys(weeklyPlan2026).sort() as WeekKey[];
  const targetWeeks = args.week ? [args.week] : allWeeks;

  for (const wk of targetWeeks) {
    await upsertWeek(wk, args.active, args.dry);
  }

  if (args.active) {
    await setActiveForCollection("weekly_word_packs", args.active, args.dry);
    await setActiveForCollection("weekly_match_packs", args.active, args.dry);
    await setActiveForCollection("weekly_mcq_packs", args.active, args.dry);
    await setActiveForCollection("weekly_index", args.active, args.dry);
    await writeCurrentWeek(args.active, args.dry);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
