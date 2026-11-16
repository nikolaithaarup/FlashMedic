// Focused proxy smoke tests; all upstream responses are mocked.
import { strict as assert } from "node:assert";
import { OPTIONS, POST } from "../api/synapse-email";

const origin = "https://flashmedic.synapsestudio.dk";
const endpoint = origin + "/api/synapse-email";
const originalFetch = globalThis.fetch;
let calls = 0;
let nextStatus = 200;
let nextBody: object = { ok: true, challengeToken: "12345678.test-token" };

function request(body: object, reqOrigin = origin): Request {
  return new Request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": reqOrigin,
    },
    body: JSON.stringify(body),
  });
}

async function main() {
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.equal(String(input), "https://portal.synapsestudio.dk/api/auth/flashmedic");
    assert.equal((init?.headers as Record<string, string>)?.["Content-Type"], "application/json");
    assert.equal((init?.headers as Record<string, string>)?.Origin, undefined);
    return Response.json(nextBody, { status: nextStatus });
  };
  const valid = await POST(request({ operation: "request", email: "learner@example.com" }));
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).challengeToken, "12345678.test-token");
  assert.equal(valid.headers.get("Cache-Control"), "no-store");
  assert.equal(calls, 1);

  const foreign = await POST(request({ operation: "request", email: "learner@example.com" }, "https://evil.example"));
  assert.equal(foreign.status, 403);
  assert.equal(calls, 1);

  const preflight = await OPTIONS(new Request(endpoint, {
    method: "OPTIONS", headers: { "Origin": "https://evil.example" },
  }));
  assert.equal(preflight.status, 403);

  const invalid = await POST(request({ operation: "invalid", email: "learner@example.com" }));
  assert.equal(invalid.status, 400);
  assert.equal(calls, 1);

  nextStatus = 404;
  nextBody = { error: "OTP_DISABLED" };
  const disabled = await POST(request({ operation: "request", email: "learner@example.com" }));
  assert.equal(disabled.status, 404);
  assert.equal((await disabled.json()).error, "OTP_DISABLED");

  globalThis.fetch = async () => { throw new Error("simulated network error"); };
  const unavailable = await POST(request({ operation: "request", email: "learner@example.com" }));
  assert.equal(unavailable.status, 502);
  assert.equal((await unavailable.json()).error, "UPSTREAM_UNAVAILABLE");
  console.log("Synapse email proxy: origin, payload, success, disabled and outage tests passed.");
}
void main().finally(() => { globalThis.fetch = originalFetch; });
