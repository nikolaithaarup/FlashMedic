import { readFileSync } from "node:fs";
import path from "node:path";

import { BUNDLED_FLASHCARD_COUNT } from "../src/data/bundledFlashcards";
import {
  parseProgressBackup,
  rebindProgressBackupUser,
} from "../src/storage/progressTransfer";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function pngDimensions(filePath: string) {
  const bytes = readFileSync(filePath);
  assert(bytes.toString("ascii", 1, 4) === "PNG", `${filePath} is not a PNG file.`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const projectRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(projectRoot, "public", "manifest.webmanifest");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  name?: string;
  short_name?: string;
  display?: string;
  start_url?: string;
  scope?: string;
  icons?: { src?: string; sizes?: string; purpose?: string }[];
};

assert(BUNDLED_FLASHCARD_COUNT === 1970, `Expected 1,970 bundled cards; found ${BUNDLED_FLASHCARD_COUNT}.`);
assert(manifest.name === "FlashMedic", "PWA manifest name is missing or incorrect.");
assert(manifest.short_name === "FlashMedic", "PWA short name is missing or incorrect.");
assert(manifest.display === "standalone", "PWA display mode must be standalone.");
assert(manifest.start_url === "/" && manifest.scope === "/", "PWA start URL and scope must be root-relative.");

for (const icon of manifest.icons ?? []) {
  const source = icon.src;
  if (!source || !source.startsWith("/icons/")) {
    throw new Error("Every PWA icon must use the /icons/ path.");
  }
  const expectedSize = Number(icon.sizes?.split("x")[0]);
  assert(Number.isFinite(expectedSize), `Invalid icon size for ${source}.`);
  const dimensions = pngDimensions(path.join(projectRoot, "public", source.slice(1)));
  assert(
    dimensions.width === expectedSize && dimensions.height === expectedSize,
    `${source} is ${dimensions.width}x${dimensions.height}; expected ${icon.sizes}.`,
  );
}

assert(
  (manifest.icons ?? []).some((icon) => icon.purpose === "maskable"),
  "The manifest must include a maskable icon.",
);

const workerTemplate = readFileSync(path.join(projectRoot, "scripts", "pwa-sw.template.js"), "utf8");
assert(workerTemplate.includes("SKIP_WAITING"), "Service worker update handling is missing.");
assert(workerTemplate.includes("/offline.html"), "Service worker offline navigation fallback is missing.");
assert(
  workerTemplate.includes("const RUNTIME_NAME = \"__RUNTIME_NAME__\""),
  "The runtime cache must be versioned with each content build.",
);

const validBackup = JSON.stringify({
  app: "FlashMedic",
  schemaVersion: 1,
  exportedAt: "2026-11-05T12:00:00.000Z",
  values: {
    flashmedic_card_stats: JSON.stringify({
      "card-1": { seen: 2, correct: 1, incorrect: 1, lastSeen: null },
    }),
    "weekly_lock_mcq_2026-W45": "1",
  },
});
assert(
  parseProgressBackup(validBackup).schemaVersion === 1,
  "A valid progress backup must remain importable.",
);

const pendingBackup = parseProgressBackup(JSON.stringify({
  app: "FlashMedic",
  schemaVersion: 1,
  exportedAt: "2026-11-05T12:00:00.000Z",
  values: {
    flashmedic_weekly_pending_results_v1: JSON.stringify([{
      id: "2026-W45:native-user:mcq",
      attemptId: "2026-W45:native-user:mcq",
      uid: "native-user",
      nickname: "Test",
      canonicalWeekKey: "2026-W45",
      resultKey: "2026-W45",
      game: "mcq",
      score: 1000,
      completedAt: "2026-11-05T12:00:00.000Z",
      status: "pending",
    }]),
  },
}));
const reboundPending = JSON.parse(
  rebindProgressBackupUser(pendingBackup, "web-user")
    .values.flashmedic_weekly_pending_results_v1,
) as { uid: string; id: string }[];
assert(
  reboundPending[0]?.uid === "web-user" &&
    reboundPending[0]?.id === "2026-W45:web-user:mcq",
  "Imported pending results must be rebound to the current browser user.",
);

let rejectedCorruptBackup = false;
try {
  parseProgressBackup(JSON.stringify({
    app: "FlashMedic",
    schemaVersion: 1,
    exportedAt: "2026-11-05T12:00:00.000Z",
    values: { flashmedic_card_stats: JSON.stringify(["not", "stats"]) },
  }));
} catch {
  rejectedCorruptBackup = true;
}
assert(rejectedCorruptBackup, "A structurally corrupt progress backup must be rejected.");

console.log(`Validated PWA metadata, cache versioning, backup safety, icons, and ${BUNDLED_FLASHCARD_COUNT} bundled cards.`);
