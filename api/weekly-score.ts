import { getAdminServices } from "../src/server/firebaseAdmin";
import {
  getRawScoreLimit,
  normalizeWeeklyScore,
  sanitizeLeaderboardName,
} from "../src/services/weeklyCompetition";
import {
  findExistingWeeklyScore,
  recordWeeklyScore,
} from "../src/server/weeklyScoreStore";
import type { WeeklyGameKind } from "../src/services/weeklyKeyResolution";
import { getCurrentIsoWeekInfo } from "../src/utils/week";

const PACK_COLLECTION: Record<WeeklyGameKind, string> = {
  mcq: "weekly_mcq_packs",
  match: "weekly_match_packs",
  word: "weekly_word_packs",
};

function response(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin == null || origin === new URL(request.url).origin;
}

function parseGame(value: unknown): WeeklyGameKind | null {
  return value === "mcq" || value === "match" || value === "word" ? value : null;
}

async function loadPack(
  game: WeeklyGameKind,
  weekKey: string,
  currentWeekKey: string,
) {
  const { db } = getAdminServices();
  const index = await db.doc("weekly_index/current").get();
  const pointer = index.data() ?? {};
  const candidates = [
    weekKey,
    ...(weekKey === currentWeekKey
      ? [pointer.overrideWeekKey, pointer.weekKey, pointer.weekId]
      : []),
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  for (const key of [...new Set(candidates)]) {
    const snapshot = await db.doc(`${PACK_COLLECTION[game]}/${key}`).get();
    if (snapshot.exists) return snapshot.data() as Record<string, unknown>;
  }
  throw new Error("weekly_content_missing");
}

export async function OPTIONS(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return new Response(null, { status: 403 });
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: {
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      Vary: "Origin",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return response({ error: "origin_not_allowed" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 8_192) {
    return response({ error: "request_too_large" }, 413);
  }

  try {
    const authorization = request.headers.get("authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) return response({ error: "unauthenticated" }, 401);
    const { auth, db } = getAdminServices();
    let identity;
    try {
      identity = await auth.verifyIdToken(authorization.slice(7));
    } catch {
      return response({ error: "unauthenticated" }, 401);
    }
    if (
      identity.firebase?.sign_in_provider === "anonymous" ||
      identity.synapse_email_verified !== true ||
      identity.synapse_portal_user_id !== identity.uid
    ) {
      return response({ error: "trusted_portal_account_required" }, 403);
    }

    const body = await request.json() as Record<string, unknown>;
    const game = parseGame(body.game);
    const rawScore = body.score;
    const submissionId = typeof body.submissionId === "string" ? body.submissionId.trim() : "";
    const currentWeekKey = getCurrentIsoWeekInfo().weekKey;
    const acceptedWeekKeys = new Set(
      Array.from({ length: 4 }, (_, offset) =>
        getCurrentIsoWeekInfo(new Date(Date.now() - offset * 7 * 86_400_000)).weekKey,
      ),
    );
    const canonicalWeekKey = typeof body.weekKey === "string" ? body.weekKey : "";
    if (!game || !acceptedWeekKeys.has(canonicalWeekKey) || !Number.isSafeInteger(rawScore)) {
      return response({ error: "invalid_submission" }, 400);
    }
    if (!submissionId || submissionId.length > 200) {
      return response({ error: "invalid_submission_id" }, 400);
    }

    const existing = await findExistingWeeklyScore(db, {
      uid: identity.uid,
      weekKey: canonicalWeekKey,
      game,
      submissionId,
      rawScore: rawScore as number,
    });
    if (existing) return response({ status: "accepted", casualScore: true, ...existing });

    const pack = await loadPack(game, canonicalWeekKey, currentWeekKey);
    const rawLimit = getRawScoreLimit(game, pack);
    const points = normalizeWeeklyScore(rawScore as number, rawLimit);
    const nickname = sanitizeLeaderboardName(body.nickname, identity.uid);

    const result = await recordWeeklyScore(db, {
      uid: identity.uid,
      nickname,
      weekKey: canonicalWeekKey,
      game,
      submissionId,
      rawScore: rawScore as number,
      rawLimit,
      points,
    });

    return response({ status: "accepted", casualScore: true, ...result });
  } catch (error) {
    const code = error instanceof Error ? error.message : "internal_error";
    if (code === "duplicate_submission" || code === "duplicate_game") {
      return response({ error: "already_submitted" }, 409);
    }
    if (code === "invalid_score" || code === "score_out_of_range") {
      return response({ error: code }, 400);
    }
    if (code === "weekly_content_missing") return response({ error: code }, 404);
    console.error("Weekly score submission failed", { code });
    return response({ error: "internal_error" }, 500);
  }
}
