import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { WeeklyGame } from "../types/Weekly";

function toDate(v: any): Date {
  // Firestore Timestamp has toDate()
  return v?.toDate ? v.toDate() : new Date(v);
}

export async function fetchWeeklyGames(params: { year: number; isoWeek: number }) {
  const q = query(
    collection(db, "weeklyGames"),
    where("year", "==", params.year),
    where("isoWeek", "==", params.isoWeek),
    orderBy("kind"),
    orderBy("slot"),
  );

  const snap = await getDocs(q);

  const games: WeeklyGame[] = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      ...data,
      weekStart: toDate(data.weekStart),
    } as WeeklyGame;
  });

  return games;
}
