// src/services/weeklyGames.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type WeeklyKind = "mcq" | "match" | "word";

export async function getWeeklyGame(params: {
  year: number;
  isoWeek: number;
  kind: WeeklyKind;
  slot: number;
}) {
  const weekStr = String(params.isoWeek).padStart(2, "0");
  const id = `${params.year}_W${weekStr}_${params.kind}_${params.slot}`;

  const ref = doc(db, "weeklyGames", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}
