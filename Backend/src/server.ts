import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// Helper to load ALL cards from data/subjects
function loadAllCards() {
  const subjectsDir = path.join(__dirname, "..", "data", "subjects");
  const files = fs.readdirSync(subjectsDir).filter((f) => f.endsWith(".json"));

  let allCards: any[] = [];

  for (const file of files) {
    const fullPath = path.join(subjectsDir, file);
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    if (Array.isArray(content)) {
      allCards = allCards.concat(content);
    }
  }

  return allCards;
}

// ---- ROUTES ----

// Test route
app.get("/", (_req, res) => {
  res.send("FlashMedic backend running");
});

// All flashcards
app.get("/flashcards/all", (_req, res) => {
  const cards = loadAllCards();
  res.json(cards);
});

// Single subject by slug (e.g. /flashcards/anatomi_og_fysiologi)
app.get("/flashcards/:subject", (req, res) => {
  const slug = req.params.subject;
  const filePath = path.join(__dirname, "..", "data", "subjects", `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Subject not found" });
  }

  const cards = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(cards);
});

// ---- START SERVER ----

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`FlashMedic backend listening on port ${PORT}`);
});
