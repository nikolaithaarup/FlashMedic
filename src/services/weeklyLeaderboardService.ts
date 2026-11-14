import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export type LeaderboardScope = "week" | "all-time";
export type LeaderboardRow = {
  uid: string;
  nickname: string;
  totalPoints: number;
  rankKey: string;
  rank: number;
};

type LeaderboardState = {
  top: LeaderboardRow[];
  current: LeaderboardRow | null;
  loading: boolean;
  error: boolean;
};

function toRow(
  uid: string,
  data: Record<string, unknown>,
  rank = 0,
): LeaderboardRow {
  return {
    uid,
    nickname: typeof data.nickname === "string" ? data.nickname : "Spiller",
    totalPoints: Number(data.totalPoints ?? 0),
    rankKey: typeof data.rankKey === "string" ? data.rankKey : "",
    rank,
  };
}

export function useWeeklyLeaderboard(
  scope: LeaderboardScope,
  weekKey: string | null,
): LeaderboardState {
  const [uid, setUid] = useState<string | null>(() => {
    const user = auth.currentUser;
    return user && !user.isAnonymous ? user.uid : null;
  });
  const [state, setState] = useState<LeaderboardState>({
    top: [],
    current: null,
    loading: true,
    error: false,
  });

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setUid(user && !user.isAnonymous ? user.uid : null);
  }), []);

  useEffect(() => {
    if (scope === "week" && !weekKey) return;
    const users = scope === "week"
      ? collection(db, "weekly_leaderboards", weekKey!, "users")
      : collection(db, "weekly_all_time");
    const meta = scope === "week"
      ? doc(db, "weekly_leaderboards", weekKey!, "meta", "state")
      : doc(db, "weekly_all_time_meta", "state");
    let currentRow: LeaderboardRow | null = null;
    let cancelled = false;

    const updateRank = async () => {
      if (!currentRow?.rankKey) return;
      try {
        const count = await getCountFromServer(
          query(users, where("rankKey", "<", currentRow.rankKey)),
        );
        if (!cancelled && currentRow) {
          currentRow = { ...currentRow, rank: count.data().count + 1 };
          setState((previous) => ({ ...previous, current: currentRow }));
        }
      } catch {
        // Keep the last visible ranking; the next snapshot retries.
      }
    };

    setState((previous) => ({ ...previous, loading: true, error: false }));
    const unsubscribeTop = onSnapshot(
      query(users, orderBy("rankKey"), limit(10)),
      (snapshot) => setState((previous) => ({
        ...previous,
        top: snapshot.docs.map((item, index) =>
          toRow(item.id, item.data(), index + 1),
        ),
        loading: false,
        error: false,
      })),
      () => setState((previous) => ({ ...previous, loading: false, error: true })),
    );
    const unsubscribeCurrent = uid
      ? onSnapshot(doc(users, uid), (snapshot) => {
          currentRow = snapshot.exists()
            ? toRow(snapshot.id, snapshot.data())
            : null;
          setState((previous) => ({ ...previous, current: currentRow }));
          void updateRank();
        })
      : () => undefined;
    const unsubscribeMeta = onSnapshot(meta, () => void updateRank());

    return () => {
      cancelled = true;
      unsubscribeTop();
      unsubscribeCurrent();
      unsubscribeMeta();
    };
  }, [scope, uid, weekKey]);

  return state;
}
