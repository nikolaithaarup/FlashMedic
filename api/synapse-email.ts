// Same-origin transport for the SynapsePortal FlashMedic OTP exchange.
// All OTP issuance, delivery, validation, rate limits, and token minting stay in Portal.
const UPSTREAM = "https://portal.synapsestudio.dk/api/auth/flashmedic";
const BODY_LIMIT = 8192;

function reply(body: object, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function validOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin === null || origin === new URL(request.url).origin;
}

export async function OPTIONS(request: Request): Promise<Response> {
  if (!validOrigin(request)) return reply({ error: "INVALID_ORIGIN" }, 403);
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "Allow": "POST, OPTIONS",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!validOrigin(request)) return reply({ error: "INVALID_ORIGIN" }, 403);
  const type = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (type !== "application/json") return reply({ error: "INVALID_CONTENT_TYPE" }, 415);
  if (Number(request.headers.get("content-length") ?? "0") > BODY_LIMIT) {
    return reply({ error: "INVALID_REQUEST" }, 413);
  }

  let raw: string;
  let data: Record<string, unknown>;
  try {
    raw = await request.text();
    if (raw.length > BODY_LIMIT) return reply({ error: "INVALID_REQUEST" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return reply({ error: "INVALID_REQUEST" }, 400);
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return reply({ error: "INVALID_REQUEST" }, 400);
  }

  const keys = Object.keys(data);
  if (
    (data.operation === "request" &&
      (keys.length !== 2 || typeof data.email !== "string" || data.email.length > 254)) ||
    (data.operation === "verify" &&
      (keys.length !== 3 ||
        typeof data.challengeToken !== "string" ||
        data.challengeToken.length > 512 ||
        typeof data.code !== "string" ||
        !/^\d{6}$/.test(data.code))) ||
    (data.operation !== "request" && data.operation !== "verify")
  ) {
    return reply({ error: "INVALID_REQUEST" }, 400);
  }

  try {
    // Do not forward browser cookies or Origin to Portal. Browser-origin
    // restrictions are enforced above; Portal permits server-to-server calls.
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    let result: unknown;
    try {
      result = await upstream.json();
    } catch {
      return reply({ error: "UPSTREAM_INVALID_RESPONSE" }, 502);
    }
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      return reply({ error: "UPSTREAM_INVALID_RESPONSE" }, 502);
    }
    // Same status and safe JSON contract, without exposing Portal cookies.
    return reply(result as Record<string, unknown>, upstream.status);
  } catch {
    return reply({ error: "UPSTREAM_UNAVAILABLE" }, 502);
  }
}
