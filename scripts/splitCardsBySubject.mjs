// scripts/splitCardsBySubject.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root = one level up from /scripts
const projectRoot = path.join(__dirname, "..");

// cards.json lives at project root
const cardsPath = path.join(projectRoot, "cards.json");

// We'll write split files into /data/subjects
const dataDir = path.join(projectRoot, "data");
const outputDir = path.join(dataDir, "subjects");

if (!fs.existsSync(cardsPath)) {
  console.error("Could not find cards.json at:", cardsPath);
  process.exit(1);
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const raw = fs.readFileSync(cardsPath, "utf8");
const parsed = JSON.parse(raw);

// ---- NEW PART: handle both array and { cards: [...] } ----
let cards;

if (Array.isArray(parsed)) {
  cards = parsed;
} else if (Array.isArray(parsed.cards)) {
  cards = parsed.cards;
} else {
  console.error("cards.json is not an array and has no 'cards' array property.");
  console.error("Top-level keys:", Object.keys(parsed));
  process.exit(1);
}
// -----------------------------------------------------------

function slugifySubject(subject) {
  return subject
    .toLowerCase()
    .replace(/\s+/g, "_") // spaces -> _
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9_]/g, ""); // remove weird chars
}

const bySubject = new Map();

for (const card of cards) {
  const subject = card.subject || "ukendt";
  const slug = slugifySubject(subject);

  if (!bySubject.has(slug)) {
    bySubject.set(slug, []);
  }
  bySubject.get(slug).push(card);
}

for (const [slug, list] of bySubject.entries()) {
  const outPath = path.join(outputDir, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2), "utf8");
  console.log(`Wrote ${list.length} cards to ${outPath}`);
}

console.log("Done. Files are in data/subjects. You can now stop using the giant cards.json.");
