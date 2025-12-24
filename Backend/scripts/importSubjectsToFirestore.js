/* Backend/scripts/importSubjectsToFirestore.js
   Usage:
     node Backend/scripts/importSubjectsToFirestore.js
*/

const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// ---------- CONFIG ----------
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "keys", "serviceAccount.json");

// Your JSON folder (based on your screenshot)
const SUBJECTS_DIR = path.join(__dirname, "..", "data", "subjects");

// Optional: control ordering in your subject picker
const SUBJECT_ORDER = [
  "akutte_tilstande",
  "anatomi_og_fysiologi",
  "farmakologi",
  "kliniske_parametre",
  "mikrobiologi",
  "sygdomslaere",
  "ekg",
  "traumatologi_og_itls",
  "psykologi",
  "kørekort",
  "weekly-challenges",
];

// Firestore collection name
const SUBJECTS_COLLECTION = "subjects";

// Firestore batch limit: 500 writes max per batch
const BATCH_LIMIT = 450;

// ---------- HELPERS ----------
function toSlug(filename) {
  // file: ekg.json => ekg
  return filename.replace(/\.json$/i, "");
}

function safeSubjectNameFromSlug(slug) {
  // fallback human-ish name if subject field missing
  return slug
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeCard(card, slug, index) {
  // Ensure required fields exist and types are sane
  const id = String(card.id || `${slug}_${String(index + 1).padStart(3, "0")}`);
  const subject = String(card.subject || safeSubjectNameFromSlug(slug));
  const difficulty = card.difficulty || "medium";

  const normalized = {
    id,
    subject,
    topic: card.topic ?? null,
    subtopic: card.subtopic ?? null,
    question: String(card.question || ""),
    answer: String(card.answer || ""),
    difficulty,
    tags: Array.isArray(card.tags) ? card.tags : [],
    explanation: card.explanation ?? null,

    imageKey: card.imageKey ?? null,
    imageCaption: card.imageCaption ?? null,

    deckId: card.deckId ?? null,

    // Useful meta for later
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Very light validation
  if (!normalized.question.trim() || !normalized.answer.trim()) {
    // Keep it importable but mark it (you can later filter these)
    normalized._importWarning = "Missing question or answer";
  }

  return normalized;
}

// ---------- MAIN ----------
async function main() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(
      `Missing service account JSON at: ${SERVICE_ACCOUNT_PATH}\n` +
        "Create it in Firebase Console -> Project settings -> Service accounts."
    );
  }

  const serviceAccount = require(SERVICE_ACCOUNT_PATH);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();

  if (!fs.existsSync(SUBJECTS_DIR)) {
    throw new Error(`Subjects directory not found: ${SUBJECTS_DIR}`);
  }

  const files = fs
    .readdirSync(SUBJECTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".json"));

  if (files.length === 0) {
    throw new Error(`No .json files found in: ${SUBJECTS_DIR}`);
  }

  console.log(`Found ${files.length} subject files in ${SUBJECTS_DIR}`);

  // Import subjects one by one
  for (const file of files) {
    const slug = toSlug(file);
    const filePath = path.join(SUBJECTS_DIR, file);

    const raw = fs.readFileSync(filePath, "utf8");
    let cards;
    try {
      cards = JSON.parse(raw);
    } catch (e) {
      console.error(`❌ Failed JSON parse: ${file}`);
      throw e;
    }

    if (!Array.isArray(cards)) {
      console.warn(`⚠️ ${file} is not an array. Skipping.`);
      continue;
    }

    const first = cards[0] || {};
    const subjectName = String(first.subject || safeSubjectNameFromSlug(slug));
    const order =
      SUBJECT_ORDER.indexOf(slug) >= 0 ? SUBJECT_ORDER.indexOf(slug) + 1 : 999;

    const subjectRef = db.collection(SUBJECTS_COLLECTION).doc(slug);

    // Upsert subject doc
    await subjectRef.set(
      {
        slug,
        name: subjectName,
        order,
        cardCount: cards.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`✅ Upserted subject: ${slug} (${cards.length} cards)`);

    // Write cards in batches
    const normalizedCards = cards.map((c, i) => normalizeCard(c, slug, i));

    const chunks = chunk(normalizedCards, BATCH_LIMIT);
    for (let ci = 0; ci < chunks.length; ci++) {
      const batch = db.batch();
      const part = chunks[ci];

      for (const card of part) {
        const cardRef = subjectRef.collection("cards").doc(card.id);
        batch.set(cardRef, card, { merge: true });
      }

      await batch.commit();
      console.log(`   ↳ committed batch ${ci + 1}/${chunks.length} for ${slug}`);
    }
  }

  console.log("🎉 Import complete.");
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
