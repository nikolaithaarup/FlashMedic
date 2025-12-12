import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import contactRoutes from "./routes/contact";
import { createUser, findUserById } from "./userStore";

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/contact", contactRoutes);

// ---------- Helpers ----------

// Load ALL cards from data/subjects
function loadAllCards() {
  const subjectsDir = path.join(__dirname, "..", "data", "subjects");
  const files = fs.readdirSync(subjectsDir).filter((f) => f.endsWith(".json"));

  let allCards: any[] = [];

  for (const file of files) {
    const fullPath = path.join(subjectsDir, file);

    try {
      const raw = fs.readFileSync(fullPath, "utf8");
      const content = JSON.parse(raw);

      if (Array.isArray(content)) {
        allCards = allCards.concat(content);
      } else {
        // Non-array JSON is just ignored for flashcards
        console.log(`Skipping non-array JSON file: ${file}`);
      }
    } catch (err) {
      console.error("Failed to parse JSON file:", fullPath, err);
      // Re-throw so Express still returns 500 (but now with a useful log)
      throw err;
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

// ---------- Profiles / users ----------

// Register a new user profile
app.post("/profiles/register", (req, res) => {
  const { nickname, classLabel } = req.body || {};

  if (!nickname || typeof nickname !== "string") {
    return res.status(400).json({ error: "nickname is required" });
  }

  const user = createUser(
    String(nickname).trim(),
    classLabel ? String(classLabel).trim() : undefined,
  );

  return res.json({
    userId: user.id,
    nickname: user.nickname,
    classLabel: user.classLabel ?? null,
  });
});

// Get existing user (mainly for debugging)
app.get("/profiles/:id", (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({
    userId: user.id,
    nickname: user.nickname,
    classLabel: user.classLabel ?? null,
    createdAt: user.createdAt,
  });
});

// ---------- Start server ----------

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`FlashMedic backend listening on port ${PORT}`);
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: err?.message ?? String(err),
    stack: err?.stack ?? null,
  });
});
