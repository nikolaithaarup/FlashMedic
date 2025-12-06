import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import contactRoutes from "./routes/contact";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/contact", contactRoutes);


// ---------- Helpers ----------

// Load ALL cards from data/subjects
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

// Load current weekly challenge from JSON file (if present)
function loadCurrentWeeklyChallenge() {
  const filePath = path.join(__dirname, "..", "data", "weekly-challenge.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

// ---------- Routes ----------

// Simple health check
app.get("/", (_req, res) => {
  res.send("FlashMedic backend running");
});

// All flashcards
app.get("/flashcards/all", (_req, res) => {
  const cards = loadAllCards();
  res.json(cards);
});

// Flashcards for single subject by slug (e.g. /flashcards/anatomi_og_fysiologi)
app.get("/flashcards/:subject", (req, res) => {
  const slug = req.params.subject;
  const filePath = path.join(__dirname, "..", "data", "subjects", `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Subject not found" });
  }

  const cards = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(cards);
});

// ---------- Contact endpoint ----------
// For now: just logs to console + returns OK.
// Later we can plug in real email sending with env vars.

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Besked (message) er påkrævet." });
  }

  const payload = {
    name: typeof name === "string" ? name : null,
    email: typeof email === "string" ? email : null,
    message,
    receivedAt: new Date().toISOString(),
  };

  console.log("CONTACT MESSAGE FROM APP:", payload);

  // Later: send email to you using SMTP / SendGrid etc.
  return res.json({ ok: true });
});

// ---------- Weekly challenges ----------
// Read-only JSON for now. You edit the JSON file, push, Render redeploys.

app.get("/weekly-challenges/current", (_req, res) => {
  const weekly = loadCurrentWeeklyChallenge();
  if (!weekly) {
    return res.status(404).json({ error: "Ingen weekly challenge sat endnu." });
  }
  return res.json(weekly);
});

// ---------- Start server ----------

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`FlashMedic backend listening on port ${PORT}`);
});
