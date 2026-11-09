const PRECACHE_NAME = "__PRECACHE_NAME__";
const RUNTIME_NAME = "__RUNTIME_NAME__";
// eslint-disable-next-line no-undef
const PRECACHE_URLS = __PRECACHE_URLS__;
// eslint-disable-next-line no-undef
const OPTIONAL_URLS = __OPTIONAL_URLS__;
const MAX_RUNTIME_ENTRIES = 80;
const NAVIGATION_TIMEOUT_MS = 3500;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PRECACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith("flashmedic-") && name !== PRECACHE_NAME && name !== RUNTIME_NAME)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  );
});

let optionalWarmup = null;
async function warmOptionalCache() {
  const cache = await caches.open(PRECACHE_NAME);
  for (const url of OPTIONAL_URLS) {
    try {
      if (!(await cache.match(url))) await cache.add(url);
    } catch {
      // An optional image must never prevent application startup or updates.
    }
  }
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "WARM_OFFLINE") {
    if (!optionalWarmup) {
      optionalWarmup = warmOptionalCache().finally(() => { optionalWarmup = null; });
    }
    event.waitUntil(optionalWarmup);
  }
});

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_NAME);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_RUNTIME_ENTRIES)).map((key) => cache.delete(key)));
}

function storeRuntime(request, response) {
  const copy = response.clone();
  return caches.open(RUNTIME_NAME)
    .then((cache) => cache.put(request, copy))
    .then(() => trimRuntimeCache())
    .catch(() => undefined);
}

async function networkFirstNavigation(request, event) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), NAVIGATION_TIMEOUT_MS);
  try {
    const response = await fetch(request, { signal: abort.signal });
    if (response.ok) event.waitUntil(storeRuntime(request, response));
    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match("/index.html")) ||
      (await caches.match("/offline.html")) ||
      Response.error()
    );
  } finally {
    clearTimeout(timer);
  }
}

async function cacheFirst(request, event) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    event.waitUntil(storeRuntime(request, response));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request, event));
    return;
  }
  event.respondWith(cacheFirst(request, event));
});
