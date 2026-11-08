import { RHYTHMS, availableRhythms, createTimeline, approximateEcgRate, ecgAmplitude, pulseAmplitude } from "../src/features/ekgTraining/game/rhythmModel";
const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
assert(RHYTHMS.length === 23, "Expected 23 distinct rhythms");
assert(new Set(RHYTHMS.map((r) => r.id)).size === RHYTHMS.length, "Duplicate rhythm id");
assert(availableRhythms("basis").length >= 9, "Too few basis rhythms");
for (const r of RHYTHMS) {
  const trace = createTimeline(r, 12345, -12, 50);
  const times = trace.beats.map((b) => b.time);
  assert(times.every((n, i) => Number.isFinite(n) && (i === 0 || n > times[i - 1])), `${r.id}: beats not ordered`);
  assert(trace.pTimes.every((p) => Number.isFinite(p.time)), `${r.id}: invalid atrial time`);
  if (r.pattern === "asystole" || r.pattern === "vf") assert(times.length === 0, `${r.id}: must not have QRS`);
  else assert(times.length > 8, `${r.id}: too few QRS`);
  for (let t = 0; t < 13; t += 0.15) {
    assert(Number.isFinite(ecgAmplitude(t, trace, r)), `${r.id}: non-finite ECG`);
    assert(Number.isFinite(pulseAmplitude(t, trace, r)), `${r.id}: non-finite pleth`);
  }
  if (r.pulse !== "assumed") assert(pulseAmplitude(trace.beats[0]?.time + 0.3 || 0, trace, r) === 0, `${r.id}: false pulse assumption`);
  if (r.pulse === "assumed") assert(pulseAmplitude(trace.beats[1]?.time + 0.3 || 0, trace, r) > 0, `${r.id}: expected hypothetical pleth`);
  if (r.baseBpm > 0) {
    const bpm = approximateEcgRate(trace.beats, 14, r.baseBpm);
    assert(bpm > 18 && bpm < 220, `${r.id}: nonsensical electrical rate`);
  }
}
const af = createTimeline(RHYTHMS.find((r) => r.id === "af")!, 99, -10, 60).beats.map((b) => b.time);
const rr = af.slice(1).map((t, i) => t - af[i]);
assert(Math.max(...rr) - Math.min(...rr) > 0.14, "AF must have irregular RR");
for (const id of ["mobitz_i", "mobitz_ii", "av_two_one"]) {
  const trace = createTimeline(RHYTHMS.find((r) => r.id === id)!, 88, -10, 35);
  assert(trace.pTimes.length > trace.beats.length, `${id}: missing blocked P waves`);
}
const wenckebach = createTimeline(RHYTHMS.find((r) => r.id === "mobitz_i")!, 13, -10, 35);
const prOffsets: number[] = [];
for (let i = 0; i < 8; i++) {
  const p = wenckebach.pTimes[i].time;
  const conducted = wenckebach.beats.filter((b) => b.time > p + 0.1 && b.time < p + 0.4);
  if (i % 4 === 3) assert(conducted.length === 0, "Wenckebach dropped P must lack QRS");
  else {
    assert(conducted.length === 1, "Wenckebach P must conduct");
    if (i < 3) prOffsets.push(conducted[0].time - p);
  }
}
assert(prOffsets[0] < prOffsets[1] && prOffsets[1] < prOffsets[2], "Wenckebach PR must lengthen");
const mobitz2 = createTimeline(RHYTHMS.find((r) => r.id === "mobitz_ii")!, 13, -10, 35);
const prII: number[] = [];
for (let i = 0; i < 10; i++) {
  const p = mobitz2.pTimes[i].time;
  const conducted = mobitz2.beats.filter((b) => b.time > p + 0.1 && b.time < p + 0.4);
  if (i % 5 === 4) assert(conducted.length === 0, "Mobitz II dropped P must lack QRS");
  else { assert(conducted.length === 1, "Mobitz II P must conduct"); prII.push(conducted[0].time - p); }
}
assert(Math.max(...prII) - Math.min(...prII) < 0.0001, "Mobitz II PR must remain fixed");
const av3 = createTimeline(RHYTHMS.find((r) => r.id === "av_complete")!, 89, -10, 35);
assert(av3.pTimes.length > av3.beats.length, "complete block needs independent atrial clock");
const paced = createTimeline(RHYTHMS.find((r) => r.id === "paced_ventricular")!, 56, -10, 35);
assert(paced.beats.every((b) => b.kind === "paced"), "paced beats missing");
console.log(`EKG game model PASS: ${RHYTHMS.length} schematic rhythms; AV-block, AF, pulse checks passed`);
