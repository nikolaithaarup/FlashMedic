import { getCurrentIsoWeekInfo } from "../src/utils/week";

const cases = [
  ["2026-01-01T12:00:00Z", "2026-W01"],
  ["2026-07-02T12:00:00Z", "2026-W27"],
  ["2026-12-31T12:00:00Z", "2026-W53"],
  ["2027-01-01T12:00:00Z", "2026-W53"],
] as const;

for (const [input, expected] of cases) {
  const actual = getCurrentIsoWeekInfo(new Date(input)).weekKey;
  if (actual !== expected) {
    throw new Error(`${input}: expected ${expected}, received ${actual}`);
  }
}

console.log(`Validated ${cases.length} ISO week boundary cases.`);
