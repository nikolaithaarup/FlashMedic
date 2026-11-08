/**
 * Original synthetic single-lead training waveforms — NOT diagnostic ECGs.
 * Deliberately schematic. A one-lead display cannot resolve every differential.
 * Synthetic pleth is an assumed peripheral response, NOT a measured pulse.
 */
export type RhythmLevel = "basis" | "udvidet";
export type RhythmGroup = "sinus" | "atrial" | "junctional" | "ventricular" | "block" | "pacing";
export type Pattern =
  | "sinus" | "sinus_arrhythmia" | "af" | "flutter_fixed" | "flutter_variable"
  | "svt" | "pac" | "pvc" | "junctional" | "wide_ventricular"
  | "vf" | "asystole" | "av_first" | "mobitz_i" | "mobitz_ii"
  | "av_two_one" | "av_complete" | "sinus_pause" | "paced_ventricular";

export type RhythmDefinition = {
  id: string;
  label: string;
  baseBpm: number;
  level: RhythmLevel;
  group: RhythmGroup;
  pattern: Pattern;
  clue: string;
  pulse: "assumed" | "none" | "unknown";
  prSeconds?: number;
};

export const RHYTHMS: readonly RhythmDefinition[] = [
  { id: "sinus", label: "Sinusrytme", baseBpm: 76, level: "basis", group: "sinus", pattern: "sinus", pulse: "assumed", clue: "Regelmæssige RR-intervaller, P-tak foran hvert smalt QRS." },
  { id: "sinus_brady", label: "Sinusbradykardi", baseBpm: 46, level: "basis", group: "sinus", pattern: "sinus", pulse: "assumed", clue: "Sinus-P før hvert QRS, men ventrikelfrekvens under 60/min." },
  { id: "sinus_tachy", label: "Sinustakykardi", baseBpm: 128, level: "basis", group: "sinus", pattern: "sinus", pulse: "assumed", clue: "Hurtig regelmæssig sinusrytme med P-takker før QRS." },
  { id: "sinus_arrhythmia", label: "Sinusarytmi", baseBpm: 72, level: "udvidet", group: "sinus", pattern: "sinus_arrhythmia", pulse: "assumed", clue: "Sinus-P før hvert QRS, mens RR-intervallerne varierer cyklisk." },
  { id: "sinus_pause", label: "Sinuspause", baseBpm: 72, level: "udvidet", group: "sinus", pattern: "sinus_pause", pulse: "assumed", clue: "En pause uden P-takker og QRS afbryder den ellers regelmæssige sinusrytme." },
  { id: "af", label: "Atrieflimren", baseBpm: 112, level: "basis", group: "atrial", pattern: "af", pulse: "assumed", clue: "Uregelmæssigt uregelmæssige RR-intervaller uden tydelige ensartede P-takker." },
  { id: "flutter_2_1", label: "Atrieflagren 2:1", baseBpm: 150, level: "basis", group: "atrial", pattern: "flutter_fixed", pulse: "assumed", clue: "Fluttersavtænder omkring 300/min og regelmæssig overledning 2:1 (~150/min)." },
  { id: "flutter_variable", label: "Atrieflagren, variabel overledning", baseBpm: 100, level: "udvidet", group: "atrial", pattern: "flutter_variable", pulse: "assumed", clue: "Regelmæssige flutterbølger med skiftende 2:1, 3:1 eller 4:1 overledning." },
  { id: "svt", label: "Regelmæssig SVT", baseBpm: 176, level: "basis", group: "atrial", pattern: "svt", pulse: "assumed", clue: "Hurtig regelmæssig smalkomplekset rytme uden sikre synlige P-takker." },
  { id: "pac", label: "Atrielt ekstraslag (SVES)", baseBpm: 80, level: "udvidet", group: "atrial", pattern: "pac", pulse: "assumed", clue: "Et tidligt smalt slag med anderledes P-tak afbryder sinusrytmen." },
  { id: "pvc", label: "Ventrikulært ekstraslag (VES)", baseBpm: 78, level: "basis", group: "ventricular", pattern: "pvc", pulse: "assumed", clue: "Et tidligt bredt QRS uden forudgående sinus-P efterfølges typisk af pause." },
  { id: "junctional", label: "Junktional rytme", baseBpm: 52, level: "udvidet", group: "junctional", pattern: "junctional", pulse: "assumed", clue: "Langsom regelmæssig smalkomplekset rytme uden normal forudgående sinus-P." },
  { id: "ventricular_escape", label: "Ventrikulær erstatningsrytme", baseBpm: 34, level: "udvidet", group: "ventricular", pattern: "wide_ventricular", pulse: "unknown", clue: "Langsom regelmæssig bredkomplekset rytme uden fast P-QRS relation." },
  { id: "aivr", label: "Accelereret idioventrikulær rytme", baseBpm: 76, level: "udvidet", group: "ventricular", pattern: "wide_ventricular", pulse: "unknown", clue: "Bred regelmæssig ventrikulær rytme med moderat frekvens, typisk cirka 50–110/min." },
  { id: "vt", label: "Monomorf ventrikulær takykardi", baseBpm: 170, level: "basis", group: "ventricular", pattern: "wide_ventricular", pulse: "unknown", clue: "Hurtig regelmæssig bredkomplekset rytme. Pulsstatus kan ikke udledes af EKG." },
  { id: "vf", label: "Ventrikelflimren", baseBpm: 0, level: "basis", group: "ventricular", pattern: "vf", pulse: "none", clue: "Kaotisk elektrisk aktivitet uden genkendelige organiserede QRS-komplekser." },
  { id: "asystole", label: "Asystoli", baseBpm: 0, level: "basis", group: "ventricular", pattern: "asystole", pulse: "none", clue: "Ingen organiserede QRS-komplekser; teknisk fejl skal altid udelukkes i klinikken." },
  { id: "av_first", label: "1.-grads AV-blok", baseBpm: 74, level: "udvidet", group: "block", pattern: "av_first", pulse: "assumed", prSeconds: 0.31, clue: "Hver P-tak overledes, men PR-intervallet er konstant forlænget (>200 ms)." },
  { id: "mobitz_i", label: "2.-grads AV-blok, Mobitz I", baseBpm: 62, level: "udvidet", group: "block", pattern: "mobitz_i", pulse: "assumed", clue: "PR-intervallet forlænges gradvist inden en P-tak uden efterfølgende QRS." },
  { id: "mobitz_ii", label: "2.-grads AV-blok, Mobitz II", baseBpm: 66, level: "udvidet", group: "block", pattern: "mobitz_ii", pulse: "assumed", clue: "Enkelte P-takker overledes ikke, mens PR er konstant i de overledte slag." },
  { id: "av_two_one", label: "2:1 AV-blok", baseBpm: 44, level: "udvidet", group: "block", pattern: "av_two_one", pulse: "assumed", clue: "Kun hver anden P-tak efterfølges af QRS. Mobitz I/II kan ikke sikkert skelnes ved 2:1 alene." },
  { id: "av_complete", label: "3.-grads AV-blok", baseBpm: 37, level: "udvidet", group: "block", pattern: "av_complete", pulse: "unknown", clue: "P-takker og QRS-komplekser følger hver deres regelmæssige rytme (AV-dissociation)." },
  { id: "paced_ventricular", label: "Ventrikelpacet rytme", baseBpm: 72, level: "udvidet", group: "pacing", pattern: "paced_ventricular", pulse: "unknown", clue: "Pacemakerspids før et bredt QRS-kompleks; elektrisk capture er ikke bevis for perfusion." },
] as const;

export type RhythmId = (typeof RHYTHMS)[number]["id"];
export type Beat = { time: number; kind: "normal" | "wide" | "pac" | "pvc" | "paced"; pr?: number };
export type Trace = { beats: Beat[]; pTimes: { time: number; inverted?: boolean }[] };
export const getRhythm = (id: RhythmId): RhythmDefinition => {
  const result = RHYTHMS.find((r) => r.id === id);
  if (!result) throw new Error(`Ukendt rytme: ${id}`);
  return result;
};
export const availableRhythms = (level: RhythmLevel) => RHYTHMS.filter((r) => level === "udvidet" || r.level === "basis");

export function makeRng(seed: number): () => number {
  let state = (seed | 0) || 1;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
const normalPR = (r: RhythmDefinition) => r.prSeconds ?? (r.baseBpm > 110 ? 0.14 : 0.17);

/** Deterministic beat and P-wave events for a timeline including negative time for startup. */
export function createTimeline(r: RhythmDefinition, seed: number, from = -18, to = 185): Trace {
  const rand = makeRng(seed);
  const beats: Beat[] = [];
  const pTimes: Trace["pTimes"] = [];
  if (r.pattern === "vf" || r.pattern === "asystole") return { beats, pTimes };
  const beat = (t: number, kind: Beat["kind"] = "normal", pr = normalPR(r)) => {
    beats.push({ time: t, kind, pr });
    if (kind === "normal" || kind === "pac") {
      if (r.pattern !== "af" && r.pattern !== "svt" && r.pattern !== "flutter_fixed" && r.pattern !== "flutter_variable" && r.pattern !== "av_complete" && r.pattern !== "junctional" && r.pattern !== "mobitz_i" && r.pattern !== "mobitz_ii" && r.pattern !== "av_two_one") {
        pTimes.push({ time: t - pr, inverted: kind === "pac" });
      }
    }
  };
  if (r.pattern === "av_complete") {
    for (let p = from - 3; p < to + 2; p += 60 / 82) pTimes.push({ time: p });
    for (let t = from - 2 + 0.39; t < to + 2; t += 60 / r.baseBpm) beat(t, "wide");
  } else if (r.pattern === "mobitz_i" || r.pattern === "mobitz_ii" || r.pattern === "av_two_one") {
    const interval = r.pattern === "av_two_one" ? 60 / 88 : 60 / 82;
    let k = 0;
    for (let p = from - 3; p < to + 2; p += interval, k++) {
      pTimes.push({ time: p });
      if (r.pattern === "mobitz_i") {
        const group = k % 4;
        if (group !== 3) beat(p + [0.15, 0.23, 0.31][group], "normal");
      } else if (r.pattern === "mobitz_ii") {
        if (k % 5 !== 4) beat(p + 0.17, "wide");
      } else if (k % 2 === 0) beat(p + 0.18, "normal");
    }
  } else if (r.pattern === "flutter_fixed" || r.pattern === "flutter_variable") {
    let t = from - 3;
    let k = 0;
    while (t < to + 2) {
      t += r.pattern === "flutter_fixed" ? 0.4 : [0.4, 0.6, 0.8, 0.6][k++ % 4];
      beat(t);
    }
  } else if (r.pattern === "pac" || r.pattern === "pvc" || r.pattern === "sinus_pause") {
    let t = from - 2;
    let k = 0;
    const rr = 60 / r.baseBpm;
    while (t < to + 2) {
      if (r.pattern === "sinus_pause" && k > 0 && k % 9 === 0) { t += rr * 2.4; beat(t); }
      else if (r.pattern === "pac" && k > 0 && k % 6 === 0) { t += rr * 0.58; beat(t, "pac", 0.12); }
      else if (r.pattern === "pvc" && k > 0 && k % 6 === 0) { t += rr * 0.57; beat(t, "pvc"); }
      else { t += rr * (r.pattern === "pac" && k % 6 === 1 ? 1.15 : r.pattern === "pvc" && k % 6 === 1 ? 1.43 : 1); beat(t); }
      k++;
    }
  } else {
    let t = from - 2;
    let k = 0;
    const rr = 60 / r.baseBpm;
    while (t < to + 2) {
      let delta = rr * (0.988 + 0.024 * rand());
      if (r.pattern === "af") delta = clamp(rr * (0.60 + rand() * 1.12), 0.30, 1.5);
      if (r.pattern === "sinus_arrhythmia") delta = rr * (1 + 0.23 * Math.sin(k * 0.52));
      t += delta;
      const kind: Beat["kind"] = r.pattern === "wide_ventricular" ? "wide" : r.pattern === "paced_ventricular" ? "paced" : "normal";
      beat(t, kind);
      k++;
    }
  }
  return { beats, pTimes };
}
const gauss = (x: number, sigma: number) => Math.exp(-0.5 * (x / sigma) ** 2);

export function ecgAmplitude(t: number, trace: Trace, r: RhythmDefinition): number {
  if (r.pattern === "asystole") return 0.005 * Math.sin(2 * Math.PI * 0.4 * t);
  if (r.pattern === "vf") {
    const env = 0.64 + 0.28 * Math.sin(t * 1.9);
    return env * (0.37 * Math.sin(2 * Math.PI * 5.2 * t + 0.9 * Math.sin(t * 2)) + 0.24 * Math.sin(2 * Math.PI * 7.7 * t) + 0.13 * Math.sin(2 * Math.PI * 11.5 * t));
  }
  let y = 0.008 * Math.sin(2 * Math.PI * 0.31 * t);
  if (r.pattern === "af") y += 0.025 * Math.sin(2 * Math.PI * 7.5 * t) + 0.023 * Math.sin(2 * Math.PI * 10.3 * t + Math.sin(1.7 * t));
  if (r.pattern === "flutter_fixed" || r.pattern === "flutter_variable") {
    const a = (t * 5) % 1;
    const saw = 2 * ((a + 1) % 1) - 1;
    y += 0.087 * saw + 0.028 * Math.sin(2 * Math.PI * 5 * t);
  }
  for (const p of trace.pTimes) {
    const d = t - p.time;
    if (Math.abs(d) < 0.135) y += (p.inverted ? -0.18 : 0.135) * gauss(d, 0.033);
  }
  if (r.pattern === "junctional") {
    for (const b of trace.beats) {
      const d = t - b.time;
      if (d > 0.055 && d < 0.17) y -= 0.08 * gauss(d - 0.105, 0.026);
    }
  }
  for (const b of trace.beats) {
    const d = t - b.time;
    if (d < -0.13 || d > 0.57) continue;
    const wide = b.kind === "wide" || b.kind === "pvc" || b.kind === "paced";
    if (wide) {
      const polarity = b.kind === "pvc" ? -1 : 1;
      y += polarity * (0.76 * gauss(d + 0.01, 0.049) - 0.34 * gauss(d - 0.078, 0.036));
      y -= polarity * 0.17 * gauss(d - 0.3, 0.075);
      if (b.kind === "paced") y += 1.08 * gauss(d + 0.032, 0.006);
    } else {
      y -= 0.17 * gauss(d + 0.018, 0.009);
      y += 1.05 * gauss(d, 0.012);
      y -= 0.28 * gauss(d - 0.028, 0.011);
      y += (r.pattern === "svt" ? 0.12 : 0.24) * gauss(d - (r.pattern === "svt" ? 0.14 : 0.235), 0.064);
    }
  }
  return y;
}

/** Hypothetical pleth following an assumed pulse-bearing beat, 180 ms after QRS. */
export function pulseAmplitude(t: number, trace: Trace, r: RhythmDefinition): number {
  if (r.pulse !== "assumed") return 0;
  let y = 0;
  for (const b of trace.beats) {
    const d = t - b.time - 0.18;
    if (d < 0 || d > 0.82) continue;
    const magnitude = b.kind === "pvc" ? 0.38 : 1;
    y += magnitude * Math.max(0, 1.3 * (1 - Math.exp(-d * 32)) * Math.exp(-d * 5.5) - 0.11 * gauss(d - 0.32, 0.035));
  }
  return Math.min(1.15, y);
}

export function approximateEcgRate(beats: readonly Beat[], at: number, fallback: number): number {
  const previous = beats.filter((b) => b.time <= at && b.time >= at - 8).map((b) => b.time);
  if (previous.length < 2) return fallback;
  const intervals = previous.slice(1).map((beat, i) => beat - previous[i]);
  return Math.round(60 / (intervals.reduce((sum, n) => sum + n, 0) / intervals.length));
}
